// strategyManager.test.js

import { StrategyManager } from './node_modules/@sudoku/strategy/strategyManager.js';
import { lastRemainStrategy } from './node_modules/@sudoku/strategy/lastRemainStrategy.js';
import { nakePairStrategy } from './node_modules/@sudoku/strategy/nakePair.js';
import { hiddenPairStrategy } from './node_modules/@sudoku/strategy/hiddenPair.js';

const testCases = [
    {
        name: 'Very Easy Sudoku',
        puzzle: [
            [5, 3, 0, 0, 7, 0, 0, 0, 0],
            [6, 0, 0, 1, 9, 5, 0, 0, 0],
            [0, 9, 8, 0, 0, 0, 0, 6, 0],
            [8, 0, 0, 0, 6, 0, 0, 0, 3],
            [4, 0, 0, 8, 0, 3, 0, 0, 1],
            [7, 0, 0, 0, 2, 0, 0, 0, 6],
            [0, 6, 0, 0, 0, 0, 2, 8, 0],
            [0, 0, 0, 4, 1, 9, 0, 0, 5],
            [0, 0, 0, 0, 8, 0, 0, 7, 9]
        ],
        solution: [
            [5, 3, 4, 6, 7, 8, 9, 1, 2],
            [6, 7, 2, 1, 9, 5, 3, 4, 8],
            [1, 9, 8, 3, 4, 2, 5, 6, 7],
            [8, 5, 9, 7, 6, 1, 4, 2, 3],
            [4, 2, 6, 8, 5, 3, 7, 9, 1],
            [7, 1, 3, 9, 2, 4, 8, 5, 6],
            [9, 6, 1, 5, 3, 7, 2, 8, 4],
            [2, 8, 7, 4, 1, 9, 6, 3, 5],
            [3, 4, 5, 2, 8, 6, 1, 7, 9]
        ]
    },
    {
        name: 'Easy Sudoku',
        puzzle: [
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 3, 0, 8, 5],
            [0, 0, 1, 0, 2, 0, 0, 0, 0],
            [0, 0, 0, 5, 0, 7, 0, 0, 0],
            [0, 0, 4, 0, 0, 0, 1, 0, 0],
            [0, 9, 0, 0, 0, 0, 0, 0, 0],
            [5, 0, 0, 0, 0, 0, 0, 7, 3],
            [0, 0, 2, 0, 1, 0, 0, 0, 0],
            [0, 0, 0, 0, 4, 0, 0, 0, 9]
        ],
        solution: [
            [1, 4, 5, 3, 2, 9, 6, 7, 8],
            [6, 7, 2, 1, 5, 3, 4, 8, 9],
            [8, 3, 9, 6, 7, 4, 2, 5, 1],
            [1, 2, 6, 5, 3, 7, 9, 4, 8],
            [3, 5, 4, 9, 8, 6, 1, 2, 7],
            [9, 8, 7, 2, 1, 5, 3, 6, 4],
            [5, 1, 8, 4, 9, 2, 7, 3, 6],
            [4, 9, 2, 8, 6, 1, 5, 3, 7],
            [7, 6, 3, 5, 4, 8, 9, 1, 2]
        ]
    },
    {
        name: 'Hard Sudoku',
        puzzle: [
            [8, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 3, 6, 0, 0, 0, 0, 0],
            [0, 7, 0, 0, 9, 0, 2, 0, 0],
            [0, 5, 0, 0, 0, 7, 0, 0, 0],
            [0, 0, 0, 0, 4, 5, 7, 0, 0],
            [0, 0, 0, 1, 0, 0, 0, 3, 0],
            [0, 0, 1, 0, 0, 0, 0, 6, 8],
            [0, 0, 8, 5, 0, 0, 0, 1, 0],
            [0, 9, 0, 0, 0, 0, 4, 0, 0]
        ],
        solution: [
            [8, 1, 2, 7, 5, 3, 6, 4, 9],
            [9, 4, 3, 6, 8, 2, 1, 7, 5],
            [6, 7, 5, 4, 9, 1, 2, 8, 3],
            [1, 5, 4, 2, 3, 7, 8, 9, 6],
            [3, 6, 9, 8, 4, 5, 7, 2, 1],
            [2, 8, 7, 1, 6, 9, 5, 3, 4],
            [5, 2, 1, 9, 7, 4, 3, 6, 8],
            [4, 3, 8, 5, 2, 6, 9, 1, 7],
            [7, 9, 6, 3, 1, 8, 4, 5, 2]
        ]
    },
    {
        name: 'Very Hard Sudoku',
        puzzle: [
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 3, 0, 8, 0],
            [0, 0, 1, 0, 2, 0, 0, 0, 0],
            [0, 0, 0, 5, 0, 7, 0, 0, 0],
            [0, 0, 4, 0, 0, 0, 1, 0, 0],
            [0, 9, 0, 0, 0, 0, 0, 0, 0],
            [5, 0, 0, 0, 0, 0, 0, 7, 3],
            [0, 0, 2, 0, 1, 0, 9, 0, 0],
            [0, 0, 0, 0, 4, 0, 0, 0, 0]
        ],
        solution: [
            [4, 3, 5, 2, 6, 9, 7, 8, 1],
            [6, 8, 2, 5, 7, 1, 4, 3, 9],
            [1, 9, 7, 8, 3, 4, 5, 6, 2],
            [8, 2, 6, 1, 9, 5, 3, 4, 7],
            [3, 7, 4, 6, 8, 2, 9, 1, 5],
            [9, 5, 1, 7, 4, 3, 6, 2, 8],
            [5, 1, 9, 3, 2, 6, 8, 7, 4],
            [2, 4, 8, 9, 5, 7, 1, 3, 6],
            [7, 6, 3, 4, 1, 8, 2, 9, 5]
        ]
    }
];

describe('StrategyManager', () => {
  let strategyManager;

  beforeEach(() => {
    strategyManager = new StrategyManager();
    strategyManager.register(lastRemainStrategy);
    strategyManager.register(nakedPairStrategy);
    strategyManager.register(hiddenPairStrategy);
  });

  testCases.forEach(testCase => {
    test(`should correctly infer candidates for ${testCase.name}`, () => {
      const { puzzle, solution } = testCase;
      const [intersectionResult, intersectionReason] = strategyManager.inference(puzzle);

      // Check if intersectionResult provides valid candidates for each blank cell
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          if (puzzle[row][col] === 0) { // Check only blank cells
            expect(intersectionResult[row][col]).toBeInstanceOf(Array);
            expect(intersectionResult[row][col].length).toBeGreaterThan(0); // Expect at least one candidate
            expect(intersectionResult[row][col]).not.toContain(puzzle[row][col]); // Should not contain the number already in the cell
            expect(intersectionResult[row][col]).toContain(solution[row][col]); // Should contain the correct solution number as a candidate
          }
        }
      }

      // Check if intersectionReason provides reasons for each blank cell
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          if (puzzle[row][col] === 0) { // Check only blank cells
            expect(intersectionReason[row][col]).toBeInstanceOf(Array);
            expect(intersectionReason[row][col].length).toBeGreaterThan(0); // Expect at least one reason
          }
        }
      }
    });
  });

  test('should throw error when registering invalid strategy', () => {
    const invalidStrategy = {};
    expect(() => strategyManager.register(invalidStrategy)).toThrow('Invalid strategy: Strategy must have an apply method');
  });
});