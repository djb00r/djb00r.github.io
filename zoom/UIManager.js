import * as THREE from 'three';
import { SCALES, MIN_LOG, MAX_LOG } from './Constants.js';
import { ObjectFactory } from './ObjectFactory.js';

export class UIManager {
    constructor(app) {
        this.app = app;
        this.progressBar = document.getElementById('progress-bar');
        this.nameEl = document.getElementById('object-name');
        this.sizeEl = document.getElementById('object-size');
        this.descEl = document.getElementById('object-desc');
        this.overlay = document.getElementById('overlay');

        this.fastScroll = document.getElementById('fast-scroll-slider');
        this.isUserScrolling = false;

        this.modal = document.getElementById('details-modal');
        this.modalName = document.getElementById('modal-name');
        this.modalSize = document.getElementById('modal-size');
        this.modalImage = document.getElementById('modal-image');
        this.modalDesc = document.getElementById('modal-desc');
        this.modalVisual = document.getElementById('modal-visual');

        // 3D preview state
        this.previewRenderer = null;
        this.previewScene = null;
        this.previewCamera = null;
        this.previewObject = null;
        this.previewAnimating = false;
        this.modalClose = document.getElementById('modal-close');
        this.backHomeBtn = document.getElementById('back-home-btn');
        this.clickHint = document.getElementById('click-hint');

        this.modalClose.addEventListener('click', () => this.hideDetails());

        this.backHomeBtn.addEventListener('click', () => {
            this.app.switchUniverse(0);
        });

        this.fastScroll.addEventListener('input', (e) => {
            this.isUserScrolling = true;
            this.app.targetLogScale = parseFloat(e.target.value);
            // Trigger tick audio when moving the slider
            if (this.app.audio && this.app.audio.playTick) {
                this.app.audio.playTick();
            }
        });

        this.fastScroll.addEventListener('change', () => {
            this.isUserScrolling = false;
        });

        // Settings state
        this.settings = {
            muteAudio: false,
            disablePopups: false
        };

        // Create a persistent settings button and panel (top-left)
        this.settingsBtn = document.createElement('button');
        this.settingsBtn.id = 'settings-btn';
        this.settingsBtn.title = 'Settings';
        // Use a clear label for accessibility and mobile tap targets
        this.settingsBtn.innerHTML = 'Settings';
        document.body.appendChild(this.settingsBtn);

        this.settingsPanel = document.createElement('div');
        this.settingsPanel.id = 'settings-panel';
        // Put content inside a floating card so the panel itself can provide the 3D/perspective transform
        this.settingsPanel.innerHTML = `
            <div class="floating-card">
                <h3>Settings</h3>
                <label class="setting-line"><input type="checkbox" id="toggle-popups"> Disable popups</label>
                <label class="setting-line"><input type="checkbox" id="toggle-audio"> Mute audio</label>
                <button id="settings-close">Close</button>
            </div>
        `;
        document.body.appendChild(this.settingsPanel);

        // DOM refs for controls
        this.togglePopupsEl = document.getElementById('toggle-popups');
        this.toggleAudioEl = document.getElementById('toggle-audio');
        this.settingsCloseEl = document.getElementById('settings-close');

        // Event wiring
        this.settingsBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.settingsPanel.classList.toggle('open');
        });

        this.settingsCloseEl.addEventListener('click', () => {
            this.settingsPanel.classList.remove('open');
        });

        this.togglePopupsEl.addEventListener('change', (e) => {
            this.settings.disablePopups = e.target.checked;
            // Hide modal immediately if toggled on
            if (this.settings.disablePopups) {
                this.hideDetails();
            }
        });

        this.toggleAudioEl.addEventListener('change', async (e) => {
            this.settings.muteAudio = e.target.checked;
            try {
                if (this.app && this.app.audio) {
                    // Ensure audio system initialized before toggling
                    await this.app.audio.init();
                    if (this.settings.muteAudio) {
                        // Pause ambient element and silence oscillator/gain quickly
                        if (this.app.audio.ambient) {
                            try { this.app.audio.ambient.pause(); } catch (err) {}
                            try { this.app.audio.ambient.currentTime = 0; } catch (err) {}
                        }
                        if (this.app.audio.zoomGain) {
                            try { this.app.audio.zoomGain.gain.setTargetAtTime(0, this.app.audio.ctx.currentTime, 0.01); } catch (err) {}
                        }
                    } else {
                        // Resume ambient playback via AudioManager.resume which handles context
                        if (typeof this.app.audio.resume === 'function') {
                            try { await this.app.audio.resume(); } catch (err) {}
                        }
                    }
                }
            } catch (e) {
                console.warn('Audio toggle failed', e);
            }
        });

        // Close panel if clicking outside
        window.addEventListener('pointerdown', (ev) => {
            if (!this.settingsPanel.contains(ev.target) && ev.target !== this.settingsBtn) {
                this.settingsPanel.classList.remove('open');
            }
        });
    }

    update(currentLogScale) {
        const progress = ((currentLogScale - MIN_LOG) / (MAX_LOG - MIN_LOG)) * 100;
        this.progressBar.style.width = `${progress}%`;

        if (!this.isUserScrolling) {
            this.fastScroll.value = currentLogScale;
        }

        // Use the application's current scales reference
        const activeScales = this.app.currentScales || SCALES;

        let closest = activeScales[0];
        let minDist = Infinity;
        activeScales.forEach(s => {
            const d = Math.abs(s.logSize - currentLogScale);
            if (d < minDist) {
                minDist = d;
                closest = s;
            }
        });

        // Show/Hide back button
        if (this.app.currentUniverseId !== 0) {
            this.backHomeBtn.style.display = 'block';
        } else {
            this.backHomeBtn.style.display = 'none';
        }

        this.nameEl.textContent = closest.name;

        // Multiverse bubble click hint
        if (closest.type === 'multiverse' && Math.abs(currentLogScale - closest.logSize) < 5) {
            this.clickHint.style.display = 'block';
        } else {
            this.clickHint.style.display = 'none';
        }

        const displayLog = currentLogScale;
        this.sizeEl.innerHTML = `10<sup>${displayLog.toFixed(1)}</sup> meters`;
        this.descEl.textContent = closest.desc;

        this.updateTheme(currentLogScale);
    }

    updateTheme(currentLogScale) {
        // Transition theme based on current scale area
        if (currentLogScale < -450) {
            // Heart of the Universes Core Transition
            const factor = Math.min(1.0, (Math.abs(currentLogScale) - 450) / 100);
            document.body.style.backgroundColor = this.lerpColor('#2b001a', '#000000', factor);
            this.nameEl.style.color = this.lerpColor('#ff66aa', '#ffffff', factor);
            this.sizeEl.style.color = this.lerpColor('#ffcce6', '#00ffee', factor);
            this.progressBar.style.background = this.lerpColor('#ff3388', '#ffffff', factor);
        } else if (currentLogScale < -380) {
            // Heart of the Universe Transition
            const factor = Math.min(1.0, (Math.abs(currentLogScale) - 380) / 40);
            document.body.style.backgroundColor = this.lerpColor('#1a0000', '#2b001a', factor);
            this.nameEl.style.color = this.lerpColor('#ff3300', '#ff66aa', factor);
            this.sizeEl.style.color = this.lerpColor('#ffaa00', '#ffcce6', factor);
            this.progressBar.style.background = this.lerpColor('#ff3300', '#ff3388', factor);
        } else if (currentLogScale < -80) {
            // Hell Transition
            const factor = Math.min(1.0, (Math.abs(currentLogScale) - 80) / 20);
            document.body.style.backgroundColor = this.lerpColor('#000000', '#1a0000', factor);
            this.nameEl.style.color = this.lerpColor('#ffffff', '#ff3300', factor);
            this.sizeEl.style.color = this.lerpColor('#00d4ff', '#ffaa00', factor);
            this.progressBar.style.background = this.lerpColor('#00d4ff', '#ff3300', factor);
        } else if (currentLogScale > 220 && currentLogScale < 280) {
            // Heaven Transition
            const center = 242;
            const dist = Math.abs(currentLogScale - center);
            const factor = Math.max(0, 1.0 - dist / 30);
            document.body.style.backgroundColor = this.lerpColor('#000000', '#221a00', factor);
            this.nameEl.style.color = this.lerpColor('#ffffff', '#fff9e6', factor);
            this.sizeEl.style.color = this.lerpColor('#00d4ff', '#ffeeaa', factor);
            this.progressBar.style.background = this.lerpColor('#00d4ff', '#fff9e6', factor);
        } else {
            // Reset to default cosmic theme
            document.body.style.backgroundColor = '#000000';
            this.nameEl.style.color = '#ffffff';
            this.sizeEl.style.color = '#00d4ff';
            this.progressBar.style.background = '#00d4ff';
        }
    }

    lerpColor(a, b, amount) {
        const ah = parseInt(a.replace(/#/g, ''), 16),
              ar = ah >> 16, ag = ah >> 8 & 0xff, ab = ah & 0xff,
              bh = parseInt(b.replace(/#/g, ''), 16),
              br = bh >> 16, bg = bh >> 8 & 0xff, bb = bh & 0xff,
              rr = Math.round(ar + amount * (br - ar)),
              rg = Math.round(ag + amount * (bg - ag)),
              rb = Math.round(ab + amount * (bb - ab));
        return '#' + ((1 << 24) + (rr << 16) + (rg << 8) + rb).toString(16).slice(1);
    }

    hideOverlay() {
        if (this.overlay.style.display !== 'none') {
            this.overlay.style.opacity = '0';
            setTimeout(() => this.overlay.style.display = 'none', 500);
        }
    }

    showDetails(data) {
        // Respect the "disable popups" setting if present
        if (this.settings && this.settings.disablePopups) return;

        this.modalName.textContent = data.name;
        const dLog = data.logSize;
        this.modalSize.innerHTML = `10<sup>${dLog}</sup> meters`;

        // If there's an image, show it in the modal and also present a simple 3D preview
        if (data.image) {
            this.modalImage.src = data.image;
            this.modalImage.style.display = 'block';
            // Ensure 3D preview canvas exists and render a textured plane of the image
            this.init3DPreview();
            this.show3DImagePreview(data);
        } else {
            // No image: hide the flat image and show a 3D preview of the object
            this.modalImage.src = '';
            this.modalImage.style.display = 'none';
            this.show3DPreview(data);
        }

        this.modalDesc.textContent = data.details || data.desc;
        this.modal.style.display = 'flex';
    }

    hideDetails() {
        this.modal.style.display = 'none';
        // Keep preview but stop animating for efficiency
        this.previewAnimating = false;
    }

    init3DPreview() {
        if (this.previewRenderer || !this.modalVisual) return;

        const width = this.modalVisual.clientWidth || 300;
        const height = this.modalVisual.clientHeight || 220;

        this.previewRenderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });
        this.previewRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.previewRenderer.setSize(width, height);
        this.previewRenderer.domElement.style.width = '100%';
        this.previewRenderer.domElement.style.height = '100%';
        this.previewRenderer.domElement.style.display = 'block';
        this.previewRenderer.domElement.style.position = 'absolute';
        this.previewRenderer.domElement.style.top = '0';
        this.previewRenderer.domElement.style.left = '0';
        this.modalVisual.appendChild(this.previewRenderer.domElement);

        this.previewScene = new THREE.Scene();
        this.previewCamera = new THREE.PerspectiveCamera(45, width / height, 0.01, 100);
        this.previewCamera.position.set(0, 0, 5);

        const ambient = new THREE.AmbientLight(0xffffff, 0.7);
        const dir = new THREE.DirectionalLight(0xffffff, 0.8);
        dir.position.set(3, 4, 5);
        this.previewScene.add(ambient);
        this.previewScene.add(dir);

        window.addEventListener('resize', () => {
            if (!this.previewRenderer || !this.modalVisual) return;
            const w = this.modalVisual.clientWidth || 300;
            const h = this.modalVisual.clientHeight || 220;
            this.previewCamera.aspect = w / h;
            this.previewCamera.updateProjectionMatrix();
            this.previewRenderer.setSize(w, h);
        });

        this.startPreviewLoop();
    }

    startPreviewLoop() {
        if (this.previewAnimating) return;
        this.previewAnimating = true;
        const loop = () => {
            if (!this.previewAnimating || !this.previewRenderer || !this.previewScene || !this.previewCamera) return;
            if (this.previewObject) {
                this.previewObject.rotation.y += 0.01;
                this.previewObject.rotation.x += 0.005;
            }
            this.previewRenderer.render(this.previewScene, this.previewCamera);
            requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);
    }

    clear3DPreview() {
        if (!this.previewScene) return;
        // If the previous preview object installed any event listeners or cleanup hooks, run them first
        if (this.previewObject && this.previewObject.userData && typeof this.previewObject.userData._cleanup === 'function') {
            try { this.previewObject.userData._cleanup(); } catch (e) { console.warn('preview cleanup failed', e); }
        }

        // remove previous preview object if present
        if (this.previewObject) {
            this.previewScene.remove(this.previewObject);
            // Dispose basic geometries/materials to avoid leaks
            this.previewObject.traverse((child) => {
                if (child.geometry) {
                    try { child.geometry.dispose(); } catch(e) {}
                }
                if (child.material) {
                    if (Array.isArray(child.material)) {
                        child.material.forEach(m => m.dispose && m.dispose());
                    } else if (child.material && typeof child.material.dispose === 'function') {
                        try { child.material.dispose(); } catch(e) {}
                    }
                }
            });
        }
        this.previewObject = null;
    }

    show3DPreview(data) {
        this.init3DPreview();

        if (!this.previewScene) return;

        // Remove previous object
        this.clear3DPreview();

        // Special-case Mandelbrot: create an interactive shader plane in the preview
        if (data.type === 'mandelbrot') {
            const width = this.modalVisual.clientWidth || 300;
            const height = this.modalVisual.clientHeight || 220;
            // Simple mandelbrot shader with zoom/pan uniforms
            const mandelUniforms = {
                time: { value: 0.0 },
                center: { value: new THREE.Vector2(-0.745, 0.186) },
                zoom: { value: 1.5 },
                resolution: { value: new THREE.Vector2(width, height) }
            };

            const vertex = `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `;
            const fragment = `
                precision highp float;
                varying vec2 vUv;
                uniform vec2 center;
                uniform float zoom;
                uniform float time;
                uniform vec2 resolution;

                vec3 palette(float t) {
                    vec3 a = vec3(0.5, 0.2, 0.8);
                    vec3 b = vec3(0.5, 0.5, 0.5);
                    vec3 c = vec3(1.0, 0.7, 0.2);
                    vec3 d = vec3(0.3, 0.2, 0.9);
                    return a + b * cos(6.28318 * (c * t + d));
                }

                void main() {
                    vec2 uv = (vUv - 0.5) * vec2(resolution.x / resolution.y, 1.0);
                    vec2 c = center + uv * zoom * 2.5;
                    vec2 z = vec2(0.0);
                    float iter = 0.0;
                    const float maxIter = 180.0;
                    for (float i = 0.0; i < maxIter; i++) {
                        vec2 z2 = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + c;
                        z = z2;
                        if (dot(z, z) > 4.0) { iter = i; break; }
                    }
                    float m = iter / maxIter;
                    if (iter < maxIter - 1.0) {
                        float log_zn = log(dot(z, z)) / 2.0;
                        float nu = log(log_zn / log(2.0)) / log(2.0);
                        m = 1.0 - clamp((iter + 1.0 - nu) / maxIter, 0.0, 1.0);
                    }
                    vec3 col = iter >= maxIter - 1.0 ? vec3(0.02, 0.0, 0.05) : palette(m);
                    float d = distance(vUv, vec2(0.5));
                    float vignette = smoothstep(0.9, 0.3, d);
                    col *= vignette;
                    gl_FragColor = vec4(col, 1.0);
                }
            `;

            const mat = new THREE.ShaderMaterial({
                uniforms: mandelUniforms,
                vertexShader: vertex,
                fragmentShader: fragment
            });

            const planeGeo = new THREE.PlaneGeometry(3.2, 2.0);
            const plane = new THREE.Mesh(planeGeo, mat);
            this.previewScene.add(plane);
            this.previewObject = plane;

            // Interactivity: drag to pan, wheel to zoom inside modal preview
            let isDragging = false;
            let last = { x: 0, y: 0 };
            const onPointerDown = (e) => {
                isDragging = true;
                last.x = e.clientX || (e.touches && e.touches[0] && e.touches[0].clientX) || 0;
                last.y = e.clientY || (e.touches && e.touches[0] && e.touches[0].clientY) || 0;
            };
            const onPointerMove = (e) => {
                if (!isDragging) return;
                const x = e.clientX || (e.touches && e.touches[0] && e.touches[0].clientX) || 0;
                const y = e.clientY || (e.touches && e.touches[0] && e.touches[0].clientY) || 0;
                const dx = (x - last.x) / (this.modalVisual.clientWidth || 300);
                const dy = (y - last.y) / (this.modalVisual.clientHeight || 220);
                const zoom = mandelUniforms.zoom.value;
                // pan scaled by zoom for intuitive navigation
                mandelUniforms.center.value.x -= dx * zoom * 2.0;
                mandelUniforms.center.value.y += dy * zoom * 2.0;
                last.x = x; last.y = y;
            };
            const onPointerUp = () => { isDragging = false; };
            const onWheelPreview = (e) => {
                e.preventDefault();
                const delta = e.deltaY > 0 ? 1.12 : 0.88;
                mandelUniforms.zoom.value *= delta;
            };

            this.modalVisual.addEventListener('pointerdown', onPointerDown);
            window.addEventListener('pointermove', onPointerMove);
            window.addEventListener('pointerup', onPointerUp);
            this.modalVisual.addEventListener('wheel', onWheelPreview, { passive: false });

            // store cleanup hooks so clear3DPreview can remove listeners
            this.previewObject.userData._cleanup = () => {
                this.modalVisual.removeEventListener('pointerdown', onPointerDown);
                window.removeEventListener('pointermove', onPointerMove);
                window.removeEventListener('pointerup', onPointerUp);
                this.modalVisual.removeEventListener('wheel', onWheelPreview);
            };

            // animate uniform time
            const origStart = performance.now();
            const loopUniforms = () => {
                if (!this.previewAnimating || !this.previewObject) return;
                mat.uniforms.time.value = (performance.now() - origStart) * 0.001;
                requestAnimationFrame(loopUniforms);
            };
            requestAnimationFrame(loopUniforms);

            this.previewAnimating = true;
            this.startPreviewLoop();
            return;
        }

        // Default: create a fresh instance of the object for preview (unique 3D)
        const obj = ObjectFactory.create(data);
        obj.visible = true;
        obj.position.set(0, 0, 0);

        // Normalize size so it fits nicely in the preview
        const box = new THREE.Box3().setFromObject(obj);
        const size = new THREE.Vector3();
        box.getSize(size);
        const maxDim = Math.max(size.x, size.y, size.z) || 1.0;
        const scale = 2.0 / maxDim;
        obj.scale.multiplyScalar(scale);

        // Center the object in view
        const center = new THREE.Vector3();
        box.getCenter(center);
        obj.position.sub(center.multiplyScalar(scale));

        this.previewScene.add(obj);
        this.previewObject = obj;

        this.previewAnimating = true;
        this.startPreviewLoop();
    }

    // Render a simple textured plane of the provided image inside the 3D preview canvas.
    show3DImagePreview(data) {
        // Ensure preview components exist
        this.init3DPreview();
        if (!this.previewScene) return;

        // Remove previous preview object
        this.clear3DPreview();

        // Create textured plane using the imported THREE (no local override)
        const loader = new THREE.TextureLoader();

        // load texture asynchronously so failures don't throw and block subsequent updates
        loader.load(
            data.image,
            (tex) => {
                try {
                    if (tex) tex.encoding = THREE.sRGBEncoding;
                } catch (e) { /* ignore */ }

                const aspect = (this.modalImage.naturalWidth && this.modalImage.naturalHeight) ? (this.modalImage.naturalWidth / this.modalImage.naturalHeight) : (16/9);
                const height = 1.6;
                const width = height * aspect;

                const planeGeo = new THREE.PlaneGeometry(width, height);
                const planeMat = new THREE.MeshBasicMaterial({ map: tex, transparent: true, side: THREE.DoubleSide });
                const plane = new THREE.Mesh(planeGeo, planeMat);
                plane.position.set(0, 0, 0);
                plane.rotation.y = 0.15;
                this.previewScene.add(plane);
                this.previewObject = plane;

                // Add a subtle rim light for readability
                const rim = new THREE.Mesh(
                    new THREE.RingGeometry(Math.max(width, height) * 0.55, Math.max(width, height) * 0.6, 64),
                    new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.12, side: THREE.DoubleSide })
                );
                rim.rotation.x = -Math.PI / 2;
                rim.position.y = -0.02;
                this.previewScene.add(rim);

                this.previewAnimating = true;
                this.startPreviewLoop();
            },
            undefined,
            (err) => {
                console.warn('Failed to load image for 3D preview', err);
                // As a fallback, show a simple colored plane so preview still updates
                const width = 2.8;
                const height = 1.6;
                const planeGeo = new THREE.PlaneGeometry(width, height);
                const planeMat = new THREE.MeshBasicMaterial({ color: 0x222222, transparent: true, opacity: 0.9, side: THREE.DoubleSide });
                const plane = new THREE.Mesh(planeGeo, planeMat);
                plane.rotation.y = 0.15;
                this.previewScene.add(plane);
                this.previewObject = plane;
                this.previewAnimating = true;
                this.startPreviewLoop();
            }
        );
    }

    // setHellTheme replaced by dynamic updateTheme to handle area transitions smoothly
}