import { CommonModule } from '@angular/common';
import { Component, OnInit, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RolesService } from '../../../../service/roles/roles.service';
import { FonctionnalitesService } from '../../../../service/fonctionnalites/fonctionnalites.service';
import { Role, Fonctionnalite } from '../../../../models/fonctionnalite';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NotificationService } from '../../../../service/notification/notification.service';

@Component({
  selector: 'app-permissions',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './permissions.component.html',
  styleUrl: './permissions.component.css'
})
export class PermissionsComponent implements OnInit {

  id!: any;
  role: Role | null = null;
  fonctionnalites: Fonctionnalite[] = [];
  selectedFonctionnalites: number[] = [];
  
  messageError = '';
  loading = false;

  constructor(
    private roleService: RolesService,
    private fonctionnalitesService: FonctionnalitesService,
    private route: ActivatedRoute, 
    private router: Router,
    private notificationService: NotificationService
  ) {}

  async ngOnInit(): Promise<void> {
    this.id = this.route.snapshot.paramMap.get('id');
    await this.loadData();
  }

  async loadData() {
    this.loading = true;
    try {
      // Charger le rôle
      this.role = await this.roleService.getRole(this.id);
      
      // Charger toutes les fonctionnalités
      this.fonctionnalites = await this.fonctionnalitesService.getAllFonctionnalites();
      
      // Initialiser les permissions sélectionnées
      this.selectedFonctionnalites = this.role.fonctionnalites?.map(f => 
        typeof f === 'number' ? f : f.id!
      ) || [];
      
      this.loading = false;
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      this.messageError = "Impossible de charger les données.";
      this.loading = false;
    }
  }

  toggleFonctionnalite(fonctionnaliteId: number) {
    const index = this.selectedFonctionnalites.indexOf(fonctionnaliteId);
    if (index > -1) {
      this.selectedFonctionnalites.splice(index, 1);
    } else {
      this.selectedFonctionnalites.push(fonctionnaliteId);
    }
  }

  isFonctionnaliteSelected(fonctionnaliteId: number): boolean {
    return this.selectedFonctionnalites.includes(fonctionnaliteId);
  }

  async savePermissions() {
    if (!this.role) return;

    this.loading = true;
    this.messageError = '';

    try {
      await this.roleService.assignFonctionnalites(this.role.id!, this.selectedFonctionnalites);
      this.notificationService.showSuccess('Permissions mises à jour avec succès pour ' + this.role.libelle);
      this.router.navigate(['/parametrage/roles']);
    } catch (error: any) {
      console.error('Erreur lors de la sauvegarde:', error);
      this.messageError = error.error?.message || 'Erreur lors de la sauvegarde des permissions';
      this.loading = false;
    }
  }
}
