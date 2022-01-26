import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import * as AuthActions from './auth.actions';
import { environment } from '../../../environments/environment';
import { User } from '../user.model';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

export interface AuthResponseData {  // firebase return format
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;
}

@Injectable()
export class AuthEffects {
    
    constructor(
        private actions$: Actions,  // $ is convention, actions is stream of dispatched actions
        private http: HttpClient,
        private router: Router,
        private authService: AuthService
    ) {}   
    
    @Effect()
    authLogin = this.actions$.pipe(
        ofType(AuthActions.LOGIN_START),  // filter action (can be multiple)
        switchMap((authData: AuthActions.LoginStart) => {  // map data to async call
            return this.http.post<AuthResponseData>(
                'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseAPIKey,
                {
                    email: authData.payload.email,
                    password: authData.payload.password,
                    returnSecureToken: true
                }
            ).pipe(  // catchError can't be used in outer pipe since actions$ should not die (and catchError kills the observable stream)
                map((res) => this.handleAuthentication(res)),
                catchError((res) => this.handleAuthError(res))
            );
        }),
    );

    @Effect({ dispatch: false })  // indicate that this effect doesn't yield an action
    loginRedirect = this.actions$.pipe(  // redirect is also a side effect
        ofType(AuthActions.LOGIN),
        tap((authLoginAction: AuthActions.Login) => {
            if (authLoginAction.payload.redirect) {  // don't redirect on autologin
                this.router.navigate(['/recipes']);
            }
        })
    );

    @Effect()
    authSignup = this.actions$.pipe(
        ofType(AuthActions.SIGNUP_START),
        switchMap((authData: AuthActions.SignupStart) => {  // map data to async call
            return this.http.post<AuthResponseData>(
                'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseAPIKey,
                {
                    email: authData.payload.email,
                    password: authData.payload.password,
                    returnSecureToken: true
                }
            ).pipe(  
                map((res) => this.handleAuthentication(res)),
                catchError((res) => this.handleAuthError(res))
            );
        }),
    );

    handleAuthentication = (res) => {
        const expirationDate = new Date(new Date().getTime() + +res.expiresIn * 1000);
        const user = new User(res.email, res.localId, res.idToken, expirationDate);
        
        this.authService.setLogoutTimer(+res.expiresIn*1000);  // using auth service just for logout timer 
        localStorage.setItem('userData', JSON.stringify(user));  // save user in local storage as string

        return new AuthActions.Login({  // dispatched by ngrx effects
            email: user.email, 
            userId: user.id, 
            token: user.token, 
            expirationDate: expirationDate,
            redirect: true 
        });
        
    };

    handleAuthError = (errorResponse) => {  // dispatching an action for error handling
        return of(new AuthActions.LoginFail(this.getErrorMessage(errorResponse)));
    }

    getErrorMessage(errorResponse: HttpErrorResponse) {  // errorObject -> errorMessage, pass just a error string
        if (!errorResponse.error || !errorResponse.error.error) {  // refactored to use twice
            return 'An unknown error occurred!';  
        }
        switch(errorResponse.error.error.message) {
            case 'EMAIL_EXISTS':
                return "Email already exists";
            case 'EMAIL_NOT_FOUND':
                return "Email not found";
            case 'INVALID_PASSWORD':
                return "Incorrect password";
            default:
                return 'An unknown error occurred!';
        }
    }

    @Effect({ dispatch: false })  
    authLogout = this.actions$.pipe(  
        ofType(AuthActions.LOGOUT),
        tap(() =>  {
            localStorage.removeItem('userData');  // clear cached user
            this.router.navigate(['/']);  // redirect
        }) 
    );

    @Effect()
    tryAutoLogin = this.actions$.pipe(
        ofType(AuthActions.AUTO_LOGIN),
        map(() => {
            const userData = JSON.parse(localStorage.getItem('userData'));
            if (userData) {
                const expirationDate = new Date(userData._tokenExpirationDate);
                const user = new User(
                    userData.email, 
                    userData.id, 
                    userData._token, 
                    expirationDate
                );

                if (user.token) {  // token not expired
                    // this.userSubject.next(user);  // load user
                    return new AuthActions.Login({ 
                        email: user.email, 
                        userId: user.id, 
                        token: user.token, 
                        expirationDate: expirationDate,
                        redirect: false  
                    });

                    // const expiresIn =  new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
                    // this.autoLogout(expiresIn);  // set expiration timer
                }
                return { type: 'EMPTY' };
            }
            return { type: 'EMPTY' };  // placeholder action
        })
    );
}