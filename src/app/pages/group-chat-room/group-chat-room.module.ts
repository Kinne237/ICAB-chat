import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GroupChatRoomPageRoutingModule } from './group-chat-room-routing.module';

import { GroupChatRoomPage } from './group-chat-room.page';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ChatService } from 'src/app/services/chat/chat.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { WebsocketService } from 'src/app/services/websocket.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GroupChatRoomPageRoutingModule,
    HttpClientModule
  ],
  declarations: [GroupChatRoomPage],
  providers: [AuthService, ChatService, WebsocketService]
})
export class GroupChatRoomPageModule {}
