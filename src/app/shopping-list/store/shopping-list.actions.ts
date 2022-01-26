import { Action } from '@ngrx/store';
import { Ingredient } from 'src/app/shared/ingredient.model';

export const ADD_INGREDIENT = '[Shopping List] Add Ingredient';
export const ADD_INGREDIENTS = '[Shopping List] Add Ingredients';
export const UPDATE_INGREDIENT = '[Shopping List] Update Ingredient';
export const DELETE_INGREDIENT = '[Shopping List] Delete Ingredient';
export const START_EDIT = '[Shopping List] Start Edit';
export const STOP_EDIT = '[Shopping List] Stop Edit';

export class AddIngredient implements Action {
    readonly type = ADD_INGREDIENT;  // can be changed from outside (public without setter)
    constructor(public payload: Ingredient) {}  // type property is enforced by Action interface, payload isn't (could be named different)
}

export class AddIngredients implements Action {
    readonly type = ADD_INGREDIENTS; 
    constructor(public payload: Ingredient[]) {} 
}

export class UpdateIngredient implements Action {  // we already know the index and the ingredient being edited
    readonly type = UPDATE_INGREDIENT; 
    constructor(public payload: Ingredient) {} 
}

export class DeleteIngredient implements Action {
    readonly type = DELETE_INGREDIENT; 
}

export class StartEdit implements Action {
    readonly type = START_EDIT; 
    constructor(public payload: number) {}  // ingredient index 
}

export class StopEdit implements Action {
    readonly type = STOP_EDIT; 
}

export type ShoppingListActions = AddIngredient 
    | AddIngredients 
    | UpdateIngredient 
    | DeleteIngredient
    | StartEdit
    | StopEdit;  // for switch action type