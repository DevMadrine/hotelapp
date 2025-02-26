import {setMediaSource} from "../../../services/AVPlayer.js";


export class BackgroundContainer extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['type', 'source', 'media-type'];
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (this.shadowRoot && oldValue !== newValue) {
      if(name === 'source' || name === 'media-type') {
        this.updateSource(this.getAttribute('source'), this.getAttribute('media-type'));
      } else {
        this.render();
      }
    }
  }

  updateSource(newSource, mediaType = 'live') {
    const type = this.getAttribute('type') || 'image';
    if (type === 'video') {
      const videoObject = this.shadowRoot.getElementById("videoSurface");
      if (videoObject) {
    	  videoObject.setAttribute('security', "restricted");
          videoObject.setAttribute('allow', "media");
          videoObject.setAttribute('data-source', newSource);
          setMediaSource(newSource, "videoSurface", mediaType);
      }
    } else {
      const imgElem = this.shadowRoot.querySelector('img');
      if (imgElem) {
        imgElem.src = newSource;
      }
    }
    // Reflect the change in the attribute as well.
    this.setAttribute('source', newSource);
  }
  
  
  getVideoSurface() {
	    return this.shadowRoot.getElementById("videoSurface");
	  }

  render() {
    // Clear previous content
    while (this.shadowRoot.firstChild) {
      this.shadowRoot.removeChild(this.shadowRoot.firstChild);
    }

    // Create a <link> element to load external CSS
    const linkElem = document.createElement('link');
    linkElem.setAttribute('rel', 'stylesheet');
    linkElem.setAttribute('href', 'src/features/components/css/BackgroundContainer.css');
    this.shadowRoot.appendChild(linkElem);

    // Create a container div to hold the component markup
    const container = document.createElement('div');

    // Create the background element
    const backgroundDiv = document.createElement('div');
    backgroundDiv.classList.add('background');

    const type = this.getAttribute('type') || 'image';
    const source = this.getAttribute('source') || '';

    if (type === 'video') {
      // For video backgrounds, use an <object> element to support AVPlay rendering
      const videoObject = document.createElement('object');
      videoObject.id = "videoSurface"; // This ID will be targeted by your player code
      videoObject.setAttribute('type', 'application/avplayer');
      videoObject.setAttribute('security', 'restricted');
      videoObject.setAttribute('allow', 'media');
      videoObject.style.width = "100%";
      videoObject.style.height = "100%";
      backgroundDiv.appendChild(videoObject);
    } else {
      // For image backgrounds, create an image element
      const imgElem = document.createElement('img');
      imgElem.src = source;
      imgElem.alt = 'background';
      backgroundDiv.appendChild(imgElem);
    }
    container.appendChild(backgroundDiv);

    // Create the overlay element
    const overlayDiv = document.createElement('div');
    overlayDiv.classList.add('overlay');
    container.appendChild(overlayDiv);

    // Create a slot element for any child content
    const slotElem = document.createElement('slot');
    container.appendChild(slotElem);

    // Append the complete container to the shadow DOM
    this.shadowRoot.appendChild(container);
  }
  
  disconnectedCallback() {
    // Clean up any event listeners or intervals if needed
  }
}


