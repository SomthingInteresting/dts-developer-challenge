// Matches the TaskStatus enum in the backend (backend/models/task.py)
export enum TaskStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
}

// Matches the Task schema returned by the API (backend/schemas/task.py -> Task)
export interface Task {
  id: number;
  title: string;
  description?: string | null; // Optional in backend, allow null from DB
  due_date: string; // Represent datetimes as strings in TS/JSON
  status: TaskStatus;
}

// Matches the TaskCreate schema used for creating tasks (backend/schemas/task.py -> TaskCreate)
export interface TaskCreate {
  title: string;
  description?: string | null;
  due_date: string; // Use string for input, backend will parse
  status?: TaskStatus; // Optional, defaults to PENDING in backend
}

// Matches the TaskUpdateStatus schema (backend/schemas/task.py -> TaskUpdateStatus)
export interface TaskUpdateStatus {
  status: TaskStatus;
}
