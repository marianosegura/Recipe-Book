import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Store } from "@ngrx/store";
import { Recipe } from "./recipe.model";
import * as fromApp from "../store/app.reducer";
import { take } from "rxjs/operators";
import * as RecipesActions from "./store/recipes.actions";
import { Actions, ofType } from "@ngrx/effects";

@Injectable({providedIn: 'root'})
export class RecipesResolverService implements Resolve<Recipe[]> {
    // used to call fetch recipes if we reload on a id or id/edit recipe page
    constructor(
        private store: Store<fromApp.AppState>,
        private actions$: Actions
    ) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        let recipes: Recipe[] = [];
        this.store.select('recipes').pipe(take(1)).subscribe(  // most async code possible with store observable
            (recipesState) => recipes = recipesState.recipes);
            
        if (recipes.length === 0) {  // just fetch if empty array
            this.store.dispatch(new RecipesActions.FetchRecipes());  // call to fetch
            return this.actions$.pipe(
                ofType(RecipesActions.SET_RECIPES), 
                take(1)
            );  // wait for 1 action of type SET_RECIPES, then resolve
        } else {
            return recipes;
        }
    }

}