import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Fonctionnalite } from '../../../models/fonctionnalite';
import { FonctionnalitesService } from '../../../service/fonctionnalites/fonctionnalites.service';
import { NotificationService } from '../../../service/notification/notification.service';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import { PaginationComponent } from '../../../components/pagination/pagination.component';

@Component({
  selector: 'app-fonctionnalites',
  imports: [ CommonModule,
    RouterLink, 
    RouterModule, 
    FormsModule,
    PaginationComponent],
  templateUrl: './fonctionnalites.component.html',
  styleUrl: './fonctionnalites.component.css'
})
export class FonctionnalitesComponent {

  fonctionnalites: Fonctionnalite[] = [];
  filter: string = '';
  loading = true;
  searchTerm: string = '';

  // Pagination
  page: number = 1;
  collectionSize: number = 0;
  start: number = 0;
  end: number = 0;
  pageSize: number = 10;
  take: number = 0;

  constructor(
    private fonctionnaliteService: FonctionnalitesService,
    private notificationService: NotificationService
  ){}

  async ngOnInit(){
    this.loadPagination();
  }

  loadPagination(){
    this.searchTerm = (this.searchTerm.length > 2) ? this.searchTerm : '';
    this.fonctionnaliteService.getPaginateFonctionnalites(this.page, this.pageSize, this.searchTerm)
      .then((response: any) => {
        this.fonctionnalites = response.data;
        this.collectionSize = response.total;
        this.start = response.from;
        this.end = response.to;
        this.take = this.start + this.fonctionnalites.length;
      })
      .catch(() => console.log('Erreur de récupération !', 'Oops'))
      .finally(() => { this.loading = false });
  }

  onPageChange(newPage: number) {
    this.page = newPage;
    this.loadPagination();
  }

  search(event: any) {
    if (event.target.value.length > 2 || event.target.value == '') {
      this.loading = true;
      this.searchTerm = event.target.value.toLowerCase();
      this.page = 1;
      this.loadPagination();
    }
  }

  /**
   * Supprime une fonctionnalité avec confirmation
   */
  async deleteFonctionnalite(fonc: Fonctionnalite) {
    const confirmDelete = await this.notificationService.confirmDelete(
      `Êtes-vous sûr de vouloir supprimer la fonctionnalité <b>${fonc.libelle}</b> ?\n\nCette action est irréversible.`
    );

    if (!confirmDelete) {
      return;
    }

    try {
      this.loading = true;
      await this.fonctionnaliteService.deleteFonctionnalite(fonc.id!);
      this.notificationService.showSuccess('Fonctionnalité supprimée avec succès');
      this.searchTerm = '';
      this.page = 1;
      this.loadPagination();
    } catch (error: any) {
      console.error('Erreur lors de la suppression:', error);
      const errorMessage = error.error?.message || 'Erreur lors de la suppression de la fonctionnalité';
      this.notificationService.showError(errorMessage);
      this.loading = false;
    }
  }
}
