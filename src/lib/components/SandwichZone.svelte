<script lang="ts">
    import { Meal } from "$lib/MealManager";
    let { meal } : { meal: Meal} = $props();
</script>

<div class="flex items-center flex-col">
                {#if meal.isText}
                    <p class="text-center font-bold text-2xl mt-10">
                        {meal.name}
                    </p>
                {:else}
                    <img src="/Sandwichlogo/{meal.image}.png" class="w-10/12 -m-2" alt="">
                    <p class="text-center font-bold text-2xl">
                        {meal.name}
                    </p>
                {/if}
            </div>

<style>
    @font-face {
		font-family: 'MenuFont';
		src: url('/OpenSans-VariableFont_wdth,wght.ttf') format('truetype');
		font-display: swap;
	}
    * {
        font-family: 'MenuFont', sans-serif;
    }
</style>

