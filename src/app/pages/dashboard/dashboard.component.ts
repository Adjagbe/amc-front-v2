import { Component } from '@angular/core';
import { Membres } from '../../models/membres';
import { MembresService } from '../../service/membres.service';
import { DepartementsService } from '../../service/departements/departements.service';
import { CardsComponent } from "../../shared/components/cards/cards.component";

@Component({
  selector: 'app-dashboard',
  imports: [CardsComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  membres: any[] = []
  totalMembres: number = 0
  departement! : any[]
  totalDepartement : number = 0

  constructor( private membreService : MembresService, private departementService : DepartementsService ){}


  ngOnInit(){
    this.countMembre();
    this.countDepartement();
  }

  countMembre(){
    this.membreService.getallMembre().then((data) => {
      this.membres = data;
      // console.log(this.membres);
      this.totalMembres = this.membres.length;
    });
  }

  countDepartement(){
    this.departementService.getAllDepartements().then((data) => {
      this.departement = data;
      this.totalDepartement = this.departement.length
    })
  }

}
