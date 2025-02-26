import {initAVPlayer, setMediaSource, StreamType} from "../../../services/AVPlayer.js";

export function HomePage() {
    if (!document.getElementById("home-css")) {
        const linkEl = document.createElement("link");
        linkEl.id = "home-css";
        linkEl.rel = "stylesheet";
        linkEl.href = "src/features/Home/assets/css/HomePage.css";
        document.head.appendChild(linkEl);
    }

    const homeData = [
        {name: "Facilities", icon: "src/features/Home/assets/icons/hotel-bed-fill.svg"},
        {name: "LiveTv", icon: "src/features/Home/assets/icons/tv-2-line.svg"},
        {name: "Restaurant", icon: "src/features/Home/assets/icons/restaurant-fill.svg"},
        {name: "Settings", icon: "src/features/Home/assets/icons/user-settings-line.svg"},
    ];

    const homeContainer = document.createElement("div");
    homeContainer.className = "home-container";

 
    let videoPath;
    if (window.tizen && tizen.filesystem) {
        try {
            const resourceDir = tizen.filesystem.getAppResourcePath();
            videoPath = resourceDir + "promo.mp4";
        } catch (error) {
            console.error("Tizen resource error:", error);
            videoPath = "file:///opt/usr/home/owner/apps_rw/oD0uObhkaq.SerenaHotel/res/promo.mp4";
        }
    } else {
        const basePath = window.location.href.substring(0, window.location.href.lastIndexOf('/'));
        videoPath = `${basePath}/src/features/Home/assets/videos/promo.mp4`;
    }


        const backgroundContainer = document.createElement("background-container");
        backgroundContainer.setAttribute("type", "video");
        backgroundContainer.setAttribute("data-performance", "tv-optimized");
        backgroundContainer.setAttribute("source", videoPath);
        backgroundContainer.setAttribute('media-type', 'vod');

        requestAnimationFrame(() => {
        	
        	const videoSurface = backgroundContainer.getVideoSurface();
        	if(videoSurface){
        		
        		  setMediaSource(
        	                videoPath,
        	                "videoSurface",
        	                StreamType.VOD
        	            );
        		
        	}	
          
        });

        const h1 = document.createElement("h1");
        h1.className = "welcome";
        h1.textContent = "Welcome To Serena Hotel";

        const h2 = document.createElement("h2");
        h2.className = "client-name";
        h2.textContent = "Mr. Daniel";

        backgroundContainer.appendChild(h1);
        backgroundContainer.appendChild(h2);

        const cardRow = document.createElement("card-row");
        cardRow.className = "home-row";

        homeData.forEach(item => {
            const contentCard = document.createElement("content-card");
            contentCard.className = "focusable home-card";
            contentCard.setAttribute("variant", "home");
            contentCard.id = "home-card";
            contentCard.setAttribute("type", "default");
            contentCard.setAttribute("icon", item.icon);
            contentCard.setAttribute("title", item.name);
            contentCard.setAttribute("data-route", "#facilities");
            contentCard.setAttribute("tabindex", "0");
            cardRow.appendChild(contentCard);
        });

        backgroundContainer.appendChild(cardRow);
        homeContainer.appendChild(backgroundContainer);

        requestAnimationFrame(() => {
            initAVPlayer();
            const videoSurface = backgroundContainer.getVideoSurface();
            if (videoSurface) {
                setMediaSource(videoPath, videoSurface, StreamType.VOD);
            } else {
                console.log('Video surface not found in BackgroundContainer');
            }
        });


        return homeContainer;

}
