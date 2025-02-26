export class ContentCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this._handleFocus = this._handleFocus.bind(this);
        this._handleBlur = this._handleBlur.bind(this);
    }

    static get observedAttributes() {
        return ['icon', 'title', 'type', 'image', 'variant'];
    }

    connectedCallback() {
        this.render();
        this._addEventListeners();
        this._setupResizeObserver();

    }

    _setupResizeObserver(){
        this.observer = new ResizeObserver(entries => {
            entries.forEach(entry =>{
                if(entry.contentBoxSize){
                    this.style.setProperty('--card-height', `${entry.contentRect.height}px`);
                }
            });
        });

        const card = this.shadowRoot.querySelector('.card');
        if(card) this.observer.observe(card);
    }

    disconnectedCallback() {
        this.observer?.disconnect();
        this._removeEventListeners();
    }


    _addEventListeners() {
        const card = this.shadowRoot.querySelector('.card');
        if (card) {
            card.addEventListener('focus', this._handleFocus);
            card.addEventListener('blur', this._handleBlur);
        }
    }

    _removeEventListeners() {
        const card = this.shadowRoot.querySelector('.card');
        if (card) {
            card.removeEventListener('focus', this._handleFocus);
            card.removeEventListener('blur', this._handleBlur);
        }
    }

    _handleFocus() {
        this.classList.add('focused');
    }

    _handleBlur() {
        this.classList.remove('focused');
    }


    attributeChangedCallback(name, oldValue, newValue) {
        if (this.shadowRoot && oldValue !== newValue) {
            this.render();
        }
    }

    render() {
        const type = this.getAttribute('type') || 'default';
        const icon = this.getAttribute('icon') || '';
        const title = this.getAttribute('title') || '';
        const image = this.getAttribute('image') || '';
        const variant = this.getAttribute('variant') || 'default';

        // Define variant-specific styles
        const variantStyles = {
            home: `
        width: 70%;
        height: 35vh;
        background: rgba(255, 255, 255, 0.5);
        backdrop-filter: blur(10px);
      `,
            facilities: `
        width: 20%;
        height: 25vh;
        background-image: url(${image});
        background-size: cover;
        background-position: center;
      `,
            restaurant: `
        width: 50%;
        height: 25vh;
        background-image: url(${image});
        background-size: cover;
        background-position: center;
        border-radius: 0.5rem;
         box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
      `
        };

        this.shadowRoot.innerHTML = `
      <style>
        // :host {
        //   display: block;
        // }
        // :host(:focus) .card,
        // :host(:focus-within) .card,
        // :host(.focused) .card {
        //   transform: scale(1.05);        
        //   ${variant === 'restaurant' ? `
        //     background-color: rgba(245, 133, 32, 1); 
        //   box-shadow: 0 0 20px rgba(245, 133, 32, 0.8);
        //   border: 0.5rem solid #F58520 !important;
        //    border-radius: 1.2rem;
        //   ` : ''}
        // }
        .card {
        transform-style: preserve-3d;
        contain: layout paint style;
        isolation: isolate;
        transition: 
        transform 0.3s ease, 
         box-shadow 0.3s ease,
          border-color 0.3s ease;
          position: relative;
          border-radius: 0.5rem;
          padding: 3.0rem;
          margin-top: 38vh;
          cursor: pointer;
          ${variantStyles[variant]}
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          align-items: center;
        }
        
        :host(.focused) {
  z-index: 9999 !important;
  position: relative;
 

}
        /*.card-items {*/
        /*  display: flex;*/
        /*  flex-direction: column;*/
        /*  justify-content: space-between;*/
        /*  height: 15vh;*/
        /*  z-index: 1;*/
        /*}*/
        .icon {
          width: 40%;
          height: 15vh;
          margin: 0 auto 10px;
          filter: invert(100%) brightness(200%);
        }
        .title {
          color: white;
          font-size: 1.5em;
          margin: 0;
        }
        /* New container for restaurant title */
        .title-container {
          background-color: rgba(245, 133, 32, 1);
          padding: 0.8rem;
          margin-top: 3.5rem;
          width: 100%;
          box-sizing: border-box;
          text-align: center;
          border-radius: 0.3rem;
          opacity: 0;
          visibility: hidden;
          transform: translateY(20px);
          transition: 
          opacity 0.3s ease,
           visibility 0.3s cubic-bezier(0.4, 0, 0.2, 1),
            transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
             will-change: opacity, transform;
             backface-visibility: hidden;
          
        }
        
        :host(.focused) .title-container,
:host(:focus) .title-container,
:host(:focus-within) .title-container {
  opacity: 1 !important;
  visibility: visible !important;

  transition-delay: 100ms;
}
        
       :host([variant="restaurant"]) .title-container {
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.3s ease;
          z-index: 3;
        }
        
        :host(.focused) .title-container {
          opacity: 1;
          visibility: visible !important;
         transform: translateY(0) translateZ(0);
         
        }

        
        :host([variant="restaurant"]) .card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.3);
          z-index: 1;
        }
        
        :host(.focused) .card {
   transform: scale(1.15) translateZ(0);
   transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
  border: 5px solid #FFF !important;
  z-index: 2; 
}
        

        ::slotted(*) {
          color: white;
        }
      </style>

      <div class="card" tabindex="0">
        <div class="card-items">
          ${icon ? `<img class="icon" src="${icon}" alt="" loading="lazy">` : ''}
          ${
            title
                ? variant === 'restaurant'
                    ? `<div class="title-container"><h3 class="title">${title}</h3></div>`
                    : `<h3 class="title">${title}</h3>`
                : ''
        }
        </div>
        <slot></slot>
      </div>
    `;
    }
}

customElements.define('content-card', ContentCard);
