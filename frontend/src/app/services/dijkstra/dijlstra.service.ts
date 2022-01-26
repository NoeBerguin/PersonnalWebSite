import { Injectable } from '@angular/core';

export interface DijkstraCell {
  x: number;
  y: number;
  connections: Connection[];

}

export interface Connection {
  DijkstraCellA: DijkstraCell;
  DijkstraCellB: DijkstraCell;
  value: number;
  parent: Connection;
}


@Injectable({
  providedIn: 'root'
})
export class DijlstraService {
  public ctx: CanvasRenderingContext2D;
  nbDijkstraCell: number = 20;
  matrix: DijkstraCell[] = [];
  DijkstraCellSize: number = 10;
  openList: Connection[] = [];
  closeList: Connection[] = [];
  click: number = 0;
  start: DijkstraCell = null;
  end: DijkstraCell = null;
  currentConnection: Connection = null;
  currentCell: DijkstraCell = null;

  constructor() { }

  setCanvas(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
    this.createMatrix();
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
      const DijkstraCell = { x: x, y: y, connections: [] };
      this.matrix.push(DijkstraCell);
      this.drawDijkstraCell(DijkstraCell, "black");
    }
  }

  drawDijkstraCell(DijkstraCell: DijkstraCell, color: string) {
    this.ctx.beginPath();
    this.ctx.arc(DijkstraCell.x, DijkstraCell.y, this.DijkstraCellSize, 0, 2 * Math.PI);
    this.ctx.stroke();
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
      this.ctx.stroke();
      const value = Math.round(Math.sqrt(Math.pow((this.matrix[i].x - this.matrix[index2].x), 2) + Math.pow((this.matrix[i].y - this.matrix[index2].y), 2)));
      console.log(value);
      const connection: Connection = { DijkstraCellA: this.matrix[i], DijkstraCellB: this.matrix[index2], value: value, parent: null };
      this.matrix[i].connections.push(connection);
      this.matrix[index2].connections.push(connection);
      this.setVallue(connection);
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
    const x: number = Math.min(connection.DijkstraCellA.x, connection.DijkstraCellB.x) + Math.abs(connection.DijkstraCellA.x - connection.DijkstraCellB.x) / 2 + 20;
    const y: number = Math.min(connection.DijkstraCellA.y, connection.DijkstraCellB.y) + Math.abs(connection.DijkstraCellA.y - connection.DijkstraCellB.y) / 2 + 20;
    this.ctx.font = "16px Arial";
    this.ctx.fillText(connection.value.toString(), x, y);
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
    const DijkstraCellIndex: number = this.findDijkstraCell({ x: event.clientX - bounds.left, y: event.clientY - bounds.top, connections: [] });
    this.drawDijkstraCell(this.matrix[DijkstraCellIndex], "blue");
    if (this.click === 1) {
      this.start = this.matrix[DijkstraCellIndex];
    } else if (this.click === 2) {
      this.end = this.matrix[DijkstraCellIndex];
      this.calculate(this.start, this.end);
      this.click = 0;
    }
  }

  reset() {
  }

  calculate(startDijkstraCell: DijkstraCell, endDijkstraCell: DijkstraCell) {
    this.currentCell = startDijkstraCell;
    this.addCellConnectionsToOpenList(this.currentCell, null);
    this.currentConnection = this.findMinConnection(this.openList);
    this.colorConnection(this.currentConnection, 'red');
    this.closeList.push(this.currentConnection);
    this.removeConnectionToOpenList(this.currentConnection);
    this.currentCell = this.findCurrentCell(this.currentConnection);

    let i = 0;
    while (this.currentCell !== endDijkstraCell && i < 3) {
      this.addCellConnectionsToOpenList(this.currentCell, this.currentConnection);
      this.currentConnection = this.findMinConnection(this.openList);
      this.colorConnection(this.currentConnection, 'red');
      this.closeList.push(this.currentConnection);
      this.removeConnectionToOpenList(this.currentConnection);
      this.currentCell = this.findCurrentCell(this.currentConnection);
      i++;
      console.log(i)
    }

    while (this.currentConnection.parent !== null) {
      this.colorConnection(this.currentConnection, 'blue');
      this.currentConnection = this.currentConnection.parent;
    }

  }

  findCurrentCell(connection: Connection) {
    if (this.currentCell === connection.DijkstraCellA) {
      return connection.DijkstraCellB;
    } else {
      return connection.DijkstraCellA;
    }
  }

  findMinConnection(list: Connection[]): Connection {
    let min: Connection = list[0];
    for (let i = 1; i < list.length; i++) {
      if (list[i].value > min.value) {
        min = list[i];
      }
    }
    return min;
  }

  addCellConnectionsToOpenList(cell: DijkstraCell, parentConnection: Connection) {
    for (let connection of cell.connections) {
      this.openList.push(connection);
      if (parentConnection !== null) {
        connection.value += parentConnection.value;
      }
      //this.colorConnection(connection, 'red');
    }
  }

  checkIsInCloseList(connectionToFind: Connection) {
    for (let connection of this.closeList) {
      if (connection === connectionToFind) {
        return true;
      }
    }
    return false;
  }

  removeConnectionToOpenList(connectionToFind: Connection) {
    let newList: Connection[] = [];
    for (let connection of this.openList) {
      if (connection !== connectionToFind) {
        newList.push(connection);
      }
    }
    this.openList = newList;
  }
}
