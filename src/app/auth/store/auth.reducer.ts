import { User } from "../user.model";
import * as Actions from "./auth.actions";

export interface State {
    user: User,
    authError: string;  // to subscribe and handle errors
    isLoading: boolean;  // for ui loading handling
}

const initialState: State = {
    user: null,
    authError: null,  
    isLoading: false  
}

export function authReducer(state = initialState, action: Actions.AuthActions) {
    switch(action.type) {
        case Actions.LOGIN:
            const user = new User(
                action.payload.email,
                action.payload.userId,
                action.payload.token,
                action.payload.expirationDate
            );
            return {
                ...state,
                user: user,
                authError: null,
                isLoading: false
            }
            
        case Actions.LOGIN_START:
        case Actions.SIGNUP_START:
            return {
                ...state,
                authError: null,
                isLoading: true
            }

        case Actions.LOGIN_FAIL:
            return  {
                ...state,
                authError: action.payload,
                isLoading: false
            }

        case Actions.LOGOUT:
            return {
                ...state,
                user: initialState.user,
                authError: null
            }
        
        case Actions.CLEAR_ERROR:
            return {
                ...state,
                authError: null
            }

        default:
            return state;
    }
}