import { Action } from "@ngrx/store";

export const LOGIN_START = '[Auth] Login Start';
export const LOGIN = '[Auth] Login';
export const LOGIN_FAIL = '[Auth] Login Fail';  // reused fro sigin fail
export const SIGNUP_START = '[Auth] Sign Up Start';
export const LOGOUT = '[Auth] Logout';
export const CLEAR_ERROR = '[Auth] Clear Error';
export const AUTO_LOGIN = '[Auth] Auto Login';

export class LoginStart implements Action {
    readonly type = LOGIN_START;
    constructor(public payload: {
        email: string, 
        password: string
    }) {};
}

export class Login implements Action {
    readonly type = LOGIN;
    constructor(public payload: {
        email: string, 
        userId: string, 
        token: string, 
        expirationDate: Date;
        redirect: boolean  // to avoid redirect on autologin
    }) {}
}

export class LoginFail implements Action {
    readonly type = LOGIN_FAIL;
    constructor(public payload: string) {}  // error message
}

export class Logout implements Action {
    readonly type = LOGOUT;
}

export class SignupStart implements Action {
    readonly type = SIGNUP_START;
    constructor(public payload: {
        email: string, 
        password: string
    }) {};
}

export class ClearError implements Action {
    readonly type = CLEAR_ERROR;
}

export class AutoLogin implements Action {
    readonly type = AUTO_LOGIN;
}

export type AuthActions = Login 
    | Logout 
    | LoginFail 
    | LoginStart 
    | SignupStart
    | ClearError
    | AutoLogin;
