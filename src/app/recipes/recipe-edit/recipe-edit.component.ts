import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromApp from 'src/app/store/app.reducer';
import { take } from 'rxjs/operators';
import { Recipe } from '../recipe.model';
import * as RecipesActions from '../store/recipes.actions';

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit {  // create/edit recipe component
  recipeIndex: number;
  editMode = false;
  recipeForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,  // to navigate back onCancel
    private store: Store<fromApp.AppState>) { }  

  ngOnInit() {
    this.route.params
    .subscribe(
      (params: Params) => {
        this.recipeIndex = +params['id']
        this.editMode = params['id'] != null;
        this.initForm();
      }
    )
  }

  private initForm() {
    let recipe = { name: '', description: '', imagePath: '', ingredients: new FormArray([]) };
    if (this.editMode) {
        let fetchedRecipe: Recipe;  
        this.store.select('recipes').pipe(take(1)).subscribe(  // most async code possible with store observable
            (recipesState) => fetchedRecipe = recipesState.recipes[this.recipeIndex]);

        recipe = {
            name: fetchedRecipe.name,
            description: fetchedRecipe.description,
            imagePath: fetchedRecipe.imagePath,
            ingredients: recipe.ingredients  // set same empty FormArray
        };

        for (let ingredient of fetchedRecipe.ingredients) {  // populate ingredient controls
            recipe.ingredients.push(
            new FormGroup({
                'name': new FormControl(ingredient.name, Validators.required),
                'amount': new FormControl(ingredient.amount, [
                Validators.required, 
                Validators.pattern(/^[1-9]+[0-]*$/)  // only positive numbers
                ]) 
            })
            );
      }
    }

    this.recipeForm = new FormGroup({
      'name': new FormControl(recipe.name, Validators.required),
      'description': new FormControl(recipe.description, Validators.required),
      'imagePath': new FormControl(recipe.imagePath, Validators.required),
      'ingredients': recipe.ingredients  // already a FormArray
    });
  }

  onSubmit() {
    if (this.editMode) {
        this.store.dispatch(new RecipesActions.UpdateRecipe({ index: this.recipeIndex, recipe: this.recipeForm.value }));
    } else {
        this.store.dispatch(new RecipesActions.AddRecipe(this.recipeForm.value));
    }
    this.onCancel();  // navigate back
  }

  get ingredientControls() {  // class getter method (used like RecipeEditComponent.ingredientControls)
    return (<FormArray>this.recipeForm.get('ingredients')).controls;
  }

  onAddIngredient() {  // adds empty ingredient group control
    (<FormArray>this.recipeForm.get('ingredients')).push(
      new FormGroup({
        'name': new FormControl(null, Validators.required),
        'amount': new FormControl(null, [
          Validators.required, 
          Validators.pattern(/^[1-9]+[0-]*$/)  // only positive numbers
        ]) 
      })
    );
  }
  
  onCancel() {
    this.router.navigate(['../'], { relativeTo: this.route });  // go back
  }

  onDeleteIngredient(index: number) {  // call by clicking x button
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
  }
}
