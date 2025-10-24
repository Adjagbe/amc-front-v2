import { Component, Input } from '@angular/core';
import { NgClass } from "@angular/common";

@Component({
  selector: 'app-cards',
  imports: [NgClass],
  templateUrl: './cards.component.html',
  styleUrl: './cards.component.css'
})
export class CardsComponent {

  @Input() title: string = ''
  @Input() count: number = 0
  @Input() iconClass!: string;   // <- on récupère la classe de l’icône
  @Input() bgClass: string = 'bg-blue-100 text-blue-600'; // <- optionnel pour la couleur du rond

}
