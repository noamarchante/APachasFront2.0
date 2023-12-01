import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
/*
Es un servicio injectable que devuelve true si el usuario puede acceder a una ruta o false si no puede.
 */
@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {
	constructor(private router: Router) {
	}

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

		if (localStorage.getItem('currentUser')) {
			if (route.url[0].path === "products" && localStorage.getItem("products") == undefined) {
				this.router.navigate(['/events']);
				return false;
			}

			if (route.url[0].path === "transactions" && localStorage.getItem("transactions") == undefined) {
				this.router.navigate(['/events']);
				return false;
			}

			if (route.url[0].path !== "products"){
				localStorage.removeItem("products");
			}
			if (route.url[0].path !== "transactions"){
				localStorage.removeItem("transactions");
			}

			if (route.url[0].path !== "profile"){
				localStorage.removeItem("profile");
			}
			return true;
		}
		this.router.navigate(['/login']);

		return false;
	}
}
