import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";

const appRoutes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'recipes', loadChildren: './recipes/recipes.module#RecipesModule' },  // 'path#class' for lazy loading
    // { path: 'recipes', loadChildren: () => import('./recipes/recipes.module').then(m => m.RecipesModule)}  // alternative for above
    { path: 'shopping-list', loadChildren: './shopping-list/shopping-list.module#ShoppingListModule' },
    { path: 'login', loadChildren: './auth/auth.module#AuthModule' } 
];

@NgModule({
    imports: [
        RouterModule.forRoot(appRoutes, 
            { preloadingStrategy: PreloadAllModules})  // load lazy modules in idle time (initial bundle is still kept small)
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {}