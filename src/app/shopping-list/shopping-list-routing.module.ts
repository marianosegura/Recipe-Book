import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ShoppingListComponent } from "./shopping-list.component";

const routes: Routes = [  // extracted for app-routing.module.ts
    { path: '', component: ShoppingListComponent }  // path 'shopping-list' -> '' for lazy loading
];

@NgModule({
    imports: [RouterModule.forChild(routes)],  // add routes to parent router
    exports: [RouterModule]
})
export class ShoppingListRoutingModule {}