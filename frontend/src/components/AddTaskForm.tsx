import React, { useState } from "react";
import { TaskCreate } from "../types/task"; // Removed TaskStatus import
// Import govuk-react components
import {
  Fieldset,
  Label,
  Input,
  TextArea,
  Button,
  // H2, // Removed H2 import
  // ErrorText, // For displaying validation errors later
  // HintText, // For providing input hints
} from "govuk-react";

interface AddTaskFormProps {
  onCreateTask: (taskData: TaskCreate) => void;
  isCreating: boolean; // To disable button during submission
}

const AddTaskForm: React.FC<AddTaskFormProps> = ({
  onCreateTask,
  isCreating,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState(""); // Keep as string initially

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    // --- Add console log for debugging ---
    console.log("handleSubmit called");
    console.log("Title state:", title);
    console.log("DueDate state:", dueDate);
    // ------------------------------------

    if (!title || !dueDate) {
      alert("Title and Due Date are required."); // Simple validation
      return;
    }

    // Construct TaskCreate object
    // Ensure due_date is in a format the backend expects (ISO 8601 potentially, or just YYYY-MM-DDTHH:MM:SS)
    // For simplicity, we assume the input type="datetime-local" provides a compatible string.
    const newTask: TaskCreate = {
      title,
      description: description || null, // Send null if empty
      due_date: dueDate,
      // status: TaskStatus.PENDING // Default is handled by backend
    };

    onCreateTask(newTask);

    // Optionally clear the form after submission attempt
    setTitle("");
    setDescription("");
    setDueDate("");
  };

  return (
    // Use Fieldset for grouping form controls
    <Fieldset>
      <Fieldset.Legend isPageHeading size="MEDIUM">
        {" "}
        {/* Use legend as heading */}
        Add New Task
      </Fieldset.Legend>

      <form onSubmit={handleSubmit}>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          value={title} // Direct prop
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setTitle(e.target.value)
          } // Direct prop
          required // Direct prop
          // input={{ }} // Removed nesting
        />

        <Label htmlFor="description">Description (Optional)</Label>
        {/* TextArea remains correct with nested input prop */}
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
          value={dueDate} // Direct prop
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setDueDate(e.target.value)
          } // Direct prop
          required // Direct prop
          // input={{ }} // Removed nesting
        />

        <Button type="submit" disabled={isCreating}>
          {isCreating ? "Adding..." : "Add Task"}
        </Button>
      </form>
    </Fieldset>
  );
};

export default AddTaskForm;
