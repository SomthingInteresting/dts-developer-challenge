import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getTasks,
  updateTaskStatus, // Re-add import for update functionality
  deleteTask,
  createTask,
} from "./services/api"; // Import the API functions
import { TaskStatus, TaskCreate, Task } from "./types/task"; // Import TaskStatus enum and TaskCreate type
import TaskList from "./components/TaskList"; // Import TaskList component
import AddTaskForm from "./components/AddTaskForm"; // Import AddTaskForm component

// Import GOV.UK React components and GlobalStyle
import {
  Page,
  Main,
  H1,
  H2, // Added H2 back
  GridRow,
  GridCol,
  Paragraph,
  Button,
  Tag,
} from "govuk-react";
import GlobalStyle from "./styles/GlobalStyle";

// Define Status Filters including "ALL"
const ALL_STATUSES = "ALL";
type StatusFilter = TaskStatus | typeof ALL_STATUSES;

function App() {
  const queryClient = useQueryClient();

  // State for filter and form visibility
  const [selectedStatusFilter, setSelectedStatusFilter] =
    useState<StatusFilter>(ALL_STATUSES);
  const [isAddTaskFormVisible, setIsAddTaskFormVisible] = useState(false);

  // Query for fetching tasks
  const {
    isLoading: isLoadingTasks,
    isError: isTasksError,
    data: tasks = [], // Default to empty array
    error: tasksError,
  } = useQuery<Task[], Error>({
    queryKey: ["tasks"], // Unique key for this query
    queryFn: getTasks, // Function that fetches the data
  });

  // Filter tasks based on selectedStatusFilter
  const filteredTasks = useMemo(() => {
    if (selectedStatusFilter === ALL_STATUSES) {
      return tasks;
    }
    return tasks.filter((task) => task.status === selectedStatusFilter);
  }, [tasks, selectedStatusFilter]);

  // *** Add Mutation for updating task status ***
  const updateStatusMutation = useMutation<
    Task,
    Error,
    { taskId: number; statusData: { status: TaskStatus } }
  >({
    mutationFn: (variables) =>
      updateTaskStatus(variables.taskId, variables.statusData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: (updateError) => {
      console.error("Error updating task status:", updateError);
    },
  });
  // ******************************************

  // Mutation for deleting a task
  const deleteMutation = useMutation<void, Error, number>({
    mutationFn: (taskId: number) => deleteTask(taskId),
    onSuccess: () => {
      // Invalidate and refetch the tasks query after a successful delete
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    // Optional: Add onError handling
    onError: (deleteError) => {
      console.error("Error deleting task:", deleteError);
      // TODO: Show user feedback
    },
  });

  // Mutation for creating a task
  const createTaskMutation = useMutation<Task, Error, TaskCreate>({
    mutationFn: (newTask: TaskCreate) => createTask(newTask),
    onSuccess: () => {
      // Invalidate and refetch the tasks query after successful creation
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setIsAddTaskFormVisible(false); // Hide form on success
    },
    onError: (createError) => {
      console.error("Error creating task:", createError);
      // TODO: Show user feedback
    },
  });

  // Handlers
  const handleDelete = (taskId: number) => {
    // Optional: Add confirmation dialog here
    if (window.confirm(`Are you sure you want to delete task ${taskId}?`)) {
      deleteMutation.mutate(taskId);
    }
  };

  // *** Add handler for updating status ***
  const handleUpdateStatus = (taskId: number, status: TaskStatus) => {
    updateStatusMutation.mutate({ taskId, statusData: { status } });
  };
  // *************************************

  const handleCreateTask = (taskData: TaskCreate) => {
    createTaskMutation.mutate(taskData);
  };

  return (
    <>
      <GlobalStyle />
      <Page>
        <Main>
          <GridRow>
            <GridCol>
              <H1 mb={6}>Task Management</H1> {/* Simplified title */}
            </GridCol>
          </GridRow>
          {/* --- Filters --- */}
          <GridRow mb={4}>
            <GridCol>
              <span style={{ marginRight: "15px", fontWeight: "bold" }}>
                Filter by status:
              </span>
              {[ALL_STATUSES, ...Object.values(TaskStatus)].map((status) => (
                <Tag
                  key={status}
                  style={{
                    marginRight: "10px",
                    cursor: "pointer",
                    border:
                      selectedStatusFilter === status
                        ? "2px solid #005ea5"
                        : "1px solid #b1b4b6",
                    padding: "5px 10px",
                  }}
                  onClick={() =>
                    setSelectedStatusFilter(status as StatusFilter)
                  }
                >
                  {status.replace("_", " ").charAt(0).toUpperCase() +
                    status.replace("_", " ").slice(1).toLowerCase()}
                </Tag>
              ))}
            </GridCol>
          </GridRow>
          {/* --- Add Task Section (Button & Form) --- */}
          <GridRow mb={isAddTaskFormVisible ? 2 : 4}>
            {" "}
            {/* Adjust spacing */}
            <GridCol>
              <Button
                onClick={() => setIsAddTaskFormVisible(!isAddTaskFormVisible)}
              >
                {isAddTaskFormVisible ? "Cancel Add Task" : "Add New Task"}
              </Button>
            </GridCol>
          </GridRow>
          {isAddTaskFormVisible && (
            <GridRow mb={6}>
              <GridCol>
                <H2>Add New Task</H2> {/* Heading for form */}
                <AddTaskForm
                  onCreateTask={handleCreateTask}
                  isCreating={createTaskMutation.isPending}
                />
                {createTaskMutation.isError && (
                  <Paragraph style={{ color: "red" }}>
                    {`Error creating task: ${createTaskMutation.error.message}`}
                  </Paragraph>
                )}
              </GridCol>
            </GridRow>
          )}
          {/* Divider */}
          {!isAddTaskFormVisible && (
            <hr style={{ borderColor: "#b1b4b6", margin: "20px 0" }} />
          )}
          {/* --- Task List --- */}
          <H2>Tasks</H2> {/* Heading for list */}
          <GridRow>
            <GridCol>
              {isLoadingTasks && <Paragraph>Loading tasks...</Paragraph>}
              {/* Combined error messages */}
              {(isTasksError ||
                deleteMutation.isError ||
                updateStatusMutation.isError) && (
                <Paragraph style={{ color: "red" }}>
                  {isTasksError &&
                    `Error fetching tasks: ${
                      tasksError?.message || "Unknown error"
                    }`}
                  {deleteMutation.isError &&
                    `Error deleting task: ${deleteMutation.error.message}`}
                  {updateStatusMutation.isError &&
                    `Error updating status: ${updateStatusMutation.error.message}`}
                </Paragraph>
              )}

              {!isLoadingTasks && tasks.length > 0 && (
                <TaskList
                  tasks={filteredTasks}
                  onDelete={handleDelete}
                  onUpdateStatus={handleUpdateStatus} // Pass update handler
                />
              )}
              {!isLoadingTasks &&
                tasks.length === 0 &&
                selectedStatusFilter === ALL_STATUSES && (
                  <Paragraph>No tasks exist yet. Add one above!</Paragraph>
                )}
              {!isLoadingTasks &&
                filteredTasks.length === 0 &&
                selectedStatusFilter !== ALL_STATUSES && (
                  <Paragraph>
                    No tasks found with status:{" "}
                    {selectedStatusFilter.replace("_", " ").toLowerCase()}
                  </Paragraph>
                )}

              {(createTaskMutation.isPending ||
                deleteMutation.isPending ||
                updateStatusMutation.isPending) && (
                <Paragraph>Updating...</Paragraph>
              )}
            </GridCol>
          </GridRow>
        </Main>
      </Page>
    </>
  );
}

export default App;
