import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getTasks,
  updateTaskStatus,
  deleteTask,
  createTask,
} from "./services/api";
import { TaskStatus, TaskCreate, Task } from "./types/task";
import TaskList from "./components/TaskList";
import AddTaskForm from "./components/AddTaskForm";
import {
  Page,
  Main,
  H1,
  H2,
  GridRow,
  GridCol,
  Paragraph,
  Button,
} from "govuk-react";
import GlobalStyle from "./styles/GlobalStyle";

function App() {
  const queryClient = useQueryClient();

  const [isAddTaskFormVisible, setIsAddTaskFormVisible] = useState(false);

  const {
    isLoading: isLoadingTasks,
    isError: isTasksError,
    data: tasks = [],
    error: tasksError,
  } = useQuery<Task[], Error>({
    queryKey: ["tasks"],
    queryFn: getTasks,
  });

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

  const deleteMutation = useMutation<void, Error, number>({
    mutationFn: (taskId: number) => deleteTask(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: (deleteError) => {
      console.error("Error deleting task:", deleteError);
    },
  });

  const createTaskMutation = useMutation<Task, Error, TaskCreate>({
    mutationFn: (newTask: TaskCreate) => createTask(newTask),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setIsAddTaskFormVisible(false);
    },
    onError: (createError) => {
      console.error("Error creating task:", createError);
    },
  });

  const handleDelete = (taskId: number) => {
    if (window.confirm(`Are you sure you want to delete task ${taskId}?`)) {
      deleteMutation.mutate(taskId);
    }
  };

  const handleUpdateStatus = (taskId: number, status: TaskStatus) => {
    updateStatusMutation.mutate({ taskId, statusData: { status } });
  };

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
              <H1 mb={6}>HMCTS Task Management</H1>
            </GridCol>
          </GridRow>
          {isAddTaskFormVisible && (
            <GridRow mb={6}>
              <GridCol>
                <H2>Add New Task</H2>
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
          {!isAddTaskFormVisible && (
            <hr style={{ borderColor: "#b1b4b6", margin: "20px 0" }} />
          )}
          <GridRow mb={2}>
            <GridCol setWidth="two-thirds">
              <H2 mb={0}>Tasks</H2>
            </GridCol>
            <GridCol setWidth="one-third" style={{ textAlign: "right" }}>
              <Button
                onClick={() => setIsAddTaskFormVisible(!isAddTaskFormVisible)}
              >
                {isAddTaskFormVisible ? "Cancel Add Task" : "Add New Task"}
              </Button>
            </GridCol>
          </GridRow>
          <GridRow>
            <GridCol>
              {isLoadingTasks && <Paragraph>Loading tasks...</Paragraph>}
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
