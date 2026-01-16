let gameStart = false
let endInfo = false
let localHighScore = localStorage.getItem("highScore")
if(localHighScore === null)
    localHighScore = 0

const gameFrame = document.getElementById("gameScene")
//using set to handle duplicates
const activeTiles = new Set()
const remainingBar = document.getElementById("remaining")
const scoreEl = document.querySelector("#score span:last-of-type")
let score = 0
let totalClicked = 0
//audio realted
const fart = new Audio("./sound/Fart.mp3")
const newHighScore = new Audio("./sound/allclear.mp3")
const comboSounds = [
    new Audio("./sound/combo_1.wav"),
    new Audio("./sound/combo_2.wav"),
    new Audio("./sound/combo_3.wav"),
    new Audio("./sound/combo_4.wav"),
    new Audio("./sound/combo_5.wav"),
    new Audio("./sound/combo_6.wav"),
    new Audio("./sound/combo_7.wav"),
    new Audio("./sound/combo_8.wav")
    ]
let curComboSound = 0
//audio realted
let curCombo = 0
const comboBox = document.querySelector("#comboBox span:last-of-type")
const msg = document.getElementById("timeOutMsg")

startGame()

//literally everything
function startGame(){
    gameFrame.style.display = 'flex'
    const tiles = document.getElementById("tiles")
    score = 0
    document.querySelector("#highScore span:last-of-type").textContent = localHighScore
    //used a set so it handles duplication
    while(activeTiles.size < 3){
        activeTiles.add(Math.floor(Math.random() * 16))
    }

    //crate the 16 tiles also add them a click event where the hole game works around
    for(let i = 0; i < 16; i++){
        const tile = document.createElement("div")
        tile.classList.add("tile")
        if(activeTiles.has(i)){
            tile.classList.add("activeTile")
        }
        //added data-index so the tiles have an identifier
        tile.setAttribute("data-index", i)
        //this is where the magic happens
        tile.addEventListener("click", function() {
            //check if the game is going on and the tile is active
            if(!gameStart && this.classList.contains("activeTile")){
                gameStart = true
                //start the game loop
                score = 0
                totalClicked = 0
                curCombo = 0
                curComboSound = 0
                gameLoop()
            }

            if(this.classList.contains("activeTile") && gameStart){
                //remove it from the active tile set also remove the active tile class
                this.classList.remove("activeTile")
                activeTiles.delete(parseInt(this.getAttribute("data-index")))
                //generate a new tile to be clicked
                while(activeTiles.size < 3){
                    let randInd = Math.floor(Math.random() * 16)
                    activeTiles.add(randInd)
                    //paint all the tiles again because one of them is clicked
                    updateTiles(randInd)
                }
                //this class turns the tile green
                this.classList.add("clickedTile")
                //this is the animation for the combo number this gets deleted after so it can be triggered again
                comboBox.classList.add("bounceAnimation")
                //calculate the score gained according to the remaining time
                totalClicked += 1
                let scoreGained = Math.floor(parseInt(remainingBar.style.width) / 40) 
                score += scoreGained
                scoreEl.textContent = `${score}`
                //add the score gained inside the tile
                this.innerHTML += `<span class="scoreText">+${scoreGained}</span>`
                //incrase the current combo count and current combo sound 
                curCombo += 1
                if(parseInt(remainingBar.style.width) < 200){
                    curCombo = 1
                    curComboSound = 0
                }
                //reset the remaining time
                remainingBar.style.width = "400px"
                
                //delete the 2 classes (clickedTile makes the tile green when clicked, bounceAnimation adds a little bounce to the combo number)
                let timerId = setInterval(function(){
                    tile.classList.remove("clickedTile")
                    comboBox.classList.remove("bounceAnimation")
                    clearInterval(timerId);
                }, 100)

                //this removes the number inside the tile
                let textTime = setInterval(function(){
                    tile.innerHTML = ""

                    clearInterval(textTime)
                }, 100)

                //play the right sound according to the current comboSound
                comboSounds[curComboSound].volume = 0.1
                comboSounds[curComboSound].currentTime = 0
                comboSounds[curComboSound].play()
                //make sure combo sound doesn't go outside of the size
                if(curComboSound < comboSounds.length - 1)
                    curComboSound += 1

                //increase the combo number size according to the combo
                comboBox.textContent = curCombo
                if(parseInt(comboBox.style.fontSize) < 256)
                    comboBox.style.fontSize = `${curCombo * 4 + 32}px`

            }
        })
        //add the tile to the container
        tiles.appendChild(tile)
    }

    //initialize the remaining time
    remainingBar.style.width = "400px"

    
}

function updateTiles(index){
    //repaints the tiles according to the active tiles
    const allTiles = document.getElementById("tiles").children

    for(let tile of allTiles){
        if(parseInt(tile.getAttribute("data-index")) === index)
            tile.classList.add("activeTile")
    }
}

function gameLoop(){
    let time = 10
    //initialize texts
    document.querySelector("#time span:last-of-type").textContent = `${time}`
    document.querySelector("#score span:last-of-type").textContent = score
    const timerId = setInterval(function() {
        if(gameStart){
            time -= 1    

            if(time >= 0){
                //lower the time every second
                document.querySelector("#time span:last-of-type").textContent = `${time}`
            }
            else{
                //end the game
                gameStart = false
                //display correct things according to score
                if(score > localHighScore){
                    localStorage.setItem("highScore", score)
                    document.querySelector("#highScore span:last-of-type").textContent = score
                    newHighScore.volume = 0.2
                    newHighScore.play()
                }
                //this sound was really funny generally so i decided to keep it. It was really funny when we were trying to find an error and from the background comes this sound suddenly
                else{
                    fart.currentTime = 0
                    fart.volume = 0.2
                    fart.play()
                }
                
                clearInterval(timerId)
                if(typeof timerBar !== 'undefined'){
                    clearInterval(timerBar)
                }
            }
        }

    }, 1000)

    //this here decreases the remaining time by 40 (total is 400)
    const timerBar = setInterval(function(){
        if(gameStart){
            let barWidth = parseInt(remainingBar.style.width);
            remainingBar.style.width = `${barWidth - 40}px`
        }
    }, 100)

}

