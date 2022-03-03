import { Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {

  // Get the modal
  modal: HTMLElement;
  // Get the <span> element that closes the modal
  span: HTMLElement;
  url: string;
  display: string = 'block';
  constructor(private router: Router) {
    console.log(this.router.url);
    if (this.router.url === "/dijkstra") {
      this.url = "../../../assets/dijkstra.jpg";
    }
    else if (this.router.url === "/algorithme") {
      this.url = "../../../assets/AstarDraw.jpg";
    }
    else if (this.router.url === "/spaceInvaders") {
      this.url = "../../../assets/gameNotice.jpg";
    }
  }

  ngOnInit(): void {

  }

  onclick(){
    this.display = "none";
  }

  ngAfterViewInit(): void {
    console.log('init')
    this.modal = document.getElementById("myModal") as HTMLElement;

    // Get the <span> element that closes the modal
    this.span = document.getElementsByClassName("close")[0] as HTMLElement;

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = (event) => {
      if (event.target === this.modal) {
        this.display = "none";
      }
    }
  }
}
