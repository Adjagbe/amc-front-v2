import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MembresService } from '../../../service/membres.service';
import { DepartementsService } from '../../../service/departements/departements.service';
import { NotificationService } from '../../../service/notification/notification.service';
import { Membres } from '../../../models/membres';
import { Departements } from '../../../models/departements/departements';
import { RouterLink } from '@angular/router';
import { PaginationComponent } from '../../../components/pagination/pagination.component';

@Component({
  selector: 'app-enfant',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, PaginationComponent],
  templateUrl: './enfant.component.html',
  styleUrls: ['./enfant.component.css']
})
export class EnfantComponent implements OnInit {
  membres: Membres[] = [];
  departementInfo: Departements | null = null;
  searchTerm: string = '';
  isLoading: boolean = false;
  
  // Pagination
  page: number = 1;
  pageSize: number = 8;
  collectionSize: number = 0;
  start: number = 0;
  end: number = 0;
  take: number = 0;

  constructor(
    private membresService: MembresService,
    private departementsService: DepartementsService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadDepartementInfo();
  }

  loadDepartementInfo(): void {
    this.departementsService.getAllDepartements().then((departements: any) => {
      this.departementInfo = departements.find((d: any) => d.libelle === 'Enfants') || null;
      if (this.departementInfo) {
        this.loadPagination();
      }
    }).catch((error: any) => {
      console.error('Erreur lors du chargement des informations du département:', error);
    });
  }

  loadPagination(): void {
    if (!this.departementInfo) {
      console.error('Aucune information sur le département disponible');
      return;
    }

    this.searchTerm = (this.searchTerm.length > 2) ? this.searchTerm : '';
    this.isLoading = true;
    
    this.membresService.getPaginateMembresByDepartement(
      this.departementInfo.id,
      this.page,
      this.pageSize,
      this.searchTerm
    ).then((response: any) => {
      this.membres = response.data;
      this.collectionSize = response.total;
      this.start = response.from;
      this.end = response.to;
      this.take = this.start + this.membres.length;
    }).catch((error: any) => {
      console.error('Erreur lors du chargement des membres:', error);
    }).finally(() => {
      this.isLoading = false;
    });
  }

  onPageChange(newPage: number): void {
    this.page = newPage;
    this.loadPagination();
  }

  search(): void {
    if (this.searchTerm.length > 2 || this.searchTerm === '') {
      this.isLoading = true;
      this.page = 1;
      this.loadPagination();
    }
  }

  async supprimerMembre(membre: Membres): Promise<void> {
    const confirmed = await this.notificationService.confirmDelete(
      `Êtes-vous sûr de vouloir supprimer ${membre.prenom} ${membre.nom} ?`
    );

    if (confirmed) {
      try {
        await this.membresService.deleteMembre(membre.id);
        this.notificationService.showSuccess('Membre supprimé avec succès');
        this.page = 1;
        this.loadPagination();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        this.notificationService.showError('Erreur lors de la suppression du membre');
      }
    }
  }
}
