import * as THREE from 'three';
import { StringShader, FoamShader } from './SubatomicShaders.js';

export class SubatomicFactory {
    static createStrings(data) {
        const group = new THREE.Group();
        const count = 12;
        // Finer geometry for more delicate strings
        const stringGeo = new THREE.CylinderGeometry(0.003, 0.003, 2.5, 6, 64);
        stringGeo.rotateZ(Math.PI / 2);
        
        for (let i = 0; i < count; i++) {
            const mat = new THREE.ShaderMaterial({
                uniforms: {
                    time: { value: Math.random() * 500 },
                    color: { value: new THREE.Color(data.color).add(new THREE.Color(0x3300aa).multiplyScalar(Math.random())) }
                },
                vertexShader: StringShader.vertexShader,
                fragmentShader: StringShader.fragmentShader,
                transparent: true,
                side: THREE.DoubleSide,
                blending: THREE.AdditiveBlending,
                depthWrite: false
            });
            const mesh = new THREE.Mesh(stringGeo, mat);
            mesh.rotation.x = Math.random() * Math.PI;
            mesh.rotation.y = Math.random() * Math.PI;
            mesh.rotation.z = Math.random() * Math.PI;
            // Slightly offset start positions for a more bundled look
            mesh.position.set(
                (Math.random() - 0.5) * 0.1,
                (Math.random() - 0.5) * 0.1,
                (Math.random() - 0.5) * 0.1
            );
            group.add(mesh);
        }
        return group;
    }

    static createParticleSystem(data, mat) {
        const mesh = new THREE.Group();
        const qCount = data.name === "Quark" ? 3 : 1;
        const color = new THREE.Color(data.color);
        
        for(let i=0; i<qCount; i++) {
            const qGroup = new THREE.Group();
            const core = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 16), new THREE.MeshBasicMaterial({ color: color }));
            qGroup.add(core);

            const glow = new THREE.Mesh(
                new THREE.SphereGeometry(0.4, 16, 16),
                new THREE.MeshBasicMaterial({ color: color, transparent: true, opacity: 0.3, blending: THREE.AdditiveBlending })
            );
            qGroup.add(glow);

            const qPivot = new THREE.Group();
            qGroup.position.x = qCount > 1 ? 0.4 : 0;
            qPivot.rotation.y = (i / qCount) * Math.PI * 2;
            qPivot.rotation.x = Math.random();
            qPivot.add(qGroup);
            qPivot.userData = { speed: 0.05 + Math.random() * 0.05 };
            mesh.add(qPivot);
        }
        return mesh;
    }

    static createAtom(data, mat) {
        const mesh = new THREE.Group();
        // Nucleus - cluster of protons/neutrons for better look
        const nucGroup = new THREE.Group();
        for(let i=0; i<4; i++) {
            const ball = new THREE.Mesh(new THREE.SphereGeometry(0.15, 12, 12), mat);
            ball.position.set(Math.random()*0.1, Math.random()*0.1, Math.random()*0.1);
            nucGroup.add(ball);
        }
        mesh.add(nucGroup);
        
        const atomCloudMat = new THREE.MeshPhongMaterial({ 
            color: data.color, 
            transparent: true, 
            opacity: 0.1, 
            side: THREE.BackSide,
            blending: THREE.AdditiveBlending 
        });
        mesh.add(new THREE.Mesh(new THREE.SphereGeometry(1.4, 32, 32), atomCloudMat));
        
        const electronCount = 3;
        for(let i=0; i<electronCount; i++) {
            const orbitPivot = new THREE.Group();
            const electron = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 12), new THREE.MeshBasicMaterial({ color: 0x00ffff }));
            electron.position.x = 1.2;
            orbitPivot.add(electron);
            
            // Electron trail
            const trailGeo = new THREE.TorusGeometry(1.2, 0.005, 8, 50);
            const trail = new THREE.Mesh(trailGeo, new THREE.MeshBasicMaterial({ color: 0x00ffff, transparent: true, opacity: 0.2 }));
            trail.rotation.x = Math.PI / 2;
            orbitPivot.add(trail);

            orbitPivot.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
            orbitPivot.userData = { speed: 0.12 + Math.random() * 0.08 };
            mesh.add(orbitPivot);
        }
        return mesh;
    }

    static createFoam(data) {
        const group = new THREE.Group();
        const count = 15;
        const geometry = new THREE.IcosahedronGeometry(0.8, 2);
        
        for (let i = 0; i < count; i++) {
            const mat = new THREE.ShaderMaterial({
                uniforms: {
                    time: { value: Math.random() * 100 },
                    color: { value: new THREE.Color(data.color).add(new THREE.Color(Math.random() * 0.2, 0, Math.random() * 0.4)) }
                },
                vertexShader: FoamShader.vertexShader,
                fragmentShader: FoamShader.fragmentShader,
                transparent: true,
                blending: THREE.AdditiveBlending,
                depthWrite: false
            });
            const mesh = new THREE.Mesh(geometry, mat);
            const r = 1.2;
            mesh.position.set(
                (Math.random() - 0.5) * r,
                (Math.random() - 0.5) * r,
                (Math.random() - 0.5) * r
            );
            mesh.scale.setScalar(0.4 + Math.random() * 0.6);
            group.add(mesh);
        }
        return group;
    }

    static createNucleus(data) {
        const group = new THREE.Group();
        const count = 12; // Protons + Neutrons
        const colors = [0xff3333, 0x3333ff]; // Red for proton, Blue for neutron (traditional)
        
        for (let i = 0; i < count; i++) {
            const isProton = i % 2 === 0;
            const mat = new THREE.MeshPhongMaterial({ 
                color: isProton ? colors[0] : colors[1],
                shininess: 100,
                transparent: true,
                opacity: 0.9
            });
            const ball = new THREE.Mesh(new THREE.SphereGeometry(0.25, 16, 16), mat);
            const r = 0.45;
            const phi = Math.acos(-1 + (2 * i) / count);
            const theta = Math.sqrt(count * Math.PI) * phi;
            ball.position.setFromSphericalCoords(r, phi, theta);
            group.add(ball);
        }
        
        // Nuclear binding energy glow
        const glow = new THREE.Mesh(
            new THREE.SphereGeometry(1.2, 32, 32),
            new THREE.MeshBasicMaterial({ color: 0xffffaa, transparent: true, opacity: 0.1, blending: THREE.AdditiveBlending })
        );
        group.add(glow);
        
        return group;
    }

    static createHelix(data, mat) {
        const mesh = new THREE.Group();
        const steps = 40;
        for(let i=0; i<steps; i++) {
            const angle = i * 0.4;
            const y = (i - steps/2) * 0.1;
            const b1 = new THREE.Mesh(new THREE.SphereGeometry(0.12), mat);
            b1.position.set(Math.cos(angle), y, Math.sin(angle));
            mesh.add(b1);
            const b2 = new THREE.Mesh(new THREE.SphereGeometry(0.12), new THREE.MeshPhongMaterial({color: 0xffffff, transparent: true}));
            b2.position.set(Math.cos(angle + Math.PI), y, Math.sin(angle + Math.PI));
            mesh.add(b2);
            if(i % 2 === 0) {
                const rung = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 2), new THREE.MeshPhongMaterial({color: 0x888888, transparent: true, opacity: 0.5}));
                rung.position.y = y;
                rung.rotation.z = Math.PI / 2;
                rung.rotation.y = -angle;
                mesh.add(rung);
            }
        }
        return mesh;
    }

    static createManifold(data) {
        const group = new THREE.Group();
        const geometry = new THREE.TorusKnotGeometry(1, 0.4, 128, 32, 3, 5);
        const material = new THREE.MeshPhysicalMaterial({
            color: data.color,
            metalness: 0.9,
            roughness: 0.1,
            transmission: 0.5,
            thickness: 0.5,
            transparent: true,
            opacity: 0.8,
            side: THREE.DoubleSide
        });
        const mesh = new THREE.Mesh(geometry, material);
        group.add(mesh);

        // Add a secondary wireframe for a "mathematical" look
        const wireframe = new THREE.Mesh(
            geometry,
            new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.1 })
        );
        group.add(wireframe);
        
        group.userData = { speed: 0.01 };
        return group;
    }

    static createBlob(data, mat) {
        const mesh = new THREE.Group();
        mesh.add(new THREE.Mesh(new THREE.IcosahedronGeometry(1, 2), mat));
        if (data.name === "Virus") {
            const spikeGeo = new THREE.CylinderGeometry(0.05, 0.1, 0.5);
            const spikeMat = new THREE.MeshPhongMaterial({ color: data.color });
            for(let i=0; i<20; i++) {
                const spike = new THREE.Mesh(spikeGeo, spikeMat);
                const phi = Math.acos(-1 + (2 * i) / 20);
                const theta = Math.sqrt(20 * Math.PI) * phi;
                spike.position.setFromSphericalCoords(1.1, phi, theta);
                spike.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), spike.position.clone().normalize());
                mesh.add(spike);
            }
        } else {
            const organelle = new THREE.Mesh(new THREE.SphereGeometry(0.3), new THREE.MeshPhongMaterial({color: 0xff44ff}));
            organelle.position.set(0.3, 0.2, 0.1);
            mesh.add(organelle);
        }
        return mesh;
    }

    static createPortal(data) {
        const group = new THREE.Group();
        // Inner swirling core
        const coreGeo = new THREE.TorusKnotGeometry(1, 0.3, 128, 32, 2, 3);
        const coreMat = new THREE.MeshStandardMaterial({
            color: 0xff3300,
            emissive: 0xff0000,
            emissiveIntensity: 1.0,
            roughness: 0.1,
            metalness: 0.5
        });
        const core = new THREE.Mesh(coreGeo, coreMat);
        group.add(core);

        group.userData = { speed: 0.05 };
        return group;
    }

    static createHeart(data) {
        const group = new THREE.Group();
        const mat = new THREE.MeshPhongMaterial({
            color: data.color || 0xff0044,
            shininess: 100,
            emissive: 0x440000,
            transparent: true,
            opacity: 0.95
        });

        // Define a heart shape
        const x = 0, y = 0;
        const heartShape = new THREE.Shape();
        heartShape.moveTo(x + 5, y + 5);
        heartShape.bezierCurveTo(x + 5, y + 5, x + 4, y, x, y);
        heartShape.bezierCurveTo(x - 6, y, x - 6, y + 7, x - 6, y + 7);
        heartShape.bezierCurveTo(x - 6, y + 11, x - 3, y + 15.4, x + 5, y + 19);
        heartShape.bezierCurveTo(x + 12, y + 15.4, x + 16, y + 11, x + 16, y + 7);
        heartShape.bezierCurveTo(x + 16, y + 7, x + 16, y, x + 10, y);
        heartShape.bezierCurveTo(x + 7, y, x + 5, y + 5, x + 5, y + 5);

        const extrudeSettings = {
            depth: 2,
            bevelEnabled: true,
            bevelSegments: 2,
            steps: 2,
            bevelSize: 1,
            bevelThickness: 1
        };

        const geometry = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);
        geometry.center();
        const mesh = new THREE.Mesh(geometry, mat);
        
        // Flip it to be right-side up and scale down to fit unit scale
        mesh.rotation.z = Math.PI;
        mesh.scale.setScalar(0.12);
        group.add(mesh);

        // Pulsing glow
        const glow = new THREE.Mesh(
            new THREE.SphereGeometry(1.5, 32, 32),
            new THREE.MeshBasicMaterial({ 
                color: 0xff33aa, 
                transparent: true, 
                opacity: 0.3, 
                blending: THREE.AdditiveBlending 
            })
        );
        group.add(glow);

        // Add some arterial-like filaments
        for (let i = 0; i < 4; i++) {
            const tubeGeo = new THREE.TorusGeometry(1.2 + i * 0.2, 0.02, 8, 50, Math.PI);
            const tube = new THREE.Mesh(tubeGeo, new THREE.MeshBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.2 }));
            tube.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
            group.add(tube);
        }

        group.userData = { speed: 0.02, isHeart: true };
        return group;
    }

    static createEngine(data) {
        const group = new THREE.Group();
        // Concentric rotating rings
        for (let i = 0; i < 3; i++) {
            const ringGeo = new THREE.TorusGeometry(1 + i * 0.4, 0.05, 16, 100);
            const ringMat = new THREE.MeshStandardMaterial({ 
                color: data.color, 
                emissive: data.color, 
                emissiveIntensity: 0.5,
                transparent: true,
                opacity: 0.8
            });
            const ring = new THREE.Mesh(ringGeo, ringMat);
            ring.rotation.x = Math.PI / 2;
            ring.userData = { speed: (i + 1) * 0.02 * (i % 2 === 0 ? 1 : -1) };
            group.add(ring);
        }
        // Central power core
        const core = new THREE.Mesh(
            new THREE.OctahedronGeometry(0.5, 2),
            new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff })
        );
        group.add(core);
        return group;
    }

    static createGlyph(data) {
        const group = new THREE.Group();
        // A complex geometric symbol
        const points = [];
        for (let i = 0; i < 10; i++) {
            const a = (i / 10) * Math.PI * 2;
            const r = i % 2 === 0 ? 1 : 0.4;
            points.push(new THREE.Vector2(Math.cos(a) * r, Math.sin(a) * r));
        }
        const shape = new THREE.Shape(points);
        const extrudeSettings = { depth: 0.2, bevelEnabled: true, bevelSize: 0.1, bevelThickness: 0.1 };
        const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
        const mat = new THREE.MeshStandardMaterial({ 
            color: data.color, 
            emissive: data.color, 
            emissiveIntensity: 1.0,
            metalness: 0.8,
            roughness: 0.2
        });
        const mesh = new THREE.Mesh(geometry, mat);
        mesh.rotation.x = Math.PI / 2;
        group.add(mesh);
        group.userData = { speed: 0.01 };
        return group;
    }

    static createNeuron(data) {
        const group = new THREE.Group();
        const body = new THREE.Mesh(new THREE.IcosahedronGeometry(0.4, 1), new THREE.MeshStandardMaterial({ color: data.color }));
        group.add(body);
        
        // Dendrites
        for (let i = 0; i < 8; i++) {
            const curve = new THREE.CatmullRomCurve3([
                new THREE.Vector3(0, 0, 0),
                new THREE.Vector3(Math.random()-0.5, Math.random()-0.5, Math.random()-0.5).multiplyScalar(1.5),
                new THREE.Vector3(Math.random()-0.5, Math.random()-0.5, Math.random()-0.5).multiplyScalar(3.0)
            ]);
            const tubeGeo = new THREE.TubeGeometry(curve, 20, 0.02, 8, false);
            const tubeMat = new THREE.MeshBasicMaterial({ color: data.color, transparent: true, opacity: 0.4 });
            group.add(new THREE.Mesh(tubeGeo, tubeMat));
        }
        group.userData = { speed: 0.005 };
        return group;
    }

    static createSeed(data) {
        const group = new THREE.Group();
        // A perfect, glowing white sphere that pulses slowly
        const seed = new THREE.Mesh(
            new THREE.SphereGeometry(0.3, 32, 32),
            new THREE.MeshBasicMaterial({ color: 0xffffff })
        );
        group.add(seed);

        const halo = new THREE.Mesh(
            new THREE.SphereGeometry(0.6, 32, 32),
            new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.2, blending: THREE.AdditiveBlending })
        );
        group.add(halo);

        // Add "rays" of light
        for (let i = 0; i < 50; i++) {
            const rayGeo = new THREE.BoxGeometry(0.01, 0.01, 5);
            const ray = new THREE.Mesh(rayGeo, new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.1 }));
            ray.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
            group.add(ray);
        }

        group.userData = { speed: 0.03, isSeed: true };
        return group;
    }
}