const resultsNav = document.getElementById('resultsNav');
const favoritesNav = document.getElementById('favoritesNav');
const imagesContainer = document.querySelector('.images-container');
const saveConfirmed = document.querySelector('.save-confirmed');
const loader = document.querySelectorAll('.loader');



// NASA API
const count = 10;
const apiKey = 'DEMO_KEY';
const apiURL = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;

let resultsArr = [];
let favorites = {};

function showContent(page) {
    window.scrollTo({top: 0, behavior: 'instant'})
    if(page === 'results') {
        resultsNav.classList.remove('hidden');
        favoritesNav.classList.add('hidden');
    }else {
        resultsNav.classList.add('hidden');
        favoritesNav.classList.remove('hidden');
    }
    loader.classList.add('hidden');
}

function createDOMNodes(page){
    const currentArray = page === 'results' ? resultsArr : Object.values(favorites);
    // console.log('Current Array', page, currentArray);
    currentArray.forEach((result)=>{
        //Card Container
        const card = document.createElement('div');
        card.classList.add('card');
        // Link
        const link = document.createElement('a');
        link.href = result.hdurl;
        link.title = 'View Full Image'
        link.target = '_blank';
        //Image
        const image = document.createElement('img');
        image.src = result.url;
        image.alt = 'NASA Picture of the Day';
        image.loading = 'lazy';
        image.classList.add('card-img-top');
        // Card Body
        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');
        //Card Title
        const cardTitle = document.createElement('h5');
        cardTitle.classList.add('card-title');
        cardTitle.textContent = result.title;
        // save Text
        const saveText = document.createElement('p');
        saveText.classList.add('clickable');
        if (page === 'results') {
            saveText.textContent = 'Add To Favorites';
            saveText.setAttribute('onclick', `saveFavorite('${result.url}')`);
        }else {
            saveText.textContent = 'Remove Favorites';
            saveText.setAttribute('onclick', `removeForite('${result.url}')`);
        }
        //Card Text
        const cardText = document.createElement('p');
        cardText.textContent = result.explanation;
        // Footer Container
        const footer = document.createElement('small');
        footer.classList.add('text-muted');
        //Date
        const date = document.createElement('strong');
        date.textContent = result.date;
        // Copyright
        const copyright = document.createElement('span');
        if(result.copyright=== undefined){
            copyright.textContent = '';
        }
        else {
            copyrightEl.textContent = ` ${result.copyright}`;
        }
        
       
        //Append
        footer.append(date, copyright);
        cardBody.append(cardTitle, saveText, cardText, footer);
        link.appendChild(image);
        card.append(link, cardBody);
       imagesContainer.appendChild(card);
    })
}


// update the DOM;

function updateDOM(page) {
    //Get Favorites from localStorage
    if (localStorage.getItem('nasaFavorites')){
        favorites = JSON.parse(localStorage.getItem('nasaFavorites'));
        // console.log('favorites from localStorage', favorites);
    }
     imagesContainer.textContent = '';
     createDOMNodes(page);
     showContent(page);

}



// Get 10 Images from NASA API
async function getNasaPictures() {
     //Show loader not workin at the moment need to be fix!
     
    //  loader.classList.remove("hidden");
   
  
     

    try {

        const response = await fetch(apiURL);
        resultsArr = await response.json();
        // console.log(resultsArr);
        updateDOM('results');
       

    } catch (error) {
        // Catch Error Here
    }

}

//Add result to Favorites
function saveFavorite(itemUrl){
   // Loop through Results Array to select Favorite
   resultsArr.forEach((item) =>{
       if(item.url.includes(itemUrl) && !favorites[itemUrl]){
           favorites[itemUrl] =item;
        //    console.log(JSON.stringify(favorites));
           // show Save Confirmation for 2 Seconds
           saveConfirmed.hidden = false;
           setTimeout(()=>{
               saveConfirmed.hidden = true;
        }, 2000);
        //Set Favorites in LocalStorage
        localStorage.setItem('nasaFavorites', JSON.stringify(favorites));
       }
   })
}


// Remove item from Favorites
function removeForite(itemUrl){
    if (favorites[itemUrl]) {
        delete favorites[itemUrl];
          //Set Favorites in LocalStorage
        localStorage.setItem('nasaFavorites', JSON.stringify(favorites));
        updateDOM('favorites');
    
    }
}
//On Load

getNasaPictures();