import { CommonModule } from '@angular/common';
import { Component, OnInit, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MembresService } from '../../../service/membres.service';
import { DepartementsService } from '../../../service/departements/departements.service';
import { Membres } from '../../../models/membres';
import { Departements } from '../../../models/departements/departements';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NotificationService } from '../../../service/notification/notification.service';

@Component({
  selector: 'app-modifier',
  imports: [CommonModule, FormsModule, RouterLink],
  providers: [DepartementsService],
  templateUrl: './modifier.component.html',
  styleUrl: './modifier.component.css'
})
export class ModifierComponent implements OnInit {

  id!: any
  showMembre: Membres = {
    id: 0,
    nom: '',
    prenom: '',
    email: '',
    portable: '',
    adresse: '',
    birthday: '',
    portable2: '',
    departements: [] // Initialisation du tableau des départements sélectionnés
  };
  messageError = ''
  loading = false
  
  // Gestion des départements
  departementsDisponibles: Departements[] = [];
  departementsSelectionnes: number[] = [];
  isDropdownOpen = false;
  
  // Recherche dans les départements
  searchTermDept = '';
  filteredDepartements: Departements[] = [];

  constructor(
    private membreService: MembresService, 
    private route: ActivatedRoute, 
    private router: Router,
    private deptService: DepartementsService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id')

    this.getAllDepartements();

    // Charger les données du membre
    this.membreService.getMembresById(this.id).then(data => {
      this.showMembre = data;
      // Initialiser les départements sélectionnés à partir des données du membre
      this.departementsSelectionnes = this.showMembre.departements || [];
    })
  }

  /**
   * Récupération de tous les départements disponibles
   */
  async getAllDepartements() {
    try {
      this.departementsDisponibles = await this.deptService.getAllDepartements();
      this.filteredDepartements = [...this.departementsDisponibles]; // Initialiser la liste filtrée
    } catch (error) {
      console.error('Erreur lors de la récupération des départements:', error);
      this.messageError = "Impossible de charger les départements.";
    }
  }

  UpdateMembre() {
    this.loading = true;
    this.messageError = '';

    try {
      // Assigner les départements sélectionnés au membre
      this.showMembre.departements = this.departementsSelectionnes;

     this.membreService.UpdateMembre(this.id, this.showMembre).then(() => {
        this.router.navigate(['/membres']);
      }).catch(error => {
        console.error('Erreur lors de la mise à jour du membre:', error);
        this.messageError = "Une erreur est survenue lors de la mise à jour.";
        this.loading = false;
      });

      this.notificationService.showSuccess(this.showMembre.nom + ' ' + this.showMembre.prenom + ' a été mis à jour avec succès.');

    } catch (error) {
      console.error('Erreur lors de la mise à jour du membre:', error);
      this.messageError = "Une erreur est survenue lors de la mise à jour.";
      this.loading = false;
    }
  }

  /**
   * Toggle l'ouverture/fermeture du dropdown
   */
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
    // Réinitialiser la recherche quand on ouvre le dropdown
    if (this.isDropdownOpen) {
      this.clearDepartementSearch();
    }
  }

  /**
   * Toggle la sélection d'un département
   * @param id ID du département à toggle
   */
  toggleDepartementSelection(id: number) {
    const index = this.departementsSelectionnes.indexOf(id);
    if (index > -1) {
      // Département déjà sélectionné, on le retire
      this.departementsSelectionnes.splice(index, 1);
    } else {
      // Département pas encore sélectionné, on l'ajoute
      this.departementsSelectionnes.push(id);
    }
    
    // Mettre à jour le membre
    this.showMembre.departements = this.departementsSelectionnes;
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

  /**
   * Supprime un département de la sélection
   * @param id ID du département à supprimer
   */
  removeDepartement(id: number) {
    this.departementsSelectionnes = this.departementsSelectionnes.filter(deptId => deptId !== id);
    this.showMembre.departements = this.departementsSelectionnes;
  }

  /**
   * Filtre les départements selon le terme de recherche
   */
  filterDepartements() {
    if (!this.searchTermDept.trim()) {
      this.filteredDepartements = [...this.departementsDisponibles];
    } else {
      this.filteredDepartements = this.departementsDisponibles.filter(dept =>
        dept.libelle.toLowerCase().includes(this.searchTermDept.toLowerCase())
      );
    }
  }

  /**
   * Efface le terme de recherche et réinitialise la liste
   */
  clearDepartementSearch() {
    this.searchTermDept = '';
    this.filteredDepartements = [...this.departementsDisponibles];
  }

  /**
   * Ferme le dropdown quand on clique à l'extérieur
   */
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.relative')) {
      this.isDropdownOpen = false;
    }
  }
}
