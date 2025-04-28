import React, { useState } from "react";
import { Task, TaskStatus } from "../types/task";
// Import necessary govuk-react components
import {
  Button, // Keep for actions
  Select, // Keep for status dropdown
  Tag, // Re-import Tag
} from "govuk-react";

interface TaskItemProps {
  task: Task;
  onUpdateStatus: (id: number, status: TaskStatus) => void;
  onDelete: (id: number) => void;
}

// Helper function to determine Tag color based on status
const getStatusColor = (status: TaskStatus) => {
  switch (status) {
    case TaskStatus.COMPLETED:
      return "GREEN";
    case TaskStatus.IN_PROGRESS:
      return "BLUE";
    case TaskStatus.PENDING:
      return "GREY";
    default:
      return "GREY"; // Default for PENDING or any other status
  }
};

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onUpdateStatus,
  onDelete,
}) => {
  // State for editing mode and temporary status selection
  const [isEditing, setIsEditing] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<TaskStatus>(task.status);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(e.target.value as TaskStatus);
  };

  const handleDeleteClick = () => {
    onDelete(task.id);
  };

  const handleEditClick = () => {
    setSelectedStatus(task.status); // Reset selection to current task status
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  const handleSaveClick = () => {
    onUpdateStatus(task.id, selectedStatus);
    setIsEditing(false);
  };

  // Format the date (assuming due_date is a string in ISO format)
  const formattedDueDate = task.due_date
    ? new Date(task.due_date).toLocaleDateString()
    : "N/A";

  // Helper to format status for display
  const formatStatusDisplay = (status: TaskStatus): string => {
    switch (status) {
      case TaskStatus.PENDING:
        return "Pending";
      case TaskStatus.IN_PROGRESS:
        return "In Progress";
      case TaskStatus.COMPLETED:
        return "Completed";
      default:
        return status; // Fallback
    }
  };

  // Render a Table.Row instead of ListItem
  return (
    <tr className="govuk-table__row">
      {/* ID */}
      <td
        className="govuk-table__cell"
        style={{ borderBottom: "1px solid #b1b4b6" }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>{task.id}</div>
      </td>
      {/* Title */}
      <td
        className="govuk-table__cell"
        style={{ borderBottom: "1px solid #b1b4b6" }}
      >
        <div style={{ whiteSpace: "normal", overflowWrap: "break-word" }}>
          {task.title}
        </div>
      </td>
      {/* Description */}
      <td
        className="govuk-table__cell"
        style={{ borderBottom: "1px solid #b1b4b6" }}
      >
        <div style={{ whiteSpace: "normal", overflowWrap: "break-word" }}>
          {task.description}
        </div>
      </td>
      {/* Due Date */}
      <td
        className="govuk-table__cell"
        style={{ borderBottom: "1px solid #b1b4b6" }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          {formattedDueDate}
        </div>
      </td>
      {/* Status Display Only */}
      <td
        className="govuk-table__cell"
        style={{ borderBottom: "1px solid #b1b4b6" }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          {isEditing ? (
            // Editing mode: Show Select dropdown only
            <Select
              value={selectedStatus}
              onChange={handleStatusChange}
              label="Status"
              labelIsHidden // Hide label visually but keep for accessibility
              input={{
                id: `status-select-${task.id}`,
              }}
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
            </Select>
          ) : (
            // Display mode: Show Tag only
            <Tag tint={getStatusColor(task.status)}>
              {formatStatusDisplay(task.status)}
            </Tag>
          )}
        </div>
      </td>
      {/* Edit Status Action Cell */}
      <td
        className="govuk-table__cell"
        style={{ borderBottom: "1px solid #b1b4b6" }}
      >
        {isEditing ? (
          // Editing mode: Show Save/Cancel buttons
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Button size="small" onClick={handleSaveClick}>
              Save
            </Button>
            <Button
              size="small"
              $buttonStyle="warning"
              onClick={handleCancelClick}
            >
              Cancel
            </Button>
          </div>
        ) : (
          // Display mode: Show Edit button
          <Button
            size="small"
            $buttonStyle="secondary"
            onClick={handleEditClick}
          >
            Edit
          </Button>
        )}
      </td>
      {/* Actions Button */}
      <td
        className="govuk-table__cell"
        style={{ borderBottom: "1px solid #b1b4b6" }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <Button buttonColour="#f47738" onClick={handleDeleteClick}>
            Delete
          </Button>
        </div>
      </td>
    </tr>
  );
};

export default TaskItem;
