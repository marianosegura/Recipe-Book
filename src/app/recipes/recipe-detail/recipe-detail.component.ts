import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Recipe } from '../recipe.model';
import * as ShoppingListActions from 'src/app/shopping-list/store/shopping-list.actions';
import * as fromApp from '../../store/app.reducer';
import { take } from 'rxjs/operators';
import * as RecipesActions from '../store/recipes.actions';


@Component({
    selector: 'app-recipe-detail',
    templateUrl: './recipe-detail.component.html',
    styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
    recipe: Recipe;
    recipeIndex: number;


    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private store: Store<fromApp.AppState>
    ) {}

    ngOnInit() {
        this.route.params.subscribe((params: Params) => {
            this.store.select('recipes').pipe(take(1)).subscribe(  // most async code possible with store observable
                (recipesState) => {
                    this.recipeIndex = +params['id'];
                    this.recipe = recipesState.recipes[this.recipeIndex];
                }
            );
        });
    }

    onAddToShoppingList() {
        this.store.dispatch(new ShoppingListActions.AddIngredients(this.recipe.ingredients));
    }

    onEditRecipe() {
        this.router.navigate(['edit'], { relativeTo: this.route });
    }
    
    onDeleteRecipe() {
        this.store.dispatch(new RecipesActions.DeleteRecipe(this.recipeIndex));
        this.router.navigate(['../'], { relativeTo: this.route });  // go back
    }
}
