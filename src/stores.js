import { backedStore } from "svelte-backed-store";
const localStore = backedStore.bind(localStorage);

export const notebookId = `notebook:${window.location.pathname}`;

export const notebook = localStore(notebookId, {
    blocks: [
        { id: "1", code: "1 + 1", result: "2" },
        { id: "2", code: "2 * 3", result: "6" },
    ]
});