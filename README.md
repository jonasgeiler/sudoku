# [sudoku](https://sudoku.jonasgeiler.com)

This is a very simple sudoku game built with Svelte and TailwindCSS.

Have fun! 😉

> [!WARNING]
> Unfortunately not all features are done yet. Specifically:
> - Undoing/redoing moves
> - Creating your own sudoku games





## Updates

- 2025-01-15
  - 将原本store+writeable的`strategy`改名为`strategySolution`：——by zzh
    - 原本的`strategy`是一个字典，比如`strategy["simpleStrategy"]`是一个[ x, y, List:candidates[] ]的列表
    - 现在的`strategySolution`即为[ x, y, List:candidates[] ]的列表，并不需要加上`"simpleStrategy"`的键
  - 将原本的`strategyservice`改名为`strategyService`
  - 增加了decodeSencode，能够识别候选值：
    - `import { decodeSencodeForGrid, decodeSencodeForCandidateList} from '@sudoku/sencode';`
    - `decodeSencodeForCandidateList`能够返回一个候选值列表，每个元素为`{x, y, candidates}`
    - 导入题目的格式例如：`3[123]09670010403020800200000700700000900008730005000100030047051009050002078006210[567]4`，其中中括号内为对应位置的候选值

