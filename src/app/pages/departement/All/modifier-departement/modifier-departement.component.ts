import { Component, HostListener } from '@angular/core';
import { Departements } from '../../../../models/departements/departements';
import { DepartementsService } from '../../../../service/departements/departements.service';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MembresService } from '../../../../service/membres.service';
import { Membres } from '../../../../models/membres';
import { NotificationService } from '../../../../service/notification/notification.service';

@Component({
  selector: 'app-modifier-departement',
  imports: [RouterLink, RouterModule, CommonModule, FormsModule],
  templateUrl: './modifier-departement.component.html',
  styleUrl: './modifier-departement.component.css'
})
export class ModifierDepartementComponent {

  id!: any;
  showDepartement: Departements = new Departements();
  messageError = '';
  membres: Membres[] = [];
  filteredMembres1: Membres[] = [];
  filteredMembres2: Membres[] = [];

  loading = false;

  // Variables pour les Select2
  searchTerm1 = '';
  searchTerm2 = '';
  showDropdown: string | null = null; // 'responsable1', 'responsable2', or null

  constructor(
    private departementService: DepartementsService, 
    private route: ActivatedRoute, 
    private router: Router, 
    private membreService: MembresService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id');
    this.loading = true;

    this.departementService.getDepartementById(this.id).then(data => {
      this.showDepartement = data;

      this.showDepartement.id_responsable = data.id_responsable?.id || null;
      this.showDepartement.id_responsable2 = data.id_responsable2?.id || null;

      // Initialiser les termes de recherche avec les noms des responsables sélectionnés
      if (data.id_responsable) {
        this.searchTerm1 = `${data.id_responsable.nom} ${data.id_responsable.prenom}`;
      }
      if (data.id_responsable2) {
        this.searchTerm2 = `${data.id_responsable2.nom} ${data.id_responsable2.prenom}`;
      }

      this.loading = false;
    });
   
    this.getAllMembre();
  }

  getAllMembre() {
    this.membreService.getallMembre().then((data) => {
      this.membres = data;
      this.filteredMembres1 = data;
      this.filteredMembres2 = data;
    });
  }

  UpdateDepartement() {
    this.loading = true;

    const existe = this.departementService.getAllDepartements().then((data) => {
      return data.some(
        (item: any) => item.libelle.trim().toLowerCase() === this.showDepartement.libelle.trim().toLowerCase() 
        && item.id !== this.showDepartement.id // Exclure le département actuel
      );
    });

    existe.then((res) => {
      if (res) {
        this.notificationService.showError('Ce département ' + this.showDepartement.libelle + ' existe déjà.');
        this.loading = false;
      } else {
        this.departementService.UpdateDepartement(this.id, this.showDepartement).then(() => {
          this.notificationService.showSuccess('Département ' + this.showDepartement.libelle + ' modifié avec succès');
          this.loading = false;
          this.router.navigate(['/departement']);
        });
      }
    });
  }

  // Méthodes pour le composant Select2
  toggleDropdown(type: string) {
    this.showDropdown = this.showDropdown === type ? null : type;
    if (this.showDropdown) {
      this.filterMembres(type);
      // Reset search term when opening
      if (type === 'responsable1') {
        this.searchTerm1 = this.getSelectedMembreName('responsable1');
      } else {
        this.searchTerm2 = this.getSelectedMembreName('responsable2');
      }
    }
  }

  @HostListener('document:click')
  closeDropdownOnOutsideClick() {
    this.showDropdown = null;
  }

  filterMembres(type: string) {
    if (type === 'responsable1') {
      const term = this.searchTerm1?.toLowerCase().trim() || '';
      this.filteredMembres1 = term
        ? this.membres.filter(m =>
            (`${m.nom} ${m.prenom}`).toLowerCase().includes(term)
          )
        : [...this.membres];
    } else {
      const term = this.searchTerm2?.toLowerCase().trim() || '';
      this.filteredMembres2 = term
        ? this.membres.filter(m =>
            (`${m.nom} ${m.prenom}`).toLowerCase().includes(term) &&
            m.id !== this.showDepartement.id_responsable // Exclure le responsable principal
          )
        : this.membres.filter(m => m.id !== this.showDepartement.id_responsable);
    }
  }

  selectMembre(membre: Membres, type: string) {
    if (type === 'responsable1') {
      this.showDepartement.id_responsable = membre.id;
      this.searchTerm1 = `${membre.nom} ${membre.prenom}`;
      // Si ce membre était sélectionné comme responsable 2, le désélectionner
      if (this.showDepartement.id_responsable2 === membre.id) {
        this.showDepartement.id_responsable2 = null;
        this.searchTerm2 = '';
      }
    } else {
      this.showDepartement.id_responsable2 = membre.id;
      this.searchTerm2 = `${membre.nom} ${membre.prenom}`;
    }
    this.showDropdown = null;
    
    // Mettre à jour les listes filtrées pour exclure les sélections
    this.filteredMembres1 = [...this.membres];
    this.filteredMembres2 = this.membres.filter(m => m.id !== this.showDepartement.id_responsable);
  }

  clearSelection(type: string) {
    if (type === 'responsable1') {
      this.showDepartement.id_responsable = null;
      this.searchTerm1 = '';
    } else {
      this.showDepartement.id_responsable2 = null;
      this.searchTerm2 = '';
    }
    this.showDropdown = null;
    
    // Mettre à jour les listes filtrées
    this.filteredMembres1 = [...this.membres];
    this.filteredMembres2 = this.membres.filter(m => m.id !== this.showDepartement.id_responsable);
  }

  getSelectedMembreName(type: string): string {
    const membreId = type === 'responsable1' 
      ? this.showDepartement.id_responsable 
      : this.showDepartement.id_responsable2;
    
    const membre = this.membres.find(m => m.id === membreId);
    return membre ? `${membre.nom} ${membre.prenom}` : '';
  }

  trackByMembreId(_: number, m: Membres) {
    return m.id;
  }

}
