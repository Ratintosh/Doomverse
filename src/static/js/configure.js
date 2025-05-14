(function () {
    const { ipcRenderer } = require('electron');
    let configData = {}; // Current configuration from backend
    let editedConfig = {}; // Local edits that haven't been saved yet
    
    // Add close button functionality
    document.getElementById("close-btn").addEventListener("click", function(e) {
        console.log("Close button clicked");
        //e.preventDefault(); // Prevent default action if it's a link
        
        // Check if there are unsaved changes
        hasUnsavedChanges = JSON.stringify(configData) !== JSON.stringify(editedConfig);
        
        if (hasUnsavedChanges) {
            const confirmation = confirm("You have unsaved changes. Are you sure you want to close this window?");
            if (confirmation) {
                ipcRenderer.send('closeConfigWindow');
            }
        } else {
            // No unsaved changes, just close
            ipcRenderer.send('closeConfigWindow');
        }
    });
    
    // Tab switching functionality
    document.getElementById("sourceportTab").addEventListener("click", function() {
        switchTab("sourceport");
    });
    
    document.getElementById("iwadTab").addEventListener("click", function() {
        switchTab("iwad");
    });

    function switchTab(tabName) {
        // Hide all sections
        document.querySelectorAll(".configSection").forEach(section => {
            section.style.display = "none";
        });
        
        // Show selected section
        document.getElementById(tabName + "Body").style.display = "block";
        
        // Update tab selection styling
        document.querySelectorAll(".navBarElement").forEach(tab => {
            tab.classList.remove("selected");
        });
        document.getElementById(tabName + "Tab").classList.add("selected");
    }

    // Add entry buttons
    document.querySelectorAll(".addEntryBtn").forEach(button => {
        button.addEventListener("click", function() {
            const section = this.getAttribute("data-section");
            const newEntryName = "new_" + section.substring(0, section.length - 1) + "_" + Date.now();
            
            // Add new entry to edited config data, not the original
            editedConfig[section][newEntryName] = null;
            
            // Refresh the table
            clearTable(section + "Table");
            populateTable(section, editedConfig[section]);
        });
    });

    // Save changes
    document.getElementById("saveChanges").addEventListener("click", function() {
        // Only send edited configuration to main process when save is clicked
        ipcRenderer.send('submitConfigChanges', editedConfig);
    });

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
        editedConfig = JSON.parse(JSON.stringify(data)); // Deep copy
        
        renderAllTables(editedConfig);
        document.getElementById("statusMsg").style.display = "none";
    });

    // Handle file path updates - update only the edited config
    ipcRenderer.on('updateConfigWizard', (event, data) => {
        // Update editedConfig with the new file path info
        for (const section in data) {
            for (const key in data[section]) {
                editedConfig[section][key] = data[section][key];
            }
        }
        renderAllTables(editedConfig);
    });

    function renderAllTables(data) {
        for (const section in data) {
            clearTable(section + "Table");
            populateTable(section, data[section]);
        }
    }

    function clearTable(tableId) {
        const table = document.getElementById(tableId);
        // Keep the header row (index 0) and remove the rest
        while (table.rows.length > 1) {
            table.deleteRow(1);
        }
    }

    function populateTable(section, entries) {
        const tableId = section + "Table";
        const table = document.getElementById(tableId);

        for (const entryName in entries) {
            const row = table.insertRow(-1);
            const nameCell = row.insertCell(0);
            const pathCell = row.insertCell(1);
            const validCell = row.insertCell(2);
            const actionCell = row.insertCell(3); // For delete button

            // Name input
            const nameInput = document.createElement("input");
            nameInput.type = "text";
            nameInput.value = entryName;
            nameInput.addEventListener("change", function() {
                const oldName = entryName;
                const newName = this.value;
                
                if (oldName !== newName) {
                    const value = editedConfig[section][oldName];
                    editedConfig[section][newName] = value;
                    delete editedConfig[section][oldName];
                    
                    // Regenerate table to reflect changes
                    clearTable(section + "Table");
                    populateTable(section, editedConfig[section]);
                }
            });

            // Path input
            const pathInput = document.createElement("input");
            pathInput.type = "text";
            pathInput.setAttribute("data-section", section);
            pathInput.setAttribute("data-entry", entryName);
            
            // Set path value and validity indicator
            const path = entries[entryName];
            if (path === null) {
                pathInput.value = "Click to set path...";
                validCell.innerHTML = "❌";
            } else {
                pathInput.value = path;
                validCell.innerHTML = "✅";
            }

            // Handle path selection
            pathInput.addEventListener("click", function() {
                const section = this.getAttribute("data-section");
                const entry = this.getAttribute("data-entry");
                ipcRenderer.send('chooseFile', {
                    "value": entry,
                    "section": section
                });
            });

            // Delete button
            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "✕";
            deleteBtn.className = "deleteBtn";
            deleteBtn.setAttribute("data-entry", entryName);
            deleteBtn.addEventListener("click", function() {
                delete editedConfig[section][entryName];
                clearTable(section + "Table");
                populateTable(section, editedConfig[section]);
            });

            nameCell.appendChild(nameInput);
            pathCell.appendChild(pathInput);
            actionCell.appendChild(deleteBtn);
        }
    }
})();