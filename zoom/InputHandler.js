import * as THREE from 'three';
import { MIN_LOG, MAX_LOG } from './Constants.js';

export class InputHandler {
    constructor(app) {
        this.app = app;
        this.isZooming = false;
        this.isRotating = false;
        this.lastX = 0;
        this.lastY = 0;
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();

        // WASD movement state: x = strafe, z = forward/back
        this.moveVector = new THREE.Vector3(0,0,0);
        this._keys = {};
        this.init();
    }

    init() {
        const onStart = (e) => {
            // Prepare audio and attempt to resume playback on this user gesture to satisfy autoplay policy
            this.app.audio.init();
            if (this.app.audio && typeof this.app.audio.resume === 'function') {
                this.app.audio.resume();
            }
            this.app.ui.hideOverlay();

            const isTouch = e.type === 'touchstart';
            const x = isTouch ? e.touches[0].clientX : e.clientX;
            const y = isTouch ? e.touches[0].clientY : e.clientY;

            if (isTouch) {
                this.isZooming = true;
            } else if (e.button === 0) {
                this.isZooming = true;
            } else if (e.button === 2) {
                this.isRotating = true;
                e.preventDefault();
            }

            this.lastX = x;
            this.lastY = y;
        };

        const onMove = (e) => {
            const isTouch = e.type === 'touchmove';
            const x = isTouch ? e.touches[0].clientX : e.clientX;
            const y = isTouch ? e.touches[0].clientY : e.clientY;
            const deltaX = x - this.lastX;
            const deltaY = y - this.lastY;

            if (this.isZooming) {
                this.updateTargetScale(deltaY * -0.01);
            } else if (this.isRotating) {
                this.app.targetRotation.y += deltaX * 0.01;
                this.app.targetRotation.x += deltaY * 0.01;
                // Clamp vertical rotation
                this.app.targetRotation.x = Math.max(-Math.PI * 0.4, Math.min(Math.PI * 0.4, this.app.targetRotation.x));
            }

            this.lastX = x;
            this.lastY = y;
        };

        const onEnd = (e) => { 
            const isTouch = e.type === 'touchend';
            // Only handle "click" if it wasn't a significant drag
            if (this.isZooming || this.isRotating) {
                const x = isTouch ? e.changedTouches[0].clientX : e.clientX;
                const y = isTouch ? e.changedTouches[0].clientY : e.clientY;
                // If the user barely moved, consider it a click
                if (Math.abs(x - this.lastX) < 5 && Math.abs(y - this.lastY) < 5) {
                    this.handleRaycast(x, y);
                }
            }

            this.isZooming = false; 
            this.isRotating = false; 
        };

        window.addEventListener('contextmenu', (e) => e.preventDefault());
        window.addEventListener('mousedown', onStart);
        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onEnd);
        window.addEventListener('touchstart', onStart, { passive: false });
        window.addEventListener('touchmove', onMove, { passive: false });
        window.addEventListener('touchend', onEnd);
        window.addEventListener('wheel', (e) => {
             this.app.audio.init();
             this.app.ui.hideOverlay();
             this.updateTargetScale(e.deltaY * 0.002);
        }, { passive: true });

        // Keyboard WASD controls
        const onKeyDown = (e) => {
            this._keys[e.code] = true;
            this.updateMoveVector();
        };
        const onKeyUp = (e) => {
            this._keys[e.code] = false;
            this.updateMoveVector();
        };
        window.addEventListener('keydown', onKeyDown);
        window.addEventListener('keyup', onKeyUp);

        // When the app is destroyed this should be removed; kept simple here.
    }

    updateMoveVector() {
        // forward/back (W/S) mapped to z, strafe (A/D) mapped to x
        const forward = (this._keys['KeyW'] ? 1 : 0) - (this._keys['KeyS'] ? 1 : 0);
        const strafe = (this._keys['KeyD'] ? 1 : 0) - (this._keys['KeyA'] ? 1 : 0);

        // If either Shift key is held, increase movement magnitude for a "run" effect.
        const speedMultiplier = (this._keys['ShiftLeft'] || this._keys['ShiftRight']) ? 2.5 : 1.0;

        // Smooth interpolation could be added; keep immediate for responsiveness
        this.moveVector.set(strafe * speedMultiplier, 0, forward * speedMultiplier);
    }

    handleRaycast(clientX, clientY) {
        this.mouse.x = (clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(clientY / window.innerHeight) * 2 + 1;
        
        this.raycaster.setFromCamera(this.mouse, this.app.camera);
        
        // Find visible objects
        const visibleObjects = this.app.objects.filter(obj => obj.visible);
        const intersects = this.raycaster.intersectObjects(visibleObjects, true);
        
        if (intersects.length > 0) {
            // Find the first relevant object in the hierarchy (either a clickable bubble or a scale entry)
            let current = intersects[0].object;
            while (current.parent && !current.userData.logSize && !current.userData.isUniverseBubble) {
                current = current.parent;
            }

            if (current.userData && current.userData.isUniverseBubble) {
                // If we clicked a bubble, switch the universe context
                this.app.switchUniverse(current.userData.targetUniverseId);
            } else if (current.userData && current.userData.logSize && current.userData.type !== 'multiverse') {
                // Show details for all items except the Multiverse containers, allowing easier bubble interaction
                this.app.ui.showDetails(current.userData);
            }
        }
    }

    updateTargetScale(delta) {
        const oldTarget = this.app.targetLogScale;
        // Increase sensitivity slightly at extremely high scales to make navigation faster
        const dynamicDelta = delta * (1 + Math.max(0, this.app.targetLogScale / 500));
        this.app.targetLogScale = Math.max(MIN_LOG, Math.min(MAX_LOG, this.app.targetLogScale + dynamicDelta));
        
        // Trigger tick on scale cross-over
        if (Math.floor(oldTarget) !== Math.floor(this.app.targetLogScale)) {
            this.app.audio.playTick();
        }
    }
}