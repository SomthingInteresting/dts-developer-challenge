import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getTasks,
  updateTaskStatus,
  deleteTask,
  createTask,
} from "./services/api"; // Import the API functions
import { TaskStatus, TaskCreate } from "./types/task"; // Import TaskStatus enum and TaskCreate type
import TaskList from "./components/TaskList"; // Import TaskList component
import AddTaskForm from "./components/AddTaskForm"; // Import AddTaskForm component

// Import GOV.UK React components and GlobalStyle
import { Page, Main, H1, H2, GridRow, GridCol, Paragraph } from "govuk-react";
import GlobalStyle from "./styles/GlobalStyle";

function App() {
  // Access the client
  const queryClient = useQueryClient();

  // Query for fetching tasks
  const {
    isLoading,
    isError,
    data: tasks,
    error,
  } = useQuery({
    queryKey: ["tasks"], // Unique key for this query
    queryFn: getTasks, // Function that fetches the data
  });

  // Mutation for updating task status
  const updateStatusMutation = useMutation({
    mutationFn: (variables: {
      taskId: number;
      statusData: { status: TaskStatus };
    }) => updateTaskStatus(variables.taskId, variables.statusData),
    onSuccess: () => {
      // Invalidate and refetch the tasks query after a successful update
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    // Optional: Add onError handling
    onError: (updateError) => {
      console.error("Error updating task status:", updateError);
      // TODO: Show user feedback (e.g., toast notification)
    },
  });

  // Mutation for deleting a task
  const deleteMutation = useMutation({
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

  // *** Add Mutation for creating a task ***
  const createTaskMutation = useMutation({
    mutationFn: (newTask: TaskCreate) => createTask(newTask),
    onSuccess: () => {
      // Invalidate and refetch the tasks query after successful creation
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: (createError) => {
      console.error("Error creating task:", createError);
      // TODO: Show user feedback
    },
  });
  // ****************************************

  // Handler functions to be passed to TaskList/TaskItem
  const handleUpdateStatus = (taskId: number, status: TaskStatus) => {
    updateStatusMutation.mutate({ taskId, statusData: { status } });
  };

  const handleDelete = (taskId: number) => {
    // Optional: Add confirmation dialog here
    if (window.confirm(`Are you sure you want to delete task ${taskId}?`)) {
      deleteMutation.mutate(taskId);
    }
  };

  // *** Add handler for creating task ***
  const handleCreateTask = (taskData: TaskCreate) => {
    createTaskMutation.mutate(taskData);
  };
  // *************************************

  return (
    <>
      <GlobalStyle />
      <Page>
        <Main>
          <GridRow>
            <GridCol>
              <H1>Task Management</H1>
            </GridCol>
          </GridRow>

          <GridRow>
            <GridCol setWidth="two-thirds">
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

          <hr />

          <GridRow>
            <GridCol>
              <H2>Task List</H2>
              {isLoading && <Paragraph>Loading tasks...</Paragraph>}
              {isError && (
                <Paragraph style={{ color: "red" }}>
                  {`Error fetching tasks: ${error?.message || "Unknown error"}`}
                </Paragraph>
              )}

              {tasks && (
                <TaskList
                  tasks={tasks}
                  onUpdateStatus={handleUpdateStatus}
                  onDelete={handleDelete}
                />
              )}

              {(updateStatusMutation.isPending || deleteMutation.isPending) && (
                <Paragraph>Updating...</Paragraph>
              )}
              {updateStatusMutation.isError && (
                <Paragraph style={{ color: "red" }}>
                  {`Error updating status: ${updateStatusMutation.error.message}`}
                </Paragraph>
              )}
              {deleteMutation.isError && (
                <Paragraph style={{ color: "red" }}>
                  {`Error deleting task: ${deleteMutation.error.message}`}
                </Paragraph>
              )}
            </GridCol>
          </GridRow>
        </Main>
      </Page>
    </>
  );
}

export default App;
