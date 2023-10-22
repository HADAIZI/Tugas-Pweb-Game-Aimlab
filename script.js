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

const registrationForm = document.getElementById("registrationForm");
const loginForm = document.getElementById("loginForm");

registrationForm.style.display = "block";
loginForm.style.display = "none";

// Switch between Registration and Login forms
const switchToLogin = document.getElementById("switchToLogin");
const switchToRegistration = document.getElementById("switchToRegistration");

switchToLogin.addEventListener("click", () => {
  registrationForm.style.display = "none";
  loginForm.style.display = "block";
});

switchToRegistration.addEventListener("click", () => {
  registrationForm.style.display = "block";
  loginForm.style.display = "none";
});

// Add event listeners for Register and Login buttons
const registerButton = document.getElementById("registerButton");
const loginButton = document.getElementById("loginButton");

registerButton.addEventListener("click", () => {
  registerUser();
});

loginButton.addEventListener("click", () => {
  loginUser();
});

// Function to register the user
function registerUser() {
  const userName = document.getElementById("userName").value;
  const userEmail = document.getElementById("userEmail").value;
  const userPassword = document.getElementById("userPassword").value;

  if (!userName || !userEmail || !userPassword) {
    alert("Please fill in all registration fields.");
    return;
  }
  const registerUrl = "https://ets-pemrograman-web-f.cyclic.app/users/register";

  const xhr = new XMLHttpRequest();
  xhr.open("POST", registerUrl, true);
  xhr.setRequestHeader("Content-Type", "application/json");

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 400) {
        alert("Registration failed. Please try again.");
      } else {
        const response = JSON.parse(this.responseText);
        if (response.data && response.data.access_token) {
          const accessToken = response.data.access_token;
          console.log("Token:", accessToken);
          localStorage.setItem("token", accessToken);
        } else {
          console.log("Token not found in the response data.");
        }
        alert("Registration successful. You can now log in.");
        registrationForm.style.display = "none";
        levelSelection.style.display = "block";
      }
    }
  };

  const userData = {
    nama: userName,
    email: userEmail,
    password: userPassword,
  };

  xhr.send(JSON.stringify(userData));
}

// Function to log in the user
function loginUser() {
  const loginEmail = document.getElementById("loginEmail").value;
  const loginPassword = document.getElementById("loginPassword").value;

  if (!loginEmail || !loginPassword) {
    alert("Please fill in all login fields.");
    return;
  }

  const loginUrl = "https://ets-pemrograman-web-f.cyclic.app/users/login";

  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState === 4) {
      if (this.status === 200) {
        const response = JSON.parse(this.responseText);
        if (response.data && response.data.access_token) {
          const accessToken = response.data.access_token;
          localStorage.setItem("token", accessToken);
        } else {
          console.log("Token not found in the response data.");
        }
        alert("Login successful. You can now choose a game level.");
        registrationForm.style.display = "none";
        loginForm.style.display = "none";
        levelSelection.style.display = "block";
      } else {
        alert("Login failed. Please try again.");
      }
    }
  };

  xhttp.open("POST", loginUrl, true);
  xhttp.setRequestHeader("Content-Type", "application/json");
  xhttp.send(
    JSON.stringify({
      email: loginEmail,
      password: loginPassword,
    })
  );
}

function checkLoginStatus() {
  const token = localStorage.getItem("token");

  if (token) {
    // Token exists in local storage, user is logged in
    registrationForm.style.display = "none";
    loginForm.style.display = "none";
    levelSelection.style.display = "block";
  } else {
    // Token doesn't exist, show login and registration forms
    registrationForm.style.display = "block";
    loginForm.style.display = "none"; // You may want to show the login form here if necessary
  }
}

// Call checkLoginStatus when the page loads
window.addEventListener("load", checkLoginStatus);

// Add an event listener to the "Leaderboard" button
const leaderboardButton = document.getElementById("leaderboardButton");
leaderboardButton.addEventListener("click", () => {
  // Fetch the leaderboard data from the API
  fetch("https://ets-pemrograman-web-f.cyclic.app/scores/score")
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "success") {
        const leaderboardData = data.data;
        displayLeaderboard(leaderboardData);
      } else {
        alert("Failed to retrieve the leaderboard data.");
      }
    })
    .catch((error) => {
      console.error("Error fetching leaderboard data:", error);
    });
});

// Function to display the leaderboard data
function displayLeaderboard(leaderboardData) {
  // Menghapus ID dari data leaderboard
  const dataWithoutId = leaderboardData.map((entry) => ({
    nama: entry.nama,
    score: entry.score,
  }));

  // Sort Data From Highest
  const sortedData = dataWithoutId.sort((a, b) => b.score - a.score);

  // Show Only 3 Highest Data
  const top3Entries = sortedData.slice(0, 3);

  // Make Container For LB
  const leaderboardContainer = document.createElement("div");
  leaderboardContainer.classList.add("leaderboard-container");

  const leaderboardHeading = document.createElement("h2");
  leaderboardHeading.textContent = "Top 3 Leaderboard Scores";
  leaderboardContainer.appendChild(leaderboardHeading);

  // Make Table for Leaderboard
  const leaderboardTable = document.createElement("table");
  leaderboardTable.classList.add("leaderboard-table");

  // Make Header for Table
  const tableHeader = document.createElement("thead");
  const headerRow = document.createElement("tr");
  const nameHeader = document.createElement("th");
  nameHeader.textContent = "Name";
  const scoreHeader = document.createElement("th");
  scoreHeader.textContent = "Score";
  headerRow.appendChild(nameHeader);
  headerRow.appendChild(scoreHeader);
  tableHeader.appendChild(headerRow);
  leaderboardTable.appendChild(tableHeader);

  // Show 3 highest Score
  top3Entries.forEach((entry) => {
    const row = document.createElement("tr");
    const nameCell = document.createElement("td");
    nameCell.textContent = entry.nama;
    const scoreCell = document.createElement("td");
    scoreCell.textContent = entry.score;
    row.appendChild(nameCell);
    row.appendChild(scoreCell);
    leaderboardTable.appendChild(row);
  });

  leaderboardContainer.appendChild(leaderboardTable);

  const home = document.getElementById("home");
  home.style.display = "none"; // Sembunyikan konten home
  canvas.style.display = "none"; // Sembunyikan game canvas
  document.body.appendChild(leaderboardContainer);
}

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

