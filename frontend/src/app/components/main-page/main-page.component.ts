import { Component } from '@angular/core';
import { IndexService } from 'src/app/services/index/index.service';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Message } from 'src/app/classes/message';

@Component({
    selector: 'app-main-page',
    templateUrl: './main-page.component.html',
    styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent {
    readonly title: string = 'LOG2990';
    message: BehaviorSubject<string> = new BehaviorSubject<string>('');

    constructor(private basicService: IndexService) { }
}
