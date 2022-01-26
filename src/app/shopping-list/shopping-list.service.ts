import { Subject } from "rxjs";
import { Ingredient } from "../shared/ingredient.model";

export class ShoppingListService {
    // private ingredients: Ingredient[] = [];
    private ingredients: Ingredient[] = [new Ingredient('salt', 2), new Ingredient('tomato', 1)];
    ingredientsChanged = new Subject<Ingredient[]>();  // to inform list changes
    startedEditing = new Subject<number>();  // notify element click, number is ingredient id

    getIngredients() {
        return this.ingredients.slice();
    }

    addIngredient(ingredient: Ingredient) {
        this.ingredients.push(ingredient);
        this.ingredientsChanged.next(this.ingredients.slice());  // inform of list change, since getIngredients returns copy
    }
    
    addIngredients(ingredients: Ingredient[]) {
        this.ingredients.push(...ingredients);
        this.ingredientsChanged.next(this.ingredients.slice());
    }

    getIngredient(index: number) {
        return this.ingredients[index];
    }

    updateIngredient(index: number, updatedIngredient: Ingredient) {
        this.ingredients[index] = updatedIngredient;  // update 
        this.ingredientsChanged.next(this.ingredients.slice());  // notify
    }
    
    deleteIngredient(index: number) {
        this.ingredients.splice(index, 1);  // delete
        this.ingredientsChanged.next(this.ingredients.slice());  // notify
    }
}