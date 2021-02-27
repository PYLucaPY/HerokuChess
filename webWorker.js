function whiteLegalMoves(board){
    var moves = []

    for(var indexOne = 0; indexOne < board.matrix.length; indexOne ++){
        for(var indexTwo = 0; indexTwo < board.squareNames.length; indexTwo ++){
            var squareOne = board.matrix[indexOne].square;
            var squareTwo = board.squareNames[indexTwo];
            if(board.isWhite(board.pieceAt(squareOne))){
                if(board.legal_move_turnless(squareOne, squareTwo, check)){
                    moves.push([squareOne, squareTwo]);
                }
            }
        }
    }
    
    postMessage(moves);
}

function blackLegalMoves(board){
    var moves = []

    for(var indexOne = 0; indexOne < board.matrix.length; indexOne ++){
        for(var indexTwo = 0; indexTwo < board.squareNames.length; indexTwo ++){
            var squareOne = board.matrix[indexOne].square;
            var squareTwo = board.squareNames[indexTwo];
            if(board.isBlack(board.pieceAt(squareOne))){
                if(board.legal_move_turnless(squareOne, squareTwo, check)){
                    moves.push([squareOne, squareTwo]);
                }
            }
        }
    }
    
    postMessage(moves);
}