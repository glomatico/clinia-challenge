const bookButtons = document.getElementsByClassName('books__content__shelf__book__info__button');
const booksMenuButtons = document.getElementsByClassName('books__content__menu__item__button');
const shelf = document.getElementById('books__content__shelf');
const booksWarning = document.getElementById('books__content__warning');

async function main() {
    await getBooksResponse()
        .then(response => {
            setBooks(response.data.data)
            setBookButtonActions()
        })
        .catch(error => {
            console.error(error)
            alert("Falha ao buscar livros")
        })
        .finally(() => {
            setBooksMenuButtonAction()
            setAllBooksVisible()
        });
}

async function getBooksResponse() {
    let booksResponse = axios.get('https://fakerapi.it/api/v1/books?_quantity=20');
    return booksResponse;
}

async function setBooks(booksResponseData) {
    booksResponseData.forEach(bookResponseData => {
        let book = document.createElement('div');
        book.classList = "books__content__shelf__book";
        book.dataset.favorite = "false";
        book.dataset.id = bookResponseData.id;

        let bookCover = document.createElement('img');
        bookCover.classList = "books__content__shelf__book__cover";
        bookCover.src = "./images/book_cover_placeholder.png"
        bookCover.alt = `Capa do livro "${bookResponseData.title}"`;
        book.appendChild(bookCover);

        let bookInfo = document.createElement('div');
        bookInfo.classList = "books__content__shelf__book__info";
        book.appendChild(bookInfo);

        let bookInfoDetails = document.createElement('div');
        bookInfoDetails.classList = "books__content__shelf__book__info__details";
        bookInfo.appendChild(bookInfoDetails);

        let bookTitle = document.createElement('h3');
        bookTitle.innerText = bookResponseData.title;
        bookInfoDetails.appendChild(bookTitle);

        let bookAuthor = document.createElement('h4');
        bookAuthor.innerText = bookResponseData.author;
        bookInfoDetails.appendChild(bookAuthor);

        let bookGenre = document.createElement('p');
        bookGenre.innerText = bookResponseData.genre;
        bookInfoDetails.appendChild(bookGenre);

        let bookDescription = document.createElement('p');
        bookDescription.innerText = bookResponseData.description;
        bookInfoDetails.appendChild(bookDescription);

        let bookPublishDate = document.createElement('p');
        bookPublishDate.innerText = bookResponseData.published;
        bookInfoDetails.appendChild(bookPublishDate);


        let bookFavoriteButton = document.createElement('button');
        bookFavoriteButton.classList = "books__content__shelf__book__info__button";
        bookInfo.appendChild(bookFavoriteButton);

        let bookFavoriteButtonIcon = document.createElement('span');
        bookFavoriteButtonIcon.classList = "books__content__shelf__book__info__button__icon";
        bookFavoriteButtonIcon.innerHTML = "&#xe885;";
        bookFavoriteButton.appendChild(bookFavoriteButtonIcon);

        setBookAsNotFavorite(book);
        shelf.appendChild(book);
    });

}

async function setBookButtonActions() {
    Array.from(bookButtons).forEach(button => {
        button.addEventListener('click', () => {
            let book = button.parentElement.parentElement;
            if (book.getAttribute("data-favorite") == "false") {
                setBookAsFavorite(book);
            } else {
                setBookAsNotFavorite(book);
            }
        });
    });
}

async function setBookAsFavorite(book) {
    book.dataset.favorite = "true";
    book.getElementsByClassName("books__content__shelf__book__info__button__icon")[0].classList = "material-icons books__content__shelf__book__info__button__icon"
}

async function setBookAsNotFavorite(book) {
    book.dataset.favorite = "false";
    book.getElementsByClassName("books__content__shelf__book__info__button__icon")[0].classList = "material-icons-outlined books__content__shelf__book__info__button__icon"
}


async function setBooksMenuButtonAction() {
    Array.from(booksMenuButtons).forEach(button => {
        button.addEventListener('click', () => {
            if (button.dataset.action == "all") {
                setAllBooksVisible();
            } else if (button.dataset.action == "favorites") {
                setOnlyFavoriteBooksVisible();
            }
        });
    });
}

async function setAllBooksVisible() {
    let noBooks = true;
    Array.from(shelf.getElementsByClassName("books__content__shelf__book")).forEach(book => {
        book.style.display = "flex";
        noBooks = false;
    });
    if (noBooks) {
        booksWarning.style.display = "block";
        booksWarning.innerHTML = "Não há livros";
    } else {
        booksWarning.style.display = "none";
    }
}

async function setOnlyFavoriteBooksVisible() {
    let noFavoriteBooks = true;
    Array.from(shelf.getElementsByClassName("books__content__shelf__book")).forEach(book => {
        if (book.dataset.favorite == "true") {
            book.style.display = "flex";
            noFavoriteBooks = false;
        } else {
            book.style.display = "none";
        }
    });
    if (noFavoriteBooks) {
        booksWarning.style.display = "block";
        booksWarning.innerHTML = "Não há livros favoritos";
    } else {
        booksWarning.style.display = "none";
    }
}

main();
