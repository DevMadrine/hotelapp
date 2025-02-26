export class LiveTvAppShell extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    // Call render without awaiting; it's fine if it runs asynchronously
    this.render();
    this.addKeyNavigation();
  }

  async getChannelData() {
    try {
      const response = await fetch('http://192.168.1.158:3000/api/v1/channels');
      if (!response.ok) {
        throw new Error("Network response was not ok: " + response.statusText);
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching channel data:", error);
      return [];
    }
  }

  async render() {
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

    // Await channel data before rendering the list
    const channels = await this.getChannelData();
    channels.forEach((item, index) => {
      const listItem = document.createElement('li');
      listItem.className = 'sidebar-item';
      listItem.tabIndex = 0;
      listItem.dataset.channelIndex = index.toString();

      const anchor = document.createElement('a');
      const channelNumber = document.createElement('h1');
      channelNumber.className = 'channel-number';
      channelNumber.textContent = item.count ? item.count.toString() : '';

      const imageWrapper = document.createElement('span');
      const image = document.createElement('img');
      image.src = item.logo;
      image.alt = `Channel ${item.count}`;

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
    this.shadowRoot.addEventListener('keydown', async (event) => {
      const activeElement = this.shadowRoot.activeElement;
      if (activeElement && activeElement.classList.contains('sidebar-item')) {
        if (event.key === 'Enter') {
          event.preventDefault();
          // Await fresh channel data so that you have the updated list
          const channels = await this.getChannelData();
          const channelIndex = activeElement.dataset.channelIndex;
          const channel = channels[channelIndex];
          console.log('Selected channel:', channel);
          // Trigger your AVPlayer to load channel.url (or your designated property)
          this.toggleVisibility(false);
        }
      }
      // Use Escape or Back key to show the sidebar again.
      if (event.key === 'Escape' || event.key === 'Back') {
        event.preventDefault();
        this.toggleVisibility(true);
      }
    });
  }

  /**
   * Hides or shows the channel selection sidebar.
   * @param {boolean} visible - True to show; false to hide.
   */
  toggleVisibility(visible) {
    const sidebar = this.shadowRoot.querySelector('.sidebar');
    if (sidebar) {
      sidebar.style.display = visible ? '' : 'none';
      if (visible) {
        this.focus();
      }
    }
  }
}
