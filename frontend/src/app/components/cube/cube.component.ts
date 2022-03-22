import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CubeService } from 'src/app/services/cube/cube.service';
import { RightToolBarService } from 'src/app/services/rightToolBar/right-tool-bar.service';

@Component({
  selector: 'app-cube',
  templateUrl: './cube.component.html',
  styleUrls: ['./cube.component.scss']
})
export class CubeComponent implements OnInit {
  @ViewChild('myCanvas', { static: false }) myCanvas: ElementRef;
  @ViewChild('canvasTour', { static: false }) canvasTour: ElementRef;

  public ctx: CanvasRenderingContext2D;
  public ctxTour: CanvasRenderingContext2D;

  constructor(public rightToolBarService: RightToolBarService, public cubeService: CubeService) {
    this.rightToolBarService.open = true;
    this.rightToolBarService.display = 'block';
    this.rightToolBarService.width = 'calc(90% - 78px)';
    this.rightToolBarService.mode = 2;
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.ctx = this.myCanvas.nativeElement.getContext('2d');
    this.ctxTour = this.canvasTour.nativeElement.getContext('2d');
    this.ctxTour.canvas.width = window.innerWidth * 0.30;
    this.ctxTour.canvas.height = window.innerHeight;
    this.ctx.canvas.width = window.innerWidth * 0.55;
    this.ctx.canvas.height = window.innerHeight;
    console.log(this.ctxTour);
    this.cubeService.setCanvas(this.ctx, this.ctxTour);
  }

}
