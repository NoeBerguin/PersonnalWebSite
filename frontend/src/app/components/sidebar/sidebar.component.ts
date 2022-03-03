import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RightToolBarService } from 'src/app/services/rightToolBar/right-tool-bar.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  sidebar = document.getElementsByClassName('sidebar');
  closeBtn = document.querySelector('#btn');
  searchBtn = document.querySelector('.bx-search');
  stateOpenSideBar = false;
  toolBar = false;

  constructor(private rightToolBarService: RightToolBarService) { }

  ngOnInit(): void { }

  ngAfterViewInit() {
    this.sidebar = document.getElementsByClassName('sidebar');
  }

  openSidebar() {
    if (this.sidebar != null) {
      for (let i = 0; i < this.sidebar.length; i++) {
        this.sidebar[i].classList.contains('open')
          ? this.sidebar[i].classList.remove('open')
          : this.sidebar[i].classList.add('open');
      }
    }
    this.menuBtnChange();
  }

  menuBtnChange() {
    if (this.sidebar != null && this.closeBtn != null) {
      for (let i = 0; i < this.sidebar.length; i++) {
        if (this.sidebar[i].classList.contains('open')) {
          this.closeBtn.classList.replace('bx-menu', 'bx-menu-alt-right');
        } else {
          this.closeBtn.classList.replace('bx-menu-alt-right', 'bx-menu');
        }
      }
    }
  }

  openToolBar() {
    
    //this.toolBar = true;
    this.rightToolBarService.open = true;
    this.rightToolBarService.display = 'block';
    this.rightToolBarService.width = 'calc(90% - 78px)';
  }

  closeToolBar() {
    this.rightToolBarService.open = false;
    this.rightToolBarService.display = 'none';
    this.rightToolBarService.width = 'calc(100% - 78px)';
  }
}
