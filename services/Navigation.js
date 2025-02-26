export const loadSpatialNavigationScript = (focusClass) => {
    const existingScript = document.querySelector("script[data-id='spatial-navigation']");
    const script = document.createElement('script');
    script.type = 'module';
    script.src = './services/SpatialNavigation.js';
    script.dataset.id = 'spatial-navigation';
    script.onload = () => initializeSpatialNavigation(focusClass); // Initialize after loading
    document.head.appendChild(script);
};

export const initializeSpatialNavigation = (focusClass) => {
    SpatialNavigation.init();
    SpatialNavigation.add({
        selector: focusClass,
        enterTo: 'active-element',
        leaveFor: { left: '', right: '', up: '', down: '' },
        navigableFilter: (element) => {
            // Handle shadow DOM elements
            const card = element.shadowRoot?.querySelector('.card');
            return card && window.getComputedStyle(element).display !== 'none';
        }
    });
    SpatialNavigation.makeFocusable();
    SpatialNavigation.focus();
};

export const initializeRemoveSpatialNavigation = (focusClass) => {
    SpatialNavigation.uninit();
    // SpatialNavigation.add({ selector: focusClass });
    SpatialNavigation.remove(focusClass);
};

export const removeSpatialNavigation = (focusClass) => {
    const existingScript = document.querySelector("script[data-id='spatial-navigation']");
    const script = document.createElement('script');
    script.type = 'module';
    script.src = './dependencies/spatial_navigation.js';
    script.dataset.id = 'spatial-navigation';
    script.onload = () => initializeRemoveSpatialNavigation(focusClass);
    document.head.appendChild(script);
}
