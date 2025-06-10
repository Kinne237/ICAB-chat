import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ChatOptionsPovoverComponent } from './chat-options-povover.component';

describe('ChatOptionsPovoverComponent', () => {
  let component: ChatOptionsPovoverComponent;
  let fixture: ComponentFixture<ChatOptionsPovoverComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatOptionsPovoverComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ChatOptionsPovoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
