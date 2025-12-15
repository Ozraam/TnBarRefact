import { MealManager } from "$lib/MealManager";
import { headers, dayAlias } from "$lib/constants";

function getAvailableAliasTokens() {
    const availableLabels = headers.map((h) => h.toLowerCase());
    const matchedTokens = new Map<string, string>();

    Object.entries(dayAlias).forEach(([token, label]) => {
        if (availableLabels.includes(label)) {
            matchedTokens.set(token, label);
        }
    });

    const preferredOrder = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun', 'pub'];
    const orderedTokens: string[] = [];

    preferredOrder.forEach((token) => {
        if (matchedTokens.has(token)) {
            orderedTokens.push(token);
            matchedTokens.delete(token);
        }
    });

    matchedTokens.forEach((_label, token) => {
        orderedTokens.push(token);
    });

    if (!orderedTokens.length) {
        availableLabels.forEach((label) => {
            if (!orderedTokens.includes(label)) {
                orderedTokens.push(label);
            }
        });
    }

    return orderedTokens;
}

function buildCommandCombos() {
    const tokens = getAvailableAliasTokens();
    const combos: { combo: string; requiresValue: boolean }[] = [];

    tokens.forEach((token) => {
        if (token.length > 4) {
            return;
        }

        ['u', 'l'].forEach((zone) => {
            combos.push({ combo: `${token}-${zone}-s`, requiresValue: true });
            combos.push({ combo: `${token}-${zone}-t`, requiresValue: true });
            combos.push({ combo: `${token}-${zone}-clear`, requiresValue: false });
        });
    });

    if (!combos.length) {
        headers.forEach((header) => {
            const h = header.toLowerCase();
            ['u', 'l'].forEach((zone) => {
                combos.push({ combo: `${h}-${zone}-s`, requiresValue: true });
                combos.push({ combo: `${h}-${zone}-t`, requiresValue: true });
                combos.push({ combo: `${h}-${zone}-clear`, requiresValue: false });
            });
        });
    }

    return combos;
}

export function commandPaletteSuggestions(input: string) {
    const trimmedInput = input.replace(/\s+/g, ' ').trimStart();
    const combos = buildCommandCombos();

    if (!trimmedInput.length) {
        const baseToken = combos[0]?.combo.split('-')[0] || 'mon';
        return [
            'generate',
            `${baseToken}-u-s <sandwich name>`,
            `${baseToken}-u-t <your text>`,
            `${baseToken}-u-clear`
        ];
    }

    const normalized = trimmedInput.toLowerCase();
    const hasSpace = trimmedInput.includes(' ');
    const suggestions: string[] = [];

    if (!hasSpace) {
        ['generate', 'gen'].forEach((token) => {
            if (token.startsWith(normalized)) {
                suggestions.push(token);
            }
        });

        combos.forEach(({ combo, requiresValue }) => {
            if (combo.startsWith(normalized)) {
                suggestions.push(requiresValue ? `${combo} ` : combo);
            }
        });

        return suggestions.slice(0, 6);
    }

    const [head, ...restParts] = trimmedInput.split(/\s+/);
    const rest = restParts.join(' ');
    const lowerHead = head.toLowerCase();
    const [, , typeSegment = ''] = lowerHead.split('-');

    if (['generate', 'gen'].some((token) => token.startsWith(lowerHead))) {
        return ['generate'];
    }

    if (!head.includes('-')) {
        combos.forEach(({ combo, requiresValue }) => {
            if (combo.startsWith(lowerHead)) {
                suggestions.push(requiresValue ? `${combo} ` : combo);
            }
        });
        return suggestions.slice(0, 6);
    }

    if (!typeSegment.length) {
        return [];
    }

    if (typeSegment === 's') {
        const mealList = MealManager.getInstance().getMeals();
        const search = rest.toLowerCase();
        const matches = mealList
            .filter((meal) => !search || meal.name.toLowerCase().includes(search))
            .slice(0, 6)
            .map((meal) => `${head} ${meal.name}`);

        if (matches.length) {
            return matches;
        }

        if (!rest.length) {
            return mealList.slice(0, 6).map((meal) => `${head} ${meal.name}`);
        }
    }

    if (typeSegment === 't' && !rest.length) {
        return [`${head} <your text>`];
    }

    if (['clear', 'empty', 'reset'].includes(typeSegment)) {
        return [head];
    }

    return [];
}
