const apiKey = "4f7e0fed"; // Your OMDb API key

const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const resultsEl = document.getElementById("results");
const errorMsg = document.getElementById("errorMsg");

searchBtn.addEventListener("click", () => {
  const query = searchInput.value.trim();
  if (query) {
    fetchMovies(query);
  }
});

searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    searchBtn.click();
  }
});

// Fetch movies using OMDb API
async function fetchMovies(query) {
  const url = `https://www.omdbapi.com/?s=${encodeURIComponent(query)}&apikey=${apiKey}&type=movie`;
  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.Response === "True") {
      // Fetch detailed info for each movie to get description
      const detailedMovies = await Promise.all(
        data.Search.map(async (item) => {
          const detailUrl = `https://www.omdbapi.com/?i=${item.imdbID}&apikey=${apiKey}`;
          const detailRes = await fetch(detailUrl);
          const detailData = await detailRes.json();
          return detailData;
        })
      );
      showResults(detailedMovies);
    } else {
      showError();
    }
  } catch (error) {
    showError();
  }
}

// Display results
function showResults(items) {
  errorMsg.classList.add("hidden");
  resultsEl.innerHTML = "";

  items.forEach((item) => {
    const card = document.createElement("div");
    card.classList.add("card");

    const poster = document.createElement("img");
    poster.src =
      item.Poster !== "N/A"
        ? item.Poster
        : "https://via.placeholder.com/80x120?text=No+Image";
    poster.alt = item.Title;

    const info = document.createElement("div");
    const title = document.createElement("h3");
    title.textContent = item.Title;

    const year = document.createElement("p");
    year.textContent = `Year: ${item.Year}`;

    const plot = document.createElement("p");
    plot.textContent = item.Plot !== "N/A" ? item.Plot : "";

    info.appendChild(title);
    info.appendChild(year);
    info.appendChild(plot);

    card.appendChild(poster);
    card.appendChild(info);
    resultsEl.appendChild(card);
  });
}

// Show error if no results
function showError() {
  resultsEl.innerHTML = "";
  errorMsg.classList.remove("hidden");
}