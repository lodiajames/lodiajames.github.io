


let key = '563492ad6f91700001000001fc174dfb499e4e66856444d24ffbedce';


const mainContent = document.querySelector('.main-content');
const searchInput = document.querySelector('.search-input');
const searchForm = document.querySelector('.search-form');
const btnSubmit = document.querySelector('.btn-submit');
const btnViewMore = document.querySelector('.view-more');

let link;
let current;
let value;
let pageCount = 2;

btnViewMore.addEventListener('click', viewMore)

searchInput.addEventListener('input', (e)=>{
    value = e.target.value;
})

searchForm.addEventListener('submit',(e)=>{
   e.preventDefault();
   let current = value;
   mainContent.innerHTML = "";
   searchImages(current);
   searchInput.value="";

})
         


const apiHandling = async(url)=>{
    const fetchData = await fetch(url, {
        method: "GET",
        headers: {
            Accept: "application/json",
            Authorization: key
        }
    })
    const data = await fetchData.json();
    return data;
}


// insert Html 
    const insertHtml = (data) =>{
        data.photos.forEach((photo, i)=>{
            const gallery = document.createElement('div');
            gallery.classList.add('gallery');
            gallery.innerHTML= `<div class="image-holder"><img src="${photo.src.large}"></img>
             <div class="profile">
              <a href="${photo.photographer_url}"> ${photo.photographer}</a>
            <a href="${photo.src.large}" target="_blank" title=" press to download"><i class="fa-solid fa-download"></i></a>

             </div>
            </div>`
        
            mainContent.appendChild(gallery);
        })
      
    }

const curatedPhotos = async () =>{
    const data = await apiHandling("https://api.pexels.com/v1/search?query=nature&per_page=12")
    console.log(data);
    insertHtml(data);
}

const searchImages = async(searchQuery)=>{
    link = `https://api.pexels.com/v1/search?query=${searchQuery}&per_page=10`
    const data =  await apiHandling(link);
    insertHtml(data);
}

async function viewMore(){
     pageCount++;
     if(current){
        link=`https://api.pexels.com/v1/search?query=${current}&per_page=12&page=${pageCount}`
     }else{
        link = `https://api.pexels.com/v1/search?query=nature&per_page=${pageCount}`
     }
     const data = await apiHandling(link);
     insertHtml(data);
}

searchImages();

curatedPhotos();

