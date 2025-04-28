import React from "react";
import { Task, TaskStatus } from "../types/task";
import { Paragraph } from "govuk-react";
import TaskItem from "./TaskItem";
import styled from "styled-components";

const StyledTable = styled.table`
  border-collapse: collapse;
  table-layout: fixed;
  width: 100%;
`;

const StyledTh = styled.th<{ width?: string }>`
  width: ${(props) => props.width || "auto"};
  border-bottom: 2px solid #0b0c0c;
  padding: 10px 0;
  text-align: left;
`;

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
    <StyledTable className="govuk-table">
      <thead className="govuk-table__head">
        <tr className="govuk-table__row">
          <StyledTh scope="col" className="govuk-table__header" width="5%">
            ID
          </StyledTh>
          <StyledTh scope="col" className="govuk-table__header" width="15%">
            Title
          </StyledTh>
          <StyledTh scope="col" className="govuk-table__header" width="26%">
            Description
          </StyledTh>
          <StyledTh scope="col" className="govuk-table__header" width="12%">
            Due Date
          </StyledTh>
          <StyledTh scope="col" className="govuk-table__header" width="22%">
            Status
          </StyledTh>
          <StyledTh scope="col" className="govuk-table__header" width="12%">
            Edit
          </StyledTh>
          <StyledTh scope="col" className="govuk-table__header" width="8%">
            Delete
          </StyledTh>
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
    </StyledTable>
  );
};

export default TaskList;
