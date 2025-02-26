import { loadSpatialNavigationScript, removeSpatialNavigation } from "../../../services/Navigation.js";
import {initAVPlayer, setMediaSource, StreamType} from "../../../services/AVPlayer.js";

export function LiveTvPage() {
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
        
        .app-shell{
        position: absolute;
        top: 65%;
        left:0;
        }
            
        
    `;
    liveTvContainer.appendChild(style);

    const container = document.createElement('div');
    container.className = 'container';

    const liveTvAppShell = document.createElement('live-tv');
    liveTvAppShell.className = 'app-shell';

    const liveTvFooter = document.createElement('live-footer');
    liveTvFooter.className = 'tv-footer';



    container.append(liveTvAppShell, liveTvFooter);


    const channels = liveTvAppShell.getChannelData();
    const firstChannel = channels[0];

    const backgroundContainer = document.createElement('background-container');
    backgroundContainer.setAttribute('type', 'video');
    backgroundContainer.setAttribute('data-performance', 'tv-optimized');
    backgroundContainer.setAttribute('source', firstChannel.channelLink);
    backgroundContainer.setAttribute('media-type', 'live');

    backgroundContainer.appendChild(container);
    liveTvContainer.appendChild(backgroundContainer);

    requestAnimationFrame(() => {
        if (liveTvAppShell) {
            liveTvAppShell.render();
            loadSpatialNavigationScript('.sidebar-item');

            const sidebarItems = liveTvAppShell.shadowRoot.querySelectorAll('.sidebar-item');

            // Handle focus events: add 'focused' class to the focused item.
            sidebarItems.forEach(item => {
                item.addEventListener('focus', () => {
                    sidebarItems.forEach(i => i.classList.remove('focused'));
                    item.classList.add('focused');
                });
            });

            // Handle key navigation events on liveTvContainer.
            liveTvContainer.addEventListener('keydown', (event) => {
                const currentFocus = liveTvAppShell.shadowRoot.querySelector('.focused');
                const items = Array.from(sidebarItems);
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
                            // Retrieve the channel index from the focused item
                            const channelIndex = currentFocus.dataset.channelIndex;
                            const selectedChannel = channels[channelIndex];
                            if (selectedChannel) {
                               backgroundContainer.updateSource(selectedChannel.channelLink, "live");
                                setMediaSource(selectedChannel.channelLink, "videoSurface", StreamType.LIVE);
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

            // Set initial focus and selection on the first sidebar item
            if (sidebarItems.length > 0) {
                sidebarItems[0].focus();
                sidebarItems[0].classList.add('focused', 'selected');
            }
        }
    });

    // Cleanup function for navigation
    const cleanup = () => {
        removeSpatialNavigation('.sidebar-item');
    };

    liveTvContainer.addEventListener('disconnect', cleanup);
    window.addEventListener('beforeunload', cleanup);

    initAVPlayer();
    requestAnimationFrame(() => {
        const videoSurface = backgroundContainer.getVideoSurface();
        if(videoSurface){
            setMediaSource(firstChannel.channelLink, videoSurface, StreamType.LIVE);
        }else {
            console.log("Video surface is not found in the background container");
        }
    })

    return liveTvContainer;
}
