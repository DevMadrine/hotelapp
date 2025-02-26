export class Router {
    constructor(routes) {
        if (!routes || typeof routes !== 'object') {
            throw new Error('Routes must be provided to Router');
        }
        this.routes = routes;
        this.appShell = null;
        this.currentHash = '';

        // Bind methods to preserve this context
        this.handleRoute = this.handleRoute.bind(this);

        // Handle route changes
        window.addEventListener('hashchange', this.handleRoute);
        // Initial route handling
        this.handleRoute().catch(error =>
            console.error('Error handling initial route:', error)
        );
    }

    async handleRoute() {
        try {
            const hash = window.location.hash || '#livetv';
            if (this.currentHash === hash) {
                return; // Prevent unnecessary reloads
            }
            this.currentHash = hash;

            const route = this.routes[hash];
            const root = document.querySelector('#root');

            if (!root) {
                throw new Error('Root element not found');
            }

            if (!route || !route.component) {
                console.error(`No route found for hash: ${hash}`);
                // Optionally redirect to home or 404
                if (hash !== '#livetv') {
                    window.location.hash = '#livetv';
                }
                return;
            }

            // Load the component module
            const module = await route.component();
            if (!module || (!module.default && Object.keys(module).length === 0)) {
                throw new Error(`Invalid module loaded for route: ${hash}`);
            }

            // Get the component constructor
            const Component = module.default || module[Object.keys(module)[0]];

            // Clear existing content
            root.innerHTML = '';

            // Create and append the new component
            const componentInstance = Component();
            if (!(componentInstance instanceof HTMLElement)) {
                throw new Error(`Component for route ${hash} must return an HTMLElement`);
            }

            root.appendChild(componentInstance);

            // Load spatial navigation
            try {
                const { loadSpatialNavigationScript } = await import('../../services/Navigation');
                await loadSpatialNavigationScript('.focusable');
            } catch (error) {
                console.error('Error loading spatial navigation:', error);
            }

        } catch (error) {
            console.error('Router error:', error);
            // Optionally handle error state here
            this.handleRouteError(error);
        }
    }

    handleRouteError(error) {
        const root = document.querySelector('#root');
        if (root) {
            root.innerHTML = `
                <div class="error-container">
                    <h2>Error Loading Page</h2>
                    <p>Please try refreshing the page</p>
                </div>
            `;
        }
    }

    destroy() {
        window.removeEventListener('hashchange', this.handleRoute);
    }
}

