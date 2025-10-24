import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { Fonctionnalite } from '../../../../models/fonctionnalite';
import { FonctionnalitesService } from '../../../../service/fonctionnalites/fonctionnalites.service';
import { NotificationService } from '../../../../service/notification/notification.service';

@Component({
  selector: 'app-ajouter',
  imports: [RouterLink, RouterModule, CommonModule, FormsModule],
  templateUrl: './ajouter.component.html',
  styleUrl: './ajouter.component.css'
})
export class AjouterComponent implements OnInit {

  newFonctionnalite: Partial<Fonctionnalite> = {
    libelle: '',
    code: ''
  };
  
  loading = false;
  messageError: string = '';

  constructor(
    private fonctionnaliteService: FonctionnalitesService, 
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
  }

  async createFonctionnalite() {
    this.loading = true;
    this.messageError = '';

    try {
      const foncsExistantes = await this.fonctionnaliteService.getAllFonctionnalites();
      const existe = foncsExistantes.some((item: Fonctionnalite) => 
        item.code.trim().toLowerCase() === this.newFonctionnalite.code?.trim().toLowerCase()
      );

      if (existe) {
        this.messageError = "Ce code existe déjà.";
        this.loading = false; 
        return;
      }

      await this.fonctionnaliteService.createFonctionnalite(this.newFonctionnalite);
      this.notificationService.showSuccess(this.newFonctionnalite.libelle + ' a été créée avec succès.');
      this.router.navigate(['/parametrage/fonctionnalites']);
      
    } catch (error: any) {
      console.error('Erreur lors de la création:', error);
      this.messageError = error.error?.message || "Une erreur est survenue lors de l'enregistrement.";
      this.loading = false;
    }
  }
}
