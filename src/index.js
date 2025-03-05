const search_bar = document.getElementById("search_bar");
const suggestions_container = document.getElementById("suggestions");
const search_button = document.getElementById("search_button");
const add_shortcut = document.getElementById("add_shortcut");
const shortcut_input = document.getElementById("shortcut_input");
const shortcuts_container = document.getElementById("shortcuts_container");
const html = document.querySelector("html");
const theme_selector = document.getElementById("theme_selector");
const themes = [
  "light", "dark", "cupcake", "bumblebee", "emerald", "corporate",
  "synthwave", "retro", "cyberpunk", "valentine", "halloween", "garden",
  "forest", "aqua", "lofi", "pastel", "fantasy", "wireframe", "black",
  "luxury", "dracula", "cmyk", "autumn", "business", "acid", "lemonade",
  "night", "coffee", "winter", "dim", "nord", "sunset", "caramellatte",
  "abyss", "silk"
];
const add_shortcut_button_style = `
<div class="avatar">
        <button  onclick="my_modal_3.showModal()" class="btn btn-outline h-24 w-24 flex flex-col">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 64 64"
            stroke-width="2.5"
            stroke="#CACBD2"
            fill="none"
            style="width: 48px; height: 48px"
            class="duration-300 transform fill-secondary transition-all scale-50"
          >
            <path d="M32 7v50M7 32h50"></path>
          </svg>
          <p class="text-sm" style="transform: translateY(-80%)">add</p>
        </div>

`;
//fucos on the search bar
search_bar.focus();

for (const theme of themes) {
  const option = document.createElement("option");
  option.value = theme;
  option.textContent = theme;
  theme_selector.appendChild(option);
}

theme_selector.addEventListener("change", () => {
  const selectedTheme = theme_selector.value;
  localStorage.setItem("selectedTheme", selectedTheme);
  document.documentElement.setAttribute("data-theme", selectedTheme);
});


let debounceTimer;
let shortcuts = JSON.parse(localStorage.getItem("shortcuts")) || [];
document.documentElement.setAttribute("data-theme", localStorage.getItem("selectedTheme") || "dark");
theme_selector.value = localStorage.getItem("selectedTheme") || "dark";


function rederShortcuts() {
  shortcuts_container.innerHTML = "";
  
  shortcuts.forEach((url) => {
    const div = document.createElement("div");
    div.classList.add("avatar");
    div.innerHTML = ` 
        <a href="https://${url}" class="btn btn-outline h-24 w-24 flex flex-col">
            <img src="https://www.google.com/s2/favicons?domain=${url}&sz=16" style="width: 16px; height: 16px" alt="${url}">
            <p class="text-sm">${url}</p>
        </a>
      `;

    // Add right-click event listener to delete shortcut
    div.addEventListener("contextmenu", (event) => {
      event.preventDefault(); // Prevent default right-click menu

      shortcuts = shortcuts.filter((shortcut) => shortcut !== url);
      localStorage.setItem("shortcuts", JSON.stringify(shortcuts));
      div.remove(); // Remove from the DOM
    });

    shortcuts_container.appendChild(div);
  });

  // Ensure add_shortcut_button_style is correctly added
  shortcuts_container.insertAdjacentHTML("beforeend", add_shortcut_button_style);
}

rederShortcuts();

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
    search_bar.value = "";
  }
});

shortcut_input.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    const url = shortcut_input.value.trim();
    if (url) {
      shortcuts = Array.from(new Set([...shortcuts, url]));
      localStorage.setItem("shortcuts", JSON.stringify(shortcuts));
      rederShortcuts();
    }
    shortcut_input.value = "";
  }
});

add_shortcut.addEventListener("click", () => {
  const url = shortcut_input.value.trim();
  if (url) {
    shortcuts = Array.from(new Set([...shortcuts, url]));
    localStorage.setItem("shortcuts", JSON.stringify(shortcuts));
    rederShortcuts();
  }
  shortcut_input.value = "";
});

search_button.addEventListener("click", () => {
  const query = search_bar.value.trim();
  if (query) {
    window.location.href = `https://google.com/search?q=${encodeURIComponent(query)}`;
  }
  search_bar.value = "";
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
