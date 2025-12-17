<script lang="ts">
    import { Meal } from "$lib/MealManager";
    let { 
        meal,
        horizontal = false 
    } : { meal: Meal, horizontal: boolean} = $props();
</script>

<div class="flex items-center flex-col w-full">
                {#if meal.isText}
                    <p class="w-full text-center font-bold {horizontal ? "text-3xl" : "text-2xl"} mt-10">
                        {meal.name}
                    </p>
                {:else}
                    <img src="/Sandwichlogo/{meal.image}.png" class="w-10/12 -m-3" alt="">
                    <p class="w-full text-center font-bold {horizontal ? "text-4xl" : "text-[1.30rem]"}">
                        {meal.name}
                    </p>
                {/if}
            </div>

