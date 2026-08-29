import { candidates } from '@sudoku/stores/candidates';
import { get } from 'svelte/store';

// 扩展候选值功能
export const setCandidates = (position, values) => {
    // 获取当前候选值状态
    const currentCandidates = get(candidates);
    
    // 创建一个新的状态对象
    const newCandidates = { ...currentCandidates };
    
    // 设置新的候选值
    const key = `${position.x},${position.y}`;
    newCandidates[key] = values;
    
    // 更新候选值状态
    candidates.set(newCandidates);
};

export const clearCandidates = (position) => {
    // 获取当前候选值状态
    const currentCandidates = get(candidates);
    
    // 创建一个新的状态对象
    const newCandidates = { ...currentCandidates };
    
    // 删除指定位置的候选值
    const key = `${position.x},${position.y}`;
    delete newCandidates[key];
    
    // 更新候选值状态
    candidates.set(newCandidates);
};