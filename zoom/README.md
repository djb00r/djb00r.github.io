# Cosmic Zoom

A complex, interactive journey across the scales of the universe. 
From subatomic quarks at 10^-18 meters to the observable universe at 10^27 meters.

## Controls
- **Desktop**: Mouse wheel or drag up/down. Use WASD to move the camera (W/A/S/D for forward/left/back/right).
- **Mobile**: Touch and drag up/down.

## Implementation Details
- Uses **Logarithmic Scaling** to manage the extreme range of sizes without Three.js precision breakdown.
- **Custom Shaders** for star fields, planetary atmospheres, and spiral galaxies.
- **Web Audio API** for procedural sound effects tied to zoom velocity.
- **GSAP** for smooth transitions between scales.

## Where is the CMB?
The "Cosmic Microwave Background (CMB)" entry is defined in `scales/cosmic.js` (type: `cmb`) and is rendered by LargeScaleFactory.createCMB in `LargeScaleFactory.js`, which uses the CMB shader located in `LargeScaleShaders.js`.