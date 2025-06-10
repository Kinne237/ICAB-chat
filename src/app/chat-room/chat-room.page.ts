import { Component, ElementRef, OnInit, ViewChild, AfterViewInit, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonContent } from '@ionic/angular';
import { WebsocketService } from '../services/websocket.service';
import { AuthService } from '../services/auth/auth.service';
import { ChatRoomService } from '../services/chat-room/chat-room.service';
import { UserService } from '../services/user/user.service';
import { format, isToday, isYesterday } from 'date-fns';
import fr from 'date-fns/locale/fr';


@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.page.html',
  styleUrls: ['./chat-room.page.scss'],
  standalone: false
})
export class ChatRoomPage implements OnInit, AfterViewInit {

  newMessage = '';
  isMultipleLine = false;
  messages: { text: string; sender: 'me' | 'other'; created_at: string }[] = [];

  userId: number | null = null;
  otherUserId!: number;
  conversationId!: number;
  currentGroupId!: number;
  otherUserName: string = '';
  isOnline: boolean = false;
  groupedMessages: any[] = [];

  @ViewChild('chatBox') chatBox!: ElementRef<HTMLTextAreaElement>;
  @ViewChild('chatContent') chatContent!: IonContent;

  constructor(
    private router: Router, 
    private ws: WebsocketService, 
    private authService: AuthService,
    private route: ActivatedRoute,
    private chatRoomService: ChatRoomService,
    private zone: NgZone,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.userId = this.authService.getCurrentUserId();
    this.conversationId = Number(this.route.snapshot.paramMap.get('id'));
    this.otherUserId = Number(this.route.snapshot.paramMap.get('otherUserId'));

    if (!this.userId || !this.conversationId || !this.otherUserId) {
      console.error('Identifiants manquants');
      return;
    }
  
    this.ws.connect('ws://192.168.1.196:8080');
    
    setTimeout(() => {
      if(this.userId !== null){
        this.ws.authenticate(this.userId);
      }
    }, 300);

    this.ws.onUserStatus().subscribe((msg) => {
      if (msg.userId === this.otherUserId) {
        this.zone.run(() => {
          this.isOnline = msg.online;
        });
      }
    });

    this.setupListeners();

    this.userService.getUserById(this.otherUserId).subscribe({
      next: (user) => this.otherUserName = user.username,
      error: (err) => console.error('Erreur chargement utilisateur', err)
    });
    //this.groupMessagesByDate();
    this.loadOldMessages();
  }
  

  setupListeners() {
    this.ws.onPrivateMessage().subscribe((msg) => {
      console.log('Message reçu WebSocket :', msg);
      
      if (msg.type === 'message' && msg.conversation_id === this.conversationId) {
        this.zone.run(() => {
          this.messages.push({
            text: msg.message,
            sender: Number(msg.from) === Number(this.userId) ? 'me' : 'other',
            created_at: msg.created_at
          });
          this.scrollToBottom();
        });
      }
    });
  }

  loadOldMessages() {
    this.chatRoomService.getMessages(this.conversationId).subscribe({
      next: (data) => {
        console.log('Réponse brute :', data);
        const parsed = typeof data === 'string' ? JSON.parse(data) : data;
        this.messages = parsed.map((msg: any) => ({
          text: msg.message,
          sender: Number(msg.sender_id) === Number(this.userId) ? 'me' : 'other',
          created_at: msg.created_at
        }));
        console.log('Messages formatés :', this.messages);
        this.groupMessagesByDate();
        console.log('Utilisateur actuel :', this.userId);
        this.scrollToBottom();
      },
      error: (err) => {
        console.error('Erreur chargement messages', err);
      }
    });
  }
  

  ngAfterViewInit() {
    this.scrollToBottom();
  }

  sendMessage() {
    const message = this.newMessage.trim();
    if (!message || !this.userId) return;
  
    const data = {
      type: 'message',
      from: this.userId,
      to: this.otherUserId,
      conversation_id: this.conversationId,
      message: message
    };
  
    this.ws.send(data);
  
    this.ws.sendMessageToDb({
      conversation_id: this.conversationId,
      sender_id: this.userId,
      message: message
    }).subscribe({
      next: (res) => console.log('Message enregistré', res),
      error: (err) => console.error('Erreur lors de l\'enregistrement', err)
    });
  
    this.newMessage = '';
    this.isMultipleLine = false;
    this.chatBox.nativeElement.style.height = 'auto';
    this.scrollToBottom();
  }
  

  autoResize(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
    this.isMultipleLine = textarea.scrollHeight > textarea.clientHeight + 1;
  }

  scrollToBottom() {
    setTimeout(() => {
      this.chatContent.scrollToBottom(300);
    }, 100);
  }

  navigateToChatsList() {
    this.router.navigate(['chats']);
  }

  groupMessagesByDate() {
    const groups: { [key: string]: any[] } = {};
  
    for (const msg of this.messages) {
      const date = new Date(msg.created_at); // adapte selon ton champ
      const dateKey = format(date, 'yyyy-MM-dd'); // clé de regroupement
  
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
  
      groups[dateKey].push(msg);
    }
  
    this.groupedMessages = Object.entries(groups)
      .sort(([a], [b]) => a.localeCompare(b)) // tri chronologique
      .map(([dateKey, msgs]) => {
        const date = new Date(dateKey);
        let label = format(date, 'EEEE', { locale: fr }); // par défaut : lundi, mardi...
  
        if (isToday(date)) label = "Aujourd'hui";
        else if (isYesterday(date)) label = "Hier";
        else if (date.getFullYear() !== new Date().getFullYear()) {
          label = format(date, 'dd MMM yyyy', { locale: fr });
        }
  
        return { label, messages: msgs };
      });
      console.log('Grouped messages:', this.groupedMessages);
  }
}
