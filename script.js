const startBtn = document.querySelector("#start");
const fullScreenBtn = document.querySelector("#fullscreen");
const minimizeBtn = document.querySelector("#minimize");

screens = document.querySelectorAll(".screen"),
timeList= document.querySelector("#time-list"),
difficultyList= document.querySelector("#difficulty-list"),
timeEl = document.querySelector("#time"),
board = document.querySelector("#board"),
hitsEL= document.querySelector("#hits"),
accuracyEl = document.querySelector("#accuracy"),
hitsOver = document.querySelector("#hits-over"),
hearts = document.querySelectorAll(".heart"),
restartBtn = document.querySelectorAll(".restart"),
fullScreen = document.querySelector("#fullscreen"),
minimize = document.querySelector("#minimize"),
accuracyOver = document.querySelector("#accuracy-over");

let time = 0,
unlimited = false,
difficulty =0, 
playing = false,
hits=0,
missed=0,
accuracy=0,
interval =0;


startBtn.addEventListener("click", () => {
    screens[0].classList.add("up");
});

timeList.addEventListener("click", (e) => {
    if (e.target.classList.contains("time-btn")) {
        time = parseInt(e.target.getAttribute("data-time"));
        unlimited = e.target.getAttribute("data-unlimited");
        screens[1].classList.add("up");
    }
});


difficultyList.addEventListener("click", (e) =>{
    if (e.target.classList.contains("difficulty-btn")){
       difficulty = parseInt(e.target.getAttribute("data-difficulty"));
       screens[2].classList.add("up");
       startGame();
    }
});

function startGame(){
    playing = true;
    interval = setInterval(decreaseTime, 1000);
    createRandomCircle();
}

function decreaseTime(){
    if(unlimited){
        //unlimited
        setTime("∞");
        return;
    }
    if (time == 0){
        // game over
        finishGame();
    }
    let current = --time;
    let miliseconds = time * 1000;
    let minutes = Math.floor(miliseconds / (1000 * 60));
    let seconds = Math.floor((miliseconds % (1000 * 60)) /1000 );
     
    //add trailing zero
    seconds = seconds < 10 ? "0" + seconds : seconds;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    setTime(`${minutes}:${seconds}`);
}

function setTime(time){
    timeEl.innerHTML = time;
}

function createRandomCircle() {
    if (!playing) {
        return; // Do nothing
    }
    const circle = document.createElement("div");
    const size = getRandomNumber(30, 100);
    const colors = ["#03DAC6", "#0552D4", "#0886D6", "#0CB3D3", "#13E0D0"];
    const { width, height } = board.getBoundingClientRect();
    const x = getRandomNumber(0, width - size);
    const y = getRandomNumber(0, height - size);
    circle.classList.add("circle");
    circle.style.width = `${size}px`;
    circle.style.height = `${size}px`;
    circle.style.top = `${y}px`;
    circle.style.left = `${x}px`;
    
    let color = Math.floor(Math.random() * 5); 
    circle.style.background = `${colors[color]}`;
    board.append(circle);

    //diff settings
    if (difficulty == 0){
        circle.style.animationDuration = "3s";
    }
    else if  (difficulty == 1){
        circle.style.animationDuration = "2s";
    }
    else{
        circle.style.animationDuration = "1s";
    }

    //create new circle
    circle.addEventListener("animationend", () =>{
        circle.remove();
        createRandomCircle();

        //missed circle that become 0 
        addMissed();
        //callcualte acc after miss
        calculateAccuracy();  
    })
}

//circle click
board.addEventListener("click", (e) => {
    if (e.target.classList.contains("circle")) {
        // Increase hits
        hits++;
        // Remove the clicked circle
        e.target.remove();
        // Create a new random circle
        createRandomCircle();
    } else {
        // Missed click
        missed++;
    }
    // Show hits
    hitsEL.innerHTML = hits;
    //show accuracy
    calculateAccuracy();
});

function calculateAccuracy(){
    accuracy = (hits/ (hits + missed)) * 100;
    accuracy = accuracy.toFixed(2);
    accuracyEl.innerHTML = `${accuracy}`;
}


function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function finishGame(){
    playing = false;
    clearInterval(interval);
    board.innerHTML= "";
    screens[3].classList.add("up");
    hitsEL.innerHTML=0;
    timeEl.innerHTML="00:00";
    accuracy.innerHTML="0%";

    //stats update
    hitsOver.innerHTML = hits;
    accuracyOver.innerHTML = `${accuracy}%`;
}

function addMissed() {
    // missed life essentialy

    // no hearts left
    if (
        hearts[0].classList.contains("dead") &&
        hearts[1].classList.contains("dead") &&
        hearts[2].classList.contains("dead")
    ) {
        finishGame();
    } else {
        missed++;
        // decrease 1 heart per miss
        for (let i = 0; i < hearts.length; i++) {
            if (!hearts[i].classList.contains("dead")) {
                hearts[i].classList.add("dead");
                break;
            }
        }
    }
}

restartBtn.forEach((btn) =>{
    btn.addEventListener("click", restartGame);
});

function restartGame(){
    finishGame();
    screens[1].classList.remove("up");
    screens[2].classList.remove("up");
    screens[3].classList.remove("up");
    time = 0;
    difficulty = 0;
    hits = 0;
    missed = 0;
    accuracy = 0;
    playing = false;
    unlimited = false;
    hearts.forEach((heart)=> {
        heart.classList.remove("dead");
    })
}

fullScreenBtn.addEventListener("click", enterFullScreen);
minimizeBtn.addEventListener("click", exitFullScreen);

function enterFullScreen() {
  if (document.documentElement.requestFullscreen) {
    document.documentElement.requestFullscreen();
  } else if (document.documentElement.mozRequestFullScreen) {
    document.documentElement.mozRequestFullScreen();
  } else if (document.documentElement.webkitRequestFullscreen) {
    document.documentElement.webkitRequestFullscreen();
  } else if (document.documentElement.msRequestFullscreen) {
    document.documentElement.msRequestFullscreen();
  }

  // Show the minimize button, hide the full screen button
  minimizeBtn.style.display = "block";
  fullScreenBtn.style.display = "none";
}

// Function to exit full screen mode
function exitFullScreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  }

  // Show the full screen button, hide the minimize button
  fullScreenBtn.style.display = "block";
  minimizeBtn.style.display = "none";
}

