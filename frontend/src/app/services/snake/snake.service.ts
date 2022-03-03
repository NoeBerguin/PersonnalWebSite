import { Injectable } from '@angular/core';
import { Vec2 } from 'src/app/classes/vec2';

export interface Sphere{
  pos : Vec2;
  radius : number;
  maxRadius: number;
  mouvement : number;
  color : string;
}


@Injectable({
  providedIn: 'root'
})
export class SnakeService {
  public ctx: CanvasRenderingContext2D;
  public snake: Vec2[] = [];
  public radius: number = 20;
  public origin: Vec2 = { x: 0, y: 0 };
  private interval = null;
  public isMouse = false;
  public futurePosition: Vec2 = {x:1, y:0};
  public mousePosition: Vec2 = {x:0,y:0};
  private listSphere: Sphere[] = [];
  private listBombs: Vec2[] = [];
  private imageBomb = new Image();
  private gameRun = true;


  constructor() {
  }

  ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }


  moveBombe(bomb: Vec2, dx:number, dy:number){
    bomb.x += dx;
    bomb.y += dy;
  }

  moveSphere(sphere: Sphere, dx:number, dy:number){
    sphere.pos.x += dx;
    sphere.pos.y += dy;
  }

  moveSnakePart(part: Vec2, dx:number, dy:number){
    part.x += dx;
    part.y += dy;
  }

  moveCamera(dx:number, dy:number){
    for(let part of this.snake){
      this.moveSnakePart(part, dx,dy);
    }

    for(let bomb of this.listBombs){
      this.moveSnakePart(bomb, dx,dy);
    }

    for(let sphere of this.listSphere){
      this.moveSphere(sphere, dx,dy);
    }
  }

  setCanvas(canvas: CanvasRenderingContext2D) {
    this.ctx = canvas;
    this.origin = { x: this.ctx.canvas.width / 2, y: this.ctx.canvas.height / 2 }
    //this.futurePosition = this.origin;
    this.snake.push(this.origin);
    for (let i = 0; i < 20; i++) {
      this.snake.push({ x: this.origin.x +i*4, y: this.origin.y });
    }

    this.interval = setInterval(() => {
      this.routine();
    }, 20);

    this.imageBomb.src = 'assets/bomb.png';

    this.generateSphere();
    this.generateBombs();
  }

  routine() {
    if(this.gameRun){
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
    if(this.isMouse){
      this.futurePosition = this.generateFuturePosition(this.mousePosition, 4);
     }
    this.mouveSnake(this.snake, this.futurePosition.x, this.futurePosition.y);
    this.drawSnake(this.snake);
    this.drawSpheres(-this.futurePosition.x, -this.futurePosition.y);
    this.drawBombs(-this.futurePosition.x, -this.futurePosition.y);}
  }

  drawBombs(dx:number, dy:number){
    let index = null;
    for(let i=0; i<this.listBombs.length; i++){
      if(this.lookBombColision(this.listBombs[i]) === 1){
        index = i;
      }
      this.moveBombe(this.listBombs[i], dx,dy)
      this.drawBomb(this.listBombs[i]);
    }

    if(index !== null){
      this.listBombs.splice(index, 1);
      this.gameOver();
      this.gameRun= false;
    }
  }

  gameOver(){
    this.ctx.strokeStyle = "Black";
    this.ctx.fillStyle = "Black";
    this.ctx.font = "168px Helvetica";
    this.ctx.fillText("GAME OVER", 0, this.origin.y);
  }

  drawSpheres(dx:number, dy:number){
    let index = null;
    for(let i=0; i<this.listSphere.length; i++){
      if(this.lookColision(this.listSphere[i].pos) === 1){
        index = i;
      }
      this.moveSphere(this.listSphere[i], dx,dy);
      this.drawSphere(this.listSphere[i]);
    }

    if(index !== null){
    this.listSphere.splice(index, 1);
    this.addPartSnake();
    this.addPartSnake();
    this.addPartSnake();
    }
  }

  addPartSnake(){
    this.snake.push({x:this.snake[this.snake.length-1].x, y:this.snake[this.snake.length-1].y})
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
      this.moveSnakePart(snake[i],-dx,-dy);
    }
    snake[0].x += dx;
    snake[0].y += dy;
    this.moveSnakePart(snake[0],-dx,-dy);
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


  generateSphere(){
    const nbSphere = this.getRandomInt(500, 1000);
    for(let i=0; i<nbSphere; i++){
      const radius = this.getRandomInt(5, 10);
      const sphere= {
        pos: {x: this.getRandomInt(-2000, 2000), y: this.getRandomInt(-1000, 1000)},
        radius: radius,
        maxRadius: radius,
        mouvement:this.getRandomInt(-2, 0), 
        color: this.randomColor()
      }
      this.listSphere.push(sphere);
    }
  }

  drawSphere(sphere: Sphere) {
    this.animateSphere(sphere)
    this.ctx.beginPath();
    this.ctx.arc(sphere.pos.x, sphere.pos.y, sphere.radius, 0, 2 * Math.PI);
    this.ctx.stroke();
    this.ctx.strokeStyle = sphere.color;
    this.ctx.fillStyle = sphere.color;
    this.ctx.fill();
  }

  animateSphere(sphere: Sphere){
    if(sphere.mouvement ===0){
      sphere.radius += 0.1;
      if(sphere.radius >= sphere.maxRadius * 1.1){
        sphere.mouvement = -1
      }
    }else{
      sphere.radius -= 0.1;
      if(sphere.radius <= sphere.maxRadius * 0.9){
        sphere.mouvement =0
      }
    }
  }

  randomColor() {
    let r = this.getRandomInt(0, 255).toString();
    let v = this.getRandomInt(0, 255).toString();
    let b = this.getRandomInt(0, 255).toString();
    return "rgba(" + r + "," + v + ',' + b + ', 0.8)'
  }

  getRandomInt(min, max): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }

  lookColision(pos:Vec2) : number{

    if(pos.x - this.snake[0].x  <= this.radius && pos.x - this.snake[0].x >= -this.radius){
      if(pos.y - this.snake[0].y <= this.radius && pos.y - this.snake[0].y >= -this.radius){
        return 1;
      }
    }
    return 0;
  }

  lookBombColision(pos:Vec2) : number{

    if(pos.x - this.snake[0].x  <= this.radius && pos.x - this.snake[0].x >= -this.imageBomb.width){
      if(pos.y - this.snake[0].y <= this.radius && pos.y - this.snake[0].y >= -this.imageBomb.height){
        return 1;
      }
    }
    return 0;
  }

  drawBomb(bomb: Vec2){
    this.ctx.drawImage(this.imageBomb, bomb.x, bomb.y, this.imageBomb.width, this.imageBomb.height);
  }

  generateBombs(){
    const nbBomb = this.getRandomInt(15, 200);
    for(let i =0; i< nbBomb; i++){
      const bomb = {x: this.getRandomInt(-1000, 2000), y: this.getRandomInt(-1000, 2000)};
      this.listBombs.push(bomb);
    }
  }

}
