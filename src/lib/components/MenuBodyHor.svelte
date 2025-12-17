<script lang="ts">
  import SandwichZone from './SandwichZone.svelte';

    import { MealManager, Meal } from "$lib/MealManager";
    import { onMount } from "svelte";
    import { headers } from "$lib/constants";

    let meals : Meal[][] = Array(headers.length).fill([
        new Meal("", "", true),
        new Meal("", "", true)
    ]); // Initialize with empty arrays
    onMount(() => {
        MealManager.getInstance().menuStore.subscribe(menu => {
            if (menu) {
                meals = menu.meals;
            }
        });
    });
</script>

<ul class="grid grid-cols-5 flex-1">
    {#each headers.slice(0, -1) as header, index}
        <li class="px-2 text-white  h-full {index % 2 === 1 ? 'bg-[#b77236]' : 'bg-[#e6a515]'}">
            <h2 class="font-bold text-4xl text-center relative before:content-[''] before:absolute before:top-2 before:left-0 before:right-0 before:h-0.5 before:bg-white after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-white pb-2 pt-2">{header}</h2>
            <SandwichZone 
                meal={meals[index][0]}
                horizontal={true}
            />
            <SandwichZone 
                meal={meals[index][1]}
                horizontal={true}
            />
        </li>
    {/each}
</ul>