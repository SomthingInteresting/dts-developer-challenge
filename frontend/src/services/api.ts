import { Task, TaskCreate, TaskUpdateStatus } from "../types/task";

// Determine the base URL for the API.
// In development, it's likely http://localhost:8000 (where the backend runs).
// For production builds, it might be different (e.g., relative path or env variable).
// Vite provides import.meta.env.VITE_API_BASE_URL for environment variables.
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";

// Helper function for handling API responses
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ detail: response.statusText }));
    // Use the detail message from the backend error if available
    throw new Error(
      `API Error (${response.status}): ${errorData.detail || "Unknown error"}`
    );
  }
  return response.json() as Promise<T>;
}

// --- Task API Functions ---

export async function getTasks(): Promise<Task[]> {
  const response = await fetch(`${API_BASE_URL}/tasks`);
  return handleResponse<Task[]>(response);
}

export async function getTask(taskId: number): Promise<Task> {
  const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`);
  return handleResponse<Task>(response);
}

export async function createTask(taskData: TaskCreate): Promise<Task> {
  const response = await fetch(`${API_BASE_URL}/tasks`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(taskData),
  });
  return handleResponse<Task>(response);
}

export async function updateTaskStatus(
  taskId: number,
  statusData: TaskUpdateStatus
): Promise<Task> {
  const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(statusData),
  });
  return handleResponse<Task>(response);
}

export async function deleteTask(taskId: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
    method: "DELETE",
  });
  // DELETE might return 204 No Content or the deleted item.
  // We don't strictly need to parse the body if we don't use the result.
  if (!response.ok) {
    const errorData = await response
      .json()
      .catch(() => ({ detail: response.statusText }));
    throw new Error(
      `API Error (${response.status}): ${errorData.detail || "Unknown error"}`
    );
  }
  // No return needed for void promise
}

// TODO: Add functions for updateTask if needed (PUT /tasks/{task_id})
