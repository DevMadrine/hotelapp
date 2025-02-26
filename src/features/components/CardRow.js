export class CardRow extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    render() {
        // Clear any existing content.
        while (this.shadowRoot.firstChild) {
            this.shadowRoot.removeChild(this.shadowRoot.firstChild);
        }

        // Create a link element for the external CSS.
        const linkEl = document.createElement('link');
        linkEl.setAttribute('rel', 'stylesheet');
        linkEl.setAttribute('href', 'src/features/components/css/CardRow.css');
        this.shadowRoot.appendChild(linkEl);

        // Create the container div.
        const containerDiv = document.createElement('div');
        containerDiv.classList.add('card-container');

        // Create a slot element to project content.
        const slotEl = document.createElement('slot');
        containerDiv.appendChild(slotEl);

        // Append the container to the shadow DOM.
        this.shadowRoot.appendChild(containerDiv);
    }
}


