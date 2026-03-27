import * as THREE from 'three';

export const GalaxyShader = {
    uniforms: {
        time: { value: 0 },
        color: { value: null }
    },
    vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform float time;
        uniform vec3 color;
        varying vec2 vUv;

        float hash(vec2 p) {
            return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
        }

        float noise(vec2 p) {
            vec2 i = floor(p);
            vec2 f = fract(p);
            f = f * f * (3.0 - 2.0 * f);
            return mix(mix(hash(i + vec3(0,0,0).xy), hash(i + vec3(1,0,0).xy), f.x),
                       mix(hash(i + vec3(0,1,0).xy), hash(i + vec3(1,1,0).xy), f.x), f.y);
        }

        void main() {
            vec2 uv = (vUv - 0.5) * 2.0;
            float r = length(uv);
            if (r > 1.0) discard;
            float angle = atan(uv.y, uv.x);
            
            float spin = 6.0;
            float arms = 2.0;
            float spiral = sin(angle * arms + r * spin - time * 0.05);
            
            float n = noise(uv * 4.0 + time * 0.1) * 0.5;
            n += noise(uv * 8.0 - time * 0.05) * 0.25;
            
            float glow = pow(1.0 - r, 3.0);
            float core = exp(-r * 6.0) * 2.0;
            
            float dust = smoothstep(0.3, 0.7, noise(uv * 12.0 + r * 5.0));
            float armStrength = (spiral * 0.5 + 0.5) * (1.0 - dust * 0.4);
            
            float alpha = (armStrength * 0.6 + 0.4) * glow + core * 0.3;
            alpha = clamp(alpha, 0.0, 1.0) * (0.6 + n * 0.4);
            
            vec3 armColor = mix(color, vec3(0.4, 0.6, 1.0), r);
            if (n > 0.6 && r > 0.3 && r < 0.8) {
                armColor = mix(armColor, vec3(1.0, 0.4, 0.7), 0.5);
            }
            
            vec3 finalColor = mix(armColor, vec3(1.0, 0.9, 0.7), core);
            gl_FragColor = vec4(finalColor, alpha * 0.7);
        }
    `
};

export const CosmicWebShader = {
    uniforms: {
        time: { value: 0 },
        color: { value: new THREE.Color(0xffffff) }
    },
    vertexShader: `
        attribute float size;
        varying float vAlpha;
        uniform float time;
        void main() {
            vec3 pos = position;
            float pulse = sin(time * 0.5 + position.x * 10.0) * 0.1 + 0.9;
            vAlpha = pulse;
            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_PointSize = size * (250.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
        }
    `,
    fragmentShader: `
        uniform vec3 color;
        varying float vAlpha;
        void main() {
            float d = distance(gl_PointCoord, vec2(0.5));
            if (d > 0.5) discard;
            float strength = 1.0 - (d * 2.0);
            gl_FragColor = vec4(color, strength * vAlpha * 0.6);
        }
    `
};

export const MandelbrotShader = {
    uniforms: {
        time: { value: 0.0 }
    },
    vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform float time;
        varying vec2 vUv;

        vec3 palette(float t) {
            // Smooth palette inspired by classic Mandelbrot colorings
            vec3 a = vec3(0.5, 0.2, 0.8);
            vec3 b = vec3(0.5, 0.5, 0.5);
            vec3 c = vec3(1.0, 0.7, 0.2);
            vec3 d = vec3(0.3, 0.2, 0.9);
            return a + b * cos(6.28318 * (c * t + d));
        }

        void main() {
            // Animate a gentle zoom and pan over time
            float t = time * 0.03;
            float zoom = exp(-t * 0.25);
            vec2 center = vec2(-0.745, 0.186) + vec2(
                0.15 * sin(t * 0.3),
                0.10 * cos(t * 0.27)
            );

            // Map UV from [0,1] to complex plane
            vec2 uv = (vUv - 0.5) * vec2(3.5, 2.0);
            vec2 c = center + uv * zoom;

            vec2 z = vec2(0.0);
            float iter = 0.0;
            const float maxIter = 120.0;

            for (float i = 0.0; i < maxIter; i++) {
                // z = z*z + c in complex plane
                vec2 z2 = vec2(
                    z.x * z.x - z.y * z.y,
                    2.0 * z.x * z.y
                ) + c;

                z = z2;
                if (dot(z, z) > 4.0) {
                    iter = i;
                    break;
                }
            }

            float m = iter / maxIter;
            // Smooth escape time to reduce banding
            if (iter < maxIter - 1.0) {
                float log_zn = log(dot(z, z)) / 2.0;
                float nu = log(log_zn / log(2.0)) / log(2.0);
                m = 1.0 - clamp((iter + 1.0 - nu) / maxIter, 0.0, 1.0);
            }

            vec3 col;
            if (iter >= maxIter - 1.0) {
                // Inside the set: dark but not fully black so it reads on screen
                col = vec3(0.02, 0.0, 0.05);
            } else {
                col = palette(m);
            }

            // Subtle vignette for visual focus
            float d = distance(vUv, vec2(0.5));
            float vignette = smoothstep(0.9, 0.3, d);
            col *= vignette;

            gl_FragColor = vec4(col, 1.0);
        }
    `
};

export const CMBShader = {
    uniforms: {
        time: { value: 0 }
    },
    vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;
        void main() {
            vUv = uv;
            vPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform float time;
        varying vec2 vUv;
        varying vec3 vPosition;

        float hash(vec3 p) {
            p = fract(p * 0.3183099 + 0.1);
            p *= 17.0;
            return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
        }

        float noise(vec3 x) {
            vec3 i = floor(x);
            vec3 f = fract(x);
            f = f * f * (3.0 - 2.0 * f);
            return mix(mix(mix(hash(i + vec3(0,0,0)), hash(i + vec3(1,0,0)), f.x),
                           mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
                       mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
                           mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y), f.z);
        }

        float fbm(vec3 p) {
            float v = 0.0;
            float a = 0.5;
            for (int i = 0; i < 5; i++) {
                v += a * noise(p);
                p *= 2.0;
                a *= 0.5;
            }
            return v;
        }

        void main() {
            float n = fbm(vPosition * 2.5 + time * 0.05);
            vec3 c1 = vec3(0.0, 0.0, 0.2); 
            vec3 c2 = vec3(0.0, 0.4, 0.8);
            vec3 c3 = vec3(0.0, 0.8, 0.4);
            vec3 c4 = vec3(0.9, 0.9, 0.0);
            vec3 c5 = vec3(1.0, 0.4, 0.0);
            vec3 c6 = vec3(0.8, 0.0, 0.0);

            vec3 color;
            if (n < 0.2) color = mix(c1, c2, n / 0.2);
            else if (n < 0.4) color = mix(c2, c3, (n - 0.2) / 0.2);
            else if (n < 0.6) color = mix(c3, c4, (n - 0.4) / 0.2);
            else if (n < 0.8) color = mix(c4, c5, (n - 0.6) / 0.2);
            else color = mix(c5, c6, (n - 0.8) / 0.2);

            gl_FragColor = vec4(color, 0.4);
        }
    `
};



export const MultiverseBubbleShader = {
    uniforms: {
        time: { value: 0 },
        glowColor: { value: new THREE.Color(0xff00ff) }
    },
    vertexShader: `
        varying vec3 vNormal;
        varying vec3 vWorldPosition;
        varying vec3 vLocalPosition;
        uniform float time;
        void main() {
            vLocalPosition = position;
            vNormal = normalize(normalMatrix * normal);
            float pulse = sin(time * 0.5 + position.x * 2.0 + position.y * 2.0) * 0.03;
            vec3 newPos = position + normal * pulse;
            vec4 worldPosition = modelMatrix * vec4(newPos, 1.0);
            vWorldPosition = worldPosition.xyz;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
        }
    `,
    fragmentShader: `
        uniform float time;
        uniform vec3 glowColor;
        varying vec3 vNormal;
        varying vec3 vWorldPosition;
        varying vec3 vLocalPosition;

        float hash(vec3 p) {
            p = fract(p * 0.3183099 + 0.1);
            p *= 17.0;
            return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
        }

        float noise(vec3 x) {
            vec3 i = floor(x);
            vec3 f = fract(x);
            f = f * f * (3.0 - 2.0 * f);
            return mix(mix(mix(hash(i + vec3(0,0,0)), hash(i + vec3(1,0,0)), f.x),
                           mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
                       mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
                           mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y), f.z);
        }
        
        void main() {
            vec3 viewDirection = normalize(cameraPosition - vWorldPosition);
            float fresnel = pow(1.0 - dot(vNormal, viewDirection), 3.5);
            float n = noise(vLocalPosition * 2.5 + time * 0.2);
            float n2 = noise(vLocalPosition * 5.0 - time * 0.1);
            vec3 irid = 0.5 + 0.5 * cos(time * 0.3 + (vNormal.xyz * 2.0) + vec3(0,2,4));
            irid += 0.2 * cos(time * 0.8 + vLocalPosition * 10.0);
            vec3 finalColor = mix(glowColor, irid, 0.5 + n * 0.3);
            float edgeAlpha = fresnel * 0.9;
            float spotAlpha = smoothstep(0.4, 0.6, n2) * 0.3;
            gl_FragColor = vec4(finalColor + (n * 0.1), edgeAlpha + spotAlpha + 0.05);
        }
    `
};

export const HorizonShader = {
    uniforms: {
        time: { value: 0 },
        color: { value: new THREE.Color(0xffffff) }
    },
    vertexShader: `
        varying vec3 vPosition;
        varying vec3 vNormal;
        void main() {
            vPosition = position;
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform float time;
        uniform vec3 color;
        varying vec3 vPosition;
        varying vec3 vNormal;

        float hash(vec3 p) {
            p = fract(p * 0.3183099 + 0.1);
            p *= 17.0;
            return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
        }

        void main() {
            float dist = length(vPosition);
            vec3 p = vPosition * 4.0;
            
            float n = 0.0;
            float amp = 0.5;
            for(int i=0; i<4; i++) {
                n += hash(p + time * 0.1) * amp;
                p *= 2.0;
                amp *= 0.5;
            }

            float fresnel = pow(1.0 - dot(vNormal, vec3(0,0,1)), 3.0);
            float pulse = sin(time * 2.0 + dist * 10.0) * 0.5 + 0.5;
            
            vec3 fire = mix(vec3(0.0, 0.5, 1.0), vec3(1.0, 1.0, 1.0), n);
            fire = mix(fire, vec3(1.0, 0.1, 0.5), fresnel);
            
            gl_FragColor = vec4(fire, (fresnel + n * 0.5) * 0.8);
        }
    `
};

export const BulkShader = {
    uniforms: {
        time: { value: 0 },
        color: { value: new THREE.Color(0x220044) }
    },
    vertexShader: `
        varying vec3 vPosition;
        void main() {
            vPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform float time;
        uniform vec3 color;
        varying vec3 vPosition;

        void main() {
            vec3 p = vPosition * 0.5;
            float grid = sin(p.x * 20.0 + time) * sin(p.y * 20.0 + time) * sin(p.z * 20.0 + time);
            grid = pow(abs(grid), 10.0);
            
            float rays = sin(atan(vPosition.y, vPosition.x) * 10.0 + time) * 0.5 + 0.5;
            rays *= sin(atan(vPosition.z, vPosition.x) * 5.0 - time * 0.5) * 0.5 + 0.5;

            vec3 baseColor = color + vec3(0.1, 0.0, 0.2) * rays;
            vec3 gridColor = vec3(0.5, 0.8, 1.0) * grid;
            
            gl_FragColor = vec4(baseColor + gridColor, 0.6 + grid * 0.4);
        }
    `
};