import React, { useState } from "react";
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
} from "govuk-react";
import GlobalStyle from "./styles/GlobalStyle";

function App() {
  const queryClient = useQueryClient();

  // State for filter and form visibility
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
              <H1 mb={6}>HMCTS Task Management</H1> {/* Simplified title */}
            </GridCol>
          </GridRow>
          {/* --- Add Task Section (Button & Form) --- */}
          {/* <GridRow mb={isAddTaskFormVisible ? 2 : 4}>
             {" "}
             <GridCol>
               <Button
                 onClick={() => setIsAddTaskFormVisible(!isAddTaskFormVisible)}
               >
                 {isAddTaskFormVisible ? "Cancel Add Task" : "Add New Task"}
               </Button>
             </GridCol>
           </GridRow> */}
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
          {/* --- Task Header and Add Button Row --- */}
          <GridRow mb={2}>
            {" "}
            {/* Add margin bottom */}
            <GridCol setWidth="two-thirds">
              <H2 mb={0}>Tasks</H2>{" "}
              {/* Heading for list, remove default bottom margin */}
            </GridCol>
            <GridCol setWidth="one-third" style={{ textAlign: "right" }}>
              {/* Moved Add Button */}
              <Button
                onClick={() => setIsAddTaskFormVisible(!isAddTaskFormVisible)}
              >
                {isAddTaskFormVisible ? "Cancel Add Task" : "Add New Task"}
              </Button>
            </GridCol>
          </GridRow>
          {/* --- Task List Component --- */}
          <GridRow>
            <GridCol>
              {isLoadingTasks && <Paragraph>Loading tasks...</Paragraph>}
              {/* Combined error messages */}
              {(() => {
                const errorParts = [];
                if (isTasksError) {
                  errorParts.push(
                    `Error fetching tasks: ${
                      tasksError?.message || "Unknown error"
                    }`
                  );
                }
                if (deleteMutation.isError) {
                  errorParts.push(
                    `Error deleting task: ${deleteMutation.error.message}`
                  );
                }
                if (updateStatusMutation.isError) {
                  errorParts.push(
                    `Error updating status: ${updateStatusMutation.error.message}`
                  );
                }

                if (errorParts.length > 0) {
                  // Using whiteSpace: 'pre-line' to respect newlines
                  return (
                    <Paragraph style={{ color: "red", whiteSpace: "pre-line" }}>
                      {errorParts.join("\n")}
                    </Paragraph>
                  );
                }
                return null;
              })()}

              {!isLoadingTasks && tasks.length > 0 && (
                <TaskList
                  tasks={tasks}
                  onDelete={handleDelete}
                  onUpdateStatus={handleUpdateStatus}
                />
              )}
              {!isLoadingTasks && tasks.length === 0 && (
                <Paragraph>No tasks exist yet. Add one above!</Paragraph>
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
