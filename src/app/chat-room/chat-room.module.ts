import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChatRoomPageRoutingModule } from './chat-room-routing.module';

import { ChatRoomPage } from './chat-room.page';
import { WebsocketService } from '../services/websocket.service';
import { AuthService } from '../services/auth/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { ChatRoomService } from '../services/chat-room/chat-room.service';
import { UserService } from '../services/user/user.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChatRoomPageRoutingModule,
    HttpClientModule
  ],
  declarations: [ChatRoomPage],
  providers: [WebsocketService, AuthService, ChatRoomService, UserService],
})
export class ChatRoomPageModule {}
