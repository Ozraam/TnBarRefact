<script lang="ts">
    import MenuBody from "./MenuBody.svelte";
    import MenuHeader from "./MenuHeader.svelte";
</script>

<div class="aspect-9/16 bg-white h-full flex flex-col">
    <MenuHeader />

    <MenuBody />
</div>

<style>
    @font-face {
		font-family: 'MenuFont';
		src: url('/OpenSans-VariableFont_wdth,wght.ttf') format('truetype');
		font-display: swap;
	}
</style>