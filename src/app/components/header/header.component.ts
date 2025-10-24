import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { SidebarMobileComponent } from "../sidebar-mobile/sidebar-mobile.component";
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [SidebarMobileComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  first_name: string = '';
  last_name: string = '';

  constructor(private router: Router, @Inject(PLATFORM_ID) private platformId: Object){
    
    if (isPlatformBrowser(this.platformId)) {
      const userData = localStorage.getItem('session')
      if (userData) {
        const session = JSON.parse(userData);
        if (session?.as_js) {
          this.first_name = session.as_js.name_user
        }


      }
    }
  }

  logout() {
    localStorage.removeItem('session');
    this.router.navigate(['/connexion'])
  }


}
