const showErrorMessage = (err) => {
    const errorSection = document.getElementById('error-section');
    errorSection.classList.remove('d-none')
    document.getElementById('error-message').innerText = err
}

// Function to load all news
const loadAllNews = async () => {
    const url = 'https://openapi.programming-hero.com/api/news';
    try {
        const res = await fetch(url);
        const data = await res.json();
        displyNewsOfCategory(data.data);
    } catch (err) {
        showErrorMessage(err);
        toggleLoader(false);
    }
};

// Event listener for clicking on the portal title
document.getElementById('portal-title').addEventListener('click', function (e) {
    e.preventDefault(); // Prevent the default behavior of the anchor element
    loadAllNews(); // Call the function to load all news
    toggleLoader(true); // Show loader
});

// load news category name .................
const loadCategories = async () => {
    const url = `https://openapi.programming-hero.com/api/news/categories`
    try {
        const res = await fetch(url);
        const data = await res.json();
        displayNewsCategory(data.data.news_category);

    } catch (err) {
        showErrorMessage(err)
    }
}

loadCategories();

// display news category name in the UI dynamically....................
const displayNewsCategory = (categories) => {
    const newsCategoryContainer = document.getElementById('news-category-container')
    categories.forEach((category) => {
        const category_p = document.createElement('p');
        category_p.classList.add('fw-bold');
        category_p.setAttribute('id', `${category.category_id}`) // set category id in p tag......

        category_p.innerText = category.category_name
        newsCategoryContainer.appendChild(category_p);
    })
}

// after clicking the category find the category id and name , and pass it to load the news of specific category
document.getElementById('news-category-container').addEventListener('click', function (e) {
    const selected_category = e.target;

    if (selected_category.tagName == 'P') {
        const category_id = selected_category.getAttribute('id');
        const categoryName = selected_category.innerText;
        loadCategoryNews(category_id, categoryName);
        toggleLoader(true);
    }
})

// load the news of specific category ................
const loadCategoryNews = async (category_id, categoryName) => {
    const url = 'https://openapi.programming-hero.com/api/news/category/' + category_id;

    try {
        const res = await fetch(url);
        const data = await res.json();
        const numberOfNews = data.data.length;
        document.getElementById('number-of-news').innerText = numberOfNews;
        document.getElementById('category-name').innerText = categoryName;

        let allData = data.data
        allData.sort(function (a, b) {
            return b.total_view - a.total_view // descending order
        })

        displyNewsOfCategory(allData);

    } catch (err) {
        showErrorMessage(err)
        toggleLoader(false)
    }
}

const displyNewsOfCategory = (allNews) => {
    const newsContainer = document.getElementById('news-container');
    newsContainer.innerHTML = '';
    allNews.forEach((news) => {
        const newsDiv = document.createElement('div');
        newsDiv.classList.add('card', 'mb-3', 'shadow-lg');
        const { thumbnail_url, title, details, author, total_view, _id } = news;

        let newsDetails;
        if (details.length > 300) {
            newsDetails = details.slice(0, 300) + '.........'
        } else {
            newsDetails = details
        }

        newsDiv.innerHTML = `
                    <div class="row g-0">
                       
                        <div class="col-md-4 ">
                            <img src="${thumbnail_url}" class="img-fluid   rounded-start " alt="...">
                           
                        </div>
                        <div class="col-md-8 pe-3">
                            <div class="card-body">
                                <h5 class="card-title"> ${title} </h5>
                                <p class="card-text">
                                     ${newsDetails}.  
                                </p>
                            </div>

                            <div class= "d-flex mb-2 flex-column flex-md-row justify-content-between align-items-start align-items-md-center   mt-5">
                                
                                <div class="d-flex flex-direction-row"> 
                                    <img  src="${author.img}" class="img-fluid author-image " alt="...">
                                    <div class="ms-3"> 
                                            <span> <b> ${author.name} </b> </span> <br>
                                            <span>  ${author.published_date} </span>
                                    </div>
                                </div>
                                <div> <i class="far fa-eye"></i> <b> ${total_view}M </b> </div>
                                <div>
                                    <i class="fas fa-star"></i>
                                    <i class="fas fa-star"></i>
                                    <i class="fas fa-star"></i>
                                    <i class="fas fa-star-half-alt"></i>
                                    <i class="far fa-star"></i>
                                </div>


                                <button onclick = "newsDetail('${_id}')" type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#newsDetailModal">
                                    Detail
                                </button>
                            </div>

                        </div>
                    </div>
        
        `
        newsContainer.appendChild(newsDiv);
    })

    toggleLoader(false)
}

const newsDetail = async (id) => {
    const url = `https://openapi.programming-hero.com/api/news/${id}`
    const res = await fetch(url);
    const data = await res.json();
    const news = data.data[0];

    document.getElementById('news-detail-image').src = news.image_url;
    document.getElementById('news-detail-title').innerText = news.title;
    document.getElementById('news-detail-desc').innerText = news.details;
}

const toggleLoader = isLoading => {
    const loaderSection = document.getElementById('loader');
    if (isLoading) {
        loaderSection.classList.remove('d-none')
    } else {
        loaderSection.classList.add('d-none')

    }

}
// Event listener for clicking on the portal title
document.getElementById('portal-title').addEventListener('click', function (e) {
    e.preventDefault(); // Prevent the default behavior of the anchor element
    loadAllNews(); // Call the function to load all news
    toggleLoader(true); // Show loader
});