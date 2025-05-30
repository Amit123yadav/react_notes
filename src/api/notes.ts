export type Note = {
  _id: number;
  title: string;
  content: string;
};

export type NoteForm = {
  title: string;
  content: string;
};

const API_BASE = "http://localhost:5000/api/notes";

export const getAllNotes = async (): Promise<Note[]> => {
  const res = await fetch(API_BASE);
  if (!res.ok) throw new Error("Failed to fetch notes");
  return res.json();
};

export const createNote = async (data: NoteForm): Promise<Note> => {
  const res = await fetch(API_BASE, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create notes");
  return res.json();
};

export const updateNote = async (
  id: Number,
  data: NoteForm
): Promise<Note[]> => {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "PUT",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ ...data, new: true }),
  });
  if (!res.ok) throw new Error("Failed to update notes");
  return res.json();
};

export const deleteNote = async (id: Number): Promise<{ message: string }> => {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "DELETE",
    headers: { "content-type": "application/json" },
  });
  if (!res.ok) throw new Error("Failed to delete notes");
  return res.json();
};
