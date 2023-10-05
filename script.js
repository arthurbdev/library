const bookContainerElement = document.getElementById("libraryContainer");
const addBookBtn = document.getElementById("addBookBtn");
const addBookDialog = document.getElementById("addBookDialog");
const confirmBtn = document.getElementById("confirmBtn");
const form = document.querySelector("form");
const authorInput = document.getElementById("authorInput");
const titleInput = document.getElementById("titleInput");
const pageInput = document.getElementById("pageInput");
const imageUrlInput = document.getElementById("imgUrlInput");
const ifReadInput = document.querySelectorAll("input[name='ifRead']");


function Book(title, author, pages, isRead = false, coverImgUrl) {
  this.author = author;
  this.title = title;
  this.pages = pages;
  this.isRead = isRead;
  if(coverImgUrl) this.coverImgUrl = coverImgUrl;
}

Book.prototype.toggleRead = function() {
  this.isRead = !this.isRead;
}


function Library() {
  this.books = [];
}

Library.prototype.addBook = function(book) {
  // let newBook = new Book(title, author, pages, isRead, coverImgUrl);
  // let newBookId = this.books.length;
  this.books.push(book);

  // return new book id
  return this.books.length - 1;
}

Library.prototype.removeBook = function(bookId) {
  this.books.splice(bookId, 1);
}

function DisplayController(){
  this.library = new Library();
}

DisplayController.prototype.drawLibrary = function() {
  bookContainerElement.replaceChildren();

  this.library.books.forEach((book, index) => {
    this.drawBook(book, index);
  });
}

DisplayController.prototype.drawBook = function(book, index) {
  let bookElement = document.createElement("div");
  bookElement.className = "bookContainer";
  bookElement.dataset.indexNumber = index;

  let authorElement, titleElement, pageNum, isRead, coverImg;

  coverImg = document.createElement("img");
  if(book.coverImgUrl) coverImg.src = book.coverImgUrl;
  else coverImg.src = "./nocover.png";
  coverImg.className = "coverImage"
  bookElement.appendChild(coverImg);

  titleElement = document.createElement("h2");
  titleElement.innerHTML = book.title;
  bookElement.appendChild(titleElement);

  authorElement = document.createElement("p");
  authorElement.innerHTML = `By ${book.author}`;
  bookElement.appendChild(authorElement);

  pageNum = document.createElement("p");
  pageNum.innerHTML = `Pages: ${book.pages}`;
  pageNum.className = "pages";
  bookElement.appendChild(pageNum);
  
  isRead = document.createElement("input");
  isRead.className  = "readToggle";
  isRead.type = "checkbox";
  isRead.checked = book.isRead;
  if(book.isRead) isRead.innerHTML = "read";
isRead.addEventListener("click", () => {
    book.toggleRead();
    isRead.innerHTML = book.isRead ? "Read" : "Unread";
  });
  bookElement.appendChild(isRead);

  let removeBookElement = document.createElement("button");
  removeBookElement.className = "removeButton";
  removeBookElement.addEventListener("click", () => display.removeBook(index));
  bookElement.appendChild(removeBookElement);
  bookContainerElement.appendChild(bookElement);
}

DisplayController.prototype.removeBook = function(bookId) {
  this.library.removeBook(bookId)
  let bookElement;
  for (let book of bookContainerElement.children) {
    if(parseInt(book.dataset.indexNumber) === bookId)
      bookElement = book;
  }

  // remove element with fadeout animation, took from here:
  // https://stackoverflow.com/a/33424474
  bookElement.style.transition = "opacity 0.8s ease";
  bookElement.style.opacity = 0;
  setTimeout(function(){
    bookContainerElement.removeChild(bookElement);
  }, 800)
}

let display = new DisplayController();

display.library.addBook(new Book("Testbook1", "TestAuthor1", "100", true))
display.library.addBook(new Book("Testbook2", "TestAuthor1", "400", true)) 
display.library.addBook(new Book("Testbook3", "TestAuthor1", "300", true))
display.library.addBook(new Book("Testbook4", "TestAuthor1", "200", true))
display.library.addBook(new Book("Testbook5", "TestAuthor1", "100", false, "https://imgv2-1-f.scribdassets.com/img/word_document/342870203/original/0f5318de2d/1571483150?v=1"))

display.drawLibrary();

form.addEventListener("submit", (e) => {
  e.preventDefault();
  let ifRead;
  ifReadInput.forEach(item => { if (item.checked) ifRead = item }  )
  ifRead = ifRead.value === "read" ? true : false;
  let newBookId;
  let newBook = new Book(titleInput.value, authorInput.value, pageInput.value, ifRead, imageUrlInput.value);
  newBookId = display.library.addBook(newBook);
  display.drawBook(newBook, newBookId);
  addBookDialog.close();
  clearInputFields();
}) 

function clearInputFields() {
  titleInput.value = '';
  authorInput.value = '';
  pageInput.value = '';
}

addBookBtn.addEventListener("click", () => {
  addBookDialog.showModal();
})
