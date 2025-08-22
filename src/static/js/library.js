(function () {
    // Retrieve remote BrowserWindow
    const { ipcRenderer } = require('electron');
    let gameDetailCache = {}; // Store game data for detail view

    function init() {
        // Close app
        document.getElementById("close-btn").addEventListener("click", (e) => {
            ipcRenderer.send('close-me')
        });
        document.getElementById("max-btn").addEventListener("click", (e) => {
            ipcRenderer.send('max-me')
        });
        document.getElementById("min-btn").addEventListener("click", (e) => {
            ipcRenderer.send('min-me')
        });
        document.getElementById("add-game").addEventListener("click", (e) => {
            ipcRenderer.send('requestWizard')
        });

        // Back button
        document.getElementById("back-to-grid").addEventListener("click", () => {
            hideGameDetail();
        });

        // Play button
        document.getElementById("play-game").addEventListener("click", () => {
            const gameId = document.getElementById("game-detail").getAttribute("data-game-id");
            if (gameId) {
                ipcRenderer.send('launchGame', gameId);
            }
        });

        // Configure button
        document.getElementById("configure-game").addEventListener("click", () => {
            const gameId = document.getElementById("game-detail").getAttribute("data-game-id");
            if (gameId) {
                // Send message to configure this specific game
                ipcRenderer.send('configureGame', gameId);
            }
        });
    };

    document.onreadystatechange = () => {
        if (document.readyState == "complete") {
            init();
        }
    };

    // Show game details panel
    function showGameDetail(gameData) {
        const detailPanel = document.getElementById("game-detail");

        // Store game ID for play/configure buttons
        detailPanel.setAttribute("data-game-id", gameData.id);

        // Set game details
        document.getElementById("game-title").textContent = gameData.name;
        document.getElementById("game-info").textContent = `${gameData.author}, ${gameData.year}`;
        document.getElementById("game-cover").src = gameData.cover;

        // Set banner background (use the same image or a banner if available)
        document.getElementById("game-banner-bg").style.backgroundImage = `url('${gameData.cover}')`;

        // Set technical details
        document.getElementById("game-sourceport").textContent = gameData.sourceport || "-";
        document.getElementById("game-iwad").textContent = gameData.iwad || "-";
        document.getElementById("game-params").textContent = gameData.params || "-";

        // Set description
        document.getElementById("game-description").textContent = gameData.description ||
            `Developed by id Software, and originally released in 1993, DOOM pioneered and popularized the first-person shooter, setting a standard for all FPS games. The critically acclaimed sequel, DOOM II, followed in 1994.`;

        // Show the panel with animation
        detailPanel.classList.remove("translate-x-full");
    }

    // Hide game details panel
    function hideGameDetail() {
        const detailPanel = document.getElementById("game-detail");
        detailPanel.classList.add("translate-x-full");
    }

    ipcRenderer.on('clearLibrary', (event, data) => {
        console.log("Clearing library");
        var element = document.getElementById("grid");
        while (element.firstChild && element.firstChild.id != "add-game") {
            element.firstChild.remove();
        }
        gameDetailCache = {}; // Clear the cache
    });

    ipcRenderer.on('addgame', (event, data) => {
        // Cache the game data for detail view
        gameDetailCache[data.id] = {
            id: data.id,
            name: data.name,
            author: data.author,
            year: data.year,
            cover: data.cover,
            sourceport: data.sourceport || "Default",
            iwad: data.iwad || "Unknown",
            params: data.params || "Default parameters",
            description: data.description || null
        };

        // Create a game card with Tailwind styling
        var game = document.createElement("div");
        game.className = "game bg-gray-900 border border-gray-700 hover:border-doom-red rounded-lg overflow-hidden transition-all duration-300 cursor-pointer transform hover:scale-105 flex flex-col h-72";
        game.setAttribute("gameName", data.id);

        // Cover image with proper aspect ratio
        var imageContainer = document.createElement("div");
        imageContainer.className = "w-full h-52 overflow-hidden bg-black flex items-center justify-center";

        var image = document.createElement("img");
        image.src = data.cover;
        image.className = "object-cover w-full h-full";
        imageContainer.appendChild(image);
        game.appendChild(imageContainer);

        // Game info section
        var infoContainer = document.createElement("div");
        infoContainer.className = "p-3 flex-1 flex flex-col";

        var h3 = document.createElement("h3");
        h3.innerHTML = data.name;
        h3.className = "text-sm font-bold truncate";

        var p = document.createElement("p");
        p.innerHTML = data.author + ', ' + data.year;
        p.className = "text-xs text-gray-400 mt-1";

        infoContainer.appendChild(h3);
        infoContainer.appendChild(p);
        game.appendChild(infoContainer);

        // Add click handler for showing game details
        game.addEventListener("click", showGameDetails);

        // Insert before the add button
        document.getElementById("grid").insertBefore(game, document.getElementById("add-game"));
    });

    // Handler for game card click - show details instead of launching
    function showGameDetails(event) {
        const gameId = event.currentTarget.getAttribute("gameName");
        if (gameDetailCache[gameId]) {
            showGameDetail(gameDetailCache[gameId]);
        } else {
            console.error("Game data not found in cache:", gameId);
        }
    }

    // This function is now only called by the Play button
    function launchGame(gameId) {
        ipcRenderer.send('launchGame', gameId);
    }
})();