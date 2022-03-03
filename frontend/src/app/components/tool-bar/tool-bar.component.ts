import { Component, OnInit } from '@angular/core';
import { AstarService } from 'src/app/services/algorithmeA/astar.service';
import { DijlstraService } from 'src/app/services/dijkstra/dijlstra.service';
import { RightToolBarService } from 'src/app/services/rightToolBar/right-tool-bar.service';

@Component({
  selector: 'app-tool-bar',
  templateUrl: './tool-bar.component.html',
  styleUrls: ['./tool-bar.component.scss']
})
export class ToolBarComponent implements OnInit {

  constructor(public aStar: AstarService, public rightToolBarService: RightToolBarService, private dijkstra: DijlstraService) { }


  ngOnInit(): void {
  }

  reset() {
    this.aStar.bigReset();
  }

  setObstacles(event: any) {
    this.aStar.obstacles = event.value;
    this.reset();
  }

  setDijkstraObstacles(event: any) {
    this.dijkstra.nbDijkstraCell = event.value;
    this.dijkstra.reset();
  }


}
