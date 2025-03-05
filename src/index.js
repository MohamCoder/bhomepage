const search_bar = document.getElementById("search_bar");
const suggestions_container = document.getElementById("suggestions");
const search_button = document.getElementById("search_button");

let debounceTimer;

search_bar.addEventListener("input", () => {
  clearTimeout(debounceTimer); // Clear previous timer
  debounceTimer = setTimeout(fetchSuggestions, 100); // Wait 300ms before fetching
});

search_bar.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    // Check if Enter is pressed
    const query = search_bar.value.trim();
    if (query) {
      window.location.href = `https://google.com/search?q=${encodeURIComponent(query)}`;
    }
  }
});

search_button.addEventListener("click", () => {
  const query = search_bar.value.trim();
  if (query) {
    window.location.href = `https://google.com/search?q=${encodeURIComponent(query)}`;
  }
});

async function fetchSuggestions() {
  const query = search_bar.value.trim();
  if (!query) return; // Don't fetch if input is empty

  try {
    const response = await fetch(
      `/.netlify/functions/suggestions?q=${encodeURIComponent(query)}`,
    );
    if (!response.ok) throw new Error("Error fetching suggestions");

    const suggestions = await response.json();
    updateSuggestions(suggestions);
  } catch (error) {
    console.error(error);
  }
}

function updateSuggestions(suggestions) {
  suggestions_container.innerHTML = "";
  suggestions.forEach((suggestion) => {
    const option = document.createElement("option");
    option.value = suggestion;
    suggestions_container.appendChild(option);
  });
}
