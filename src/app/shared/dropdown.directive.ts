import { Directive, HostBinding, HostListener } from "@angular/core";

@Directive({
    selector: '[appDropdown]'
})
export class DropdownDirective {
    @HostBinding('class.open') isOpen = false;  // to toggle css class 'open', when attached dropdowns open

    @HostListener('click') toggleOpen() {
        this.isOpen = !this.isOpen;
    }
}