import { Component } from '@angular/core';
import { NavigationEnd, RouterOutlet, Router, Event } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ActivityLogService } from './service/activity_log/activity-log.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'amc_gestion';

  constructor(private router: Router, private logService : ActivityLogService ){}

  ngOnInit() {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        setTimeout(() => {
          if (typeof window !== 'undefined' && window.HSStaticMethods) {
            window.HSStaticMethods.autoInit();   // Add particular component `autoInit()` method
          }
        }, 100);
        setTimeout(() => {
          if (typeof window !== 'undefined' && window.HSDropdown) {
            window.HSDropdown.autoInit();   // Add particular component `autoInit()` method
          }
        }, 100);
        setTimeout(() => {
          if (typeof window !== 'undefined' && window.HSAccordion) {
            window.HSAccordion.autoInit();   // Add particular component `autoInit()` method
          }
        }, 100);
      }
    });

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(event => {
      const route = (event as NavigationEnd).urlAfterRedirects; //ecoute les changements de route

      this.logService.addLogActivity(route).then(() => {
      })
    });
  }
}
