import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DijlstraService } from 'src/app/services/dijkstra/dijlstra.service';
import { RightToolBarService } from 'src/app/services/rightToolBar/right-tool-bar.service';

@Component({
  selector: 'app-dijkstra',
  templateUrl: './dijkstra.component.html',
  styleUrls: ['./dijkstra.component.scss']
})
export class DijkstraComponent implements OnInit {
  @ViewChild('myCanvas', { static: false }) myCanvas: ElementRef;

  public ctx: CanvasRenderingContext2D;

  constructor(public rightToolBarService: RightToolBarService, private dijkstra: DijlstraService) { }

  ngOnInit(): void {
    this.rightToolBarService.open = true;
    this.rightToolBarService.display = 'block';
    this.rightToolBarService.width = 'calc(90% - 78px)';
    this.rightToolBarService.mode = 1;
  }

  ngAfterViewInit(): void {
    this.ctx = this.myCanvas.nativeElement.getContext('2d');
    this.ctx.canvas.width = window.innerWidth * 0.75;
    this.ctx.canvas.height = window.innerHeight * 0.99;
    this.dijkstra.setCanvas(this.ctx);

  }

  mouseClick(event: MouseEvent): void {
    this.dijkstra.mouseClick(event);
  }

}
