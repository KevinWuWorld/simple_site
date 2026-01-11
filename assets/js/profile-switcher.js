// Profile picture switcher with blinking animation
(function() {
    const profileImage1 = document.getElementById('profile-image-1');
    const profileImage2 = document.getElementById('profile-image-2');
    
    if (!profileImage1 || !profileImage2) return;

    const imageBasePath = 'assets/images/profile-pics/';
    const images = ['pic0.JPG', 'pic1.JPG', 'pic2.JPG', 'pic3.JPG', 'pic4.JPG', 'pic5.jpg', 'pic6.png'];
    const SWITCH_INTERVAL = 15000; // 15 seconds
    
    // Load state from localStorage or use defaults
    let currentIndex = parseInt(localStorage.getItem('profileCurrentIndex')) || 0;
    let lastUsedIndex = parseInt(localStorage.getItem('profileLastUsedIndex')) || 0;
    let lastSwitchTime = parseInt(localStorage.getItem('profileLastSwitchTime')) || Date.now();
    
    let availableIndices = [1, 2, 3, 4, 5, 6]; // Available indices for random selection (pic1-pic6)
    let currentImage = profileImage1; // Track which image is currently active
    let nextImage = profileImage2;
    
    // Set initial image to stored currentIndex (or pic0 if first time)
    const initialImagePath = imageBasePath + images[currentIndex];
    profileImage1.src = initialImagePath;
    profileImage2.src = initialImagePath;
    
    // Ensure the active image is visible
    profileImage1.classList.add('active');
    profileImage2.classList.remove('active');
    
    // Function to get a random index from available indices, excluding the last used one
    function getRandomIndex() {
        // Filter out the last used index
        const filtered = availableIndices.filter(idx => idx !== lastUsedIndex);
        
        // If we've used all images, reset available indices
        if (filtered.length === 0) {
            filtered.push(...availableIndices);
        }
        
        // Pick a random index from filtered list
        const randomIdx = Math.floor(Math.random() * filtered.length);
        const selectedIndex = filtered[randomIdx];
        
        // Update last used index
        lastUsedIndex = selectedIndex;
        
        return selectedIndex;
    }
    
    // Function to crossfade to new image (simple fade out old, fade in new)
    function crossfadeToNew(newImagePath, newIndex) {
        // Preload the new image
        const img = new Image();
        img.onload = function() {
            // Set the next image source
            nextImage.src = newImagePath;
            
            // COMMENTED OUT - Blinking animation
            // currentImage.classList.add('blink');
            
            // Crossfade: remove active from current, add active to next (simultaneous fade out/in)
            // The CSS transition handles the smooth fade (0.6s)
            currentImage.classList.remove('active');
            nextImage.classList.add('active');
            
            // Swap references for next transition
            const temp = currentImage;
            currentImage = nextImage;
            nextImage = temp;
            
            currentIndex = newIndex;
            
            // Save state to localStorage
            localStorage.setItem('profileCurrentIndex', currentIndex.toString());
            localStorage.setItem('profileLastUsedIndex', lastUsedIndex.toString());
            localStorage.setItem('profileLastSwitchTime', Date.now().toString());
        };
        img.src = newImagePath;
    }
    
    // Function to switch to a random profile picture
    function switchToRandomPic() {
        const randomIndex = getRandomIndex();
        const newImagePath = imageBasePath + images[randomIndex];
        
        crossfadeToNew(newImagePath, randomIndex);
    }
    
    // Calculate time since last switch
    const timeSinceLastSwitch = Date.now() - lastSwitchTime;
    const timeUntilNextSwitch = Math.max(0, SWITCH_INTERVAL - timeSinceLastSwitch);
    
    // Set up the interval timer
    function startInterval() {
        setInterval(switchToRandomPic, SWITCH_INTERVAL);
    }
    
    // If enough time has passed, switch immediately; otherwise wait for remaining time
    if (timeSinceLastSwitch >= SWITCH_INTERVAL) {
        // Switch immediately if enough time has passed
        switchToRandomPic();
        // Then continue with regular interval
        startInterval();
    } else {
        // Wait for remaining time, then switch and continue with regular interval
        setTimeout(function() {
            switchToRandomPic();
            startInterval();
        }, timeUntilNextSwitch);
    }
})();

