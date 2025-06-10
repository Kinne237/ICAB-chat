import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-select-user-modal',
  templateUrl: './select-user-modal.component.html',
  styleUrls: ['./select-user-modal.component.scss'],
  standalone: false
})
export class SelectUserModalComponent  implements OnInit {

  

  @Input() mode: 'single' | 'group' = 'single';
  users: User[] = [];
  currentUserId = this.authService.getCurrentUserId();

  selectedUserIds: number[] = [];

  constructor(
    private modalCtrl: ModalController,
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.userService.getUsers().subscribe({
      next: (res) => {
        this.users = res.filter(u => u.id !== this.currentUserId); // pour exclure l'utilisateur actuel
      },
      error: (err) => {
        console.error('Erreur lors du chargement des utilisateurs :', err);
      }
    });
  }

  navigateToMessages(conversationId: number, otherUserId: number) {
    this.router.navigate(['/messages', conversationId, otherUserId]);
  }

  toggleSelection(userId: number) {
    if (this.mode === 'single') {
      this.modalCtrl.dismiss({ userId });
    } else {
      if (this.selectedUserIds.includes(userId)) {
        this.selectedUserIds = this.selectedUserIds.filter(id => id !== userId);
      } else {
        this.selectedUserIds.push(userId);
      }
      console.log('Utilisateurs sélectionnés:', this.selectedUserIds);
    }
  }
  

  validateGroupCreation() {
    if (this.selectedUserIds.length > 1) {
      console.log('Validation groupe avec utilisateurs:', this.selectedUserIds);
      this.modalCtrl.dismiss({ groupUserIds: this.selectedUserIds });
    } else {
      console.warn('Sélection insuffisante d’utilisateurs pour créer un groupe');
    }
  }
  

  close() {
    this.modalCtrl.dismiss();
  }
}
