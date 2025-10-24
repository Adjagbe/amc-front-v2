import { CommonModule } from '@angular/common';
import { Component, OnInit, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { Membres } from '../../../models/membres';
import { MembresService } from '../../../service/membres.service';
import { DepartementsService } from '../../../service/departements/departements.service';
import { Departements } from '../../../models/departements/departements';
import { NotificationService } from '../../../service/notification/notification.service';

@Component({
  selector: 'app-ajouter',
  imports: [RouterLink, RouterModule, CommonModule, FormsModule],
  providers: [DepartementsService],
  templateUrl: './ajouter.component.html',
  styleUrl: './ajouter.component.css'
})
export class AjouterComponent implements OnInit {

  // Initialisation du nouveau membre avec l'interface moderne
  newMembres: Membres = {
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
  
  loading = false;
  messageError: string = '';

  // Liste de tous les départements disponibles pour le select
  departementsDisponibles: Departements[] = [];
  
  // Départements sélectionnés (IDs)
  departementsSelectionnes: number[] = [];
  
  // État du dropdown
  isDropdownOpen = false;
  
  // Recherche dans les départements
  searchTermDept = '';
  filteredDepartements: Departements[] = [];

  constructor(
    private membreService: MembresService, 
    private router: Router, 
    private deptService: DepartementsService,
    private notificationService: NotificationService
  ) {}

  /**
   * Initialisation du composant
   */
  ngOnInit() {
    this.getAllDepartements();
  }

  /**
   * Récupération de tous les départements disponibles pour le select
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

  /**
   * Création d'un nouveau membre avec validation et gestion des départements
   */
  async createMembre() {
    this.loading = true;
    this.messageError = '';

    try {
      // Assigner les départements sélectionnés au membre
      this.newMembres.departements = this.departementsSelectionnes;

      // Vérification des doublons
      const membresExistants = await this.membreService.getallMembre();
      const existe = membresExistants.some((item: any) => 
        item.nom.trim().toLowerCase() === this.newMembres.nom.trim().toLowerCase() && 
        item.prenom.trim().toLowerCase() === this.newMembres.prenom.trim().toLowerCase() && 
        (item.portable === this.newMembres.portable || item.portable2 === this.newMembres.portable2) &&
        item.birthday === this.newMembres.birthday
      );

      if (existe) {
        this.messageError = "Ce membre de l'église est déjà enregistré.";
        this.loading = false; 
        return;
      }

      // Création du membre
      const response = await this.membreService.addMembre(this.newMembres);
      // console.log('Membre créé avec succès:', response);
      this.notificationService.showSuccess(this.newMembres.nom + ' ' + this.newMembres.prenom + ' a été créé avec succès.');
      this.router.navigate(['/membres']);
      
    } catch (error) {
      console.error('Erreur lors de la création du membre:', error);
      this.messageError = "Une erreur est survenue lors de l'enregistrement.";
      this.loading = false;
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

  /**
   * Supprime un département de la sélection
   * @param id ID du département à supprimer
   */
  removeDepartement(id: number) {
    this.departementsSelectionnes = this.departementsSelectionnes.filter(deptId => deptId !== id);
  }

  /**
   * Toggle l'ouverture/fermeture du dropdown
   */
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
    if (this.isDropdownOpen) {
      // Réinitialiser la recherche quand on ouvre le dropdown
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
    this.newMembres.departements = this.departementsSelectionnes;
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
}
