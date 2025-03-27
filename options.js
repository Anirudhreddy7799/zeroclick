document.getElementById('saveBtn').addEventListener('click', () => {
    const delay = parseInt(document.getElementById('delay').value, 10);
    if (isNaN(delay) || delay < 0 || delay > 2000) {
        alert('Please enter a valid delay between 0 and 2000 milliseconds.');
        return;
    }
    chrome.storage.sync.set({ delay }, () => {
        alert('Settings saved!');
    });
});
