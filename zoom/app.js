import * as THREE from 'three';
import { SCALES, MIN_LOG, MAX_LOG, setScales } from './Constants.js';
import { StarFieldShader } from './BackgroundShaders.js';
import { AudioManager } from './AudioManager.js';
import { ObjectFactory } from './ObjectFactory.js';
import { InputHandler } from './InputHandler.js';
import { UIManager } from './UIManager.js';

class UniverseApp {
    constructor() {
        this.container = document.getElementById('container');
        this.currentLogScale = 0;
        this.targetLogScale = 0;
        this.currentUniverseId = 0;
        this.currentScales = SCALES;
        this.worldRotation = new THREE.Euler(0, 0, 0);
        this.targetRotation = new THREE.Euler(0, 0, 0);
        this.objects = [];
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 1000);
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        
        this.audio = new AudioManager();
        this.ui = new UIManager(this);
        this.input = new InputHandler(this);

        this.init();
    }

    async init() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.container.appendChild(this.renderer.domElement);
        this.camera.position.z = 5;

        this.addLighting();

        // Load the designated sky image for the local-scale skybox.
        // It's okay if loading is async; we'll apply it when available.
        this.skyboxTexture = null;
        try {
            const loader = new THREE.TextureLoader();
            loader.load('/1eprhbtmvoo51.png', (tex) => {
                tex.encoding = THREE.sRGBEncoding;
                // Use equirectangular mapping so it looks correct as a background sphere/sky
                try { tex.mapping = THREE.EquirectangularReflectionMapping; } catch (e) {}
                this.skyboxTexture = tex;

                // Apply the loaded texture as the scene background so the sky is visible immediately.
                try {
                    this.scene.background = this.skyboxTexture;
                    // also set environment for better PBR lighting where applicable
                    if (this.renderer && this.renderer.capabilities.isWebGL2 !== false) {
                        this.scene.environment = this.skyboxTexture;
                    }
                } catch (e) {
                    console.warn('Failed to apply skybox texture to scene', e);
                }
            }, undefined, (err) => {
                console.warn('Skybox texture failed to load', err);
            });
        } catch (e) {
            console.warn('Skybox loader error', e);
        }

        this.createBackground();
        this.createUniverseObjects();
        
        window.addEventListener('resize', () => this.onResize());
        this.animate();
        this.ui.update(this.currentLogScale);
    }

    addLighting() {
        this.scene.add(new THREE.AmbientLight(0xffffff, 0.5));
        const sunLight = new THREE.DirectionalLight(0xffffff, 1);
        sunLight.position.set(5, 5, 5);
        this.scene.add(sunLight);
    }

    createBackground() {
        const starMat = new THREE.ShaderMaterial({
            vertexShader: StarFieldShader.vertexShader,
            fragmentShader: StarFieldShader.fragmentShader,
            uniforms: StarFieldShader.uniforms,
            side: THREE.BackSide
        });
        this.scene.add(new THREE.Mesh(new THREE.SphereGeometry(500, 32, 32), starMat));
    }

    // removed createUniverseObjects logic from app.js as it was moved to ObjectFactory
    createUniverseObjects() {
        if (this.worldGroup) {
            this.scene.remove(this.worldGroup);
            this.objects.forEach(obj => {
                if (obj.geometry) obj.geometry.dispose();
                if (obj.material) {
                    if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose());
                    else obj.material.dispose();
                }
            });
            this.objects = [];
        }
        this.worldGroup = new THREE.Group();
        this.scene.add(this.worldGroup);
        this.currentScales.forEach(data => {
            const obj = ObjectFactory.create(data);
            this.worldGroup.add(obj);
            this.objects.push(obj);
        });
    }

    switchUniverse(id) {
        this.currentUniverseId = id;
        this.currentScales = setScales(id);
        this.createUniverseObjects();
        // Zoom to human scale equivalent in the new reality
        this.targetLogScale = 0;
        this.ui.update(this.currentLogScale);
    }

    // removed addEventListeners() as it was moved to InputHandler

    onResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    // Hell corruption logic removed. Hell is now just a local area with its own distinct objects.

    animate() {
        requestAnimationFrame(() => this.animate());

        const prevScale = this.currentLogScale;
        this.currentLogScale += (this.targetLogScale - this.currentLogScale) * 0.1;
        const speed = this.currentLogScale - prevScale;

        // Dynamic visual effects based on scale
        let hellFactor = 0;
        if (this.currentLogScale < -80) {
            hellFactor = Math.min(1.0, (Math.abs(this.currentLogScale) - 80) / 20);
        }
        StarFieldShader.uniforms.isHell.value = hellFactor;
        
        this.audio.updateZoom(speed);

        if (Math.abs(speed) > 0.0001) {
            this.ui.update(this.currentLogScale);
        }

        StarFieldShader.uniforms.time.value += 0.01;

        // Smooth rotation
        this.worldRotation.x += (this.targetRotation.x - this.worldRotation.x) * 0.1;
        this.worldRotation.y += (this.targetRotation.y - this.worldRotation.y) * 0.1;
        this.worldGroup.rotation.copy(this.worldRotation);

        // WASD / keyboard movement applied to camera (from InputHandler moveVector)
        if (this.input && this.input.moveVector) {
            // Normalize movement so perceived speed does not change when zooming in/out.
            // Compute a visual scale based on currentLogScale and use it to counteract zoom scaling.
            // Guard against extremes by clamping the visualScale to a small positive range.
            const visualScale = Math.max(1e-8, Math.pow(10, this.currentLogScale));
            // convert moveVector (local) into world movement using camera orientation
            // divide by visualScale so camera travel feels consistent across zoom levels
            const mv = this.input.moveVector.clone().multiplyScalar(0.08 / visualScale); // speed normalized to scale

            const forward = new THREE.Vector3();
            this.camera.getWorldDirection(forward);
            forward.y = 0;
            forward.normalize();

            const right = new THREE.Vector3();
            right.crossVectors(this.camera.up, forward).normalize();

            const worldMove = new THREE.Vector3();
            worldMove.addScaledVector(forward, mv.z); // forward/back
            worldMove.addScaledVector(right, mv.x); // strafe
            this.camera.position.add(worldMove);
        }

        this.objects.forEach((obj) => {
            // If an object has a move target, lerp its world position toward that target
            if (obj.userData && obj.userData.moveTo) {
                // ensure vec3 exists locally for smoother updates
                if (!obj.userData._tmpVec) obj.userData._tmpVec = obj.position.clone();
                obj.userData._tmpVec.lerp(obj.userData.moveTo, obj.userData.moveSpeed || 0.01);
                obj.position.copy(obj.userData._tmpVec);
            }

            // If an object requests maintaining a fixed radius from scene origin (e.g. Andromeda),
            // clamp its position length to the stored targetRadius to keep it at that distance.
            if (obj.userData && obj.userData.maintainRadius && typeof obj.userData.targetRadius === 'number') {
                const currentLen = obj.position.length();
                const targetLen = obj.userData.targetRadius;
                if (currentLen !== 0) {
                    // Reproject position to the fixed radius while preserving direction
                    obj.position.multiplyScalar(targetLen / currentLen);
                } else {
                    // If at origin for any reason, place it on +X at the correct radius
                    obj.position.set(targetLen, 0, 0);
                }
            }

            const relativeScale = obj.userData.logSize - this.currentLogScale;
            const visualScale = Math.pow(10, relativeScale);
            
            if (relativeScale > -6 && relativeScale < 2.5) {
                obj.visible = true;
                obj.scale.setScalar(visualScale);
                
                const opacity = 1 - Math.abs(relativeScale) / 3.5;
                obj.traverse(child => {
                    if (child.material) {
                        child.material.opacity = Math.max(0, opacity);
                        if (child.material.uniforms && child.material.uniforms.time) {
                            child.material.uniforms.time.value += 0.01;
                        }
                    }
                    if (child.userData && child.userData.speed) {
                        child.rotation.z += child.userData.speed;
                        if (child.userData.speed < 0.01) child.rotation.y += child.userData.speed;
                        
                        // Heart/Seed pulsing effect
                        if (child.userData.isHeart) {
                            const pulse = 1.0 + Math.sin(Date.now() * 0.005) * 0.05;
                            child.scale.set(0.12 * pulse, 0.12 * pulse, 0.12 * pulse);
                        }
                        if (child.userData.isSeed) {
                            const pulse = 1.0 + Math.sin(Date.now() * 0.003) * 0.2;
                            child.scale.set(pulse, pulse, pulse);
                        }
                    }
                    // Handle Multiverse bubble specific animations
                    if (obj.userData.type === 'multiverse' && child.userData.drift) {
                        child.position.add(child.userData.drift);
                        child.rotateOnAxis(child.userData.rotAxis, child.userData.rotSpeed);
                        // Containment: Keep bubbles within a reasonable radius
                        const dist = child.position.length();
                        if (dist > 18) child.position.multiplyScalar(0.99);
                        if (dist < 4) child.position.multiplyScalar(1.01);
                    }
                });

                if (obj.userData.type !== 'line') {
                    obj.rotation.y += 0.003;
                    // Avoid X-axis rotation drift for cosmic structures and celestial bodies
                    const isCosmic = ['galaxy', 'bulge', 'arm', 'cluster', 'universe', 'system', 'cloud', 'sun', 'earth', 'sphere'].includes(obj.userData.type);
                    if (!isCosmic) {
                        obj.rotation.x += 0.001;
                    }
                }
            } else {
                obj.visible = false;
            }
        });

        this.renderer.render(this.scene, this.camera);
    }
}

new UniverseApp();