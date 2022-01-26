import { Subject } from "rxjs";
import { Ingredient } from "../shared/ingredient.model";
import { Recipe } from "./recipe.model";

export class RecipesService {
    private recipes: Recipe[] = [];
    // private recipes: Recipe[] = [
    //     new Recipe(
    //         'Garlic Bread', 
    //         'Simple home made garlic bread', 
    //         'https://www.cookingclassy.com/wp-content/uploads/2019/09/garlic-bread-04.jpg',
    //         [
    //             new Ingredient('Bread Slice', 2),
    //             new Ingredient('Garlic Butter', 1)
    //         ]),
        
    //     new Recipe(
    //         'Pizza', 
    //         'The classic', 
    //         'https://w6h5a5r4.rocketcdn.me/wp-content/uploads/2019/06/pizza-con-chorizo-jamon-y-queso-1080x671.jpg',
    //         [
    //             new Ingredient('Dough', 1),
    //             new Ingredient('Tomato Paste', 1),
    //             new Ingredient('Cheese', 1),
    //             new Ingredient('Ham', 1)
    //         ])
    // ];

    recipeSelected = new Subject<Recipe>();  // for cross-communication

    recipesChanged = new Subject<Recipe[]>();  // for recipe list changes notifications

    getRecipes()  {
        return this.recipes.slice();  // return array copy
    }

    setRecipes(recipes: Recipe[]) {
        this.recipes = recipes;
        this.notifyRecipesChange();
    }

    getRecipe(id: number) {
        return this.recipes[id];
    }

    addRecipe(recipe: Recipe) {
        this.recipes.push(recipe);
        this.notifyRecipesChange();  // notify changes
    }
    
    updateRecipe(index: number, recipe: Recipe) {
        this.recipes[index] = recipe;
        this.notifyRecipesChange();
    }
    
    deleteRecipe(index: number) {
        this.recipes.splice(index, 1);
        this.notifyRecipesChange();
    }

    notifyRecipesChange() {
        this.recipesChanged.next(this.recipes.slice());
    }
}