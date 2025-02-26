// Global state management for the TV player
let avplay = null;
let screenDimensions = {
    width: 1920,
    height: 1080
};
let currentState = 'INITIALIZING';
let retryCount = 0;
let diagnosticInterval = null;

// Constants for stream management
const STREAM_SETTINGS = {
    MAX_RETRIES: 3,
    RETRY_DELAY: 3000,
    DIAGNOSTIC_INTERVAL: 1000,
    PREPARE_DELAY: 100
};

//Media type definitions
export const StreamType = {
    LIVE: 'live',
    VOD: 'vod'
}

// Player state definitions for better state tracking
const PlayerState = {
    INITIALIZING: 'initializing',
    READY: 'ready',
    PLAYING: 'playing',
    BUFFERING: 'buffering',
    ERROR: 'error'
};

/**
 * Displays a temporary overlay showing the media URL.
 */
function displayMediaLink(url) {
    const mediaLinkDiv = document.createElement('div');
    mediaLinkDiv.style.position = 'absolute';
    mediaLinkDiv.style.top = '0';
    mediaLinkDiv.style.left = '0';
    mediaLinkDiv.style.color = 'white';
    mediaLinkDiv.style.fontSize = '24px';
    mediaLinkDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    mediaLinkDiv.style.padding = '10px';
    document.body.appendChild(mediaLinkDiv);
    setTimeout(() => {
        mediaLinkDiv.remove();
    }, 10000);
}

/**
 * Initializes the AVPlayer and sets up the video display environment.
 */
export function initAVPlayer() {
    try {
        if (window.webapis && window.webapis.avplay) {
            avplay = window.webapis.avplay;
            console.log("AVPlayer initialized successfully.");
            if (window.webapis.tv && window.webapis.tv.getScreenResolution) {
                const screenInfo = window.webapis.tv.getScreenResolution();
                screenDimensions = {width: screenInfo.width, height: screenInfo.height};
            }
            console.log("AVPlayer initialized with resolution:", screenDimensions);
            updatePlayerState(PlayerState.READY);
            startDiagnostics();
        } else {
            throw new Error("AVPlayer API not available");
        }
    } catch (error) {
        console.error("AVPlayer initialization error:", error);
        showError("Failed to initialize player");
    }
}

/**
 * Configures the display surface for optimal video rendering.
 * @param {string} targetId - The id of the element where video should be displayed.
 */
function configureDisplaySurface(targetId = 'videoSurface') {
    try {
        if (!avplay) return;
        let videoSurface;

        if(typeof targetId === 'string'){
            const backgroundContainer = document.querySelector('background-container');
            if(!backgroundContainer){
                console.error("BackgroundContainer element not found");
                return;
            }

            videoSurface = backgroundContainer.shadowRoot.getElementById(targetId);
        }else if(targetId instanceof HTMLElement){
            videoSurface = targetId;
        }
        if(!videoSurface){
            console.error(`Element with id or reference "${targetId}" not found`);
            return;
        }

        try {
            avplay.setDisplayMethod("PLAYER_DISPLAY_MODE_FULL_SCREEN");
        } catch (e) {
            console.warn("setDisplayMethod not supported:", e);
        }
        avplay.setDisplayRect(0, 0, screenDimensions.width, screenDimensions.height);
        console.log("Display configured:", screenDimensions);
    } catch (error) {
        console.error("Display configuration error:", error);
    }
}

/**
 * Configures streaming properties.
 */
function configureStreamProperties(mediaType) {
    if (!avplay) return;

    try {
        avplay.setStreamingProperty("COOKIE", "");

        if (mediaType === StreamType.LIVE) {
            //LIVE SETTINGS
            avplay.setStreamingProperty("PREBUFFER_MODE", "TIME_BASED");
            avplay.setStreamingProperty("PREBUFFER_TIME", "2");
            avplay.setStreamingProperty("ADAPTIVE_INFO", "BITRATES=5000~10000|STARTBITRATE=AVERAGE");
        } else {
            // VOD settings
            avplay.setStreamingProperty("PREBUFFER_MODE", "PERCENTAGE_BASED");
            avplay.setStreamingProperty("PREBUFFER_PERCENT", "100");
            avplay.setStreamingProperty("ADAPTIVE_INFO", "BITRATES=2000~20000|STARTBITRATE=MAX");
        }

        avplay.setStreamingProperty("BUFFER_SIZE", "5242880");
        console.log("Stream properties set successfully for media type:", mediaType);
    } catch (error) {
        console.error("Stream property configuration error:", error);
    }
}

/**
 * Sets up event listeners for stream monitoring.
 */
function setupEventListeners() {
    avplay.setListener({
        onbufferingstart: () => {
            console.log("Buffering started");
            updatePlayerState(PlayerState.BUFFERING);
            
        },
        onbufferingprogress: (percent) => {
            console.log(`Buffering: ${percent}%`);
           
        },
        onbufferingcomplete: () => {
            console.log("Buffering complete");
            toggleLoading(false);
            if (currentState === PlayerState.BUFFERING) {
                play();
            }
        },
        onstreamcompleted: () => console.log("Playback complete"),
        onerror: (error) => {
            console.error("Playback error:", error);
            toggleLoading(false);
            showError("Error during playback!");
        },
        onstart: () => {
            console.log("Media playback started.");
            toggleLoading(false);
        },
        onplay: () => {
            console.log("Media is playing.");
            updatePlayerState(PlayerState.PLAYING);
            toggleLoading(false);
        }
    });
}

/**
 * Sets up the TV channel stream and prepares it for playback.
 * @param {string} url - The URL of the TV channel stream.
 * @param {string} targetId - The id of the element where video will render.
 * @param mediaType
 */
export function setMediaSource(url, targetId = 'videoSurface', mediaType = StreamType.LIVE) {
    if (!avplay) {
        console.error("AVPlayer not initialized");
        return;
    }
    try {
        stop();
        displayMediaLink(url);
        
        
        // const finalUrl = mediaType === StreamType.VOD && url.startsWith("file://")
        // ? url
        // : `NORMAL${url}`;
        if (typeof avplay.setProperty === 'function') {
        	  avplay.setProperty("CONTENT_TYPE", mediaType === StreamType.LIVE ? "LIVE" : "VIDEO");
        	}

        
        
//        avplay.setProperty("CONTENT_TYPE", mediaType === StreamType.LIVE? "LIVE" : "VIDEO");
       avplay.open(url);

        configureDisplaySurface(targetId);
        configureStreamProperties(mediaType);
        setupEventListeners();

        avplay.prepareAsync(
            () => {
                console.log("Stream prepared successfully");
                setTimeout(() => {
                    configureDisplaySurface(targetId);
                    play();
                }, STREAM_SETTINGS.PREPARE_DELAY);
            },
            (error) => {
                console.error("Stream preparation error:", error);
                handlePlaybackError(error, url);
            }
        );
    } catch (error) {
        console.error("Stream initialization error:", error);
        handlePlaybackError(error, url);
    }
}

/**
 * Starts playback.
 */
function play() {
    if (avplay && currentState !== PlayerState.PLAYING) {
        avplay.play();
        updatePlayerState(PlayerState.PLAYING);
    }
}

/**
 * Stops playback.
 */
function stop() {
    if (avplay) {
        avplay.stop();
        avplay.close();
        updatePlayerState(PlayerState.READY);
    }
}

/**
 * Starts diagnostic monitoring of the player.
 */
function startDiagnostics() {
    if (diagnosticInterval) clearInterval(diagnosticInterval);
    diagnosticInterval = setInterval(() => {
        if (!avplay) return;
        try {
            const state = avplay.getState();
            // Only log if not in NONE state
            if (state !== 'NONE') {
                console.log('Player State:', state);
            }
        } catch (error) {
            console.warn('Diagnostic error:', error);
        }
    }, 5000);  
}

/**
 * Updates player state.
 */
function updatePlayerState(newState) {
    currentState = newState;
    console.log(`State: ${newState}`);
}

/**
 * Handles playback errors with retry logic.
 */
function handlePlaybackError(error, url) {
    console.error("Playback error:", error);
    if (retryCount < STREAM_SETTINGS.MAX_RETRIES) {
        retryCount++;
        console.log(`Attempting retry ${retryCount}/${STREAM_SETTINGS.MAX_RETRIES}`);
        setTimeout(() => {
            if (url) {
                setMediaSource(url);
            } else {
                try {
                    play();
                } catch (e) {
                    console.error("Recovery failed:", e);
                }
            }
        }, STREAM_SETTINGS.RETRY_DELAY);
    } else {
        retryCount = 0;
        updatePlayerState(PlayerState.ERROR);
        showError("Stream connection lost");
    }
}


/**
 * (Optional) Displays an error message.
 */
function showError(message) {
    const errorElement = document.getElementById('errorMessage');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.hidden = false;
        setTimeout(() => {
            errorElement.hidden = true;
        }, 5000);
    }
}

/**
 * Cleans up diagnostics and stops the player.
 */
function cleanup() {
	  if (diagnosticInterval) {
	    clearInterval(diagnosticInterval);
	    diagnosticInterval = null; // Explicitly clear reference
	  }
	  if (avplay) stop();
	}

window.addEventListener('load', () => {
    initAVPlayer();

});
// Clean up on window unload
window.addEventListener('unload', cleanup);

// Expose play and stop functions for UI control
window.play = play;
window.stop = stop;
