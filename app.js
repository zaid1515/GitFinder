document.addEventListener("DOMContentLoaded", function () {
     const repositoryListContainer = document.getElementById("repository-list");
     const paginationContainer = document.querySelector(".pagination");
     const loaderContainer = document.getElementById("loader");
     const usernameInput = document.getElementById("username");
     const userInfoContainer = document.getElementById("user-info");
     const userPhoto = document.getElementById("user-photo");
     const userBio = document.getElementById("user-bio");
     const userLink = document.getElementById("user-link");
     const userName = document.getElementById("name-user");
     const reposInp = document.getElementById("repos")

     let username = "zaid1515";
     let perPage = parseInt(reposInp.value) || 10;

     let currentPage = 1;

     async function fetchUser() {
          try {
               loading(true);
               const response = await fetch(`https://api.github.com/users/${username}`);
               const user = await response.json();
               return user;
          } catch (error) {
               console.error("Error fetching user:", error);
               return null;
          }
     }


     async function fetchRepositories(page) {
          try {
               loading(true);
               const response = await fetch(`https://api.github.com/users/${username}/repos?page=${page}&per_page=${perPage}`);
               const repositories = await response.json();
               console.log(repositories);
               return repositories;
          } catch (error) {
               console.error("Error fetching repositories:", error);
               return [];
          }
     }

     async function fetchTotalRepositories() {
          try {
               loading(true);
               const response = await fetch(`https://api.github.com/users/${username}/repos`);
               const repositories = await response.json();
               return repositories.length;
          } catch (error) {
               console.error("Error fetching total repositories:", error);
               return 0;
          }
     }


     function updateUserInfo(user) {
          loading(true);
          if (user) {
               userPhoto.src = user.avatar_url;
               userBio.textContent = user.bio || "No bio available.";
               userLink.innerHTML = `<p>Github Link: <a href="${user.html_url}" target="_blank"> ${user.html_url}</a></p>`
               userName.textContent = user.name
          } else {
               userPhoto.src = "";
               userBio.textContent = "";
          }
     }

     function updateRepositoryList(repositories) {
          loading(true);
          repositoryListContainer.innerHTML = "";
          repositories.forEach((repo) => {
               const repositoryElement = document.createElement("div");
               repositoryElement.classList.add("repository");

               const languages = repo.languages_url;
               fetchLanguages(languages).then(languagesData => {
                    repositoryElement.innerHTML = `
                <h2>${repo.name}</h2>
                <p>${repo.description || "No description available."}</p>
                <p>
                Languages: ${Object.keys(languagesData).map(language => `<span class="btn btn-primary m-2">${language}</span>`).join('') || "Not specified"}
              </p>
            `;
                    repositoryListContainer.appendChild(repositoryElement);
               });
          });
     }

     async function fetchLanguages(url) {
          try {
               loading(true);
               const response = await fetch(url);
               const languagesData = await response.json();
               return languagesData;
          } catch (error) {
               console.error("Error fetching languages:", error);
               return {};
          }
     }


     function updatePagination(totalPages) {
          loading(true);
          paginationContainer.innerHTML = "";
          const prevPageItem = document.createElement("li");
          prevPageItem.classList.add("page-item");
          const prevPageLink = document.createElement("a");
          prevPageLink.classList.add("page-link");
          prevPageLink.href = "#";
          prevPageLink.innerHTML = "&laquo;";
          prevPageLink.addEventListener("click", async () => {
               try {
                    if (currentPage > 1) {
                         currentPage--;
                         await fetchAndDisplayData();
                    }
               } catch (e) {
                    console.log(e);
               }
          });
          prevPageItem.appendChild(prevPageLink);
          paginationContainer.appendChild(prevPageItem);

          for (let i = 1; i <= totalPages; i++) {
               const pageItem = document.createElement("li");
               pageItem.classList.add("page-item");
               if (i === currentPage) {
                    pageItem.classList.add("active");
               }
               const pageLink = document.createElement("a");
               pageLink.classList.add("page-link");
               pageLink.href = "#";
               pageLink.textContent = i;

               pageLink.addEventListener("click", async () => {
                    try {
                         currentPage = i;
                         await fetchAndDisplayData();
                    } catch (e) {
                         console.log(e);
                    }
               });

               pageItem.appendChild(pageLink);
               paginationContainer.appendChild(pageItem);
          }

          const nextPageItem = document.createElement("li");
          nextPageItem.classList.add("page-item");
          const nextPageLink = document.createElement("a");
          nextPageLink.classList.add("page-link");
          nextPageLink.href = "#";
          nextPageLink.innerHTML = "&raquo;"; // Right arrow
          nextPageLink.addEventListener("click", async () => {
               try {
                    if (currentPage < totalPages) {
                         currentPage++;
                         await fetchAndDisplayData();
                    }
               } catch (e) {
                    console.log(e);
               }
          });
          nextPageItem.appendChild(nextPageLink);
          paginationContainer.appendChild(nextPageItem);
     }



     async function fetchAndDisplayData() {
          loading(true);
          const user = await fetchUser();
          const repositories = await fetchRepositories(currentPage);
          console.log(user);
          console.log(repositories);
          const lenn = await fetchTotalRepositories()
          console.log(lenn);
          updateUserInfo(user);
          updateRepositoryList(repositories);
          updatePagination(Math.ceil(lenn / parseFloat(perPage)));
     }



     const loading = (bl) => {
          if (bl) {
               loaderContainer.style.display = "block";
               loaderContainer.style.padding = "60px";
               repositoryListContainer.style.display = "none"
               setTimeout(() => {
                    repositoryListContainer.style.display = ""
                    loaderContainer.style.display = "none"
               }, 2000);
          }
     }
     

     const search = document.getElementById('search');
     search.addEventListener('click', async () => {
          try {
               loading(true);
               username = usernameInput.value.trim();
               currentPage = 1; // Reset currentPage to 1

               if (username) {
                    await fetchAndDisplayData();
               } else {
                    alert("Please enter a valid GitHub username.");
               }
          } catch (e) {
               console.log(e);
          }
     });

     
     const enter = document.getElementById('enter');
     enter.addEventListener('click', async () => {
          perPage=reposInp.value||10
          fetchAndDisplayData()
     });

     fetchAndDisplayData();
});
