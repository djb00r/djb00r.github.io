import { PART_A } from './subatomic.js';
import { PART_B } from './planetary.js';
import { PART_C } from './cosmic.js';

export const SCALES_PRIMARY = [
    ...PART_A,
    ...PART_B,
    ...PART_C
];

export const SCALES_GLITCH = SCALES_PRIMARY.map(s => ({
    ...s,
    name: `[ERR]_${s.name.toUpperCase()}`,
    desc: `CORRUPTED: ${s.desc}`,
    color: 0xff0000
}));

export const SCALES_ETHEREAL = SCALES_PRIMARY.map(s => ({
    ...s,
    name: `Spirit of ${s.name}`,
    desc: `A ghostly Echo of ${s.name} in the eternal light.`,
    color: 0x88ffff
}));

export const MIN_LOG = -2000;
export const MAX_LOG = 2000;