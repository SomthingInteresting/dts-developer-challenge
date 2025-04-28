import React, { useState } from "react";
import { Task, TaskStatus } from "../types/task";
import { Button, Tag } from "govuk-react";
import styled from "styled-components";

const StyledTd = styled.td`
  border-bottom: 1px solid #b1b4b6;
  padding: 10px 0;
`;

const CellContent = styled.div<{ $wrap?: boolean }>`
  display: flex;
  align-items: center;
  white-space: ${(props) => (props.$wrap ? "normal" : "nowrap")};
  overflow-wrap: ${(props) => (props.$wrap ? "break-word" : "normal")};
`;

interface TaskItemProps {
  task: Task;
  onUpdateStatus: (id: number, status: TaskStatus) => void;
  onDelete: (id: number) => void;
}

const getStatusColor = (status: TaskStatus) => {
  switch (status) {
    case TaskStatus.COMPLETED:
      return "GREEN";
    case TaskStatus.IN_PROGRESS:
      return "BLUE";
    case TaskStatus.PENDING:
      return "GREY";
    default:
      return "GREY";
  }
};

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onUpdateStatus,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<TaskStatus>(task.status);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(e.target.value as TaskStatus);
  };

  const handleDeleteClick = () => {
    onDelete(task.id);
  };

  const handleEditClick = () => {
    setSelectedStatus(task.status);
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  const handleSaveClick = () => {
    onUpdateStatus(task.id, selectedStatus);
    setIsEditing(false);
  };

  const formattedDueDate = task.due_date
    ? new Date(task.due_date).toLocaleDateString()
    : "N/A";

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
      <StyledTd className="govuk-table__cell">
        <CellContent>{task.id}</CellContent>
      </StyledTd>
      {/* Title */}
      <StyledTd className="govuk-table__cell">
        <CellContent $wrap>{task.title}</CellContent>
      </StyledTd>
      {/* Description */}
      <StyledTd className="govuk-table__cell">
        <CellContent $wrap>{task.description}</CellContent>
      </StyledTd>
      {/* Due Date */}
      <StyledTd className="govuk-table__cell">
        <CellContent>{formattedDueDate}</CellContent>
      </StyledTd>
      {/* Status Display Only */}
      <StyledTd className="govuk-table__cell">
        <CellContent>
          {isEditing ? (
            <select
              id={`status-select-${task.id}`}
              value={selectedStatus}
              onChange={handleStatusChange}
              style={{ width: "100%", padding: "5px" }}
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
            <Tag tint={getStatusColor(task.status)}>
              {formatStatusDisplay(task.status)}
            </Tag>
          )}
        </CellContent>
      </StyledTd>
      {/* Edit Status Action Cell */}
      <StyledTd className="govuk-table__cell">
        {isEditing ? (
          <>
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
          </>
        ) : (
          <Button
            size="small"
            $buttonStyle="secondary"
            onClick={handleEditClick}
          >
            Edit
          </Button>
        )}
      </StyledTd>
      {/* Actions Button */}
      <StyledTd className="govuk-table__cell">
        <CellContent>
          <Button buttonColour="#f47738" onClick={handleDeleteClick}>
            Delete
          </Button>
        </CellContent>
      </StyledTd>
    </tr>
  );
};

export default TaskItem;
