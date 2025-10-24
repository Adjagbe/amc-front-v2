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
  selector: 'app-chorale',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, PaginationComponent],
  templateUrl: './chorale.component.html',
  styleUrls: ['./chorale.component.css']
})
export class ChoraleComponent implements OnInit {
  membres: Membres[] = [];
  departementInfo: Departements | null = null;
  searchTerm: string = '';
  
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

  async loadDepartementInfo(): Promise<void> {
    try {
      const departements = await this.departementsService.getAllDepartements();
      this.departementInfo = departements.find((d: any) => d.libelle === 'Chorale') || null;
      if (this.departementInfo) {
        await this.loadPagination();
      }
    } catch (error) {
      console.error('Erreur lors du chargement des informations du département:', error);
    }
  }

  async loadPagination(): Promise<void> {
    if (!this.departementInfo) return;

    try {
      this.isLoading = true;
      const response = await this.membresService.getPaginateMembresByDepartement(
        this.departementInfo.id,
        this.page,
        this.pageSize,
        this.searchTerm
      );
      
      this.membres = response.data;
      this.collectionSize = response.total;
    } catch (error) {
      console.error('Erreur lors du chargement des membres:', error);
    } finally {
      this.isLoading = false;
    }
  }

  search(): void {
    if (this.searchTerm.length > 2 || this.searchTerm.length === 0) {
      this.page = 1;
      this.loadPagination();
    }
  }

  onPageChange(newPage: number): void {
    this.page = newPage;
    this.loadPagination();
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
