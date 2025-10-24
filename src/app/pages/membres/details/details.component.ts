import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Membres } from '../../../models/membres';
import { Departements } from '../../../models/departements/departements';
import { MembresService } from '../../../service/membres.service';
import { DepartementsService } from '../../../service/departements/departements.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-details',
  imports: [RouterLink, CommonModule],
  providers: [DepartementsService],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css'
})
export class DetailsComponent implements OnInit {

  showMembres!: Membres
  departementsDisponibles: Departements[] = [];
  loading = true
  id!:any

constructor(
  private route : ActivatedRoute, 
  private MembreService: MembresService,
  private deptService: DepartementsService
){}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');

    // Charger les départements disponibles
    this.getAllDepartements();

    // Charger les données du membre
    if (this.id != null) {
      this.MembreService.getMembresById(this.id).then(data => {
        this.showMembres = data;
        this.loading = false;
      });
    }
  }

  /**
   * Récupération de tous les départements disponibles
   */
  async getAllDepartements() {
    try {
      this.departementsDisponibles = await this.deptService.getAllDepartements();
    } catch (error) {
      console.error('Erreur lors de la récupération des départements:', error);
    }
  }

  /**
   * Récupère le libellé d'un département par son ID
   * @param id ID du département
   * @returns Libellé du département
   */
  getDepartementLibelle(id: number): string {
    const dept = this.departementsDisponibles.find(d => d.id === id);
    return dept ? dept.libelle : 'Département inconnu';
  }
}
