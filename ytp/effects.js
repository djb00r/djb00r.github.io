export class Effects {
  constructor() {
    this.loaded = false;
    this.audioContext = null;
    this.audioBuffer = null;
    this.mlgSoundEffects = [
      'Bruh Sound Effect #2',
      'Oh Baby a Triple',
      'Wow',
      'Air Horn',
      'Hitmarker',
      'Mom Get The Camera',
      'Smoke Weed Everyday',
      'SAD VIOLIN'
    ];
  }

  initAudioContext() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  async process(sourceVideo, intensity, useAudio = false) {
    try {
      if (!sourceVideo || !sourceVideo.videoWidth) {
        throw new Error('Invalid video input');
      }

      // Force wait for video metadata
      await new Promise((resolve) => {
        if (sourceVideo.readyState >= 2) {
          resolve();
        } else {
          sourceVideo.addEventListener('loadedmetadata', () => resolve());
        }
      });

      let duration = sourceVideo.duration;
      if (duration > 30) {
        duration = 30;
        console.warn('Video length capped at 30 seconds');
      }

      const canvas = document.createElement('canvas');
      // Maintain source video dimensions
      canvas.width = sourceVideo.videoWidth;
      canvas.height = sourceVideo.videoHeight;
      const ctx = canvas.getContext('2d', {
        willReadFrequently: true,
        alpha: false
      });

      const frameRate = 30;
      const totalFrames = Math.floor(frameRate * duration);
      const frames = [];

      // Ensure video can seek
      sourceVideo.currentTime = 0;
      await new Promise(resolve => setTimeout(resolve, 100));

      // Capture frames with better error handling
      for (let i = 0; i < totalFrames; i++) {
        const time = i / frameRate;
        sourceVideo.currentTime = time;
        
        await new Promise((resolve) => {
          const checkReady = () => {
            if (sourceVideo.readyState >= 3) {
              try {
                ctx.drawImage(sourceVideo, 0, 0, canvas.width, canvas.height);
                const frameData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                frames.push(frameData);
                if (this.onProgress) {
                  const progress = (i / totalFrames) * 100;
                  this.onProgress(progress);
                }
                resolve();
              } catch (err) {
                console.warn('Frame capture error:', err);
                // Still resolve to continue processing
                resolve();
              }
            } else {
              requestAnimationFrame(checkReady);
            }
          };
          checkReady();
        });
      }

      // Load meme faces for overlays
      const [marioImg, watermark] = await Promise.all([
        this.loadImage('https://upload.wikimedia.org/wikipedia/en/5/5c/Mario_by_Shigehisa_Nakaue.png'),
        this.loadImage('ytp-maker-reopend-2-19-2025.png')
      ]).catch(err => {
        console.warn('Failed to load some images:', err);
        return [null, null];
      });

      const processedFrames = this.applyEffects(frames, intensity, canvas.width, canvas.height, marioImg);

      const outputCanvas = document.createElement('canvas');
      outputCanvas.width = canvas.width;
      outputCanvas.height = canvas.height;
      const outputCtx = outputCanvas.getContext('2d', { alpha: false });

      const outputStream = outputCanvas.captureStream(frameRate);
      
      if (useAudio) {
        try {
          this.initAudioContext();
          const audioTrack = await this.createMLGAudioTrack(duration);
          outputStream.addTrack(audioTrack);
        } catch (err) {
          console.warn('Audio processing error:', err);
        }
      }

      const mimeType = this.getSupportedMimeType();
      if (!mimeType) {
        throw new Error("No supported MIME type found.");
      }

      const mediaRecorder = new MediaRecorder(outputStream, {
        mimeType: mimeType,
        videoBitsPerSecond: 2500000
      });

      const chunks = [];
      mediaRecorder.ondataavailable = e => chunks.push(e.data);

      const videoPromise = new Promise((resolve, reject) => {
        mediaRecorder.onstop = () => {
          try {
            const blob = new Blob(chunks, { type: mimeType });
            resolve(blob);
          } catch (err) {
            reject(new Error('Failed to create video blob: ' + err.message));
          }
        };
        mediaRecorder.onerror = reject;
      });

      mediaRecorder.start();

      let frameIndex = 0;
      const startTime = performance.now();
      const frameDuration = 1000 / frameRate;

      const renderFrame = (timestamp) => {
        if (frameIndex >= processedFrames.length) {
          mediaRecorder.stop();
          return;
        }
        const elapsed = timestamp - startTime;
        const targetFrame = Math.floor(elapsed / frameDuration);
        
        while (frameIndex <= targetFrame && frameIndex < processedFrames.length) {
          try {
            outputCtx.putImageData(processedFrames[frameIndex], 0, 0);
            frameIndex++;
          } catch (err) {
            console.warn('Frame rendering error:', err);
            frameIndex++;
          }
        }
        
        if (frameIndex < processedFrames.length) {
          requestAnimationFrame(renderFrame);
        } else {
          mediaRecorder.stop();
        }
      };

      requestAnimationFrame(renderFrame);
      return await videoPromise;

    } catch (error) {
      console.error('Effect processing error:', error);
      throw error;
    }
  }

  getSupportedMimeType() {
    const types = [
      'video/webm;codecs=vp9,opus',
      'video/webm;codecs=vp8,opus',
      'video/webm',
    ];
    return types.find(type => MediaRecorder.isTypeSupported(type));
  }

  loadImage(url) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = url;
    });
  }

  applyEffects(frames, intensity, width, height, marioImg) {
    const processedFrames = [...frames];
    const effectsCount = Math.floor((frames.length * intensity) / 10);
    const effects = [
      'colorDistortion',
      'whirl',
      'spin',
      'resize',
      'textOverlay',
      'fisheye',
      'marioAppear',
      'mlgText',
      'mtnDewOverlay'
    ];

    const texts = [
      'YAHOO!',
      'IT\'S-A ME!',
      'MAMA MIA!',
      'HERE WE GO!',
      'WAH HOO!',
      'GET NOSCOPED',
      'OMG',
      'DRAMATIC ZOOM',
      'OH BABY A TRIPLE',
      'CONFIRMED'
    ];

    const mlgText = [
      'DEAL WITH IT',
      '420 BLAZE IT',
      'MOM GET THE CAMERA',
      'FAZE UP',
      'ILLUMINATI CONFIRMED',
      'SMOKE WEED EVERYDAY'
    ];

    for (let i = 0; i < effectsCount; i++) {
      const startFrame = Math.floor(Math.random() * (frames.length - 10));
      const effectLength = Math.floor(Math.random() * 10) + 5;
      const effect = effects[Math.floor(Math.random() * effects.length)];

      for (let j = startFrame; j < startFrame + effectLength && j < frames.length; j++) {
        const frame = processedFrames[j];
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = width;
        tempCanvas.height = height;
        const tempCtx = tempCanvas.getContext('2d');
        tempCtx.putImageData(frame, 0, 0);

        switch (effect) {
          case 'colorDistortion':
            const data = frame.data;
            for (let p = 0; p < data.length; p += 4) {
              data[p] = data[p] * (1 + Math.random() - 0.5);
              data[p + 1] = data[p + 1] * (1 + Math.random() - 0.5);
              data[p + 2] = data[p + 2] * (1 + Math.random() - 0.5);
            }
            break;

          case 'whirl':
          case 'spin':
          case 'resize':
            const angle = (j - startFrame) * (effect === 'whirl' ? 0.1 : 0.2);
            const scale = effect === 'resize' ? 1 + Math.sin((j - startFrame) * 0.2) * 0.3 : 1;
            tempCtx.translate(width / 2, height / 2);
            tempCtx.rotate(angle);
            tempCtx.scale(scale, scale);
            tempCtx.translate(-width / 2, -height / 2);
            tempCtx.drawImage(tempCanvas, 0, 0);
            break;

          case 'textOverlay':
            const text = texts[Math.floor(Math.random() * texts.length)];
            tempCtx.font = 'bold 48px Mario64';
            tempCtx.fillStyle = 'white';
            tempCtx.strokeStyle = 'black';
            tempCtx.lineWidth = 4;
            tempCtx.textAlign = 'center';
            tempCtx.strokeText(text, width / 2, height / 2);
            tempCtx.fillText(text, width / 2, height / 2);
            break;

          case 'marioAppear':
            const marioSize = height * 0.5;
            const marioX = Math.random() * (width - marioSize);
            const marioY = Math.random() * (height - marioSize);
            tempCtx.globalAlpha = 0.7;
            tempCtx.drawImage(marioImg, marioX, marioY, marioSize, marioSize);
            tempCtx.globalAlpha = 1.0;
            break;

          case 'mlgText':
            const mlg = mlgText[Math.floor(Math.random() * mlgText.length)];
            tempCtx.font = 'bold 36px Arial';
            tempCtx.fillStyle = 'red';
            tempCtx.strokeStyle = 'black';
            tempCtx.lineWidth = 3;
            tempCtx.textAlign = 'center';
            tempCtx.strokeText(mlg, width / 2, height * 0.8);
            tempCtx.fillText(mlg, width / 2, height * 0.8);
            break;

          case 'mtnDewOverlay':
            tempCtx.fillStyle = 'lime';
            tempCtx.globalAlpha = 0.3;
            tempCtx.fillRect(0, 0, width, height);
            tempCtx.globalAlpha = 1.0;
            break;

          case 'fisheye':
            const centerX = width / 2;
            const centerY = height / 2;
            const maxRadius = Math.min(centerX, centerY);
            const imageData = tempCtx.getImageData(0, 0, width, height);
            const dat = imageData.data;
            for (let y = 0; y < height; y++) {
              for (let x = 0; x < width; x++) {
                const deltaX = x - centerX;
                const deltaY = y - centerY;
                const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
                if (distance < maxRadius) {
                  const radius = distance / maxRadius;
                  const angle = Math.atan2(deltaY, deltaX);
                  const newRadius = Math.pow(radius, 0.5);
                  const newX = centerX + newRadius * maxRadius * Math.cos(angle);
                  const newY = centerY + newRadius * maxRadius * Math.sin(angle);
                  if (newX >= 0 && newX < width && newY >= 0 && newY < height) {
                    const newXInt = Math.floor(newX);
                    const newYInt = Math.floor(newY);
                    const originalIndex = (y * width + x) * 4;
                    const newIndex = (newYInt * width + newXInt) * 4;
                    dat[originalIndex] = frame.data[newIndex];
                    dat[originalIndex + 1] = frame.data[newIndex + 1];
                    dat[originalIndex + 2] = frame.data[newIndex + 2];
                    dat[originalIndex + 3] = frame.data[newIndex + 3];
                  }
                }
              }
            }
            tempCtx.putImageData(imageData, 0, 0);
            break;
        }
        processedFrames[j] = tempCtx.getImageData(0, 0, width, height);
      }
    }
    return processedFrames;
  }

  async createMLGAudioTrack(duration) {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const destination = audioCtx.createMediaStreamDestination();

    // Load all audio files
    const audioFiles = [
      'mlg-airhorn.mp3',
      'ohhhhhh.mp3', 
      'nioce.mp3',
      'movie_1.mp3',
      'its-me-mario.mp3'
    ];

    // Create buffers array to store loaded audio
    const audioBuffers = await Promise.all(
      audioFiles.map(async file => {
        const response = await fetch(file);
        const arrayBuffer = await response.arrayBuffer();
        return await audioCtx.decodeAudioData(arrayBuffer);
      })
    );

    // Calculate number of effects - one every 1-2 seconds
    const numEffects = Math.floor(duration); // One effect per second on average
    
    // Add sound effects throughout the duration
    for (let i = 0; i < numEffects; i++) {
      const source = audioCtx.createBufferSource();
      const gainNode = audioCtx.createGain();
      
      // Pick random audio buffer
      const randomBuffer = audioBuffers[Math.floor(Math.random() * audioBuffers.length)];
      source.buffer = randomBuffer;
      
      // Space effects 1-2 seconds apart
      const startTime = audioCtx.currentTime + (i * (1 + Math.random())); // Random spacing between 1-2 seconds
      
      // Keep volume consistent but not too loud
      gainNode.gain.value = 0.5;
      
      source.connect(gainNode);
      gainNode.connect(destination);
      
      source.start(startTime);
      source.stop(startTime + randomBuffer.duration);
    }

    return destination.stream.getAudioTracks()[0];
  }
}