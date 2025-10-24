import { Directive, Input, TemplateRef, ViewContainerRef, OnInit } from '@angular/core';
import { FonctionnalitesService } from '../service/fonctionnalites/fonctionnalites.service';

@Directive({
  selector: '[appHasPermission]',
  standalone: true
})
export class HasPermissionDirective implements OnInit {
  @Input() appHasPermission: string | string[] = '';
  @Input() appHasPermissionMode: 'any' | 'all' = 'any'; // 'any' = OU logique, 'all' = ET logique

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private fonctionnalitesService: FonctionnalitesService
  ) {}

  ngOnInit() {
    this.updateView();
  }

  private updateView() {
    const hasPermission = this.checkPermission();
    
    if (hasPermission) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }

  private checkPermission(): boolean {
    if (!this.appHasPermission) {
      alert('No permission specified');
      return true;
    }

    const permissions = Array.isArray(this.appHasPermission) 
      ? this.appHasPermission 
      : [this.appHasPermission];

    if (this.appHasPermissionMode === 'all') {
      return this.fonctionnalitesService.hasAllFonctionnalites(permissions);
    } else {
      return this.fonctionnalitesService.hasAnyFonctionnalite(permissions);
    }
  }
}
