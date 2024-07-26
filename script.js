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
    function updateBoard(gameBoard, row, col, shape) {
        if (gameBoard[row][col] === '') {
            gameBoard[row][col] = shape
        } else {
            console.log('This position is taken')
        }
        return gameBoard
    }

    return {ticTacToeBoard, updateBoard}
}

function setPlayers() {
    let firstPlayer = new Player('Player One', 'X', true)
    let secondPlayer = new Player('Player Two', 'O', false)
    return {firstPlayer, secondPlayer}
}

function gameController() {
    // Initiate game to be active 
    let gameStatus = true

    // initiate players from setPlayers function
    let playerOne = setPlayers().firstPlayer
    let playerTwo = setPlayers().secondPlayer

    // initiate game board 
    // TODO: Find better variable name for ourBoard
    let ourBoard = gameBoard().ticTacToeBoard()

    // initiate move count 
    let moves = 0
    
    let getActivePlayer = () => {
        if (playerOne.activeStatus === true) {
            console.log('Player one is active')
            return playerOne
        } else if (playerTwo.activeStatus === true) {
            console.log('Player two is active')
            return playerTwo
        }
    }

    function switchPlayerTurn() {
        console.log('this is running')
        if (playerOne.activeStatus === true) {
            playerOne.activeStatus = false
            playerTwo.activeStatus = true
            console.log('Switching to player 2')
        } else if (playerTwo.activeStatus === true) {
            playerTwo.activeStatus = false
            playerOne.activeStatus = true
            console.log('Switching to player 1')
        }
    }
    
    function askMove(user) {
        // add functionality to check for availability of position 
        
        return new Promise((resolve) => {
          let pos = [];
          rl.question(`${user.name} enter your move (row and column) separated by a space: `, (move) => {
            const [row, col] = move.split(' ').map(Number);
            pos.push(row);
            pos.push(col);
            resolve(pos);
          });
        });
      }

    // TODO: Parameter name 
    function checkForWinner(gameBoard) {
        const winningCombinations = [
            // Rows
            [ [0, 0], [0, 1], [0, 2] ],
            [ [1, 0], [1, 1], [1, 2] ],
            [ [2, 0], [2, 1], [2, 2] ],
            // Columns
            [ [0, 0], [1, 0], [2, 0] ],
            [ [0, 1], [1, 1], [2, 1] ],
            [ [0, 2], [1, 2], [2, 2] ],
            // Diagonals
            [ [0, 0], [1, 1], [2, 2] ],
            [ [0, 2], [1, 1], [2, 0] ]
        ];
    
        for (let combination of winningCombinations) {
            const [a, b, c] = combination;
            if (gameBoard[a[0]][a[1]] && gameBoard[a[0]][a[1]] === gameBoard[b[0]][b[1]] && gameBoard[a[0]][a[1]] === gameBoard[c[0]][c[1]]) {
                return gameBoard[a[0]][a[1]];
            }
        }
        return null;
    }
    
      
    
    async function playGame() {
        while (gameStatus) {
          let currentPlayer = getActivePlayer();
          let playerMove = await askMove(currentPlayer);
          
          // Use the playerMove array here
          console.log('This is playerMove', playerMove);

          // Update game board array with player move 
          ourBoard = gameBoard().updateBoard(ourBoard, playerMove[0],playerMove[1], currentPlayer.mark)
          console.log(ourBoard)
          moves++;

          // Check if there is a winner
          let winningSymbol = checkForWinner(ourBoard)

          if (winningSymbol === playerOne.mark) {
            console.log('Player One wins!')
            gameStatus = false
          } else if (winningSymbol === playerTwo.mark) {
            console.log('Player Two wins!')
            gameStatus = false
          } else if (winningSymbol === null && moves == 9) {
            console.log('It is a tie!')
            gameStatus = false
          }
          
          if (gameStatus) {
            switchPlayerTurn()
          }

        }
      }

     playGame()

     return {askMove}
}

function displayController () {
    
    function loadBoard (gameBoard) {
        
    }
}

gameController()

