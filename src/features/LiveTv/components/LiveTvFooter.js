export class LiveTvFooter extends HTMLElement{
    constructor() {
        super();
        this.attachShadow({mode: 'open'});
    }

    connectedCallback(){
        this.render();
    }

    render(){
        while (this.shadowRoot.firstChild){
            this.shadowRoot.removeChild(this.shadowRoot.firstChild);
        }

        const link = document.createElement('link');
        link.rel ='stylesheet';
        link.href = 'src/features/LiveTv/assets/css/Footer.css';
        this.shadowRoot.appendChild(link);

        const footer = document.createElement('div');
        footer.className = 'footer';

        const showTime = document.createElement('h2');
        showTime.className = 'show-time';
        showTime.textContent = 'Showing Now:'

        const line = document.createElement('hr');
        line.className ='line';

        const channelName = document.createElement('h1');
        channelName.className = 'channel-name';
        channelName.textContent = 'UBC TV';

        const line1 = document.createElement('hr');

        const settings = document.createElement('div');
        settings.className = 'settings';

        const settingsIcon = document.createElement('img');
        settingsIcon.className = 'settings-icon';
        settingsIcon.setAttribute('src', 'src/features/LiveTv/assets/images/settings.png');
        settingsIcon.setAttribute('alt', 'Settings');

        const sett = document.createElement('img');
        sett.className = 'sett';
        sett.setAttribute('src', 'src/features/LiveTv/assets/images/sett.png');
        sett.setAttribute('alt', 'Sett');


        settings.append(settingsIcon, sett);
        footer.append(showTime, line, channelName, line1, settings);


        const contentArea = document.createElement('main');
        contentArea.className = 'content-area';
        const slot = document.createElement('slot');
        contentArea.appendChild(slot);


        this.shadowRoot.append(footer, contentArea);

    }
}