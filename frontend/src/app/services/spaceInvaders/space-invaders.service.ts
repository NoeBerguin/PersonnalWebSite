import { Injectable } from '@angular/core';
import { Vec2 } from 'src/app/classes/vec2';

export interface Enemy{
  pos : Vec2;
  life : number;
  type : number;
  speed : number;
}

@Injectable({
  providedIn: 'root'
})
export class SpaceInvadersService {

  public ctx: CanvasRenderingContext2D;
  private imagePlayer = new Image();
  private imageBulletPlayer = new Image();
  private imageEnemy = new Image();
  private interval = null;
  private intervalGenerationEnemy = null;
  private player: Vec2 = {x:0, y: 0};
  private speed = 1;
  private nextMove = 0;
  private listPlayerBullet : Vec2[] = [];
  private listeEnemy: Enemy[] = [];

  constructor() { 
    this.imagePlayer.src = 'assets/spacePlayer.png';
    this.imageBulletPlayer.src = 'assets/redBullet.png';
    this.imageEnemy.src = 'assets/spacePlayer.png';
  }

  ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }

    if (this.intervalGenerationEnemy) {
      clearInterval(this.intervalGenerationEnemy);
    }
  }

  setCanvas(canvas: CanvasRenderingContext2D) {
    this.ctx = canvas;
    this.player.x = this.ctx.canvas.width*0.1;
    this.player.y = this.ctx.canvas.height/2;
    this.interval = setInterval(() => {
      this.routine();
    }, 1);

    this.intervalGenerationEnemy = setInterval(() => {
      this.generateEnemy();
    }, 1000);
  }

  routine(){
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
    this.movePlayer();
    this.drawPlayer();
    this.drawPlayerBullets();
    this.drawEnemy();
  }

  drawPlayerBullets(){
    let i = 0; 
    for(let bullet of this.listPlayerBullet){
      bullet.x += 1;
      if(bullet.x > this.ctx.canvas.width){
        this.listPlayerBullet.splice(i, 1);
        console.log('remove', this.listPlayerBullet.length)
      }
      this.ctx.drawImage(this.imageBulletPlayer, bullet.x, bullet.y, this.imageBulletPlayer.width, this.imageBulletPlayer.height);
      i++;
    }
  }

  drawPlayer(){
    this.ctx.drawImage(this.imagePlayer, this.player.x, this.player.y, this.imagePlayer.width, this.imagePlayer.height);
  }

  moveUp(){
    this.nextMove = -this.speed; 
  }

  moveDown(){
    this.nextMove = this.speed; 
  }

  movePlayer(){
    this.player.y += this.nextMove;
  }

  moveZero(){
    this.nextMove = 0; 
  }

  playerShoot(){
    const bullet: Vec2 = {x: this.player.x + this.imagePlayer.width, y: this.player.y + this.imagePlayer.height/2};
    this.listPlayerBullet.push(bullet);
  }

  generateEnemy(){
    const enemy: Enemy = {
      pos: {x: this.ctx.canvas.width + 100, 
        y: this.getRandomInt(0, this.ctx.canvas.height)},
      life: 1,
      type : 1,
      speed: 1
    };
    this.listeEnemy.push(enemy);
  }

  drawEnemy(){
    for(let i =0; i< this.listeEnemy.length; i++){
      this.checkCollision(this.listeEnemy[i]);
      if(this.listeEnemy[i].life === 0 || this.listeEnemy[i].pos.x < -this.imageEnemy.width ){
        this.listeEnemy.splice(i, 1);
      }else{
        this.listeEnemy[i].pos.x -= this.listeEnemy[i].speed;
        this.ctx.drawImage(this.imageEnemy, this.listeEnemy[i].pos.x, this.listeEnemy[i].pos.y, this.imageEnemy.width, this.imageEnemy.height);
      }
    }
  }

  checkCollision(enemy : Enemy){
    for(let i = 0; i< this.listPlayerBullet.length; i++){
      if(this.listPlayerBullet[i].x + this.imageBulletPlayer.width >= enemy.pos.x &&
        this.listPlayerBullet[i].x + this.imageBulletPlayer.width <= enemy.pos.x + this.imageEnemy.width){
          if(this.listPlayerBullet[i].y >= enemy.pos.y &&
            this.listPlayerBullet[i].y <= enemy.pos.y + this.imageEnemy.height){
              enemy.life--;
              this.listPlayerBullet.splice(i, 1);
            }
        }
    }
  }

  getRandomInt(min, max): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }
}
