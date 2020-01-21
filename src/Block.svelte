<style>
    .code {
        font-family: monospace;
        font-size: 1.2em;
        margin-top: 1em;
        background-color: #f0f0f0;
    }

    .code textarea {
        font-family: monospace;
        font-size: 1em;
        height: 100%;
        height: 100%;
        width: 100%;
        border: 0;
        resize: none;
        background: none;
    }

    .result {
        font-family: monospace;
        font-size: 1.2em;
        margin-top: 0.5em;
    }

    .result pre {
        margin: 0;
    }
</style>

<script context="module">
</script>

<script>
    import fetchJson from 'fetch-json';

    import { onMount } from 'svelte';

    import { notebook } from './stores';
    import { evalCode, errorToJSON } from './eval';

    import Result from './Result';

    export let block;
    export let index;

    let textarea;

    function handleKeyPress(event) {
        console.log('key press', event);
        if (event.key == 'Enter') {
            if (event.shiftKey) {
                evalResult();
                event.preventDefault();
            }

            if (event.metaKey) {
                notebook.update(newBlock(index + 1));
                event.preventDefault();
            }
        }
    }

    const SERVER_URL = 'http://localhost:8010/proxy';
    async function doEval(code) {
        // TODO: Switch between local and server
        if (false) {
            return evalCode(code);
        } else {
            return fetchJson.post(`${SERVER_URL}/eval`, { code });
        }
    }

    function evalResult() {
        notebook.update(updateResult(index, {}));
        doEval(block.code)
            .then(result => notebook.update(updateResult(index, result)))
            .catch(error => notebook.update(updateResult(index, errorToJSON(error))));
    }

    function handleKeyUp(event) {
        console.log('key up', event);
        if (event.key == 'Backspace') {
            if (block.code == "") {
                notebook.update(deleteBlock(index))
            }
        }
    }

    function autoresizeTextarea() {
        const HEIGHT_LIMIT = 200;
        textarea.style.height = "";
        textarea.style.height = Math.min(textarea.scrollHeight, HEIGHT_LIMIT) + "px";
    }

    const updateResult = (index, { result, logs }) => ({ blocks, ...rest }) => ({
        ...rest,
        blocks: [...blocks.slice(0, index), { ...blocks[index], result, logs }, ...blocks.slice(index + 1)]
    })

    const newBlock = (index) => {
        const id = `${Date.now()}-${Math.random()}`;
        return ({ blocks, ...rest }) => ({
            ...rest,
            blocks: [...blocks.slice(0, index), { id, code: "", result: "" }, ...blocks.slice(index)]
        })
    }
    
    const deleteBlock = (index) => ({ blocks, ...rest }) => ({
        ...rest,
        blocks: [...blocks.slice(0, index), ...blocks.slice(index + 1)]
    })

    onMount(() => {
        autoresizeTextarea();
        textarea.focus();
    });
</script>

<div class="code">
    <textarea bind:value={block.code} on:keypress={handleKeyPress} on:keyup={handleKeyUp} on:input={autoresizeTextarea} bind:this={textarea} />
</div>
<div class="result">
    {#if block.logs}
        <pre>{block.logs.join('\n')}</pre>
    {/if}
    {#if block.result && block.result.type}
        <Result result={block.result} />
    {/if}
</div>