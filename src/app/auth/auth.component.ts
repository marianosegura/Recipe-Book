import { Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Store } from "@ngrx/store";
import { Subscription } from "rxjs";
import { AlertComponent } from "../shared/alert/alert.component";
import { PlaceholderDirective } from "../shared/placeholder/placeholder.directive";
import * as fromApp from "../store/app.reducer";
import * as AuthActions from "./store/auth.actions";

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html'
})
export class AuthComponent implements OnInit, OnDestroy {
    loginMode = true;
    isLoading = false;
    errorMessage:string = null;
    storeSub: Subscription;

    @ViewChild(PlaceholderDirective, { static: false }) alertPlaceholder: PlaceholderDirective;  // dom placeholder to add alert component
    private dynamicAlertSub: Subscription;  // to close dynamic alert

    constructor(
        private store: Store<fromApp.AppState>,
        private componentFactoryResolver: ComponentFactoryResolver  // for dynamic AlertComponent
    ) {}

    ngOnInit() {  // to subscribe to store for error and loading handling
        this.storeSub = this.store.select('auth').subscribe((authState) => {
            this.isLoading = authState.isLoading;
            this.errorMessage = authState.authError;

            if (this.errorMessage) {
                this.showErrorAlert(this.errorMessage);  // dynamic approach
            }
        });
    }

    toggleLoginMode() {
        this.loginMode = !this.loginMode;
    }

    onSubmit(form: NgForm) {
        this.isLoading = true;
        const authActionClass = (this.loginMode) ? AuthActions.LoginStart : AuthActions.SignupStart;
        this.store.dispatch(new authActionClass({ email: form.value.email, password: form.value.password}));
        form.reset();
    }

    onHandleError() {
        this.store.dispatch(new AuthActions.ClearError());  // dispatch to clear error, update received in ngOnInit subscription
    }

    
    private showErrorAlert(message: string) {
        const alertComponentFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);
        const hostViewContainerRef = this.alertPlaceholder.viewContainerRef;
        
        hostViewContainerRef.clear();  // clear anything that could be rendered here

        const alertComponentRef = hostViewContainerRef.createComponent(alertComponentFactory);  // create component
    
        alertComponentRef.instance.message = message;  // pass input message

        this.dynamicAlertSub = alertComponentRef.instance.onClose.subscribe(() => {
            this.dynamicAlertSub.unsubscribe();  // clear subscription
            hostViewContainerRef.clear();  // remove component from dom
        });
    }

    ngOnDestroy() {
        if (this.dynamicAlertSub) {  // unsub if exists
            this.dynamicAlertSub.unsubscribe();  
        }
    }
}