const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const historyBtn = document.getElementById("historyBtn");
const scContainer = document.getElementById("searchCardsContainer");
const historyPage = document.getElementById("historyPage");
const hcContainer = document.getElementById("historyCardsContainer");
const clearHistoryBtn = document.getElementById("clearHistoryBtn");

let state = false;
let searches = JSON.parse(localStorage.getItem("searches")) || [];

searchBtn.addEventListener("click", () => {
    const word = searchInput.value.trim();
    if (word !== "") {
        fetchMeaning(word);
    }
});

historyBtn.addEventListener("click", () => {
    state = !state;
    if (state) {
        showHistoryPage();
        historyBtn.textContent = "Search";
    } else {
        showSearchPage();
        historyBtn.textContent = "History";
    }
});

clearHistoryBtn.addEventListener("click", () => {
    clearSearchHistory();
    showHistoryPage();
});

function fetchMeaning(word) {
    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
        .then(response => response.json())
        .then(data => {
            const meaning = data[0]?.meanings[0]?.definitions[0]?.definition || "Definition not found";
            displayWordCard(word, meaning);
            addToSearchHistory(word, meaning);
        })
        .catch(error => {
            console.error("Error fetching meaning:", error);
        });
}

function displayWordCard(word, meaning) {
    while (scContainer.firstChild) {
        scContainer.removeChild(scContainer.firstChild);
    }

    const card = document.createElement("div");
    card.classList.add("word-card");

    const heading = document.createElement("h3");
    heading.textContent = word;

    const definition = document.createElement("p");
    definition.textContent = meaning;

    card.appendChild(heading);
    card.appendChild(definition);

    scContainer.appendChild(card);
}

function addToSearchHistory(word, meaning) {
    searches.push({ word, meaning });
    localStorage.setItem("searches", JSON.stringify(searches));
}

function clearSearchHistory() {
    searches = [];
    localStorage.removeItem("searches");
}

function showSearchPage() {
    mainContent.classList.remove("hidden");
    historyPage.classList.add("hidden");
}

function showHistoryPage() {
    mainContent.classList.add("hidden");
    historyPage.classList.remove("hidden");
    //loadHistoryCards();

    hcContainer.innerHTML = "";
    searches.forEach((search, index) => {
        const historyCard = document.createElement("div");
        historyCard.classList.add("word-card");

        const heading = document.createElement("h3");
        heading.textContent = search.word;

        const definition = document.createElement("p");
        definition.textContent = search.meaning;

        const deleteBtn = document.createElement("button");
        deleteBtn.classList.add("deleteBtn");
        deleteBtn.setAttribute("data-index", index);
        deleteBtn.textContent = "Delete";
        deleteBtn.addEventListener("click", deleteHistoryItem);

        historyCard.appendChild(heading);
        historyCard.appendChild(definition);
        historyCard.appendChild(deleteBtn);

        hcContainer.appendChild(historyCard);
    });
}

function deleteHistoryItem(event) {
    const index = event.target.getAttribute("data-index");
    searches.splice(index, 1);
    localStorage.setItem("searches", JSON.stringify(searches));
    showHistoryPage();
}
