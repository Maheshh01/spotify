console.log("Let us start writing code") 
   let currentSong=new Audio();
    let songs;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}
async function getsong() {
    let a=await fetch("http://127.0.0.1:5500/songs/");
    let response=await a.text();
    let div=document.createElement("div");
    div.innerHTML=response;
    let as=div.getElementsByTagName("a");
    songs=[]
    for(let i=0;i<as.length;i++){
        let element=as[i];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split("/songs/")[1])
        }
    }
    return songs
} 

const playMusic = (track) => {
    currentSong.src = "/songs/" + track;
    currentSong.play();
    play.src = "pause.svg";
    document.querySelector(".songinfo").innerHTML=track.split(".")[0];
   
    document.querySelector(".songtime").innerHTML="0:0/0:0";
}

async function main() {
    songs=await getsong()
    console.log(songs);
    let songUL=document.querySelector(".songLibrary").getElementsByTagName("ul")[0];
    for (const song of songs) {
        songUL.innerHTML=songUL.innerHTML + `<li> ${song.replaceAll("%20"," ")}</li>`;
    }
   

    Array.from(document.querySelector(".songLibrary").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click",element=>{
            console.log(e.textContent);
            playMusic(e.textContent.trim(" "))
        })
        
    });

    play.addEventListener("click",()=>{
        if(currentSong.paused){
            currentSong.play();
            play.src="pause.svg";
        }
        else{
            currentSong.pause();
            play.src="playss.svg";
        }
    })

    // Listen for timeupdate event
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })

    
    // Add an event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100
    })

    //hamburger
    document.getElementById("ham").addEventListener("click",()=>{
        document.querySelector(".left").style.left="0";
      
    });
    document.getElementById("cross").addEventListener("click",()=>{
        document.querySelector(".left").style.left="-110%";
        
    });
    
     // Add an event listener to previous
    previous.addEventListener("click", () => {
        currentSong.pause()
        console.log("Previous clicked")
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }
    })

    // Add an event listener to next
    next.addEventListener("click", () => {
        currentSong.pause()
        console.log("Next clicked")

        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }
    })

    
}
main()