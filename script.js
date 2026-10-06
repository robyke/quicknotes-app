const form = document.querySelector("#note-form");
const input = document.querySelector("#note-input");
const categorySelect = document.querySelector("#note-category");
const searchInput = document.querySelector("#search-input");
const notesList = document.querySelector("#notes-list");
const noteCount = document.querySelector("#note-count");
const errorMessage = document.querySelector("#error-message");

const STORAGE_KEY = "quicknotes-project";

let notes = loadNotes();

function loadNotes() {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : [];
}

function saveNotes() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

function updateCount() {
  if (notes.length === 0) {
    noteCount.textContent = "You have no notes yet.";
  } else if (notes.length === 1) {
    noteCount.textContent = "You have 1 note.";
  } else {
    noteCount.textContent = `You have ${notes.length} notes.`;
  }
}

function deleteNote(id) {
  notes = notes.filter((note) => note.id !== id);
  saveNotes();
  render();
}

function render() {
  notesList.innerHTML = "";

  const searchText = searchInput.value.trim().toLowerCase();

  const filteredNotes = notes.filter((note) =>
    note.text.toLowerCase().includes(searchText)
  );

  if (searchText !== "" && filteredNotes.length === 0) {
    const message = document.createElement("li");
    message.textContent = "No notes match your search.";
    notesList.appendChild(message);
  } else {
    filteredNotes.forEach((note) => {
      const li = document.createElement("li");
      li.classList.add("note", `category-${note.category}`);

      const header = document.createElement("div");
      header.classList.add("note-header");

      const category = document.createElement("span");
      category.classList.add("note-category");
      category.textContent = note.category;

      const date = document.createElement("span");
      date.classList.add("note-date");
      date.textContent = note.createdAt;

      const text = document.createElement("p");
      text.textContent = note.text;

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.classList.add("delete-btn");

      deleteButton.addEventListener("click", () => {
        deleteNote(note.id);
      });

      header.appendChild(category);
      header.appendChild(date);

      li.appendChild(header);
      li.appendChild(text);
      li.appendChild(deleteButton);

      notesList.appendChild(li);
    });
  }

  updateCount();
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const text = input.value.trim();
  const category = categorySelect.value;

  if (text === "") {
    errorMessage.textContent = "Please type a note first.";
    return;
  }

  if (text.length > 200) {
    errorMessage.textContent = "Notes must be 200 characters or fewer.";
    return;
  }

  errorMessage.textContent = "";

  const newNote = {
    id: Date.now(),
    text: text,
    category: category,
    createdAt: new Date().toLocaleString(),
  };

  notes.push(newNote);

  saveNotes();
  render();

  input.value = "";
  input.focus();
});

searchInput.addEventListener("input", () => {
  render();
});

render();