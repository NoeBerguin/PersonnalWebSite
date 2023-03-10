import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { HorizonService } from 'src/app/services/horizon/horizon.service';
interface Algorithme {
  value: number;
  viewValue: string;
}
@Component({
  selector: 'app-horizon',
  templateUrl: './horizon.component.html',
  styleUrls: ['./horizon.component.scss']
})
export class HorizonComponent implements OnInit {
  @ViewChild('myCanvas', { static: false }) myCanvas: ElementRef;

  public ctx: CanvasRenderingContext2D;
  displayedColumns: string[] = ['x', 'y'];
  dataSource = [];
  fileUrl;
  algo: Algorithme[] = [
    { value: 1, viewValue: 'Naif' },
    { value: 2, viewValue: 'Diviser pour reigner' },
    { value: 3, viewValue: 'hybride' },
  ];
  public displayChart = 'none';
  public displayBuilding = 'block';


  constructor(public horizonService: HorizonService, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.ctx = this.myCanvas.nativeElement.getContext('2d');
    this.ctx.canvas.width = window.innerWidth * 0.75;
    this.ctx.canvas.height = window.innerHeight * 0.95;
    this.horizonService.setCanvas(this.ctx);
    this.dataSource = this.horizonService.listCriticPoints;
    this.generateFileTxt();
  }

  showPlot() {
    if (this.displayChart === 'block') {
      this.displayChart = 'none';
      this.displayBuilding = 'block';
    } else {
      this.displayChart = 'block';
      this.displayBuilding = 'none';
    }
  }

  generateFileTxt() {
    let output: string = '';
    for (let point of this.dataSource) {
      output += point.x.toString() + ' ' + point.y.toString() + '\n';
    }
    const blob = new Blob([output], { type: 'application/octet-stream' });
    this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));
  }

  reset() {
    this.horizonService.reset();
    this.dataSource = this.horizonService.listCriticPoints;
  }

  changeNbBuildings(event: any) {
    this.horizonService.changeNbBuildings(event.value);
    this.reset();
  }

  showCriticsPoints() {
    this.horizonService.showCriticsPoints();
  }

  download() {

  }

  calculSolution() {
    this.horizonService.calculSolution(1);
    this.dataSource = this.horizonService.listCriticPoints;
  }


}
