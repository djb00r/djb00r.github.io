import { Effects } from './effects.js';

document.addEventListener('DOMContentLoaded', async () => {
  // Start with intro screen
  const introScreen = document.querySelector('.intro-screen');
  const ytpSplash = document.querySelector('.ytp-splash');
  const container = document.querySelector('.container');
  const quotes = document.querySelectorAll('.quote');
  
  // Hide main container initially
  container.style.display = 'none';
  
  // Show intro for 1 second
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Fade out intro
  introScreen.classList.add('fade-out');
  await new Promise(resolve => setTimeout(resolve, 500));
  introScreen.style.display = 'none';
  
  // Show splash screen
  ytpSplash.style.display = 'block';

  // 10% chance to play meme sound
  if (Math.random() < 0.1) {
    const memeSound = new Audio('My life be like  meme sound.mp3');
    memeSound.play().catch(console.error);
  }
  
  // Show random quote
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
  quotes.forEach(q => q.style.display = 'none');
  randomQuote.style.display = 'block';
  
  // Animate loading bar
  const loadingProgress = document.querySelector('.splash-loading-progress');
  loadingProgress.style.width = '100%';
  
  // Wait 3 seconds
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Fade out splash
  ytpSplash.classList.add('fade-out');
  await new Promise(resolve => setTimeout(resolve, 500));
  ytpSplash.style.display = 'none';

  // Show projects popup
  const projectsPopup = document.createElement('div');
  projectsPopup.className = 'projects-popup';
  projectsPopup.innerHTML = `
    <div class="projects-content">
      <h2>Check Out My Other Projects!</h2>
      <button class="close-popup">×</button>
    </div>
  `;
  document.body.appendChild(projectsPopup);

  // Add click handler to close button
  projectsPopup.querySelector('.close-popup').addEventListener('click', () => {
    projectsPopup.classList.add('fade-out');
    setTimeout(() => projectsPopup.remove(), 500);
  });
  
  // Show main container  
  container.style.display = 'block';

  const elements = {
    container: document.querySelector('.container'),
    videoInput: document.getElementById('videoInput'),
    sourceVideo: document.getElementById('sourceVideo'),
    outputVideo: document.getElementById('outputVideo'),
    generateBtn: document.getElementById('generateBtn'),
    downloadBtn: document.getElementById('downloadBtn'),
    publishBtn: document.getElementById('publishBtn'),
    intensitySlider: document.getElementById('intensitySlider'),
    intensityValue: document.getElementById('intensityValue'),
    durationInput: document.getElementById('durationInput'),
    uploadSection: document.querySelector('.upload-section'),
    ytpFeed: document.getElementById('ytpFeed'),
    makeTab: document.getElementById('makeTab'),
    communityTab: document.getElementById('communityTab'),
    tabBtns: document.querySelectorAll('.tab-btn'),
    bsod: document.querySelector('.bsod'),
    experimentalMenu: document.getElementById('experimentalMenu'),
    audioToggle: document.getElementById('audioToggle'),
    themeSelector: document.getElementById('themeSelector'),
    durationToggle: document.getElementById('durationToggle'),
    durationPickerContainer: document.getElementById('durationPickerContainer'),
    settingsTab: document.getElementById('settingsTab'),
    sourcePlaceholder: document.getElementById('sourcePlaceholder'),
    outputPlaceholder: document.getElementById('outputPlaceholder'),
    tutorialBtn: document.getElementById('tutorialBtn')
  };

  // Verify all elements exist
  for (const [key, element] of Object.entries(elements)) {
    if (!element) {
      console.error(`Missing element: ${key}`);
      return;
    }
  }

  // Re-add functionality: Update source video playback rate to "time stretch" it to match the duration override (and thus the progress bar)
  const updateSourceVideoPlaybackRate = () => {
    if (elements.sourceVideo.readyState >= 2) {
      if (elements.durationToggle.checked) {
        const inputDuration = parseInt(elements.durationInput.value, 10) || elements.sourceVideo.duration;
        const targetDuration = Math.min(inputDuration, 30);
        elements.sourceVideo.playbackRate = elements.sourceVideo.duration / targetDuration;
      } else {
        elements.sourceVideo.playbackRate = 1;
      }
    }
  };

  elements.sourceVideo.addEventListener('loadedmetadata', updateSourceVideoPlaybackRate);
  elements.durationToggle.addEventListener('change', updateSourceVideoPlaybackRate);
  elements.durationInput.addEventListener('input', updateSourceVideoPlaybackRate);

  // Fix tab functionality
  elements.tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');
      const tabId = targetTab + 'Tab';
      elements.tabBtns.forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
        content.style.display = 'none';
      });
      btn.classList.add('active');
      const tabContent = document.getElementById(tabId);
      if (tabContent) {
        tabContent.style.display = 'block';
        setTimeout(() => tabContent.classList.add('active'), 50);
      }
      // Auto-update community feed when the Community tab is clicked
      if (targetTab === 'community') {
        updateCommunityFeed();
      }
    });
  });

  document.querySelector('[data-tab="more-games"]').addEventListener('click', () => {
    window.open('https://websim.ai/@autumn', '_blank');
  });

  elements.intensitySlider.addEventListener('input', () => {
    elements.intensityValue.textContent = elements.intensitySlider.value;
  });

  // Setup WebSocket room subscription
  const room = new WebsimSocket();
  const effects = new Effects();
  let lastOutputURL = null;

  // Subscribe to post updates
  room.collection('ytp_post').subscribe(async (posts) => {
    console.log('Posts subscription triggered:', posts);
    await updateCommunityFeed();
  });

  // Subscribe to reaction updates
  room.collection('ytp_reaction').subscribe(async () => {
    const posts = await room.collection('ytp_post').getList();
    for (const post of posts) {
      await updateReactionCounts(post.id);
    }
  });

  // Subscribe to comment updates
  room.collection('ytp_comment').subscribe(async () => {
    const posts = await room.collection('ytp_post').getList();
    for (const post of posts) {
      await loadComments(post.id);
    }
  });

  // Improved community feed update function
  async function updateCommunityFeed() {
    try {
      console.log('Updating community feed...');
      const posts = await room.collection('ytp_post').getList();
      console.log('Retrieved posts:', posts);

      if (!elements.ytpFeed) {
        console.error('YTP feed element not found');
        return;
      }

      elements.ytpFeed.innerHTML = `
        <div class="community-achievements">
          <h3>Community Achievements</h3>
          <span class="view-badge">500+ YTPs Created!</span>
          <span class="view-badge">HOT PAGE ACHIEVED!</span>
        </div>
      `;

      if (!posts || posts.length === 0) {
        elements.ytpFeed.innerHTML += '<p>No community posts yet. Be the first to share!</p>';
        return;
      }

      // Sort posts by creation date (newest first)
      const sortedPosts = [...posts].sort((a, b) => 
        new Date(b.created_at) - new Date(a.created_at)
      );

      for (const post of sortedPosts) {
        const postElement = document.createElement('div');
        postElement.className = 'ytp-post';
        postElement.dataset.postId = post.id;
        
        postElement.innerHTML = `
          <div class="ytp-post-header">
            <img class="ytp-post-avatar" src="https://images.websim.ai/avatar/${post.username}" alt="Avatar" crossorigin="anonymous">
            <div class="ytp-post-info">
              <div class="ytp-post-username">${post.username}</div>
              <div class="ytp-post-date">${new Date(post.created_at).toLocaleString()}</div>
            </div>
          </div>
          <video src="${post.videoUrl}" controls style="width: 100%; border-radius: 8px;"></video>
          <div class="ytp-post-stats">
            <span>Intensity: ${post.intensity || 'Unknown'}</span>
          </div>
          <div class="ytp-post-reactions">
            <button class="reaction-btn mlg-wow" data-post-id="${post.id}">
              OHHHHHHHHHHHHHHH (<span class="wow-count">0</span>)
            </button>
            <button class="reaction-btn mlg-rekt" data-post-id="${post.id}">
              This is the biggest piece of dog poop (<span class="rekt-count">0</span>)
            </button>
          </div>
          <div class="comment-section">
            <textarea class="comment-input" placeholder="Talk (comment)..." rows="2"></textarea>
            <button class="comment-btn" data-post-id="${post.id}">Talk (comment)</button>
            <div class="comments-list" data-post-id="${post.id}"></div>
          </div>
        `;

        elements.ytpFeed.appendChild(postElement);
        await updateReactionCounts(post.id);
        await loadComments(post.id);
      }
    } catch (error) {
      console.error('Error updating community feed:', error);
      elements.ytpFeed.innerHTML += `
        <p style="color: red;">Error loading community feed: ${error.message}</p>
        <button onclick="updateCommunityFeed()">Retry</button>
      `;
    }
  }

  // Improved reaction handling
  async function updateReactionCounts(postId) {
    try {
      const reactions = await room.collection('ytp_reaction').filter({ post_id: postId }).getList();
      const wows = reactions.filter(r => r.type === 'wow').length;
      const rekts = reactions.filter(r => r.type === 'rekt').length;
      
      const post = document.querySelector(`[data-post-id="${postId}"]`);
      if (!post) return;
      
      const wowCount = post.querySelector('.wow-count');
      const rektCount = post.querySelector('.rekt-count');
      
      if (wowCount) wowCount.textContent = wows;
      if (rektCount) rektCount.textContent = rekts;
    } catch (error) {
      console.error(`Error updating reactions for post ${postId}:`, error);
    }
  }

  // Improved comment loading
  async function loadComments(postId) {
    try {
      const comments = await room.collection('ytp_comment')
        .filter({ post_id: postId })
        .getList();
      
      const commentsList = document.querySelector(`.comments-list[data-post-id="${postId}"]`);
      if (!commentsList) return;

      commentsList.innerHTML = comments
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .map(comment => `
          <div class="comment">
            <div class="comment-header">
              <img class="comment-avatar" src="https://images.websim.ai/avatar/${comment.username}" alt="Avatar">
              <span class="comment-username">${comment.username}</span>
              <span class="comment-timestamp">${new Date(comment.created_at).toLocaleString()}</span>
            </div>
            <div class="comment-content">${comment.text}</div>
          </div>
        `).join('');
    } catch (error) {
      console.error(`Error loading comments for post ${postId}:`, error);
    }
  }

  // Event listener for reactions and comments
  elements.ytpFeed.addEventListener('click', async (e) => {
    const button = e.target.closest('.reaction-btn, .comment-btn');
    if (!button) return;

    const postId = button.dataset.postId;
    
    if (button.classList.contains('reaction-btn')) {
      try {
        const type = button.classList.contains('mlg-wow') ? 'wow' : 'rekt';
        await room.collection('ytp_reaction').create({
          post_id: postId,
          type: type
        });
        await updateReactionCounts(postId);
      } catch (error) {
        console.error('Error adding reaction:', error);
        alert('Failed to add reaction: ' + error.message);
      }
    } else if (button.classList.contains('comment-btn')) {
      const commentInput = button.previousElementSibling;
      const text = commentInput.value.trim();
      
      if (text) {
        try {
          await room.collection('ytp_comment').create({
            post_id: postId,
            text: text
          });
          commentInput.value = '';
          await loadComments(postId);
        } catch (error) {
          console.error('Error posting comment:', error);
          alert('Failed to post comment: ' + error.message);
        }
      }
    }
  });

  elements.generateBtn.addEventListener('click', async () => {
    try {
      if (!elements.sourceVideo.src) {
        throw new Error('Please select a video first');
      }

      elements.generateBtn.disabled = true;
      elements.generateBtn.textContent = 'Processing...';
      elements.outputPlaceholder.classList.add('hidden');
      
      if (lastOutputURL) {
        URL.revokeObjectURL(lastOutputURL);
      }

      // Show processing feedback
      const progressBar = document.querySelector('.xp-loading-bar');
      if (progressBar) {
        progressBar.style.width = '0%';
      }

      effects.onProgress = progress => {
        if (progressBar) {
          progressBar.style.width = progress + '%';
        }
      };

      // Process video
      const useAudio = elements.audioToggle && elements.audioToggle.checked;
      const outputBlob = await effects.process(
        elements.sourceVideo,
        parseInt(elements.intensitySlider.value),
        useAudio
      );

      if (!outputBlob) {
        throw new Error('Failed to generate video');
      }

      // Create new blob URL for the output video
      lastOutputURL = URL.createObjectURL(outputBlob);
      
      // Load the video with proper error handling
      elements.outputVideo.src = lastOutputURL;
      await new Promise((resolve, reject) => {
        elements.outputVideo.onloadedmetadata = () => resolve();
        elements.outputVideo.onerror = () => reject(new Error('Failed to load output video'));
        // Set timeout in case video never loads
        setTimeout(() => reject(new Error('Video loading timeout')), 10000);
      });

      // Try to play the video
      try {
        await elements.outputVideo.play();
      } catch (playError) {
        console.warn('Auto-play failed:', playError);
      }

      // Show download and publish buttons
      elements.downloadBtn.style.display = 'inline-block';
      elements.publishBtn.style.display = 'inline-block';
      
    } catch (error) {
      console.error('Processing error:', error);
      alert('Error generating video: ' + error.message);
      
      // Reset video and interface state
      if (elements.outputVideo.src) {
        URL.revokeObjectURL(elements.outputVideo.src);
        elements.outputVideo.src = '';
      }
      elements.outputPlaceholder.classList.remove('hidden');
      elements.downloadBtn.style.display = 'none';
      elements.publishBtn.style.display = 'none';
    } finally {
      elements.generateBtn.disabled = false;
      elements.generateBtn.textContent = 'Generate YTP';
    }
  });

  elements.publishBtn.addEventListener('click', async () => {
    try {
      if (!lastOutputURL) {
        throw new Error('No video available to publish. Please generate a YTP first.');
      }
      
      elements.publishBtn.disabled = true;
      elements.publishBtn.textContent = 'Publishing...';

      // Convert the blob URL to an actual Blob object
      const response = await fetch(lastOutputURL);
      if (!response.ok) {
        throw new Error('Failed to fetch video data');
      }
      
      const blob = await response.blob();
      const file = new File([blob], 'ytp.mp4', { type: 'video/mp4' });

      // Upload to S3 and get URL
      console.log('Uploading video...');
      const videoUrl = await websim.upload(file);
      console.log('Video uploaded, URL:', videoUrl);

      if (!videoUrl) {
        throw new Error('Video upload failed - no URL returned');
      }

      // Create post in database
      console.log('Creating post...');
      const post = await room.collection('ytp_post').create({
        videoUrl: videoUrl,
        intensity: parseInt(elements.intensitySlider.value)
      });
      
      console.log('Post created:', post);

      // Show success message
      alert('YTP published successfully!');
      
      // Refresh community feed after publishing
      await updateCommunityFeed();

      // Switch to community tab to show the new post
      const communityTabBtn = document.querySelector('[data-tab="community"]');
      if (communityTabBtn) {
        communityTabBtn.click();
      }

    } catch (error) {
      console.error('Publishing error:', error);
      alert('Error publishing video: ' + error.message);
    } finally {
      elements.publishBtn.disabled = false;
      elements.publishBtn.textContent = 'Share YTP';
    }
  });

  elements.downloadBtn.addEventListener('click', async () => {
    if (lastOutputURL) {
      try {
        const response = await fetch(lastOutputURL);
        const blob = await response.blob();
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'ytp_creation.mp4';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(a.href);
      } catch (error) {
        console.error('Error downloading video:', error);
        alert('Error downloading video:' + error.message);
      }
    } else {
      alert('No video available to download. Please generate a YTP first.');
    }
  });

  // Tutorial functionality
  const startTutorial = async () => {
    const tutorialOverlay = document.getElementById('tutorialOverlay');
    const mario = document.querySelector('.mario-tutor');
    const speechBubble = document.querySelector('.speech-bubble');
    tutorialOverlay.style.display = 'block';
    const fileInput = document.getElementById('videoInput');
    const uploadLabel = document.querySelector('label[for="videoInput"]');
    mario.style.position = 'absolute';
    speechBubble.style.position = 'absolute';
    const uploadRect = uploadLabel.getBoundingClientRect();
    mario.style.left = (uploadRect.left - 100) + 'px';
    mario.style.top = uploadRect.top + 'px';
    mario.style.animation = 'glide 1s forwards';
    speechBubble.style.display = 'block';
    speechBubble.style.left = (uploadRect.left + 50) + 'px';
    speechBubble.style.top = (uploadRect.top - 100) + 'px';
    speechBubble.textContent = "Let's-a make a YTP! First, we need to choose a video!";
    await new Promise(resolve => setTimeout(resolve, 2000));
    try {
      const response = await fetch('./-1981343311349995222.mp4');
      const blob = await response.blob();
      const demoVideo = new File([blob], 'demo.mp4', { type: 'video/mp4' });
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(demoVideo);
      fileInput.files = dataTransfer.files;
      const event = new Event('change', { bubbles: true });
      fileInput.dispatchEvent(event);
      await new Promise(resolve => setTimeout(resolve, 1500));
    } catch (error) {
      console.error('Error in tutorial demo video:', error);
    }
    const intensitySlider = document.getElementById('intensitySlider');
    const sliderRect = intensitySlider.getBoundingClientRect();
    mario.style.left = (sliderRect.left - 100) + 'px';
    mario.style.top = sliderRect.top + 'px';
    speechBubble.style.left = (sliderRect.left + 50) + 'px';
    speechBubble.style.top = (sliderRect.top - 100) + 'px';
    speechBubble.textContent = "Now let's set the intensity! And check out these experimental features! Wahoo!";
    await new Promise(resolve => setTimeout(resolve, 2000));
    const generateBtn = document.getElementById('generateBtn');
    const generateRect = generateBtn.getBoundingClientRect();
    mario.style.left = (generateRect.left - 100) + 'px';
    mario.style.top = generateRect.top + 'px';
    speechBubble.style.left = (generateRect.left + 50) + 'px';
    speechBubble.style.top = (generateRect.top - 100) + 'px';
    speechBubble.textContent = "Just you wait! This takes 1-2 minutes!";
    await new Promise(resolve => setTimeout(resolve, 1000));
    generateBtn.click();
    const checkOutput = setInterval(() => {
      if (elements.outputVideo.src) {
        clearInterval(checkOutput);
        finishTutorial();
      }
    }, 500);
  };

  const finishTutorial = async () => {
    const speechBubble = document.querySelector('.speech-bubble');
    speechBubble.textContent = "Yahoo! Your first YTP is ready! Now you can download it or share it with the community!";
    const mario = document.querySelector('.mario-tutor');
    mario.style.animation = 'bounce 1s infinite';
    await new Promise(resolve => setTimeout(resolve, 3000));
    const tutorialOverlay = document.getElementById('tutorialOverlay');
    tutorialOverlay.style.display = 'none';
  };

  if (elements.tutorialBtn) {
    elements.tutorialBtn.addEventListener('click', startTutorial);
  }

  // Optionally, update community feed on page load
  updateCommunityFeed();

  function showConfirmation(message) {
    alert(message);
  }

  // Make "Make YTP" tab default
  document.querySelector('[data-tab="make"]').classList.add('active');
  document.getElementById('makeTab').classList.add('active');
  document.getElementById('makeTab').style.display = 'block';

  elements.audioToggle.checked = true; // Set audio enabled by default

  // Handle reactions on community posts
  elements.ytpFeed.addEventListener('click', async (e) => {
    if (e.target.closest('.reaction-btn')) {
      const button = e.target.closest('.reaction-btn');
      const postId = button.dataset.postId;
      const reactionType = button.classList.contains('mlg-wow') ? 'wow' : 'rekt';
      try {
        await room.collection('ytp_reaction').create({
          post_id: postId,
          type: reactionType
        });
        updateReactionCounts(postId);
      } catch (error) {
        console.error('Error adding reaction:', error);
        alert('Error adding reaction:' + error.message);
      }
    }
  });

  // Fix file upload functionality
  const handleFile = async (file) => {
    elements.sourcePlaceholder.classList.remove('hidden');
    elements.outputPlaceholder.classList.remove('hidden');
    try {
      const validTypes = [
        'video/mp4',
        'video/webm',
        'video/quicktime',
        'video/x-m4v',
        'video/avi',
        'video/mpeg',
        'video/x-matroska'
      ];
      if (!file) {
        throw new Error('No file selected. Please choose a video file.');
      }
      if (!validTypes.includes(file.type)) {
        throw new Error(`Unsupported video format: ${file.type}. Please use MP4, WebM, MOV, AVI, M4V, MPEG, MKV.`);
      }
      if (file.size > 100 * 1024 * 1024) {
        throw new Error('File too large. Please use a video under 100MB.');
      }
      if (elements.sourceVideo.src) {
        URL.revokeObjectURL(elements.sourceVideo.src);
      }
      const url = URL.createObjectURL(file);
      elements.sourceVideo.src = url;
      await new Promise((resolve, reject) => {
        elements.sourceVideo.onloadeddata = () => {
          elements.sourcePlaceholder.classList.add('hidden');
          updateSourceVideoPlaybackRate();
          resolve();
        };
        elements.sourceVideo.onerror = (e) => {
          reject(new Error('Error loading video'));
        };
        setTimeout(() => reject(new Error('Video loading timeout')), 10000);
      });
      elements.generateBtn.disabled = false;
      elements.downloadBtn.style.display = 'none';
      elements.publishBtn.style.display = 'none';
    } catch (error) {
      console.error('File handling error:', error);
      alert('File handling error:' + error.message);
      elements.sourcePlaceholder.classList.remove('hidden');
      if (elements.sourceVideo.src) {
        URL.revokeObjectURL(elements.sourceVideo.src);
        elements.sourceVideo.src = '';
      }
      elements.generateBtn.disabled = true;
    }
  };

  const videoInput = document.getElementById('videoInput');
  if (videoInput) {
    videoInput.addEventListener('change', (e) => {
      const file = e.target.files?.[0];
      if (file) {
        handleFile(file);
      }
    });
  }

  elements.uploadSection.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
    elements.uploadSection.classList.add('drag-over');
  });

  elements.uploadSection.addEventListener('dragleave', (e) => {
    e.preventDefault();
    e.stopPropagation();
    elements.uploadSection.classList.remove('drag-over');
  });

  elements.uploadSection.addEventListener('drop', (e) => {
    e.preventDefault();
    e.stopPropagation();
    elements.uploadSection.classList.remove('drag-over');
    const file = e.dataTransfer?.files?.[0];
    if (file && file.type.startsWith('video/')) {
      handleFile(file);
    } else {
      alert('Please drop a valid video file.');
    }
  });

  document.querySelector('label[for="videoInput"]').addEventListener('click', (e) => {
    e.preventDefault();
    elements.videoInput.click();
  });

  let hasTriggeredEasterEgg = false;
  let isAnimating = false;

  const triggerEvolutionAnimation = async () => {
    if (isAnimating || hasTriggeredEasterEgg) return;
    isAnimating = true;
    hasTriggeredEasterEgg = true;

    // Create and show popup
    const popup = document.createElement('div');
    popup.className = 'evolution-popup';
    popup.innerHTML = `
      <div class="evolution-content">
        <h2>Celebrating 100 edits!</h2>
        <p>This is an evolution animation, enjoy!</p>
      </div>
    `;
    document.body.appendChild(popup);
    await new Promise(resolve => setTimeout(resolve, 2000));
    popup.remove();

    // Make UI unclickable
    const overlay = document.createElement('div');
    overlay.className = 'evolution-overlay';
    document.body.appendChild(overlay);

    const steps = [
      // Step 1: Remove More Games tab and projects popup
      async () => {
        document.querySelector('[data-tab="more-games"]').style.display = 'none';
        document.querySelector('.projects-popup')?.remove();
      },
      // Step 2: Audio becomes experimental and disappears
      async () => {
        const audioToggle = document.getElementById('audioToggle');
        audioToggle.parentElement.classList.add('experimental');
        await new Promise(resolve => setTimeout(resolve, 1000));
        audioToggle.parentElement.style.display = 'none';
      },
      // Step 3: Remove tutorial
      async () => {
        document.getElementById('tutorialBtn').style.display = 'none';
      },
      // Step 4: Change theme and slogan
      async () => {
        document.body.classList.add('old-theme');
        document.querySelector('.slogan').textContent = "We're Back!";
      },
      // Step 5: Remove changelog and settings
      async () => {
        document.querySelector('[data-tab="changelog"]').style.display = 'none';
        document.querySelector('[data-tab="settings"]').style.display = 'none';
      },
      // Step 6: Remove duration override
      async () => {
        document.getElementById('durationPickerContainer').style.display = 'none';
      },
      // Step 7: Old theme and help removal
      async () => {
        document.body.classList.add('classic-theme');
        document.querySelector('[data-tab="help"]').style.display = 'none';
      },
      // Step 8: Remove all tabs and change theme
      async () => {
        document.querySelector('.tabs').style.opacity = '0';
        document.body.classList.add('original-theme');
      },
      // Step 9: Show shutdown screen
      async () => {
        const shutdownScreen = document.createElement('div');
        shutdownScreen.className = 'shutdown-screen';
        shutdownScreen.innerHTML = `
          <div class="shutdown-content">
            <div class="error-face">:(</div>
            <h1>YTP MAKER NEEDS TO CLOSE</h1>
            <div class="shutdown-message">
              We're collecting some error info, and then we'll restart for you.
            </div>
            <div class="progress-bar"></div>
          </div>
        `;
        document.body.appendChild(shutdownScreen);
        await new Promise(resolve => setTimeout(resolve, 1000));
      },
      // Step 10: Restart app
      async () => {
        location.reload();
      }
    ];

    // Execute each step with a delay
    for (const step of steps) {
      await step();
      await new Promise(resolve => setTimeout(resolve, 1500));
    }
  };

  // Add click handler for help tab that tracks going back to make
  let wasOnHelp = false;
  elements.tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');
      if (targetTab === 'help') {
        wasOnHelp = true;
      } else if (targetTab === 'make' && wasOnHelp) {
        wasOnHelp = false;
        triggerEvolutionAnimation();
      }
    });
  });
});