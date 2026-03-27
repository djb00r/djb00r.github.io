import * as THREE from 'three';
import { AtmosphereShader } from './MacroShaders.js';
import { CosmicWebShader, MultiverseBubbleShader, CMBShader, HorizonShader, BulkShader, MandelbrotShader } from './LargeScaleShaders.js';
import { GalaxyFactory } from './GalaxyFactory.js';

export class LargeScaleFactory {
    static createPointCLoud(data) {
        const particleGeo = new THREE.BufferGeometry();
        const cloudCount = 500;
        const cloudPos = new Float32Array(cloudCount * 3);
        for(let i=0; i<cloudCount; i++) {
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            const r = 2 + Math.random() * 0.5;
            cloudPos[i*3] = r * Math.sin(phi) * Math.cos(theta);
            cloudPos[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
            cloudPos[i*3+2] = r * Math.cos(phi);
        }
        particleGeo.setAttribute('position', new THREE.BufferAttribute(cloudPos, 3));
        return new THREE.Points(particleGeo, new THREE.PointsMaterial({ color: data.color, size: 0.02, transparent: true }));
    }

    static createStars(data) {
        // Provides a simple star field used for 'star' type objects
        const group = new THREE.Group();
        const count = 1200;
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        const baseColor = new THREE.Color(data.color || 0xffffff);

        for (let i = 0; i < count; i++) {
            // Distribute stars across a flattened disk-ish volume for visual variety
            const r = 0.5 + Math.pow(Math.random(), 1.5) * 3.5;
            const angle = Math.random() * Math.PI * 2;
            const z = (Math.random() - 0.5) * 0.2 * (1.0 + Math.random() * 2.0);

            positions[i * 3] = Math.cos(angle) * r;
            positions[i * 3 + 1] = z;
            positions[i * 3 + 2] = Math.sin(angle) * r;

            // Slight color variation per star
            const col = baseColor.clone().lerp(new THREE.Color(0x88ccff), Math.random() * 0.6);
            colors[i * 3] = col.r;
            colors[i * 3 + 1] = col.g;
            colors[i * 3 + 2] = col.b;
        }

        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const mat = new THREE.PointsMaterial({
            size: 0.04,
            vertexColors: true,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            opacity: 0.85
        });

        const points = new THREE.Points(geo, mat);
        group.add(points);

        // Add a few brighter "pin" stars as small sprites for highlights
        const highlightGeo = new THREE.BufferGeometry();
        const hCount = 40;
        const hPos = new Float32Array(hCount * 3);
        for (let i = 0; i < hCount; i++) {
            const r = 0.6 + Math.pow(Math.random(), 1.2) * 3.0;
            const a = Math.random() * Math.PI * 2;
            hPos[i * 3] = Math.cos(a) * r;
            hPos[i * 3 + 1] = (Math.random() - 0.5) * 0.1;
            hPos[i * 3 + 2] = Math.sin(a) * r;
        }
        highlightGeo.setAttribute('position', new THREE.BufferAttribute(hPos, 3));
        const highlightMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.08, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, opacity: 1.0 });
        group.add(new THREE.Points(highlightGeo, highlightMat));

        return group;
    }

    static createCMB(data) {
        const group = new THREE.Group();
        const cmb = new THREE.Mesh(
            new THREE.SphereGeometry(4.5, 64, 64),
            new THREE.ShaderMaterial({
                uniforms: { time: { value: 0 } },
                vertexShader: CMBShader.vertexShader,
                fragmentShader: CMBShader.fragmentShader,
                side: THREE.BackSide, transparent: true, depthWrite: false
            })
        );
        group.add(cmb);
        return group;
    }

    static createCosmicWeb(data) {
        const group = new THREE.Group();
        
        // Use multiple overlapping spheres with the WebFilamentShader for volume effect
        const layers = 3;
        for (let i = 0; i < layers; i++) {
            // replaced filament shader volumes with a simpler translucent shell to remove filament visuals
            const mat = new THREE.MeshBasicMaterial({
                color: new THREE.Color(data.color),
                transparent: true,
                opacity: 0.22,
                side: THREE.BackSide,
                blending: THREE.AdditiveBlending,
                depthWrite: false
            });
            const sphere = new THREE.Mesh(new THREE.SphereGeometry(2.5, 32, 32), mat);
            sphere.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
            sphere.scale.setScalar(0.8 + i * 0.15);
            group.add(sphere);
        }

        // Add some bright clusters at intersections (points)
        const clusterCount = 100;
        const clusterGeo = new THREE.BufferGeometry();
        const clusterPos = new Float32Array(clusterCount * 3);
        for(let i=0; i<clusterCount; i++) {
            const r = Math.pow(Math.random(), 0.5) * 2.0;
            const t = Math.random() * Math.PI * 2;
            const p = Math.acos(2 * Math.random() - 1);
            clusterPos[i*3] = r * Math.sin(p) * Math.cos(t);
            clusterPos[i*3+1] = r * Math.sin(p) * Math.sin(t);
            clusterPos[i*3+2] = r * Math.cos(p);
        }
        clusterGeo.setAttribute('position', new THREE.BufferAttribute(clusterPos, 3));
        const clusterPoints = new THREE.Points(clusterGeo, new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.04,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        }));
        group.add(clusterPoints);

        return group;
    }

    static createUniverse(data) {
        const group = new THREE.Group();
        
        const pointCount = 15000;
        const geo = new THREE.BufferGeometry();
        const pos = new Float32Array(pointCount * 3);
        const sizes = new Float32Array(pointCount);

        for (let i = 0; i < pointCount; i++) {
            const t = Math.random() * Math.PI * 2;
            const p = Math.acos(2 * Math.random() - 1);
            const modifier = Math.sin(t * 4.0) * Math.cos(p * 4.0);
            const r = (2.5 + modifier * 0.8) * Math.pow(Math.random(), 0.3);
            pos[i * 3] = r * Math.sin(p) * Math.cos(t);
            pos[i * 3 + 1] = r * Math.sin(p) * Math.sin(t);
            pos[i * 3 + 2] = r * Math.cos(p);
            sizes[i] = Math.random() * 0.05 + 0.02;
        }

        geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        const mat = new THREE.ShaderMaterial({
            uniforms: THREE.UniformsUtils.clone(CosmicWebShader.uniforms),
            vertexShader: CosmicWebShader.vertexShader,
            fragmentShader: CosmicWebShader.fragmentShader,
            transparent: true, blending: THREE.AdditiveBlending, depthWrite: false
        });
        mat.uniforms.color.value.set(data.color);

        group.add(new THREE.Points(geo, mat));
        const coreGlow = new THREE.Mesh(
            new THREE.SphereGeometry(1.8, 32, 32),
            new THREE.ShaderMaterial({
                vertexShader: AtmosphereShader.vertexShader,
                fragmentShader: AtmosphereShader.fragmentShader,
                side: THREE.BackSide, transparent: true, blending: THREE.AdditiveBlending,
                uniforms: { glowColor: { value: new THREE.Color(0x3366ff) } }
            })
        );
        group.add(coreGlow);
        return group;
    }

    static createCluster(data) {
        const group = new THREE.Group();
        const numGalaxies = 16;
        for (let i = 0; i < numGalaxies; i++) {
            const gSize = 0.3 + Math.random() * 0.6;
            const mini = GalaxyFactory.createMiniGalaxy(data.color, gSize);
            const r = 2.0 + Math.random() * 3.5;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            mini.position.set(
                r * Math.sin(phi) * Math.cos(theta),
                r * Math.sin(phi) * Math.sin(theta),
                r * Math.cos(phi)
            );
            mini.rotation.set(Math.random(), Math.random(), Math.random());
            group.add(mini);
        }
        const starCloud = this.createPointCLoud({ color: 0xaaaaaa });
        starCloud.scale.setScalar(2.5);
        group.add(starCloud);
        return group;
    }

    // removed createBulk(data) {}
    // removed createFoam(data) {}

    static createHorizon(data) {
        const group = new THREE.Group();
        const mat = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                color: { value: new THREE.Color(data.color) }
            },
            vertexShader: HorizonShader.vertexShader,
            fragmentShader: HorizonShader.fragmentShader,
            transparent: true,
            blending: THREE.AdditiveBlending,
            side: THREE.DoubleSide
        });
        
        const shell = new THREE.Mesh(new THREE.SphereGeometry(4, 64, 64), mat);
        group.add(shell);

        const innerShell = new THREE.Mesh(new THREE.SphereGeometry(3.8, 48, 48), mat.clone());
        innerShell.material.side = THREE.BackSide;
        group.add(innerShell);

        return group;
    }

    static createBulk(data) {
        const group = new THREE.Group();
        const mat = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                color: { value: new THREE.Color(data.color) }
            },
            vertexShader: BulkShader.vertexShader,
            fragmentShader: BulkShader.fragmentShader,
            transparent: true,
            side: THREE.BackSide
        });

        const volume = new THREE.Mesh(new THREE.BoxGeometry(10, 10, 10), mat);
        group.add(volume);

        // Add some "branes"
        for(let i=0; i<5; i++) {
            const brane = new THREE.Mesh(
                new THREE.PlaneGeometry(8, 8),
                new THREE.MeshBasicMaterial({ 
                    color: 0x4422ff, 
                    transparent: true, 
                    opacity: 0.1, 
                    side: THREE.DoubleSide,
                    blending: THREE.AdditiveBlending
                })
            );
            brane.position.z = (i - 2) * 1.5;
            brane.rotation.x = Math.random() * 0.2;
            group.add(brane);
        }

        return group;
    }

    static createTetrahedron(data) {
        const group = new THREE.Group();

        // Create an inflated tetrahedron-like structure (triangular faces, volumetric feel)
        const geom = new THREE.TetrahedronGeometry(3.2, 0);
        const mat = new THREE.MeshPhysicalMaterial({
            color: data.color !== undefined ? data.color : 0xffdd00,
            metalness: 0.05,
            roughness: 0.6,
            transmission: 0.4,
            thickness: 0.8,
            transparent: true,
            opacity: 0.9,
            side: THREE.DoubleSide
        });

        const tetra = new THREE.Mesh(geom, mat);
        tetra.rotation.set(0.4, 0.7, 0.2);
        group.add(tetra);

        // Add a subtle wireframe overlay for triangular emphasis
        const wire = new THREE.Mesh(geom, new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.06 }));
        wire.scale.setScalar(1.01);
        group.add(wire);

        // Inner core glow to hint at vast scale
        const core = new THREE.Mesh(
            new THREE.SphereGeometry(1.0, 32, 32),
            new THREE.MeshBasicMaterial({ color: 0xffee88, transparent: true, opacity: 0.12, blending: THREE.AdditiveBlending })
        );
        group.add(core);

        group.userData = { speed: 0.002 };
        return group;
    }

    static createDodecahedron(data) {
        const group = new THREE.Group();

        // Large dodecahedron body to represent pentagonal faces and volumetric presence
        const size = 4.2;
        const geom = new THREE.DodecahedronGeometry(size, 0);
        const mat = new THREE.MeshPhysicalMaterial({
            color: data.color !== undefined ? data.color : 0xff8855,
            metalness: 0.08,
            roughness: 0.5,
            transmission: 0.45,
            thickness: 1.0,
            transparent: true,
            opacity: 0.92,
            side: THREE.DoubleSide
        });

        const dode = new THREE.Mesh(geom, mat);
        dode.rotation.set(0.2, 0.5, 0.1);
        group.add(dode);

        // Emphasize pentagonal edges with subtle wireframe overlay
        const edge = new THREE.Mesh(geom, new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.06 }));
        edge.scale.setScalar(1.01);
        group.add(edge);

        // Soft interior core glow
        const core = new THREE.Mesh(
            new THREE.SphereGeometry(size * 0.5, 32, 32),
            new THREE.MeshBasicMaterial({ color: 0xffcc88, transparent: true, opacity: 0.12, blending: THREE.AdditiveBlending })
        );
        group.add(core);

        // Slow rotation to suggest colossal scale
        group.userData = { speed: 0.0009 };
        return group;
    }

    static createIcosidodecahedron(data) {
        const group = new THREE.Group();

        // Approximate an icosidodecahedron look by combining icosa and dodeca shapes with subtle offsets.
        const size = 5.6;
        const baseColor = data.color !== undefined ? new THREE.Color(data.color) : new THREE.Color(0xff66cc);

        // Solid blended shell (dodeca-like)
        const dodeGeom = new THREE.DodecahedronGeometry(size * 0.9, 0);
        const dodeMat = new THREE.MeshPhysicalMaterial({
            color: baseColor,
            metalness: 0.08,
            roughness: 0.45,
            transmission: 0.45,
            thickness: 0.9,
            transparent: true,
            opacity: 0.9,
            side: THREE.DoubleSide
        });
        const dode = new THREE.Mesh(dodeGeom, dodeMat);
        dode.rotation.set(0.2, 0.5, 0.15);
        dode.scale.setScalar(1.02);
        group.add(dode);

        // Overlay with an icosahedral wireframe to hint at the mixed-polyhedron structure
        const icoGeom = new THREE.IcosahedronGeometry(size, 0);
        const icoWire = new THREE.Mesh(icoGeom, new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.08 }));
        icoWire.scale.setScalar(0.995);
        icoWire.rotation.set(-0.15, 0.25, -0.1);
        group.add(icoWire);

        // Add accent pentagonal edge highlights using slightly inset edges
        const edgeGeom = dodeGeom.clone();
        const edgeMat = new THREE.MeshBasicMaterial({ color: baseColor.clone().offsetHSL(0, 0, -0.15), wireframe: true, transparent: true, opacity: 0.06 });
        const edgeMesh = new THREE.Mesh(edgeGeom, edgeMat);
        edgeMesh.scale.setScalar(1.015);
        group.add(edgeMesh);

        // Soft glowing core to suggest internal scale
        const core = new THREE.Mesh(
            new THREE.SphereGeometry(size * 0.45, 32, 32),
            new THREE.MeshBasicMaterial({ color: baseColor.clone().lerp(new THREE.Color(0xffee88), 0.4), transparent: true, opacity: 0.12, blending: THREE.AdditiveBlending })
        );
        group.add(core);

        // Very slow rotation to imply colossal size
        group.userData = { speed: 0.0005 };
        return group;
    }

    static createHexahedron(data) {
        const group = new THREE.Group();

        // Large cube body to represent a hexahedron / cubic megastructure
        const size = 5.0;
        const geom = new THREE.BoxGeometry(size, size, size, 6, 6, 6);
        const mat = new THREE.MeshPhysicalMaterial({
            color: data.color !== undefined ? data.color : 0x88ffcc,
            metalness: 0.06,
            roughness: 0.45,
            transmission: 0.5,
            thickness: 0.8,
            transparent: true,
            opacity: 0.92,
            side: THREE.DoubleSide
        });

        const cube = new THREE.Mesh(geom, mat);
        cube.rotation.set(0.15, 0.35, 0.05);
        group.add(cube);

        // Emphasize edges with a fine wireframe overlay
        const edge = new THREE.Mesh(geom, new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.06 }));
        edge.scale.setScalar(1.01);
        group.add(edge);

        // Interior glow to hint at vast internal structure
        const core = new THREE.Mesh(
            new THREE.SphereGeometry(size * 0.45, 32, 32),
            new THREE.MeshBasicMaterial({ color: 0xaaffdd, transparent: true, opacity: 0.12, blending: THREE.AdditiveBlending })
        );
        group.add(core);

        // Very slow rotation to suggest immense scale
        group.userData = { speed: 0.0006 };
        return group;
    }

    static createMandelbrot(data) {
        const group = new THREE.Group();

        // A single high-res plane with a Mandelbrot shader so you see a real fractal zoom
        const planeGeo = new THREE.PlaneGeometry(10, 6, 1, 1);
        const mat = new THREE.ShaderMaterial({
            uniforms: THREE.UniformsUtils.clone(MandelbrotShader.uniforms),
            vertexShader: MandelbrotShader.vertexShader,
            fragmentShader: MandelbrotShader.fragmentShader,
            transparent: false
        });

        const plane = new THREE.Mesh(planeGeo, mat);
        // Angle it slightly in space so it sits nicely in the 3D scene
        plane.rotation.y = 0.35;
        plane.rotation.x = -0.25;
        group.add(plane);

        // Soft halo behind the fractal for contrast
        const haloGeo = new THREE.PlaneGeometry(11.5, 7.0);
        const haloMat = new THREE.MeshBasicMaterial({
            color: data.color !== undefined ? data.color : 0x66ffcc,
            transparent: true,
            opacity: 0.15,
            side: THREE.DoubleSide
        });
        const halo = new THREE.Mesh(haloGeo, haloMat);
        halo.position.z = -0.05;
        halo.rotation.copy(plane.rotation);
        group.add(halo);

        // Mark for slow rotation and to let the global loop drive the shader's time uniform
        group.userData = { speed: 0.0004, type: 'mandelbrot' };
        return group;
    }

    static createInfinity(data) {
        const group = new THREE.Group();
        
        // TorusKnot(radius, tube, tubularSegments, radialSegments, p, q)
        // p=1, q=2 creates a figure-eight style loop
        const geometry = new THREE.TorusKnotGeometry(2, 0.4, 150, 20, 1, 2);
        const material = new THREE.MeshPhysicalMaterial({
            color: 0xffffff,
            metalness: 0.9,
            roughness: 0.1,
            emissive: 0x44aaff,
            emissiveIntensity: 0.5,
            transparent: true,
            opacity: 0.9,
            transmission: 0.5,
            thickness: 1
        });
        
        const mesh = new THREE.Mesh(geometry, material);
        mesh.rotation.x = Math.PI / 2; // Lie it flat so it looks like ∞
        group.add(mesh);

        // Add a pulsing glow
        const glow = new THREE.Mesh(
            geometry,
            new THREE.MeshBasicMaterial({ color: 0x00ffff, wireframe: true, transparent: true, opacity: 0.2 })
        );
        glow.rotation.x = Math.PI / 2;
        glow.scale.setScalar(1.1);
        group.add(glow);

        group.userData = { speed: 0.02 };
        return group;
    }

    static createMetaverse(data) {
        const group = new THREE.Group();

        // Central looping ring to suggest layered, connected topology
        const ringGeom = new THREE.TorusGeometry(3.5, 0.25, 64, 256);
        const ringMat = new THREE.MeshPhysicalMaterial({
            color: data.color !== undefined ? data.color : 0x00ffee,
            metalness: 0.2,
            roughness: 0.2,
            transmission: 0.6,
            thickness: 0.6,
            transparent: true,
            opacity: 0.9,
            side: THREE.DoubleSide,
            emissive: new THREE.Color(data.color || 0x00ffee).multiplyScalar(0.15),
            emissiveIntensity: 0.4
        });
        const ring = new THREE.Mesh(ringGeom, ringMat);
        ring.rotation.set(0.45, 0.25, 0.0);
        group.add(ring);

        // Layered fractal-like point clouds wrapped around the ring
        const layers = 4;
        for (let i = 0; i < layers; i++) {
            const pts = new THREE.BufferGeometry();
            const count = 6000 / (i + 1);
            const positions = new Float32Array(count * 3);
            const colors = new Float32Array(count * 3);
            for (let j = 0; j < count; j++) {
                const a = Math.random() * Math.PI * 2;
                const r = 3.5 + (i * 0.5) + (Math.random() - 0.5) * 0.6;
                const z = (Math.random() - 0.5) * 0.6;
                positions[j * 3] = Math.cos(a) * r;
                positions[j * 3 + 1] = Math.sin(a) * r;
                positions[j * 3 + 2] = z * (1 + i * 0.25);
                const c = new THREE.Color(data.color || 0x00ffee).lerp(new THREE.Color(0x002244), Math.random() * 0.6);
                colors[j * 3] = c.r; colors[j * 3 + 1] = c.g; colors[j * 3 + 2] = c.b;
            }
            pts.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            pts.setAttribute('color', new THREE.BufferAttribute(colors, 3));
            const pMat = new THREE.PointsMaterial({ size: 0.03 * (1.0 - i * 0.12), vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0.85 - i * 0.12 });
            const points = new THREE.Points(pts, pMat);
            points.rotation.z = i * 0.1;
            group.add(points);
        }

        // Inner core pulses
        const core = new THREE.Mesh(new THREE.SphereGeometry(0.8, 32, 32), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.12, blending: THREE.AdditiveBlending }));
        group.add(core);

        // subtle wire overlay for topology hints
        const wire = new THREE.Mesh(new THREE.TorusGeometry(3.5, 0.02, 8, 200), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.06 }));
        wire.rotation.set(0.45, 0.25, 0.0);
        group.add(wire);

        group.userData = { speed: 0.0003, type: 'metaverse' };
        return group;
    }

    static createMegaverse(data) {
        const group = new THREE.Group();

        // Giant nested rings to convey scale and hierarchy
        const ringCount = 3;
        for (let r = 0; r < ringCount; r++) {
            const outer = (4.5 + r * 2.5) * (1 + r * 0.4);
            const tube = 0.35 + r * 0.08;
            const ringGeom = new THREE.TorusGeometry(outer, tube, 32, 256);
            const ringMat = new THREE.MeshPhysicalMaterial({
                color: data.color !== undefined ? data.color : 0xff11dd,
                metalness: 0.12,
                roughness: 0.25,
                transmission: 0.55,
                thickness: 0.6,
                transparent: true,
                opacity: 0.88 - r * 0.12,
                side: THREE.DoubleSide,
                emissive: new THREE.Color(data.color || 0xff11dd).multiplyScalar(0.12),
                emissiveIntensity: 0.35
            });
            const ringMesh = new THREE.Mesh(ringGeom, ringMat);
            ringMesh.rotation.set(0.4 + r * 0.07, 0.2 + r * 0.06, r * 0.05);
            group.add(ringMesh);

            // Surround each ring with a broad, soft point cloud layer
            const pts = new THREE.BufferGeometry();
            const count = 9000 / (r + 1);
            const positions = new Float32Array(count * 3);
            const colors = new Float32Array(count * 3);
            for (let i = 0; i < count; i++) {
                const a = Math.random() * Math.PI * 2;
                const radius = outer + (Math.random() - 0.5) * (0.6 + r * 0.35);
                const h = (Math.random() - 0.5) * (0.8 + r * 0.3);
                positions[i * 3] = Math.cos(a) * radius;
                positions[i * 3 + 1] = Math.sin(a) * radius;
                positions[i * 3 + 2] = h;
                const c = new THREE.Color(data.color || 0xff11dd).lerp(new THREE.Color(0x001122), Math.random() * 0.6);
                colors[i * 3] = c.r; colors[i * 3 + 1] = c.g; colors[i * 3 + 2] = c.b;
            }
            pts.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            pts.setAttribute('color', new THREE.BufferAttribute(colors, 3));
            const pMat = new THREE.PointsMaterial({ size: 0.035 * (1.0 - r * 0.08), vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0.9 - r * 0.15 });
            const points = new THREE.Points(pts, pMat);
            points.rotation.z = r * 0.12;
            group.add(points);
        }

        // A large faint cubic lattice to suggest layered connectivity
        const latticeSize = 12;
        const lattice = new THREE.Mesh(
            new THREE.BoxGeometry(latticeSize, latticeSize, latticeSize, 6, 6, 6),
            new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.03 })
        );
        lattice.rotation.set(0.2, 0.1, 0.05);
        group.add(lattice);

        // Central volumetric glow
        const core = new THREE.Mesh(new THREE.SphereGeometry(2.2, 32, 32), new THREE.MeshBasicMaterial({ color: 0xffbbee, transparent: true, opacity: 0.14, blending: THREE.AdditiveBlending }));
        group.add(core);

        group.userData = { speed: 0.0002, type: 'megaverse' };
        return group;
    }

    static createGigaverse(data) {
        const group = new THREE.Group();

        // Vast nested lattices and intersecting rings to imply even larger hierarchy
        const latticeSize = 22;
        const lattice = new THREE.Mesh(
            new THREE.BoxGeometry(latticeSize, latticeSize, latticeSize, 12, 12, 12),
            new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.02 })
        );
        lattice.rotation.set(0.25, 0.12, 0.06);
        group.add(lattice);

        // Multiple enormous toroidal rings at varied scales for depth cues
        const ringColors = [data.color || 0xffee66, 0xffcc88, 0xff99cc];
        for (let i = 0; i < 4; i++) {
            const outer = 8 + i * 6;
            const ringGeom = new THREE.TorusGeometry(outer, 0.6 + i * 0.12, 24, 256);
            const ringMat = new THREE.MeshPhysicalMaterial({
                color: ringColors[i % ringColors.length],
                metalness: 0.08,
                roughness: 0.3,
                transmission: 0.6,
                thickness: 0.8,
                transparent: true,
                opacity: 0.9 - i * 0.12,
                side: THREE.DoubleSide,
                emissive: new THREE.Color(ringColors[i % ringColors.length]).multiplyScalar(0.08),
                emissiveIntensity: 0.3
            });
            const ring = new THREE.Mesh(ringGeom, ringMat);
            ring.rotation.set(0.4 + i * 0.05, 0.2 + i * 0.03, i * 0.03);
            group.add(ring);

            // Add a massive soft point cloud surrounding each ring to suggest populated structure
            const pts = new THREE.BufferGeometry();
            const count = 18000 / (i + 1);
            const positions = new Float32Array(count * 3);
            const colors = new Float32Array(count * 3);
            for (let j = 0; j < count; j++) {
                const a = Math.random() * Math.PI * 2;
                const radius = outer + (Math.random() - 0.5) * (1.2 + i * 0.6);
                const h = (Math.random() - 0.5) * (1.4 + i * 0.4);
                positions[j * 3] = Math.cos(a) * radius;
                positions[j * 3 + 1] = Math.sin(a) * radius;
                positions[j * 3 + 2] = h;
                const c = new THREE.Color(data.color || 0xffee66).lerp(new THREE.Color(0x001122), Math.random() * 0.6);
                colors[j * 3] = c.r; colors[j * 3 + 1] = c.g; colors[j * 3 + 2] = c.b;
            }
            pts.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            pts.setAttribute('color', new THREE.BufferAttribute(colors, 3));
            const pMat = new THREE.PointsMaterial({ size: 0.05 * (1.0 - i * 0.06), vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0.9 - i * 0.12 });
            const points = new THREE.Points(pts, pMat);
            points.rotation.z = i * 0.08;
            group.add(points);
        }

        // Spread a few massive volumetric shells for a softer background
        for (let s = 0; s < 2; s++) {
            const shell = new THREE.Mesh(
                new THREE.SphereGeometry(12 - s * 2.5, 64, 64),
                new THREE.MeshBasicMaterial({ color: new THREE.Color(data.color || 0xffee66), transparent: true, opacity: 0.06 - s * 0.02, side: THREE.BackSide, blending: THREE.AdditiveBlending })
            );
            group.add(shell);
        }

        // Subtle slow rotation and userData marker
        group.userData = { speed: 0.00008, type: 'gigaverse' };
        return group;
    }

    static createTeraverse(data) {
        const group = new THREE.Group();

        // Epic nested lattice hinting at near-mathematical scale
        const latticeSize = 42;
        const lattice = new THREE.Mesh(
            new THREE.BoxGeometry(latticeSize, latticeSize, latticeSize, 20, 20, 20),
            new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.015 })
        );
        lattice.rotation.set(0.28, 0.14, 0.07);
        group.add(lattice);

        // Multiple enormous translucent shells for depth and scale cues
        for (let s = 0; s < 3; s++) {
            const shell = new THREE.Mesh(
                new THREE.SphereGeometry(18 - s * 3.5, 64, 64),
                new THREE.MeshBasicMaterial({
                    color: new THREE.Color(data.color || 0xffdd88),
                    transparent: true,
                    opacity: 0.055 - s * 0.01,
                    side: THREE.BackSide,
                    blending: THREE.AdditiveBlending
                })
            );
            group.add(shell);
        }

        // Towering ring arrays that weave through the lattice
        for (let i = 0; i < 6; i++) {
            const outer = 12 + i * 4;
            const ringGeom = new THREE.TorusGeometry(outer, 1.1 + i * 0.08, 16, 256);
            const ringMat = new THREE.MeshPhysicalMaterial({
                color: new THREE.Color(data.color || 0xffdd88).lerp(new THREE.Color(0x001122), i * 0.06),
                metalness: 0.06,
                roughness: 0.35,
                transmission: 0.6,
                thickness: 0.9,
                transparent: true,
                opacity: 0.88 - i * 0.08,
                side: THREE.DoubleSide,
                emissive: new THREE.Color(data.color || 0xffdd88).multiplyScalar(0.06),
                emissiveIntensity: 0.22
            });
            const ring = new THREE.Mesh(ringGeom, ringMat);
            ring.rotation.set(0.35 + i * 0.02, 0.18 + i * 0.01, i * 0.02);
            group.add(ring);
        }

        // Soft cloud layers of points to suggest population and complexity
        for (let layer = 0; layer < 4; layer++) {
            const pts = new THREE.BufferGeometry();
            const count = 22000 / (layer + 1);
            const positions = new Float32Array(count * 3);
            const colors = new Float32Array(count * 3);
            for (let j = 0; j < count; j++) {
                const a = Math.random() * Math.PI * 2;
                const radius = 6 + layer * 4 + (Math.random() - 0.5) * 3.0;
                const h = (Math.random() - 0.5) * (2.0 + layer * 0.8);
                positions[j * 3] = Math.cos(a) * radius;
                positions[j * 3 + 1] = Math.sin(a) * radius;
                positions[j * 3 + 2] = h;
                const c = new THREE.Color(data.color || 0xffdd88).lerp(new THREE.Color(0x001122), Math.random() * 0.6);
                colors[j * 3] = c.r; colors[j * 3 + 1] = c.g; colors[j * 3 + 2] = c.b;
            }
            pts.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            pts.setAttribute('color', new THREE.BufferAttribute(colors, 3));
            const pMat = new THREE.PointsMaterial({ size: 0.06 * (1.0 - layer * 0.08), vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0.9 - layer * 0.18 });
            const points = new THREE.Points(pts, pMat);
            points.rotation.z = layer * 0.06;
            group.add(points);
        }

        // Subtle slow motion and type marker
        group.userData = { speed: 0.00005, type: 'teraverse' };
        return group;
    }

    static createZettaverse(data) {
        const group = new THREE.Group();

        // Monumental lattice scaled up to suggest an even larger hierarchical domain
        const latticeSize = 88;
        const lattice = new THREE.Mesh(
            new THREE.BoxGeometry(latticeSize, latticeSize, latticeSize, 32, 32, 32),
            new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.012 })
        );
        lattice.rotation.set(0.30, 0.16, 0.08);
        group.add(lattice);

        // Broad translucent shells for depth and a diffuse backdrop
        for (let s = 0; s < 4; s++) {
            const shell = new THREE.Mesh(
                new THREE.SphereGeometry(40 - s * 6.5, 64, 64),
                new THREE.MeshBasicMaterial({
                    color: new THREE.Color(data.color || 0xff77cc),
                    transparent: true,
                    opacity: 0.045 - s * 0.008,
                    side: THREE.BackSide,
                    blending: THREE.AdditiveBlending
                })
            );
            group.add(shell);
        }

        // Expansive ring arrays that thread through the lattice at grand scale
        for (let i = 0; i < 10; i++) {
            const outer = 24 + i * 6;
            const ringGeom = new THREE.TorusGeometry(outer, 1.8 + i * 0.12, 16, 256);
            const ringMat = new THREE.MeshPhysicalMaterial({
                color: new THREE.Color(data.color || 0xff77cc).lerp(new THREE.Color(0x001122), i * 0.03),
                metalness: 0.06,
                roughness: 0.38,
                transmission: 0.6,
                thickness: 1.0,
                transparent: true,
                opacity: 0.86 - i * 0.06,
                side: THREE.DoubleSide,
                emissive: new THREE.Color(data.color || 0xff77cc).multiplyScalar(0.05),
                emissiveIntensity: 0.18
            });
            const ring = new THREE.Mesh(ringGeom, ringMat);
            ring.rotation.set(0.33 + i * 0.01, 0.16 + i * 0.005, i * 0.01);
            group.add(ring);
        }

        // Dense soft point-cloud layers to suggest population and diffuse structure
        for (let layer = 0; layer < 5; layer++) {
            const pts = new THREE.BufferGeometry();
            const count = 32000 / (layer + 1);
            const positions = new Float32Array(count * 3);
            const colors = new Float32Array(count * 3);
            for (let j = 0; j < count; j++) {
                const a = Math.random() * Math.PI * 2;
                const radius = 10 + layer * 8 + (Math.random() - 0.5) * (4.0 + layer * 1.2);
                const h = (Math.random() - 0.5) * (4.0 + layer * 1.5);
                positions[j * 3] = Math.cos(a) * radius;
                positions[j * 3 + 1] = Math.sin(a) * radius;
                positions[j * 3 + 2] = h;
                const c = new THREE.Color(data.color || 0xff77cc).lerp(new THREE.Color(0x001122), Math.random() * 0.6);
                colors[j * 3] = c.r; colors[j * 3 + 1] = c.g; colors[j * 3 + 2] = c.b;
            }
            pts.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            pts.setAttribute('color', new THREE.BufferAttribute(colors, 3));
            const pMat = new THREE.PointsMaterial({ size: 0.08 * (1.0 - layer * 0.06), vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0.9 - layer * 0.14 });
            const points = new THREE.Points(pts, pMat);
            points.rotation.z = layer * 0.04;
            group.add(points);
        }

        // Central diffuse glow
        const core = new THREE.Mesh(new THREE.SphereGeometry(6.0, 32, 32), new THREE.MeshBasicMaterial({ color: 0xff99dd, transparent: true, opacity: 0.12, blending: THREE.AdditiveBlending }));
        group.add(core);

        group.userData = { speed: 0.00003, type: 'zettaverse' };
        return group;
    }

    static createYottaverse(data) {
        // Colossal, ultra-architectural composition to represent 10^67.3 meters
        const group = new THREE.Group();

        // Extremely large lattice to imply unimaginable scale
        const latticeSize = 220;
        const lattice = new THREE.Mesh(
            new THREE.BoxGeometry(latticeSize, latticeSize, latticeSize, 48, 48, 48),
            new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.008 })
        );
        lattice.rotation.set(0.32, 0.18, 0.09);
        group.add(lattice);

        // Monumental shells for depth
        for (let s = 0; s < 5; s++) {
            const shell = new THREE.Mesh(
                new THREE.SphereGeometry(80 - s * 10, 64, 64),
                new THREE.MeshBasicMaterial({
                    color: new THREE.Color(data.color || 0xff99ee),
                    transparent: true,
                    opacity: 0.035 - s * 0.005,
                    side: THREE.BackSide,
                    blending: THREE.AdditiveBlending
                })
            );
            group.add(shell);
        }

        // Vast arrays of rings and frames to suggest hierarchical connectivity
        for (let i = 0; i < 14; i++) {
            const outer = 40 + i * 10;
            const ringGeom = new THREE.TorusGeometry(outer, 3.0 + i * 0.06, 12, 256);
            const ringMat = new THREE.MeshPhysicalMaterial({
                color: new THREE.Color(data.color || 0xff99ee).lerp(new THREE.Color(0x001122), i * 0.02),
                metalness: 0.05,
                roughness: 0.4,
                transmission: 0.6,
                thickness: 1.2,
                transparent: true,
                opacity: 0.9 - i * 0.05,
                side: THREE.DoubleSide,
                emissive: new THREE.Color(data.color || 0xff99ee).multiplyScalar(0.04),
                emissiveIntensity: 0.12
            });
            const ring = new THREE.Mesh(ringGeom, ringMat);
            ring.rotation.set(0.34 + i * 0.005, 0.16 + i * 0.003, i * 0.008);
            group.add(ring);
        }

        // Dense, soft point-cloud strata to suggest population and depth
        for (let layer = 0; layer < 6; layer++) {
            const pts = new THREE.BufferGeometry();
            const count = 48000 / (layer + 1);
            const positions = new Float32Array(count * 3);
            const colors = new Float32Array(count * 3);
            for (let j = 0; j < count; j++) {
                const a = Math.random() * Math.PI * 2;
                const radius = 20 + layer * 12 + (Math.random() - 0.5) * (8.0 + layer * 2.0);
                const h = (Math.random() - 0.5) * (8.0 + layer * 2.5);
                positions[j * 3] = Math.cos(a) * radius;
                positions[j * 3 + 1] = Math.sin(a) * radius;
                positions[j * 3 + 2] = h;
                const c = new THREE.Color(data.color || 0xff99ee).lerp(new THREE.Color(0x001122), Math.random() * 0.6);
                colors[j * 3] = c.r; colors[j * 3 + 1] = c.g; colors[j * 3 + 2] = c.b;
            }
            pts.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            pts.setAttribute('color', new THREE.BufferAttribute(colors, 3));
            const pMat = new THREE.PointsMaterial({ size: 0.1 * (1.0 - layer * 0.06), vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0.92 - layer * 0.14 });
            const points = new THREE.Points(pts, pMat);
            points.rotation.z = layer * 0.03;
            group.add(points);
        }

        // Central diffuse core glow to anchor the structure
        const core = new THREE.Mesh(new THREE.SphereGeometry(12.0, 32, 32), new THREE.MeshBasicMaterial({ color: 0xffccff, transparent: true, opacity: 0.08, blending: THREE.AdditiveBlending }));
        group.add(core);

        group.userData = { speed: 0.00001, type: 'yottaverse' };
        return group;
    }

    static createHyperverse(data) {
        // Ultra-colossal composition to represent 10^71.3 meters
        const group = new THREE.Group();

        // Massive lattice to imply near-cosmic architecture
        const latticeSize = 520;
        const lattice = new THREE.Mesh(
            new THREE.BoxGeometry(latticeSize, latticeSize, latticeSize, 72, 72, 72),
            new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.006 })
        );
        lattice.rotation.set(0.34, 0.19, 0.095);
        group.add(lattice);

        // Monumental concentric shells for layered depth
        for (let s = 0; s < 6; s++) {
            const shell = new THREE.Mesh(
                new THREE.SphereGeometry(180 - s * 18, 64, 64),
                new THREE.MeshBasicMaterial({
                    color: new THREE.Color(data.color || 0xffccff),
                    transparent: true,
                    opacity: 0.030 - s * 0.004,
                    side: THREE.BackSide,
                    blending: THREE.AdditiveBlending
                })
            );
            group.add(shell);
        }

        // Vast arrays of oversized rings and frames to accent scale
        for (let i = 0; i < 18; i++) {
            const outer = 60 + i * 22;
            const ringGeom = new THREE.TorusGeometry(outer, 6.0 + i * 0.12, 12, 256);
            const ringMat = new THREE.MeshPhysicalMaterial({
                color: new THREE.Color(data.color || 0xffccff).lerp(new THREE.Color(0x001122), i * 0.01),
                metalness: 0.04,
                roughness: 0.45,
                transmission: 0.6,
                thickness: 1.6,
                transparent: true,
                opacity: 0.9 - i * 0.03,
                side: THREE.DoubleSide,
                emissive: new THREE.Color(data.color || 0xffccff).multiplyScalar(0.03),
                emissiveIntensity: 0.10
            });
            const ring = new THREE.Mesh(ringGeom, ringMat);
            ring.rotation.set(0.30 + i * 0.004, 0.14 + i * 0.002, i * 0.006);
            group.add(ring);
        }

        // Extremely large soft point-cloud strata to give volumetric presence
        for (let layer = 0; layer < 7; layer++) {
            const pts = new THREE.BufferGeometry();
            const count = 64000 / (layer + 1);
            const positions = new Float32Array(count * 3);
            const colors = new Float32Array(count * 3);
            for (let j = 0; j < count; j++) {
                const a = Math.random() * Math.PI * 2;
                const radius = 40 + layer * 28 + (Math.random() - 0.5) * (20.0 + layer * 4.0);
                const h = (Math.random() - 0.5) * (16.0 + layer * 4.5);
                positions[j * 3] = Math.cos(a) * radius;
                positions[j * 3 + 1] = Math.sin(a) * radius;
                positions[j * 3 + 2] = h;
                const c = new THREE.Color(data.color || 0xffccff).lerp(new THREE.Color(0x001122), Math.random() * 0.6);
                colors[j * 3] = c.r; colors[j * 3 + 1] = c.g; colors[j * 3 + 2] = c.b;
            }
            pts.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            pts.setAttribute('color', new THREE.BufferAttribute(colors, 3));
            const pMat = new THREE.PointsMaterial({ size: 0.14 * (1.0 - layer * 0.04), vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0.92 - layer * 0.12 });
            const points = new THREE.Points(pts, pMat);
            points.rotation.z = layer * 0.025;
            group.add(points);
        }

        // Central anchor glow
        const core = new THREE.Mesh(new THREE.SphereGeometry(28.0, 32, 32), new THREE.MeshBasicMaterial({ color: 0xffeefe, transparent: true, opacity: 0.09, blending: THREE.AdditiveBlending }));
        group.add(core);

        group.userData = { speed: 0.000006, type: 'hyperverse' };
        return group;
    }

    static createOmniverse(data) {
        // Colossal, final-tier composition to represent 10^75.3 meters
        const group = new THREE.Group();

        // Extremely large, faint lattice to imply ultimate architectural scale
        const latticeSize = 1200;
        const lattice = new THREE.Mesh(
            new THREE.BoxGeometry(latticeSize, latticeSize, latticeSize, 120, 120, 120),
            new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.004 })
        );
        lattice.rotation.set(0.36, 0.21, 0.11);
        group.add(lattice);

        // Monumental concentric megashells for layered depth
        for (let s = 0; s < 8; s++) {
            const shell = new THREE.Mesh(
                new THREE.SphereGeometry(420 - s * 40, 64, 64),
                new THREE.MeshBasicMaterial({
                    color: new THREE.Color(data.color || 0xffeebb),
                    transparent: true,
                    opacity: 0.025 - s * 0.003,
                    side: THREE.BackSide,
                    blending: THREE.AdditiveBlending
                })
            );
            group.add(shell);
        }

        // Vast hierarchies of oversized rings and frames to accent extreme scale
        for (let i = 0; i < 24; i++) {
            const outer = 200 + i * 40;
            const ringGeom = new THREE.TorusGeometry(outer, 12.0 + i * 0.5, 12, 128);
            const ringMat = new THREE.MeshPhysicalMaterial({
                color: new THREE.Color(data.color || 0xffeebb).lerp(new THREE.Color(0x001122), i * 0.005),
                metalness: 0.03,
                roughness: 0.5,
                transmission: 0.6,
                thickness: 2.0,
                transparent: true,
                opacity: 0.92 - i * 0.02,
                side: THREE.DoubleSide,
                emissive: new THREE.Color(data.color || 0xffeebb).multiplyScalar(0.02),
                emissiveIntensity: 0.06
            });
            const ring = new THREE.Mesh(ringGeom, ringMat);
            ring.rotation.set(0.28 + i * 0.002, 0.12 + i * 0.0015, i * 0.004);
            group.add(ring);
        }

        // Massive soft point-cloud strata to give volumetric presence at extreme scale
        for (let layer = 0; layer < 8; layer++) {
            const pts = new THREE.BufferGeometry();
            const count = 96000 / (layer + 1);
            const positions = new Float32Array(count * 3);
            const colors = new Float32Array(count * 3);
            for (let j = 0; j < count; j++) {
                const a = Math.random() * Math.PI * 2;
                const radius = 80 + layer * 60 + (Math.random() - 0.5) * (40.0 + layer * 6.0);
                const h = (Math.random() - 0.5) * (32.0 + layer * 8.0);
                positions[j * 3] = Math.cos(a) * radius;
                positions[j * 3 + 1] = Math.sin(a) * radius;
                positions[j * 3 + 2] = h;
                const c = new THREE.Color(data.color || 0xffeebb).lerp(new THREE.Color(0x001122), Math.random() * 0.6);
                colors[j * 3] = c.r; colors[j * 3 + 1] = c.g; colors[j * 3 + 2] = c.b;
            }
            pts.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            pts.setAttribute('color', new THREE.BufferAttribute(colors, 3));
            const pMat = new THREE.PointsMaterial({ size: 0.18 * (1.0 - layer * 0.03), vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, opacity: 0.9 - layer * 0.10 });
            const points = new THREE.Points(pts, pMat);
            points.rotation.z = layer * 0.02;
            group.add(points);
        }

        // Central diffuse megacore glow to anchor the structure
        const core = new THREE.Mesh(new THREE.SphereGeometry(60.0, 32, 32), new THREE.MeshBasicMaterial({ color: 0xfff7e6, transparent: true, opacity: 0.07, blending: THREE.AdditiveBlending }));
        group.add(core);

        group.userData = { speed: 0.000003, type: 'omniverse' };
        return group;
    }

    static createHypergrid(data) {
        const group = new THREE.Group();
        const size = 10;
        const gridHelper = new THREE.GridHelper(size, 20, 0x00ffff, 0x444444);
        gridHelper.material.transparent = true;
        gridHelper.material.opacity = 0.3;
        group.add(gridHelper);

        const gridHelper2 = gridHelper.clone();
        gridHelper2.rotation.x = Math.PI / 2;
        group.add(gridHelper2);

        const gridHelper3 = gridHelper.clone();
        gridHelper3.rotation.z = Math.PI / 2;
        group.add(gridHelper3);

        const core = new THREE.Mesh(
            new THREE.SphereGeometry(0.5, 32, 32),
            new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.8, blending: THREE.AdditiveBlending })
        );
        group.add(core);
        group.userData = { speed: 0.005 };
        return group;
    }

    static createHeaven(data) {
        const group = new THREE.Group();
        const baseColor = new THREE.Color(data.color || 0xfff9e6);

        // Core Golden Radiance - Significantly enlarged
        const coreGeo = new THREE.SphereGeometry(25, 64, 64);
        const coreMat = new THREE.MeshBasicMaterial({
            color: baseColor,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });
        const core = new THREE.Mesh(coreGeo, coreMat);
        group.add(core);

        // Volumetric Glow Shells - Massive reach
        for (let i = 0; i < 8; i++) {
            const shellGeo = new THREE.SphereGeometry(30 + i * 15, 32, 32);
            const shellMat = new THREE.MeshBasicMaterial({
                color: baseColor,
                transparent: true,
                opacity: 0.2 - i * 0.02,
                side: THREE.BackSide,
                blending: THREE.AdditiveBlending
            });
            group.add(new THREE.Mesh(shellGeo, shellMat));
        }

        // Divine Rays - Much longer and more numerous
        const rayGeo = new THREE.CylinderGeometry(0, 2, 250, 8);
        const rayMat = new THREE.MeshBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.15,
            blending: THREE.AdditiveBlending
        });
        for (let i = 0; i < 24; i++) {
            const ray = new THREE.Mesh(rayGeo, rayMat);
            ray.rotation.x = Math.random() * Math.PI;
            ray.rotation.z = Math.random() * Math.PI;
            ray.position.setFromSphericalCoords(15, Math.random() * Math.PI, Math.random() * Math.PI * 2);
            group.add(ray);
        }

        // Ethereal "Spirit" Particles - Larger volume
        const pts = new THREE.BufferGeometry();
        const count = 5000;
        const positions = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            const r = 25 + Math.random() * 120;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            positions[i * 3 + 2] = r * Math.cos(phi);
        }
        pts.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const pMat = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.05,
            transparent: true,
            opacity: 0.6,
            blending: THREE.AdditiveBlending
        });
        group.add(new THREE.Points(pts, pMat));

        group.userData = { speed: 0.002 };
        return group;
    }

    static createCrystal(data) {
        const group = new THREE.Group();
        const geometry = new THREE.OctahedronGeometry(4, 0);
        const material = new THREE.MeshPhysicalMaterial({
            color: data.color || 0xffffff,
            metalness: 0.1,
            roughness: 0.1,
            transmission: 0.9,
            thickness: 2,
            transparent: true,
            opacity: 0.8
        });
        const mesh = new THREE.Mesh(geometry, material);
        group.add(mesh);

        const inner = new THREE.Mesh(
            new THREE.OctahedronGeometry(2, 0),
            new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.5 })
        );
        group.add(inner);
        group.userData = { speed: 0.01 };
        return group;
    }

    static createMultiverse(data) {
        const group = new THREE.Group();
        const universeCount = 28;
        const colors = [0xff00ff, 0x00ffff, 0xffff00, 0x00ffaa, 0xffaa00, 0x8844ff, 0xffffff, 0x44ff88];

        for (let i = 0; i < universeCount; i++) {
            const universeGroup = new THREE.Group();
            const uSize = 1.0 + Math.pow(Math.random(), 2.0) * 2.5;
            const uColor = new THREE.Color(colors[i % colors.length]);

            const bubble = new THREE.Mesh(
                new THREE.SphereGeometry(uSize, 48, 48),
                new THREE.ShaderMaterial({
                    vertexShader: MultiverseBubbleShader.vertexShader,
                    fragmentShader: MultiverseBubbleShader.fragmentShader,
                    transparent: true, depthWrite: false,
                    uniforms: {
                        time: { value: Math.random() * 100 },
                        glowColor: { value: uColor }
                    }
                })
            );
            
            const contents = new THREE.Group();
            contents.add(new THREE.Mesh(
                new THREE.SphereGeometry(uSize * 0.3, 16, 16),
                new THREE.MeshBasicMaterial({ color: uColor, transparent: true, opacity: 0.3 })
            ));

            const clusterCount = 10;
            const clusterGeo = new THREE.BufferGeometry();
            const clusterPos = new Float32Array(clusterCount * 3);
            for(let j=0; j<clusterCount; j++) {
                const r = Math.random() * uSize * 0.8;
                const t = Math.random() * Math.PI * 2;
                const p = Math.acos(2 * Math.random() - 1);
                clusterPos[j*3] = r * Math.sin(p) * Math.cos(t);
                clusterPos[j*3+1] = r * Math.sin(p) * Math.sin(t);
                clusterPos[j*3+2] = r * Math.cos(p);
            }
            clusterGeo.setAttribute('position', new THREE.BufferAttribute(clusterPos, 3));
            contents.add(new THREE.Points(clusterGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.05, transparent: true })));
            
            universeGroup.add(bubble);
            universeGroup.add(contents);

            const r = 5.0 + Math.random() * 10.0;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            
            universeGroup.position.set(
                r * Math.sin(phi) * Math.cos(theta),
                r * Math.sin(phi) * Math.sin(theta),
                r * Math.cos(phi)
            );
            
            universeGroup.userData = { 
                speed: (Math.random() - 0.5) * 0.005,
                drift: new THREE.Vector3((Math.random() - 0.5) * 0.002, (Math.random() - 0.5) * 0.002, (Math.random() - 0.5) * 0.002),
                rotAxis: new THREE.Vector3(Math.random(), Math.random(), Math.random()).normalize(),
                rotSpeed: (Math.random() - 0.5) * 0.01,
                isUniverseBubble: true,
                targetUniverseId: (i % 2) + 1 // Cycles through glitch and ethereal
            };
            group.add(universeGroup);
        }

        return group;
    }
}