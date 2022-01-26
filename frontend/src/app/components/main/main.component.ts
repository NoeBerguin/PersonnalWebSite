import { Component, OnInit } from '@angular/core';
import { RightToolBarService } from 'src/app/services/rightToolBar/right-tool-bar.service';



@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  constructor(public rightToolBarService: RightToolBarService) { }

  ngOnInit(): void { }

}
