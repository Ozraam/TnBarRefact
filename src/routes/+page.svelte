<script lang="ts">
    import MenuVertical from "$lib/components/MenuVertical.svelte";
    import { onMount } from "svelte";
    import { MealManager } from "$lib/MealManager";
    import CommandPalette from "$lib/components/CommandPalette.svelte";
    import { executeCommand } from "$lib/commandExecute";
    import { commandPaletteSuggestions } from "$lib/commandSuggestion";
    import MailPreview from "$lib/components/MailPreview.svelte";
    import MenuHorizontal from "$lib/components/MenuHorizontal.svelte";
    import { FrontState } from "$lib/constants";
    onMount(() => {
        MealManager.getInstance().setupMeals();

        document.addEventListener('keydown', handleKeydown);
    });

    let isCommandPaletteOpen = false;

    function handleKeydown(event: KeyboardEvent) {
        if (event.ctrlKey && event.key === 'k') {
            event.preventDefault();
            isCommandPaletteOpen = !isCommandPaletteOpen;
        }
    }

    let state = FrontState.VERTICAL;
</script>

<div class="flex gap-10 items-center justify-center h-screen bg-green-400">
    {#if state === FrontState.VERTICAL}
        <MenuVertical />
    {:else if state === FrontState.HORIZONTAL}
        <MenuHorizontal />
    {:else if state === FrontState.MAIL}
        <MailPreview />
    {/if}

    <CommandPalette 
        isOpen={isCommandPaletteOpen}
        onCommand={(command: string) => executeCommand(
            command, 
            {
                setLoading: (loading: boolean) => {
                    isCommandPaletteOpen = !loading;
                },
                setFrontState: (newState: string) => {
                    state = newState;
                },
                currentState: state
            }
        )}
        getSuggestions={commandPaletteSuggestions}
    />
</div>
