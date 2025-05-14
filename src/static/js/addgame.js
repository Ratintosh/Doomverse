(function () {
    const { ipcRenderer } = require('electron');

    // Tab switching logic
    function initTabs() {
        const tabButtons = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Deactivate all tabs
                tabButtons.forEach(btn => {
                    btn.classList.remove('bg-doom-red', 'text-white');
                    btn.classList.add('text-gray-300', 'hover:bg-gray-800');
                });

                // Hide all content
                tabContents.forEach(content => {
                    content.classList.add('hidden');
                });

                // Activate clicked tab
                button.classList.remove('text-gray-300', 'hover:bg-gray-800');
                button.classList.add('bg-doom-red', 'text-white');

                // Show corresponding content
                const contentId = button.id.replace('Tab', 'Body');
                document.getElementById(contentId).classList.remove('hidden');
            });
        });
    }

    function init() {
        // Initialize tab switching
        initTabs();

        // Close button
        document.getElementById("close-btn").addEventListener("click", () => {
            window.close();
        });

        document.getElementById("close-config-btn").addEventListener("click", () => {
            window.close();
        });

        // Submit button
        document.getElementById("submitConfig").addEventListener("click", () => {
            appendData();
            window.close();
        });
    }

    function appendData() {
        // Create the game config object
        var tmp = {
            "metadata": {
                "name": "null",
                "author": "null",
                "year": "null",
                "grid": "null"
            },
            "game": {
                "sourceport": "null",
                "-iwad": "null",
                "modded": "null",
                "mods": {},
                "-config": "null"
            },
            "opts": {
                "enableSounds": "null",
                "-nosound": "null",
                "-nosfx": "null",
                "-nomusic": "null",
                "-nomonsters": "null",
                "-fast": "null",
                "-respawn": "null",
                "-width": "null",
                "-height": "null",
                "+fullscreen": "null",
                "+vid_rendermode": "null",
                "custom": "null",
                "jumpFlags": {
                    "enabled": "null",
                    "-map": "null",
                    "-skill": "null"
                }
            }
        };

        // Set basic metadata
        tmp.metadata.name = document.getElementById("gameTitle").value;
        tmp.metadata.author = document.getElementById("gameAuthor").value;
        tmp.metadata.year = document.getElementById("gameYear").value;
        tmp.metadata.grid = document.getElementById("coverImage")?.value || "thumbs/unknown.jpg";

        // Set game configuration
        tmp.game.sourceport = document.getElementById("sourceport").value;
        tmp.game["-iwad"] = document.getElementById("-iwad").value;
        tmp.game["-config"] = document.getElementById("-config")?.value || "null";

        // Handle checkboxes
        const checkboxes = [
            "-nosound", "-nosfx", "-nomusic", "-nomonsters",
            "-fast", "-respawn", "+fullscreen"
        ];

        checkboxes.forEach(id => {
            const element = document.getElementById(id);
            if (element && element.checked) {
                tmp.opts[id] = true;
            }
        });

        // Handle video settings
        tmp.opts["+vid_rendermode"] = document.getElementById("+vid_rendermode").value;
        tmp.opts["-width"] = document.getElementById("-width")?.value || "null";
        tmp.opts["-height"] = document.getElementById("-height")?.value || "null";

        // Handle jump flags
        if (document.getElementById("jump") && document.getElementById("jump").checked) {
            tmp.opts.jumpFlags.enabled = true;
            tmp.opts.jumpFlags["-map"] = document.getElementById("-map").value;
            tmp.opts.jumpFlags["-skill"] = document.getElementById("-skill").value;
        }

        // Custom parameters
        tmp.opts.custom = document.getElementById("custom")?.value || "null";

        // Send data to main process
        console.log("Submitting game configuration:", tmp);
        ipcRenderer.send('addGame', tmp);
    }

    document.onreadystatechange = () => {
        if (document.readyState == "complete") {
            init();
        }
    };
})();