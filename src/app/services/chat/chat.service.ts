import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Conversation {
  conversation_id: number;
  other_user_id: number;
  other_user_name: string;
  last_message: string;
  last_message_time: string;
}


@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiUrl = 'http://192.168.1.196/api';

  constructor(private http: HttpClient) {}

  getConversations(userId: number) {
    return this.http.get<Conversation[]>(`${this.apiUrl}/get_conversations.php?user_id=${userId}`);
  }

  createConversation(participantIds: number[]) {
    return this.http.post<any>(`${this.apiUrl}/create_ conversation.php`, {
      participants: participantIds
    });
  }

  createGroupConversation(participantIds: number[], groupName: string) {
    return this.http.post<any>(`${this.apiUrl}/create_group.php`, {
      participants: participantIds,
      name: groupName
    });
  }

  /** Récupère les messages d’un groupe */
  getGroupMessages(groupId: number): Observable<any[]> {
    const params = new HttpParams().set('group_id', groupId.toString());
    return this.http.get<any[]>(`${this.apiUrl}/get_group_messages.php`, { params });
  }

  getGroupInfo(groupId: number): Observable<{ name: string, members: { id: number, username: string }[] }> {
    return this.http.get<{ name: string, members: { id: number, username: string }[] }>(
      `http://192.168.1.196/api/get_group_info.php?group_id=${groupId}`
    );
  }
  

  /** Envoie un message dans un groupe */
  sendGroupMessage(groupId: number, senderId: number, message: string): Observable<any> {
    const body = { group_id: groupId, sender_id: senderId, text: message };
    return this.http.post<any>(`${this.apiUrl}send_group_message.php`, body);
  }
  
}
