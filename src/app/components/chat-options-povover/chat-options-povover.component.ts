import { Component, OnInit } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular';
import { IonIcon, IonItem, IonList } from "@ionic/angular/standalone";
import { SelectUserModalComponent } from '../select-user-modal/select-user-modal.component';

@Component({
  selector: 'app-chat-options-povover',
  templateUrl: './chat-options-povover.component.html',
  styleUrls: ['./chat-options-povover.component.scss'],
  standalone: false
})
export class ChatOptionsPovoverComponent  implements OnInit {

  constructor(
    private popoverCtrl: PopoverController,
    private modalCtrl: ModalController
  ) {}

  ngOnInit(): void {
    
  }

  async startNewConversation() {
    const modal = await this.modalCtrl.create({
      component: SelectUserModalComponent,
      componentProps: { mode: 'single' } // Mode simple conversation
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (!data) return;

    if (data.userId) {
      // cas mode single
      this.popoverCtrl.dismiss({ userId: data.userId });
    }

    if (data.groupUserIds) {
      // cas mode groupe
      this.popoverCtrl.dismiss({ groupUserIds: data.groupUserIds });
    }

  }

  async createNewGroup() {
    const modal = await this.modalCtrl.create({
      component: SelectUserModalComponent,
      componentProps: { mode: 'group' } // Mode groupe
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (!data) return;

    if (data.userId) {
      // cas mode single
      this.popoverCtrl.dismiss({ userId: data.userId });
    }

    if (data.groupUserIds) {
      // cas mode groupe
      this.popoverCtrl.dismiss({ groupUserIds: data.groupUserIds });
    }

  }

}
