import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })

export class AllowGuard implements CanActivate {
  constructor(private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const session = localStorage.getItem('session');
    if (!session) return false;

    const user = JSON.parse(session).as_js;
    const role = user.acces.libelle; // par exemple "super admin", "admin", "visiteur"

    const url = route.routeConfig?.path;

    // Bloquer visiteur sur ajouter et modifier
    if ((url === 'ajouter' || url?.startsWith('modifier')) && role === 'visiteur') {
      alert("Accès refusé : vous n'avez pas la permission.");
      this.router.navigate(['/membres']);
      return false;
    }

    if(url=== 'logs' && role !== 'super administrateur') {
      alert("Accès refusé : vous n'avez pas la permission.");
      this.router.navigate(['/tableau-de-bord']);
    }

    return true;
  }
}
