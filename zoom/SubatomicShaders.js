import * as THREE from 'three';

export const StringShader = {
    uniforms: {
        time: { value: 0 },
        color: { value: new THREE.Color(0x00ffff) }
    },
    vertexShader: `
        uniform float time;
        varying float vAlpha;
        varying float vPos;
        void main() {
            vec3 pos = position;
            vPos = position.x;
            float freq = 8.0;
            float amp = 0.25;
            pos.y += sin(pos.x * freq + time * 12.0) * amp;
            pos.z += cos(pos.x * freq * 1.2 + time * 10.0 + 1.0) * amp;
            pos.y += sin(pos.x * freq * 2.5 - time * 18.0) * amp * 0.3;
            
            vAlpha = 1.0 - abs(position.x) / 1.25;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
    `,
    fragmentShader: `
        uniform vec3 color;
        uniform float time;
        varying float vAlpha;
        varying float vPos;
        void main() {
            float pulse = step(0.9, fract(vPos * 0.5 - time * 2.0));
            vec3 finalColor = mix(color, vec3(1.0), pulse * 0.5);
            gl_FragColor = vec4(finalColor, vAlpha * (0.4 + pulse * 0.3));
        }
    `
};

export const FoamShader = {
    uniforms: {
        time: { value: 0 },
        color: { value: new THREE.Color(0x5555ff) }
    },
    vertexShader: `
        varying vec3 vNormal;
        varying vec3 vPos;
        uniform float time;
        void main() {
            vPos = position;
            vNormal = normalize(normalMatrix * normal);
            float noise = sin(position.x * 15.0 + time * 2.0) * cos(position.y * 12.0 + time * 1.5) * 0.15;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position + normal * noise, 1.0);
        }
    `,
    fragmentShader: `
        uniform vec3 color;
        uniform float time;
        varying vec3 vNormal;
        varying vec3 vPos;
        void main() {
            float pulse = sin(time * 3.0 + length(vPos) * 15.0) * 0.5 + 0.5;
            float rim = pow(1.0 - max(dot(vNormal, vec3(0,0,1)), 0.0), 2.5);
            gl_FragColor = vec4(color + pulse * 0.4, (rim + 0.1) * 0.7);
        }
    `
};