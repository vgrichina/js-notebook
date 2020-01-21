<script>
    import TextResult from './results/TextResult';
    import ErrorResult from './results/ErrorResult';

    export let result;
</script>

{#if result.type == 'Error'}
    <ErrorResult {...result} />
{:else}
    <TextResult {...result} />
{/if}

