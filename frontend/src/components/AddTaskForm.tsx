import React, { useState } from "react";
import { TaskCreate } from "../types/task";
import {
  Fieldset,
  Label,
  Input,
  TextArea,
  Button,
} from "govuk-react";

interface AddTaskFormProps {
  onCreateTask: (taskData: TaskCreate) => void;
  isCreating: boolean;
}

const AddTaskForm: React.FC<AddTaskFormProps> = ({
  onCreateTask,
  isCreating,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || !dueDate) {
      alert("Title and Due Date are required.");
      return;
    }

    const newTask: TaskCreate = {
      title,
      description: description || null,
      due_date: dueDate,
    };

    onCreateTask(newTask);

    setTitle("");
    setDescription("");
    setDueDate("");
  };

  return (
    <Fieldset>
      <Fieldset.Legend isPageHeading size="MEDIUM">
        Add New Task
      </Fieldset.Legend>

      <form onSubmit={handleSubmit}>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          value={title}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setTitle(e.target.value)
          }
          required
        />

        <Label htmlFor="description">Description (Optional)</Label>
        <TextArea
          id="description"
          input={{
            value: description,
            onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setDescription(e.target.value),
            name: "description",
          }}
        >
          <Label>Description (Optional)</Label>
        </TextArea>

        <Label htmlFor="due_date">Due Date</Label>
        <Input
          id="due_date"
          name="due_date"
          type="datetime-local"
          value={dueDate}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setDueDate(e.target.value)
          }
          required
        />

        <Button type="submit" disabled={isCreating}>
          {isCreating ? "Adding..." : "Add Task"}
        </Button>
      </form>
    </Fieldset>
  );
};

export default AddTaskForm;
