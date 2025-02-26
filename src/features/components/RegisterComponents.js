import {BackgroundContainer} from "./BackgroundContainer.js";
import {LiveTvAppShell} from "../LiveTv/components/LiveTvAppshell.js";
import {ContentCard} from "./ContentCard.js";
import {CardRow} from "./CardRow.js";
import {LiveTvFooter} from "../LiveTv/components/LiveTvFooter.js";

export function registerComponents() {
    const components = [
        { name: 'live-tv', component: LiveTvAppShell },
        { name: 'live-footer', component: LiveTvFooter },
        { name: 'background-container', component: BackgroundContainer },
        {name: 'content-card', component: ContentCard},
        {name: 'card-row', component: CardRow}
    ];

    components.forEach(({ name, component }) => {
        // Check if component is already registered before defining
        if (!customElements.get(name)) {
            try {
                customElements.define(name, component);
                console.log(`Successfully registered ${name}`);
            } catch (error) {
                console.warn(`Failed to register ${name}:`, error);
            }
        }
    });
}








