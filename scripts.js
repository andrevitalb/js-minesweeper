// UI

// 1. Create a board N x M (8, 8)
// 2. Left click
// Status update: Show
// 3. Check win/lose

import {
	TILE_STATUSES,
	createBoard,
	revealTile,
	markTile,
	checkWin,
	checkLose,
} from './minesweeper.js';

const BOARD_WIDTH = 8;
const BOARD_HEIGHT = 8;
const MINE_COUNT = 10;

const board = createBoard(BOARD_WIDTH, BOARD_HEIGHT, MINE_COUNT);
const boardElement = document.querySelector('.board');
const messageElement = document.querySelector('.message');

// console.log(board);

boardElement.style.setProperty('--width', BOARD_WIDTH);
boardElement.style.setProperty('--height', BOARD_HEIGHT);

board.forEach((row) => {
	row.forEach((tile) => {
		boardElement.append(tile.tile);
		tile.tile.addEventListener('click', () => {
			revealTile(board, tile);
			checkEndGame();
		});

		tile.tile.addEventListener('contextmenu', (e) => {
			e.preventDefault();
			markTile(tile);
		});
	});
});

const checkEndGame = () => {
	const win = checkWin(board);
	const lose = checkLose(board);

	if (win || lose) boardElement.addEventListener('click', stopProp, { capture: true });

	if (win) messageElement.textContent = 'Congrats! You win.';
	if (lose) {
		messageElement.textContent = 'Aww. You lost. Try again :)';
		board.forEach((row) =>
			row.forEach((tile) => {
				if (tile.mine) revealTile(board, tile);
			})
		);
	}
};

const stopProp = (e) => e.stopImmediatePropagation();
