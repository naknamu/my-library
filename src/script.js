import './style.css';
import './firebase';
import db from './firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, setDoc } from "firebase/firestore";
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

//preview image upload
function previewImage(){
    let img = document.querySelector('#img-test');
    let preview_image = document.querySelector('#book_image');
    let fReader = new FileReader();

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

    let input_status;
    for (let i=0, length = user_input_status.length; i<length; i++){
        if (user_input_status[i].checked) {
            if (user_input_status[i].id == 'read_yes'){
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
        alert('Fill all empty fields!');
    } else {
        //SEND DATA TO CLOUD FIRESTORE DATABASE
        let docRef_id = sendDataDatabase(user_input_image, user_input_title.value, user_input_author.value, user_input_pages.value, user_input_overview.value, input_status);
        // let docRef_id = sendDataDatabase(user_input_image);

        //create new card from the form
        createCard(user_input_image ,user_input_title.value, user_input_author.value, user_input_pages.value, user_input_overview.value, input_status, docRef_id);
    }

}

//when using webpack
document.querySelector('#submit-btn').addEventListener('click', (e) => {
    e.preventDefault();
    //submit data
    getFormData();
})

//create new card element 
async function createCard(image, title, author, pages, overview, status, id){

    //locate container div
    const maincontent = document.querySelector('.maincontent');

    //create new div element with card as classname
    const card = document.createElement('div');
    card.classList.add('card');
    //attach document referent id as card id
    //try if doc id is a promise, if not assigned doc id to card id immediately
    try {
        id.then(function (res) {
            card.id = res;
        });
    } catch(error) {
        console.log(error);
        card.id = id;
    }

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
        //delete document in CLOUD FIRESTORE using card id
        console.log(card.id);
        deleteDocumentFirebase(card.id);
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

//STORE DATA TO CLOUD FIREBASE
async function sendDataDatabase(image, title, author, pages, overview, status) {

    try {
        const docRef = doc (collection(db, "books"));
        await setDoc(
            docRef,
            {
                ImageSrc: image,
                Title: title,
                Author: author,
                Pages: pages,
                Overview: overview,
                Status: status, 
                TimeCreated : firebase.firestore.FieldValue.serverTimestamp(),
                id: docRef.id
            }
        )
        console.log("Document written with ID: ", docRef.id );
        return docRef.id;

    } catch(e) {
        console.log("Error adding document: ", e);
    }
}

//get project data from CLOUD FIRESTORE even if the page is refreshed or closed
const pageRefreshed = window.onload = async function () {

    let bookArray = [];

    //get data 
    const queryBookRecords = await getDocs(collection(db, "books"));
    queryBookRecords.forEach((doc) => {
        bookArray.push(doc.data());
    })

    bookArray.forEach((book) => {
        //create new card from the form
        createCard( book.ImageSrc , book.Title , book.Author , book.Pages, book.Overview , book.Status, book.id);
    })

}


//Delete Document in Cloud Firestore
async function deleteDocumentFirebase(docID) {
    const deletedDoc = await deleteDoc(doc (db, "books", docID));
}

