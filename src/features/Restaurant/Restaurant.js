import { loadSpatialNavigationScript, removeSpatialNavigation } from "../../../services/Navigation.js";

export function Restaurant() {
    // Append external CSS
    if (!document.getElementById("facilities-css")) {
        const linkEl = document.createElement('link');
        linkEl.id = "facilities-css";
        linkEl.rel = "stylesheet";
        linkEl.href = "src/features/Restaurant/assets/css/Restaurant.css";
        document.head.appendChild(linkEl);
    }

    const restaurantData = [
        { name: "BREAKFAST", image: "src/features/Restaurant/assets/images/break.jpg" },
        { name: "LUNCH", image: "src/features/Restaurant/assets/images/lunc.webp" },
        { name: "DRINKS", image: "src/features/Restaurant/assets/images/drink.jpg" },
        { name: "BAR", image: "src/features/Restaurant/assets/images/bar.jpg" },
    ];

    const restaurantContainer = document.createElement('div');
    restaurantContainer.className = "facilities-container";

    const background = document.createElement('background-container');
    background.setAttribute("type", "image");
    background.setAttribute("data-performance", "tv-optimized");
    background.setAttribute("source", "src/features/Restaurant/assets/images/rest.jpg");

    const restaurantRow = document.createElement('card-row');
    restaurantRow.className = 'restaurant-row';

    restaurantData.forEach(item => {
        const restaurantCard = document.createElement('content-card');
        restaurantCard.className = 'restaurant-card';
        restaurantCard.setAttribute('variant', 'restaurant');
        restaurantCard.setAttribute('image', item.image);
        restaurantCard.setAttribute('title', item.name);
        restaurantCard.setAttribute('data-restaurant-card', '');
        restaurantRow.appendChild(restaurantCard);
    });

    background.appendChild(restaurantRow);
    restaurantContainer.appendChild(background);

    requestAnimationFrame(() => {
        loadSpatialNavigationScript('.restaurant-card', () => {
            // Initialize spatial navigation
            SpatialNavigation.init({
                selector: '.restaurant-card',
                enterTo: 'active-element',
                navigableFilter: (element) => {
                    const card = element.shadowRoot?.querySelector('.card');
                    return card && window.getComputedStyle(element).display !== 'none';
                }
            });

            SpatialNavigation.on('focus', (element) => {
                document.querySelectorAll('.restaurant-card').forEach(card => {
                    card.classList.remove('focused');
                    const shadowCard = card.shadowRoot?.querySelector('.card');
                    shadowCard?.classList.remove('focused-card');
                });

                element.classList.add('focused');
                const cardElement = element.shadowRoot?.querySelector('.card');
                if(cardElement){
                    void cardElement.offsetHeight;
                    cardElement.classList.add('focused-card');
                    cardElement.focus({preventScroll: true});

                    cardElement.scrollIntoView({
                        behavior: 'auto',
                        block: 'center',
                        inline: 'center'
                    });

                }

                requestAnimationFrame(() => {
                    element.classList.add('focused');
                    const cardElement = element.shadowRoot?.querySelector('.card');
                    if (cardElement) {
                        cardElement.focus({ preventScroll: true });
                        cardElement.scrollIntoView({
                            behavior: 'auto',
                            block: 'center',
                            inline: 'center'
                        });
                    }
                });
            });

            SpatialNavigation.makeFocusable();
            const firstCard = document.querySelector('.restaurant-card');
            if (firstCard) {
                firstCard.focus();
                firstCard.classList.add('focused', 'selected');
            }

        });

    });

    return restaurantContainer;
}