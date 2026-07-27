from typing import Optional

from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, Field

from api.deps import db_dependency, user_dependency
from api.models import Workout

router = APIRouter(prefix="/workouts", tags=["workouts"])


class WorkoutBase(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    description: Optional[str] = Field(default=None, max_length=500)


class WorkoutCreate(WorkoutBase):
    pass


class WorkoutUpdate(WorkoutBase):
    pass


class WorkoutResponse(WorkoutBase):
    id: int

    model_config = {"from_attributes": True}


class MessageResponse(BaseModel):
    message: str


def find_owned_workout(workout_id: int, user_id: int, db: db_dependency):
    workout = db.query(Workout).filter(
        Workout.id == workout_id,
        Workout.user_id == user_id,
    ).first()

    if workout is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Workout not found",
        )

    return workout


@router.get("/", response_model=list[WorkoutResponse])
def get_workouts(db: db_dependency, user: user_dependency):
    return db.query(Workout).filter(
        Workout.user_id == user["id"]
    ).order_by(Workout.id.desc()).all()


@router.get("/{workout_id}", response_model=WorkoutResponse)
def get_workout(workout_id: int, db: db_dependency, user: user_dependency):
    return find_owned_workout(workout_id, user["id"], db)


@router.post(
    "/",
    status_code=status.HTTP_201_CREATED,
    response_model=WorkoutResponse,
)
def create_workout(
    workout: WorkoutCreate,
    db: db_dependency,
    user: user_dependency,
):
    new_workout = Workout(
        **workout.model_dump(),
        user_id=user["id"],
    )
    db.add(new_workout)
    db.commit()
    db.refresh(new_workout)
    return new_workout


@router.put("/{workout_id}", response_model=WorkoutResponse)
def update_workout(
    workout_id: int,
    update: WorkoutUpdate,
    db: db_dependency,
    user: user_dependency,
):
    workout = find_owned_workout(workout_id, user["id"], db)
    workout.name = update.name
    workout.description = update.description
    db.commit()
    db.refresh(workout)
    return workout


@router.delete("/{workout_id}", response_model=MessageResponse)
def delete_workout(
    workout_id: int,
    db: db_dependency,
    user: user_dependency,
):
    workout = find_owned_workout(workout_id, user["id"], db)
    db.delete(workout)
    db.commit()
    return {"message": "Workout deleted successfully"}
