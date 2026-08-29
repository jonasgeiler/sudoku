import { MODAL_DURATION, MODAL_NONE } from '@sudoku/constants';
import { writable } from 'svelte/store';

export const modalData = writable({});

function createModal() {
	const modalType = writable(MODAL_NONE);

	let onHide = false;
	let onHideReplace = false;

	return {
		subscribe: modalType.subscribe,

		show(type, data = {}) {
			modalType.set(type);
			modalData.set(data);

			onHide = data.onHide || false;
			onHideReplace = data.onHideReplace || false;
		},

		hide() {
			if (onHideReplace && onHide) {
				onHide();
			} else {
				modalType.set(MODAL_NONE);

				if (onHide) {
					setTimeout(onHide, MODAL_DURATION);
				}
			}
		},
	};
}

export const modal = createModal();