document.addEventListener("DOMContentLoaded", () => {
  const chessboard = document.querySelector('.chess-board');
  let html = '';
  let selectedSquare = null; // Track selected square
  const piecePositions = {
    'a8': 'black-rook', 'b8': 'black-knight', 'c8': 'black-bishop', 'd8': 'black-queen',
    'e8': 'black-king', 'f8': 'black-bishop', 'g8': 'black-knight', 'h8': 'black-rook',
    'a7': 'black-pawn', 'b7': 'black-pawn', 'c7': 'black-pawn', 'd7': 'black-pawn',
    'e7': 'black-pawn', 'f7': 'black-pawn', 'g7': 'black-pawn', 'h7': 'black-pawn',
    'a1': 'white-rook', 'b1': 'white-knight', 'c1': 'white-bishop', 'd1': 'white-queen',
    'e1': 'white-king', 'f1': 'white-bishop', 'g1': 'white-knight', 'h1': 'white-rook',
    'a2': 'white-pawn', 'b2': 'white-pawn', 'c2': 'white-pawn', 'd2': 'white-pawn',
    'e2': 'white-pawn', 'f2': 'white-pawn', 'g2': 'white-pawn', 'h2': 'white-pawn'
  };

  // Helper function to get piece image URL
  function getPieceImage(piece) {
    switch (piece) {
      case 'black-rook': return 'chess-pieces/Chess_rdt60.png';
      case 'black-knight': return 'chess-pieces/Chess_ndt60.png';
      case 'black-bishop': return 'chess-pieces/Chess_bdt60.png';
      case 'black-queen': return 'chess-pieces/Chess_qdt60.png';
      case 'black-king': return 'chess-pieces/Chess_kdt60.png';
      case 'black-pawn': return 'chess-pieces/Chess_pdt60.png';
      case 'white-rook': return 'chess-pieces/Chess_rlt60.png';
      case 'white-knight': return 'chess-pieces/Chess_nlt60.png';
      case 'white-bishop': return 'chess-pieces/Chess_blt60.png';
      case 'white-queen': return 'chess-pieces/Chess_qlt60.png';
      case 'white-king': return 'chess-pieces/Chess_klt60.png';
      case 'white-pawn': return 'chess-pieces/Chess_plt60.png';
      default: return '';
    }
  }

  // Function to check if a square is occupied by a piece
  function PieceAtSquare(squareNotation) {
    return piecePositions[squareNotation] || null;
  }

  // Function to calculate legal moves for pawns
  function LegalMovesPawn(selectedPiece, selectedSquare) {
    let legalMoves = [];
  
    const [file, rank] = [selectedSquare.charCodeAt(0), parseInt(selectedSquare[1])];
    const color = selectedPiece.startsWith('white') ? 'white' : 'black';
    const forwardDirection = color === 'white' ? 1 : -1;
  
    // Pawn moves
    const singleForward = `${String.fromCharCode(file)}${rank + forwardDirection}`;
    const doubleForward = `${String.fromCharCode(file)}${rank + 2 * forwardDirection}`;
    const captureLeft = `${String.fromCharCode(file - 1)}${rank + forwardDirection}`;
    const captureRight = `${String.fromCharCode(file + 1)}${rank + forwardDirection}`;
  
    // Check single forward move
    if (!PieceAtSquare(singleForward)) {
      legalMoves.push(singleForward);
  
      // Check double forward move (only on first move)
      if ((color === 'white' && rank === 2) || (color === 'black' && rank === 7)) {
        if (!PieceAtSquare(doubleForward) && !PieceAtSquare(singleForward)) {
          legalMoves.push(doubleForward);
        }
      }
    }
  
    // Check diagonal captures
    if (file > 'a'.charCodeAt(0)) {
      if (PieceAtSquare(captureLeft) && isOpponent(PieceAtSquare(captureLeft))) {
        legalMoves.push(captureLeft);
      }
    }
    if (file < 'h'.charCodeAt(0)) {
      if (PieceAtSquare(captureRight) && isOpponent(PieceAtSquare(captureRight))) {
        legalMoves.push(captureRight);
      }
    }
  
    return legalMoves;
  }

  // Function to calculate legal moves for bishops
  function LegalMovesBishop(selectedPiece, selectedSquare) {
    let legalMoves = [];
  
    const [file, rank] = [selectedSquare.charCodeAt(0), parseInt(selectedSquare[1])];
    const color = selectedPiece.startsWith('white') ? 'white' : 'black';
  
    // Helper function to check if a square is occupied by opponent's piece
    function isOpponent(piece) {
      return piece && (color === 'white' ? piece.startsWith('black') : piece.startsWith('white'));
    }
  
    // Bishop moves
    let directions = [
      { file: 1, rank: 1 }, { file: -1, rank: 1 }, { file: 1, rank: -1 }, { file: -1, rank: -1 }
    ];
    for (let dir of directions) {
      let [f, r] = [file, rank];
      while (true) {
        f += dir.file;
        r += dir.rank;
        if (f < 'a'.charCodeAt(0) || f > 'h'.charCodeAt(0) || r < 1 || r > 8) break;
        const square = `${String.fromCharCode(f)}${r}`;
        const pieceAtSquare = PieceAtSquare(square);
        if (!pieceAtSquare) {
          legalMoves.push(square);
        } else {
          if (isOpponent(pieceAtSquare)) legalMoves.push(square);
          break;
        }
      }
    }
  
    return legalMoves;
  }

  // Function to calculate legal moves for kings
  function LegalMovesKing(selectedPiece, selectedSquare) {
    let legalMoves = [];
  
    const [file, rank] = [selectedSquare.charCodeAt(0), parseInt(selectedSquare[1])];
    const color = selectedPiece.startsWith('white') ? 'white' : 'black';
  
    // Helper function to check if a square is occupied by opponent's piece
    function isOpponent(piece) {
      return piece && (color === 'white' ? piece.startsWith('black') : piece.startsWith('white'));
    }
  
    // King moves
    let directions = [
      { file: 1, rank: 0 }, { file: -1, rank: 0 }, { file: 0, rank: 1 }, { file: 0, rank: -1 },
      { file: 1, rank: 1 }, { file: -1, rank: 1 }, { file: 1, rank: -1 }, { file: -1, rank: -1 }
    ];
    for (let dir of directions) {
      const f = file + dir.file;
      const r = rank + dir.rank;
      if (f >= 'a'.charCodeAt(0) && f <= 'h'.charCodeAt(0) && r >= 1 && r <= 8) {
        const square = `${String.fromCharCode(f)}${r}`;
        const pieceAtSquare = PieceAtSquare(square);
        if (!pieceAtSquare || isOpponent(pieceAtSquare)) {
          legalMoves.push(square);
        }
      }
    }
  
    return legalMoves;
  }

  // Function to calculate legal moves for rooks
  function LegalMovesRook(selectedPiece, selectedSquare) {
    let legalMoves = [];
  
    const [file, rank] = [selectedSquare.charCodeAt(0), parseInt(selectedSquare[1])];
    const color = selectedPiece.startsWith('white') ? 'white' : 'black';
  
    // Helper function to check if a square is occupied by opponent's piece
    function isOpponent(piece) {
      return piece && (color === 'white' ? piece.startsWith('black') : piece.startsWith('white'));
    }
  
    // Rook moves
    let directions = [
      { file: 1, rank: 0 }, { file: -1, rank: 0 }, { file: 0, rank: 1 }, { file: 0, rank: -1 }
    ];
    for (let dir of directions) {
      let [f, r] = [file, rank];
      while (true) {
        f += dir.file;
        r += dir.rank;
        if (f < 'a'.charCodeAt(0) || f > 'h'.charCodeAt(0) || r < 1 || r > 8) break;
        const square = `${String.fromCharCode(f)}${r}`;
        const pieceAtSquare = PieceAtSquare(square);
        if (!pieceAtSquare) {
          legalMoves.push(square);
        } else {
          if (isOpponent(pieceAtSquare)) legalMoves.push(square);
          break;
        }
      }
    }
  
    return legalMoves;
  }

  // Function to calculate legal moves for queens
  function LegalMovesQueen(selectedPiece, selectedSquare) {
    const rookMoves = LegalMovesRook(selectedPiece, selectedSquare);
    const bishopMoves = LegalMovesBishop(selectedPiece, selectedSquare);
    return [...new Set([...rookMoves, ...bishopMoves])];
  }

  // Function to calculate legal moves for knights
  function LegalMovesKnight(selectedPiece, selectedSquare) {
    let legalMoves = [];
  
    const [file, rank] = [selectedSquare.charCodeAt(0), parseInt(selectedSquare[1])];
    const color = selectedPiece.startsWith('white') ? 'white' : 'black';
  
    // Knight moves
    let moves = [
      { file: 1, rank: 2 }, { file: 2, rank: 1 }, { file: -1, rank: 2 }, { file: 2, rank: -1 },
      { file: -2, rank: 1 }, { file: 1, rank: -2 }, { file: -2, rank: -1 }, { file: -1, rank: -2 }
    ];
    for (let move of moves) {
      const f = file + move.file;
      const r = rank + move.rank;
      if (f >= 'a'.charCodeAt(0) && f <= 'h'.charCodeAt(0) && r >= 1 && r <= 8) {
        const square = `${String.fromCharCode(f)}${r}`;
        const pieceAtSquare = PieceAtSquare(square);
        if (!pieceAtSquare || isOpponent(pieceAtSquare)) {
          legalMoves.push(square);
        }
      }
    }
  
    return legalMoves;
  }

  // Function to check if a square is occupied by opponent's piece
  function isOpponent(piece) {
    const color = piecePositions[selectedSquare].startsWith('white') ? 'black' : 'white';
    return piece && piece.startsWith(color);
  }

  // Render the initial chessboard
  for (let i = 8; i >= 1; i--) {
    for (let j = 0; j < 8; j++) {
      const squareNotation = String.fromCharCode('a'.charCodeAt(0) + j) + i;
      const squareClass = (i + j) % 2 === 0 ? 'BlackSquares' : 'WhiteSquares';
      const piece = PieceAtSquare(squareNotation);
      const pieceImageSrc = piece ? getPieceImage(piece) : '';
      const pieceHTML = pieceImageSrc ? `<img src="${pieceImageSrc}" class="chess-piece-img">` : '';
      html += `<div class='${String.fromCharCode('a'.charCodeAt(0) + j)}${i} ${squareClass} chess-piece' data-square='${squareNotation}'>${pieceHTML}</div>`;
    }
  }

  // Render chessboard HTML
  chessboard.innerHTML = html;

  // Add click event listeners to squares
  const squares = document.querySelectorAll('.chess-piece');

  squares.forEach(square => {
    square.addEventListener('click', function() {
      const squareNotation = this.getAttribute('data-square');
      const currentPiece = PieceAtSquare(squareNotation);

      if (selectedSquare && PieceAtSquare(selectedSquare)) {
        const selectedPiece = PieceAtSquare(selectedSquare);
        
        // Move the piece if it's a legal move
        if (getLegalMoves(selectedPiece, selectedSquare).includes(squareNotation)) {
          piecePositions[squareNotation] = selectedPiece;
          delete piecePositions[selectedSquare];

          // Update UI
          const selectedPieceElement = document.querySelector(`.chess-piece[data-square="${selectedSquare}"]`);
          const targetSquareElement = document.querySelector(`.chess-piece[data-square="${squareNotation}"]`);

          if (selectedPieceElement && targetSquareElement) {
            targetSquareElement.innerHTML = selectedPieceElement.innerHTML;
            selectedPieceElement.innerHTML = '';
          }
        }
        
        // Clear selection and remove highlight
        selectedSquare = null;
        squares.forEach(sq => sq.classList.remove('highlight'));

        // Clear legal move highlights
        squares.forEach(sq => sq.classList.remove('legal-move'));
      } else if (currentPiece) {
        // Highlight legal moves for the selected piece
        squares.forEach(sq => sq.classList.remove('legal-move'));
        this.classList.add('highlight');
        selectedSquare = squareNotation;
        getLegalMoves(currentPiece, squareNotation).forEach(move => {
          const squareElement = document.querySelector(`.chess-piece[data-square="${move}"]`);
          if (squareElement) {
            squareElement.classList.add('legal-move');
          }
        });
      }
    });
  });

  // Function to determine legal moves based on piece type
  function getLegalMoves(piece, square) {
    switch (piece) {
      case 'black-pawn':
      case 'white-pawn':
        return LegalMovesPawn(piece, square);
      case 'black-bishop':
      case 'white-bishop':
        return LegalMovesBishop(piece, square);
      case 'black-king':
      case 'white-king':
        return LegalMovesKing(piece, square);
      case 'black-rook':
      case 'white-rook':
        return LegalMovesRook(piece, square);
      case 'black-queen':
      case 'white-queen':
        return LegalMovesQueen(piece, square);
      case 'black-knight':
      case 'white-knight':
        return LegalMovesKnight(piece, square);
      default:
        return [];
    }
  }
});
