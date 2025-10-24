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
  selector: 'app-adolescents',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, PaginationComponent],
  templateUrl: './adolescents.component.html',
  styleUrls: ['./adolescents.component.css']
})
export class AdolescentsComponent implements OnInit {
  membres: Membres[] = [];
  departement: Departements | null = null;
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
      this.departement = departements.find(d => d.libelle === "Adolescents") || null;
      if (this.departement) {
        await this.loadPagination();
      }
    } catch (error) {
      console.error('Erreur lors du chargement des départements:', error);
      this.notificationService.showError('Erreur lors du chargement des informations du département');
    }
  }

  async loadPagination(): Promise<void> {
    if (!this.departement) return;

    try {
      this.isLoading = true;
      const response = await this.membresService.getPaginateMembresByDepartement(
        this.departement.id!,
        this.page,
        this.pageSize,
        this.searchTerm
      );
      
      this.membres = response.data;
      this.collectionSize = response.total;
    } catch (error) {
      console.error('Erreur lors du chargement des membres:', error);
      this.notificationService.showError('Erreur lors du chargement des membres');
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
}
