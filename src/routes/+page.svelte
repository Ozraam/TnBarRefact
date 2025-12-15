<script lang="ts">
    import MenuVertical from "$lib/components/MenuVertical.svelte";
    import { onMount } from "svelte";
    import { MealManager } from "$lib/MealManager";
    import CommandPalette from "$lib/components/CommandPalette.svelte";
    import { executeCommand } from "$lib/commandExecute";
    import { commandPaletteSuggestions } from "$lib/commandSuggestion";
    import MailPreview from "$lib/components/MailPreview.svelte";
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
</script>

<div class="flex gap-10 items-center justify-center h-screen bg-green-400">
    <MenuVertical />

    <MailPreview />
    <CommandPalette 
        isOpen={isCommandPaletteOpen}
        onCommand={(command: string) => executeCommand(
            command, 
            {
                setLoading: (loading: boolean) => {
                    isCommandPaletteOpen = !loading;
                }
            }
        )}
        getSuggestions={commandPaletteSuggestions}
    />
</div>
