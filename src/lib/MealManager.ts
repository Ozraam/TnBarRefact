import mealList from "./assets/mealList.json";
import { writable, type Writable } from "svelte/store";

export class Meal {
    name: string;
    image: string;

    isText : boolean = false;

    constructor(name: string, image: string, isText: boolean = false) {
        this.name = name;
        this.image = image;
        this.isText = isText;
    }
}

export class Menu {
    meals: Meal[][];

    constructor() {
        this.meals = [];
        this.loadMenu();
    }

    setMealForDay(dayIndex: number, mealUp: Meal, mealDown: Meal) {
        this.meals[dayIndex] = [mealUp, mealDown];
    }

    loadMenu() {
        const savedMenu = localStorage.getItem('weeklyMenu');
        let mealsManager = MealManager.getInstance();
        
        if (savedMenu) {
            const mealNames: string[][] = JSON.parse(savedMenu);
            this.meals = mealNames.map(dayMeals => 
                dayMeals.map(mealName => {
                    if (mealName) {
                        const meal = mealsManager.getMeals().find(m => m.name === mealName);
                        return meal ? meal : new Meal(mealName, "", true);
                    } else {
                        return new Meal("", "", true);
                    }
                })
            ); 
        } else {
            this.meals = new Array(6).fill(null).map(() => 
                [new Meal("", "", true), new Meal("", "", true)]
            );
        }
    }

    saveMenu() {
        const mealNames = this.meals.map(dayMeals => 
            dayMeals.map(meal => meal ? meal.name : "")
        );
        
        localStorage.setItem('weeklyMenu', JSON.stringify(mealNames));
    }
}

export class MealManager {
    private static instance: MealManager;
    mealList: Meal[];

    currentMenu: Menu | null;
    menuStore: Writable<Menu | null>;

    private constructor() {
        this.mealList = [];
        this.currentMenu = null;
        this.menuStore = writable(null);
    }

    static getInstance(): MealManager {
        if (!MealManager.instance) {
            MealManager.instance = new MealManager();            
        }
        return MealManager.instance;
    }

    async setupMeals() {
        this.mealList = mealList.map((meal) => new Meal(meal.name, meal.image));

        this.currentMenu = new Menu();
        this.menuStore.set(this.currentMenu);
    }

    getMeals(): Meal[] {
        return this.mealList;
    }

    notifyUpdate() {
        this.menuStore.set(this.currentMenu);
    }
}