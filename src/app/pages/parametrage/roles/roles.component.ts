import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Role } from '../../../models/fonctionnalite';
import { RolesService } from '../../../service/roles/roles.service';
import { NotificationService } from '../../../service/notification/notification.service';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import { PaginationComponent } from '../../../components/pagination/pagination.component';

@Component({
  selector: 'app-roles',
  imports: [ CommonModule,
    RouterLink, 
    RouterModule, 
    FormsModule,
    PaginationComponent],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.css'
})
export class RolesComponent {

  roles: Role[] = [];
  filter: string = '';
  allData: Role[] = [];
  dataFilter: Role[] = [];
  loading = true;
  searchTerm: string = '';

  // Pagination
  page: number = 1;
  collectionSize: number = 0;
  start: number = 0;
  end: number = 0;
  pageSize: number = 8;
  take: number = 8;

  constructor(
    private roleService: RolesService,
    private notificationService: NotificationService
  ){}

  async ngOnInit(){
    await this.loadRoles();
  }

  async loadRoles(){
    try {
      this.loading = true;
      this.allData = await this.roleService.getAllRoles();
      this.dataFilter = this.allData;
      this.collectionSize = this.dataFilter.length;
      this.refreshRoles();
      this.loading = false;
    } catch (error) {
      console.log('Erreur de récupération !', error);
      this.loading = false;
    }
  }

  refreshRoles() {
    this.start = (this.page - 1) * this.pageSize;
    this.end = this.start + this.pageSize;
    this.roles = this.dataFilter.slice(this.start, this.end);
  }

  onPageChange(newPage: number) {
    this.page = newPage;
    this.refreshRoles();
  }

  search(event: any) {
    const term = event.target.value.toLowerCase();
    
    if (term.length > 2 || term.length === 0) {
      this.dataFilter = this.allData.filter((role) => {
        return role.libelle.toLowerCase().includes(term);
      });
      this.collectionSize = this.dataFilter.length;
      this.page = 1; // Reset to first page on search
      this.refreshRoles();
    }
  }

  /**
   * Supprime un rôle avec confirmation
   * @param role Le rôle à supprimer
   */
  async deleteRole(role: Role) {
    // Confirmation de suppression
    const confirmDelete = await this.notificationService.confirmDelete(
      `Êtes-vous sûr de vouloir supprimer le rôle <b>${role.libelle}</b> ?\n\nCette action est irréversible.`
    );

    if (!confirmDelete) {
      return;
    }

    try {
      this.loading = true; // Afficher le loader
      
      // Appel du service de suppression
      await this.roleService.deleteRole(role.id!);
      
      // Afficher le message de succès
      this.notificationService.showSuccess('Rôle supprimé avec succès');
      
      // Recharger les données
      this.searchTerm = '';
      await this.loadRoles();

    } catch (error: any) {
      console.error('Erreur lors de la suppression:', error);
      
      // Afficher le message d'erreur
      const errorMessage = error.error?.message || 'Erreur lors de la suppression du rôle';
      this.notificationService.showError(errorMessage);
      
      this.loading = false;
    }
  }

  /**
   * Compte le nombre de permissions pour un rôle
   */
  getFonctionnalitesCount(role: Role): number {
    if (Array.isArray(role.fonctionnalites)) {
      return role.fonctionnalites.length;
    }
    return 0;
  }
}
