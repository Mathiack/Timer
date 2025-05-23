function isMobile() {
    return window.innerWidth <= 800;
}

function isPc() {
    return !isMobile();
}

function toggleDropdown(menuId) {
    const menu = document.getElementById(menuId);
    const dropdown = menu.parentElement;

    document.querySelectorAll('.dropdown').forEach(d => {
        if (d !== dropdown) {
            d.classList.remove('show');
        }
    });

    dropdown.classList.toggle('show');

    document.addEventListener('click', closeDropdownOnClickOutside);
}

function closeDropdownOnClickOutside(event) {
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        if (!dropdown.contains(event.target)) {
            dropdown.classList.remove('show');
        }
    });
    document.removeEventListener('click', closeDropdownOnClickOutside);
}

function toggleSidebar(sidebarId) {
    const sidebar = document.getElementById(sidebarId);

    document.querySelectorAll('.sidebar').forEach(s => {
        if (s !== sidebar) {
            s.classList.remove('show');
        }
    });

    sidebar.classList.toggle('show');
}

function showToast(message, icon = "") {
    const snackbar = document.createElement("div");
    snackbar.className = "toast show";
    snackbar.innerHTML = `<span class='icon' style='font-size:x-large'>${icon}</span><p>${message}</p>`;

    document.body.appendChild(snackbar);

    setTimeout(() => {
        snackbar.classList.remove("show");
        setTimeout(() => {
            snackbar.remove();
        }, 400);
    }, 3000);
}

function hideAllMenus() {
    document.querySelectorAll('.dropdown').forEach(dropdown => {
        dropdown.classList.remove('show');
    });
}

function hideAllSidebars() {
    document.querySelectorAll('.sidebar').forEach(sidebar => {
        sidebar.classList.remove('show');
    });
}

function promptString(title, defaultText = "") {
    return new Promise((resolve) => {
        // overlay
        const overlay = document.createElement('div');
        overlay.className = 'prompt-overlay';

        // dialog
        const dialog = document.createElement('div');
        dialog.className = 'prompt-dialog';

        // title
        const titleElement = document.createElement('p');
        titleElement.textContent = title;
        titleElement.className = 'prompt-title';
        dialog.appendChild(titleElement);

        // field
        const input = document.createElement('input');
        input.type = 'text';
        input.value = defaultText ? defaultText : ""
        input.className = 'prompt-input';
        dialog.appendChild(input);

        // buttons
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'prompt-buttons';

        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'Cancel';
        cancelButton.className = 'prompt-button cancel';

        const submitButton = document.createElement('button');
        submitButton.textContent = 'Ok';
        submitButton.className = 'prompt-button submit';

        buttonContainer.appendChild(cancelButton);
        buttonContainer.appendChild(submitButton);
        dialog.appendChild(buttonContainer);

        overlay.appendChild(dialog);
        document.body.appendChild(overlay);

        input.focus();
        input.selectionStart = 0;
        input.selectionEnd = input.value.length;

        function closePrompt(result) {
            document.body.removeChild(overlay);
            resolve(result);
        }

        cancelButton.addEventListener('click', () => closePrompt(null));
        submitButton.addEventListener('click', () => closePrompt(input.value));

        overlay.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                closePrompt(input.value);
            } else if (event.key === 'Escape') {
                closePrompt(null);
            }
        });
    });
}

function promptMessage(htmlContent) {
    return new Promise((resolve) => {
        // overlay
        const overlay = document.createElement('div');
        overlay.className = 'prompt-overlay';

        // dialog
        const dialog = document.createElement('div');
        dialog.className = 'prompt-dialog';
        dialog.style.width = '100%';
        dialog.style.maxWidth = '500px';

        // html content
        const content = document.createElement('div');
        content.innerHTML = htmlContent;
        content.style.marginBottom = '15px';
        dialog.appendChild(content);

        // ok button
        const okButton = document.createElement('button');
        okButton.textContent = 'Ok';
        okButton.className = 'prompt-button submit';

        dialog.appendChild(okButton);
        overlay.appendChild(dialog);
        document.body.appendChild(overlay);

        function closePrompt() {
            document.body.removeChild(overlay);
            resolve();
        }

        okButton.addEventListener('click', closePrompt);

        overlay.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === 'Escape') {
                closePrompt();
            }
        });

        okButton.focus();
    });
}

function promptMessageFromFile(filePath, buttonText = "Ok") {
    return new Promise((resolve, reject) => {
        fetch(filePath)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Failed loading file: ${response.statusText}`);
                }
                return response.text();
            })
            .then(htmlContent => {
                // overlay
                const overlay = document.createElement('div');
                overlay.className = 'prompt-overlay';

                // dialog
                const dialog = document.createElement('div');
                dialog.className = 'prompt-dialog';
                dialog.style.width = '100%';
                dialog.style.maxWidth = '500px';

                // html content
                const content = document.createElement('div');
                content.innerHTML = htmlContent;
                content.style.marginBottom = '15px';
                dialog.appendChild(content);

                // ok button
                const okButton = document.createElement('button');
                okButton.textContent = buttonText;
                okButton.className = 'prompt-button';

                dialog.appendChild(okButton);
                overlay.appendChild(dialog);
                document.body.appendChild(overlay);

                function closePrompt() {
                    document.body.removeChild(overlay);
                    resolve();
                }

                okButton.addEventListener('click', closePrompt);

                overlay.addEventListener('keydown', (event) => {
                    if (event.key === 'Enter' || event.key === 'Escape') {
                        closePrompt();
                    }
                });

                okButton.focus();
            })
            .catch(error => {
                reject(error);
            });
    });
}

function promptConfirm(message) {
    return new Promise((resolve) => {
        // overlay
        const overlay = document.createElement('div');
        overlay.className = 'prompt-overlay';

        // dialog
        const dialog = document.createElement('div');
        dialog.className = 'prompt-dialog';
        dialog.style.width = '100%';
        dialog.style.maxWidth = '400px';

        // message
        const text = document.createElement('p');
        text.textContent = message;
        text.className = 'prompt-title';
        dialog.appendChild(text);

        // buttons
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'prompt-buttons';

        const yesButton = document.createElement('button');
        yesButton.textContent = 'Yes';
        yesButton.className = 'prompt-button submit';

        const noButton = document.createElement('button');
        noButton.textContent = 'No';
        noButton.className = 'prompt-button cancel';

        buttonContainer.appendChild(noButton);
        buttonContainer.appendChild(yesButton);
        dialog.appendChild(buttonContainer);

        overlay.appendChild(dialog);
        document.body.appendChild(overlay);

        function closePrompt(result) {
            document.body.removeChild(overlay);
            resolve(result);
        }

        yesButton.addEventListener('click', () => closePrompt(true));
        noButton.addEventListener('click', () => closePrompt(false));

        overlay.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                closePrompt(true);
            } else if (event.key === 'Escape') {
                closePrompt(false);
            }
        });

        yesButton.focus();
    });
}

function closeContextMenu() {
    const existing = document.querySelector('.custom-context-menu');
    if (existing) existing.remove();
    document.removeEventListener('click', closeContextMenu);
}
