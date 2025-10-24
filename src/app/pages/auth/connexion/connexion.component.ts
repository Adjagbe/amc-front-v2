import { Component } from '@angular/core';
import { UserService } from '../../../service/auth/user.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-connexion',
  imports: [CommonModule, FormsModule],
  templateUrl: './connexion.component.html',
  styleUrl: './connexion.component.css'
})
export class ConnexionComponent {

  pseudo = '';
  password = '';
  message = ''
  loading = false;

  constructor(private AuthService: UserService, private router: Router) { }

  async login() {

    if (this.pseudo != '' && this.password != '') {
      this.loading = true
      let data = {
        pseudo: this.pseudo,
        password: this.password
      }


      // await this.AuthService.login(data).then((response) => {
       
      //   if (response) {
      //     // this.message = 'Connexion réussie';
      //     this.loading = false;
      //     setTimeout(() => {
      //       this.AuthService.getUser();
      //       this.router.navigate(['/membres'])
      //     }, 1000);
      //   } else {
      //     this.loading = false;
      //     this.message = 'Erreur de connexion';
      //   }
      // })


      try {
        const response = await this.AuthService.login(data);
        if (response) {
          this.loading = false;
          setTimeout(() => {
            // this.AuthService.getUser();
            this.router.navigate(['/membres']);
          }, 1000);
        } 
      } catch (error) {
        this.loading = false;
        this.message = 'Pseudo ou mot de passe incorrect';
      }
      
    }
  }

  linkWhatsapp() {
    const link = document.createElement('a');
    link.href = 'https://wa.me/2250545245594?text=Bonjour%20j%27aimerais%20avoir%20des%20informations';
    link.target = '_blank';
    link.click();
  }


}
