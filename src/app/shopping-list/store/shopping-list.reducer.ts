import { Ingredient } from "../../shared/ingredient.model";
import * as Actions from './shopping-list.actions';

export interface State {
    ingredients: Ingredient[];
    editedIngredient: Ingredient;
    editIndex: number;
}

const initialState: State = {
    ingredients : [new Ingredient('salt', 2), new Ingredient('tomato', 1)],
    editedIngredient: null,
    editIndex: null  // index of the ingredient being edited
};

export function shoppingListReducer(state: State = initialState, action: Actions.ShoppingListActions) {  // set initial state, state is inmutable
    switch (action.type) {
        case Actions.ADD_INGREDIENT:
            return { 
                ...state,  // copy old state properties
                ingredients: [...state.ingredients, action.payload] 
            };
            
        case Actions.ADD_INGREDIENTS:
            return { 
                ...state, 
                ingredients: [...state.ingredients, ...action.payload]  // spread payload ingredients
            };

        case Actions.UPDATE_INGREDIENT:
            const index = state.editIndex
            const ingredient = state.ingredients[index];
            const updatedIngredient = {
                ...ingredient,  // copy old data and override (unnecessary in this case)
                ...action.payload
            };
            const updatedIngredients = [...state.ingredients];
            updatedIngredients[index] = updatedIngredient;  // replace ingredient in copy
            return { 
                ...state, 
                ingredients: updatedIngredients,
                editIndex: initialState.editIndex,  // stop editing
                editedIngredient: initialState.editedIngredient
            };

        case Actions.DELETE_INGREDIENT:
            return { 
                ...state, 
                ingredients: state.ingredients.filter((ig, index) => index !== state.editIndex),  // payload is delete index
                editIndex: initialState.editIndex,  // stop editing
                editedIngredient: initialState.editedIngredient
            };
        
        case Actions.START_EDIT:
            return { 
                ...state, 
                editIndex: action.payload,  // ingredient index
                editedIngredient: {...state.ingredients[action.payload]}
            };
        
        case Actions.STOP_EDIT:
            return { 
                ...state, 
                editIndex: initialState.editIndex,  // initial values
                editedIngredient: initialState.editedIngredient,  
            };

        default:
            return state;  // we need to return a state always
    }
}