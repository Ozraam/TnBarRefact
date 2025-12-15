<script lang="ts">
    let {
        isOpen = $bindable(false),
        onCommand = (command: string) => ({ success: false, message: "Command handler not configured" }),
        getSuggestions = undefined,
    } = $props<{
        isOpen: boolean;
        onCommand: (command: string) => { success: boolean; message: string };
        getSuggestions?: (input: string) => string[];
    }>();

    let commandInput = $state("");
    let feedback = $state<{ type: "success" | "error"; text: string } | null>(null);
    let inputRef = $state<HTMLInputElement | null>(null);
    let suggestions = $state<string[]>([]);
    let highlightIndex = $state(-1);

    function closePalette() {
        isOpen = false;
        commandInput = "";
        feedback = null;
        suggestions = [];
        highlightIndex = -1;
    }

    function handleSubmit() {
        const command = commandInput.trim();
        if (!command) {
            feedback = { type: "error", text: "Please provide a command." };
            return;
        }

        const result = onCommand(command);
        feedback = {
            type: result.success ? "success" : "error",
            text: result.message,
        };

        if (result.success) {
            commandInput = "";
        }
    }

    function handleKeydown(event: KeyboardEvent) {
        if (event.key === "ArrowDown") {
            if (suggestions.length) {
                event.preventDefault();
                highlightIndex = (highlightIndex + 1) % suggestions.length;
                return;
            }
        }

        if (event.key === "ArrowUp") {
            if (suggestions.length) {
                event.preventDefault();
                highlightIndex = highlightIndex <= 0 ? suggestions.length - 1 : highlightIndex - 1;
                return;
            }
        }

        if (event.key === "Enter") {
            event.preventDefault();
            if (highlightIndex >= 0 && highlightIndex < suggestions.length) {
                const suggestion = suggestions[highlightIndex];
                const shouldAutoSubmit = !suggestion.endsWith(" ") && !suggestion.includes("<");
                applySuggestion(suggestion, shouldAutoSubmit);
                return;
            }

            handleSubmit();
        }

        if (event.key === "Escape") {
            event.preventDefault();
            closePalette();
        }
    }

    $effect(() => {
        if (isOpen) {
            queueMicrotask(() => {
                inputRef?.focus();
            });
        }
    });

    $effect(() => {
        if (!isOpen) {
            suggestions = [];
            highlightIndex = -1;
            return;
        }

        if (getSuggestions) {
            suggestions = getSuggestions(commandInput) ?? [];
        } else {
            suggestions = [];
        }
    });

    $effect(() => {
        if (!suggestions.length) {
            highlightIndex = -1;
            return;
        }

        if (highlightIndex >= suggestions.length) {
            highlightIndex = suggestions.length - 1;
        }
    });

    function applySuggestion(suggestion: string, autoSubmit = false) {
        const nextValue = autoSubmit ? suggestion.trim() : suggestion;
        commandInput = nextValue;
        highlightIndex = -1;
        queueMicrotask(() => {
            inputRef?.focus();
            const length = nextValue.length;
            inputRef?.setSelectionRange(length, length);
            if (autoSubmit) {
                handleSubmit();
            }
        });
    }
</script>

{#if isOpen}
    <div class="fixed inset-0 z-50 flex items-start justify-center bg-black/70 p-4">
        <div class="mt-16 w-full max-w-2xl rounded-lg border border-white/10 bg-slate-900/95 p-5 shadow-xl backdrop-blur">
            <div class="mb-3 flex items-center justify-between gap-3">
                <h2 class="text-lg font-semibold text-white">Command Palette</h2>
                <button
                    class="rounded-md border border-transparent bg-white/10 px-3 py-1 text-sm text-white transition hover:bg-white/20"
                    onclick={closePalette}
                    type="button"
                >
                    Close
                </button>
            </div>

            <label class="mb-2 block text-sm font-medium text-slate-200" for="command-input">
                Type a command to update the menu
            </label>
            <input
                id="command-input"
                bind:this={inputRef}
                class="w-full rounded-md border border-white/15 bg-slate-800/90 px-3 py-2 text-sm text-white outline-none transition focus:border-orange-400"
                placeholder="Example: mon-u-s Chicken Caesar"
                bind:value={commandInput}
                onkeydown={handleKeydown}
            />

            {#if feedback}
                <p class={`mt-2 text-sm ${feedback.type === "success" ? "text-emerald-400" : "text-red-400"}`}>
                    {feedback.text}
                </p>
            {/if}

            {#if suggestions.length}
                <ul class="mt-3 max-h-48 overflow-auto rounded-md border border-white/10 bg-slate-800/80 text-sm text-slate-200 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-orange-500/60">
                    {#each suggestions as suggestion, index}
                        <li class={index > 0 ? "border-t border-white/10" : ""}>
                            <button
                                class={`flex w-full items-center justify-between rounded-none px-3 py-2 text-left transition ${highlightIndex === index ? "bg-white/15 text-white" : "hover:bg-white/10"}`}
                                type="button"
                                onclick={() => {
                                    const shouldAutoSubmit = !suggestion.endsWith(" ") && !suggestion.includes("<");
                                    applySuggestion(suggestion, shouldAutoSubmit);
                                }}
                                onmouseenter={() => {
                                    highlightIndex = index;
                                }}
                                aria-selected={highlightIndex === index}
                            >
                                <span>{suggestion}</span>
                                <span class="text-xs uppercase text-white/40">Enter</span>
                            </button>
                        </li>
                    {/each}
                </ul>
            {/if}

            <div class="mt-4 border-t border-white/10 pt-3 text-xs text-slate-300">
                <p class="font-semibold text-slate-200">Command format</p>
                <p><code>&lt;day&gt;-&lt;zone&gt;-&lt;type&gt; &lt;value&gt;</code></p>
                <p class="mt-1 text-slate-400">
                    <span class="font-semibold">day</span>: mon, tue, wed, thu, fri, sat, sun, pub (French names also work)<br />
                    <span class="font-semibold">zone</span>: <code>u</code> (upper), <code>l</code> (lower)<br />
                    <span class="font-semibold">type</span>: <code>s</code> (sandwich), <code>t</code> (text), <code>clear</code> (empty field)
                </p>
                <p class="mt-2 text-slate-400">
                    Examples:
                    <span class="ml-2 block text-slate-300">mon-u-s Chicken Pesto</span>
                    <span class="ml-2 block text-slate-300">fri-l-t Happy hour from 5pm</span>
                    <span class="ml-2 block text-slate-300">wed-u-clear</span>
                    <span class="ml-2 block text-slate-300">generate</span>
                </p>
                <p class="mt-2 text-slate-400">Use <kbd>Esc</kbd> to close, <kbd>↑</kbd>/<kbd>↓</kbd> to navigate suggestions.</p>
            </div>
        </div>
    </div>
{/if}
