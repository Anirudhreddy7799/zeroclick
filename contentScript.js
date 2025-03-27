let isMouseOverIframe = false; // Flag to track if the mouse is over the iframe
let previewBox; // Reference to the preview box
let isEnabled = true; // Default state

// Listen for messages from the popup to toggle the extension state
chrome.runtime.onMessage.addListener((message) => {
    if (message.hasOwnProperty('isEnabled')) {
        isEnabled = message.isEnabled;
        if (!isEnabled && previewBox) {
            // Remove the preview box if the extension is disabled
            previewBox.remove();
            previewBox = null;
        }
    }
});

document.addEventListener('mouseover', async (event) => {
    if (!isEnabled) return; // Exit if the extension is disabled

    const link = event.target.closest('a');
    if (link && link.href) {
        // If a preview box already exists, do nothing
        if (previewBox) return;

        // Create the preview box
        previewBox = document.createElement('div');
        previewBox.id = 'zeroClickPreviewBox';
        previewBox.style.position = 'absolute';
        previewBox.style.top = `${event.pageY + 15}px`;
        previewBox.style.left = `${event.pageX + 15}px`;
        previewBox.style.background = '#fff';
        previewBox.style.border = '1px solid #ccc';
        previewBox.style.padding = '0';
        previewBox.style.zIndex = '10000';
        previewBox.style.width = '500px'; // Increased width
        previewBox.style.height = '400px'; // Increased height
        previewBox.style.overflow = 'hidden';
        previewBox.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';

        // Create the iframe for rendering the preview
        const iframe = document.createElement('iframe');
        iframe.src = link.href;
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.border = 'none';
        iframe.style.margin = '0'; // Remove default margin
        iframe.style.padding = '0'; // Remove default padding
        iframe.style.boxSizing = 'border-box'; // Ensure proper box sizing
        iframe.style.pointerEvents = 'auto'; // Allow interaction with the iframe

        // Set the flag when the mouse enters the iframe
        iframe.addEventListener('mouseenter', () => {
            isMouseOverIframe = true;
        });

        // Reset the flag when the mouse leaves the iframe
        iframe.addEventListener('mouseleave', () => {
            isMouseOverIframe = false;
            // Remove the preview box only if the mouse is not over the link
            if (!link.matches(':hover')) {
                if (previewBox) {
                    previewBox.remove();
                    previewBox = null;
                }
            }
        });

        // Add error handling for iframe loading issues
        iframe.addEventListener('error', () => {
            if (previewBox) {
                previewBox.innerHTML = `
                    <div style="padding: 10px; text-align: center; color: #333; font-family: Arial, sans-serif; font-size: 12px;">
                        Due to security reasons, the preview can't be displayed.
                    </div>
                `;
            }
        });

        // Append the iframe to the preview box
        previewBox.appendChild(iframe);
        document.body.appendChild(previewBox);

        // Remove the preview box when the mouse leaves the link, but only if not over the iframe
        link.addEventListener('mouseleave', () => {
            setTimeout(() => {
                if (!isMouseOverIframe && previewBox) {
                    previewBox.remove();
                    previewBox = null;
                }
            }, 100); // Small delay to allow iframe mouseenter to trigger
        });
    }
});
