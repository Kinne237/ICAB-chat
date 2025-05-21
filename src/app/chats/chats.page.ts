import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.page.html',
  styleUrls: ['./chats.page.scss'],

  standalone: false
})
export class ChatsPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  public navigateToMessages(){
    this.router.navigate(['chat-room']);
  }

  public navigateToProfil(){
    this.router.navigate(['profil']);
  }

  chats = [
    {
      name: 'Quentin',
      message: 'How are you?',
      time: 'Just now',
      avatar: 'https://cdn-icons-png.flaticon.com/512/847/847969.png',
      status: ''
    },
    {
      name: 'Ariane',
      message: 'Will you come to the party on saturd...',
      time: '30 mins ago',
      avatar: 'https://cdn-icons-png.flaticon.com/512/847/847969.png',
      status: '✓✓'
    },
    {
      name: 'Dolvine',
      message: 'Wanna go outside someday?',
      time: '10:22 AM',
      avatar: 'https://cdn-icons-png.flaticon.com/512/847/847969.png',
      status: '✓✓'
    },
    {
      name: 'Ariane',
      message: 'Typing...',
      time: '12:30 AM',
      avatar: 'https://cdn-icons-png.flaticon.com/512/847/847969.png',
      status: '✓✓'
    }
    // etc...
  ];

}
