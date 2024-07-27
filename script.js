// TODO: make one playgame function compatible with both HTML and Terminal
// TODO: Improve overall design 
// TODO: Comment out code 

/*

const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

*/

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
    function updateBoardArray(gameBoard, row, col, shape) {
        gameBoard[row][col] = shape
        return gameBoard
    }

    return {ticTacToeBoard, updateBoardArray}
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
            return playerOne
        } else if (playerTwo.activeStatus === true) {
            return playerTwo
        }
    }

    function switchPlayerTurn() {
        if (playerOne.activeStatus === true) {
            playerOne.activeStatus = false
            playerTwo.activeStatus = true
        } else if (playerTwo.activeStatus === true) {
            playerTwo.activeStatus = false
            playerOne.activeStatus = true
        }
    }
    
    function askMove(user) {
        return new Promise((resolve) => {
            const ask = () => {
                rl.question(`${user.name} enter your move (row and column) separated by a space: `, (move) => {
                    const parts = move.split(' ');
                    if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
                        const [row, col] = parts.map(Number);
                        if (row >= 0 && row <= 2 && col >= 0 && col <= 2) {
                            if (ourBoard[row][col] === '') {
                                resolve([row, col]);
                            } else {
                                console.log('This position is taken. Please choose another one.');
                                ask(); // Re-ask the user for a valid move
                            }
                        } else {
                            console.log('Invalid input. Row and column must be between 0 and 2.');
                            ask(); // Re-ask the user for a valid input
                        }
                    } else {
                        console.log('Invalid input. Please enter two integers separated by a space.');
                        ask(); // Re-ask the user for a valid input
                    }
                });
            };
            ask();
        });
    }

    function waitForUserClick() {
        return new Promise(resolve => {
            const cells = document.querySelectorAll('.cell');
            const handleClick = (event) => {
                const cell = event.target;
                if (cell.textContent === '') {
                    cells.forEach(c => c.removeEventListener('click', handleClick)); // Remove all click listeners
                    resolve(cell);
                } else {
                    alert('Cell already taken, please choose another one.');
                }
            };
            cells.forEach(cell => {
                cell.addEventListener('click', handleClick);
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
    
    async function playGameTerminal() {
        while (gameStatus) {
          let currentPlayer = getActivePlayer();
          let playerMove = await askMove(currentPlayer);
          
          // Update game board array with player move 
          ourBoard = gameBoard().updateBoardArray(ourBoard, playerMove[0],playerMove[1], currentPlayer.mark)
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
            switchPlayerTurn();
          }
        }

        rl.close();
      }

    async function playGameHTML() {
        while (gameStatus) {
            // Set current player
            let currentPlayer = getActivePlayer();
            
            // Set display to show who's turn it is
            displayController().displayTurn(`${currentPlayer.name}'s turn!`)
            
            // Current player's turn to choose a cell
            let clickedCell = await waitForUserClick();
            
            // Retrieve data of cell chosen by the user
            let data = clickedCell.getAttribute('data-index')
            
            // Display user's mark on the cell 
            displayController().updateCellDisplay(clickedCell, currentPlayer.mark)
            
            // Update board array
            ourBoard = gameBoard().updateBoardArray(ourBoard, data[0], data[2], currentPlayer.mark)
            console.log(ourBoard)
            
            // increase moves count 
            moves++; 

            // Check if there is a winner
            let winningSymbol = checkForWinner(ourBoard)

            if (winningSymbol === playerOne.mark || winningSymbol === playerTwo.mark) {
                displayController().displayTurn(`${currentPlayer.name} wins!`)
                gameStatus = false
              } else if (winningSymbol === null && moves == 9) {
                displayController().displayTurn(`It's a tie!`)
                gameStatus = false
              }
            
            // If the game is not over, we switch turns for next play
            if (gameStatus) {
                switchPlayerTurn();
            }            
        }
    }

    playGameHTML()
}

function displayController() {
    
    function loadBoard() {
        let cellArray = [
            ['','',''], 
            ['','',''],
            ['','','']
        ]

        const cellContainer = document.getElementById('game-display')

        cellArray.map((row, rowIndex) => {
            row.map((cellContent, colIndex) => {
                const cell = document.createElement('div');
                cell.className = 'cell';
                cell.textContent = cellContent;
                cell.setAttribute('data-index', `${rowIndex}-${colIndex}`)
                cellContainer.appendChild(cell)
            })
        })
    }

    function displayTurn(phrase) {
        const displayBoard = document.getElementById('display-board')
        displayBoard.textContent = phrase

    }

    function updateCellDisplay(cell, content) {
        cell.textContent = content
    }

    return {loadBoard, displayTurn, updateCellDisplay}
}

// gameController()

displayController().loadBoard()
gameController()
