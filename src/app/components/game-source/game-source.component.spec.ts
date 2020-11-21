import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameSourceComponent } from './game-source.component';

describe('GameSourceComponent', () => {
  let component: GameSourceComponent;
  let fixture: ComponentFixture<GameSourceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GameSourceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GameSourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
