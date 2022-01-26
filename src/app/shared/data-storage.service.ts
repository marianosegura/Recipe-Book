import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { map, tap, take, exhaustMap } from 'rxjs/operators';
import { Recipe } from "../recipes/recipe.model";
import { RecipesService } from "../recipes/recipes.service";
import * as fromApp from "../store/app.reducer";
import * as RecipesActions from "../recipes/store/recipes.actions";

@Injectable({providedIn: 'root'})  // http service injected
export class DataStorageService {

    constructor(
        private http: HttpClient,
        private recipeService: RecipesService,
        private store: Store<fromApp.AppState>
    ) {}

    storeRecipes() {
        const recipes = this.recipeService.getRecipes();
        this.http.put(  // put in Firebase overrides all contents
            'https://angular-course-60904-default-rtdb.firebaseio.com/recipes.json',
            recipes
        )
        .subscribe((response) => {
            // console.log(response)
        });  // response in header (where this is called) is not of much usage
    }

    fetchRecipes() {
        return this.http.get<Recipe[]>('https://angular-course-60904-default-rtdb.firebaseio.com/recipes.json')
        .pipe(
            map((recipes) => {
                return recipes.map((recipe) => {  // add empty array ingredients if doesn't have attribute
                    return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []} 
                });
            }),

            tap((recipes) => {
                this.store.dispatch(new RecipesActions.SetRecipes(recipes));
            })
        );
    }

}