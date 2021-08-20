let myLibrary = [];
const container = document.querySelector(".container");
const addNewBtn = document.querySelector(".add-new-button");
const form = document.querySelector(".form");
const titleInput = document.querySelector("#title-input");
const authorInput = document.querySelector("#author-input");
const pagesInput = document.querySelector("#pages-input");
const readInput = document.querySelector("#read");
const submitBtn = document.querySelector(".submit-button");
const closeFormBtn = document.querySelector(".close-form");
const storage = window.localStorage;
let bookCounter = 0;


//Data structures
function Book(id, title, author, pages, read) {
  this.id = id;
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
  this.info = function () {
    return `${title} by ${author}, ${pages} pages, ${read ? "read" : "not yet read"}`;
  };
  this.toggleReadStatus = function () {
    if (this.read) {
      this.read = false;
    } else {
      this.read = true;
    }
  };
}

//Event listeners
submitBtn.addEventListener("click", submitNewBook);
addNewBtn.addEventListener("click", displayForm);
closeFormBtn.addEventListener("click", displayForm);
form.addEventListener("transitionend", formHandler);
window.addEventListener('load', onLoad);

function addBookToLibrary(title, author, pages, read) {
  let inLibrary = false;
  let checkLibrary = (title, author) => {
    let newTitle = title;
    let currentTitle;
    myLibrary.forEach((book) => {
      currentTitle = book.title;
      if (currentTitle === newTitle) {
        let newAuthor = author;
        let currentAuthor = book.author;
        if(newAuthor === currentAuthor){
            alert('This book is already in your library.');
            inLibrary = true;
      }}
    });
  };
  checkLibrary(title);
  if(inLibrary) return;
  let id = myLibrary.length;
  newBook = new Book(id, title, author, pages, read);
  myLibrary.push(newBook);
  createLibrary();
}

function createLibrary(){
    container.innerHTML = "";
    myLibrary.forEach((book) => {
      const card = document.createElement("div");
      card.classList.add("card");
      card.setAttribute("data-id", book.id);
      for (let prop in book) {
        if (prop !== "id" && prop !== "info" && prop !== "toggleReadStatus") {
          const p = document.createElement("p");
          if (book[prop] === false) {
            p.textContent = `Read Status: Unread`;
          } else if (book[prop] === true) {
            p.textContent = `Read Status: Read`;
          } else {
            let propName = prop[0].toUpperCase() + prop.substring(1);
            p.textContent = `${propName}: ${book[prop]}`;
            if (prop === "title") {
              p.classList.add("bold");
            }
          }
          card.appendChild(p);
        }
      }
      const readBtn = document.createElement("button");
      readBtn.textContent = `${book.read ? "Unread" : "Read"} `;
      readBtn.classList.add("read-button");
      readBtn.addEventListener("click", invokeToggleReadStatus);
      const removeBtn = document.createElement("button");
      removeBtn.textContent = "Remove";
      removeBtn.addEventListener("click", removeBook);
      removeBtn.classList.add("remove-button");
      const buttonDiv = document.createElement("div");
      buttonDiv.classList.add("button-div");
      buttonDiv.appendChild(readBtn);
      buttonDiv.appendChild(removeBtn);
      card.appendChild(buttonDiv);
      container.appendChild(card);
    });
    setBooks();
}

function setBooks(){
    storage.setItem('books', JSON.stringify(myLibrary));
}

function submitNewBook() {
  let title = titleInput.value;
  let author = authorInput.value;
  let numOfPages = Number(pagesInput.value);
  if (!title || !author) {
    alert(`Missing information: ${!title ? "title" : "author"}`);
    return;
  }
  if (numOfPages === 0) {
    alert(`Missing information: number of pages`);
    return;
  }
  let readYes = read.checked;
  addBookToLibrary(title, author, numOfPages, readYes);
  titleInput.value = "";
  authorInput.value = "";
  pagesInput.value = 0;
  read.checked = false;
}

function displayForm() {
  form.classList.toggle("form-active");
  addNewBtn.classList.add("button-inactive");
}

function removeBook(e) {
  let elId = e.target.parentElement.parentElement.dataset.id;
  let el = e.target.parentElement.parentElement;
  el.remove();
  let book = myLibrary.splice(elId, 1);
  createLibrary();
  console.log(myLibrary);
  setBooks();
}

function invokeToggleReadStatus(e) {
  let elId = e.target.parentElement.parentElement.dataset.id;
  console.log(e.target.parentElement.parentElement.dataset.id);
  let status = myLibrary[elId].read;
  myLibrary[elId].toggleReadStatus();
  status = myLibrary[elId].read;
  e.target.parentElement.parentElement.childNodes[3].textContent = `Read Status: ${
    status ? "Read" : "Unread"
  }`;
}

function formHandler() {
  if (form.classList.contains("form-active")) return;
  addNewBtn.classList.remove("button-inactive");
}

function onLoad(){
    myLibrary = JSON.parse(storage.getItem('books'));
    createLibrary();
}