import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-game',
  templateUrl: './create-game.component.html',
  styleUrls: ['./create-game.component.scss']
})
export class CreateGameComponent implements OnInit {
  gameForm = new FormGroup({
    gameName: new FormControl('Новая игра', Validators.minLength(4)),
    gamePlace: new FormControl('Новое место', Validators.minLength(4)),
    playersCount: new FormControl('3', Validators.required),
    createData: new FormControl(new Date())
  });

  constructor() { }

  get gameName() {
    return this.gameForm.get('gameName');
  }

  get gamePlace() {
    return this.gameForm.get('gamePlace');
  }

  get playersCount() {
    return this.gameForm.get('playersCount');
  }

  get createData() {
    return this.gameForm.get('createData').value;
  }

  ngOnInit(): void {
    console.log(this.gameForm.controls.createData.value);
  }

}
