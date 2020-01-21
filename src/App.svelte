<style>
    h1 {
        font-family: sans-serif;
    }

    .notebook {
        margin: 1em 2em;
    }
</style>

<script>
    import Block from "./Block.svelte"
    import { notebookId, notebook } from "./stores"
</script>

<div class="notebook">
    <h1>{notebookId}</h1>

    {#each $notebook.blocks as block, index (block.id)}
        <Block block={block} index={index} }></Block>
    {/each}
</div>