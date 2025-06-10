import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GroupChatRoomPage } from './group-chat-room.page';

const routes: Routes = [
  {
    path: '',
    component: GroupChatRoomPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GroupChatRoomPageRoutingModule {}
