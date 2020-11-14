import { writable } from 'svelte/store';

function createNotes() {
	const notes = writable(false);

	return {
		subscribe: notes.subscribe,

		toggle() {
			notes.update($notes => !$notes);
		}
	}
}

export const notes = createNotes();