import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RolesService } from '../../../../service/roles/roles.service';
import { Role } from '../../../../models/fonctionnalite';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NotificationService } from '../../../../service/notification/notification.service';

@Component({
  selector: 'app-modifier',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './modifier.component.html',
  styleUrl: './modifier.component.css'
})
export class ModifierComponent implements OnInit {

  id!: any;
  showRole: Partial<Role> = {
    id: 0,
    libelle: '',
    fonctionnalites: []
  };
  messageError = '';
  loading = false;

  constructor(
    private roleService: RolesService, 
    private route: ActivatedRoute, 
    private router: Router,
    private notificationService: NotificationService
  ) {}

  async ngOnInit(): Promise<void> {
    this.id = this.route.snapshot.paramMap.get('id');
    
    try {
      this.loading = true;
      // Charger les données du rôle
      this.showRole = await this.roleService.getRole(this.id);
      this.loading = false;
    } catch (error) {
      console.error('Erreur lors du chargement du rôle:', error);
      this.messageError = "Impossible de charger le rôle.";
      this.loading = false;
    }
  }

  async updateRole() {
    this.loading = true;
    this.messageError = '';

    try {
      await this.roleService.updateRole(this.id, this.showRole);
      this.notificationService.showSuccess(this.showRole.libelle + ' a été mis à jour avec succès.');
      this.router.navigate(['/parametrage/roles']);
    } catch (error: any) {
      console.error('Erreur lors de la mise à jour du rôle:', error);
      this.messageError = error.error?.message || "Une erreur est survenue lors de la mise à jour.";
      this.loading = false;
    }
  }
}
