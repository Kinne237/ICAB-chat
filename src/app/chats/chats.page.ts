import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChatService, Conversation } from '../services/chat/chat.service';
import { AuthService } from '../services/auth/auth.service';
import { ModalController, PopoverController } from '@ionic/angular';
import { ChatOptionsPovoverComponent } from '../components/chat-options-povover/chat-options-povover.component';
import { User } from '../models/user';
import { UserService } from '../services/user/user.service';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.page.html',
  styleUrls: ['./chats.page.scss'],

  standalone: false
})
export class ChatsPage implements OnInit {

  chats: any[] = [];
  currentUserId = this.authService.getCurrentUserId();
  users: User[] = [];

  constructor(
    private chatService: ChatService, 
    private router: Router, 
    private authService:AuthService,
    private popoverCtrl: PopoverController, 
  ) {}

  ngOnInit() {
    const userId = this.authService.getCurrentUserId();
    if (userId !== null) {
      this.currentUserId = userId;
      this.loadConversations();
    } else {
      console.error("Utilisateur non connecté.");
      this.router.navigate(['/login']);
    }
    
    
  }
  startPrivateChat(otherUserId: number) {
    if (this.currentUserId === null) return;
    this.chatService.createConversation([this.currentUserId, otherUserId]).subscribe({
      next: (conversation) => {
        this.router.navigate(['/chat-room', conversation.id]);
      },
      error: (err) => {
        console.error('Erreur création conversation :', err);
      }
    });
  }
  
  createGroupChat(userIds: number[]) {
    const groupName = prompt('Nom du groupe :');
    if (!groupName) return;
    if (this.currentUserId === null) return;
    const participantIds = [this.currentUserId, ...userIds];
  
    this.chatService.createGroupConversation(participantIds, groupName).subscribe({
      next: (group) => {
        console.log('Groupe créé :', group); // <- Vérifie le contenu ici
        this.router.navigate(['/group-chat-room', group.group_id]);
      },
      error: (err) => {
        console.error('Erreur création groupe :', err);
      }
    });
  }
  

  loadConversations() {
    if (this.currentUserId === null) return;
  
    this.chatService.getConversations(this.currentUserId).subscribe({
      next: (data) => {
        this.chats = data;
        console.log('Chats reçus :', data);
      },
      error: (err) => {
        console.error('Erreur chargement des chats', err);
      }
    });
  }

  navigateToMessages(chat: any) {
    if (chat.type === 'group') {
      this.router.navigate(['/group-chat-room', chat.group_id]);
    } else {
      this.router.navigate(['/messages', chat.conversation_id, chat.other_user_id]);
    }
  }
 


  public navigateToProfil(){
    this.router.navigate(['profil']);
  }

  async openOptions(ev: any) {
    const popover = await this.popoverCtrl.create({
      component: ChatOptionsPovoverComponent,
      event: ev,
      translucent: true,
      showBackdrop: true
    });
  
    await popover.present();
  
    const { data } = await popover.onDidDismiss();
    if (!data) return;
  
    if (data.userId) {
      this.startPrivateChat(data.userId);
    }
  
    if (data.groupUserIds) {
      this.createGroupChat(data.groupUserIds);
    }
  }

  // chat-list.component.ts
formatLastMessageTime(datetime: string): string {
  const messageDate = new Date(datetime);
  const now = new Date();

  const isToday =
    messageDate.getDate() === now.getDate() &&
    messageDate.getMonth() === now.getMonth() &&
    messageDate.getFullYear() === now.getFullYear();

  if (isToday) {
    // Afficher l'heure au format HH:mm
    return messageDate.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  } else {
    // Afficher le jour de la semaine (ex: lundi)
    return messageDate.toLocaleDateString('fr-FR', {
      weekday: 'long',
    });
  }
}

  
}
