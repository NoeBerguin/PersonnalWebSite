import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Vec2 } from 'src/app/classes/vec2';
import { SnakeService } from 'src/app/services/snake/snake.service';

@Component({
  selector: 'app-snake',
  templateUrl: './snake.component.html',
  styleUrls: ['./snake.component.scss']
})
export class SnakeComponent implements OnInit {
  @ViewChild('myCanvas', { static: false }) myCanvas: ElementRef;
  public ctx: CanvasRenderingContext2D;

  constructor(public snakeService: SnakeService) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.ctx = this.myCanvas.nativeElement.getContext('2d');
    this.ctx.canvas.width = window.innerWidth;
    this.ctx.canvas.height = window.innerHeight;

    this.ctx.canvas.addEventListener('click', (event) => {
      this.snakeService.mouveSnake(this.snakeService.snake, 0, -10);
    })

    this.ctx.canvas.addEventListener('mousemove', (event) => {
    
      const mouse = this.getMousePos(event);
      if(mouse.x === this.snakeService.mousePosition.x && mouse.y === this.snakeService.mousePosition.y){
        this.snakeService.isMouse = false;

      }else{
        this.snakeService.isMouse = true;
        this.snakeService.mousePosition = this.getMousePos(event);}
    })

    this.ctx.canvas.addEventListener('mouseout', (event) => {
      this.snakeService.isMouse = false;
    })

    this.ctx.canvas.addEventListener('mouseenter', (event) => {
      this.snakeService.isMouse = true;
    })

    this.snakeService.setCanvas(this.ctx);
  }

  getMousePos(evt) {
    var rect = this.ctx.canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  }

}
