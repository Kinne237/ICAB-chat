import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserId: number | null = null;

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post('http://192.168.1.196/login.php', {
      username,
      password
    });
  }

  setCurrentUserId(id: number) {
    this.currentUserId = id;
    localStorage.setItem('user_id', id.toString());
  }

  getCurrentUserId(): number | null {
    if (this.currentUserId) return this.currentUserId;
    const stored = localStorage.getItem('user_id');
    return stored ? +stored : null;
  }

  logout() {
    this.currentUserId = null;
    localStorage.removeItem('user_id');
  }
}
