import { createAsset } from 'pixi-svelte';

import rawAtlas from './background.atlas?raw';
import spine from './background.json';
import img from './background.png';

export default createAsset({ img, rawAtlas, spine, preload: true });
