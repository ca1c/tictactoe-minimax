// 0: empty, 1: x, 2: o

function emptySpots(board) {
    let openSpots = [];
    for(let i = 0; i < board.length; i++) {
        if(board[i] === 0) {
            openSpots.push(i);
        }
    }

    return openSpots;
}

// find if player wins
function checkWinner(board, player) {

    if(
    (board[0] == player && board[1] == player && board[2] == player) ||
    (board[3] == player && board[4] == player && board[5] == player) ||
    (board[6] == player && board[7] == player && board[8] == player) ||
    (board[0] == player && board[3] == player && board[6] == player) ||
    (board[1] == player && board[4] == player && board[7] == player) ||
    (board[2] == player && board[5] == player && board[8] == player) ||
    (board[0] == player && board[4] == player && board[8] == player) ||
    (board[2] == player && board[4] == player && board[6] == player)) {
        return true
    }
    else {
        return false
    }
}

let fc = 0;

function minimax(board, player) {
    let eSpots = emptySpots(board);
    
    // return score, score is in brackets for formatting
    if(checkWinner(board, 1)) {
        return [1];
    }
    else if(checkWinner(board, 2)) {
        return [-1];
    }
    else if(eSpots.length === 0) {
        return [0];
    }

    let moveIndex = []
    let moveScores = [];

    // recursively score each move
    for(let i = 0; i < eSpots.length; i++) {
        let newBoard = board;
        newBoard[eSpots[i]] = player;

        let totalScore;
        if(player === 1) {
            totalScore = minimax(newBoard, 2)[0];
        }
        else if(player === 2) {
            totalScore = minimax(newBoard, 1)[0];
        }

        newBoard[eSpots[i]] = 0;

        moveIndex.push(i);
        moveScores.push(totalScore);
    }

    let bestMove;
    //actual minimax functionality
    // find the best move in list of moves based on score value
    if(player === 1) {
        let max = Math.max(...moveScores);
        let index = moveIndex[moveScores.indexOf(max)]
        bestMove = [max, eSpots[index]];
    }
    else if(player === 2) {
        let min = Math.min(...moveScores);
        let index = moveIndex[moveScores.indexOf(min)]
        bestMove = [min, eSpots[index]];
    }

    return bestMove;
}

let gameBoard = [0, 0, 0, 0, 0, 0, 0, 0, 0];
var gameEl = document.getElementById("game");
let availableSpots = emptySpots(gameBoard);
let turn = 1;
let gameOver = false;

for(let i = 0; i < 9; i++) {
    let square = document.createElement('button');
    let textNode = document.createTextNode('.');
    square.appendChild(textNode);
    square.id = i.toString();

    square.addEventListener('click', function() {
        let thisSquare = document.getElementById(square.id);
        if(availableSpots.includes(parseInt(thisSquare.id)) && turn === 1 && !gameOver) {
            // player
            thisSquare.innerText = ''
            thisSquare.appendChild(document.createTextNode('X'));
            gameBoard[parseInt(thisSquare.id)] = 1;
            availableSpots = emptySpots(gameBoard);
            turn = 2;
            
            let winner = document.getElementById("winner");
            let winnerP = document.createElement('p');
            if(availableSpots.length === 0) {
                let winnerTextNode = document.createTextNode('Draw!');
                winnerP.appendChild(winnerTextNode);
                winner.appendChild(winnerP);
                gameOver = true;
                return;
            }

            // ai
            let bestMove = minimax(gameBoard, turn);
            let nextSquare = document.getElementById(bestMove[1].toString());
            nextSquare.innerText = '';
            nextSquare.appendChild(document.createTextNode('O'));
            gameBoard[bestMove[1]] = 2;
            availableSpots = emptySpots(gameBoard);
            turn = 1;


            if(checkWinner(gameBoard, 1)) {
                let winnerTextNode = document.createTextNode('X Wins!');
                winnerP.appendChild(winnerTextNode);
                winner.appendChild(winnerP);
                gameOver = true;
            }
            else if(checkWinner(gameBoard, 2)) {
                let winnerTextNode = document.createTextNode('0 Wins!');
                winnerP.appendChild(winnerTextNode);
                winner.appendChild(winnerP);
                gameOver = true;
            }
            else if(availableSpots.length === 0) {
                return [0];
            }
        }
    });

    gameEl.appendChild(square);
}