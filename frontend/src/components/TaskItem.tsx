import React, { useState } from "react";
import { Task, TaskStatus } from "../types/task";

interface TaskItemProps {
  task: Task;
  onUpdateStatus: (id: number, status: TaskStatus) => void;
  onDelete: (id: number) => void;
}

const getStatusGovukColor = (status: TaskStatus): string => {
  switch (status) {
    case TaskStatus.COMPLETED:
      return "green";
    case TaskStatus.IN_PROGRESS:
      return "blue";
    case TaskStatus.PENDING:
      return "grey";
    default:
      return "grey";
  }
};

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onUpdateStatus,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<TaskStatus>(task.status);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(e.target.value as TaskStatus);
  };

  const handleDeleteClick = () => {
    setIsConfirmingDelete(true);
  };

  const handleConfirmDeleteClick = () => {
    onDelete(task.id);
  };

  const handleCancelDeleteClick = () => {
    setIsConfirmingDelete(false);
  };

  const handleEditClick = () => {
    setSelectedStatus(task.status);
    setIsEditing(true);
    setIsConfirmingDelete(false);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  const handleSaveClick = () => {
    onUpdateStatus(task.id, selectedStatus);
    setIsEditing(false);
  };

  const formattedDueDateTime = (() => {
    if (!task.due_date) {
      return "N/A";
    }
    try {
      const dateObj = new Date(task.due_date);
      if (isNaN(dateObj.getTime())) {
        return "Invalid Date";
      }
      const datePart = dateObj.toLocaleDateString();
      const timePart = dateObj.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
      return `${datePart} ${timePart}`;
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid Date";
    }
  })();

  const formatStatusDisplay = (status: TaskStatus): string => {
    switch (status) {
      case TaskStatus.PENDING:
        return "Pending";
      case TaskStatus.IN_PROGRESS:
        return "In Progress";
      case TaskStatus.COMPLETED:
        return "Completed";
      default:
        return status;
    }
  };

  return (
    <tr className="govuk-table__row">
      {/* ID */}
      <td className="govuk-table__cell">{task.id}</td>
      {/* Title */}
      <td className="govuk-table__cell">{task.title}</td>
      {/* Description */}
      <td className="govuk-table__cell">{task.description}</td>
      {/* Due Date & Time */}
      <td className="govuk-table__cell">{formattedDueDateTime}</td>
      {/* Status Display Only */}
      <td className="govuk-table__cell">
        {isEditing ? (
          <select
            id={`status-select-${task.id}`}
            className="govuk-select"
            value={selectedStatus}
            onChange={handleStatusChange}
          >
            <option value={TaskStatus.PENDING}>
              {formatStatusDisplay(TaskStatus.PENDING)}
            </option>
            <option value={TaskStatus.IN_PROGRESS}>
              {formatStatusDisplay(TaskStatus.IN_PROGRESS)}
            </option>
            <option value={TaskStatus.COMPLETED}>
              {formatStatusDisplay(TaskStatus.COMPLETED)}
            </option>
          </select>
        ) : (
          <strong
            className={`govuk-tag govuk-tag--${getStatusGovukColor(
              task.status
            )}`}
          >
            {formatStatusDisplay(task.status)}
          </strong>
        )}
      </td>
      {/* Edit Status Action Cell */}
      <td className="govuk-table__cell">
        {isEditing ? (
          <>
            <button
              type="button"
              className="govuk-button govuk-button--small govuk-!-margin-right-1"
              data-module="govuk-button"
              onClick={handleSaveClick}
            >
              Save
            </button>
            <button
              type="button"
              className="govuk-button govuk-button--warning govuk-button--small"
              data-module="govuk-button"
              onClick={handleCancelClick}
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            type="button"
            className="govuk-button govuk-button--secondary govuk-button--small"
            data-module="govuk-button"
            onClick={handleEditClick}
          >
            Edit
          </button>
        )}
      </td>
      {/* Actions Button */}
      <td className="govuk-table__cell">
        {isConfirmingDelete ? (
          <>
            <button
              type="button"
              className="govuk-button govuk-button--warning govuk-!-margin-right-1"
              data-module="govuk-button"
              onClick={handleConfirmDeleteClick}
            >
              Confirm Delete
            </button>
            <button
              type="button"
              className="govuk-button govuk-button--secondary"
              data-module="govuk-button"
              onClick={handleCancelDeleteClick}
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            type="button"
            className="govuk-button govuk-button--warning"
            data-module="govuk-button"
            onClick={handleDeleteClick}
          >
            Delete
          </button>
        )}
      </td>
    </tr>
  );
};

export default TaskItem;
