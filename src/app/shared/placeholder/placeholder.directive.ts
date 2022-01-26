import { Directive, ViewContainerRef } from "@angular/core";

@Directive({
    selector: '[appPlaceholder]'
})
export class PlaceholderDirective {  // used for dynamic alert component creation
    constructor(public viewContainerRef: ViewContainerRef) {}
}