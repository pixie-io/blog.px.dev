import { processClientEntry, runZoom } from './src/components/image-zoom-modal.plugin';

const React = require('react');


export const onClientEntry = () => {
    processClientEntry();
};
export const onRouteUpdate = () => {
    runZoom();
};
