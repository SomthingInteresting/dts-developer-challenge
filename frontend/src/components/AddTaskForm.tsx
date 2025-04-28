import React, { useState } from "react";
import { TaskCreate } from "../types/task";

// Re-import AppError type if it was defined in App.tsx, or define it here
// Assuming it might be better defined globally or passed correctly
interface AppError {
  message: string;
  fieldId?: string;
}

interface DateObject {
  day: string;
  month: string;
  year: string;
}

interface FormErrors {
  title?: string;
  date?: string;
  time?: string;
}

interface AddTaskFormProps {
  onCreateTask: (taskData: TaskCreate) => void;
  isCreating: boolean;
  serverErrors?: AppError[]; // Add serverErrors prop
}

const AddTaskForm: React.FC<AddTaskFormProps> = ({
  onCreateTask,
  isCreating,
  serverErrors = [], // Default to empty array
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState<DateObject>({
    day: "",
    month: "",
    year: "",
  });
  const [dueTime, setDueTime] = useState({ hour: "", minute: "" });
  const [errors, setErrors] = useState<FormErrors>({});

  // Helper to find server error for a specific field ID
  const getServerErrorMessage = (fieldId: string): string | undefined => {
    return serverErrors.find((err) => err.fieldId === fieldId)?.message;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Clear only client-side errors on new submission attempt
    setErrors({});
    let formIsValid = true;
    const newErrors: FormErrors = {};

    if (!title.trim()) {
      newErrors.title = "Enter a title";
      formIsValid = false;
    }

    const { day, month, year } = dueDate;
    if (!day || !month || !year) {
      newErrors.date = "Enter a due date";
      formIsValid = false;
    } else {
      const dayNum = parseInt(day);
      const monthNum = parseInt(month);
      const yearNum = parseInt(year);
      const dateObj = new Date(yearNum, monthNum - 1, dayNum);
      if (
        isNaN(dayNum) ||
        isNaN(monthNum) ||
        isNaN(yearNum) ||
        year.length !== 4 ||
        isNaN(dateObj.getTime()) ||
        dateObj.getFullYear() !== yearNum ||
        dateObj.getMonth() !== monthNum - 1 ||
        dateObj.getDate() !== dayNum
      ) {
        newErrors.date = "Enter a real date";
        formIsValid = false;
      }
    }

    const { hour, minute } = dueTime;
    if (!hour || !minute) {
      newErrors.time = "Enter a due time";
      formIsValid = false;
    } else {
      const hourNum = parseInt(hour);
      const minuteNum = parseInt(minute);
      if (
        isNaN(hourNum) ||
        isNaN(minuteNum) ||
        hourNum < 0 ||
        hourNum > 23 ||
        minuteNum < 0 ||
        minuteNum > 59
      ) {
        newErrors.time = "Enter a real time (HH: 00-23, MM: 00-59)";
        formIsValid = false;
      }
    }

    if (!formIsValid) {
      setErrors(newErrors);
      return;
    }

    const formattedDueDate = `${year}-${month.padStart(2, "0")}-${day.padStart(
      2,
      "0"
    )}`;
    const formattedDueTime = `${hour.padStart(2, "0")}:${minute.padStart(
      2,
      "0"
    )}:00`;

    const newTask: TaskCreate = {
      title,
      description: description || null,
      due_date: `${formattedDueDate}T${formattedDueTime}`,
    };

    onCreateTask(newTask);

    setTitle("");
    setDescription("");
    setDueDate({ day: "", month: "", year: "" });
    setDueTime({ hour: "", minute: "" });
  };

  // Pre-calculate server errors for cleaner rendering
  const serverTitleError = getServerErrorMessage("#title");
  const serverDateError = getServerErrorMessage("#due-date-day");
  const serverTimeError = getServerErrorMessage("#due-time-hour");

  return (
    <fieldset className="govuk-fieldset">
      <legend className="govuk-fieldset__legend govuk-fieldset__legend--m">
        Add New Task
      </legend>

      <form onSubmit={handleSubmit} noValidate>
        <div
          className={`govuk-form-group ${
            errors.title || serverTitleError ? "govuk-form-group--error" : ""
          }`}
        >
          <label className="govuk-label govuk-label--m" htmlFor="title">
            Title
          </label>
          {(errors.title || serverTitleError) && (
            <p id="title-error" className="govuk-error-message">
              <span className="govuk-visually-hidden">Error:</span>{" "}
              {serverTitleError || errors.title}
            </p>
          )}
          <input
            className={`govuk-input ${
              errors.title || serverTitleError ? "govuk-input--error" : ""
            }`}
          id="title"
          name="title"
            type="text"
            value={title}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setTitle(e.target.value)
            }
            required
            aria-describedby={
              errors.title || serverTitleError ? "title-error" : undefined
            }
          />
        </div>

        <div className="govuk-form-group">
          <label className="govuk-label" htmlFor="description">
            Description (Optional)
          </label>
          <textarea
            className="govuk-textarea"
          id="description"
            name="description"
            rows={5}
            value={description}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setDescription(e.target.value)
            }
          />
        </div>

        <div
          className={`govuk-form-group ${
            errors.date || serverDateError ? "govuk-form-group--error" : ""
          }`}
        >
          <fieldset
            className="govuk-fieldset"
            role="group"
            aria-describedby={`due-date-hint${
              errors.date || serverDateError ? " due-date-error" : ""
            }`}
          >
            <legend className="govuk-fieldset__legend govuk-fieldset__legend--s">
              Due Date
            </legend>
            <div id="due-date-hint" className="govuk-hint">
              For example, 27 3 2024
            </div>
            {(errors.date || serverDateError) && (
              <p id="due-date-error" className="govuk-error-message">
                <span className="govuk-visually-hidden">Error:</span>{" "}
                {serverDateError || errors.date}
              </p>
            )}
            <div className="govuk-date-input" id="due-date">
              <div className="govuk-date-input__item">
                <div className="govuk-form-group">
                  <label
                    className="govuk-label govuk-date-input__label"
                    htmlFor="due_date_day"
                  >
                    Day
                  </label>
                  <input
                    className={`govuk-input govuk-date-input__input govuk-input--width-2 ${
                      errors.date || serverDateError ? "govuk-input--error" : ""
                    }`}
                    id="due_date_day"
                    name="due_date_day"
                    type="text"
                    value={dueDate.day}
                    onChange={(e) =>
                      setDueDate({ ...dueDate, day: e.target.value })
                    }
                    pattern="[0-9]*"
                    inputMode="numeric"
                  />
                </div>
              </div>
              <div className="govuk-date-input__item">
                <div className="govuk-form-group">
                  <label
                    className="govuk-label govuk-date-input__label"
                    htmlFor="due_date_month"
                  >
                    Month
                  </label>
                  <input
                    className={`govuk-input govuk-date-input__input govuk-input--width-2 ${
                      errors.date || serverDateError ? "govuk-input--error" : ""
                    }`}
                    id="due_date_month"
                    name="due_date_month"
                    type="text"
                    value={dueDate.month}
                    onChange={(e) =>
                      setDueDate({ ...dueDate, month: e.target.value })
                    }
                    pattern="[0-9]*"
                    inputMode="numeric"
                  />
                </div>
              </div>
              <div className="govuk-date-input__item">
                <div className="govuk-form-group">
                  <label
                    className="govuk-label govuk-date-input__label"
                    htmlFor="due_date_year"
                  >
                    Year
                  </label>
                  <input
                    className={`govuk-input govuk-date-input__input govuk-input--width-4 ${
                      errors.date || serverDateError ? "govuk-input--error" : ""
                    }`}
                    id="due_date_year"
                    name="due_date_year"
                    type="text"
                    value={dueDate.year}
                    onChange={(e) =>
                      setDueDate({ ...dueDate, year: e.target.value })
                    }
                    pattern="[0-9]*"
                    inputMode="numeric"
                  />
                </div>
              </div>
            </div>
          </fieldset>
        </div>

        <div
          className={`govuk-form-group ${
            errors.time || serverTimeError ? "govuk-form-group--error" : ""
          }`}
        >
          <fieldset
            className="govuk-fieldset"
            role="group"
            aria-describedby={`due-time-hint${
              errors.time || serverTimeError ? " due-time-error" : ""
            }`}
          >
            <legend className="govuk-fieldset__legend govuk-fieldset__legend--s">
              Due Time (HH:MM)
            </legend>
            <div id="due-time-hint" className="govuk-hint">
              Use 24 hour format. For example, 14:30
            </div>
            {(errors.time || serverTimeError) && (
              <p id="due-time-error" className="govuk-error-message">
                <span className="govuk-visually-hidden">Error:</span>{" "}
                {serverTimeError || errors.time}
              </p>
            )}
            <div className="govuk-date-input" id="due-time">
              <div className="govuk-date-input__item">
                <div className="govuk-form-group">
                  <label
                    className="govuk-label govuk-date-input__label"
                    htmlFor="due_time_hour"
                  >
                    Hour
                  </label>
                  <input
                    className={`govuk-input govuk-date-input__input govuk-input--width-2 ${
                      errors.time || serverTimeError ? "govuk-input--error" : ""
                    }`}
                    id="due_time_hour"
                    name="due_time_hour"
                    type="text"
                    value={dueTime.hour}
                    onChange={(e) =>
                      setDueTime({ ...dueTime, hour: e.target.value })
                    }
                    pattern="[0-9]*"
                    inputMode="numeric"
                    maxLength={2}
                  />
                </div>
              </div>
              <div className="govuk-date-input__item">
                <div className="govuk-form-group">
                  <label
                    className="govuk-label govuk-date-input__label"
                    htmlFor="due_time_minute"
                  >
                    Minute
                  </label>
                  <input
                    className={`govuk-input govuk-date-input__input govuk-input--width-2 ${
                      errors.time || serverTimeError ? "govuk-input--error" : ""
                    }`}
                    id="due_time_minute"
                    name="due_time_minute"
                    type="text"
                    value={dueTime.minute}
                    onChange={(e) =>
                      setDueTime({ ...dueTime, minute: e.target.value })
                    }
                    pattern="[0-9]*"
                    inputMode="numeric"
                    maxLength={2}
                  />
                </div>
              </div>
            </div>
          </fieldset>
        </div>

        <button
          type="submit"
          className="govuk-button"
          data-module="govuk-button"
          disabled={isCreating}
        >
          {isCreating ? "Adding Task..." : "Add Task"}
        </button>
      </form>
    </fieldset>
  );
};

export default AddTaskForm;
