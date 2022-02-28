import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {SpaceInvadersService} from 'src/app/services/spaceInvaders/space-invaders.service'

@Component({
  selector: 'app-space-invaders',
  templateUrl: './space-invaders.component.html',
  styleUrls: ['./space-invaders.component.scss']
})
export class SpaceInvadersComponent implements OnInit {
  @ViewChild('myCanvasSpace', { static: false }) myCanvas: ElementRef;
  public ctx: CanvasRenderingContext2D;

  constructor(private spaceInvadersService:SpaceInvadersService) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.ctx = this.myCanvas.nativeElement.getContext('2d');
    this.ctx.canvas.width = window.innerWidth * 0.94;
    this.ctx.canvas.height = window.innerHeight* 0.99;
    this.spaceInvadersService.setCanvas(this.ctx);

    document.addEventListener('keydown', (event) => {
      if(event.key ==='w'){
        this.spaceInvadersService.moveUp();
      }

      if(event.key ==='z'){
        this.spaceInvadersService.moveDown();
      }

      if(event.code ==='Space'){
        console.log('shoot');
        this.spaceInvadersService.playerShoot();
      }
    })

    document.addEventListener('keyup', (event) => {
      this.spaceInvadersService.moveZero();
    })

  }

}
