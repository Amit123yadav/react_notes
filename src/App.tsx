import { useEffect, useState } from "react";
import {
  Note,
  NoteForm,
  getAllNotes,
  updateNote,
  deleteNote,
  createNote,
} from "./api/notes";

const App = () => {
  const [formValue, setFormValue] = useState<NoteForm>({
    title: "",
    content: "",
  });

  const [notes, setNotes] = useState<Note[]>([]);
  const [editId, setEditId] = useState<number | null>(null);

  const fetchNotes = async () => {
    try {
      const data = await getAllNotes();
      setNotes(data);
    } catch (err) {
      console.error("Failed to load notes");
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { value, name } = event.target;
    if (value !== "") {
      setFormValue((prev) => ({ ...prev, [name]: value }));
    } else {
      setFormValue((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { title, content } = formValue;
    if (!title || !content) return;

    try {
      if (editId !== null) {
        await updateNote(editId, formValue);
        setEditId(null);
      } else {
        const newNote = await createNote(formValue);
        setNotes((prev) => [...prev, newNote]);
      }
      setFormValue({ title: "", content: "" });
      fetchNotes();
    } catch (err) {
      console.error("Save failed");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteNote(id);
      fetchNotes();
    } catch (err) {
      console.error("Delete failed");
    }
  };

  const handleEdit = (id: number) => {
    const note = notes.find((n) => n._id === id);
    if (note) {
      setFormValue({ title: note.title, content: note.content });
      setEditId(id);
    }
  };

  return (
    <div className="container">
      <div className="sidebar">
        <input
          type="text"
          name="title"
          onChange={handleChange}
          value={formValue.title}
          className="inputfield"
          placeholder="Enter title"
        />
        <textarea
          rows={4}
          name="content"
          onChange={handleChange}
          value={formValue.content}
          placeholder="Enter Note"
          style={{ padding: "10px" }}
        ></textarea>
        <button
          onClick={handleSubmit}
          style={{
            padding: "4px",
            cursor: "pointer",
            backgroundColor: "violet",
            color: "white",
            borderRadius: "6px",
          }}
        >
          Add Note
        </button>
      </div>
      <div className="contentDetails">
        {notes?.map((item) => {
          return (
            <div key={item._id} className="items">
              <button
                style={{
                  float: "right",
                  cursor: "pointer",
                  marginLeft: "10px",
                  color: "red",
                }}
                onClick={() => handleDelete(item._id)}
              >
                X
              </button>
              <button
                style={{ float: "right", cursor: "pointer", color: "blue" }}
                onClick={() => handleEdit(item?._id)}
              >
                Edit
              </button>
              <h3>{item?.title}</h3>
              <p>{item?.content}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default App;
