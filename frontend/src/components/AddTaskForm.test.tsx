import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest"; // Vitest's mocking utility
import AddTaskForm from "./AddTaskForm";
import { TaskCreate } from "../types/task"; // Assuming TaskCreate is here

describe("AddTaskForm", () => {
  const mockOnCreateTask = vi.fn();
  const user = userEvent.setup();

  beforeEach(() => {
    // Reset the mock before each test
    mockOnCreateTask.mockClear();
  });

  it("renders form fields and submit button", () => {
    render(<AddTaskForm onCreateTask={mockOnCreateTask} isCreating={false} />);

    expect(screen.getByLabelText(/Title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
    expect(
      screen.getByRole("group", { name: /Due Date/i })
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/Day/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Month/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Year/i)).toBeInTheDocument();
    expect(
      screen.getByRole("group", { name: /Due Time/i })
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/Hour/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Minute/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Add Task/i })
    ).toBeInTheDocument();
  });

  it("allows typing into fields", async () => {
    render(<AddTaskForm onCreateTask={mockOnCreateTask} isCreating={false} />);

    const titleInput = screen.getByLabelText(/Title/i);
    const dayInput = screen.getByLabelText(/Day/i);
    const monthInput = screen.getByLabelText(/Month/i);
    const yearInput = screen.getByLabelText(/Year/i);
    const hourInput = screen.getByLabelText(/Hour/i);
    const minuteInput = screen.getByLabelText(/Minute/i);

    await user.type(titleInput, "Test Task Title");
    await user.type(dayInput, "15");
    await user.type(monthInput, "08");
    await user.type(yearInput, "2024");
    await user.type(hourInput, "14");
    await user.type(minuteInput, "30");

    expect(titleInput).toHaveValue("Test Task Title");
    expect(dayInput).toHaveValue("15");
    expect(monthInput).toHaveValue("08");
    expect(yearInput).toHaveValue("2024");
    expect(hourInput).toHaveValue("14");
    expect(minuteInput).toHaveValue("30");
  });

  it("calls onCreateTask with correct data on valid submission", async () => {
    render(<AddTaskForm onCreateTask={mockOnCreateTask} isCreating={false} />);

    await user.type(screen.getByLabelText(/Title/i), "Valid Task");
    await user.type(screen.getByLabelText(/Day/i), "25");
    await user.type(screen.getByLabelText(/Month/i), "12");
    await user.type(screen.getByLabelText(/Year/i), "2024");
    await user.type(screen.getByLabelText(/Hour/i), "09");
    await user.type(screen.getByLabelText(/Minute/i), "00");

    await user.click(screen.getByRole("button", { name: /Add Task/i }));

    const expectedTaskData: TaskCreate = {
      title: "Valid Task",
      description: null, // Description is optional, defaulting to null
      due_date: "2024-12-25T09:00:00",
    };

    expect(mockOnCreateTask).toHaveBeenCalledTimes(1);
    expect(mockOnCreateTask).toHaveBeenCalledWith(expectedTaskData);

    // Optional: Check if fields are cleared after submission (as per component logic)
    expect(screen.getByLabelText(/Title/i)).toHaveValue("");
    expect(screen.getByLabelText(/Day/i)).toHaveValue("");
  });

  it("shows client-side validation errors for empty required fields", async () => {
    render(<AddTaskForm onCreateTask={mockOnCreateTask} isCreating={false} />);

    await user.click(screen.getByRole("button", { name: /Add Task/i }));

    expect(await screen.findByText(/Enter a title/i)).toBeInTheDocument();
    expect(await screen.findByText(/Enter a due date/i)).toBeInTheDocument();
    expect(await screen.findByText(/Enter a due time/i)).toBeInTheDocument();
    expect(mockOnCreateTask).not.toHaveBeenCalled();
  });

  it("shows client-side validation errors for invalid date/time formats", async () => {
    render(<AddTaskForm onCreateTask={mockOnCreateTask} isCreating={false} />);

    await user.type(screen.getByLabelText(/Title/i), "Invalid Date Task");
    await user.type(screen.getByLabelText(/Day/i), "32"); // Invalid day
    await user.type(screen.getByLabelText(/Month/i), "13"); // Invalid month
    await user.type(screen.getByLabelText(/Year/i), "202"); // Invalid year
    await user.type(screen.getByLabelText(/Hour/i), "25"); // Invalid hour
    await user.type(screen.getByLabelText(/Minute/i), "60"); // Invalid minute

    await user.click(screen.getByRole("button", { name: /Add Task/i }));

    expect(await screen.findByText(/Enter a real date/i)).toBeInTheDocument();
    expect(await screen.findByText(/Enter a real time/i)).toBeInTheDocument();
    expect(mockOnCreateTask).not.toHaveBeenCalled();
  });

  it("displays server errors next to corresponding fields", () => {
    const serverErrors = [
      { message: "Server Title Error", fieldId: "#title" },
      { message: "Server Date Error", fieldId: "#due-date-day" },
      { message: "Server Time Error", fieldId: "#due-time-hour" },
      { message: "Generic Server Error", fieldId: undefined }, // Test unassociated error
    ];

    render(
      <AddTaskForm
        onCreateTask={mockOnCreateTask}
        isCreating={false}
        serverErrors={serverErrors}
      />
    );

    // Check error messages associated with specific inputs
    expect(screen.getByText("Server Title Error")).toBeInTheDocument();
    expect(screen.getByLabelText(/Title/i)).toHaveAttribute(
      "aria-describedby",
      "title-error"
    );

    expect(screen.getByText("Server Date Error")).toBeInTheDocument();
    // Check the aria-describedby on the fieldset for date/time group errors
    expect(screen.getByRole("group", { name: /Due Date/i })).toHaveAttribute(
      "aria-describedby",
      expect.stringContaining("due-date-error")
    );

    expect(screen.getByText("Server Time Error")).toBeInTheDocument();
    expect(screen.getByRole("group", { name: /Due Time/i })).toHaveAttribute(
      "aria-describedby",
      expect.stringContaining("due-time-error")
    );

    // Note: The component doesn't display generic server errors not linked to a fieldId
    expect(screen.queryByText("Generic Server Error")).not.toBeInTheDocument();
  });

  it("disables submit button when isCreating is true", () => {
    render(<AddTaskForm onCreateTask={mockOnCreateTask} isCreating={true} />);

    expect(
      screen.getByRole("button", { name: /Adding Task.../i })
    ).toBeDisabled();
  });
});
