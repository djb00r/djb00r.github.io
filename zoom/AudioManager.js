export class AudioManager {
    constructor() {
        this.ctx = null;
        this.zoomOsc = null;
        this.zoomGain = null;
        this.ambient = null;
        this.ambientSource = null;
        this.tickBuffer = null;
        this.isInitialized = false;
        this.isPlayingAmbient = false;
    }

    // Prepare audio nodes and buffers but don't start playback until a user gesture resumes the context.
    async init() {
        if (this.isInitialized) return;
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();

        // Zoom Synth
        this.zoomOsc = this.ctx.createOscillator();
        this.zoomGain = this.ctx.createGain();
        this.zoomOsc.type = 'sine';
        this.zoomGain.gain.setValueAtTime(0, this.ctx.currentTime);
        this.zoomOsc.connect(this.zoomGain);
        this.zoomGain.connect(this.ctx.destination);
        this.zoomOsc.start();

        // Ambient element created but not played here to avoid autoplay rejection
        this.ambient = new Audio('/cosmic_ambient.mp3');
        this.ambient.loop = true;
        this.ambient.volume = 0.3;

        // We'll create the media element source later when the context is resumed
        // Tick SFX
        try {
            const response = await fetch('/zoom_tick.mp3');
            const arrayBuffer = await response.arrayBuffer();
            this.tickBuffer = await this.ctx.decodeAudioData(arrayBuffer);
        } catch (e) {
            console.error("Failed to load tick SFX", e);
        }

        this.isInitialized = true;
    }

    // Call resume() in response to a user gesture to satisfy browser autoplay policy
    async resume() {
        if (!this.isInitialized) {
            await this.init();
        }
        try {
            if (this.ctx.state === 'suspended') {
                await this.ctx.resume();
            }
        } catch (e) {
            // ignore resume errors; we'll attempt playback below
            console.warn('AudioContext resume failed:', e);
        }

        if (!this.isPlayingAmbient) {
            try {
                // Connect the media element into the audio context and start playback
                if (!this.ambientSource) {
                    this.ambientSource = this.ctx.createMediaElementSource(this.ambient);
                    this.ambientSource.connect(this.ctx.destination);
                }
                await this.ambient.play();
                this.isPlayingAmbient = true;
            } catch (e) {
                // If play() still fails, log but don't throw
                console.warn('Ambient play() failed:', e);
            }
        }
    }

    updateZoom(speed) {
        if (!this.isInitialized) return;
        const absSpeed = Math.abs(speed);
        if (this.zoomGain && this.ctx) {
            this.zoomGain.gain.setTargetAtTime(Math.min(absSpeed * 0.15, 0.06), this.ctx.currentTime, 0.1);
            this.zoomOsc.frequency.setTargetAtTime(100 + absSpeed * 250, this.ctx.currentTime, 0.1);
        }
    }

    playTick() {
        if (!this.isInitialized || !this.tickBuffer) return;
        const source = this.ctx.createBufferSource();
        source.buffer = this.tickBuffer;
        const gain = this.ctx.createGain();
        gain.gain.value = 0.2;
        source.connect(gain);
        gain.connect(this.ctx.destination);
        source.start();
    }
}