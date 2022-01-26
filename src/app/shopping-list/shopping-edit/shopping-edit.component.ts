import { Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { Ingredient } from 'src/app/shared/ingredient.model';
// import { ShoppingListService } from '../shopping-list.service';
import * as ShoppingListActions from '../store/shopping-list.actions';
import * as fromApp  from '../../store/app.reducer';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  editStartSub: Subscription;
  editMode = false;
  editIndex: number;  // list index of ingredient being edited
  editedIngredient: Ingredient;
  @ViewChild('ingredientForm', {static: false}) ingredientForm: NgForm;

  constructor(
    //   private shoppingListService: ShoppingListService,
      private store: Store<fromApp.AppState>
    ) {}

  onSubmit(form: NgForm) {
    if (this.editMode) {
      this.onUpdateIngredient(form);
    } else {
      this.onAddIngredient(form);
    }
  }
  
  ngOnInit() {
    this.editStartSub = this.store.select('shoppingList').subscribe(
        (state) => {
            if (state.editIndex !== null) { 
                this.editMode = true;
                this.editIndex = state.editIndex;
                this.editedIngredient = state.editedIngredient;
                this.ingredientForm.setValue({
                    name: this.editedIngredient.name,
                    amount: this.editedIngredient.amount
                });
            } else {
                this.editMode = false;
            }
        }
    );
    //   this.editStartSub = this.shoppingListService.startedEditing.subscribe(
    //   (index: number) => {
    //     this.editMode = true;
    //     this.editIndex = index;
    //     this.editedIngredient = this.shoppingListService.getIngredient(index);
    //     this.ingredientForm.setValue({
    //       name: this.editedIngredient.name,
    //       amount: this.editedIngredient.amount
    //     })
    //   }
    // );
  }
  
  onAddIngredient(form: NgForm) {
    const ingredient = new Ingredient(form.value.name, form.value.amount);
    // this.shoppingListService.addIngredient(ingredient);  // replaced by store
    this.store.dispatch(new ShoppingListActions.AddIngredient(ingredient));  // dispatching store action
    this.ingredientForm.reset();  // reset form
  }
  
  onUpdateIngredient(form: NgForm) {
    const ingredient = new Ingredient(form.value.name, form.value.amount);
    this.store.dispatch(new ShoppingListActions.UpdateIngredient(ingredient));
    // this.shoppingListService.updateIngredient(this.editIndex, ingredient);
    this.editMode = false;
    this.ingredientForm.reset();  // reset form
  }


  ngOnDestroy() {
    this.editStartSub.unsubscribe();
  }

  onClear() {
    this.ingredientForm.reset();
    this.editMode = false;  // exit edit mode
    this.store.dispatch(new ShoppingListActions.StopEdit());
  }

  onDelete() {
    // this.shoppingListService.deleteIngredient(this.editIndex);
    this.store.dispatch(new ShoppingListActions.DeleteIngredient());
    this.onClear();
  }
}
