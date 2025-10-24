import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar-mobile',
  imports: [RouterLink, RouterModule, RouterLinkActive],
  templateUrl: './sidebar-mobile.component.html',
  styleUrl: './sidebar-mobile.component.css'
})
export class SidebarMobileComponent {
  view = false;
  constructor() {
    const session = localStorage.getItem('session');
    if (session) {
      const role = JSON.parse(session).as_js.acces.libelle;
      if (role === 'super administrateur') {
        this.view = true
      }
    }
  }
}
