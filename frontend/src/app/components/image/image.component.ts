import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ImageService } from 'src/app/services/image/image.service';


@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss']
})
export class ImageComponent implements OnInit {
  @ViewChild('myCanvasSpace', { static: false }) myCanvas: ElementRef;
  public ctx: CanvasRenderingContext2D;

  constructor(private imageService: ImageService) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.ctx = this.myCanvas.nativeElement.getContext('2d');
    this.ctx.canvas.width = window.innerWidth * 0.99;
    this.ctx.canvas.height = window.innerHeight * 0.99;
    this.imageService.init(this.ctx);
  }

}
