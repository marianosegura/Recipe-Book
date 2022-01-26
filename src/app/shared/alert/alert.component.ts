import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
    selector: 'app-alert',
    templateUrl: './alert.component.html',
    styleUrls: ['./alert.component.css']
})
export class AlertComponent {  // modal 
    @Input() message: string;
    @Output() onClose = new EventEmitter<void>();

    onCloseModal() {
        this.onClose.emit();
    }
}
