import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ChatService } from 'src/app/services/chat/chat.service';
import { WebsocketService } from 'src/app/services/websocket.service';


@Component({
  selector: 'app-group-chat-room',
  templateUrl: './group-chat-room.page.html',
  styleUrls: ['./group-chat-room.page.scss'],
  standalone: false
})
export class GroupChatRoomPage implements OnInit {
  @ViewChild('chatContent') chatContent!: ElementRef;

  groupId!: number;
  groupName: string = '';
  groupMembers: any[] = [];
  messages: any[] = [];
  newMessage: string = '';
  currentUserId: number | null = null;
  isMultipleLine = false;
  sender_id!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private chatService: ChatService,
    private authService: AuthService,
    private websocketService: WebsocketService,
    private zone: NgZone
  ) {}

  ngOnInit() {
    this.currentUserId = this.authService.getCurrentUserId();
    const groupIdParam = Number(this.route.snapshot.paramMap.get('group_id'));
    
    if (!groupIdParam) {
      console.error('Group ID manquant');
      this.router.navigate(['/chats']); // Redirection sécurisée
      return;
    }

    this.groupId = Number(groupIdParam);
    console.log('Composant chargé, groupId =', this.groupId);

    this.loadGroupInfo();

    this.websocketService.connect('ws://192.168.1.196:8080');

    setTimeout(() => {
      if (this.currentUserId !== null) {
        this.websocketService.authenticate(this.currentUserId);
      }
    }, 300);

    this.setupListeners();
  }

  setupListeners() {
    this.websocketService.onGroupMessage().subscribe((msg) => {
      console.log('[WebSocket groupe] Reçu :', msg);
      if (msg.type === 'group_message' && Number(msg.group_id) === Number(this.groupId)) {
        this.zone.run(() => {
          this.messages.push({
            text: msg.message,
            sender: Number(msg.from) === Number(this.currentUserId) ? 'me' : 'other',
            from: msg.from
          });
          this.scrollToBottom();
        });
        
      }
    });
  }

  loadGroupInfo() {
    this.chatService.getGroupInfo(this.groupId).subscribe({
      next: (groupData) => {
        console.log('GroupData reçu :', groupData);
        this.groupName = groupData.name;
        this.groupMembers = groupData.members; 
        this.loadMessages();
      },
      error: (err) => {
        console.error('Erreur chargement groupe :', err);
      }
    });
  }

  loadMessages() {
    this.chatService.getGroupMessages(this.groupId).subscribe({
      next: (msgs) => {
        this.messages = msgs.map((msg: any) => ({
          text: msg.message,
          sender: Number(msg.sender_id) === Number(this.currentUserId) ? 'me' : 'other',
          from: msg.sender_id
        }));
        setTimeout(() => this.scrollToBottom(), 100);
      },
      error: (err) => {
        console.error('Erreur chargement messages :', err);
      }
    });
  }

  sendMessage() {
    if (this.groupId && this.currentUserId) {
    const message = this.newMessage.trim();
    if (!message) return;

    const msgData = {
      group_id: this.groupId,
      sender_id: this.currentUserId,
      message
    };

    this.websocketService.sendGroupMessageToDb(msgData).subscribe({
      next: () => {
        if (this.currentUserId)
        this.websocketService.sendGroupMessage(this.groupId, this.currentUserId, message);

        this.newMessage = '';
      },
      error: (err) => console.error('Erreur DB:', err)
    });
  }
}

  

  getUserName(userId: number): string {
    const user = this.groupMembers.find(m => m.id === userId);
    return user ? user.username : 'Inconnu';
  }

  autoResize(event: Event) {
    const target = event.target as HTMLTextAreaElement;
    this.isMultipleLine = target.scrollHeight > 40;
  }

  scrollToBottom() {
    if (this.chatContent && this.chatContent.nativeElement) {
      const el = this.chatContent.nativeElement as HTMLElement;
      el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    }
  }

  navigateToChatsList() {
    this.router.navigate(['/chats']);
  }
}
