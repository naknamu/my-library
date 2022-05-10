//constructor
function Book(title, author, pages, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
}

Book.prototype.info = function() {
    return this.title + " by " + this.author + ", " + this.pages + " pages" + " ," + this.read;
}

const theHobbit = new Book("The Hobbit", "J.R.R. Tolkien", '295', 'not read yet');

// console.log(theHobbit.info());

let addBook = true;
function addBookToLibrary() {
    //function that can take user input 
    let bookTitle = prompt("Enter the book title: ", "");
    let bookAuthor = prompt("Who is the author: ", '');
    let bookPages = prompt("Number of pages: ", "");
    let bookRead = prompt("Have you read this book?: ", '');
    addBook = confirm("Add another book?");

    //add all user inputs to the constructor
    const newBook = new Book(bookTitle, bookAuthor, bookPages, bookRead);

    //prints new Book object to the console
    // console.log(newBook.info());

    //store the new book objects into an array
    myLibrary.push(newBook);

    return addBook;
}

//array where all of book objects are stored
let myLibrary = [];


//function that loops through the array and displays each book on the page
function displayAllBook() {
    for (let i=0; i<myLibrary.length; i++)
    {
        console.log(myLibrary[i]);
    }
}

// addBookToLibrary();
// displayAllBook();

//function to add multiple books to the library
//and prints at the end
function addMultipleBooks() {
    while (addBook) {
        addBookToLibrary();
    }

    displayAllBook();
}

// addMultipleBooks();

