import { CommonModule } from '@angular/common';
import { Component, HostListener, NgModule } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { Membres } from '../../../../models/membres';
import { MembresService } from '../../../../service/membres.service';
import { FormsModule } from '@angular/forms';
import { Departements } from '../../../../models/departements/departements';
import { DepartementsService } from '../../../../service/departements/departements.service';
import { NotificationService } from '../../../../service/notification/notification.service';

@Component({
  selector: 'app-ajouter-departement',
  imports: [RouterLink, RouterModule, CommonModule, FormsModule ],
  templateUrl: './ajouter-departement.component.html',
  styleUrl: './ajouter-departement.component.css'
})
export class AjouterDepartementComponent {
  loading = false;
  messageError: string = '';
  membres: Membres[] = [];
  filteredMembres1: Membres[] = [];
  filteredMembres2: Membres[] = [];

  newDepartement: Departements = new Departements();

  searchTerm1 = '';
  searchTerm2 = '';
  showDropdown: string | null = null; // 'responsable1', 'responsable2', or null

  constructor(
    private membreService: MembresService, 
    private router: Router, 
    private departementService: DepartementsService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.membreService.getallMembre().then((data) => {
      this.membres = data;
      this.filteredMembres1 = data;
      this.filteredMembres2 = data;
    });
  }

  createDepartement() {
    this.loading = true;

    const existe = this.departementService.getAllDepartements().then((data) => {
      return data.some((item: any) => 
        item.libelle.trim().toLowerCase() === this.newDepartement.libelle.trim().toLowerCase()
      );
    });

    existe.then((res) => {
      if (res) {
        // this.messageError = "Ce département est déjà enregistré.";
        this.notificationService.showError('Ce département ' + this.newDepartement.libelle + ' est déjà enregistré.');
        this.loading = false; 
      } else {
        this.departementService.addDepartement(this.newDepartement).then(() => {
          this.notificationService.showSuccess('Département ' + this.newDepartement.libelle + ' ajouté avec succès');
          this.loading = false;
          this.router.navigate(['/departement']);
        });
      }
    });
  }

  toggleDropdown(type: string) {
    this.showDropdown = this.showDropdown === type ? null : type;
    if (this.showDropdown) {
      this.filterMembres(type);
      // Reset search term when opening
      if (type === 'responsable1') {
        this.searchTerm1 = '';
      } else {
        this.searchTerm2 = '';
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
            m.id !== this.newDepartement.id_responsable // Exclure le responsable principal
          )
        : this.membres.filter(m => m.id !== this.newDepartement.id_responsable);
    }
  }

  selectMembre(membre: Membres, type: string) {
    if (type === 'responsable1') {
      this.newDepartement.id_responsable = membre.id;
      this.searchTerm1 = `${membre.nom} ${membre.prenom}`;
      // Si ce membre était sélectionné comme responsable 2, le désélectionner
      if (this.newDepartement.id_responsable2 === membre.id) {
        this.newDepartement.id_responsable2 = null;
        this.searchTerm2 = '';
      }
    } else {
      this.newDepartement.id_responsable2 = membre.id;
      this.searchTerm2 = `${membre.nom} ${membre.prenom}`;
    }
    this.showDropdown = null;
    
    // Mettre à jour les listes filtrées pour exclure les sélections
    this.filteredMembres1 = [...this.membres];
    this.filteredMembres2 = this.membres.filter(m => m.id !== this.newDepartement.id_responsable);
  }

  clearSelection(type: string) {
    if (type === 'responsable1') {
      this.newDepartement.id_responsable = null;
      this.searchTerm1 = '';
    } else {
      this.newDepartement.id_responsable2 = null;
      this.searchTerm2 = '';
    }
    this.showDropdown = null;
    
    // Mettre à jour les listes filtrées
    this.filteredMembres1 = [...this.membres];
    this.filteredMembres2 = this.membres.filter(m => m.id !== this.newDepartement.id_responsable);
  }

  getSelectedMembreName(type: string): string {
    const membreId = type === 'responsable1' 
      ? this.newDepartement.id_responsable 
      : this.newDepartement.id_responsable2;
    
    const membre = this.membres.find(m => m.id === membreId);
    return membre ? `${membre.nom} ${membre.prenom}` : '';
  }

  trackByMembreId(_: number, m: Membres) {
    return m.id;
  }




}
