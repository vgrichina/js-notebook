<style>
    .notebook {
        margin: 1em 2em;
    }
</style>

<script>
    import Block from "./Block.svelte"
    import { notebook } from "./stores"
</script>

<div class="notebook">
    <p>This is a notebook.</p>

    {#each $notebook.blocks as block, index (block.id)}
        <Block block={block} index={index} }></Block>
    {/each}
</div>