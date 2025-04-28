import React from "react";
import { Task, TaskStatus } from "../types/task";
// Import govuk-react components
import { Paragraph } from "govuk-react";
// Removed H2 as it's not used directly here anymore
// Import TaskItem component
import TaskItem from "./TaskItem";

interface TaskListProps {
  tasks: Task[];
  onUpdateStatus: (id: number, status: TaskStatus) => void;
  onDelete: (id: number) => void;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onUpdateStatus,
  onDelete,
}) => {
  if (!tasks || tasks.length === 0) {
    return <Paragraph>No tasks found.</Paragraph>;
  }

  return (
    // Use standard HTML table
    <table
      className="govuk-table"
      style={{ borderCollapse: "collapse", tableLayout: "fixed" }}
    >
      <thead className="govuk-table__head">
        <tr className="govuk-table__row">
          {/* Define column headers with suggested widths */}
          {/* New ID column */}
          <th
            scope="col"
            className="govuk-table__header"
            style={{ width: "5%", borderBottom: "2px solid #0b0c0c" }}
          >
            ID
          </th>
          <th
            scope="col"
            className="govuk-table__header"
            style={{ width: "15%", borderBottom: "2px solid #0b0c0c" }}
          >
            Title
          </th>
          <th
            scope="col"
            className="govuk-table__header"
            style={{ width: "34%", borderBottom: "2px solid #0b0c0c" }}
          >
            Description
          </th>
          <th
            scope="col"
            className="govuk-table__header"
            style={{ width: "12%", borderBottom: "2px solid #0b0c0c" }}
          >
            Due Date
          </th>
          <th
            scope="col"
            className="govuk-table__header"
            style={{ width: "18%", borderBottom: "2px solid #0b0c0c" }}
          >
            Status
          </th>
          <th
            scope="col"
            className="govuk-table__header"
            style={{ width: "8%", borderBottom: "2px solid #0b0c0c" }}
          >
            Edit
          </th>
          <th
            scope="col"
            className="govuk-table__header"
            style={{ width: "8%", borderBottom: "2px solid #0b0c0c" }}
          >
            Delete
          </th>
        </tr>
      </thead>
      <tbody className="govuk-table__body">
        {/* Map tasks to TaskItem components, passing props */}
        {/* TaskItem will need to be refactored to render a <tr> */}
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onUpdateStatus={onUpdateStatus}
            onDelete={onDelete}
          />
        ))}
      </tbody>
    </table>
  );
};

export default TaskList;
