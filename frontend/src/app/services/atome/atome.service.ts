import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Vec2 } from '../horizon/horizon.service';

export interface Atome {
  x: number;
  y: number;
  type: number;
  color: string;
  nbEdge: number;
}

@Injectable({
  providedIn: 'root'
})
export class AtomeService {
  public ctx: CanvasRenderingContext2D;
  private t: number = 0; // nombre de sites et d’atomes (doit être entre 100 et 10000)
  private k: number = 0; // nombre de types d’atomes (k doit être entre 2 et 6 compris)
  private A: number = 0; // nombre d'arrete
  private nbAtomes = []; // nombre de chaque type d'atomes
  private matrixValues = [];
  private listEdge = [];
  private atomeSize: number = 10;
  private colors: string[] = [];
  private listAtome = [];

  constructor(private httpClient: HttpClient) { }

  init(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
    this.readFile('assets/test/Test1');
  }

  reset() {
    this.t = 0;
    this.k = 0;
    this.A = 0;
    this.nbAtomes = [];
    this.matrixValues = [];
    this.listEdge = [];
    this.colors = [];
    this.listAtome = [];
  }

  loadData(file: string) {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.reset();
    this.readFile(file);
  }

  readFile(path: string) {
    this.httpClient.get(path, { responseType: 'text' })
      .subscribe(
        (data) => {
          let text = []
          let line = ''
          for (let letter of data) {
            if (letter !== '\n') {
              line += letter;
            }
            else {
              text.push(this.extractNumber(line));
              line = '';
            }
          }

          this.t = text[0][0];
          this.k = text[0][1];
          this.A = text[0][2];
          this.nbAtomes = text[2]
          for (let i = 4; i < 4 + this.k; i++) {
            this.matrixValues.push(text[i]);
          }
          for (let i = 5 + this.k; i < this.A + 5 + this.k; i++) {
            this.listEdge.push(text[i]);
          }
          this.generateGraph();
          this.drawGraph();
          this.findEnergie();
          this.resolve();
        }
      );
  }

  extractNumber(line: string) {
    const numbers = []
    let textNumber = '';
    let i = 0;
    for (let letter of line) {
      if (i === line.length - 1) {
        textNumber += letter;
        numbers.push(Number(textNumber))

      }
      else if (letter !== ' ') {
        textNumber += letter;
      }
      else {
        numbers.push(Number(textNumber))
        textNumber = ''
      }
      i++;
    }
    return numbers;
  }

  drawGraph() {
    for (let atome of this.listAtome) {
      this.drawAtome(atome, atome.color);
    }
  }

  generateGraph() {
    this.generateAtomeColors();
    for (let i = 0; i < this.k; i++) {
      for (let j = 0; j < this.nbAtomes[i]; j++) {
        const atome: Atome = {
          x: this.getRandomInt(0 + this.atomeSize, this.ctx.canvas.width - this.atomeSize),
          y: this.getRandomInt(0 + this.atomeSize, this.ctx.canvas.height - this.atomeSize),
          type: i,
          color: this.colors[i],
          nbEdge: 0
        };
        this.listAtome.push(atome);
      }
    }
    this.connectAtomes();
  }

  connectAtomes() {
    for (let edge of this.listEdge) {
      this.listAtome[edge[0]].nbEdge++;
      this.listAtome[edge[1]].nbEdge++;
      this.drawLineBettwenAtomes(this.listAtome[edge[0]], this.listAtome[edge[1]], 'black');
    }
  }

  drawLineBettwenAtomes(atomeA: Atome, atomeB: Atome, color: string) {
    this.ctx.beginPath();
    this.ctx.moveTo(atomeA.x, atomeA.y);
    this.ctx.lineTo(atomeB.x, atomeB.y);
    this.ctx.lineWidth = 1;
    this.ctx.strokeStyle = color;
    this.ctx.stroke();
  }

  generateAtomeColors() {
    for (let i = 0; i < this.k; i++) {
      const color = this.randomColor();
      this.colors.push(color);
    }
  }

  drawAtome(atome: Atome, color: string) {
    this.ctx.strokeStyle = color;
    this.ctx.fillStyle = color;
    this.ctx.beginPath();
    this.ctx.arc(atome.x, atome.y, this.atomeSize, 0, 2 * Math.PI);
    this.ctx.stroke();
    this.ctx.fill();
  }

  randomColor(): string {
    let r = this.getRandomInt(0, 255).toString();
    let v = this.getRandomInt(0, 255).toString();
    let b = this.getRandomInt(0, 255).toString();
    return "rgba(" + r + "," + v + ',' + b + ', 0.9)'
  }

  getRandomInt(min, max): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }

  resolve(): void {
    this.drawAtome(this.findMaxEdgeAtome(), 'red')
  }

  findEnergie(): number {
    let E = 0;
    for (let edge of this.listEdge) {
      E += this.getMatrixEnergie(this.listAtome[edge[0]].type, this.listAtome[edge[1]].type);
    }
    console.log('Energie totale : ', E);
    return E;
  }


  getMatrixEnergie(atomeA: number, atomeB: number) {
    return this.matrixValues[atomeA][atomeB];
  }

  findMaxEdgeAtome() {
    const maximum: number = Math.max.apply(Math, this.listAtome.map((obj) => { return obj.nbEdge; }))
    return this.listAtome.find(obj => obj.nbEdge === maximum)
  }
}
