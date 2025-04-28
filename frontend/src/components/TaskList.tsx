import React from "react";
import { Task, TaskStatus } from "../types/task";
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
    return <p className="govuk-body">No tasks found.</p>;
  }

  return (
    <table className="govuk-table">
      <thead className="govuk-table__head">
        <tr className="govuk-table__row">
          <th scope="col" className="govuk-table__header">
            ID
          </th>
          <th scope="col" className="govuk-table__header">
            Title
          </th>
          <th scope="col" className="govuk-table__header">
            Description
          </th>
          <th scope="col" className="govuk-table__header">
            Due Date/Time
          </th>
          <th scope="col" className="govuk-table__header">
            Status
          </th>
          <th scope="col" className="govuk-table__header">
            Edit
          </th>
          <th scope="col" className="govuk-table__header">
            Delete
          </th>
        </tr>
      </thead>
      <tbody className="govuk-table__body">
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
