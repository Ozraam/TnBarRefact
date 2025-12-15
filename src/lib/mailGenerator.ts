import ingredients from "./assets/ingredients.json";
import type { Meal } from "./MealManager";

function normalize(str: string): string {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function findIngredient(name: string, ingredientList: any[]): string[] {
    if (name.toLowerCase() === "pizza") {
        return ["Pizza", "Pizza", "Pizza"];
    }

    const normalizedName = normalize(name);
    for (const ingredient of ingredientList) {
        if (normalize(ingredient[0]).includes(normalizedName)) {
            return ingredient;
        }
    }

    return [`Not found:${name}`, "", ""];
}

/** * Generates an email content for the weekly menu.
 * Replace {français} placeholders with actual meal names and ingredient.
 * same with {anglais}.
 * @param meals A 2D array representing meals for each day and zone.
 * @returns The generated email content as a string.
 */
export async function generateMailMenu(meals: Meal[][]): Promise<string> {
    let res = await fetch("/mailTemplate.txt");
    let mailContent = res.ok ? await res.text() : "";

    // Flatten meals and get unique ones
    const allMeals: Meal[] = [];
    meals.forEach(dayMeals => {
        dayMeals.forEach(meal => {
            if (meal && !meal.isText && meal.name) {
                allMeals.push(meal);
            }
        });
    });

    // Remove duplicates based on name
    const uniqueMeals: Meal[] = [];
    const seenNames = new Set<string>();

    for (const meal of allMeals) {
        if (!seenNames.has(meal.name)) {
            uniqueMeals.push(meal);
            seenNames.add(meal.name);
        }
    }

    let frenchSection = "";
    let englishSection = "";

    // Generate French list
    for (const meal of uniqueMeals) {
        const ingredient = findIngredient(meal.name, ingredients);
        if (ingredient[0] === "Pizza") continue;

        frenchSection += `- ${ingredient[0]}: ${ingredient[1]}\n`;
    }

    // Generate English list
    for (const meal of uniqueMeals) {
        const ingredient = findIngredient(meal.name, ingredients);
        if (ingredient[0] === "Pizza") continue;

        englishSection += `- ${ingredient[0]}: ${ingredient[2]}\n`;
    }

    mailContent = mailContent.replace("{français}", frenchSection.trim());
    mailContent = mailContent.replace("{anglais}", englishSection.trim());

    return mailContent;
}