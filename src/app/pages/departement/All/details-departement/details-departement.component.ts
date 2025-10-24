import { Component } from '@angular/core';
import { Departements } from '../../../../models/departements/departements';
import { Membres } from '../../../../models/membres';
import { ActivatedRoute, RouterLink, RouterModule } from '@angular/router';
import { DepartementsService } from '../../../../service/departements/departements.service';
import { MembresService } from '../../../../service/membres.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-details-departement',
  imports: [CommonModule, RouterLink, RouterModule],
  templateUrl: './details-departement.component.html',
  styleUrl: './details-departement.component.css',
})
export class DetailsDepartementComponent {

  showDepartement!: Departements
  loading = true;
  id!: any;
  
  // Données des membres du département
  membresDepartement: Membres[] = [];
  nombreMembres = 0;
  loadingMembres = true;

  constructor(
    private route: ActivatedRoute, 
    private DepartementService: DepartementsService,
    private MembresService: MembresService
  ){

    this.id = this.route.snapshot.paramMap.get('id')

    if (this.id != null) {
      // Charger les informations du département
      this.loadDepartementDetails();
      
      // Charger les membres du département
      this.loadMembresDepartement();
    }
  }

  /**
   * Charge les détails du département
   */
  async loadDepartementDetails() {
    try {
      const data = await this.DepartementService.getDepartementById(this.id);
      this.showDepartement = data;
      this.loading = false;
    } catch (error) {
      console.error('Erreur lors du chargement du département:', error);
      this.loading = false;
    }
  }

  /**
   * Charge la liste des membres du département
   */
  async loadMembresDepartement() {
    try {
      const data = await this.MembresService.getMembresByDepartement(this.id);
      this.membresDepartement = data.membres;
      this.nombreMembres = data.count;
      this.loadingMembres = false;
    } catch (error) {
      console.error('Erreur lors du chargement des membres:', error);
      this.loadingMembres = false;
    }
  
}
}
