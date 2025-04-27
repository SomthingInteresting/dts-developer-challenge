import React from "react";
import { Task, TaskStatus } from "../types/task";
import TaskItem from "./TaskItem"; // Import the TaskItem component
// Import govuk-react components
import { UnorderedList, Paragraph } from "govuk-react";

interface TaskListProps {
  tasks: Task[];
  onUpdateStatus: (id: number, status: TaskStatus) => void; // Pass down handlers
  onDelete: (id: number) => void; // Pass down handlers
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onUpdateStatus,
  onDelete,
}) => {
  if (tasks.length === 0) {
    return <Paragraph>No tasks found.</Paragraph>; // Use Paragraph
  }

  return (
    // Use UnorderedList for semantic list structure
    <UnorderedList listStyleType="none">
      {" "}
      {/* Remove default bullets */}
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onUpdateStatus={onUpdateStatus}
          onDelete={onDelete}
        />
      ))}
    </UnorderedList>
  );
};

export default TaskList;
