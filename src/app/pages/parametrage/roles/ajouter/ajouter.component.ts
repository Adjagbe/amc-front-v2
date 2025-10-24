import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { Role } from '../../../../models/fonctionnalite';
import { RolesService } from '../../../../service/roles/roles.service';
import { NotificationService } from '../../../../service/notification/notification.service';

@Component({
  selector: 'app-ajouter',
  imports: [RouterLink, RouterModule, CommonModule, FormsModule],
  templateUrl: './ajouter.component.html',
  styleUrl: './ajouter.component.css'
})
export class AjouterComponent implements OnInit {

  // Initialisation du nouveau rôle
  newRole: Partial<Role> = {
    libelle: '',
    fonctionnalites: []
  };
  
  loading = false;
  messageError: string = '';

  constructor(
    private roleService: RolesService, 
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    // Pas besoin de charger des données supplémentaires
  }

  /**
   * Création d'un nouveau rôle avec validation
   */
  async createRole() {
    this.loading = true;
    this.messageError = '';

    try {
      // Vérification des doublons
      const rolesExistants = await this.roleService.getAllRoles();
      const existe = rolesExistants.some((item: Role) => 
        item.libelle.trim().toLowerCase() === this.newRole.libelle?.trim().toLowerCase()
      );

      if (existe) {
        this.messageError = "Ce rôle existe déjà.";
        this.loading = false; 
        return;
      }

      // Création du rôle
      await this.roleService.createRole(this.newRole);
      this.notificationService.showSuccess(this.newRole.libelle + ' a été créé avec succès.');
      this.router.navigate(['/parametrage/roles']);
      
    } catch (error: any) {
      console.error('Erreur lors de la création du rôle:', error);
      this.messageError = error.error?.message || "Une erreur est survenue lors de l'enregistrement.";
      this.loading = false;
    }
  }
}
