import { writable } from 'svelte/store';

export const notebook = writable({
    blocks: [
        { id: "1", code: "1 + 1", result: "2" },
        { id: "2", code: "2 * 3", result: "6" },
    ]
});