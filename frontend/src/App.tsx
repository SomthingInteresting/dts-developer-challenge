import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { initAll } from "govuk-frontend";
import {
  getTasks,
  updateTaskStatus,
  deleteTask,
  createTask,
} from "./services/api";
import { TaskStatus, TaskCreate, Task } from "./types/task";
import TaskList from "./components/TaskList";
import AddTaskForm from "./components/AddTaskForm";
import React from "react";

interface AppError {
  message: string;
  fieldId?: string;
}

function App() {
  const queryClient = useQueryClient();

  const [isAddTaskFormVisible, setIsAddTaskFormVisible] = useState(false);
  const [appErrors, setAppErrors] = useState<AppError[]>([]);

  useEffect(() => {
    initAll();
  }, []);

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
      setAppErrors([]);
    },
    onError: (updateError) => {
      console.error("Error updating task status:", updateError);
      setAppErrors([
        { message: `Error updating status: ${updateError.message}` },
      ]);
    },
  });

  const deleteMutation = useMutation<void, Error, number>({
    mutationFn: (taskId: number) => deleteTask(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setAppErrors([]);
    },
    onError: (deleteError) => {
      console.error("Error deleting task:", deleteError);
      setAppErrors([
        { message: `Error deleting task: ${deleteError.message}` },
      ]);
    },
  });

  const createTaskMutation = useMutation<Task, Error, TaskCreate>({
    mutationFn: (newTask: TaskCreate) => createTask(newTask),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setIsAddTaskFormVisible(false);
      setAppErrors([]);
    },
    onError: (createError) => {
      console.error("Error creating task:", createError);
      setAppErrors([
        { message: `Error creating task: ${createError.message}` },
      ]);
    },
  });

  const handleDelete = (taskId: number) => {
    if (window.confirm(`Are you sure you want to delete task ${taskId}?`)) {
      setAppErrors([]);
      deleteMutation.mutate(taskId);
    }
  };

  const handleUpdateStatus = (taskId: number, status: TaskStatus) => {
    setAppErrors([]);
    updateStatusMutation.mutate({ taskId, statusData: { status } });
  };

  const handleCreateTask = (taskData: TaskCreate) => {
    setAppErrors([]);
    createTaskMutation.mutate(taskData);
  };

  useEffect(() => {
    const errors: AppError[] = [];
    if (isTasksError && tasksError) {
      errors.push({ message: `Error fetching tasks: ${tasksError.message}` });
    }
    setAppErrors(errors);
  }, [isTasksError, tasksError]);

  return (
    <>
      <header className="govuk-header" role="banner" data-module="govuk-header">
        <div className="govuk-header__container govuk-width-container">
          <div className="govuk-header__logo">
            <a
              href="/"
              className="govuk-header__link govuk-header__link--homepage"
            >
              <span className="govuk-header__logotype">
                <svg
                  aria-hidden="true"
                  focusable="false"
                  className="govuk-header__logotype-crown"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 132 97"
                  height="30"
                  width="36"
                >
                  <path
                    fill="currentColor"
                    fillRule="evenodd"
                    d="M25 30.2c3.5 1.5 7.7-.2 9.1-3.7 1.5-3.6-.2-7.8-3.9-9.2-3.6-1.4-7.6.3-9.1 3.9-1.4 3.5.3 7.5 3.9 9zM9 39.5c3.6 1.5 7.8-.2 9.2-3.7 1.5-3.6-.2-7.8-3.9-9.1-3.6-1.5-7.6.2-9.1 3.8-1.4 3.5.3 7.5 3.8 9zM4.4 57.2c3.5 1.5 7.7-.2 9.1-3.8 1.5-3.6-.2-7.7-3.9-9.1-3.6-1.5-7.6.3-9.1 3.8-1.4 3.5.3 7.5 3.9 9.1zm38.3-21.4c3.5 1.5 7.7-.2 9.1-3.8 1.5-3.6-.2-7.7-3.9-9.1-3.6-1.5-7.6.3-9.1 3.8-1.4 3.5.3 7.5 3.9 9.1zm64.4-5.6c-3.6 1.5-7.8-.2-9.1-3.7-1.5-3.6.2-7.8 3.8-9.2 3.6-1.4 7.7.3 9.1 3.9 1.4 3.5-.3 7.5-3.8 9zm15.9 9.1c-3.6 1.5-7.8-.2-9.1-3.7-1.5-3.6.2-7.8 3.8-9.1 3.6-1.5 7.7.3 9.1 3.8 1.4 3.5-.3 7.5-3.8 9.1zm-30.7-21.4c-3.6 1.5-7.8-.2-9.1-3.8-1.5-3.6.2-7.7 3.8-9.1 3.6-1.5 7.7.3 9.1 3.8 1.4 3.5-.3 7.5-3.8 9.1zm-74.6 21.4c-3.6 1.5-7.8-.2-9.1-3.8-1.5-3.6.2-7.7 3.9-9.1 3.6-1.5 7.7.3 9.1 3.8 1.4 3.5-.3 7.5-3.9 9.1zM127.3 34c-3.6 1.5-7.8-.2-9.1-3.8-1.5-3.6.2-7.7 3.9-9.1 3.6-1.5 7.7.3 9.1 3.8 1.4 3.5-.3 7.5-3.9 9.1zM97.2 17.8c-1.5-3.6.2-7.8 3.8-9.2 3.6-1.4 7.7.3 9.1 3.9 1.4 3.5-.3 7.5-3.8 9.1-3.6 1.5-7.8-.2-9.1-3.8zM71.2 17.8c-1.5-3.6.2-7.8 3.9-9.2 3.6-1.4 7.7.3 9.1 3.9 1.4 3.5-.3 7.5-3.9 9.1-3.6 1.5-7.8-.2-9.1-3.8zM35.2 17.8c-1.5-3.6.2-7.8 3.9-9.2 3.6-1.4 7.7.3 9.1 3.9 1.4 3.5-.3 7.5-3.9 9.1-3.6 1.5-7.8-.2-9.1-3.8zM132 61.9c0 5.8-4.9 10.6-10.8 10.6-4.1 0-7.6-2.1-9.4-5.1-1.9-3-2.5-6.7-2.5-10.8 0-4.6.7-8.1 2.5-10.8 1.8-2.9 5.3-5.1 9.4-5.1 5.9 0 10.8 4.7 10.8 10.5zM10.8 61.9c0 5.8 4.9 10.6 10.8 10.6 4.1 0 7.6-2.1 9.4-5.1 1.9-3 2.5-6.7 2.5-10.8 0-4.6-.7-8.1-2.5-10.8-1.8-2.9-5.3-5.1-9.4-5.1C15.7 51.3 10.8 56 10.8 61.9zM72.3 47.1c-1.8-3-5.3-5.1-9.4-5.1s-7.6 2.1-9.4 5.1c-1.8 3-2.5 6.7-2.5 10.8 0 4.1.7 7.8 2.5 10.8 1.8 2.9 5.3 5.1 9.4 5.1s7.6-2.1 9.4-5.1c1.8-3 2.5-6.7 2.5-10.8-.1-4.1-.8-7.8-2.5-10.8zM66 97.1c-12.7 0-23.1-10.5-23.1-23.5V50h46.2v23.5c0 13.1-10.5 23.6-23.1 23.6zm0-34.4c-5.3 0-9.6-4.3-9.6-9.6s4.3-9.6 9.6-9.6 9.6 4.3 9.6 9.6-4.3 9.6-9.6 9.6z"
                  />
                </svg>
                <span className="govuk-header__logotype-text"> GOV.UK </span>
              </span>
            </a>
          </div>
          <div className="govuk-header__content">
            <a
              href="/"
              className="govuk-header__link govuk-header__service-name"
            >
              HMCTS Task Management
            </a>
          </div>
        </div>
      </header>

      <div className="govuk-width-container">
        <main className="govuk-main-wrapper" id="main-content" role="main">
          {appErrors.length > 0 && (
            <div
              className="govuk-error-summary"
              aria-labelledby="error-summary-title"
              role="alert"
              tabIndex={-1}
              data-module="govuk-error-summary"
            >
              <h2
                className="govuk-error-summary__title"
                id="error-summary-title"
              >
                There is a problem
              </h2>
              <div className="govuk-error-summary__body">
                <ul className="govuk-list govuk-error-summary__list">
                  {appErrors.map((error, index) => (
                    <li key={index}>
                      <a href={error.fieldId || "#"}>{error.message}</a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <div className="govuk-grid-row">
            <div className="govuk-grid-column-two-thirds">
              <h1 className="govuk-heading-l govuk-!-margin-bottom-6">Tasks</h1>
            </div>
            <div className="govuk-grid-column-one-third govuk-!-text-align-right">
              <button
                className="govuk-button"
                data-module="govuk-button"
                onClick={() => setIsAddTaskFormVisible(!isAddTaskFormVisible)}
              >
                {isAddTaskFormVisible ? "Cancel Add Task" : "Add New Task"}
              </button>
            </div>
          </div>

          {isAddTaskFormVisible && (
            <div className="govuk-grid-row govuk-!-margin-bottom-6">
              <div className="govuk-grid-column-full">
                <AddTaskForm
                  onCreateTask={handleCreateTask}
                  isCreating={createTaskMutation.isPending}
                />
              </div>
            </div>
          )}
          {!isAddTaskFormVisible && (
            <hr className="govuk-section-break govuk-section-break--visible govuk-!-margin-top-6 govuk-!-margin-bottom-6" />
          )}

          <div className="govuk-grid-row">
            <div className="govuk-grid-column-full">
              {isLoadingTasks && <p className="govuk-body">Loading tasks...</p>}
              {!isLoadingTasks && !isTasksError && tasks.length > 0 && (
                <TaskList
                  tasks={tasks}
                  onDelete={handleDelete}
                  onUpdateStatus={handleUpdateStatus}
                />
              )}
              {!isLoadingTasks && !isTasksError && tasks.length === 0 && (
                <p className="govuk-body">No tasks exist yet. Add one above!</p>
              )}

              {(createTaskMutation.isPending ||
                deleteMutation.isPending ||
                updateStatusMutation.isPending) && (
                <p className="govuk-body">Updating...</p>
              )}
            </div>
          </div>
        </main>
      </div>

      <footer className="govuk-footer" role="contentinfo">
        <div className="govuk-width-container">
          <div className="govuk-footer__meta">
            <div className="govuk-footer__meta-item govuk-footer__meta-item--grow">
              <h2 className="govuk-visually-hidden">Support links</h2>
              <ul className="govuk-footer__inline-list">
                <li className="govuk-footer__inline-list-item">
                  <a className="govuk-footer__link" href="#/">
                    Help
                  </a>
                </li>
                <li className="govuk-footer__inline-list-item">
                  <a className="govuk-footer__link" href="#/">
                    Cookies
                  </a>
                </li>
                <li className="govuk-footer__inline-list-item">
                  <a className="govuk-footer__link" href="#/">
                    Contact
                  </a>
                </li>
                <li className="govuk-footer__inline-list-item">
                  <a className="govuk-footer__link" href="#/">
                    Terms and conditions
                  </a>
                </li>
              </ul>
              <svg
                aria-hidden="true"
                focusable="false"
                className="govuk-footer__licence-logo"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 483.2 195.7"
                height="17"
                width="41"
              >
                <path
                  fill="currentColor"
                  d="M421.5 142.8V.1l-50.7 32.3v161.1h112.4v-50.7zm-122.3-9.6A47.12 47.12 0 0 1 221 97.8c0-26 21.1-47.1 47.1-47.1 16.7 0 31.4 8.7 39.7 21.8l42.7-27.2A97.63 97.63 0 0 0 268.1 0c-36.5 0-68.3 20.1-85.1 49.7A98 98 0 0 0 97.8 0C43.9 0 0 43.9 0 97.8s43.9 97.8 97.8 97.8c36.5 0 68.3-20.1 85.1-49.7a97.76 97.76 0 0 0 149.6 25.4l19.4 22.7h34.5v-47.4H374l-40.1 44.8zM268.1 145.3c-26 0-47.1-21.1-47.1-47.1s21.1-47.1 47.1-47.1 47.2 21 47.2 47S294.1 145.3 268.1 145.3zm-170.3 0c-26 0-47.1-21.1-47.1-47.1s21.1-47.1 47.1-47.1 47.1 21.1 47.1 47.1-21 47.1-47 47.1z"
                ></path>
              </svg>
              <span className="govuk-footer__licence-description">
                All content is available under the
                <a
                  className="govuk-footer__link"
                  href="https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/"
                  rel="license"
                >
                  Open Government Licence v3.0
                </a>
                , except where otherwise stated
              </span>
            </div>
            <div className="govuk-footer__meta-item">
              <a
                className="govuk-footer__link govuk-footer__copyright-logo"
                href="https://www.nationalarchives.gov.uk/information-management/re-using-public-sector-information/uk-government-licensing-framework/crown-copyright/"
              >
                © Crown copyright
              </a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default App;
