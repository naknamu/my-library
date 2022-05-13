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


//store each input data in the form into a corresponding variable
function getFormData(){
    let user_input_title = document.querySelector("#book_title");
    let user_input_author = document.querySelector("#book_author");
    let user_input_pages = document.querySelector('#book_pages');
    let user_input_overview = document.querySelector('#book_overview');
    let user_input_status = document.getElementsByName('read_status');

    console.log(user_input_title.value);
    console.log(user_input_author.value);
    console.log(user_input_pages.value);
    console.log(user_input_overview.value);
    //
    for (let i=0, length = user_input_status.length; i<length; i++){
        if (user_input_status[i].checked) {
            if (user_input_status[i].id == 'read_yes'){
                console.log("yes");
            }
            else{
                console.log("no");
            }
            // only one radio can be logically checked, don't check the rest
            break;
        }
    }
}

//create new card element 
function createCard(){
    //locate container div
    const maincontent = document.querySelector('.maincontent');
    //create new div element with card as classname
    const card = document.createElement('div');
    card.classList.add('card');

    //create elements inside the card
    //image element
    const book_image = document.createElement('img');
    book_image.style.width = '300px';
    book_image.style.maxHeight = '500px';
    book_image.src = "images/harrypotter.jpg";
    //title element
    const book_title = document.createElement('div');
    book_title.classList.add('title');
    book_title.textContent = 'Dragon Ball Z';


    maincontent.appendChild(card);
    card.appendChild(book_image);
    card.appendChild(book_title);

    console.log(book_image);
}

createCard();
