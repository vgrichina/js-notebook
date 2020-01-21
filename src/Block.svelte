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
    let evalContext = {
        console: {}
    };
</script>

<script>
    import vm from 'vm';
    import { onMount } from 'svelte';
    import { notebook } from './stores';

    export let block;
    export let index;

    let textarea;

    function evalCode(code) {
        // TODO: Maintain global context
        const logs = [];
        // TODO: Proper console wrapper
        evalContext.console.log = (...args) => {
            logs.push(args.join(" "));
            console.log(...args);
        }
        try {
            const result = vm.runInNewContext(code, evalContext);
            return { result, logs };
        } catch (e) {
            return { result: e, logs };
        }
    }

    function handleKeyPress(event) {
        console.log('key press', event);
        if (event.key == 'Enter') {
            if (event.shiftKey) {
                notebook.update(updateResult(index, evalCode(block.code)));
                event.preventDefault();
            }

            if (event.metaKey) {
                notebook.update(newBlock(index + 1));
                event.preventDefault();
            }
        }
    }

    function handleKeyUp(event) {
        console.log('key up', event);
        if (event.key == 'Backspace') {
            if (block.code == "") {
                notebook.update(deleteBlock(index))
            }
        }
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
        textarea.focus();
    });
</script>

<div class="code">
    <textarea bind:value={block.code} on:keypress={handleKeyPress} on:keyup={handleKeyUp} bind:this={textarea} />
</div>
<div class="result">
    {#if block.logs}
        <pre>{block.logs.join('\n')}</pre>
    {/if}
    <pre>{block.result}</pre>
</div>