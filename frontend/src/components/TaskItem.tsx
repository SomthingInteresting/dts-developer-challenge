import React from "react";
import { Task, TaskStatus } from "../types/task";
// Import govuk-react components
import {
  ListItem, // Use for list structure
  Select,
  Button,
  Paragraph,
  // Tag, // Optional: Use Tag for status display
  // Details, // Optional: Could use Details for description
} from "govuk-react";

interface TaskItemProps {
  task: Task;
  onUpdateStatus: (id: number, status: TaskStatus) => void; // Placeholder for status update
  onDelete: (id: number) => void; // Placeholder for delete
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

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onUpdateStatus,
  onDelete,
}) => {
  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onUpdateStatus(task.id, event.target.value as TaskStatus);
  };

  return (
    // Use ListItem for semantic list structure
    <ListItem
      style={{
        borderBottom: "1px solid #b1b4b6",
        paddingBottom: "15px",
        marginBottom: "15px",
      }}
    >
      {" "}
      {/* Basic separator */}
      <h3>{task.title}</h3>{" "}
      {/* Keeping h3 for now, could be Paragraph with bold */}
      {task.description && <Paragraph mb={2}>{task.description}</Paragraph>}
      <Paragraph mb={4}>{`Due: ${formatDate(task.due_date)}`}</Paragraph>
      <Select
        label="Status"
        input={{
          value: task.status,
          onChange: handleStatusChange,
          name: `status-${task.id}`, // Unique name might be needed
          id: `status-${task.id}`, // Unique ID
        }}
        mb={4} // Add margin below
      >
        {Object.values(TaskStatus).map((status) => (
          <option key={status} value={status}>
            {status.replace("_", " ")} {/* Make status more readable */}
          </option>
        ))}
      </Select>
      {/* Use GOV.UK styles for buttons */}
      <Button
        buttonColour="#DF3034" // GOV.UK Warning colour
        onClick={() => onDelete(task.id)}
      >
        Delete
      </Button>
      {/* TODO: Add Edit button/functionality */}
    </ListItem>
  );
};

export default TaskItem;
