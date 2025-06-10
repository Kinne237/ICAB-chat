import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  apiUrl = 'http://192.168.1.196/api/get_users.php';
  constructor(private http: HttpClient) { }
  getUserById(id: number): Observable<{ id: number, username: string}> {
    return this.http.get<{ id: number, username: string}>(`http://192.168.1.196/api/get_user.php?id=${id}`);
  }
  
  getUsers() {
    return this.http.get<User[]>(`${this.apiUrl}/get_users.php`);
  }
  
}
