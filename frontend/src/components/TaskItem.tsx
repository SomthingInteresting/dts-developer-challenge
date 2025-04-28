import React, { useState } from "react";
import { Task, TaskStatus } from "../types/task";
// Import govuk-react components
import {
  ListItem, // Use for list structure
  Button,
  Paragraph,
  Tag, // Added Tag
  GridRow, // Added GridRow
  GridCol, // Added GridCol
  H3, // Added H3
  Select, // Added Select back
} from "govuk-react";

interface TaskItemProps {
  task: Task;
  onUpdateStatus: (id: number, status: TaskStatus) => void; // Added prop back
  onDelete: (id: number) => void;
}

// Helper to format date string (assuming due_date is YYYY-MM-DDTHH:MM:SS)
const formatDate = (dateString: string): string => {
  try {
    // Basic parsing and formatting
    const date = new Date(dateString);
    // Handle invalid date string if necessary
    if (isNaN(date.getTime())) return "Invalid Date";
    return date.toLocaleDateString("en-GB", {
      // Example: UK format
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (e) {
    console.error("Error formatting date:", e);
    return "Invalid Date";
  }
};

// Helper function to determine Tag color based on status
const getStatusColor = (status: TaskStatus) => {
  switch (status) {
    case TaskStatus.DONE:
      return "GREEN";
    case TaskStatus.IN_PROGRESS:
      return "BLUE";
    case TaskStatus.PENDING:
      return "GREY";
    default:
      return "GREY"; // Default or other statuses
  }
};

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onUpdateStatus, // Added back
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  // State to hold the selected status during editing
  const [selectedStatus, setSelectedStatus] = useState<TaskStatus>(task.status);

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

  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(event.target.value as TaskStatus);
  };

  return (
    // Use ListItem for semantic list structure
    <ListItem mb={6}>
      {" "}
      {/* Added bottom margin instead of inline style */}
      <H3 mb={1}>{task.title}</H3> {/* Using H3 with margin */}
      {task.description && (
        /* Replaced govuk-react Paragraph with standard <p> for description */
        <p style={{ marginBottom: "10px" }}>{task.description}</p>
      )}
      <Paragraph mb={4}>{`Due: ${formatDate(task.due_date)}`}</Paragraph>
      <GridRow>
        <GridCol setWidth="auto">
          {" "}
          {/* Allow Col to fit content */}
          {!isEditing ? (
            <Tag tint={getStatusColor(task.status)}>
              {task.status.replace("_", " ").charAt(0).toUpperCase() +
                task.status.replace("_", " ").slice(1).toLowerCase()}
            </Tag>
          ) : (
            <Select
              // Removed label prop for inline usage
              input={{
                value: selectedStatus,
                onChange: handleStatusChange,
                name: `status-edit-${task.id}`,
                id: `status-edit-${task.id}`,
              }}
              style={{ marginBottom: 0 }} // Override default govuk-react mb
            >
              {Object.values(TaskStatus).map((status) => (
                <option key={status} value={status}>
                  {status.replace("_", " ").charAt(0).toUpperCase() +
                    status.replace("_", " ").slice(1).toLowerCase()}
                </option>
              ))}
            </Select>
          )}
        </GridCol>

        {/* Action Buttons Column */}
        <GridCol setWidth="auto" style={{ paddingLeft: "15px" }}>
          {!isEditing ? (
            <>
              <Button
                $buttonStyle="secondary"
                onClick={handleEditClick}
                style={{ marginRight: "10px" }}
              >
                Edit Status
              </Button>
              <Button buttonColour="#DF3034" onClick={() => onDelete(task.id)}>
                Delete
              </Button>
            </>
          ) : (
            <>
              <Button
                $buttonStyle="primary"
                onClick={handleSaveClick}
                style={{ marginRight: "10px" }}
              >
                Save
              </Button>
              <Button $buttonStyle="warning" onClick={handleCancelClick}>
                Cancel
              </Button>
            </>
          )}
        </GridCol>
      </GridRow>
      {/* Removed Select dropdown */}
      {/* TODO: Add Edit button/functionality */}
    </ListItem>
  );
};

export default TaskItem;
