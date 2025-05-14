(function () {
    const { ipcRenderer } = require('electron');
    let configData = {}; // Current configuration from backend
    let editedConfig = {}; // Local edits that haven't been saved yet

    // Tab switching functionality
    document.getElementById("sourceportTab").addEventListener("click", function () {
        switchTab("sourceport");
    });

    document.getElementById("iwadTab").addEventListener("click", function () {
        switchTab("iwad");
    });

    function switchTab(tabName) {
        // Hide all sections
        document.querySelectorAll(".configSection").forEach(section => {
            section.classList.add("hidden");
        });

        // Show selected section
        document.getElementById(tabName + "Body").classList.remove("hidden");

        // Update tab selection styling
        document.querySelectorAll(".tab-btn").forEach(tab => {
            tab.classList.remove("bg-doom-red", "text-white");
            tab.classList.add("text-gray-300", "hover:bg-gray-800");
        });
        document.getElementById(tabName + "Tab").classList.remove("text-gray-300", "hover:bg-gray-800");
        document.getElementById(tabName + "Tab").classList.add("bg-doom-red", "text-white");
    }

    // Add entry buttons
    document.querySelectorAll(".addEntryBtn").forEach(button => {
        button.addEventListener("click", function () {
            const section = this.getAttribute("data-section");
            const newEntryName = "new_" + section.substring(0, section.length - 1) + "_" + Date.now();

            // Add new entry to edited config data, not the original
            editedConfig[section][newEntryName] = null;

            // Refresh the table
            renderTable(section, editedConfig[section]);
        });
    });

    // Save changes
    document.getElementById("saveChanges").addEventListener("click", function () {
        // Only send edited configuration to main process when save is clicked
        ipcRenderer.send('submitConfigChanges', editedConfig);
    });

    // Close buttons
    document.getElementById("close-btn").addEventListener("click", function () {
        handleClose();
    });

    document.getElementById("close-btn-footer").addEventListener("click", function () {
        handleClose();
    });

    function handleClose() {
        // Check if there are unsaved changes
        if (JSON.stringify(configData) !== JSON.stringify(editedConfig)) {
            const confirmation = confirm("You have unsaved changes. Are you sure you want to close this window?");
            if (confirmation) {
                ipcRenderer.send('closeConfigWindow');
            }
        } else {
            ipcRenderer.send('closeConfigWindow');
        }
    }

    // Request initial config when page loads
    document.onreadystatechange = () => {
        if (document.readyState == "complete") {
            ipcRenderer.send('requestConfig');
        }
    };

    // Handle config data from main process
    ipcRenderer.on('config', (event, data) => {
        // Store both the original and create a deep copy for edits
        configData = data;
        editedConfig = JSON.parse(JSON.stringify(data));

        renderAllTables();
        document.getElementById("statusMsg").style.display = "none";
    });

    // Handle file path updates
    ipcRenderer.on('updateConfigWizard', (event, data) => {
        // Update editedConfig with the new file path info
        for (const section in data) {
            for (const key in data[section]) {
                editedConfig[section][key] = data[section][key];
            }
        }
        renderAllTables();
    });

    function renderAllTables() {
        for (const section in editedConfig) {
            renderTable(section, editedConfig[section]);
        }
    }

    function renderTable(section, entries) {
        const tableId = section + "Table";
        const table = document.getElementById(tableId);

        // Clear existing rows except header
        const tbody = table.getElementsByTagName('tbody')[0];
        tbody.innerHTML = '';

        // Check if there are entries
        if (Object.keys(entries).length === 0) {
            const row = tbody.insertRow();
            row.classList.add("border-t", "border-gray-700");
            const cell = row.insertCell(0);
            cell.colSpan = 4;
            cell.className = "px-4 py-3 text-gray-400 text-center";
            cell.textContent = `No ${section} configured yet.`;
            return;
        }

        // Add entries to table
        for (const entryName in entries) {
            const row = tbody.insertRow();
            row.classList.add("border-t", "border-gray-700", "hover:bg-gray-700");

            // Name cell
            const nameCell = row.insertCell(0);
            nameCell.className = "px-4 py-3";
            const nameInput = document.createElement("input");
            nameInput.type = "text";
            nameInput.value = entryName;
            nameInput.className = "w-full bg-gray-700 text-white border border-gray-600 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-doom-red focus:border-transparent";
            nameInput.addEventListener("change", function () {
                const oldName = entryName;
                const newName = this.value;

                if (oldName !== newName) {
                    const value = editedConfig[section][oldName];
                    editedConfig[section][newName] = value;
                    delete editedConfig[section][oldName];
                    renderTable(section, editedConfig[section]);
                }
            });
            nameCell.appendChild(nameInput);

            // Path cell
            const pathCell = row.insertCell(1);
            pathCell.className = "px-4 py-3";
            const pathInput = document.createElement("input");
            pathInput.type = "text";
            pathInput.classList.add("w-full", "bg-gray-700", "text-white", "border", "border-gray-600", "rounded-md", "px-2", "py-1", "focus:outline-none", "focus:ring-2", "focus:ring-doom-red", "focus:border-transparent");
            pathInput.setAttribute("data-section", section);
            pathInput.setAttribute("data-entry", entryName);

            // Set path value
            const path = entries[entryName];
            pathInput.value = path || "Click to set path...";

            // Handle path selection
            pathInput.addEventListener("click", function () {
                const section = this.getAttribute("data-section");
                const entry = this.getAttribute("data-entry");
                ipcRenderer.send('chooseFile', {
                    "value": entry,
                    "section": section
                });
            });
            pathCell.appendChild(pathInput);

            // Valid cell
            const validCell = row.insertCell(2);
            validCell.className = "px-4 py-3 text-center";
            if (path === null || path === undefined || path === "") {
                validCell.innerHTML = '<span class="text-red-500 font-bold">❌</span>';
            } else {
                validCell.innerHTML = '<span class="text-green-500 font-bold">✓</span>';
            }

            // Action cell (delete button)
            const actionCell = row.insertCell(3);
            actionCell.className = "px-4 py-3 text-center";
            const deleteBtn = document.createElement("button");
            deleteBtn.className = "text-red-500 hover:text-red-300";
            deleteBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>';
            deleteBtn.setAttribute("title", "Delete");
            deleteBtn.setAttribute("data-entry", entryName);
            deleteBtn.addEventListener("click", function () {
                if (confirm(`Are you sure you want to delete "${entryName}"?`)) {
                    delete editedConfig[section][entryName];
                    renderTable(section, editedConfig[section]);
                }
            });
            actionCell.appendChild(deleteBtn);
        }
    }
})();