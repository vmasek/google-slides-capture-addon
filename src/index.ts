import { onInstall, onOpen, saveThumbnailImages } from './slides';
// tslint:disable no-object-mutation
global.onInstall = onInstall;
global.onOpen = onOpen;
global.saveThumbnailImages = saveThumbnailImages;
