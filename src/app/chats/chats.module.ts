import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChatsPageRoutingModule } from './chats-routing.module';

import { ChatsPage } from './chats.page';
import { ChatService } from '../services/chat/chat.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AuthService } from '../services/auth/auth.service';
import { ChatOptionsPovoverComponent } from '../components/chat-options-povover/chat-options-povover.component';
import { SelectUserModalComponent } from '../components/select-user-modal/select-user-modal.component';
import { UserService } from '../services/user/user.service';
import { GroupChatRoomPage } from '../pages/group-chat-room/group-chat-room.page';
import { GroupChatRoomPageModule } from '../pages/group-chat-room/group-chat-room.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChatsPageRoutingModule,
    HttpClientModule,
    GroupChatRoomPageModule
  ],
  declarations: [ChatsPage, ChatOptionsPovoverComponent, SelectUserModalComponent],
  providers: [ChatService, AuthService, UserService]
})
export class ChatsPageModule {}
