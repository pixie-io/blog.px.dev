import { processClientEntry, runZoom } from './src/components/image-zoom-modal.plugin';
import * as ReactDOM from 'react-dom';



export const  replaceHydrateFunction = () => {
    return (element, container, callback) => {
        ReactDOM.render(element, container, callback);
    };
};


export const onClientEntry = () => {
    processClientEntry();
};
export const onRouteUpdate = () => {
    runZoom();
};
