import * as THREE from 'three';
import { AtmosphereShader, SunShader, StarFlareShader } from './MacroShaders.js';

export class MacroFactory {
    static createHuman(data, mat) {
        const mesh = new THREE.Group();
        // Torso
        const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.25, 0.5, 4, 8), mat);
        torso.position.y = 0.1;
        mesh.add(torso);
        
        // Head
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 16), mat);
        head.position.y = 0.6;
        mesh.add(head);
        
        // Arms
        const armGeo = new THREE.CapsuleGeometry(0.06, 0.5, 2, 4);
        const armL = new THREE.Mesh(armGeo, mat);
        armL.position.set(0.35, 0.15, 0);
        armL.rotation.z = -0.2;
        mesh.add(armL);
        
        const armR = new THREE.Mesh(armGeo, mat);
        armR.position.set(-0.35, 0.15, 0);
        armR.rotation.z = 0.2;
        mesh.add(armR);
        
        // Legs
        const legGeo = new THREE.CapsuleGeometry(0.08, 0.6, 2, 4);
        const legL = new THREE.Mesh(legGeo, mat);
        legL.position.set(0.12, -0.4, 0);
        mesh.add(legL);
        
        const legR = new THREE.Mesh(legGeo, mat);
        legR.position.set(-0.12, -0.4, 0);
        mesh.add(legR);
        
        return mesh;
    }

    static createTower() {
        const mesh = new THREE.Group();
        const cylinder = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.8, 4, 4), new THREE.MeshBasicMaterial({ color: 0x888888, wireframe: true, transparent: true }));
        mesh.add(cylinder);
        for(let i=0; i<4; i++) {
            const platform = new THREE.Mesh(new THREE.BoxGeometry(1.2 - i*0.3, 0.05, 1.2 - i*0.3), new THREE.MeshBasicMaterial({ color: 0xaaaaaa, transparent: true, opacity: 0.5 }));
            platform.position.y = -2 + i * 1.3;
            mesh.add(platform);
        }
        return mesh;
    }

    static createMountain() {
        const group = new THREE.Group();
        const mainPeak = new THREE.Mesh(new THREE.ConeGeometry(1.5, 2, 5), new THREE.MeshPhongMaterial({ color: 0x888888, flatShading: true, transparent: true }));
        group.add(mainPeak);
        
        for(let i=0; i<3; i++) {
            const sidePeak = new THREE.Mesh(new THREE.ConeGeometry(0.8, 1, 4), new THREE.MeshPhongMaterial({ color: 0x777777, flatShading: true, transparent: true }));
            const angle = (i / 3) * Math.PI * 2;
            sidePeak.position.set(Math.cos(angle) * 0.8, -0.5, Math.sin(angle) * 0.8);
            group.add(sidePeak);
        }
        
        const snowCap = new THREE.Mesh(new THREE.ConeGeometry(0.4, 0.5, 5), new THREE.MeshPhongMaterial({ color: 0xffffff, transparent: true }));
        snowCap.position.y = 0.75;
        group.add(snowCap);
        
        return group;
    }

    static createEarth() {
        const mesh = new THREE.Group();

        // Use the provided earthmap1k.jpg image for Earth texture
        const loader = new THREE.TextureLoader();
        const earthTex = loader.load('/earthmap1k.jpg');
        try { earthTex.encoding = THREE.sRGBEncoding; } catch (e) {}

        const earthMat = new THREE.MeshPhongMaterial({
            map: earthTex,
            shininess: 30
        });

        // Primary textured globe
        const globe = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 64), earthMat);
        globe.userData = { isPlanetCore: true };
        mesh.add(globe);

        // Subtle land overlay to provide stylized terrain accents (very faint)
        const landOverlay = new THREE.Mesh(
            new THREE.IcosahedronGeometry(1.01, 4),
            new THREE.MeshPhongMaterial({ color: 0x22aa33, flatShading: true, transparent: true, opacity: 0.08 })
        );
        mesh.add(landOverlay);

        // Clouds layer (slightly larger than globe) with gentle rotation
        const cloudTex = loader.load('/1eprhbtmvoo51.png'); // reuse cloud/sky asset as a loose cloud layer if available
        const cloudsMat = new THREE.MeshPhongMaterial({ map: cloudTex, transparent: true, opacity: 0.35 });
        const clouds = new THREE.Mesh(new THREE.SphereGeometry(1.03, 64, 64), cloudsMat);
        clouds.userData = { speed: 0.004 };
        mesh.add(clouds);

        // (Removed: thin atmosphere shader layer — atmosphere now disabled to simplify Earth presentation)

        // Lightweight rotation/animation userData so the global loop can nudge layers
        mesh.userData = { rotateLayers: true };
        return mesh;
    }

    static createSun(data) {
        const sunGroup = new THREE.Group();
        const sunColor = new THREE.Color(data.color);
        
        // Main Sun Body
        const sunMat = new THREE.ShaderMaterial({
            uniforms: { time: { value: 0 }, color: { value: sunColor } },
            vertexShader: SunShader.vertexShader, fragmentShader: SunShader.fragmentShader
        });
        sunGroup.add(new THREE.Mesh(new THREE.SphereGeometry(1, 64, 64), sunMat));
        
        // Atmosphere Glow
        sunGroup.add(new THREE.Mesh(new THREE.SphereGeometry(1.6, 48, 48), new THREE.ShaderMaterial({
            vertexShader: AtmosphereShader.vertexShader,
            fragmentShader: AtmosphereShader.fragmentShader,
            side: THREE.BackSide, transparent: true, blending: THREE.AdditiveBlending,
            uniforms: { glowColor: { value: sunColor } }
        })));

        // Star Light Flare
        const flareGeo = new THREE.PlaneGeometry(12, 12);
        const flareMat = new THREE.ShaderMaterial({
            uniforms: { color: { value: sunColor.clone().addScalar(0.2) } },
            vertexShader: StarFlareShader.vertexShader,
            fragmentShader: StarFlareShader.fragmentShader,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        
        const flare = new THREE.Mesh(flareGeo, flareMat);
        // Billboard-like behavior (always faces camera roughly as it's a flat plane in a zoomed scene)
        sunGroup.add(flare);
        
        // Functional light source for the scene (visible at this scale)
        const pointLight = new THREE.PointLight(sunColor, 2, 20);
        sunGroup.add(pointLight);

        return sunGroup;
    }

    // Helper to create a textured planet with optional size, distance and rotation speed.
    static createPlanet({ name = 'Planet', radius = 0.3, distance = 2.5, texture = null, color = 0x888888, speed = 0.003 }) {
        const group = new THREE.Group();
        const loader = new THREE.TextureLoader();

        let mat;
        if (texture) {
            const tex = loader.load(texture);
            try { tex.encoding = THREE.sRGBEncoding; } catch (e) {}
            mat = new THREE.MeshPhongMaterial({ map: tex });
        } else {
            mat = new THREE.MeshPhongMaterial({ color: color });
        }

        const body = new THREE.Mesh(new THREE.SphereGeometry(radius, 32, 32), mat);
        body.position.set(distance, 0, 0);
        body.userData = { name, radius, distance, speed };

        // Add a faint atmosphere rim for readable planets
        const atm = new THREE.Mesh(new THREE.SphereGeometry(radius * 1.06, 24, 24), new THREE.MeshBasicMaterial({
            color: 0x88ccff,
            transparent: true,
            opacity: 0.06,
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        }));
        atm.position.copy(body.position);

        // Orbit visual
        const orbit = new THREE.Mesh(new THREE.TorusGeometry(distance, 0.005, 8, 200), new THREE.MeshBasicMaterial({ color: 0x444444, transparent: true, opacity: 0.18 }));
        orbit.rotation.x = Math.PI / 2;

        group.add(orbit);
        group.add(body);
        group.add(atm);
        group.userData = { orbitalSpeed: speed, orbitRadius: distance, body };

        return group;
    }

    static createSolarSystem() {
        const group = new THREE.Group();

        // Sun
        const sunGroup = new THREE.Group();
        const sun = MacroFactory.createSun({ color: 0xffcc00 });
        sun.scale.setScalar(1.8);
        sunGroup.add(sun);

        // Give the sun a bright point light to illuminate nearby planets
        const sunLight = new THREE.PointLight(0xfff8c8, 2.2, 40, 2);
        sunLight.position.set(0, 0, 0);
        sunGroup.add(sunLight);

        group.add(sunGroup);

        // Create a few sample planets with a mix of textures and solid colors
        const planets = [
            { name: 'Mercury', radius: 0.08, distance: 2.4, texture: null, color: 0x8a6f5a, speed: 0.018 },
            { name: 'Venus', radius: 0.12, distance: 2.8, texture: null, color: 0xd4b27a, speed: 0.012 },
            { name: 'Earth', radius: 0.3, distance: 3.6, texture: '/earthmap1k.jpg', color: 0x2277ff, speed: 0.009 },
            { name: 'Mars', radius: 0.18, distance: 4.2, texture: null, color: 0xcc6b4a, speed: 0.007 },
            { name: 'Jupiter', radius: 0.85, distance: 5.8, texture: null, color: 0xffd9b2, speed: 0.0035 },
            { name: 'Saturn', radius: 0.7, distance: 7.0, texture: null, color: 0xffe5c7, speed: 0.0025 },
        ];

        planets.forEach(p => {
            const pg = MacroFactory.createPlanet(p);
            group.add(pg);
        });

        // Add a faint outer Kuiper belt ring for aesthetic
        const kuiper = new THREE.Mesh(new THREE.TorusGeometry(9.5, 0.08, 8, 300), new THREE.MeshBasicMaterial({ color: 0x777777, transparent: true, opacity: 0.06 }));
        kuiper.rotation.x = Math.PI / 2;
        group.add(kuiper);

        // Mark group for slow rotation and orbital updates
        group.userData = { isSolarSystem: true };

        return group;
    }

    static createHair(data) {
        const group = new THREE.Group();
        const radius = 0.5;
        const height = 15;
        
        // Main hair shaft (medulla/cortex area)
        const shaftGeo = new THREE.CylinderGeometry(radius * 0.95, radius * 0.95, height, 12);
        const shaftMat = new THREE.MeshPhongMaterial({ 
            color: data.color, 
            shininess: 40,
            transparent: true
        });
        const shaft = new THREE.Mesh(shaftGeo, shaftMat);
        group.add(shaft);

        // Add "cuticle" scales for microscopic detail
        // These are overlapping shingles that point away from the root
        const scaleCount = 60;
        const scaleHeight = 0.4;
        const scaleGeo = new THREE.CylinderGeometry(radius, radius * 1.05, scaleHeight, 12, 1, true);
        const scaleMat = new THREE.MeshPhongMaterial({ 
            color: data.color, 
            shininess: 80, 
            specular: 0x666666,
            side: THREE.DoubleSide,
            transparent: true
        });

        for (let i = 0; i < scaleCount; i++) {
            const scale = new THREE.Mesh(scaleGeo, scaleMat);
            // Distribute along the height
            scale.position.y = (i / scaleCount - 0.5) * height;
            // Slight random rotation for organic look
            scale.rotation.y = (i * 0.5);
            group.add(scale);
        }

        // Add a highlight sheen
        const sheen = new THREE.Mesh(
            new THREE.CylinderGeometry(radius * 1.06, radius * 1.06, height, 12, 1, true),
            new THREE.MeshPhongMaterial({
                color: 0xffffff,
                transparent: true,
                opacity: 0.1,
                blending: THREE.AdditiveBlending,
                side: THREE.FrontSide
            })
        );
        group.add(sheen);

        return group;
    }

    static createLine(data) {
        const color = (data && data.color !== undefined) ? data.color : 0xffffff;
        const group = new THREE.Group();
        const line = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 12, 8), new THREE.MeshBasicMaterial({color: color, transparent: true, opacity: 0.6}));
        line.rotation.z = Math.PI / 2;
        group.add(line);
        
        if (data.name === "Planck Length") {
            const glow = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 12, 8), new THREE.MeshBasicMaterial({color: color, transparent: true, opacity: 0.2, blending: THREE.AdditiveBlending}));
            glow.rotation.z = Math.PI / 2;
            group.add(glow);
        }
        return group;
    }
}