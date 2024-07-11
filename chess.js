document.addEventListener("DOMContentLoaded", () => {
  const chessboard = document.querySelector('.chess-board');
  let html = '';
  let selectedSquare = null; // Track selected square
  let piecePositions = {
    'a8': 'black-rook', 'b8': 'black-knight', 'c8': 'black-bishop', 'd8': 'black-queen',
    'e8': 'black-king', 'f8': 'black-bishop', 'g8': 'black-knight', 'h8': 'black-rook',
    'a7': 'black-pawn', 'b7': 'black-pawn', 'c7': 'black-pawn', 'd7': 'black-pawn',
    'e7': 'black-pawn', 'f7': 'black-pawn', 'g7': 'black-pawn', 'h7': 'black-pawn',
    'a1': 'white-rook', 'b1': 'white-knight', 'c1': 'white-bishop', 'd1': 'white-queen',
    'e1': 'white-king', 'f1': 'white-bishop', 'g1': 'white-knight', 'h1': 'white-rook',
    'a2': 'white-pawn', 'b2': 'white-pawn', 'c2': 'white-pawn', 'd2': 'white-pawn',
    'e2': 'white-pawn', 'f2': 'white-pawn', 'g2': 'white-pawn', 'h2': 'white-pawn'
  };
  let currentPlayer = 'white';

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

  function PieceAtSquare(squareNotation) {
    return piecePositions[squareNotation] || null;
  }

  function LegalMovesPawn(piece, square) {
    const legalMoves = [];
    const [file, rank] = [square.charCodeAt(0), parseInt(square[1])];
    const color = piece.split('-')[0];
    const forwardDirection = color === 'white' ? 1 : -1;

    // Single move
    const singleForward = `${String.fromCharCode(file)}${rank + forwardDirection}`;
    if (!PieceAtSquare(singleForward)) {
      legalMoves.push(singleForward);

      // Double move 
      const doubleForward = `${String.fromCharCode(file)}${rank + 2 * forwardDirection}`;
      if ((color === 'white' && rank === 2) || (color === 'black' && rank === 7)) {
        if (!PieceAtSquare(doubleForward) && !PieceAtSquare(singleForward)) {
          legalMoves.push(doubleForward);
        }
      }
    }

    // Capture moves
    const captureLeft = `${String.fromCharCode(file - 1)}${rank + forwardDirection}`;
    const captureRight = `${String.fromCharCode(file + 1)}${rank + forwardDirection}`;
    if (file > 'a'.charCodeAt(0)) {
      if (PieceAtSquare(captureLeft) && PieceAtSquare(captureLeft).startsWith(color === 'white' ? 'black' : 'white')) {
        legalMoves.push(captureLeft);
      }
    }
    if (file < 'h'.charCodeAt(0)) {
      if (PieceAtSquare(captureRight) && PieceAtSquare(captureRight).startsWith(color === 'white' ? 'black' : 'white')) {
        legalMoves.push(captureRight);
      }
    }

    return legalMoves;
  }

  function LegalMovesRook(piece, square) {
    const legalMoves = [];
    const [file, rank] = [square.charCodeAt(0), parseInt(square[1])];

    // Horizontal moves
    for (let f = file + 1; f <= 'h'.charCodeAt(0); f++) {
      const squareNotation = `${String.fromCharCode(f)}${rank}`;
      if (!PieceAtSquare(squareNotation)) {
        legalMoves.push(squareNotation);
      } else {
        if (PieceAtSquare(squareNotation).startsWith(piece.split('-')[0] === 'white' ? 'black' : 'white')) {
          legalMoves.push(squareNotation);
        }
        break;
      }
    }
    for (let f = file - 1; f >= 'a'.charCodeAt(0); f--) {
      const squareNotation = `${String.fromCharCode(f)}${rank}`;
      if (!PieceAtSquare(squareNotation)) {
        legalMoves.push(squareNotation);
      } else {
        if (PieceAtSquare(squareNotation).startsWith(piece.split('-')[0] === 'white' ? 'black' : 'white')) {
          legalMoves.push(squareNotation);
        }
        break;
      }
    }

    // Vertical moves
    for (let r = rank + 1; r <= 8; r++) {
      const squareNotation = `${String.fromCharCode(file)}${r}`;
      if (!PieceAtSquare(squareNotation)) {
        legalMoves.push(squareNotation);
      } else {
        if (PieceAtSquare(squareNotation).startsWith(piece.split('-')[0] === 'white' ? 'black' : 'white')) {
          legalMoves.push(squareNotation);
        }
        break;
      }
    }
    for (let r = rank - 1; r >= 1; r--) {
      const squareNotation = `${String.fromCharCode(file)}${r}`;
      if (!PieceAtSquare(squareNotation)) {
        legalMoves.push(squareNotation);
      } else {
        if (PieceAtSquare(squareNotation).startsWith(piece.split('-')[0] === 'white' ? 'black' : 'white')) {
          legalMoves.push(squareNotation);
        }
        break;
      }
    }

    return legalMoves;
  }

  function LegalMovesKnight(piece, square) {
    const legalMoves = [];
    const [file, rank] = [square.charCodeAt(0), parseInt(square[1])];
    const knightMoves = [
      [file + 2, rank + 1], [file + 2, rank - 1], [file - 2, rank + 1], [file - 2, rank - 1],
      [file + 1, rank + 2], [file + 1, rank - 2], [file - 1, rank + 2], [file - 1, rank - 2]
    ];

    knightMoves.forEach(([f, r]) => {
      if (f >= 'a'.charCodeAt(0) && f <= 'h'.charCodeAt(0) && r >= 1 && r <= 8) {
        const squareNotation = `${String.fromCharCode(f)}${r}`;
        if (!PieceAtSquare(squareNotation) || PieceAtSquare(squareNotation).startsWith(piece.split('-')[0] === 'white' ? 'black' : 'white')) {
          legalMoves.push(squareNotation);
        }
      }
    });

    return legalMoves;
  }

  function LegalMovesBishop(piece, square) {
    const legalMoves = [];
    const [file, rank] = [square.charCodeAt(0), parseInt(square[1])];

    // Top-right diagonal
    let f = file + 1;
    let r = rank + 1;
    while (f <= 'h'.charCodeAt(0) && r <= 8) {
      const squareNotation = `${String.fromCharCode(f)}${r}`;
      if (!PieceAtSquare(squareNotation)) {
        legalMoves.push(squareNotation);
      } else {
        if (PieceAtSquare(squareNotation).startsWith(piece.split('-')[0] === 'white' ? 'black' : 'white')) {
          legalMoves.push(squareNotation);
        }
        break;
      }
      f++;
      r++;
    }

    // Top-left diagonal
    f = file - 1;
    r = rank + 1;
    while (f >= 'a'.charCodeAt(0) && r <= 8) {
      const squareNotation = `${String.fromCharCode(f)}${r}`;
      if (!PieceAtSquare(squareNotation)) {
        legalMoves.push(squareNotation);
      } else {
        if (PieceAtSquare(squareNotation).startsWith(piece.split('-')[0] === 'white' ? 'black' : 'white')) {
          legalMoves.push(squareNotation);
        }
        break;
      }
      f--;
      r++;
    }

    // Bottom-right diagonal
    f = file + 1;
    r = rank - 1;
    while (f <= 'h'.charCodeAt(0) && r >= 1) {
      const squareNotation = `${String.fromCharCode(f)}${r}`;
      if (!PieceAtSquare(squareNotation)) {
        legalMoves.push(squareNotation);
      } else {
        if (PieceAtSquare(squareNotation).startsWith(piece.split('-')[0] === 'white' ? 'black' : 'white')) {
          legalMoves.push(squareNotation);
        }
        break;
      }
      f++;
      r--;
    }

    // Bottom-left diagonal
    f = file - 1;
    r = rank - 1;
    while (f >= 'a'.charCodeAt(0) && r >= 1) {
      const squareNotation = `${String.fromCharCode(f)}${r}`;
      if (!PieceAtSquare(squareNotation)) {
        legalMoves.push(squareNotation);
      } else {
        if (PieceAtSquare(squareNotation).startsWith(piece.split('-')[0] === 'white' ? 'black' : 'white')) {
          legalMoves.push(squareNotation);
        }
        break;
      }
      f--;
      r--;
    }

    return legalMoves;
  }

  function LegalMovesQueen(piece, square) {
    const rookMoves = LegalMovesRook(piece, square);
    const bishopMoves = LegalMovesBishop(piece, square);
    return [...rookMoves, ...bishopMoves];
  }

  function LegalMovesKing(piece, square) {
    const legalMoves = [];
    const [file, rank] = [square.charCodeAt(0), parseInt(square[1])];
    const kingMoves = [
      [file + 1, rank], [file - 1, rank], [file, rank + 1], [file, rank - 1],
      [file + 1, rank + 1], [file + 1, rank - 1], [file - 1, rank + 1], [file - 1, rank - 1]
    ];

    kingMoves.forEach(([f, r]) => {
      if (f >= 'a'.charCodeAt(0) && f <= 'h'.charCodeAt(0) && r >= 1 && r <= 8) {
        const squareNotation = `${String.fromCharCode(f)}${r}`;
        if (!PieceAtSquare(squareNotation) || PieceAtSquare(squareNotation).startsWith(piece.split('-')[0] === 'white' ? 'black' : 'white')) {
          legalMoves.push(squareNotation);
        }
      }
    });

    return legalMoves;
  }

  function LegalMoves(piece, square) {
    switch (piece.split('-')[1]) {
      case 'pawn': return LegalMovesPawn(piece, square);
      case 'rook': return LegalMovesRook(piece, square);
      case 'knight': return LegalMovesKnight(piece, square);
      case 'bishop': return LegalMovesBishop(piece, square);
      case 'queen': return LegalMovesQueen(piece, square);
      case 'king': return LegalMovesKing(piece, square);
      default: return [];
    }
  }

  function isSquareInCheck(square, color) {
    const opponentColor = color === 'white' ? 'black' : 'white';
    const opponentPieces = Object.keys(piecePositions).filter(key => piecePositions[key].startsWith(opponentColor));
    for (let i = 0; i < opponentPieces.length; i++) {
      const piece = piecePositions[opponentPieces[i]];
      const legalMoves = LegalMoves(piece, opponentPieces[i]);
      if (legalMoves.includes(square)) {
        return true;
      }
    }
    return false;
  }

  function isKingInCheckmate(color) {
    const kingSquare = Object.keys(piecePositions).find(key => piecePositions[key] === `${color}-king`);
    const kingLegalMoves = LegalMovesKing(`${color}-king`, kingSquare);
    const kingInCheck = isSquareInCheck(kingSquare, color);

    // Check if the king has no legal moves and is in check
    if (kingLegalMoves.length === 0 && kingInCheck) {
      return true;
    }
    return false;
  }

  function isStalemate(color) {
    const allLegalMoves = [];
    const pieces = Object.keys(piecePositions).filter(key => piecePositions[key].startsWith(color));
    pieces.forEach(square => {
      const piece = piecePositions[square];
      const legalMoves = LegalMoves(piece, square);
      allLegalMoves.push(...legalMoves);
    });

    if (allLegalMoves.length === 0 && !isSquareInCheck(getKingSquare(color), color)) {
      return true;
    }
    return false;
  }

  function getKingSquare(color) {
    return Object.keys(piecePositions).find(key => piecePositions[key] === `${color}-king`);
  }

  function renderBoard() {
    html = '';
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

    chessboard.innerHTML = html;
    addEventListeners();
  }

  function addEventListeners() {
    const squares = document.querySelectorAll('.chess-piece');
    squares.forEach(square => {
      square.removeEventListener('click', handleClick);
      square.addEventListener('click', handleClick);
    });
  }

  function handleClick() {
    const squareNotation = this.getAttribute('data-square');
    const currentPiece = PieceAtSquare(squareNotation);

    if (selectedSquare && PieceAtSquare(selectedSquare)) {
      const selectedPiece = PieceAtSquare(selectedSquare);

      // Move the piece if it's a legal move
      const legalMoves = LegalMoves(selectedPiece, selectedSquare);
      if (legalMoves.includes(squareNotation)) {
        // Check if move puts own king in check
        const opponentColor = currentPlayer === 'white' ? 'black' : 'white';
        const opponentKingSquare = getKingSquare(opponentColor);
        const pieceAtTarget = PieceAtSquare(squareNotation);
        piecePositions[squareNotation] = selectedPiece;
        delete piecePositions[selectedSquare];
        const isCheck = isSquareInCheck(opponentKingSquare, opponentColor);

        if (isCheck) {
          piecePositions[selectedSquare] = selectedPiece;
          if (pieceAtTarget) {
            piecePositions[squareNotation] = pieceAtTarget;
          } else {
            delete piecePositions[squareNotation];
          }
          alert(`Move not allowed! ${currentPlayer} king is in check.`);
        } else {
          if (pieceAtTarget && pieceAtTarget.startsWith(opponentColor)) {
            document.querySelector(`.chess-piece[data-square="${squareNotation}"]`).classList.add('capture-move');
          }
          currentPlayer = currentPlayer === 'white' ? 'black' : 'white';
          renderBoard();
        }
      } else {
        alert('Illegal move!');
      }

      // Clear selection and highlights
      selectedSquare = null;
      squares.forEach(sq => sq.classList.remove('legal-move', 'capture-move', 'in-check'));
    } else if (currentPiece && currentPiece.startsWith(currentPlayer)) {
      // Highlight legal moves for the selected piece
      selectedSquare = squareNotation;
      highlightLegalMoves(squareNotation);
    }
  }

  function highlightLegalMoves(square) {
    const piece = PieceAtSquare(square);
    const legalMoves = LegalMoves(piece, square);

    // Highlight legal moves
    const squares = document.querySelectorAll('.chess-piece');
    squares.forEach(sq => sq.classList.remove('legal-move', 'capture-move', 'in-check'));
    legalMoves.forEach(move => {
      const squareElement = document.querySelector(`.chess-piece[data-square="${move}"]`);
      if (squareElement) {
        squareElement.classList.add('legal-move');
      }
    });

    // Highlight capturing moves
    squares.forEach(sq => {
      const squareNotation = sq.getAttribute('data-square');
      const targetPiece = PieceAtSquare(squareNotation);
      if (targetPiece && targetPiece.startsWith(currentPlayer === 'white' ? 'black' : 'white') && legalMoves.includes(squareNotation)) {
        sq.classList.add('capture-move');
      }
    });

    // Highlight check
    const kingSquare = getKingSquare(currentPlayer);
    if (isSquareInCheck(kingSquare, currentPlayer)) {
      document.querySelector(`.chess-piece[data-square="${kingSquare}"]`).classList.add('in-check');
    }
  }

  renderBoard();
});
