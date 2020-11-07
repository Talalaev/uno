import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-game',
  templateUrl: './create-game.component.html',
  styleUrls: ['./create-game.component.scss']
})
export class CreateGameComponent implements OnInit {
  gameForm = new FormGroup({
    gameName: new FormControl('Первая', Validators.minLength(4)),
    playerName: new FormControl('Миша', Validators.minLength(4)),
    createData: new FormControl(new Date())
  });

  constructor() { }

  get gameName() {
    return this.gameForm.get('gameName');
  }

  get playerName() {
    return this.gameForm.get('playerName');
  }

  get createData() {
    return this.gameForm.get('createData').value;
  }

  ngOnInit(): void {
    console.log(this.gameForm.controls.createData.value);
  }

}
