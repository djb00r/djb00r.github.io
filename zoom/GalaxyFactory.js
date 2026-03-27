import * as THREE from 'three';
import { AtmosphereShader } from './MacroShaders.js';
import { GalaxyShader } from './LargeScaleShaders.js';

export class GalaxyFactory {
    static createMiniGalaxy(colorValue, size) {
        const group = new THREE.Group();
        const isElliptical = Math.random() > 0.7;
        const count = isElliptical ? 1200 : 1800;
        const geo = new THREE.BufferGeometry();
        const pos = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        const baseColor = new THREE.Color(colorValue);

        for(let i=0; i<count; i++) {
            let r, angle, spread, x, y, z;
            if (isElliptical) {
                r = Math.pow(Math.random(), 0.5) * size;
                const phi = Math.acos(2 * Math.random() - 1);
                const theta = Math.random() * Math.PI * 2;
                x = r * Math.sin(phi) * Math.cos(theta);
                y = r * Math.sin(phi) * Math.sin(theta) * 0.7;
                z = r * Math.cos(phi);
            } else {
                r = Math.pow(Math.random(), 0.7) * size;
                angle = r * (6.0 + Math.random() * 2.0) + (i % 2 === 0 ? 0 : Math.PI);
                spread = (Math.random() - 0.5) * 0.3 * r;
                x = Math.cos(angle + spread) * r;
                y = (Math.random() - 0.5) * 0.1 * r;
                z = Math.sin(angle + spread) * r;
            }
            pos[i*3] = x;
            pos[i*3+1] = y;
            pos[i*3+2] = z;

            const c = baseColor.clone().lerp(new THREE.Color(isElliptical ? 0xffccaa : 0x99ccff), Math.random());
            colors[i*3] = c.r;
            colors[i*3+1] = c.g;
            colors[i*3+2] = c.b;
        }

        geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const mat = new THREE.PointsMaterial({ 
            size: 0.025, 
            vertexColors: true, 
            transparent: true, 
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            opacity: 0.6
        });
        group.add(new THREE.Points(geo, mat));

        const coreColor = isElliptical ? new THREE.Color(0xffddaa) : new THREE.Color(0xffffcc);
        const glow = new THREE.Mesh(
            new THREE.SphereGeometry(size * (isElliptical ? 0.5 : 0.25), 16, 16),
            new THREE.ShaderMaterial({
                vertexShader: AtmosphereShader.vertexShader,
                fragmentShader: AtmosphereShader.fragmentShader,
                side: THREE.BackSide, transparent: true, blending: THREE.AdditiveBlending,
                uniforms: { glowColor: { value: coreColor } }
            })
        );
        if (!isElliptical) glow.scale.set(1.5, 0.4, 1.5);
        group.add(glow);
        return group;
    }

    static createGalaxy(data) {
        // Enhanced galaxy aimed at a more Milky Way-like appearance:
        // - denser central region, larger particle count for detail
        // - clearer 4-arm spiral with tighter spin
        // - rotating central bar and dark dust lanes to increase realism
        const group = new THREE.Group();
        const content = new THREE.Group();

        const particleCount = 80000;
        const geo = new THREE.BufferGeometry();
        const pos = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const sizes = new Float32Array(particleCount);
        const color = new THREE.Color(data.color);
        const arms = 4;
        const spin = 5.0; // slightly tighter spiral than before

        for (let i = 0; i < particleCount; i++) {
            // radial distribution biased toward the center for a dense bulge + disk
            const rRand = Math.random();
            const r = Math.pow(rRand, 0.75) * 2.8;
            const armIndex = i % arms;
            const baseAngle = (armIndex / arms) * Math.PI * 2;
            // add per-arm phase offsets for more natural look
            const armOffset = (Math.sin(armIndex * 2.3) * 0.2);
            const angle = baseAngle + r * spin + armOffset;

            // spiral spread decreases with radius to create sharper arms
            const spread = (0.18 / (r + 0.15)) * (Math.random() - 0.5);

            const x = Math.cos(angle + spread) * r;
            const z = Math.sin(angle + spread) * r;

            // vertical flattening for disk; central bulge thicker
            const bulgeFactor = Math.exp(-r * 2.8);
            const y = (Math.random() - 0.5) * (0.06 * (3.0 - r) + bulgeFactor * 0.9);

            pos[i * 3] = x;
            pos[i * 3 + 1] = y;
            pos[i * 3 + 2] = z;

            // color gradient: warmer core, bluer outer arms
            const mixFactor = Math.min(1, r / 2.2);
            const starColor = color.clone().lerp(new THREE.Color(0x88ccff), mixFactor);
            if (r < 0.6) starColor.lerp(new THREE.Color(0xfff0c8), 1.0 - (r / 0.6));

            // scatter some blue and red outliers
            const rand = Math.random();
            if (rand > 0.992) starColor.set(0xff4444); // red giant
            else if (rand > 0.985 && r > 1.0) starColor.set(0x66aaff); // young blue star

            colors[i * 3] = starColor.r;
            colors[i * 3 + 1] = starColor.g;
            colors[i * 3 + 2] = starColor.b;

            // size tied to radius so inner stars appear slightly larger
            sizes[i] = (Math.random() * 0.035 + 0.008) * (1.2 - mixFactor * 0.35);
        }

        geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        geo.setAttribute('customColor', new THREE.BufferAttribute(colors, 3));
        geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        const mat = new THREE.ShaderMaterial({
            uniforms: {},
            vertexShader: `
                attribute float size;
                attribute vec3 customColor;
                varying vec3 vColor;
                void main() {
                    vColor = customColor;
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    gl_PointSize = size * (450.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                varying vec3 vColor;
                void main() {
                    float d = distance(gl_PointCoord, vec2(0.5));
                    if (d > 0.5) discard;
                    float alpha = pow(1.0 - d * 2.0, 1.8);
                    // slight softening on inner points
                    gl_FragColor = vec4(vColor, alpha * 0.95);
                }
            `,
            transparent: true, blending: THREE.AdditiveBlending, depthWrite: false
        });

        content.add(new THREE.Points(geo, mat));

        // stronger, warm central glow (larger bulge)
        const coreGlow = new THREE.Mesh(
            new THREE.SphereGeometry(0.7, 32, 32),
            new THREE.ShaderMaterial({
                vertexShader: AtmosphereShader.vertexShader,
                fragmentShader: AtmosphereShader.fragmentShader,
                side: THREE.BackSide, transparent: true, blending: THREE.AdditiveBlending,
                uniforms: { glowColor: { value: new THREE.Color(0xfff3d9) } }
            })
        );
        coreGlow.scale.set(1.9, 0.9, 1.9);
        content.add(coreGlow);

        // add a subtle rotating central bar to mimic Milky Way's bar
        const barGeo = new THREE.BoxGeometry(1.6, 0.12, 0.18);
        const barMat = new THREE.MeshBasicMaterial({ color: 0x2b1b10, transparent: true, opacity: 0.25 });
        const bar = new THREE.Mesh(barGeo, barMat);
        bar.rotation.y = 0.1;
        bar.position.set(0, 0, 0);
        // give the bar slight emissive warmth near center
        const barInner = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.08, 0.12), new THREE.MeshBasicMaterial({ color: 0xfff0d0, transparent: true, opacity: 0.06 }));
        bar.add(barInner);
        bar.userData = { speed: 0.003 };
        content.add(bar);

        // dark dust lanes: layered semi-transparent planes aligned with the disk to obscure parts of arms
        for (let i = 0; i < 3; i++) {
            const dustMat = new THREE.MeshBasicMaterial({
                color: 0x000000,
                transparent: true,
                opacity: 0.18 + i * 0.06,
                depthWrite: false,
                side: THREE.DoubleSide
            });
            const dust = new THREE.Mesh(new THREE.PlaneGeometry(6.5, 0.6), dustMat);
            dust.rotation.x = Math.PI / 2;
            dust.rotation.z = (i - 1) * 0.15;
            dust.position.y = (i - 1) * 0.02;
            dust.userData = { speed: 0.001 + i * 0.0006 };
            content.add(dust);
        }

        // a few nebula layers to give the arms diffuse color but keep dust lanes darker
        for (let i = 0; i < 3; i++) {
            const nebulaMat = new THREE.ShaderMaterial({
                uniforms: { 
                    time: { value: Math.random() * 500 }, 
                    color: { value: color.clone().multiplyScalar(0.45) } 
                },
                vertexShader: GalaxyShader.vertexShader,
                fragmentShader: GalaxyShader.fragmentShader,
                transparent: true, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, depthWrite: false
            });
            const nebula = new THREE.Mesh(new THREE.PlaneGeometry(6.5, 6.5), nebulaMat);
            nebula.rotation.x = Math.PI / 2;
            nebula.position.y = (i - 1) * 0.03;
            nebula.rotation.z = i * 0.4;
            content.add(nebula);
        }

        // position tweaks and rotation behavior
        content.position.x = -0.65;
        content.rotation.y = 0.45;
        group.add(content);

        // expose some userData for animation loop: rotate bar and dust lanes
        group.userData = { speed: 0.005 };

        // slightly tilt the galaxy for presentation
        group.rotation.x = 0.32;

        return group;
    }

    static createBulge(data) {
        const group = new THREE.Group();
        const content = new THREE.Group();
        
        const glow = new THREE.Mesh(
            new THREE.SphereGeometry(0.35, 32, 32),
            new THREE.ShaderMaterial({
                vertexShader: AtmosphereShader.vertexShader,
                fragmentShader: AtmosphereShader.fragmentShader,
                side: THREE.BackSide, transparent: true, blending: THREE.AdditiveBlending,
                uniforms: { glowColor: { value: new THREE.Color(0xffffcc) } }
            })
        );
        glow.scale.set(1, 0.5, 1);
        content.add(glow);
        
        const count = 15000;
        const geo = new THREE.BufferGeometry();
        const pos = new Float32Array(count * 3);
        const sizes = new Float32Array(count);
        
        for(let i=0; i<count; i++) {
            const r = Math.pow(Math.random(), 0.4) * 0.45;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            pos[i*3] = r * Math.sin(phi) * Math.cos(theta);
            pos[i*3+1] = r * Math.sin(phi) * Math.sin(theta) * 0.65; 
            pos[i*3+2] = r * Math.cos(phi);
            sizes[i] = Math.random() * 0.012 + 0.003;
        }
        
        geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        
        const mat = new THREE.ShaderMaterial({
            vertexShader: `
                attribute float size;
                void main() {
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    gl_PointSize = size * (300.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                void main() {
                    float d = distance(gl_PointCoord, vec2(0.5));
                    if (d > 0.5) discard;
                    gl_FragColor = vec4(1.0, 0.9, 0.7, 1.0 - d * 2.0);
                }
            `,
            transparent: true, blending: THREE.AdditiveBlending, depthWrite: false
        });
        
        // Add the particle layer
        const points = new THREE.Points(geo, mat);
        content.add(points);

        // Position and base orientation
        const bulgeOffset = -0.65 * Math.pow(10, 21 - 20.55);
        content.position.x = bulgeOffset;
        content.rotation.y = 0.5;

        // Mark the content with a small rotation speed so the main animation loop will rotate it
        // (the animate loop looks for child.userData.speed and applies rotation)
        content.userData = { speed: 0.02 };

        // Slight overall wobble for the whole group to give a dynamic feel
        group.userData = { speed: 0.006 };
        
        // Reduce the visible size of the bulge for a smaller appearance
        group.scale.setScalar(0.6);

        group.add(content);
        group.rotation.x = 0.3; 
        return group;
    }

    static createArm(data) {
        const group = new THREE.Group();
        group.rotation.x = 0.3; 
        const particleGeo = new THREE.BufferGeometry();
        const count = 1000;
        const pos = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        const color = new THREE.Color(data.color);

        for (let i = 0; i < count; i++) {
            const t = (i / count);
            const angle = t * 2.0;
            const r = 2 + (Math.random() - 0.5) * 1.5;
            pos[i * 3] = Math.cos(angle) * r;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 0.5;
            pos[i * 3 + 2] = Math.sin(angle) * r;

            colors[i * 3] = color.r * (0.5 + Math.random() * 0.5);
            colors[i * 3 + 1] = color.g * (0.5 + Math.random() * 0.5);
            colors[i * 3 + 2] = color.b * (0.5 + Math.random() * 0.5);
        }

        particleGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        const mat = new THREE.PointsMaterial({ 
            size: 0.05, 
            vertexColors: true, 
            transparent: true, 
            blending: THREE.AdditiveBlending,
            opacity: 0.8
        });
        
        group.add(new THREE.Points(particleGeo, mat));
        return group;
    }
}