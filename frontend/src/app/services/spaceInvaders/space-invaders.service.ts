import { Injectable } from '@angular/core';
import { Vec2 } from 'src/app/classes/vec2';

export interface Enemy {
  pos: Vec2;
  life: number;
  type: number;
  speed: number;
}

export interface Explosion {
  pos: Vec2;
  rowindex: number;
  colindex: number;
  row: number;
  col: number;
}

@Injectable({
  providedIn: 'root'
})
export class SpaceInvadersService {

  public ctx: CanvasRenderingContext2D;
  private imagePlayer = new Image();
  private imageBulletPlayer = new Image();
  private imageEnemy = new Image();
  private imageBulletEnnemy = new Image();
  private imageExplosion = new Image();
  private interval = null;
  private intervalGenerationEnemy = null;
  private intervalEnnemyShoot = null;
  private intervalExplosion = null;
  private player: Vec2 = { x: 0, y: 0 };
  private speed = 3;
  private nextMove = 0;
  private listPlayerBullet: Vec2[] = [];
  private listEnnemyBullet: Vec2[] = [];
  private listeEnemy: Enemy[] = [];
  private listeExplosion: Explosion[] = [];

  constructor() {
    this.imagePlayer.src = 'assets/spacePlayer.png';
    this.imageBulletPlayer.src = 'assets/redBullet.png';
    this.imageEnemy.src = 'assets/PNG_Parts&Spriter_Animation/Ship2/Ship2.png';
    this.imageBulletEnnemy.src = 'assets/bulletT2.png';
    this.imageExplosion.src = 'assets/explosion.png';
  }

  ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }

    if (this.intervalGenerationEnemy) {
      clearInterval(this.intervalGenerationEnemy);
    }

    if (this.intervalEnnemyShoot) {
      clearInterval(this.intervalEnnemyShoot);
    }

    if (this.intervalExplosion) {
      clearInterval(this.intervalExplosion);
    }
  }

  drawExplosion(explosion: Explosion) {
    this.ctx.drawImage(this.imageExplosion,
      191 * explosion.rowindex,
      186 * explosion.colindex,
      191,
      186,
      explosion.pos.x,
      explosion.pos.y,
      191,
      186);
  }

  updateExplosion() {
    for (let explosion of this.listeExplosion) {
      explosion.rowindex++;
      if (explosion.rowindex === explosion.row) {
        explosion.rowindex = 0;
        explosion.colindex++;
      }
    }
  }

  setCanvas(canvas: CanvasRenderingContext2D) {
    this.ctx = canvas;
    this.player.x = this.ctx.canvas.width * 0.1;
    this.player.y = this.ctx.canvas.height / 2;
    this.interval = setInterval(() => {
      this.routine();
    }, 1);

    this.intervalGenerationEnemy = setInterval(() => {
      this.generateEnemy();
    }, 5000);

    this.intervalEnnemyShoot = setInterval(() => {
      if (this.listeEnemy.length > 0) {
        this.ennemyShootRandom();
      }
    }, 2000);

    this.intervalExplosion = setInterval(() => {
      this.updateExplosion();
    }, 50);
  }

  ennemyShootRandom() {
    const randomIndex = this.getRandomInt(0, this.listeEnemy.length);
    const bullet: Vec2 = { x: this.listeEnemy[randomIndex].pos.x, y: this.listeEnemy[randomIndex].pos.y }
    this.listEnnemyBullet.push(bullet);

  }

  drawEnnemyBullets() {
    let i = 0;
    for (let bullet of this.listEnnemyBullet) {
      bullet.x -= 1;
      if (bullet.x < 0) {
        this.listEnnemyBullet.splice(i, 1);
      }
      this.ctx.drawImage(this.imageBulletEnnemy, bullet.x, bullet.y, this.imageBulletEnnemy.width, this.imageBulletEnnemy.height);
      i++;
    }
  }

  routine() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
    this.movePlayer();
    this.drawPlayer();
    this.drawPlayerBullets();
    this.drawEnemy();
    this.drawEnnemyBullets();
    this.drawExplosions();
  }

  drawExplosions() {
    for (let i = 0; i < this.listeExplosion.length; i++) {
      if (this.listeExplosion[i].colindex >= this.listeExplosion[i].col) {
        this.listeExplosion.splice(i, 1);
        console.log('lenght', this.listeExplosion.length)
      }
      this.drawExplosion(this.listeExplosion[i]);
    }
  }

  drawPlayerBullets() {
    let i = 0;
    for (let bullet of this.listPlayerBullet) {
      bullet.x += 1;
      if (bullet.x > this.ctx.canvas.width) {
        this.listPlayerBullet.splice(i, 1);
      }
      this.ctx.drawImage(this.imageBulletPlayer, bullet.x, bullet.y, this.imageBulletPlayer.width, this.imageBulletPlayer.height);
      i++;
    }
  }

  drawPlayer() {
    this.ctx.drawImage(this.imagePlayer, this.player.x, this.player.y, this.imagePlayer.width, this.imagePlayer.height);
  }

  moveUp() {
    this.nextMove = -this.speed;
  }

  moveDown() {
    this.nextMove = this.speed;
  }

  movePlayer() {
    this.player.y += this.nextMove;
  }

  moveZero() {
    this.nextMove = 0;
  }

  playerShoot() {
    const bullet: Vec2 = { x: this.player.x + this.imagePlayer.width, y: this.player.y + this.imagePlayer.height / 2 };
    this.listPlayerBullet.push(bullet);
  }

  generateEnemy() {
    const enemy: Enemy = {
      pos: {
        x: this.ctx.canvas.width + 100,
        y: this.getRandomInt(100, this.ctx.canvas.height - 100)
      },
      life: 1,
      type: 1,
      speed: 0.2
    };
    this.listeEnemy.push(enemy);
  }

  drawEnemy() {
    for (let i = 0; i < this.listeEnemy.length; i++) {
      this.checkCollision(this.listeEnemy[i]);
      if (this.listeEnemy[i].life === 0 || this.listeEnemy[i].pos.x < -this.imageEnemy.width) {
        if (this.listeEnemy[i].life === 0) {
          const explosion: Explosion = { pos: { x: this.listeEnemy[i].pos.x, y: this.listeEnemy[i].pos.y }, rowindex: 0, colindex: 0, row: 5, col: 5 };
          this.listeExplosion.push(explosion);
        }
        this.listeEnemy.splice(i, 1);
      } else {
        this.listeEnemy[i].pos.x -= this.listeEnemy[i].speed;
        this.ctx.drawImage(this.imageEnemy, this.listeEnemy[i].pos.x, this.listeEnemy[i].pos.y, this.imageEnemy.width, this.imageEnemy.height);
      }
    }
  }

  checkCollision(enemy: Enemy) {
    for (let i = 0; i < this.listPlayerBullet.length; i++) {
      if (this.listPlayerBullet[i].x + this.imageBulletPlayer.width >= enemy.pos.x &&
        this.listPlayerBullet[i].x + this.imageBulletPlayer.width <= enemy.pos.x + this.imageEnemy.width) {
        if (this.listPlayerBullet[i].y >= enemy.pos.y &&
          this.listPlayerBullet[i].y <= enemy.pos.y + this.imageEnemy.height) {
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
