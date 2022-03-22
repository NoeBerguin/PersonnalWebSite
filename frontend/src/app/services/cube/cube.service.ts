import { Injectable } from '@angular/core';
import { Vec2 } from 'src/app/classes/vec2';

export interface Cube {
  pos: Vec2;
  dim: Vec3D;
  color: string;
}

export interface Vec3D {
  x: number;
  y: number;
  z: number;
}

export interface Pair {
  data: Cube;
  box: Pair;
  h: number;
}


@Injectable({
  providedIn: 'root'
})
export class CubeService {
  public ctx: CanvasRenderingContext2D;
  public ctxTour: CanvasRenderingContext2D;
  public nbCube = 204;
  public width: number = 0;
  public height: number = 0;
  cube: Cube = {
    pos: { x: 200, y: 200 },
    dim: {
      x: 50,
      y: 70,
      z: 90
    },
    color: this.randomColor()
  }
  angle = -40;
  listCube: Cube[] = [];

  constructor() {
    this.width = window.innerWidth * 0.55;
    this.height = window.innerHeight;
  }

  setCanvas(ctx: CanvasRenderingContext2D, ctxTour: CanvasRenderingContext2D) {
    this.ctx = ctx;
    this.ctxTour = ctxTour
    this.generateRandomCube();
    this.drawCubes();
    //this.drawCube(this.cube)
  }

  drawCubes() {
    for (let i = 0; i < this.listCube.length; i++) {
      this.drawCube(this.listCube[i], this.ctx);
    }
  }

  randomColor() {
    let r = this.getRandomInt(0, 255).toString();
    let v = this.getRandomInt(0, 255).toString();
    let b = this.getRandomInt(0, 255).toString();
    return "rgba(" + r + "," + v + ',' + b + ', 1)'
  }

  getRandomInt(min, max): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }

  drawCube(cube: Cube, ctx: CanvasRenderingContext2D) {
    this.drawCubeWithoutText(cube, ctx)
    ctx.font = "20px Arial";
    ctx.fillText(cube.dim.x + " x " + cube.dim.z + " x " + cube.dim.y, cube.pos.x, cube.pos.y + cube.dim.y + 40);
  }

  drawCubeWithoutText(cube: Cube, ctx: CanvasRenderingContext2D) {
    ctx.lineWidth = 2;
    ctx.fillStyle = cube.color;
    ctx.beginPath();
    ctx.fillRect(cube.pos.x + Math.cos(this.angle * (Math.PI / 180)) * cube.dim.z, cube.pos.y + Math.sin(this.angle * (Math.PI / 180)) * cube.dim.z, cube.dim.x, cube.dim.y);
    ctx.rect(cube.pos.x + Math.cos(this.angle * (Math.PI / 180)) * cube.dim.z, cube.pos.y + Math.sin(this.angle * (Math.PI / 180)) * cube.dim.z, cube.dim.x, cube.dim.y);
    ctx.stroke();

    ctx.beginPath();
    ctx.fillRect(cube.pos.x, cube.pos.y, cube.dim.x, cube.dim.y);
    ctx.rect(cube.pos.x, cube.pos.y, cube.dim.x, cube.dim.y);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(cube.pos.x + Math.cos(this.angle * (Math.PI / 180)) * cube.dim.z + 1, cube.pos.y + Math.sin(this.angle * (Math.PI / 180)) * cube.dim.z);
    ctx.lineTo(cube.pos.x + cube.dim.x + Math.cos(this.angle * (Math.PI / 180)) * cube.dim.z, cube.pos.y + Math.sin(this.angle * (Math.PI / 180)) * cube.dim.z);
    ctx.lineTo(cube.pos.x + cube.dim.x, cube.pos.y);
    ctx.lineTo(cube.pos.x, cube.pos.y);
    ctx.fill();


    ctx.beginPath();
    ctx.moveTo(cube.pos.x + cube.dim.x + Math.cos(this.angle * (Math.PI / 180)) * cube.dim.z, cube.pos.y + Math.sin(this.angle * (Math.PI / 180)) * cube.dim.z);
    ctx.lineTo(cube.pos.x + cube.dim.x + Math.cos(this.angle * (Math.PI / 180)) * cube.dim.z, cube.pos.y + cube.dim.y + Math.sin(this.angle * (Math.PI / 180)) * cube.dim.z);
    ctx.lineTo(cube.pos.x + cube.dim.x, cube.pos.y + cube.dim.y);
    ctx.lineTo(cube.pos.x + cube.dim.x, cube.pos.y);
    ctx.fill();


    this.dawLine(cube.pos.x, cube.pos.y, cube.pos.x + Math.cos(this.angle * (Math.PI / 180)) * cube.dim.z, cube.pos.y + Math.sin(this.angle * (Math.PI / 180)) * cube.dim.z, ctx);
    this.dawLine(cube.pos.x + cube.dim.x, cube.pos.y, cube.pos.x + cube.dim.x + Math.cos(this.angle * (Math.PI / 180)) * cube.dim.z, cube.pos.y + Math.sin(this.angle * (Math.PI / 180)) * cube.dim.z, ctx);
    this.dawLine(cube.pos.x + cube.dim.x, cube.pos.y + cube.dim.y, cube.pos.x + cube.dim.x + Math.cos(this.angle * (Math.PI / 180)) * cube.dim.z, cube.pos.y + cube.dim.y + Math.sin(this.angle * (Math.PI / 180)) * cube.dim.z, ctx);


  }

  dawLine(x1: number, y1: number, x2: number, y2: number, ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }

  generateRandomCube() {
    let i = 0;
    let j = 0;
    let k = 0;
    while (i < this.nbCube) {
      if (j * 200 + 300 > this.width) {
        k++;
        j = 0;
      }
      const cube: Cube = {
        pos: { x: 100 + j * 200, y: 150 + k * 200 },
        dim: {
          x: this.getRandomInt(5, 100),
          y: this.getRandomInt(5, 100),
          z: this.getRandomInt(5, 100)
        },
        color: this.randomColor()
      }
      this.listCube.push(cube);
      i++;
      j++;
    }
    this.ctx.canvas.height = (k + 1) * 250;
  }

  sortX() {
    this.clearCanvas();
    this.listCube = this.listCube.sort((c1, c2) => {
      return c2.dim.x - c1.dim.x;
    })
    let i = 0;
    let j = 0;
    let k = 0;
    while (i < this.nbCube) {
      if (j * 200 + 300 > this.width) {
        k++;
        j = 0;
      }
      this.listCube[i].pos.x = 100 + j * 200;
      this.listCube[i].pos.y = 150 + k * 200;
      i++;
      j++;
    }
    this.ctx.canvas.height = (k + 1) * 250;
    this.drawCubes();
  }

  glouton() {
    let listSolution: Cube[] = []
    let currentCube: Cube = this.listCube[0];
    listSolution.push(currentCube);
    for (let i = 1; i < this.listCube.length; i++) {
      if (this.listCube[i].dim.x < currentCube.dim.x && this.listCube[i].dim.z < currentCube.dim.z) {
        currentCube = this.listCube[i];
        listSolution.push(currentCube);
      }
    }
    this.drawTour(listSolution);
  }

  drawTour(tour: Cube[]) {
    this.ctxTour.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    let h = this.ctxTour.canvas.height / 8 * 7;
    let origin = this.ctxTour.canvas.width / 2;
    for (let i = 0; i < tour.length; i++) {
      tour[i].pos.x = origin - tour[i].dim.x / 2;
      tour[i].pos.y = h - tour[i].dim.y;
      this.drawCubeWithoutText(tour[i], this.ctxTour);
      h -= tour[i].dim.y;
    }
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  }

  resetCubeList() {
    this.clearCanvas();
    this.drawCubes();
  }

  dynamique() {
    this.sortDynamique();
    let pairList: Pair[] = []

    for (let i = 0; i < this.listCube.length; i++) {
      let maxBox: Pair = { data: this.listCube[i], box: { data: this.listCube[i], box: null, h: 0 }, h: 0 };
      for (let j = 0; j < pairList.length; j++) {
        if (this.listCube[i].dim.x < pairList[j].data.dim.x && this.listCube[i].dim.z < pairList[j].data.dim.z && pairList[j].h > maxBox.data.dim.y) {
          maxBox = pairList[j];
        }
      }
      const pair = { data: this.listCube[i], box: maxBox, h: this.listCube[i].dim.y + maxBox.h };
      pairList.push(pair);
    }

    const maximum: number = Math.max.apply(Math, pairList.map((obj) => { return obj.h; }))
    let currentBox: Pair = pairList.find(obj => obj.h === maximum)
    let sol: Cube[] = []
    sol.push(currentBox.data)
    let i = 0
    console.log(currentBox)
    if (currentBox.box !== null) {
      while ((currentBox.data.dim.x !== currentBox.box.data.dim.x) &&
        (currentBox.data.dim.y !== currentBox.box.data.dim.y) &&
        (currentBox.data.dim.z !== currentBox.box.data.dim.z) &&
        (i < pairList.length)) {
        sol.push(currentBox.data)
        currentBox = currentBox.box
        i += 1
      }
    }
    sol.reverse()
    this.drawTour(sol);
  }

  sortDynamique() {
    console.log('dynamique')
    this.clearCanvas();
    this.listCube = this.listCube.sort((c1, c2) => {
      return c2.dim.x * c2.dim.z - c1.dim.x * c1.dim.z;
    })
    let i = 0;
    let j = 0;
    let k = 0;
    while (i < this.nbCube) {
      if (j * 200 + 300 > this.width) {
        k++;
        j = 0;
      }
      this.listCube[i].pos.x = 100 + j * 200;
      this.listCube[i].pos.y = 150 + k * 200;
      i++;
      j++;
    }
    this.ctx.canvas.height = (k + 1) * 250;
    this.drawCubes();
  }

  // def sortFunctionLP(self, x):
  //       return x[0] * x[1]

  //   def findMaxKey(self, x):
  //       return x.h

  //   def dynamic(self, listBox):
  //       listBox.sort(key = self.sortFunctionLP)
  //       listBox.reverse()
  //       pairList = []

  //       for i in range(len(listBox)):
  //           maxBox = Pair(listBox[i], (-1,-1,-1), 0)
  //           for j in range(len(pairList)):
  //               if(listBox[i][0]< pairList[j].data[0] and listBox[i][1]< pairList[j].data[1] and pairList[j].h > maxBox.data[2]):         
  //                   maxBox = pairList[j]
  //           pair  = Pair(listBox[i], maxBox, listBox[i][2]+maxBox.h)
  //           pairList.append(pair)  

  //       currentBox = max(pairList, key=self.findMaxKey)
  //       sol = []
  //       sol.append(currentBox.data)
  //       i = 0
  //       while (currentBox.data != currentBox.box.data) and (i< len(pairList)):
  //           sol.append(currentBox.data)
  //           currentBox = currentBox.box
  //           i+=1
  //       sol.reverse()
  //       return sol
}
