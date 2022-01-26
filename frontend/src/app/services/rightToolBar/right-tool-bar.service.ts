import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RightToolBarService {
  open: boolean = false;
  display: string = 'none';
  width: string = 'calc(90% - 78px)';
  constructor() { }
}
