import {registerComponents} from "./src/features/components/RegisterComponents.js";
import {LiveTvPage} from "./src/features/LiveTv/LiveTv.js";
import {Facilities} from "./src/features/Facilities/Facilities.js";
import {HomePage} from "./src/features/Home/HomePage.js";
import {Restaurant} from "./src/features/Restaurant/Restaurant.js";



//Add at the very beginning of your main JavaScript file
if (window.webapis && window.webapis.avinfo) {
    Object.defineProperty(window.webapis.avinfo, 'isHdrTvSupport', {
        get: () => false,
        configurable: false
    });
}               

document.addEventListener('DOMContentLoaded', () => {
    try{
        console.log('App initializing.....');
        const root = document.getElementById('root');
        if(!root){
            console.error('Root element not found');
            return;
        }
        registerComponents();


        const tv = Restaurant();
        root.appendChild(tv);

    }catch (error){
        console.error('Error initializing app:',  error);
    }
});