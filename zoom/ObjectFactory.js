import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { SubatomicFactory } from './SubatomicFactory.js';
import { MacroFactory } from './MacroFactory.js';
import { GalaxyFactory } from './GalaxyFactory.js';
import { LargeScaleFactory } from './LargeScaleFactory.js';

export class ObjectFactory {
    static create(data) {
        const group = new THREE.Group();
        group.userData = data;

        let mesh = new THREE.Group();
        // Use a higher-quality PBR material for most objects to improve visual fidelity,
        // but keep the original Phong material for 'human' to leave humans unchanged.
        let mat;
        if (data && data.type === 'human') {
            mat = new THREE.MeshPhongMaterial({ color: data.color, transparent: true, shininess: 100 });
        } else {
            // MeshStandardMaterial gives better lighting responses, roughness/metalness control,
            // and plays nicely with scene lights to make models look richer.
            mat = new THREE.MeshStandardMaterial({
                color: data.color !== undefined ? data.color : 0xffffff,
                metalness: 0.15,
                roughness: 0.45,
                emissive: 0x000000,
                emissiveIntensity: 0.05,
                transparent: true,
                // enable flatShading only for specific small objects later if needed;
                // leave smooth shading by default for nicer appearance
            });
        }

        switch(data.type) {
            case 'foam':
                mesh = SubatomicFactory.createFoam(data);
                break;
            case 'manifold':
                mesh = SubatomicFactory.createManifold(data);
                break;
            case 'strings':
                mesh = SubatomicFactory.createStrings(data);
                break;
            case 'particle':
                mesh = SubatomicFactory.createParticleSystem(data, mat);
                break;
            case 'sphere': {
                // Default spherical object — if it's the Moon, load the lunar texture asset.
                const sphereGeo = new THREE.SphereGeometry(1, 48, 48);
                mesh = new THREE.Mesh(sphereGeo, mat);

                try {
                    const loader = new THREE.TextureLoader();

                    if (data && typeof data.name === 'string' && data.name.toLowerCase().includes('moon')) {
                        // Load the provided moon map asset and apply it to the sphere material when ready
                        loader.load('/moonmap1k.jpg', (tex) => {
                            try { tex.encoding = THREE.sRGBEncoding; } catch (e) {}
                            mesh.material = new THREE.MeshPhongMaterial({ map: tex, shininess: 5 });
                            mesh.userData.textureApplied = 'moonmap1k.jpg';
                        }, undefined, (err) => {
                            console.warn('Failed to load moon texture', err);
                        });
                    } else if (data && data.texture) {
                        // If an explicit texture path is provided in the data object, use it
                        loader.load(data.texture, (tex) => {
                            try { tex.encoding = THREE.sRGBEncoding; } catch (e) {}
                            mesh.material = new THREE.MeshPhongMaterial({ map: tex, shininess: 20 });
                            mesh.userData.textureApplied = data.texture;
                        }, undefined, (err) => {
                            console.warn('Failed to load sphere texture', err);
                        });
                    }
                } catch (e) {
                    console.warn('Texture loader failed for sphere', e);
                }
            } break;
            case 'atom':
                mesh = SubatomicFactory.createAtom(data, mat);
                break;
            case 'nucleus':
                mesh = SubatomicFactory.createNucleus(data);
                break;
            case 'helix':
                mesh = SubatomicFactory.createHelix(data, mat);
                break;
            case 'blob':
                mesh = SubatomicFactory.createBlob(data, mat);
                break;
            case 'human':
                mesh = MacroFactory.createHuman(data, mat);
                break;
            case 'hair':
                mesh = MacroFactory.createHair(data);
                break;
            case 'tower':
                // If an image is provided on the data object, render a flag-map styled plane using that image.
                if (data.image) {
                    const loader = new THREE.TextureLoader();
                    const tex = loader.load(data.image);
                    try { tex.encoding = THREE.sRGBEncoding; } catch (e) {}

                    // Determine a reasonable aspect for presentation; default to a rectangular plane
                    const planeGeo = new THREE.PlaneGeometry(3.5, 2.5);
                    const planeMat = new THREE.MeshBasicMaterial({
                        map: tex,
                        transparent: true,
                        side: THREE.DoubleSide,
                        depthWrite: false
                    });

                    const plane = new THREE.Mesh(planeGeo, planeMat);
                    // Slight angle for better presentation in the scene
                    plane.rotation.y = Math.PI * 0.2;
                    plane.rotation.x = -0.1;

                    const groupWithImage = new THREE.Group();
                    groupWithImage.add(plane);
                    mesh = groupWithImage;
                } else if (data.name && data.name.toLowerCase().includes('statue of liberty')) {
                    // Create the tower and add a small green person model to the top for the Statue of Liberty
                    const tower = MacroFactory.createTower();
                    const personColor = 0x33aa33; // green
                    // Build a simple stylized person using MacroFactory.createHuman-like geometry but inline for local control
                    const person = new THREE.Group();
                    const mat = new THREE.MeshPhongMaterial({ color: personColor, transparent: true, shininess: 60 });

                    // Torso
                    const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.12, 0.25, 4, 8), mat);
                    torso.position.y = 0.2;
                    person.add(torso);

                    // Head
                    const head = new THREE.Mesh(new THREE.SphereGeometry(0.08, 12, 12), mat);
                    head.position.y = 0.45;
                    person.add(head);

                    // Arms
                    const armGeo = new THREE.CapsuleGeometry(0.03, 0.3, 2, 4);
                    const armL = new THREE.Mesh(armGeo, mat);
                    armL.position.set(0.18, 0.12, 0);
                    armL.rotation.z = -0.2;
                    person.add(armL);

                    const armR = new THREE.Mesh(armGeo, mat);
                    armR.position.set(-0.18, 0.12, 0);
                    armR.rotation.z = 0.2;
                    person.add(armR);

                    // Legs
                    const legGeo = new THREE.CapsuleGeometry(0.04, 0.35, 2, 4);
                    const legL = new THREE.Mesh(legGeo, mat);
                    legL.position.set(0.06, -0.25, 0);
                    person.add(legL);

                    const legR = new THREE.Mesh(legGeo, mat);
                    legR.position.set(-0.06, -0.25, 0);
                    person.add(legR);

                    // Scale and position the person so they sit on top of the tower
                    person.scale.setScalar(0.9);
                    person.position.set(0, 2.05, 0); // assumes MacroFactory.createTower has ~2 unit height
                    person.userData = { isStatuePerson: true };

                    const groupWithPerson = new THREE.Group();
                    groupWithPerson.add(tower);
                    groupWithPerson.add(person);
                    mesh = groupWithPerson;
                } else {
                    mesh = MacroFactory.createTower();
                }
                break;
            case 'smartphone': {
                // Create a smaller placeholder while the GLB model loads, then replace with the loaded model.
                const placeholder = new THREE.Group();
                // Reduced base size to make smartphone visibly smaller in the scene
                const base = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.5, 0.04), new THREE.MeshStandardMaterial({ color: data.color || 0x111111 }));
                placeholder.add(base);

                // smaller screen plane for immediate readability
                const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.45), new THREE.MeshBasicMaterial({ color: 0x0a0a0a }));
                screen.position.z = 0.025;
                placeholder.add(screen);

                mesh = placeholder;

                // Asynchronously load GLB model and swap in when ready
                try {
                    const loader = new GLTFLoader();
                    loader.load('/super_low_poly_generic_smartphone.glb', (gltf) => {
                        try {
                            const model = gltf.scene || gltf.scenes[0];
                            if (!model) return;
                            // normalize model size: aim for model roughly matching the smaller placeholder bounding box
                            const box = new THREE.Box3().setFromObject(model);
                            const size = new THREE.Vector3();
                            box.getSize(size);
                            // Lower targetHeight so loaded model is smaller than before
                            const targetHeight = 0.5;
                            const scale = targetHeight / (size.y || 1.0);
                            model.scale.setScalar(scale * 0.95);

                            // center model
                            const center = new THREE.Vector3();
                            box.getCenter(center);
                            model.position.sub(center.multiplyScalar(scale * 0.95));

                            // gentle rotation for presentation
                            model.rotation.y = Math.PI * 0.12;

                            // remove placeholder children and add model
                            placeholder.clear();
                            placeholder.add(model);
                        } catch (err) {
                            console.warn('Smartphone model load handler error', err);
                        }
                    }, undefined, (err) => {
                        console.warn('Failed to load smartphone GLB', err);
                    });
                } catch (e) {
                    console.warn('GLTFLoader or load failed', e);
                }
            } break;

            case 'pixel':
                {
                    // Render a tiny RGB subpixel group to represent a 96 PPI screen Pixel at 0.01"
                    const groupP = new THREE.Group();
                    // overall visual size for preview; actual scene scaling handled elsewhere
                    const totalW = 0.6;
                    const h = 0.18;
                    const cols = [0xff0000, 0x00ff00, 0x0000ff];
                    const segmentW = totalW / cols.length;
                    for (let i = 0; i < cols.length; i++) {
                        const geo = new THREE.PlaneGeometry(segmentW - 0.02, h);
                        const mat = new THREE.MeshBasicMaterial({ color: cols[i], transparent: true, side: THREE.DoubleSide });
                        const px = new THREE.Mesh(geo, mat);
                        px.position.x = (i - (cols.length - 1) / 2) * segmentW;
                        px.userData = { isPixelSub: true, channel: ['R','G','B'][i] };
                        groupP.add(px);
                    }
                    // subtle dark border/frame behind the subpixels for readability
                    const frameGeo = new THREE.PlaneGeometry(totalW, h);
                    const frameMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.12, side: THREE.DoubleSide });
                    const frame = new THREE.Mesh(frameGeo, frameMat);
                    frame.position.z = -0.01;
                    groupP.add(frame);

                    // Tiny highlight to make it read as a lit pixel
                    const glow = new THREE.Mesh(
                        new THREE.PlaneGeometry(totalW * 0.9, h * 0.9),
                        new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.04, side: THREE.DoubleSide })
                    );
                    glow.position.z = 0.01;
                    groupP.add(glow);

                    mesh = groupP;
                }
                break;
            case 'mountain':
                mesh = MacroFactory.createMountain();
                break;
            case 'earth':
                mesh = MacroFactory.createEarth();
                break;
            case 'sun':
                mesh = MacroFactory.createSun(data);
                break;
            case 'system':
                mesh = MacroFactory.createSolarSystem();
                break;
            case 'cloud':
            case 'universe':
                mesh = LargeScaleFactory.createUniverse(data);
                break;
            case 'cmb':
                mesh = LargeScaleFactory.createCMB(data);
                break;
            case 'galaxy':
                mesh = GalaxyFactory.createGalaxy(data);
                break;
            case 'cluster':
                mesh = LargeScaleFactory.createCluster(data);
                break;
            case 'web':
                mesh = LargeScaleFactory.createCosmicWeb(data);
                break;
            case 'arm':
                mesh = GalaxyFactory.createArm(data);
                break;
            case 'star':
                mesh = LargeScaleFactory.createStars(data);
                break;
            case 'multiverse':
                mesh = LargeScaleFactory.createMultiverse(data);
                break;
            case 'tetrahedron':
                mesh = LargeScaleFactory.createTetrahedron(data);
                break;
            case 'dodecahedron':
                mesh = LargeScaleFactory.createDodecahedron(data);
                break;
            case 'icosidodecahedron':
                mesh = LargeScaleFactory.createIcosidodecahedron(data);
                break;
            case 'hexahedron':
                mesh = LargeScaleFactory.createHexahedron(data);
                break;

            case 'mandelbrot':
                mesh = LargeScaleFactory.createMandelbrot(data);
                break;
            case 'metaverse':
                mesh = LargeScaleFactory.createMetaverse(data);
                break;
            case 'megaverse':
                mesh = LargeScaleFactory.createMegaverse(data);
                break;
            case 'gigaverse':
                mesh = LargeScaleFactory.createGigaverse(data);
                break;
            case 'teraverse':
                mesh = LargeScaleFactory.createTeraverse(data);
                break;
            case 'zettaverse':
                mesh = LargeScaleFactory.createZettaverse(data);
                break;
            case 'yottaverse':
                mesh = LargeScaleFactory.createYottaverse(data);
                break;
            case 'hyperverse':
                mesh = LargeScaleFactory.createHyperverse(data);
                break;
            case 'omniverse':
                mesh = LargeScaleFactory.createOmniverse(data);
                break;

            case 'horizon':
                mesh = LargeScaleFactory.createHorizon(data);
                break;
            case 'bulk':
                mesh = LargeScaleFactory.createBulk(data);
                break;
            case 'hypergrid':
                mesh = LargeScaleFactory.createHypergrid(data);
                break;
            case 'crystal':
                mesh = LargeScaleFactory.createCrystal(data);
                break;
            case 'heaven':
                mesh = LargeScaleFactory.createHeaven(data);
                break;
            // removed case 'bulk'
            // removed case 'foam'
            case 'bulge':
                mesh = GalaxyFactory.createBulge(data);
                break;
            case 'line':
                mesh = MacroFactory.createLine(data);
                break;
            case 'portal':
                mesh = SubatomicFactory.createPortal(data);
                break;
            case 'heart':
                mesh = SubatomicFactory.createHeart(data);
                break;
            case 'engine':
                mesh = SubatomicFactory.createEngine(data);
                break;
            case 'glyph':
                mesh = SubatomicFactory.createGlyph(data);
                break;
            case 'neuron':
                mesh = SubatomicFactory.createNeuron(data);
                break;
            case 'seed':
                mesh = SubatomicFactory.createSeed(data);
                break;
            case 'infinity':
                {
                    // Render the Infinity entry as a large textured plane using the provided image asset
                    const loader = new THREE.TextureLoader();
                    const tex = loader.load(data.image || '/Infinity(1).webp');
                    tex.encoding = THREE.sRGBEncoding;
                    const planeGeo = new THREE.PlaneGeometry(6, 3.2);
                    const planeMat = new THREE.MeshBasicMaterial({
                        map: tex,
                        transparent: true,
                        side: THREE.DoubleSide,
                        depthWrite: false
                    });
                    const plane = new THREE.Mesh(planeGeo, planeMat);
                    // orient and slightly rotate for presentation
                    plane.rotation.y = Math.PI * 0.25;
                    plane.rotation.x = -0.08;
                    plane.userData = { isArtwork: true };
                    mesh = new THREE.Group();
                    mesh.add(plane);

                    // Special decorative five-ring variant for the 10^1800 "Cosmic Screen Stretch" entry (Me At Ages)
                    // Use concentric rings with subtle colors/opacities to create the five-ring visual
                    const baseRadius = 3.4;
                    const ringCount = 5;
                    for (let i = 0; i < ringCount; i++) {
                        const inner = baseRadius + i * 0.18;
                        const outer = inner + 0.12;
                        const ringGeom = new THREE.RingGeometry(inner, outer, 128);
                        const hueShift = 0.08 * i;
                        const color = new THREE.Color().setHSL(0.06 + hueShift, 0.9, 0.6).multiplyScalar(1.0);
                        const ringMat = new THREE.MeshBasicMaterial({
                            color: color,
                            transparent: true,
                            opacity: 0.14 - i * 0.02,
                            side: THREE.DoubleSide,
                            depthWrite: false
                        });
                        const ring = new THREE.Mesh(ringGeom, ringMat);
                        ring.rotation.x = -Math.PI / 2;
                        ring.position.y = -0.12 - (i * 0.01);
                        ring.userData = { ringIndex: i };
                        mesh.add(ring);
                    }

                    // Add a subtle soft glow disk under the image for readability
                    const glowGeom = new THREE.RingGeometry(0.01, baseRadius + ringCount * 0.18 + 0.2, 128);
                    const glowMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.08, side: THREE.DoubleSide });
                    const glow = new THREE.Mesh(glowGeom, glowMat);
                    glow.rotation.x = -Math.PI / 2;
                    glow.position.y = -0.15;
                    mesh.add(glow);
                }
                break;
            default:
                mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), mat);
        }

        group.add(mesh);

        // Ensure certain iconic items aren't lost in origin overlap:
        // Place the Statue of Liberty and Robert Wadlow slightly offset so they are visible
        // when many origin-centered objects are created.
        try {
            const n = (data && data.name) ? data.name.toLowerCase() : '';
            if (n.includes('statue of liberty')) {
                group.position.x += 1.5;
                group.position.y += 0.0;
            } else if (n.includes('robert wadlow')) {
                group.position.x -= 1.5;
                group.position.y += 0.0;
            }
        } catch (e) {
            // fail-safe: do nothing on any error
            console.warn('position offset failed for', data && data.name, e);
        }

        group.visible = false;
        return group;
    }

    // removed createParticleSystem(data, mat) {}
    // removed createAtom(data, mat) {}
    // removed createHelix(data, mat) {}
    // removed createBlob(data, mat) {}
    // removed createHuman(data, mat) {}
    // removed createTower() {}
    // removed createEarth() {}
    // removed createSun(data) {}
    // removed createSolarSystem() {}
    // removed createPointCLoud(data) {}
    // removed createGalaxy(data) {}
    // removed createCluster(data) {}
    // removed createBulge(data) {}
    // removed createArm(data) {}
    // removed createLine() {}
}