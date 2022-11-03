import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  public ctx: CanvasRenderingContext2D;
  private base_image = new Image();
  private GX: number[][] = [
    [-1, 0, 1],
    [-2, 0, 2],
    [-1, 0, 1]
  ]

  private GY: number[][] = [
    [-1, -2, -1],
    [0, 0, 0],
    [1, 2, 1]
  ]

  constructor() { }

  init(canvas: CanvasRenderingContext2D) {
    this.setCanvas(canvas);
    this.loadImage('assets/testSobel.png');


  }
  setCanvas(canvas: CanvasRenderingContext2D) {
    this.ctx = canvas;
  }

  loadImage(src: string) {
    this.base_image = new Image();
    this.base_image.src = src;

    this.base_image.onload = () => {
      this.ctx.drawImage(this.base_image, 0, 0);
      this.grayScaleImage();
    }
  }


  grayScaleImage() {
    let imageData = this.ctx.getImageData(0, 0, this.base_image.width, this.base_image.height);
    let data = imageData.data
    console.log(data);
    for (let i = 0; i < data.length; i += 4) {
      let moy = (data[i] + data[i + 1] + data[i + 2]) / 3;
      data[i + 0] = moy;    // R value
      data[i + 1] = moy;  // G value
      data[i + 2] = moy;    // B value
      data[i + 3] = 255  // A value
    }
    console.log(data);
    this.ctx.putImageData(imageData, 0, 0);
    let imageData1 = this.ctx.getImageData(0, 0, this.base_image.width, this.base_image.height);
    let gradX = this.filtreSobel(imageData1, this.GX, 0, this.base_image.height)
    let imageData2 = this.ctx.getImageData(0, 0, this.base_image.width, this.base_image.height);
    let gradY = this.filtreSobel(imageData2, this.GY, this.base_image.width, 0)
    let imageData3 = this.ctx.getImageData(0, 0, this.base_image.width, this.base_image.height);
    this.fusionGradient(imageData3, gradX, gradY, this.base_image.width, this.base_image.height);
  }

  fusionGradient(imageData, gradX, gradY, posX, posY) {
    let gradientXY = []
    for (let i = 0; i < gradX.length; i++) {
      let sum = Math.abs(gradX[i] + gradY[i]);
      if (sum > 255) {
        sum = 255;
      }
      gradientXY.push(sum);
    }
    for (let i = 0; i < imageData.data.length; i += 4) {
      imageData.data[i + 0] = gradientXY[i / 4];    // R value
      imageData.data[i + 1] = gradientXY[i / 4];  // G value
      imageData.data[i + 2] = gradientXY[i / 4];    // B value
      imageData.data[i + 3] = 255  // A value
    }
    this.ctx.putImageData(imageData, posX, posY);
  }

  filtreSobel(imageData: ImageData, gradient_sobel, posX, posY) {
    let gradient = [];
    let data = [];
    for (let i = 0; i < imageData.data.length; i += 4) {
      data.push(imageData.data[i])
    }
    console.log(data.length / this.base_image.height);
    console.log(this.base_image.width);
    console.log(this.base_image.height);
    console.log(data);
    for (let i = 0; i < this.base_image.height; i++) {
      for (let j = 0; j < this.base_image.width; j++) {
        if (i === 0) {
          gradient.push(data[i * this.base_image.width + j]);
        } else if (i === this.base_image.height - 1) {
          gradient.push(data[i * this.base_image.width + j]);
        } else if (j === 0) {
          gradient.push(data[i * this.base_image.width + j]);
        } else if (j === this.base_image.width - 1) {
          gradient.push(data[i * this.base_image.width + j]);
        } else {

          let sum = 0;
          sum += gradient_sobel[0][0] * data[(i - 1) * this.base_image.width + j - 1]
          sum += gradient_sobel[0][2] * data[(i - 1) * this.base_image.width + j + 1]
          sum += gradient_sobel[1][0] * data[i * this.base_image.width + j - 1]
          sum += gradient_sobel[1][2] * data[i * this.base_image.width + j + 1]
          sum += gradient_sobel[2][0] * data[(i + 1) * this.base_image.width + j - 1]
          sum += gradient_sobel[2][2] * data[(i + 1) * this.base_image.width + j + 1]
          gradient.push(Math.abs(sum));
        }
      }
    }
    console.log(gradient);

    for (let i = 0; i < imageData.data.length; i += 4) {
      imageData.data[i + 0] = gradient[i / 4];    // R value
      imageData.data[i + 1] = gradient[i / 4];  // G value
      imageData.data[i + 2] = gradient[i / 4];    // B value
      imageData.data[i + 3] = 255  // A value
    }
    this.ctx.putImageData(imageData, posX, posY);
    return gradient;
  }

}
