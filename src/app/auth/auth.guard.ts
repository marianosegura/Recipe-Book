import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {

    constructor(private router: Router) {}

    canActivate(route: ActivatedRouteSnapshot, router: RouterStateSnapshot): boolean | UrlTree | Promise<boolean> | Observable<boolean>{
        if (!!localStorage.getItem('userData')) {  // not user cached, not logged in 
            return true;
        } else {
            return this.router.createUrlTree(['/login']);  // redirect managed by guard
        }   
    }
}