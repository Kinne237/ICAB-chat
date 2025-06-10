import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage {

  username = '';
  password = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    if (!this.username || !this.password) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    this.authService.login(this.username, this.password).subscribe({
      next: (response) => {
        console.log('Réponse du serveur :', response);
        if (response.success && response.user_id) {
          this.authService.setCurrentUserId(response.user_id);
          this.router.navigate(['/chats']);
        } else {
          console.error('Échec de connexion');
        }
      },
      error: (err) => {
        console.error('Erreur lors de la connexion', err);
      }
    });

  }

}
