document.addEventListener("DOMContentLoaded", () => {
  const apiKey = "qP2936uieVbCtKltWHkve31shyEhvg54";
  const searchForm = document.getElementById("search-form");
  const searchInput = document.getElementById("search-input");
  const gifContainer = document.getElementById("gif-container");

  searchForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const searchTerm = searchInput.value.trim();
    if (!searchTerm) return;

    gifContainer.innerHTML = "Loading giphs...";

    try {
      const response = await fetch(
        `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${searchTerm}&limit=24&offset=0&rating=g&lang=en`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const { data } = await response.json();

      gifContainer.innerHTML = "";

      if (data.length === 0) {
        gifContainer.innerHTML = "No giphs found. Try another search.";
        return;
      }

      data.forEach((gif) => {
        const gifWrapper = document.createElement("div");
        gifWrapper.className = "gif-wrapper";
        const img = document.createElement("img");
        img.src = gif.images.fixed_height.url;
        img.alt = gif.title;

        const copyButton = document.createElement("button");
        copyButton.textContent = "Copy Image Link";
        copyButton.onclick = () => {
          
          navigator.clipboard.writeText(gif.images.original.url);
          
          copyButton.textContent = "Copied!";
          setTimeout(() => (copyButton.textContent = "Copy Image Link"), 2000);
        };

        gifWrapper.append(img, copyButton);
        gifContainer.appendChild(gifWrapper);
      });
    } catch (error) {
      console.error("Error fetching GIFs:", error);
      gifContainer.innerHTML = "Failed to load giphs. Please try again later.";
    }
  });
});
