<html>
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1">

		<title>Sudoku</title>
		<link rel="stylesheet" type="text/css" href="sudoku.css">
	</head>
	<body>
		<h1 id="header">Sudoku</h1>
		<div class="sudoku">
			<form id="form">
				<table id="sudoku-table">
				</table>
			</form>

			<div id="buttons">
				<button onClick="randomize()" id="randomize">Randomize</button>

				<div id="validate-container">
					<button onClick="validate()" id="validate">Validate</button>
					<p id="fields-left">81 fields left</p>
				</div>
			</div>
		</div>

		<script type="text/javascript">
			let field = [];

			function buildField() {
				for (let row = 1; row <= 9; row++) {
					let tr = document.createElement('tr');
					tr.id = 'row' + row;

					for (let col = 1; col <= 9; col++) {
						let td = document.createElement('td');
						td.id = 'col' + col;

						let input = document.createElement('input');
						input.type = 'text';
						input.maxLength = 1;
						input.addEventListener('keydown', checkKeyDown);
						input.addEventListener('input', updateFieldsLeft);

						td.appendChild(input);
						tr.appendChild(td);
					}

					document.getElementById('sudoku-table').appendChild(tr);
				}
			}

			function fillField() {
				field = [];
				for (let y = 0; y < 9; y++) {
					field[y] = [];
					for (let x = 0; x < 9; x++) {
						field[y][x] = 0;
					}
				}
				console.log(field);
			}

			function validateRow(row) {
				let contains = [];
				for (let x = 0; x < row.length; x++) {
					if (contains.indexOf(row[x]) > -1) {
						// Already exists
						return false;
					} else {
						// If it's not empty
						if (row[x] !== 0) {
							// Not exists
							contains.push(row[x]);
						}
					}
				}

				return true;
			}

			function validateCol(x, rows) {
				let contains = [];
				for (let y = 0; y < rows.length; y++) {
					if (contains.indexOf(rows[y][x]) > -1) {
						// Already exists
						return false;
					} else {
						// If it's not empty
						if (rows[y][x] !== 0) {
							// Not exists
							contains.push(rows[y][x]);
						}
					}
				}

				return true;
			}

			function validateBlock(blockNum, blockRow) {
				let block = [];
				for (let y = 0; y < 3; y++) {
					let row = [];

					row[0] = blockRow[y][blockNum * 3];
					row[1] = blockRow[y][blockNum * 3 + 1];
					row[2] = blockRow[y][blockNum * 3 + 2];

					block.push(row);
				}

				let contains = [];
				for (let y = 0; y < block.length; y++) {
					for (let x = 0; x < block[y].length; x++) {
						if (contains.indexOf(block[y][x]) > -1) {
							// Already exists
							return false;
						} else {
							// If it's not empty
							if (block[y][x] !== 0) {
								// Not exists
								contains.push(block[y][x]);
							}
						}
					}
				}

				return true;
			}

			function validateField() {
				// Validate rows
				for (let y = 0; y < field.length; y++) {
					if (!validateRow(field[y])) {
						return false;
					}
				}

				// Validate cols
				for (let x = 0; x < field[0].length; x++) {
					if (!validateCol(x, field)) {
						return false;
					}
				}

				// Validate blocks
				for (let blockY = 0; blockY < 3; blockY++) {
					let blockRow = [
						field[blockY * 3],
						field[blockY * 3 + 1],
						field[blockY * 3 + 2]
					];

					for (let blockX = 0; blockX < 3; blockX++) {
						if (!validateBlock(blockX, blockRow)) {
							return false;
						}
					}
				}

				return true;
			}

			function getField() {
				for (let row = 1; row <= 9; row++) {
					for (let col = 1; col <= 9; col++) {
						let currentValue = parseInt(document.querySelectorAll('#row' + row + ' #col' + col + ' input')[0].value);

						if (!isNaN(currentValue)) {
							field[row - 1][col - 1] = currentValue;
						} else {
							field[row - 1][col - 1] = 0;
						}
					}
				}
			}

			function updateField() {
				for (let row = 1; row <= 9; row++) {
					for (let col = 1; col <= 9; col++) {
						if (field[row - 1][col - 1] !== 0) {
							document.querySelectorAll('#row' + row + ' #col' + col + ' input')[0].value = field[row - 1][col - 1];
						} else {
							document.querySelectorAll('#row' + row + ' #col' + col + ' input')[0].value = '';
						}
					}
				}
			}

			function updateFieldsLeft() {
				let fieldsLeft = 0;

				for (let row = 1; row <= 9; row++) {
					for (let col = 1; col <= 9; col++) {
						if (document.querySelectorAll('#row' + row + ' #col' + col + ' input')[0].value.length === 0) {
							fieldsLeft++;
						}
					}
				}

				document.getElementById('fields-left').innerHTML = fieldsLeft + ' fields left';
			}

			function checkKeyDown(event) {
				if (event.key !== 'Backspace' && !event.key.match(/^[1-9]$/g))
					event.preventDefault();
			}

			function randomize() {
				fillField();
				updateField();

				for (let y = 0; y < field.length; y++) {
					for (let x = 0; x < field[y].length; x++) {
						if (Math.floor(Math.random() * 2) === 0) {
							field[y][x] = Math.floor((Math.random() * 9) + 1);

							let valid = validateField();

							if (!valid) {
								field[y][x] = 0;
							}
						}
					}
				}

				updateField();
				updateFieldsLeft();
			}

			function validate() {
				let button = document.getElementById('validate');

				getField();
				let valid = validateField();

				if (valid) {
					button.classList.add('valid');
					button.innerHTML = '✔';
				} else {
					button.classList.add('invalid');
					button.innerHTML = '✘';
				}

				setTimeout(function () {
					button.classList.remove('valid');
					button.classList.remove('invalid');

					button.innerHTML = 'Validate';
				}, 2500);
			}

			function init() {
				buildField();
				fillField();
				updateFieldsLeft();
			}

			document.addEventListener('DOMContentLoaded', init);
			if (document.readyState === 'interactive' || document.readyState === 'complete') {
				init();
			}
		</script>
	</body>
</html>







