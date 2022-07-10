// Declaring Variables 

// Opening page to login variables

const mainContainer = document.querySelector(".main-container");
const continueBtn = document.querySelector("#submit-name-btn");
document.querySelector(".best-score-name").textContent = localStorage.getItem("name");
if (localStorage.getItem("time") === null) { // Preventing "null seconds" to be shown 
    document.querySelector(".best-score-time").textContent = "";
} else {
    document.querySelector(".best-score-time").textContent = localStorage.getItem("time") + " Seconds";
}

// Login section variables

const loginContainer = document.querySelector(".login-container");
const userNameInput = document.querySelector("#user-input");
const passwordInput = document.querySelector("#password-input");
const enterBtn = document.querySelector(".enter-btn");
const errorMessage = document.querySelector(".error-message-container");

// Choose difficulty variables

const difficultyContainer = document.querySelector(".difficulty-selection-container");
const welcomeName = document.querySelector(".welcome-title-name") // In order to display the user's name
const difficultyOptions = document.querySelectorAll(".difficulty-option");

// Game section variables

const gameContainer = document.querySelector(".game-screen-container");
const gameGrid = document.querySelector(".game-container");
const restartBtn = document.querySelector(".again-btn");
const finishBtn = document.querySelector(".finish-btn");
const returnBtn = document.querySelector(".return-arrow");
const timeDisplay = document.querySelector(".timer-time");
let time = 0;
let timerId;
const mistakesMessage = document.querySelector(".mistakes-message");
const mistakesNumber = document.querySelector(".mistakes-number");

// Additional variables

// Settings buttons variables

const settingsContainer = document.querySelector(".settings-container");
const audioBtn = document.querySelector(".audio-btn");
const audio = new Audio("background-music.mp3");
const nightModeBtn = document.querySelector(".night-mode-btn");
let nightModeFlag = false;

// Again button pop up variables

const againMessagePopUp = document.querySelector(".again-message-container");
const yesBtn = document.querySelector(".yes-btn");
const noBtn = document.querySelector(".no-btn");

// Finish button pop up variables

const finishMessagePopUp = document.querySelector(".finish-message-container");
const finalTimeDisplay = document.querySelector(".finish-time");
const tryAgainBtn = document.querySelector(".try-again-btn");

// Utility variables

const gameCubes = document.getElementsByClassName("game-cube"); // For checking all the cubes
let currentGame;
let currentCube; // For checking specific cubes by their id

makeGrid(); //Making the grid visually before starting the game
makeMobileButtons(); // Making the mobile numbers in case the user plays on phone / tablet

// Moving to the login page

document.addEventListener("keydown", continueToGame, { once: true });
continueBtn.addEventListener("click", continueToGame);

function continueToGame(event) {
    const openingPageContainer = document.querySelector(".opening-page-container");
    if (event.key === "Enter" || event.type === "click") {
        openingPageContainer.style.display = "none";
        mainContainer.style.display = "block";
        welcomeName.textContent = document.querySelector("#name-input").value || "Guest"; // Checking if the input of the name has value and if not return "Guest"
    }
}

// Making the game grid visually

function makeGrid() {
    let gameCube; // Declaring an empty cube that we'll build upon in the function 
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            gameCube = document.createElement("div");
            gameCube.classList.add("game-cube");
            gameCube.id = `${i},${j}`; // Giving each cube a unique id so we can target it later
            gameCube.classList.add(`${Math.floor(i / 3) * 3 + Math.floor(j / 3)}`) // Adding a unique class to cubes in the same box 
            gameCube.addEventListener("click", focus); // Event listener which lets me focus on a specific cube
            if (i === 2 || i === 5 || i === 8) { // Checking if the borders should be bold
                gameCube.style.borderBottom = "3px solid #000";
            } else if (i === 0) {
                gameCube.style.borderTop = "3px solid #000";
            }
            if (j === 2 || j === 5 || j === 8) {
                gameCube.style.borderRight = "3px solid #000";
            } else if (j === 0) {
                gameCube.style.borderLeft = "3px solid #000";
            }
            gameGrid.appendChild(gameCube);
        }
    }
}

function makeMobileButtons() { // Making the buttons for mobile view
    const mobileNumbersContainer = document.querySelector(".mobile-numbers-container");
    for (let i = 0; i < 10; i++) { // Creating 9 digits containers each with his own number
        const numberContainer = document.createElement("div");
        numberContainer.classList.add("mobile-number");
        if (i === 0) {
            numberContainer.classList.add("fas");
            numberContainer.textContent = "";
            numberContainer.addEventListener("click", deleteNumber);
        } else {
            numberContainer.addEventListener("click", addNumber);
            numberContainer.textContent = i;
        }
        mobileNumbersContainer.appendChild(numberContainer);
    }
}

// Login section functionality

function checkInput() { // Checking if the inputs evaluate to the correct username and password
    if (userNameInput.value.toLowerCase() === "abcd" && passwordInput.value === "1234") {
        loginContainer.style.display = "none";
        difficultyContainer.style.display = "flex";
    } else { // Show the user an error and turn the borders of the inputs to red
        userNameInput.style.border = "1px solid #d82148";
        passwordInput.style.border = "1px solid #d82148";
        errorMessage.style.display = "block";
    }
}

enterBtn.addEventListener("click", checkInput);
mainContainer.addEventListener("keydown", ({ key }) => { // Adding an event listener to the "Enter" key as well as the click for better experience
    if (key === "Enter") {
        checkInput();
    }
});

// Difficulty section functionality

function generateNumbers(difficultyValue) {
    for (let i = 0; i < Math.floor(81 * difficultyValue); i++) { // Generating numbers to be shown on the grid depending on the difficulty chosen 
        const randomRow = Math.floor(Math.random() * 9);
        const randomCol = Math.floor(Math.random() * 9);
        const lockedCube = document.getElementById(`${randomRow},${randomCol}`); // Each time the loop runs it get a random cube and check it
        if (!lockedCube.textContent) {
            lockedCube.textContent = currentGame[randomRow][randomCol];
            lockedCube.classList.add("locked-cube");
        } else { // If the random cube already has text go back one iteration and skip it 
            i--;
            continue;
        }
    }
}

for (let i = 0; i < difficultyOptions.length; i++) {
    difficultyOptions[i].addEventListener("click", startGame);
}

async function startGame() { // Making the function asynchronous so it will wait for the game board
    difficultyContainer.style.display = "none";
    document.querySelector(".loading").style.display = "block";
    try { // Trying to get a random board from the sudoku api from rapid 
        const config = {
            headers: { // Making the proper headers required
                "x-rapidapi-host": "sudoku-board.p.rapidapi.com",
                "x-rapidapi-key": "75064b2120msh7531bc50ec2512bp124adfjsnd6a5774a5516"
            }
        }
        const res = await axios.get("https://sudoku-board.p.rapidapi.com/new-board?diff=2&stype=list&solu=true", config); // Fetching the data
        currentGame = res.data.response.solution; // Saving the data from the api to my current random game variable
    } catch (error) {
        console.log(error);
    }
    document.querySelector(".loading").style.display = "none";
    gameContainer.style.display = "flex";
    switch (this.value) { // depending of the value of the difficulty button clicked we generate numbers. e.g: if the value is easy we'll generate 81 * 0.75 numbers.
        case "easy":  // Calling the generate numbers after we have our random board and the difficulty chosen
            generateNumbers(0.75);
            break;
        case "normal":
            generateNumbers(0.5);
            break;
        default:
            generateNumbers(0.25);
    }
    timerId = setInterval(timer, 1000); // Starting the timer as the player starts a new game
    document.addEventListener("keydown", chooseNumber); // Adding the option to focus on a specific number
}

// Game progress functionality

function chooseNumber({ key }) { // Choosing numbers for computer by clicking on the keyboard
    highlightNumbers(key);
    const cubeToChange = document.querySelector(".focused-cube"); // Getting the cube with the "focused" class
    if ((key > 0 && key < 10) || key === "Backspace") { // Checking if the user input is equivalent to a reasonable value
        if (key === "Backspace") { // Giving the user to delete his input
            cubeToChange.textContent = "";
        } else {
            cubeToChange.textContent = key;
        }
    }
}

function addNumber() { //Choosing numbers for mobile / tablet by clicking in the numbers container
    highlightNumbers(this.textContent);
    const cubeToChange = document.querySelector(".focused-cube"); // Getting the cube with the "focused" class
    cubeToChange.textContent = this.textContent;
}

function focus({type}) {
    removeStyles();
    highlightNumbers(this.textContent);
    if (!this.classList.contains("locked-cube")) { //Checking if the chosen cube is not a "locked" cube 
        this.classList.add("focused-cube");
        if (nightModeFlag) {
            this.classList.add("night-mode-focused-cube");
        }
        for (let i = 0; i < 81; i++) { // Focusing on the rows and the columns by giving them a class that changes the background
            if (gameCubes[i].id === this.id) { // A statement which lets me differentiate between focused cube to it's row / column.
                continue;
            } else if (gameCubes[i].id.charAt(0) === this.id.charAt(0) || gameCubes[i].id.charAt(2) === this.id.charAt(2)) { // Checking for the cubes in the same row / column as my chosen cube
                gameCubes[i].classList.add("focused-row-column");
                if (nightModeFlag) {
                    gameCubes[i].classList.add("night-mode-focused-row-column");
                }
                for (let j = 0; j < 9; j++) { // Checking what "box" the current focused cube is in
                    if (this.classList.contains(`${j}`)) {
                        const bigCubeCubes = document.getElementsByClassName(`${j}`); // Getting all cubes in that box from the DOM
                        for (let k = 0; k < 9; k++) { // Giving each cube in the box a focused class
                            if (bigCubeCubes[k].classList.contains("focused-cube")) { // Skipping the focused cube
                                continue;
                            }
                            if (nightModeFlag) {
                                bigCubeCubes[k].classList.add("night-mode-focused-row-column");
                            }
                            bigCubeCubes[k].classList.add("focused-row-column");
                        }
                    }
                }
            }
        }
    }
}

function highlightNumbers(target) {
    for (let i = 0; i < 81; i++) {
        gameCubes[i].classList.remove("focused-single-number");
        gameCubes[i].classList.remove("night-mode-focused-single-number");
        if (gameCubes[i].textContent === target && target) {
            if (nightModeFlag) {
                gameCubes[i].classList.add("night-mode-focused-single-number");
            }
            gameCubes[i].classList.add("focused-single-number")
        }
    }
}

// Pop up universal functionality

function popUp(element) {
    element.style.display = "flex";
    gameContainer.style.filter = "blur(10px)";
    settingsContainer.style.filter = "blur(10px)";
}

// Restart button functionality

restartBtn.addEventListener("click", function () {
    popUp(againMessagePopUp);
});

function restartChoice() {
    gameContainer.style.filter = "blur(0px)";
    settingsContainer.style.filter = "blur(0px)";
    againMessagePopUp.style.display = "none";
    if (this.value === "yes") {
        time = 0; // Set the timer back to 0
        for (let i = 0; i < 81; i++) {
            if (gameCubes[i].classList.contains("locked-cube")) { // If the is "locked" then skip it
                continue;
            } else { // If the cube isn't locked then delete the number inside
                gameCubes[i].textContent = "";
            }
        }
    }
}

yesBtn.addEventListener("click", restartChoice);
noBtn.addEventListener("click", restartChoice);

function removeStyles() { // Removing all the focused styling to reset them
    for (let i = 0; i < 81; i++) {
        gameCubes[i].classList.remove("focused-row-column");
        gameCubes[i].classList.remove("focused-cube");
        gameCubes[i].classList.remove("focused-single-number");
        gameCubes[i].classList.remove("night-mode-focused-row-column");
        gameCubes[i].classList.remove("night-mode-focused-cube");
        gameCubes[i].classList.remove("night-mode-focused-single-number");
    }
}

// Finish button functionality 

function finishGame() {
    let counter = 0; // Declaring a counter to help me keep track of all the right instances i encounter
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            currentCube = document.getElementById(`${i},${j}`); // Checking each cube by it's id which is the exact position of the number in the game matrix respectively
            removeStyles();
            if (Number(currentCube.textContent) === currentGame[i][j]) {
                counter++;
            } else {
                currentCube.classList.add("incorrect-cube"); // Add the "incorrect" class to make the incorrect cubes red
            }
        }
    }
    if (counter === 81) { // If the counter evaluate to 81 so the players win.
        chooseBest(); // Triggering the current best score chooser in case of finish
        for (let i = 0; i < 81; i++) { // Looping through the correct cubes array to make a green winning effect
            gameCubes[i].classList.add("correct-cube");
        }
        finalTimeDisplay.textContent = time;
        setTimeout(function () { // After the animation finished (2 seconds) display the finished game pop up
            popUp(finishMessagePopUp);
        }, 1000);
    } else { // If there are less then 81 correct instances than show a message with the number of mistakes
        mistakesMessage.style.display = "block";
        mistakesNumber.textContent = 81 - counter;
        setTimeout(function () { // Clear the mistakes message after 2 seconds
            mistakesMessage.style.display = "none";
            const incorrectCubes = document.querySelectorAll(".incorrect-cube");
            for (let i = 0; i < incorrectCubes.length; i++) {
                incorrectCubes[i].classList.remove("incorrect-cube");
            }
        }, 2000)
    }
}

finishBtn.addEventListener("click", finishGame);

// Try again functionality (after you successfully finish the game)

function resetGame() { // Resetting the game if the user clicks the return arrow or finishes 
    removeStyles();
    for (let i = 0; i < 81; i++) {
        gameCubes[i].textContent = "";
        gameCubes[i].classList.remove("correct-cube");
        gameCubes[i].classList.remove("locked-cube");
        clearInterval(timerId); // Clearing the timer
        time = 0;
    }
}

function tryAgain() { // if the user finishes and decides to try again reset the game and return the style to normal and take him back to the difficulty page
    gameContainer.style.filter = "blur(0px)";
    settingsContainer.style.filter = "blur(0px)";
    finishMessagePopUp.style.display = "none";
    gameContainer.style.display = "none";
    difficultyContainer.style.display = "flex";
    resetGame();
}

tryAgainBtn.addEventListener("click", tryAgain);

// Return arrow functionality

returnBtn.addEventListener("click", tryAgain); // When the user presses the arrow it will reset the current game and take him back to the difficulty page just like the try agian button

// Time functionality

function timer() {
    time++;
    timeDisplay.textContent = time;
}

// Audio button functionality

function toggleAudio() {
    if (audioBtn.innerHTML === "") {
        audioBtn.innerHTML = "&#xf028;";
        audio.play();
    } else {
        audioBtn.innerHTML = "&#xf6a9;"
        audio.pause();
    }
}

audioBtn.addEventListener("click", toggleAudio);

// Night mode button functionality

nightModeBtn.addEventListener("click", function () {
    if (nightModeBtn.textContent === "") {
        nightModeFlag = true;
        nightModeBtn.textContent = "";
    } else {
        nightModeFlag = false;
        nightModeBtn.textContent = "";
    }
    for (let i = 0; i < 81; i++) {
        gameCubes[i].classList.remove("night-mode-focused-row-column");
        gameCubes[i].classList.remove("night-mode-focused-cube");
        gameCubes[i].classList.remove("night-mode-focused-single-number");
    }
    mainContainer.classList.toggle("night-mode-main");
    enterBtn.classList.toggle("night-mode-button");
    const loginInputs = document.getElementsByClassName("login-input");
    for (let i = 0; i < loginInputs.length; i++) {
        loginInputs[i].classList.toggle("night-mode-button");
    }
    for (let i = 0; i < difficultyOptions.length; i++) {
        difficultyOptions[i].classList.toggle("night-mode-button");
    }
    restartBtn.classList.toggle("night-mode-button");
    finishBtn.classList.toggle("night-mode-button");
    yesBtn.classList.toggle("night-mode-button");
    noBtn.classList.toggle("night-mode-button");
    againMessagePopUp.classList.toggle("night-mode-main");
    finishMessagePopUp.classList.toggle("night-mode-main");
    tryAgainBtn.classList.toggle("night-mode-button");
    for (let i = 0; i < 81; i++) {
        gameCubes[i].classList.toggle("night-mode-cube");
    }
});

// Leader boards organization

function chooseBest() {
    if (Number(localStorage.getItem("time")) > time || localStorage.length === 0) { // Checking if the time which is currently saved in the local storage is bigger than the current time.
        localStorage.setItem("name", welcomeName.textContent);
        localStorage.setItem("time", time);
    }
}

// Deleting number 

function deleteNumber() {
    const cubeToDelete = document.querySelector(".focused-cube");
    cubeToDelete.textContent = "";
}












