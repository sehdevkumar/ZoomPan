import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  dragList: Array<string> = [
    'Drag1',
    'Drag2',
    'Drag3',
    'Drag4',
    'Drag5',
    'Drag6',
  ];

  dropList: Array<string> = [];

  // tslint:disable-next-line:typedef
  onDrop(event: CdkDragDrop<Array<string>>) {
    // moveItemInArray(
    //   event.container.data,
    //   event.previousIndex,
    //   event.currentIndex
    // );
    console.log(event);
  }
}
