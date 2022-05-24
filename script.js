const resultsNav = document.getElementById('resultsNav');
const favoritesNav = document.getElementById('favoritesNav');
const imagesContainer = document.querySelector('.images-container');
const saveConfirmed = document.querySelector('.save-confirmed');
const loader = document.querySelector('.loader')

// NASA API URL
const count = 10;
const apiKey = 'DEMO_KEY'
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;

let resultsArray = [];
let favorites = {};

function createDOMNodes(page){
    const currentArray = page ==='results' ? resultsArray : Object.values(favorites);
    console.log(page,currentArray)
    currentArray.forEach((result) => {
        // card container
        const card = document.createElement('div');
        card.classList.add('card');
        const link = document.createElement('a');
        link.href = result.hdurl;
        link.title = 'View Full Image';
        link.target= '_blank';
        const image = document.createElement('img');
        image.src = result.url;
        image.alt = 'NASA picture of the day';
        image.loading = 'lazy';
        image.classList.add('card-img-top');
        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');
        const cardTitle = document.createElement('h5');
        cardTitle.classList.add('card-title');
        cardTitle.textContent = result.title;
        const saveText = document.createElement('p');
        saveText.classList.add('clickable');
        if( page === 'results'){
            saveText.textContent='Add to Favorites';
            saveText.setAttribute('onclick',`saveFavorite('${result.url}')`);
        } else{
            saveText.textContent='Remove Favorite';
            saveText.setAttribute('onclick',`removeFavorite('${result.url}')`);
        }
        
        const cardText = document.createElement('p');
        cardText.textContent = result.explanation;
        const footer = document.createElement('small');
        footer.classList.add('text-muted');
        // Date
        const date = document.createElement('strong');
        date.textContent = result.date;
        // Copyright
        const copyrightResult = result.copyright === undefined ? '' : result.copyright;
        const copyright = document.createElement('span');
        copyright.textContent = ` ${copyrightResult}`;
        // Append
        footer.append(date, copyright);
        cardBody.append(cardTitle, saveText, cardText, footer);
        link.appendChild(image);
        card.append(link, cardBody);
        imagesContainer.appendChild(card);
    });
}

function updateDOM(page){
    // Get favorites from local storage 
    if(localStorage.getItem('nasaFavorites')) {
        favorites = JSON.parse(localStorage.getItem('nasaFavorites'))
    }
    imagesContainer.textContent = '';
    createDOMNodes(page);   
}

function saveFavorite(itemUrl){
    // Loop through the results Array to find favorites url
    resultsArray.forEach((item) => {
        if(item.url.includes(itemUrl) && !favorites[itemUrl]){
            favorites[itemUrl] = item;
            saveConfirmed.hidden = false;
            setTimeout(() => {
                saveConfirmed.hidden = true;
            },2000);
            localStorage.setItem('nasaFavorites',JSON.stringify(favorites));
        }
    });
}

function removeFavorite(itemUrl){
    if(favorites[itemUrl]){
        delete favorites[itemUrl];
        localStorage.setItem('nasaFavorites',JSON.stringify(favorites));
        updateDOM('favorites');
    }

}

// Get 10 images from NASA API
async function getNasaPictures(){
    try{
        const response = await fetch(apiUrl);
        resultsArray = await response.json();
        updateDOM('favorites');
    } catch(error) {
        console.log(error);
    }
}


getNasaPictures();