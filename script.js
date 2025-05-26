let currentSong = new Audio();
let allMovies = [];

const secondsToMinutesSeconds = (seconds) => {
    if (isNaN(seconds) || seconds < 0) return "00:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
};

function playMusic(folder, track) {
    currentMovieFolder = folder;
    currentSongIndex = currentMovieSongs.indexOf(track);
    currentSong.src = `/songs/${folder}/${track}`;
    currentSong.play();
    play.src = "pause.svg";
    document.querySelector(".songinfo").innerHTML = track.replace(".mp3", "");
    document.querySelector(".songtime").innerHTML = "0:00 / 0:00";
}


async function loadMovies() {
    let res = await fetch("/songs/movies.json");
    allMovies = await res.json();

    const cardContainer = document.querySelector(".cardContainer");
    cardContainer.innerHTML = "";

    for (const movie of allMovies) {
        const card = document.createElement("div");
        card.classList.add("card");
        card.innerHTML = `
            <div class="play"><img src="playbtn.svg" /></div>
            <img src="/songs/${movie.folder}/${movie.cover}" alt="${movie.meta.title}">
            <h3>${movie.meta.title}</h3>
            <p>${movie.meta.description}</p>
        `;

        // On click, show songs in the sidebar
        card.addEventListener("click", () => {
            loadSongsToSidebar(movie);
            document.querySelector(".left").style.left = "0";
        });

        cardContainer.appendChild(card);
    }
}
function loadSongsToSidebar(movie) {
    const songUL = document.querySelector(".songLibrary ul");
    songUL.innerHTML = "";

    currentMovieSongs = movie.songs;
    currentMovieFolder = movie.folder;

    movie.songs.forEach((song, index) => {
        const li = document.createElement("li");
        li.textContent = song.replace(".mp3", "");
        li.addEventListener("click", () => {
            currentSongIndex = index;
            playMusic(movie.folder, song);
        });
        songUL.appendChild(li);
    });
}


function setupControls() {
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "pause.svg";
        } else {
            currentSong.pause();
            play.src = "playss.svg";
        }
    });

    next.addEventListener("click", () => {
    if (currentSongIndex < currentMovieSongs.length - 1) {
        currentSongIndex++;
        playMusic(currentMovieFolder, currentMovieSongs[currentSongIndex]);
    }
});

previous.addEventListener("click", () => {
    if (currentSongIndex > 0) {
        currentSongIndex--;
        playMusic(currentMovieFolder, currentMovieSongs[currentSongIndex]);
    }
});


    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML =
            `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`;
        document.querySelector(".circle").style.left =
            (currentSong.currentTime / currentSong.duration) * 100 + "%";
    });

    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = (currentSong.duration * percent) / 100;
    });

    document.getElementById("ham").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    });

    document.getElementById("cross").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-110%";
    });
}

async function main() {
    await loadMovies();
    setupControls();
}

main();
