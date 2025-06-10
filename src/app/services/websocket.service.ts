import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private socket: WebSocket | null = null;
  private userId: number | null = null;
  private groupMessageSubject = new Subject<any>();
  private privateMessageSubject = new Subject<any>();
  private statusSubject = new Subject<any>();


  constructor(private http: HttpClient){}

  connect(url: string = 'ws://192.168.1.196:8080'): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) return;
  
    this.socket = new WebSocket(url);
  
    this.socket.onopen = () => {
      console.log('✅ WebSocket connecté');
      if (this.userId) this.sendAuth(this.userId);
    };
  
    this.socket.onmessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
  
        // Dispatch vers les bons Observables
        if (data.type === 'message') {
          this.privateMessageSubject.next(data);
        } else if (data.type === 'group_message') {
          this.groupMessageSubject.next(data);
        } else if (data.type === 'status') {
          this.statusSubject.next(data);
        }
  
      } catch (err) {
        console.error('Erreur JSON reçu WebSocket :', err);
      }
    };
  }


  authenticate(userId: number): void {
    this.userId = userId;
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.sendAuth(userId);
    }
  }

  private sendAuth(userId:number) {
    const authMsg = { type: 'auth', userId };
    this.send(authMsg);
  }


  sendMessageToDb(messageData: { conversation_id: number; sender_id: number; message: string }) {
    return this.http.post('http://192.168.1.196/api/send_message.php', messageData);
  }
  

  send(data: any): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(data));
    } else {
      console.warn('⚠️ WebSocket non prêt. Données non envoyées.');
    }
  }

  public onGroupMessage(): Observable<any> {
    return this.groupMessageSubject.asObservable();
  }
  onPrivateMessage(): Observable<any> {
    return this.privateMessageSubject.asObservable();
  }
  
  onUserStatus(): Observable<any> {
    return this.statusSubject.asObservable();
  }

  listen(callback?: (data: any) => void): void {
    if (!this.socket) return;
  
    this.socket.onmessage = (event: MessageEvent) => {
      try {
        const receivedData = JSON.parse(event.data);
  
        if (receivedData.type === 'group_message') {
          this.groupMessageSubject.next(receivedData);
        } else if (callback) {
          callback(receivedData);
        } else {
          console.log('Message reçu non géré:', receivedData);
        }
      } catch (err) {
        console.error('Erreur de parsing JSON reçu', err);
      }
    };
  }
  

  close(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
  }

  sendGroupMessageToDb(data: { group_id: number; sender_id: number; message: string }) {
    return this.http.post('http://192.168.1.196/api/send_group_message.php', data);
  }

  sendGroupMessage(group_id: number, from: number, message: string) {
    const payload = {
      type: 'group_message',
      group_id,
      from,
      message
    };
    this.send(payload);
  }
}
