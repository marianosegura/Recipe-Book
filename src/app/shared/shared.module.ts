import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { AlertComponent } from "./alert/alert.component";
import { DropdownDirective } from "./dropdown.directive";
import { LoadingSpinnerComponent } from "./loading-spinner/loading-spinner.component";
import { PlaceholderDirective } from "./placeholder/placeholder.directive";

@NgModule({
    declarations: [
        LoadingSpinnerComponent,
        AlertComponent,
        PlaceholderDirective,
        DropdownDirective
    ],
    
    imports: [
        CommonModule  
    ],

    exports: [  // make available for other modules
        LoadingSpinnerComponent,
        AlertComponent,
        PlaceholderDirective,
        DropdownDirective,
        CommonModule  // so that recipes and shopping-list modules don't need to import this
    ],

    entryComponents: [  // to create AlertComponent and add it via code, not needed in Angular 9+
        AlertComponent
    ]
})
export class SharedModule {}
