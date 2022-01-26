import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
// import { LoggingService } from '../logging.service';
import { Ingredient } from '../shared/ingredient.model';
// import { ShoppingListService } from './shopping-list.service';
import * as ShoppingListActions from './store/shopping-list.actions';
import * as fromApp from '../store/app.reducer';  // convention naming

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients: Observable<{ ingredients: Ingredient[] }>;  // object type yield by store
//   private ingredientsChangeSub: Subscription;

  constructor(
    //   private shoppingListService: ShoppingListService,
      private store: Store<fromApp.AppState>
    //   ,private loggingService: LoggingService  // for service scoping demo purposes 
    ) {};

  ngOnInit() {
    this.ingredients = this.store.select('shoppingList');  // an observable
    // below is commented due to store
    // this.loggingService.printLog('Hello from ShoppingListComponent');
    // this.ingredients = this.shoppingListService.getIngredients();
    // this.ingredientsChangeSub = this.shoppingListService.ingredientsChanged
    // .subscribe(  // update list on change event
    //   (ingredients: Ingredient[]) => this.ingredients = ingredients
    // );
  }

  ngOnDestroy() {
    // this.ingredientsChangeSub.unsubscribe();
  }

  onEditItem(index: number) {
      this.store.dispatch(new ShoppingListActions.StartEdit(index));
    // this.shoppingListService.startedEditing.next(index);  // pass ingredient index to edit inside shopping-edit
  }
}
