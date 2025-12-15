<script lang="ts">
    import { generateMailMenu } from "$lib/mailGenerator";
    import { MealManager } from "$lib/MealManager";
    import { onMount } from "svelte";

    let preview = "";

    onMount(() => {
        MealManager.getInstance().menuStore.subscribe(async menu => {
            if (menu) {
                preview = await generateMailMenu(menu.meals);
            }
        });
    });
</script>

<pre class="w-1/3">
{preview}
</pre>