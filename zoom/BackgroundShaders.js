import * as THREE from 'three';

export const StarFieldShader = {
    uniforms: {
        time: { value: 0 },
        pixelRatio: { value: window.devicePixelRatio },
        isHell: { value: 0.0 }
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
        
        float hash(vec2 p) {
            return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
        }

        uniform float isHell;
        void main() {
            vec2 uv = vUv * 2.0 - 1.0;
            float density = 0.0;
            for(float i = 1.0; i < 4.0; i++) {
                vec2 grid = uv * 60.0 * i;
                vec2 id = floor(grid);
                float h = hash(id);
                if(h > 0.996) {
                    float d = distance(fract(grid), vec2(0.5));
                    float flicker = sin(time * 2.0 + h * 10.0) * 0.5 + 0.5;
                    density += (1.0 - smoothstep(0.0, 0.1, d)) * h * flicker;
                }
            }
            vec3 starColor = mix(vec3(1.0), vec3(1.0, 0.2, 0.0), isHell);
            vec3 bgColor = mix(vec3(0.0), vec3(0.1, 0.0, 0.0), isHell);
            gl_FragColor = vec4(bgColor + starColor * density, 1.0);
        }
    `
};