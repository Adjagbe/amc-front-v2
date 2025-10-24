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
  selector: 'app-auxiliaire-jeunes-filles',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, PaginationComponent],
  templateUrl: './auxiliaire-jeunes-filles.component.html',
  styleUrls: ['./auxiliaire-jeunes-filles.component.css']
})
export class AuxiliaireJeunesFillesComponent implements OnInit {
  membres: Membres[] = [];
  departementInfo: Departements | null = null;
  searchTerm: string = '';
  
  // Pagination côté serveur
  page: number = 1;
  pageSize: number = 8;
  collectionSize: number = 0;
  isLoading: boolean = false;

  // Getters pour l'affichage de pagination
  get start(): number {
    return Math.min((this.page - 1) * this.pageSize + 1, this.collectionSize);
  }

  get end(): number {
    return Math.min(this.page * this.pageSize, this.collectionSize);
  }

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
      this.departementInfo = departements.find((d: any) => d.libelle === 'Auxiliaire de Jeunes Filles') || null;
      if (this.departementInfo) {
        this.loadPagination();
      }
    }).catch((error: any) => {
      console.error('Erreur lors du chargement des informations du département:', error);
    });
  }

  async loadPagination(): Promise<void> {
    if (!this.departementInfo || this.isLoading) return;

    this.isLoading = true;
    try {
      const result = await this.membresService.getPaginateMembresByDepartement(
        this.departementInfo.id!, 
        this.page, 
        this.pageSize, 
        this.searchTerm
      );
      this.membres = result.data;
      this.collectionSize = result.total;
    } catch (error) {
      console.error('Erreur lors du chargement des membres:', error);
      this.notificationService.showError('Erreur lors du chargement des membres');
    } finally {
      this.isLoading = false;
    }
  }

  async search(): Promise<void> {
    if (this.searchTerm.length > 2 || this.searchTerm.length === 0) {
      this.page = 1;
      await this.loadPagination();
    }
  }

  async onPageChange(page: number): Promise<void> {
    this.page = page;
    await this.loadPagination();
  }

  async supprimerMembre(membre: Membres): Promise<void> {
    const confirmed = await this.notificationService.confirmDelete(
      `Êtes-vous sûr de vouloir supprimer ${membre.prenom} ${membre.nom} ?`
    );

    if (confirmed) {
      try {
        await this.membresService.deleteMembre(membre.id);
        this.notificationService.showSuccess('Membre supprimé avec succès');
        this.loadPagination();
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        this.notificationService.showError('Erreur lors de la suppression du membre');
      }
    }
  }
}
