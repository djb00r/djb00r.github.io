import { SCALES_PRIMARY, SCALES_GLITCH, SCALES_ETHEREAL, MIN_LOG as M_MIN, MAX_LOG as M_MAX } from './scales/ScalesList.js';

export const UNIVERSES = [
    { id: 0, name: "Primary", scales: SCALES_PRIMARY },
    { id: 1, name: "Glitch", scales: SCALES_GLITCH },
    { id: 2, name: "Ethereal", scales: SCALES_ETHEREAL }
];

export let SCALES = SCALES_PRIMARY;
export const MIN_LOG = M_MIN;
export const MAX_LOG = M_MAX;

export function setScales(universeId) {
    const universe = UNIVERSES.find(u => u.id === universeId) || UNIVERSES[0];
    SCALES = universe.scales;
    return SCALES;
}