const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

/* TODO: Change variable name for active status */
function Player(name, mark, activeStatus) {
    this.name = name
    this.mark = mark
    this.activeStatus = activeStatus
}

function gameBoard () {
    let ticTacToeBoard = () => {
        return [
            ['','',''], 
            ['','',''],
            ['','','']
        ]
    }

    /* TODO: Change argument name gameBoard to differ from function name */
    function updateBoard(gameBoard, positionA, positionB, shape) {
        if (gameBoard[positionA][positionB] === '') {
            gameBoard[positionA][positionB] = shape
        } else {
            console.log('This position is taken')
        }
        return gameBoard
    }

    return {ticTacToeBoard, updateBoard}
}

function gameController () {
    
    let setPlayers = () => {
        firstPlayer = new Player('Player One', 'X', true)
        secondPlayer = new Player('Player Two', 'O', false)
    }
    
    let getActivePlayer = (playerOne, playerTwo) => {
        if (playerOne.activeStatus === true) {
            return playerOne
        } else if (playerTwo.activeStatus === true) {
            return playerTwo
        }
    }

    function switchPlayerTurn (playerOne, playerTwo) {
        if (playerOne.activeStatus === true) {
            playerOne.activeStatus = false
            playerTwo.activeStatus = true
        } else if (playerTwo.activeStatus === false) {
            playerTwo.activeStatus = false
            playerOne.activeStatus = true
        }
    }
    
    function askMove(user) {
        rl.question(`{user.name} enter your move (row and column): `, (move) => {
            const [row, col] = move.split(' ').map(Number);
            return {row, col}
        })
    }

     // function checkForWinner 

     // function drop symbol 

}


/* initiate and display board */
let board = gameBoard().ticTacToeBoard()
console.log(board)

/* update and display board */
gameBoard().updateBoard(board,0,0,'X')
console.log(board)
