// 1. Add your Giphy API Key here
const apiKey = "3F5hrTiCdDhIEDVVk76XRjFcpbH4D4NI";

// 2. Get references to the HTML elements you'll need
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const gifContainer = document.getElementById("gif-container");

// 3. Listen for the form submission
searchForm.addEventListener("submit", function (event) {
  // Prevent the form from reloading the page
  event.preventDefault();

  // Get the user's search term
  const searchTerm = searchInput.value;

  // Check if the user actually typed something
  if (searchTerm) {
    fetchGifs(searchTerm);
  }
});

// 4. Function to fetch GIFs from the Giphy API
async function fetchGifs(query) {
  // Clear any previous search results
  gifContainer.innerHTML = "";

  const url = `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${query}&limit=24&rating=r`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`API request failed with status: ${response.status}`);
    }
    const json = await response.json();

    // Create and display each GIF
    json.data.forEach((gifData) => {
      const gifElement = document.createElement("img");
      gifElement.src = gifData.images.fixed_height.url;
      gifElement.alt = gifData.title;
      gifContainer.appendChild(gifElement);
    });
  } catch (error) {
    console.error("Error fetching GIFs:", error);
    gifContainer.innerHTML = `<p style="color: #ff00ff;">Sorry, couldn't load GIFs. Please try again.</p>`;
  }
}
