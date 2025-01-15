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