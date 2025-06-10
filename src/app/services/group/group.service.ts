import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Group } from 'src/app/models/group';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  constructor(private http: HttpClient) {}

  createGroup(group: Group) {
    return this.http.post<{ status: string; group_id: number }>(
      'http://192.168.1.196/api/create_group.php',
      group
    );
  }
}
