import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GroupChatRoomPage } from './group-chat-room.page';

describe('GroupChatRoomPage', () => {
  let component: GroupChatRoomPage;
  let fixture: ComponentFixture<GroupChatRoomPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupChatRoomPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
