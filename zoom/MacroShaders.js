import * as THREE from 'three';

export const AtmosphereShader = {
    vertexShader: `
        varying vec3 vNormal;
        void main() {
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform vec3 glowColor;
        varying vec3 vNormal;
        void main() {
            float intensity = pow(0.7 - dot(vNormal, vec3(0, 0, 1.0)), 4.0);
            vec3 color = (glowColor.r > 0.0) ? glowColor : vec3(0.3, 0.6, 1.0);
            gl_FragColor = vec4(color, 1.0) * intensity;
        }
    `
};

export const SunShader = {
    vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        void main() {
            vUv = uv;
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform float time;
        uniform vec3 color;
        varying vec2 vUv;
        varying vec3 vNormal;

        float noise(vec2 p) {
            return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
        }

        void main() {
            vec2 p = vUv * 10.0;
            float n = noise(p + time * 0.1);
            n += noise(p * 2.1 + time * 0.2) * 0.5;
            
            vec3 sunColor = mix(color, vec3(1.0, 0.8, 0.0), n * 0.5);
            float rim = pow(1.0 - dot(vNormal, vec3(0,0,1)), 2.0);
            gl_FragColor = vec4(sunColor + rim, 1.0);
        }
    `
};

export const StarFlareShader = {
    uniforms: {
        color: { value: new THREE.Color(0xffcc00) }
    },
    vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        varying vec2 vUv;
        uniform vec3 color;
        void main() {
            vec2 uv = vUv - 0.5;
            float dist = length(uv);
            
            float beam1 = smoothstep(0.01, 0.0, abs(uv.x) * (1.0 + abs(uv.y) * 50.0));
            float beam2 = smoothstep(0.01, 0.0, abs(uv.y) * (1.0 + abs(uv.x) * 50.0));
            float beam3 = smoothstep(0.02, 0.0, abs(uv.x - uv.y) * (1.5 + dist * 20.0));
            float beam4 = smoothstep(0.02, 0.0, abs(uv.x + uv.y) * (1.5 + dist * 20.0));
            
            float glow = exp(-dist * 10.0);
            float flare = (beam1 + beam2) * 0.8 + (beam3 + beam4) * 0.4 + glow;
            
            gl_FragColor = vec4(color, flare * smoothstep(0.5, 0.2, dist));
        }
    `
};