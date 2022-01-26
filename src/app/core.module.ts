import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { AuthInterceptorService } from "./auth/auth-interceptor.service";
import { RecipesService } from "./recipes/recipes.service";

@NgModule({
    providers: [
        RecipesService,  // should be removed, we use redux instead
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true}  // to append auth token
    ]
})
export class CoreModule {}  // contains used services