import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'chats',
    loadChildren: () => import('./chats/chats.module').then( m => m.ChatsPageModule)
  },
  {
    path: 'messages/:id/:otherUserId',
    loadChildren: () => import('./chat-room/chat-room.module').then( m => m.ChatRoomPageModule)
  },
  {
    path: 'profil',
    loadChildren: () => import('./profil/profil.module').then( m => m.ProfilPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'group-chat-room/:group_id',
    loadChildren: () => import('./pages/group-chat-room/group-chat-room.module').then( m => m.GroupChatRoomPageModule)
  },
  {
    path: 'group-chat-room',
    loadChildren: () => import('./pages/group-chat-room/group-chat-room.module').then( m => m.GroupChatRoomPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
