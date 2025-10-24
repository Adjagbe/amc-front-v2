import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Membres } from '../../models/membres';
import { MembresService } from '../../service/membres.service';
import { NotificationService } from '../../service/notification/notification.service';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import { PaginationComponent } from '../../components/pagination/pagination.component';

@Component({
  selector: 'app-membres',
  imports: [ CommonModule,
    RouterLink, 
    RouterModule, 
    FormsModule,
    PaginationComponent],
  templateUrl: './membres.component.html',
  styleUrl: './membres.component.css'
})
export class MembresComponent {

  membres!:Membres[];

  filter: String = '';
  page = 1;
  pageSize = 8;
  collectionSize: number = 0;
  start: number = 0;
  end: number = 0;
  take: number = 0;
  dataFilter: Membres[] = [];
  allData: Membres[] = [];

  loading=true;

  searchTerm: string = '';

  constructor(
    private membreService: MembresService,
    private notificationService: NotificationService
  ){}

  ngOnInit(){

    // this.membreService.getallMembre().then((data)=> {
    //   this.allData = data;
    //   this.dataFilter = data
    //   this.refresh();
    //   this.collectionSize = this.allData.length;
    //   this.loading = false;
    // })

    this.loadPagination()
  }



  loadPagination(){
    this.searchTerm = (this.searchTerm.length > 2) ? this.searchTerm : ''
    this.membreService.getPaginateMembre(this.page, this.pageSize, this.searchTerm).then((response:any) => {
      this.membres = response.data;
      this.collectionSize = response.total;
      this.start = response.from
      this.end = response.to
      this.take = this.start + this.membres.length;

    }).catch(() => console.log('Erreur de recupération !', 'Oops'))
      .finally(() => { this.loading = false });
  }

  refresh() {
    // this.start = (this.page - 1) * this.pageSize;
    // this.end = this.start + this.pageSize;
    // this.membres = this.dataFilter.map((cours, i) => ({ ...cours }))
    //   .slice(this.start, this.end);
    // this.take = this.start + this.membres.length;
  }

  onPageChange(newPage: number) {
    this.page = newPage;
    // this.refresh();
    this.loadPagination()
  }

  search(event: any) {

    // this.dataFilter = this.allData.filter((plane) => {
    //   const term = event.target.value.toLowerCase();
    //   return (
    //     plane.nom.toLowerCase().includes(term) ||
    //     plane.prenom.toLowerCase().includes(term) ||
    //     plane.portable.toLowerCase().includes(term)||
    //     plane.adresse.toLowerCase().includes(term) 
    //   );
    // });
    // this.collectionSize = this.dataFilter.length;

    if (event.target.value.length > 2 || event.target.value == '') {
      this.loading = true;
      this.searchTerm = event.target.value.toLowerCase();
      this.page = 1;
      this.loadPagination();
    }

    this.refresh();
  }

  /**
   * Supprime un membre avec confirmation
   * @param membre Le membre à supprimer
   */
  async deleteMembre(membre: Membres) {
    // Confirmation de suppression
    const confirmDelete = await this.notificationService.confirmDelete(
      `Êtes-vous sûr de vouloir supprimer le membre <b>${membre.nom} ${membre.prenom}</b> ?\n\nCette action est irréversible.`
    );

    if (!confirmDelete) {
      return;
    }

    try {
      this.loading = true; // Afficher le loader
      
      // Appel du service de suppression
      const response = await this.membreService.deleteMembre(membre.id);
      this.searchTerm = '';
      this.loadPagination();
      // Afficher le message de succès
      this.notificationService.showSuccess(response.message);
      

    } catch (error: any) {
      console.error('Erreur lors de la suppression:', error);
      
      // Afficher le message d'erreur
      const errorMessage = error.error?.message || 'Erreur lors de la suppression du membre';
      this.notificationService.showError(errorMessage);
      
      this.loading = false;
    }
  }


}
