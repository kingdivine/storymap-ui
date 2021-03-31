import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders 'Storymap' title", () => {
  render(<App />);
  const linkElement = screen.getByText(/Storymap/i);
  expect(linkElement).toBeInTheDocument();
});
