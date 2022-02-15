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
    this.ctx.canvas.width = window.innerWidth * 0.95;
    this.ctx.canvas.height = window.innerHeight * 0.99;

    this.ctx.canvas.addEventListener('click', (event) => {
      this.snakeService.mouveSnake(this.snakeService.snake, 0, -10);
    })

    this.ctx.canvas.addEventListener('mousemove', (event) => {
      const mouse = this.getMousePos(event);
      const futurePos = this.snakeService.generateFuturePosition(mouse, 2);
      this.snakeService.mouveSnake(this.snakeService.snake, futurePos.x, futurePos.y);
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
