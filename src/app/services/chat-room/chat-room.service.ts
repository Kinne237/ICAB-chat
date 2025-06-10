import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatRoomService {

  constructor(private http: HttpClient) { }
  getMessages(conversationId: number): Observable<any> {
    return this.http.get(`http://192.168.1.196/api/get_messages.php?conversation_id=${conversationId}`);
  }
  
}
