const books = [];
const RENDER_EVENT = "render-book";

document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("inputBook");

  submitForm.addEventListener("submit", function (event) {
    event.preventDefault();
    addBook();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

function addBook() {
  const title = document.getElementById("inputBookTitle").value.toUpperCase();
  const author = document.getElementById("inputBookAuthor").value;
  const year = parseInt(document.getElementById("inputBookYear").value);
  const isComplete = document.getElementById("inputBookIsComplete").checked;

  const generatedID = generateId();
  const bookObject = generateBookObject(generatedID, title, author, year, isComplete);
  books.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));

  saveData();
}

function generateId() {
  return +new Date();
}

function generateBookObject(id, title, author, year, isComplete) {
  return {
    id,
    title,
    author,
    year,
    isComplete,
  };
}

document.addEventListener(RENDER_EVENT, function () {
  const uncompletedBookList = document.getElementById("incompleteBookshelfList");
  uncompletedBookList.innerHTML = "";

  const completedBookList = document.getElementById("completeBookshelfList");
  completedBookList.innerHTML = "";

  for (bookItem of books) {
    const bookElement = makeBook(bookItem);

    if (!bookItem.isComplete) uncompletedBookList.append(bookElement);
    else completedBookList.append(bookElement);
  }
});

function makeBook(bookObject) {
  const textTitle = document.createElement("h3");
  textTitle.innerText = bookObject.title;

  const textAuthor = document.createElement("p");
  textAuthor.innerText = `Penulis : ${bookObject.author}`;

  const textYear = document.createElement("p");
  textYear.innerText = `Tahun : ${bookObject.year}`;

  const textContainer = document.createElement("div");
  textContainer.classList.add("action");

  const container = document.createElement("article");
  container.classList.add("book_item");
  container.setAttribute("id", `book-${bookObject.id}`);
  container.append(textTitle, textAuthor, textYear, textContainer);

  if (bookObject.isComplete) {
    const undoButton = document.createElement("button");
    undoButton.classList.add("green");
    undoButton.innerText = "Belum selesai di Baca";
    undoButton.addEventListener("click", function () {
      undoTaskFromCompleted(bookObject.id);
    });

    const trashButton = document.createElement("button");
    trashButton.classList.add("red");
    trashButton.innerText = "Hapus Buku";
    trashButton.addEventListener("click", function () {
      removeTaskFromCompleted(bookObject.id);
    });

    textContainer.append(undoButton, trashButton);
  } else {
    const checkButton = document.createElement("button");
    checkButton.classList.add("green");
    checkButton.innerText = "Selesai dibaca";
    checkButton.addEventListener("click", function () {
      addTaskToCompleted(bookObject.id);
    });

    const trashButton = document.createElement("button");
    trashButton.classList.add("red");
    trashButton.innerText = "Hapus Buku";
    trashButton.addEventListener("click", function () {
      removeTaskFromCompleted(bookObject.id);
    });

    textContainer.append(checkButton, trashButton);
  }

  return container;
}

function addTaskToCompleted(bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;

  bookTarget.isComplete = true;
  document.dispatchEvent(new Event(RENDER_EVENT));

  saveData();
}

function removeTaskFromCompleted(bookId) {
  const bookTargetIndex = findBookIndex(bookId);
  if (bookTargetIndex === -1) return;
  books.splice(bookTargetIndex, 1);

  document.dispatchEvent(new Event(RENDER_EVENT));

  saveData();
}

function undoTaskFromCompleted(bookId) {
  const bookTarget = findBook(bookId);
  if (bookTarget == null) return;

  bookTarget.isComplete = false;
  document.dispatchEvent(new Event(RENDER_EVENT));

  saveData();
}

function findBook(bookId) {
  for (bookItem of books) {
    if (bookItem.id === bookId) {
      return bookItem;
    }
  }
  return null;
}

function findBookIndex(bookId) {
  for (let index = 0; index < books.length; index++) {
    if (books[index].id === bookId) {
      return index;
    }
  }
  return -1;
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "book_APPS";

function isStorageExist() {
  if (typeof Storage === "undefined") {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);

  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

const searchButton = document.getElementById("searchSubmit");
searchButton.addEventListener("click", function (event) {
  const searchBookTitle = document.getElementById("searchBookTitle").value.toLowerCase();
  const titles = document.querySelectorAll(".book_item h3");

  for (bookTitle of titles) {
    const titleText = bookTitle.innerText.toLowerCase();

    if (titleText.includes(searchBookTitle)) {
      bookTitle.closest(".book_item").style.display = "";
    } else {
      bookTitle.closest(".book_item").style.display = "none";
    }
  }

  event.preventDefault();
});

function openForm() {
  document.getElementById("myForm").style.display = "block";
}

function closeForm() {
  document.getElementById("myForm").style.display = "none";
}
