import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent } from '@ionic/angular';

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.page.html',
  styleUrls: ['./chat-room.page.scss'],

  standalone: false
})
export class ChatRoomPage implements OnInit {

  newMessage = '';
  isMultipleLine = false;
  @ViewChild ('chatBox') chatBox!: ElementRef<HTMLTextAreaElement>;
  @ViewChild ('chatContent') chatContent! : IonContent;


  constructor(private router: Router) { }

  ngOnInit() {
  }

  autoResize(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
    this.isMultipleLine = textarea.scrollHeight > textarea.clientHeight + 1;
  }

  scrollToBottom(){
    setTimeout(() => {
      this.chatContent.scrollToBottom(300);
    }, 100 );
  }

  messages = [
    { text: 'Salut', sender: 'other' },
    { text: 'Salut, inesse', sender: 'me' },
    { text: 'Tu peux venir ici aujourd’hui ?', sender: 'other' },
    { text: 'Oui, bien sûr mec', sender: 'me' },
    { text: 'Mais je vais venir avec mon chien', sender: 'me' },
    { text: 'Pas de souci, ça me dérange pas', sender: 'other' },
    { text: 'Parfait, à tout à l’heure.', sender: 'me' },
    { text: 'Oui... À bientôt.', sender: 'other' },
  ];

  sendMessage() {
    const message = this.newMessage.trim();
    if (!message) return;
    this.messages.push({ text: this.newMessage, sender: 'me' });
    this.newMessage = '';
    this.isMultipleLine = false;
    const textarea = this.chatBox.nativeElement;
    textarea.style.height = 'auto';
    this.scrollToBottom();
  }

  navigateToChatsList(){
    this.router.navigate(['chats']);
  }

}
