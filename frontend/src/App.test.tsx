import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";

describe("App", () => {
  it("renders the main heading", () => {
    const queryClient = new QueryClient();

    render(
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    );

    // Check if the main heading "Tasks" is present
    // Use a case-insensitive match and check for heading role
    const heading = screen.getByRole("heading", { name: /tasks/i, level: 1 });
    expect(heading).toBeInTheDocument();
  });
});
