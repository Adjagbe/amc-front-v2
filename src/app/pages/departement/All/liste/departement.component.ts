import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterModule } from '@angular/router';
import { PaginationComponent } from '../../../../components/pagination/pagination.component';
import { DepartementsService } from '../../../../service/departements/departements.service';
import { MembresService } from '../../../../service/membres.service';
import { Departements } from '../../../../models/departements/departements';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../../../service/notification/notification.service';

@Component({
  selector: 'app-departement',
  imports: [RouterLink, RouterModule, FormsModule, CommonModule, PaginationComponent],
  templateUrl: './departement.component.html',
  styleUrl: './departement.component.css'
})
export class DepartementComponent {

    departement!: Departements[]
    filter: String = '';
    page = 1;
    pageSize = 8;
    collectionSize: number = 0;
    start: number = 0;
    end: number = 0;
    take: number = 0;
    dataFilter: Departements[] = [];
    allData: Departements[] = [];
  
    loading=true;
  
    searchTerm: string = '';
    action = false;
    
    // Comptage des membres par département
    departementsCount: {[departementId: number]: number} = {};

  constructor(
    private departementService: DepartementsService,
    private membresService: MembresService,
    private notificationService: NotificationService
  ){}

   ngOnInit(){
    this.getAllDepartment();
  }

  async getAllDepartment(){
    try {
      // Charger les départements
      const data = await this.departementService.getAllDepartements();
      this.allData = data;
      this.dataFilter = data;
      this.refresh();
      this.collectionSize = this.allData.length;
      
      // Charger le comptage des membres pour tous les départements
      await this.loadDepartementsCount();
      
      this.loading = false;
    } catch (error) {
      console.error('Erreur lors du chargement des départements:', error);
      this.loading = false;
    }
  }

  refresh() {
    this.start = (this.page - 1) * this.pageSize;
    this.end = this.start + this.pageSize;
    this.departement = this.dataFilter.map((cours, i) => ({ ...cours }))
      .slice(this.start, this.end);
    this.take = this.start + this.departement.length;
  }

  search(event: any) {

    this.dataFilter = this.allData.filter((dep) => {
      const term = event.target.value.toLowerCase();
      return (
        dep.libelle.toLowerCase().includes(term) 
      );
    });
    this.collectionSize = this.dataFilter.length;
     this.refresh();
  }

  onPageChange(newPage: number) {
    this.page = newPage;
    this.refresh();
  }

  /**
   * Charge le comptage des membres pour tous les départements
   */
  async loadDepartementsCount() {
    try {
      this.departementsCount = await this.membresService.getAllDepartementsCount();
    } catch (error) {
      console.error('Erreur lors du chargement du comptage des membres:', error);
      this.departementsCount = {};
    }
  }

  /**
   * Récupère le nombre de membres d'un département
   * @param departementId ID du département
   * @returns Nombre de membres
   */
  getMembresCount(departementId: number): number {
    return this.departementsCount[departementId] || 0;
  }

  async deleteDepartement(departement: Departements){
    const confirmed = await this.notificationService.confirmDelete(
      `Êtes-vous sûr de vouloir supprimer le département ${departement.libelle} ?`
    );

    if(!confirmed){
      return;
    }

    try {
      this.loading = true;

      const response = await this.departementService.deleteDepartement(departement.id);
      this.searchTerm = '';
      this.getAllDepartment()
      this.notificationService.showSuccess(response.message);
      this.loading = false;

    } catch (error) {
      console.error('Erreur lors de la suppression du département:', error);
      this.loading = false;
     
    }
  }
}
