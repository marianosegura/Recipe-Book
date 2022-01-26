import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { DataStorageService } from '../shared/data-storage.service';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from '../auth/store/auth.actions';
import * as RecipesActions from '../recipes/store/recipes.actions';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
    userLogged = false;
    userSub: Subscription;

    constructor(
        private storage: DataStorageService,
        private store: Store<fromApp.AppState>
    ) {}

    ngOnInit() {
        this.userSub = this.store.select('auth')
        .pipe(map(authState => authState.user))
        .subscribe((user) =>  this.userLogged = user !== null);  // logout = null
    }

    onSaveRecipes() {
        this.store.dispatch(new RecipesActions.StoreRecipes());  // store recipes to Firebase
    }

    onFetchRecipes() {
        this.store.dispatch(new RecipesActions.FetchRecipes());  // fetch Firebase recipes
    }

    ngOnDestroy() {
        this.userSub.unsubscribe();
    }

    onLogout() {
        this.store.dispatch(new AuthActions.Logout());
    }
}
