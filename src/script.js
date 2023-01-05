import './style.css';
import './firebase';
import db from './firebase';
import { collection, addDoc } from "firebase/firestore";

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

//preview image upload
function previewImage(){
    let img = document.querySelector('#img-test');
    let preview_image = document.querySelector('#book_image');
    let fReader = new FileReader();
    // if (preview_image.files[0] === undefined) {
    //     throw console.error('Image is required!');
    // } else {
    //     fReader.readAsDataURL(preview_image.files[0]);
    //     fReader.onloadend = function(event){
    //         img.src = event.target.result;
    //     }
    // }

    try {
        fReader.readAsDataURL(preview_image.files[0]);
        fReader.onloadend = function(event){
            img.src = event.target.result;
        }
    } catch (error) {
        // alert('Book image is required!');
        console.log(error);
    }

    return img.src;
}

//when using webpack
document.querySelector('#book_image').addEventListener('change', () => {
    //Preview image uploaded
    previewImage();
})


//store each input data in the form into a corresponding variable
function getFormData(){
    let user_input_image = previewImage();
    let user_input_title = document.querySelector("#book_title");
    let user_input_author = document.querySelector("#book_author");
    let user_input_pages = document.querySelector('#book_pages');
    let user_input_overview = document.querySelector('#book_overview');
    let user_input_status = document.getElementsByName('read_status');

    // console.log(user_input_image);
    // console.log(user_input_title.value);
    // console.log(user_input_author.value);
    // console.log(user_input_pages.value);
    // console.log(user_input_overview.value);
    //
    let input_status;
    for (let i=0, length = user_input_status.length; i<length; i++){
        if (user_input_status[i].checked) {
            if (user_input_status[i].id == 'read_yes'){
                // console.log("yes");
                input_status = 'yes';
            }
            else{
                input_status = 'no';
            }
            // only one radio can be logically checked, don't check the rest
            break;
        }
    }
    if (user_input_image === "" || user_input_title.value === "" || user_input_author.value === "" || user_input_pages.value === "" || user_input_overview.value === "" || input_status === undefined) {
        // alert('Fill all empty fields!');
    } else {
        //create new card from the form
        createCard(user_input_image ,user_input_title.value, user_input_author.value, user_input_pages.value, user_input_overview.value, input_status);
        //SEND DATA TO CLOUD FIRESTORE DATABASE
        sendDataDatabase(user_input_image, user_input_title.value, user_input_author.value, user_input_pages.value, user_input_overview.value, input_status);
    }

}

//when using webpack
document.querySelector('#submit-btn').addEventListener('click', (e) => {
    e.preventDefault();
    //submit data
    getFormData();
})

//create new card element 
function createCard(image, title, author, pages, overview, status){
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
    // book_image.src = "images/harrypotter.jpg";
    book_image.src = image;
    //title element
    const book_title = document.createElement('div');
    book_title.classList.add('title');
    // book_title.textContent = 'Dragon Ball Z';
    book_title.textContent = title;
    //container of author and pages
    const container_author_pages = document.createElement('div');
    container_author_pages.classList.add('container-author-pages');
    //author
    const book_author = document.createElement('div');
    // book_author.textContent = 'by ' + "Akira Toriyama" + ',';
    book_author.textContent = 'by ' + author + ',';
    //pages
    const book_pages = document.createElement('div');
    // book_pages.textContent = '690' + ' Pages';
    book_pages.textContent = pages + ' Pages';
    //overview
    const book_overview = document.createElement('div');
    book_overview.classList.add('details');
    // book_overview.textContent = 'lorem ipsum';
    book_overview.textContent = overview;
    //container for buttons
    const container_status_remove = document.createElement('div');
    container_status_remove.classList.add('buttons');
    //status button
    const book_status = document.createElement('button');
    book_status.classList.add('status');
    //condition to check book status
    if (status == 'yes'){
        book_status.textContent = 'READ';
        book_status.style.backgroundColor = '#0284c7';
    } else {
        book_status.textContent = 'Not READ';
        book_status.style.backgroundColor = '#0c4a6e';
    }
    //change book status upon click
    book_status.addEventListener('click', () => {
        if (book_status.textContent == 'READ'){
            book_status.textContent = 'Not READ';
            book_status.style.backgroundColor = '#0c4a6e';
        } else {
            book_status.textContent = 'READ';
            book_status.style.backgroundColor = '#0284c7';
        }
    })
    //change book status bg color upon mouse hover
    book_status.addEventListener('mouseover', () => {
        if (book_status.textContent == 'READ'){
            book_status.style.backgroundColor = '#0c4a6e';
        } else {
            book_status.style.backgroundColor = '#0284c7';
        }
    })
    book_status.addEventListener('mouseout', () => {
        if(book_status.textContent == 'READ'){
            book_status.style.backgroundColor = '#0284c7';
        } else {
            book_status.style.backgroundColor = '#0c4a6e';
        }
    })
    //remove button
    const book_remove = document.createElement('button');
    book_remove.classList.add('remove');
    book_remove.textContent = "REMOVE";
    //add event listener on button click
    book_remove.addEventListener('click', () => {
        card.remove();
    })

    //add to parent div
    maincontent.appendChild(card);
    card.appendChild(book_image);
    card.appendChild(book_title);
    card.appendChild(container_author_pages);
    container_author_pages.appendChild(book_author);
    container_author_pages.appendChild(book_pages);
    card.appendChild(book_overview);
    card.appendChild(container_status_remove);
    container_status_remove.appendChild(book_status);
    container_status_remove.appendChild(book_remove);

}

//FIREBASE
async function sendDataDatabase(image, title, author, pages, overview, status) {
    try {
    const docRef = await addDoc(collection(db, "books"), {
        ImageSrc: image,
        Title: title,
        Author: author,
        Pages: pages,
        Overview: overview,
        Status: status
    });
    console.log("Document written with ID: ", docRef.id );
    } catch(e) {
        console.log("Error adding document: ", e);
    }
}


