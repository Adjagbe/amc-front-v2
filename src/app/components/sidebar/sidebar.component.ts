import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { DepartementsService } from '../../service/departements/departements.service';
import { Departements } from '../../models/departements/departements';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterModule, RouterLinkActive, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

  view = false;
  // isExpanded = false;
  expanded: { [key: string]: boolean } = {};

  departements!: Departements[]


  constructor(private departService : DepartementsService) {
    const session = localStorage.getItem('session');
    if (session){
      const role = JSON.parse(session).as_js.acces.libelle;
      if (role === 'super administrateur') {
        this.view = true 
      }
    }
  }

  ngOnInit(){
    this.getDepartement()
  }

  getDepartement(){

    this.departService.getAllDepartements().then((data) => {
      this.departements = data
    })
  }

  
  // toggleDropdown() {
  //   this.isExpanded = !this.isExpanded;
  // }



  toggleDropdown(key: string): void {
    this.expanded[key] = !this.expanded[key];
  }
}
