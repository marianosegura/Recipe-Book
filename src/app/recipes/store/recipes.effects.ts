import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { map, switchMap, withLatestFrom } from "rxjs/operators";
import { Recipe } from "../recipe.model";
import * as RecipesActions from "./recipes.actions";
import * as fromApp from "src/app/store/app.reducer";

@Injectable()
export class RecipesEffects {
    
    constructor(
        private actions$: Actions,
        private http: HttpClient,
        private store: Store<fromApp.AppState>
    ) {} 

    @Effect()
    fetchRecipes = this.actions$.pipe(
        ofType(RecipesActions.FETCH_RECIPES),
        switchMap(() => this.http.get<Recipe[]>('https://angular-course-60904-default-rtdb.firebaseio.com/recipes.json')
        .pipe(
            map((recipes) => recipes.map(  // add empty array ingredients if doesn't have attribute
                    (recipe) => { return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []} }
                )
            ),
            map((recipes) => new RecipesActions.SetRecipes(recipes))  // dispatch set fetched recipes
        ))
    );

    @Effect({ dispatch: false }) 
    storeRecipes = this.actions$.pipe(
        ofType(RecipesActions.STORE_RECIPES),
        withLatestFrom(this.store.select('recipes')),  // get last snapshot of observable
        switchMap(([actionData, recipesState]) => {
            return this.http.put(  // put in Firebase overrides all contents
                'https://angular-course-60904-default-rtdb.firebaseio.com/recipes.json',
                recipesState.recipes
            );
        })
    )
}