export const TILE_STATUSES = {
	HIDDEN: 'hidden',
	MINE: 'mine',
	NUMBER: 'number',
	MARKED: 'marked',
};

export const createBoard = (boardWidth, boardHeight, mineCount) => {
	const board = [];
	const mines = getMines(boardWidth, boardHeight, mineCount);

	for (let x = 0; x < boardWidth; x++) {
		const row = [];
		for (let y = 0; y < boardHeight; y++) {
			const tile = document.createElement('div');
			tile.dataset.status = TILE_STATUSES.HIDDEN;

			row.push({
				x,
				y,
				mine: mines.some((m) => checkPositionMatch({ x, y }, m)),
				tile,
				get status() {
					return this.tile.dataset.status;
				},
				set status(value) {
					this.tile.dataset.status = value;
				},
			});
		}
		board.push(row);
	}
	return board;
};

export const revealTile = (board, tile) => {
	if (tile.status !== TILE_STATUSES.HIDDEN && tile.status !== TILE_STATUSES.MARKED) return;

	if (tile.mine) {
		tile.status = TILE_STATUSES.MINE;
		return;
	}

	tile.status = TILE_STATUSES.NUMBER;
	const neighbors = neighborTiles(board, { x: tile.x, y: tile.y });
	const mines = neighbors.filter((n) => n.mine);

	if (mines.length === 0) neighbors.forEach((nT) => revealTile(board, nT));
	else tile.tile.textContent = mines.length;
};

export const markTile = (tile) => {
	if (tile.status !== TILE_STATUSES.HIDDEN && tile.status !== TILE_STATUSES.MARKED) return;
	if (tile.status === TILE_STATUSES.MARKED) tile.status = TILE_STATUSES.HIDDEN;
	else tile.status = TILE_STATUSES.MARKED;
};

export const checkWin = (board) => {
	return board.every((row) => {
		return row.every((tile) => {
			return (
				tile.status === TILE_STATUSES.NUMBER ||
				(tile.mine && tile.status === TILE_STATUSES.HIDDEN)
			);
		});
	});
};

export const checkLose = (board) =>
	board.some((row) => row.some((tile) => tile.status === TILE_STATUSES.MINE));

const getMines = (boardWidth, boardHeight, mineCount) => {
	const minePositions = [];

	while (minePositions.length < mineCount) {
		const minePosition = {
			x: randomCoordinate(boardWidth),
			y: randomCoordinate(boardHeight),
		};

		if (!minePositions.some((p) => checkPositionMatch(p, minePosition)))
			minePositions.push(minePosition);
	}

	return minePositions;
};

const checkPositionMatch = (a, b) => a.x === b.x && a.y === b.y;
const randomCoordinate = (length) => Math.floor(Math.random() * length);

const neighborTiles = (board, { x, y }) => {
	const neighbors = [];

	for (let xOffset = -1; xOffset <= 1; xOffset++) {
		for (let yOffset = -1; yOffset <= 1; yOffset++) {
			const neighbor = board[x + xOffset]?.[y + yOffset];
			if (neighbor) neighbors.push(neighbor);
		}
	}

	return neighbors;
};
