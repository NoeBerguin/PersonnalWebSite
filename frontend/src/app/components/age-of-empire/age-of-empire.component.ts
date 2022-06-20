import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

export interface Chapiter {
  posX: number;
  posY: number;
  name: string;
}
let data: Chapiter[] = [{posX: 0.05, posY: 0.05, name: "Creation fenetre"},
{posX: 0.70, posY: 0.1, name: "Creation fenetre"}]

@Component({
  selector: 'app-age-of-empire',
  templateUrl: './age-of-empire.component.html',
  styleUrls: ['./age-of-empire.component.scss']
})
export class AgeOfEmpireComponent implements OnInit {
  @ViewChild('myMapCanvas', { static: false }) myCanvas: ElementRef;
  public ctx: CanvasRenderingContext2D;
  private pointSize: number = 15;
  
  constructor() {
   }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.ctx = this.myCanvas.nativeElement.getContext('2d');
    this.ctx.canvas.width = window.innerWidth * 0.99 - 80;
    this.ctx.canvas.height = window.innerHeight * 0.99;
    this.drawMap();
  }

  drawMap():void {

    for(let chapter of data){
      this.drawPoint(chapter.posX* this.ctx.canvas.width, chapter.posY *this.ctx.canvas.height , "black")
    }

    for(let i =0; i<data.length-1; i++){
      this.drawLine(data[i].posX* this.ctx.canvas.width, data[i].posY* this.ctx.canvas.height, data[i+1].posX* this.ctx.canvas.width, data[i+1].posY* this.ctx.canvas.height, "black")
    }

  }

  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }

  drawPoint(posX:number, posY:number, color: string) {
    this.ctx.beginPath();
    this.ctx.arc(posX, posY, this.pointSize, 0, 2 * Math.PI);
    this.ctx.stroke();
    this.ctx.strokeStyle = color;
    this.ctx.fillStyle = color;
    this.ctx.fill();
  }

  drawLine(posX1: number, posY1: number,posX2: number, posY2: number , color: string) {
    this.ctx.beginPath();
    this.ctx.moveTo(posX1, posY1);
    this.ctx.lineTo(posX2, posY2);
    this.ctx.lineWidth = this.pointSize;
    this.ctx.strokeStyle = color;
    this.ctx.stroke();
  }

}
