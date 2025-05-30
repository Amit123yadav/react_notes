import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "../App";
import * as notesApi from "../api/notes";

jest.mock("../api/notes");

const mockNotes = [
  { _id: 1, title: "Test Note", content: "This is test note." },
];

describe("App Component", () => {
  beforeEach(() => {
    (notesApi.getAllNotes as jest.Mock).mockResolvedValue(mockNotes);
    (notesApi.createNote as jest.Mock).mockImplementation((note) =>
      Promise.resolve({ ...note, _id: 2 })
    );
    (notesApi.updateNote as jest.Mock).mockResolvedValue([]);
    (notesApi.deleteNote as jest.Mock).mockResolvedValue({ message: "Deleted" });
  });

  test("renders notes from API", async () => {
    render(<App />);
    expect(
      await screen.findByRole("heading", { name: /Test Note/i })
    ).toBeInTheDocument();
  });

  test("adds a new note", async () => {
    render(<App />);

    fireEvent.change(screen.getByPlaceholderText("Enter title"), {
      target: { value: "New Note" },
    });

    fireEvent.change(screen.getByPlaceholderText("Enter Note"), {
      target: { value: "New note content" },
    });

    fireEvent.click(screen.getByText("Add Note"));

    await waitFor(() => {
      expect(notesApi.createNote).toHaveBeenCalledWith({
        title: "New Note",
        content: "New note content",
      });
    });
  });

  test("edits an existing note", async () => {
    render(<App />);
    const editButton = await screen.findByText("Edit");
    fireEvent.click(editButton);

    const titleInput = screen.getByPlaceholderText("Enter title");
    expect((titleInput as HTMLInputElement).value).toBe("Test Note");
  });

  test("deletes a note", async () => {
    render(<App />);
    const deleteButton = await screen.findByText("X");
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(notesApi.deleteNote).toHaveBeenCalledWith(1);
    });
  });
});
