class Spotifly {
    constructor() {
        this.audio = document.getElementById('audioPlayer');
        this.playPauseBtn = document.getElementById('playPauseBtn');
        this.progress = document.getElementById('progress');
        this.currentTimeEl = document.getElementById('currentTime');
        this.durationEl = document.getElementById('duration');
        this.currentTrackImg = document.getElementById('currentTrackImg');
        this.currentTrackName = document.getElementById('currentTrackName');
        this.currentArtist = document.getElementById('currentArtist');

        this.currentTrack = null;

        this.init();
    }

    init() {
        this.musicData = [
            {
                id: 1,
                title: "endhayya saami",
                artist: "Local Track",
                img: "images/image1.jpg",
                audio: "songs/endhayya saami.mp3"
            },
            {
                id: 2,
                title: "Levitating",
                artist: "Dua Lipa",
                img: "https://via.placeholder.com/300x300/4ECDC4/FFFFFF?text=LEV",
                audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
            },
            {
                id: 3,
                title: "Watermelon Sugar",
                artist: "Harry Styles",
                img: "https://via.placeholder.com/300x300/F7DC6F/000000?text=WS",
                audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
            },
            {
                id: 4,
                title: "Bad Habits",
                artist: "Ed Sheeran",
                img: "https://via.placeholder.com/300x300/9B59B6/FFFFFF?text=BH",
                audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3"
            }
        ];

        this.renderTracks();
        this.bindEvents();
    }

    renderTracks() {
        const recentlyPlayed = document.getElementById('recentlyPlayed');
        const topTracks = document.getElementById('topTracks');

        if (recentlyPlayed) {
            recentlyPlayed.innerHTML = this.musicData.slice(0, 3)
                .map(track => this.createTrackCard(track))
                .join('');
        }

        if (topTracks) {
            topTracks.innerHTML = this.musicData
                .map(track => this.createTrackCard(track))
                .join('');
        }
    }

    createTrackCard(track) {
        return `
            <div class="track-card" data-track-id="${track.id}">
                <img src="${track.img}" alt="${track.title}">
                <div class="track-title">${track.title}</div>
                <div class="track-artist">${track.artist}</div>
            </div>
        `;
    }

    bindEvents() {
        // Play/Pause
        this.playPauseBtn.addEventListener('click', () => {
            console.log("PLAY BUTTON CLICKED");
            this.togglePlayPause();
        });

        // Next
        document.querySelector('.fa-step-forward').parentElement
            .addEventListener('click', () => this.nextTrack());

        // Previous
        document.querySelector('.fa-step-backward').parentElement
            .addEventListener('click', () => this.previousTrack());

        // Progress click
        this.progress.parentElement.addEventListener('click', (e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            this.audio.currentTime = percent * this.audio.duration;
        });

        // Track click
        document.addEventListener('click', (e) => {
            const card = e.target.closest('.track-card');
            if (card) {
                const id = parseInt(card.dataset.trackId);
                this.playTrack(id);
            }
        });

        // Audio events
        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        this.audio.addEventListener('loadedmetadata', () => this.updateDuration());
        this.audio.addEventListener('ended', () => this.nextTrack());

        // Sync play/pause button
        this.audio.addEventListener('play', () => this.updatePlayButton());
        this.audio.addEventListener('pause', () => this.updatePlayButton());
    }

    playTrack(id) {
        const track = this.musicData.find(t => t.id === id);
        if (!track) return;

        this.currentTrack = track;

        this.audio.src = track.audio;
        this.audio.play();

        this.currentTrackImg.src = track.img;
        this.currentTrackName.textContent = track.title;
        this.currentArtist.textContent = track.artist;

        this.updatePlayButton();

        // Highlight active track
        document.querySelectorAll('.track-card').forEach(c => c.classList.remove('active'));
        const active = document.querySelector(`[data-track-id="${id}"]`);
        if (active) active.classList.add('active');
    }

    togglePlayPause() {
        if (!this.currentTrack) {
            this.playTrack(this.musicData[0].id);
            return;
        }

        if (this.audio.paused) {
            this.audio.play();
        } else {
            this.audio.pause();
        }
    }

    updatePlayButton() {
        const icon = this.playPauseBtn.querySelector('i');

        if (this.audio.paused) {
            icon.className = 'fas fa-play';
        } else {
            icon.className = 'fas fa-pause';
        }
    }
    updateProgress() {
        if (this.audio.duration) {
            const percent = (this.audio.currentTime / this.audio.duration) * 100;
            this.progress.style.width = percent + "%";
            this.currentTimeEl.textContent = this.formatTime(this.audio.currentTime);
        }
    }

    updateDuration() {
        this.durationEl.textContent = this.formatTime(this.audio.duration);
    }

    formatTime(sec) {
        const m = Math.floor(sec / 60);
        const s = Math.floor(sec % 60);
        return `${m}:${s.toString().padStart(2, '0')}`;
    }

    nextTrack() {
        if (!this.currentTrack) return;

        const index = this.musicData.findIndex(t => t.id === this.currentTrack.id);
        const next = (index + 1) % this.musicData.length;
        this.playTrack(this.musicData[next].id);
    }

    previousTrack() {
        if (!this.currentTrack) return;

        const index = this.musicData.findIndex(t => t.id === this.currentTrack.id);
        const prev = (index - 1 + this.musicData.length) % this.musicData.length;
        this.playTrack(this.musicData[prev].id);
    }

}

// Start app AFTER page loads
document.addEventListener("DOMContentLoaded", () => {
    new Spotifly();
});