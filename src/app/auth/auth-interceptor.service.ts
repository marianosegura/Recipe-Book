import { HttpHandler, HttpInterceptor, HttpParams, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { exhaustMap, map, take } from "rxjs/operators";
import { AuthService } from "./auth.service";
import * as fromApp from '../store/app.reducer';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor{  // to add user token

    constructor(
        private auth: AuthService,
        private store: Store<fromApp.AppState>
    ) {}

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        return this.store.select('auth').pipe(
            take(1),
            map(authState => authState.user),
            exhaustMap((user) => {
                if (!user) return next.handle(req); // user not logged in
                
                const requestWithToken = req.clone({  // pass token
                    params: new HttpParams().set('auth', user.token)
                });
                return next.handle(requestWithToken);
            })
        );
    }

}