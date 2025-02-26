export function Facilities(){

    if(!document.getElementById("facilities-css")){
        const linkEl = document.createElement('style');
        linkEl.id = "facilities-css";
        linkEl.rel = "stylesheet";
        linkEl.href = "src/features/Facilities/assets/css/Facilities.css";
        document.head.appendChild(linkEl);
    }

    const facilitiesData = [
        { name: "GYM", video: "src/features/Home/assets/videos/promo.mp4", image: "src/features/Facilities/assets/images/golf.jpg", info: "You can talk about gyms in many ways, including describing what they are, why people go to them, and how they can help people socialize." },
        { name: "SPA", video: "src/features/Home/assets/videos/promo.mp4", image: "src/features/Facilities/assets/images/spa.jpg", info: "A spa is a place that offers treatments and activities to help people relax and rejuvenate their bodies, minds, and spirits." },
        { name: "POOL", video: "src/features/Home/assets/videos/promo.mp4", image: "src/features/Facilities/assets/images/pool.jpeg", info: "Swimming pools are large containers filled with water for swimming, diving, and other activities." },
        { name: "GOLF", video: "src/features/Home/assets/videos/promo.mp4", image: "src/features/Facilities/assets/images/golf.jpg", info: "Golf is a sport where players use clubs to hit a ball into a series of holes on a course." },
    ];

    const facilitiesContainer = document.createElement('div');
    facilitiesContainer.className = "facilities-container";

    const imagePath = "src/features/Facilities/assets/images/hot.jpg";

    const backgroundContainer = document.createElement('background-container');
    backgroundContainer.setAttribute("type", "image");
    backgroundContainer.setAttribute("data-performance", "tv-optimized");
    backgroundContainer.setAttribute("source", imagePath);

    requestAnimationFrame(() => {});

   const facilitiesDetails = document.createElement('div');
   facilitiesDetails.className = 'facilities-details';

   const facilityVideo = document.createElement('div');
   facilityVideo.className = 'facility-video';

   const video = document.createElement('video');
   video.id = 'video';
   video.setAttribute('muted', "");

   facilityVideo.appendChild(video);

   const facilityDescription = document.createElement('div');
   facilityDescription.className = 'facility-description';

   const facilityTitle = document.createElement('h2');
   facilityTitle.className  = 'facility-title';
   facilityTitle.id = 'facility-title';

   const facilityInfo = document.createElement('p');
   facilityInfo.className = 'facility-info';
   facilityInfo.id = 'facility-info';

   const controlDivs = document.createElement('div');
   controlDivs.className = 'controls';

   const playPauseButton = document.createElement('button');
   playPauseButton.className = 'control-button play-pause focusable';
   playPauseButton.setAttribute('tabindex', '0');
   playPauseButton.textContent = 'Play';

   const moreInfoBtn = document.createElement('button');
   moreInfoBtn.className = 'control-button more-info focusable';
   moreInfoBtn.setAttribute('tabindex', 0);
   moreInfoBtn.textContent ='More Info';

   controlDivs.append(playPauseButton, moreInfoBtn);
   facilityDescription.append(facilityTitle, facilityInfo, controlDivs);
   facilitiesDetails.append(facilityVideo, facilityDescription);

    const cardRow = document.createElement('card-row');
    cardRow.className = 'facilities-row';

    facilitiesData.forEach(item => {
        const contentCard = document.createElement('content-card');
        contentCard.className = "focusable facilities-card";
        contentCard.setAttribute("variant", "facilities");
        contentCard.id = "facilities-card";
        contentCard.setAttribute("type", "default");
        contentCard.setAttribute("icon", item.icon);
        contentCard.setAttribute("title", item.name);
        contentCard.setAttribute("tabindex", "0");

        cardRow.appendChild(contentCard);

    });

    backgroundContainer.append(facilitiesDetails, cardRow);
    facilitiesContainer.appendChild(backgroundContainer);

    return facilitiesContainer;


}