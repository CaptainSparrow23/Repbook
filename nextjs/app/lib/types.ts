export type Workout = {
  id: number;
  name: string;
  description: string | null;
};

export type Routine = {
  id: number;
  name: string;
  description: string | null;
  workouts: Workout[];
};

export type ActionState = {
  error?: string;
  success?: string;
};
