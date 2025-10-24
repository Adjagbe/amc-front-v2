import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FonctionnalitesService } from '../../../../service/fonctionnalites/fonctionnalites.service';
import { Fonctionnalite } from '../../../../models/fonctionnalite';
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
  showFonctionnalite: Partial<Fonctionnalite> = {
    id: 0,
    libelle: '',
    code: ''
  };
  messageError = '';
  loading = false;

  constructor(
    private fonctionnaliteService: FonctionnalitesService, 
    private route: ActivatedRoute, 
    private router: Router,
    private notificationService: NotificationService
  ) {}

  async ngOnInit(): Promise<void> {
    this.id = this.route.snapshot.paramMap.get('id');
    
    try {
      this.loading = true;
      this.showFonctionnalite = await this.fonctionnaliteService.getFonctionnalite(this.id);
      this.loading = false;
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
      this.messageError = "Impossible de charger la fonctionnalité.";
      this.loading = false;
    }
  }

  async updateFonctionnalite() {
    this.loading = true;
    this.messageError = '';

    try {
      await this.fonctionnaliteService.updateFonctionnalite(this.id, this.showFonctionnalite);
      this.notificationService.showSuccess(this.showFonctionnalite.libelle + ' a été mise à jour avec succès.');
      this.router.navigate(['/parametrage/fonctionnalites']);
    } catch (error: any) {
      console.error('Erreur lors de la mise à jour:', error);
      this.messageError = error.error?.message || "Une erreur est survenue lors de la mise à jour.";
      this.loading = false;
    }
  }
}
