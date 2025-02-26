import { loadSpatialNavigationScript, removeSpatialNavigation } from "../../../services/Navigation.js";
import { initAVPlayer, setMediaSource, StreamType } from "../../../services/AVPlayer.js";

export async function LiveTvPage() {
    const liveTvContainer = document.createElement('div');
    liveTvContainer.setAttribute('tabindex', '0');

    const style = document.createElement('style');
    style.textContent = `
    .container {
      display: flex;
      flex-direction: column;
      position: relative;
      width: 100%;
      height: 100%;
    }
    
    .app-shell {
      position: absolute;
      top: 65%;
      left: 0;
    }
  `;
    liveTvContainer.appendChild(style);



    const liveTvAppShell = document.createElement('live-tv');
    liveTvAppShell.className = 'app-shell';





    // Await channel data from the custom element
    const channels = await liveTvAppShell.getChannelData();
    if (!channels || channels.length === 0) {
        console.error("No channel data available");
        return liveTvContainer;
    }
    const firstChannel = channels[0];

    const backgroundContainer = document.createElement('background-container');
    backgroundContainer.setAttribute('type', 'video');
    backgroundContainer.setAttribute('data-performance', 'tv-optimized');
    backgroundContainer.setAttribute('source', firstChannel.url);
    backgroundContainer.setAttribute('media-type', 'live');

    backgroundContainer.appendChild(liveTvAppShell);
    liveTvContainer.appendChild(backgroundContainer);

    requestAnimationFrame(() => {
        if (liveTvAppShell) {
            // Render the app shell (this call is asynchronous, so it will update the sidebar when complete)
            liveTvAppShell.render();
            loadSpatialNavigationScript('.sidebar-item');

            const sidebarItems = liveTvAppShell.shadowRoot.querySelectorAll('.sidebar-item');

            // Add focus handling for sidebar items
            sidebarItems.forEach(item => {
                item.addEventListener('focus', () => {
                    sidebarItems.forEach(i => i.classList.remove('focused'));
                    item.classList.add('focused');
                });
            });

            // Handle key navigation events
            liveTvContainer.addEventListener('keydown', async (event) => {
                const currentFocus = liveTvAppShell.shadowRoot.querySelector('.focused');
                const items = Array.from(liveTvAppShell.shadowRoot.querySelectorAll('.sidebar-item'));
                const currentIndex = items.indexOf(currentFocus);

                switch (event.keyCode) {
                    case 38: // Up arrow
                        event.preventDefault();
                        if (currentIndex > 0) {
                            items[currentIndex - 1].focus();
                            items[currentIndex - 1].scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }
                        break;
                    case 40: // Down arrow
                        event.preventDefault();
                        if (currentIndex < items.length - 1) {
                            items[currentIndex + 1].focus();
                            items[currentIndex + 1].scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }
                        break;
                    case 13: // Enter key
                        event.preventDefault();
                        if (currentFocus) {
                            // Retrieve fresh channel data on Enter
                            const channels = await liveTvAppShell.getChannelData();
                            const channelIndex = currentFocus.dataset.channelIndex;
                            const selectedChannel = channels[channelIndex];
                            if (selectedChannel) {
                                backgroundContainer.updateSource(selectedChannel.url, "live");
                                setMediaSource(selectedChannel.url, "videoSurface", StreamType.LIVE);
                            }
                        }
                        break;
                    case 10009: // Back key (for TV)
                    case 8:       // Backspace key
                        event.preventDefault();
                        removeSpatialNavigation('.sidebar-item');
                        // Add your back navigation logic here if needed
                        break;
                }
            });

            // Set initial focus on the first sidebar item
            if (sidebarItems.length > 0) {
                sidebarItems[0].focus();
                sidebarItems[0].classList.add('focused', 'selected');
            }
        }
    });

    // Cleanup function for spatial navigation
    const cleanup = () => {
        removeSpatialNavigation('.sidebar-item');
    };

    liveTvContainer.addEventListener('disconnect', cleanup);
    window.addEventListener('beforeunload', cleanup);

    initAVPlayer();
    requestAnimationFrame(() => {
        const videoSurface = backgroundContainer.getVideoSurface();
        if (videoSurface) {
            setMediaSource(firstChannel.url, videoSurface, StreamType.LIVE);
        } else {
            console.log("Video surface is not found in the background container");
        }
    });

    return liveTvContainer;
}
