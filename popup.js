document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.getElementById('toggleButton');

    // Get the current state from storage
    chrome.storage.sync.get('isEnabled', (data) => {
        if (data.isEnabled === false) {
            toggleButton.textContent = 'Turn On';
        } else {
            toggleButton.textContent = 'Turn Off';
        }
    });

    // Toggle the state when the button is clicked
    toggleButton.addEventListener('click', () => {
        chrome.storage.sync.get('isEnabled', (data) => {
            const newState = !(data.isEnabled === false); // Toggle the state
            chrome.storage.sync.set({ isEnabled: newState }, () => {
                toggleButton.textContent = newState ? 'Turn Off' : 'Turn On';

                // Notify the content script about the state change
                chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                    if (tabs[0]) {
                        chrome.tabs.sendMessage(tabs[0].id, { isEnabled: newState }, (response) => {
                            if (chrome.runtime.lastError) {
                                console.warn('Content script not found on this page.');
                            }
                        });
                    }
                });
            });
        });
    });
});