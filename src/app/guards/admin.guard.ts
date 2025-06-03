import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  
  constructor(private router: Router) {}
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    // Comme vous n'utilisez pas l'authentification pour le moment,
    // nous retournons simplement true pour permettre l'accès
    // Vous pourrez implémenter la vérification des rôles plus tard
    
    // Si vous voulez rediriger vers une page d'accès refusé, décommentez ce code
    // this.router.navigate(['/access-denied']);
    // return of(false);
    
    return of(true);
  }
}
