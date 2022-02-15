import { Component, ViewChild, ElementRef, AfterViewInit, OnInit } from '@angular/core';
import { empty } from 'rxjs';
import { AstarService, Output, Node } from 'src/app/services/algorithmeA/astar.service';
import { RightToolBarService } from 'src/app/services/rightToolBar/right-tool-bar.service';


@Component({
  selector: 'app-algorithme',
  templateUrl: './algorithme.component.html',
  styleUrls: ['./algorithme.component.scss'],
  host: {
    id: 'Astar'
  }
})
export class AlgorithmeComponent implements OnInit {
  @ViewChild('myCanvas', { static: false }) myCanvas: ElementRef;

  public ctx: CanvasRenderingContext2D;

  constructor(private Astar: AstarService, public rightToolBarService: RightToolBarService) { }

  ngOnInit(): void {
    this.rightToolBarService.open = true;
    this.rightToolBarService.display = 'block';
    this.rightToolBarService.width = 'calc(90% - 78px)';
    this.rightToolBarService.mode = 0;
  }

  ngAfterViewInit(): void {
    this.ctx = this.myCanvas.nativeElement.getContext('2d');
    this.ctx.canvas.width = window.innerWidth * 0.75;
    this.ctx.canvas.height = window.innerHeight * 0.99;
    this.Astar.setCanvas(this.ctx);
  }

  mouseClick(event: MouseEvent): void {
    this.Astar.mouseClick(event);
  }




}
