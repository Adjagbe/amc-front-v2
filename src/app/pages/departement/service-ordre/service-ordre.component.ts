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
  selector: 'app-service-ordre',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, PaginationComponent],
  templateUrl: './service-ordre.component.html',
  styleUrls: ['./service-ordre.component.css']
})
export class ServiceOrdreComponent implements OnInit {
  membres: Membres[] = [];
  departementInfo: Departements | null = null;
  searchTerm: string = '';
  isLoading: boolean = false;
  
  // Pagination
  page = 1;
  pageSize = 8;
  collectionSize = 0;

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
      this.departementInfo = departements.find(d => d.libelle === "Service d'ordre") || null;
      if (this.departementInfo) {
        this.loadPagination();
      }
    } catch (error) {
      console.error('Erreur lors du chargement des départements:', error);
      this.notificationService.showError('Erreur lors du chargement des informations du département');
    }
  }

  loadPagination(): void {
    if (!this.departementInfo) {
      console.error('Aucune information sur le département disponible');
      return;
    }

    this.searchTerm = (this.searchTerm.length > 2) ? this.searchTerm : '';
    this.isLoading = true;
    
    this.membresService.getPaginateMembresByDepartement(
      this.departementInfo.id!,
      this.page,
      this.pageSize,
      this.searchTerm
    ).then((response: any) => {
      this.membres = response.data;
      this.collectionSize = response.total;
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
    this.page = 1;
    this.loadPagination();
  }

  calculateAge(birthday: string): number {
    if (!birthday) return 0;
    const birthDate = new Date(birthday);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  get totalMembres(): number {
    return this.membres.length;
  }
}
