import { Injectable } from '@angular/core';

export interface Cell {
  x: number;
  y: number;
  type: number;
}
export interface Node {
  index: number;
  type: number;
  parent: Node;
  g: number;
  h: number;
}

export interface Output {
  openList: Node[];
  closeList: Node[];
  path: number[];
}


@Injectable({
  providedIn: 'root'
})
export class AstarService {

  public ctx: CanvasRenderingContext2D;
  public nbCells: number = 2025;
  origin: Cell = { x: 0, y: 0, type: 0 };
  cellSize: number = 20;
  cellMap: Cell[] = [];
  startCell: number;
  endCell: number;
  clickIndex: number = 1;

  openList: Node[] = [];
  closeList: Node[] = [];
  map: Node[] = [];
  start: Node;
  end: Node;
  currentNode: Node;
  obstacles: number = 100;
  constructor() {

  }

  setCanvas(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
    this.origin = { x: this.ctx.canvas.width / 2, y: this.ctx.canvas.height / 2, type: 0 };
    this.creatMatrix();
  }

  creatMatrix() {
    let cell: Cell = { x: this.origin.x - Math.sqrt(this.nbCells) * this.cellSize / 2, y: this.origin.y - Math.sqrt(this.nbCells) * this.cellSize / 2, type: 0 };
    for (let i: number = 0; i < this.nbCells; i++) {
      if (i === 0) {

      }
      else if (i % Math.sqrt(this.nbCells) === 0 && i !== 0) {
        cell.x = this.origin.x - Math.sqrt(this.nbCells) * this.cellSize / 2;
        cell.y += this.cellSize;
      } else {
        cell.x += this.cellSize;
      }
      const pt: Cell = { x: cell.x, y: cell.y, type: 0 };
      this.cellMap.push(pt);
      this.drawCell(pt, "white");
    }
    this.genrateObstacle();
  }

  genrateObstacle() {
    console.log('obstacles: ', this.obstacles);
    for (let i = 0; i < this.obstacles; i++) {
      let index: number = this.getRandomInt(0, this.nbCells);
      this.cellMap[index].type = 1;
      this.drawCell(this.cellMap[index], "black");
    }
  }

  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }

  drawCell(cell: Cell, color: string) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(cell.x - this.cellSize / 2, cell.y - this.cellSize / 2, this.cellSize, this.cellSize);
    this.ctx.beginPath();
    this.ctx.rect(cell.x - this.cellSize / 2, cell.y - this.cellSize / 2, this.cellSize, this.cellSize);
    this.ctx.stroke();
  }

  colorCells(output: Output) {
    for (let node of output.openList) {
      if (node !== null) {
        this.drawCell(this.cellMap[node.index], "#ff99ff");
      }
    }

    for (let index of output.path) {
      this.drawCell(this.cellMap[index], "#66ffff");
    }
  }

  mouseClick(event: MouseEvent): void {
    const bounds = this.ctx.canvas.getBoundingClientRect();
    const cellIndex: number = this.findCell({ x: event.clientX - bounds.left, y: event.clientY - bounds.top, type: 0 });
    console.log(cellIndex);
    if (cellIndex !== null) {
      if (this.clickIndex === 1) {
        this.startCell = cellIndex;
        this.resetColor();
        this.selectCell(this.cellMap[cellIndex], "blue");
      } else if (this.clickIndex === 2) {
        this.endCell = cellIndex;
        this.selectCell(this.cellMap[cellIndex], "green");
      } else {
        this.init(this.cellMap, this.startCell, this.endCell);
        const output: Output = this.calculate();
        console.log(output);
        this.colorCells(output);
        this.clickIndex = 0;
      }
      this.clickIndex++;
    }
  }

  selectCell(cell: Cell, color: string) {
    this.drawCell(cell, color);
  }

  findCell(cellToFind: Cell): number {
    for (let i = 0; i < this.cellMap.length; i++) {
      if (cellToFind.x <= this.cellMap[i].x + this.cellSize / 2 && cellToFind.x >= this.cellMap[i].x - this.cellSize / 2) {
        if (cellToFind.y <= this.cellMap[i].y + this.cellSize / 2 && cellToFind.y >= this.cellMap[i].y - this.cellSize / 2) {
          return i;
        }
      }
    }
    return null;
  }

  reset() {
    this.openList = [];
    this.closeList = [];
    this.map = [];
    this.start = null;
    this.end = null;
  }

  resetColor() {
    for (let cell of this.cellMap) {
      if (cell.type === 1) {
        this.drawCell(cell, "black");
      } else {
        this.drawCell(cell, "white");
      }
    }
  }

  bigReset() {
    this.cellMap = [];
    this.openList = [];
    this.closeList = [];
    this.map = [];
    this.start = null;
    this.end = null;
    this.creatMatrix();
  }

  init(map: Cell[], start: number, end: number) {
    this.reset();
    for (let i = 0; i < map.length; i++) {
      const node = { index: i, type: map[i].type, parent: null, g: null, h: null };
      if (start === i) {
        this.start = node;
      }
      if (end === i) {
        this.end = node;
      }
      this.map.push(node);
      if (node.type === 1) {
        this.addToCloseList(node, this.closeList);
      }
    }
    console.log('close list : ', this.closeList);
  }


  calculate(): Output {
    this.addToOpenList(this.start, this.openList, this.start);
    this.currentNode = this.findMinElementInList(this.openList);
    while (this.currentNode.index !== this.end.index) {
      this.currentNode = this.findMinElementInList(this.openList);
      this.removeFromlist(this.currentNode, this.openList);
      this.addToCloseList(this.currentNode, this.closeList);
      this.addNeightbours(this.currentNode, this.openList);
    }

    let path: number[] = [];
    while (this.currentNode.index !== this.start.index) {
      path.push(this.currentNode.index);
      this.currentNode = this.currentNode.parent;
    }

    return { openList: this.openList, closeList: this.closeList, path: path }

  }

  findMinElementInList(listNode: Node[]): Node {
    let min = listNode[0];
    for (let node of listNode) {
      if (node.h + node.g < min.h + min.g) {
        min = node;
      }
    }
    return min;
  }

  removeFromlist(nodeToFind: Node, listNode: Node[]) {

    let newList: Node[] = [];
    for (let i = 0; i < listNode.length; i++) {
      if (nodeToFind.index !== listNode[i].index) {
        newList.push(listNode[i])
      }
    }
    this.openList = newList;

  }

  addToOpenList(node: Node, listNode: Node[], parent: Node) {
    if (!this.idElementInList(node, this.closeList) && node.type === 0) {
      console.log('node add : ', node);
      node.parent = parent;
      this.calculG(node);
      this.calculH(node);
      listNode.push(node);
    }
  }

  addToCloseList(node: Node, listNode: Node[]) {
    listNode.push(node);
  }


  idElementInList(nodeToFind: Node, listNode: Node[]): boolean {
    for (let node of listNode) {
      if (nodeToFind.index === node.index) {
        return true;
      }
    }
    return false;
  }

  reverseList(listNode: Node[]) {

  }

  calculG(node: Node) {
    if (node.index === node.parent.index + 1 ||
      node.index === node.parent.index - 1 ||
      node.index === node.parent.index - Math.sqrt(this.map.length) ||
      node.index === node.parent.index + Math.sqrt(this.map.length)) {
      node.g = 10;
    } else {
      node.g = 14;
    }
  }

  calculH(node: Node) {
    const x1: number = node.index % Math.sqrt(this.map.length);
    const y1: number = Math.round(node.index / Math.sqrt(this.map.length));

    const x2: number = this.end.index % Math.sqrt(this.map.length);
    const y2: number = Math.round(this.end.index / Math.sqrt(this.map.length));
    node.h = (Math.abs(x1 - x2) + Math.abs(y1 - y2)) * 10;
  }


  addNeightbours(node: Node, listNode: Node[]) {

    if (node.index === 0) { //angle sup gauche
      this.addToOpenList(this.map[node.index + 1], listNode, node);
      this.addToOpenList(this.map[node.index + Math.sqrt(this.map.length)], listNode, node);
      this.addToOpenList(this.map[node.index + Math.sqrt(this.map.length) + 1], listNode, node);

    } else if (node.index === Math.sqrt(this.map.length) - 1) { //angle sup droit
      this.addToOpenList(this.map[node.index - 1], listNode, node);
      this.addToOpenList(this.map[node.index + Math.sqrt(this.map.length)], listNode, node);
      this.addToOpenList(this.map[node.index + Math.sqrt(this.map.length) - 1], listNode, node);

    } else if (node.index === this.map.length - Math.sqrt(this.map.length)) {//angle inf gauche
      this.addToOpenList(this.map[node.index + 1], listNode, node);
      this.addToOpenList(this.map[node.index - Math.sqrt(this.map.length)], listNode, node);
      this.addToOpenList(this.map[node.index - Math.sqrt(this.map.length) + 1], listNode, node);

    } else if (node.index === this.map.length - 1) {//angle inf droit
      this.addToOpenList(this.map[node.index - 1], listNode, node);
      this.addToOpenList(this.map[node.index - Math.sqrt(this.map.length)], listNode, node);
      this.addToOpenList(this.map[node.index - Math.sqrt(this.map.length) - 1], listNode, node);

    } else if (node.index % Math.sqrt(this.map.length) === 0) { // borne gauche
      this.addToOpenList(this.map[node.index + 1], listNode, node);
      this.addToOpenList(this.map[node.index + Math.sqrt(this.map.length)], listNode, node);
      this.addToOpenList(this.map[node.index - Math.sqrt(this.map.length)], listNode, node);
      this.addToOpenList(this.map[node.index + Math.sqrt(this.map.length) + 1], listNode, node);
      this.addToOpenList(this.map[node.index - Math.sqrt(this.map.length) + 1], listNode, node);

    } else if (node.index > 0 && node.index <= Math.sqrt(this.map.length)) {// borne superieur
      this.addToOpenList(this.map[node.index + 1], listNode, node);
      this.addToOpenList(this.map[node.index - 1], listNode, node);
      this.addToOpenList(this.map[node.index + Math.sqrt(this.map.length)], listNode, node);
      this.addToOpenList(this.map[node.index + Math.sqrt(this.map.length) + 1], listNode, node);
      this.addToOpenList(this.map[node.index + Math.sqrt(this.map.length) - 1], listNode, node);

    } else if (node.index > this.map.length - Math.sqrt(this.map.length) && node.index < this.map.length - 1) {// borne inferieur
      this.addToOpenList(this.map[node.index + 1], listNode, node);
      this.addToOpenList(this.map[node.index - 1], listNode, node);
      this.addToOpenList(this.map[node.index - Math.sqrt(this.map.length)], listNode, node);
      this.addToOpenList(this.map[node.index - Math.sqrt(this.map.length) + 1], listNode, node);
      this.addToOpenList(this.map[node.index - Math.sqrt(this.map.length) - 1], listNode, node);

    } else if ((node.index + 1) % Math.sqrt(this.map.length) === 0) {// borne droite
      this.addToOpenList(this.map[node.index - 1], listNode, node);
      this.addToOpenList(this.map[node.index + Math.sqrt(this.map.length)], listNode, node);
      this.addToOpenList(this.map[node.index - Math.sqrt(this.map.length)], listNode, node);
      this.addToOpenList(this.map[node.index + Math.sqrt(this.map.length) - 1], listNode, node);
      this.addToOpenList(this.map[node.index - Math.sqrt(this.map.length) - 1], listNode, node);

    } else {
      this.addToOpenList(this.map[node.index + 1], listNode, node);
      this.addToOpenList(this.map[node.index - 1], listNode, node);

      this.addToOpenList(this.map[node.index + Math.sqrt(this.map.length)], listNode, node);
      this.addToOpenList(this.map[node.index + Math.sqrt(this.map.length) + 1], listNode, node);
      this.addToOpenList(this.map[node.index + Math.sqrt(this.map.length) - 1], listNode, node);

      this.addToOpenList(this.map[node.index - Math.sqrt(this.map.length)], listNode, node);
      this.addToOpenList(this.map[node.index - Math.sqrt(this.map.length) + 1], listNode, node);
      this.addToOpenList(this.map[node.index - Math.sqrt(this.map.length) - 1], listNode, node);
    }

  }
}
