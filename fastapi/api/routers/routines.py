from typing import Optional

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import joinedload

from api.deps import db_dependency, user_dependency
from api.models import Routine, Workout

router = APIRouter(prefix="/routines", tags=["routines"])


class RoutineBase(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    description: Optional[str] = Field(default=None, max_length=500)


class RoutineCreate(RoutineBase):
    workouts: list[int] = Field(default_factory=list)


class RoutineUpdate(RoutineCreate):
    pass


class WorkoutResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None

    model_config = {"from_attributes": True}


class RoutineResponse(RoutineBase):
    id: int
    workouts: list[WorkoutResponse]

    model_config = {"from_attributes": True}


class MessageResponse(BaseModel):
    message: str


def find_owned_routine(routine_id: int, user_id: int, db: db_dependency):
    routine = db.query(Routine).options(
        joinedload(Routine.workouts)
    ).filter(
        Routine.id == routine_id,
        Routine.user_id == user_id,
    ).first()

    if routine is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Routine not found",
        )

    return routine


def get_owned_workouts(workout_ids: list[int], user_id: int, db: db_dependency):
    unique_ids = list(dict.fromkeys(workout_ids))
    if not unique_ids:
        return []

    workouts = db.query(Workout).filter(
        Workout.id.in_(unique_ids),
        Workout.user_id == user_id,
    ).all()

    if len(workouts) != len(unique_ids):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="One or more workouts are invalid",
        )

    workouts_by_id = {workout.id: workout for workout in workouts}
    return [workouts_by_id[workout_id] for workout_id in unique_ids]


@router.get("/", response_model=list[RoutineResponse])
def get_routines(db: db_dependency, user: user_dependency):
    return db.query(Routine).options(
        joinedload(Routine.workouts)
    ).filter(
        Routine.user_id == user["id"]
    ).order_by(Routine.id.desc()).all()


@router.get("/{routine_id}", response_model=RoutineResponse)
def get_routine(
    routine_id: int,
    db: db_dependency,
    user: user_dependency,
):
    return find_owned_routine(routine_id, user["id"], db)


@router.post(
    "/",
    status_code=status.HTTP_201_CREATED,
    response_model=RoutineResponse,
)
def create_routine(
    routine: RoutineCreate,
    db: db_dependency,
    user: user_dependency,
):
    db_routine = Routine(
        **routine.model_dump(exclude={"workouts"}),
        user_id=user["id"],
    )
    db_routine.workouts = get_owned_workouts(
        routine.workouts,
        user["id"],
        db,
    )
    db.add(db_routine)
    db.commit()
    db.refresh(db_routine)
    return db_routine


@router.put("/{routine_id}", response_model=RoutineResponse)
def update_routine(
    routine_id: int,
    update: RoutineUpdate,
    db: db_dependency,
    user: user_dependency,
):
    routine = find_owned_routine(routine_id, user["id"], db)
    routine.name = update.name
    routine.description = update.description
    routine.workouts = get_owned_workouts(
        update.workouts,
        user["id"],
        db,
    )
    db.commit()
    db.refresh(routine)
    return routine


@router.delete("/{routine_id}", response_model=MessageResponse)
def delete_routine(
    routine_id: int,
    db: db_dependency,
    user: user_dependency,
):
    routine = find_owned_routine(routine_id, user["id"], db)
    db.delete(routine)
    db.commit()
    return {"message": "Routine deleted successfully"}
