export class LiveTvAppShell extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this.addKeyNavigation();
  }

  getChannelData() {
    return [
      { channelNumber: '001', channelLogo: "./src/features/LiveTv/assets/images/bukedde.jpg", channelLink: "https://channels.hydeinnovations.com/buk1/index.mpd" },
      { channelNumber: '002', channelLogo: "./src/features/LiveTv/assets/images/channel44.jpg", channelLink: "https://channels.hydeinnovations.com/channel44/index.m3u8" },
      { channelNumber: '003', channelLogo: "./src/features/LiveTv/assets/images/nbs.jpg", channelLink: "https://channels.hydeinnovations.com/nbs-flu/video.m3u8" },
      { channelNumber: '004', channelLogo: "./src/features/LiveTv/assets/images/ktv.jpg", channelLink: "https://channels.hydeinnovations.com/sanyuka/index.m3u8" },
      { channelNumber: '005', channelLogo: "./src/features/LiveTv/assets/images/ubc.png", channelLink: "https://feed.hydeinnovations.com/ubc/index.mpd" },
    ];
  }

  render() {
    // Clear previous content
    while (this.shadowRoot.firstChild) {
      this.shadowRoot.removeChild(this.shadowRoot.firstChild);
    }

    // Load external CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'src/features/LiveTv/assets/css/LiveTvAppShell.css';
    this.shadowRoot.appendChild(link);

    // Create sidebar for channel selection
    const sidebar = document.createElement('nav');
    sidebar.className = 'sidebar';

    const navList = document.createElement('ul');
    navList.className = 'nav-list';

    this.getChannelData().forEach((item, index) => {
      const listItem = document.createElement('li');
      listItem.className = 'sidebar-item';
      listItem.tabIndex = 0;
      listItem.dataset.channelIndex = index.toString();

      const anchor = document.createElement('a');
      const channelNumber = document.createElement('h1');
      channelNumber.className = 'channel-number';
      channelNumber.textContent = item.channelNumber;

      const imageWrapper = document.createElement('span');
      const image = document.createElement('img');
      image.src = item.channelLogo;
      image.alt = `Channel ${item.channelNumber}`;

      imageWrapper.appendChild(image);
      anchor.appendChild(channelNumber);
      anchor.appendChild(imageWrapper);
      listItem.appendChild(anchor);
      navList.appendChild(listItem);
    });

    sidebar.appendChild(navList);

    // Create main content area with a slot for projected content
    const contentArea = document.createElement('main');
    contentArea.className = 'content-area';
    const slot = document.createElement('slot');
    contentArea.appendChild(slot);

    // Append sidebar and content area to shadow DOM
    this.shadowRoot.append(sidebar, contentArea);
  }

  addKeyNavigation() {
    // Listen for keydown events in the shadow DOM.
    this.shadowRoot.addEventListener('keydown', (event) => {
      const activeElement = this.shadowRoot.activeElement;
      if (activeElement && activeElement.classList.contains('sidebar-item')) {
        if (event.key === 'Enter') {
          event.preventDefault();
          const channelIndex = activeElement.dataset.channelIndex;
          const channel = this.getChannelData()[channelIndex];
          console.log('Selected channel:', channel);
          // Here you would trigger your AVPlayer to load channel.channelLink.
          // For now, we hide the channel selection sidebar.
          this.toggleVisibility(false);
        }
      }

      // Use Escape key to show the sidebar again.
      if (event.key === 'Escape' || event.key === 'Back') {
        event.preventDefault();
        this.toggleVisibility(true);
      }
    });
  }

  
  handleGlobalKeydown(event) {
	    if (event.key === 'Escape' || event.key === 'Back') {
	      // Check if the sidebar is currently hidden.
	      const sidebar = this.shadowRoot.querySelector('.sidebar');
	      if (sidebar && getComputedStyle(sidebar).display === 'none') {
	        event.preventDefault();
	        this.toggleVisibility(true);
	      }
	    }
	  }
  
  
  
  
  /**
   * Hides or shows the channel selection sidebar.
   * You can modify this method to hide the entire appshell if desired.
   * @param {boolean} visible - True to show; false to hide.
   */
  toggleVisibility(visible) {
    const sidebar = this.shadowRoot.querySelector('.sidebar');
    if (sidebar) {
      sidebar.style.display = visible ? '' : 'none';
      if(visible){
    	  this.focus();
      }
    }
  }
}


