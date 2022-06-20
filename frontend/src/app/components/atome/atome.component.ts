import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AtomeService } from 'src/app/services/atome/atome.service';
import { RightToolBarService } from 'src/app/services/rightToolBar/right-tool-bar.service';

@Component({
  selector: 'app-atome',
  templateUrl: './atome.component.html',
  styleUrls: ['./atome.component.scss']
})
export class AtomeComponent implements OnInit {
  @ViewChild('myCanvas', { static: false }) myCanvas: ElementRef;
  public ctx: CanvasRenderingContext2D;

  @ViewChild('myData', { static: false }) myData: ElementRef;
  public ctxData: CanvasRenderingContext2D;

  constructor(public rightToolBarService: RightToolBarService, private atomeService: AtomeService) { }

  ngOnInit(): void {
    this.rightToolBarService.open = true;
    this.rightToolBarService.display = 'block';
    this.rightToolBarService.width = 'calc(90% - 78px)';
    this.rightToolBarService.mode = 3;
  }

  ngAfterViewInit(): void {
    this.ctx = this.myCanvas.nativeElement.getContext('2d');
    this.ctx.canvas.width = window.innerWidth * 0.68;
    this.ctx.canvas.height = window.innerHeight * 0.99;

    this.ctxData = this.myData.nativeElement.getContext('2d');
    this.ctxData.canvas.width = window.innerWidth * 0.16;
    this.ctxData.canvas.height = window.innerHeight * 0.99;

    this.atomeService.init(this.ctx);
  }

}
