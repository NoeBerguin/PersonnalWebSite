import { Injectable } from '@angular/core';
import { Vec2 } from 'src/app/classes/vec2';


@Injectable({
  providedIn: 'root'
})
export class SnakeService {
  public ctx: CanvasRenderingContext2D;
  public snake: Vec2[] = [];
  public radius: number = 20;
  public origin: Vec2 = { x: 0, y: 0 };
  private interval = null;

  constructor() {
  }

  ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  setCanvas(canvas: CanvasRenderingContext2D) {
    this.ctx = canvas;
    this.origin = { x: this.ctx.canvas.width / 2, y: this.ctx.canvas.height / 2 }
    this.snake.push(this.origin);
    for (let i = 0; i < 5; i++) {
      this.snake.push({ x: this.origin.x + i * 30, y: this.origin.y });
    }

    this.interval = setInterval(() => {
      this.routine();
    }, 50);
  }

  routine() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
    this.drawSnake(this.snake);
  }

  drawSnake(snake: Vec2[]) {
    for (let part of snake) {
      this.drawPart(part, "grey");
    }
  }

  drawPart(part: Vec2, color: string) {
    this.ctx.beginPath();
    this.ctx.lineWidth = 1;
    this.ctx.strokeStyle = color;
    this.ctx.arc(part.x, part.y, this.radius, 0, 2 * Math.PI);
    this.ctx.stroke();
    this.ctx.fillStyle = color;
    this.ctx.fill();
  }

  mouveSnake(snake: Vec2[], dx: number, dy: number) {
    for (let i = snake.length - 1; i > 0; i--) {
      snake[i].x = snake[i - 1].x;
      snake[i].y = snake[i - 1].y;
      this.drawPart(snake[i], "grey");
    }
    snake[0].x += dx;
    snake[0].y += dy;
    this.drawPart(snake[0], "grey");
  }

  drawArrow(p1: Vec2, p2: Vec2, color: string, thickness: number) {
    const headlen = 10; // length of head in pixels
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const angle = Math.atan2(dy, dx);
    this.ctx.moveTo(p1.x, p1.y);
    this.ctx.lineTo(p2.x, p2.y);
    this.ctx.stroke();
    this.ctx.lineTo(p2.x - headlen * Math.cos(angle - Math.PI / 6), p2.y - headlen * Math.sin(angle - Math.PI / 6));
    this.ctx.moveTo(p2.x, p2.y);
    this.ctx.stroke();
    this.ctx.lineTo(p2.x - headlen * Math.cos(angle + Math.PI / 6), p2.y - headlen * Math.sin(angle + Math.PI / 6));
    this.ctx.stroke();
  }

  calculAngle(p1: Vec2, p2: Vec2): number {
    return Math.asin((p1.y - p2.y) / Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2)));
  }

  rotate(point: Vec2, yawn: number): Vec2 {
    console.log(yawn);
    const angle = yawn;
    const x = point.x * Math.cos(angle) + point.y * Math.sin(angle);
    const y = -point.x * Math.sin(angle) + point.y * Math.cos(angle);
    point.x = x;
    point.y = y;
    return point;
  }

  generateFuturePosition(mouse: Vec2, dx: number) {
    this.drawArrow(this.origin, mouse, "grey", 1);
    let futurPoint: Vec2;
    if (mouse.x - this.origin.x > 0) {
      futurPoint = this.rotate({ x: dx, y: 0 }, this.calculAngle(this.origin, mouse))
    }
    else {
      futurPoint = this.rotate({ x: -dx, y: 0 }, this.calculAngle(mouse, this.origin))
    }
    return futurPoint;
  }

}
