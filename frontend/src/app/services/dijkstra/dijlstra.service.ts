import { Injectable } from '@angular/core';

export interface DijkstraCell {
  x: number;
  y: number;
  parent: DijkstraCell;
  value: number;
  connection: DijkstraCell[];

}

export interface Connection {
  DijkstraCellA: DijkstraCell;
  DijkstraCellB: DijkstraCell;
  value: number;
}


@Injectable({
  providedIn: 'root'
})
export class DijlstraService {
  public ctx: CanvasRenderingContext2D;
  nbDijkstraCell: number = 4;
  matrix: DijkstraCell[] = [];
  DijkstraCellSize: number = 10;
  openList: DijkstraCell[] = [];
  closeList: DijkstraCell[] = [];
  click: number = 0;
  start: DijkstraCell = null;
  end: DijkstraCell = null;
  currentConnection: Connection = null;
  currentCell: DijkstraCell = null;
  listConnection: Connection[] = [];

  constructor() { }

  reset() {
    this.matrix = [];
    this.openList = [];
    this.closeList = [];
    this.end = null;
    this.start = null;
    this.listConnection = [];
    this.click = 0;
    this.currentCell = null;
    this.currentConnection = null;
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.createMatrix();
    this.connectDijkstraCells();
    this.Prim();
  }

  Prim(){
    let currentCell = this.matrix[0];
    let tree : DijkstraCell[] = [];
    tree.push(currentCell);
    for(let i =0; i< this.matrix.length ; i++){
      let minCell = null;
      let minDistance = 10000; 
      for(let cell of this.matrix){
        if(this.isCellAlreadyInTree(tree, cell)){
          const distance = this.findDistanceCell(currentCell, cell);
          if(minCell === null){
            minDistance = distance;
            minCell = cell;
          }else if(distance < minDistance){
            minCell = cell;
            minDistance = distance;
          }
        }
      }
      if(minCell !== null){
        console.log('add connection', minCell, currentCell)
        tree.push(minCell)
        const connection: Connection = { DijkstraCellA: currentCell,
           DijkstraCellB: minCell, value: (minDistance) };
        this.colorConnection(connection, "black");
        this.listConnection.push(connection);
        //this.setVallue(connection);
        currentCell.connection.push(minCell);
        minCell.connection.push(currentCell);
        currentCell = minCell;
      }
    }
    console.log(tree);
  }

  isCellAlreadyInTree(tree : DijkstraCell[], cellToFind : DijkstraCell){
    for(let cell of tree){
      if(cell.x === cellToFind.x && cell.y === cellToFind.y){
        return false
      }
    }
    return true;
  }

  findDistanceCell(currentCell: DijkstraCell, cell: DijkstraCell){
    return Math.sqrt(Math.pow(currentCell.x- cell.x, 2) + Math.pow(currentCell.y - cell.y, 2));
  }

  setCanvas(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
    this.createMatrix();
    this.Prim();
    this.connectDijkstraCells();
  }

  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }

  createMatrix() {
    for (let i = 0; i < this.nbDijkstraCell; i++) {
      const x = this.getRandomInt(0 + this.ctx.canvas.width * 0.05, this.ctx.canvas.width);
      const y = this.getRandomInt(0 + this.ctx.canvas.height * 0.05, this.ctx.canvas.height);
      const DijkstraCell = { x: x, y: y, parent: null, value: null, connection: [] };
      this.matrix.push(DijkstraCell);
      this.drawDijkstraCell(DijkstraCell, "black");
      this.setIndexName(DijkstraCell);
    }
  }

  drawDijkstraCell(DijkstraCell: DijkstraCell, color: string) {
    this.ctx.beginPath();
    this.ctx.arc(DijkstraCell.x, DijkstraCell.y, this.DijkstraCellSize, 0, 2 * Math.PI);
    this.ctx.stroke();
    this.ctx.strokeStyle = color;
    this.ctx.fillStyle = color;
    this.ctx.fill();
  }

  connectDijkstraCells() {
    for (let i = 0; i < this.nbDijkstraCell; i++) {
      let index2 = this.getRandomInt(0, this.matrix.length);
      if (index2 === i) {
        while (index2 === i) {
          index2 = this.getRandomInt(0, this.matrix.length);
        }
      }
      this.ctx.beginPath();
      this.ctx.moveTo(this.matrix[i].x, this.matrix[i].y);
      this.ctx.lineTo(this.matrix[index2].x, this.matrix[index2].y);
      this.ctx.lineWidth = 1;
      this.ctx.strokeStyle = "black";
      this.ctx.stroke();
      this.matrix[i].connection.push(this.matrix[index2]);
      this.matrix[index2].connection.push(this.matrix[i]);
      const value = (Math.sqrt(Math.pow((this.matrix[i].x - this.matrix[index2].x), 2) + Math.pow((this.matrix[i].y - this.matrix[index2].y), 2)));
      const connection: Connection = { DijkstraCellA: this.matrix[i], DijkstraCellB: this.matrix[index2], value: value };
      this.listConnection.push(connection);
      //this.setVallue(connection);
    }
  }

  colorConnection(conenction: Connection, color: string) {
    this.ctx.beginPath();
    this.ctx.moveTo(conenction.DijkstraCellA.x, conenction.DijkstraCellA.y);
    this.ctx.lineTo(conenction.DijkstraCellB.x, conenction.DijkstraCellB.y);
    this.ctx.lineWidth = 3;
    this.ctx.strokeStyle = color;
    this.ctx.stroke();
  }

  setVallue(connection: Connection) {
    this.ctx.fillStyle = "black";
    const x: number = Math.min(connection.DijkstraCellA.x, connection.DijkstraCellB.x) + Math.abs(connection.DijkstraCellA.x - connection.DijkstraCellB.x) / 2 + 20;
    const y: number = Math.min(connection.DijkstraCellA.y, connection.DijkstraCellB.y) + Math.abs(connection.DijkstraCellA.y - connection.DijkstraCellB.y) / 2 + 20;
    this.ctx.font = "16px Arial";
    this.ctx.fillText(connection.value.toString(), x, y);
  }

  setIndexName(cell: DijkstraCell) {
    this.ctx.fillStyle = "red";
    this.ctx.font = "19px Arial";
    this.ctx.fillText(this.findDijkstraCell(cell).toString(), cell.x + 15, cell.y);
  }

  findDijkstraCell(DijkstraCellToFind: DijkstraCell): number {
    for (let i = 0; i < this.matrix.length; i++) {
      if (DijkstraCellToFind.x <= this.matrix[i].x + this.DijkstraCellSize && DijkstraCellToFind.x >= this.matrix[i].x - this.DijkstraCellSize) {
        if (DijkstraCellToFind.y <= this.matrix[i].y + this.DijkstraCellSize && DijkstraCellToFind.y >= this.matrix[i].y - this.DijkstraCellSize) {
          return i;
        }
      }
    }
    return null;
  }

  mouseClick(event: MouseEvent): void {
    this.click++;
    const bounds = this.ctx.canvas.getBoundingClientRect();
    const DijkstraCellIndex: number = this.findDijkstraCell({ x: event.clientX - bounds.left, y: event.clientY - bounds.top, parent: null, value: null, connection: [] });
    this.drawDijkstraCell(this.matrix[DijkstraCellIndex], "blue");
    if (this.click === 1) {
      this.start = this.matrix[DijkstraCellIndex];
    } else if (this.click === 2) {
      this.end = this.matrix[DijkstraCellIndex];
      this.calculate(this.start, this.end);
    }
    else {
      this.reset();
    }
  }



  calculate(startDijkstraCell: DijkstraCell, endDijkstraCell: DijkstraCell) {
    this.currentCell = startDijkstraCell;
    this.currentCell.value = 0;
    this.currentCell.parent = this.currentCell;
    this.openList.push(this.currentCell);
    const startDijkstraCellIndex: number = this.findDijkstraCell(startDijkstraCell);
    console.log('start index: ', startDijkstraCellIndex);
    console.log(startDijkstraCell);
    const endDijkstraCellIndex: number = this.findDijkstraCell(endDijkstraCell);
    console.log('end index: ', endDijkstraCellIndex);
    console.log(endDijkstraCell);

    let i = 0;
    while (this.currentCell !== endDijkstraCell && this.openList.length > 0) {
      this.currentCell = this.findMinCellValue();
      this.drawDijkstraCell(this.currentCell, "red");
      this.removeCellToOpenList(this.currentCell)
      this.closeList.push(this.currentCell);
      this.addNeighboursToOpenList(this.currentCell);
      i++;
    }
    console.log('lase current cell ',this.currentCell);

    
      while (this.currentCell !== startDijkstraCell) {
        console.log(1);
        const DijkstraCellIndex: number = this.findDijkstraCell(this.currentCell);
        console.log('index: ', DijkstraCellIndex);
        console.log(this.currentCell);
        this.drawDijkstraCell(this.currentCell, "green");
        this.colorConnection(this.findConnection(this.currentCell, this.currentCell.parent), "green");
        this.currentCell = this.currentCell.parent;
      }
    

  }

  findMinCellValue(): DijkstraCell {
    let min: DijkstraCell = this.openList[0];
    for (let i = 1; i < this.openList.length; i++) {
      if (this.openList[i].value < min.value) {
        min = this.openList[i];
      }
    }
    return min;
  }

  addNeighboursToOpenList(cell: DijkstraCell) {
    for (let cellNeighbour of cell.connection) {
      if (!this.checkIsInList(cellNeighbour, this.closeList) && !this.checkIsInList(cellNeighbour, this.openList)) {
        this.openList.push(cellNeighbour);
      }

      if (!this.checkIsInList(cellNeighbour, this.closeList)) {
        this.setValue(cellNeighbour, this.currentCell);
      }
    }
  }

  setParent(children: DijkstraCell, parent: DijkstraCell) {
    children.parent = parent;
  }

  setValue(children: DijkstraCell, parent: DijkstraCell) {
    let connectionValue = this.findConnectionValue(children, parent);
    if (connectionValue >= 0) {
      const newValue = parent.value + connectionValue;
      if (children.value === null) {
        children.value = newValue;
        this.setParent(children, parent);
      }
      else if (newValue < children.value) {
        children.value = newValue;
        this.setParent(children, parent);
      }
    }
  }

  findConnectionValue(cellA: DijkstraCell, cellB: DijkstraCell): number {
    let connection = null;
    for (let con of this.listConnection) {
      if ((con.DijkstraCellA === cellA && con.DijkstraCellB === cellB) || (con.DijkstraCellA === cellB && con.DijkstraCellB === cellA)) {
        connection = con;
        break;
      }
    }
    if (connection !== null) {
      return connection.value;
    }
    else {
      return -1;
    }
  }

  findConnection(cellA: DijkstraCell, cellB: DijkstraCell): Connection {
    for (let con of this.listConnection) {
      if ((con.DijkstraCellA === cellA && con.DijkstraCellB === cellB) || (con.DijkstraCellA === cellB && con.DijkstraCellB === cellA)) {
        return con;
      }
    }
    return null;
  }


  checkIsInList(cellToFind: DijkstraCell, list: DijkstraCell[]) {
    for (let cell of list) {
      if (cell === cellToFind) {
        return true;
      }
    }
    return false;
  }

  removeCellToOpenList(cellToFind: DijkstraCell) {
    let newList: DijkstraCell[] = [];
    for (let cell of this.openList) {
      if (cell !== cellToFind) {
        newList.push(cell);
      }
    }
    this.openList = newList;
  }
}
