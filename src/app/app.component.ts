import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as d3 from 'd3';

export type d3DragBehavior = d3.DragBehavior<Element, any, any>;

export type d3SelectionBase = d3.Selection<
  d3.BaseType,
  any,
  HTMLElement | any,
  any
>;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit, OnInit {
  boxes = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  view: d3SelectionBase | undefined | any;

  constructor() {}

  ngAfterViewInit(): void {
    this.drawArea();
  }

  // tslint:disable-next-line:typedef
  drawArea() {
    const w = 600 * this.boxes?.length;
    const h = 600;
    this.view = d3
      .select('.boxes-container')
      .append('svg')

      .attr('version', '1.1')
      .attr('xmlns', 'http://www.w3.org/2000/svg')
      .attr('xmlns:xlink', 'http://www.w3.org/1999/xlink')
      .attr('xmlns:xhtml', 'http://www.w3.org/1999/xhtml')
      .attr('width', w + 'px')
      .attr('preserveAspectRatio', 'xMinYMin meet')
      .style('background-color', 'transparent')
      .style('border-radius', 'inherit')
      .attr('height', h + 'px');
    // .attr('viewBox', `0 0 ${w} ${h}`);

    this.drawBoxes();
  }

  // tslint:disable-next-line:typedef
  drawBoxes() {
    const boxGroup: d3SelectionBase = this.view
      .append('g')
      .attr('class', 'boxGroup');

    this.boxes.forEach((d) => {
      // tslint:disable-next-line:prefer-const
      let grp: d3SelectionBase | any = boxGroup
        .append('g')
        .attr('class', 'group');
      grp
        .append('rect')
        .attr('x', d * 300)
        .attr('y', 0)
        .attr('width', 200)
        .attr('height', 50)
        .attr('fill', `#${d}f${d}b${d}c`);

      grp.datum({ x: 0, y: 0 }).call(this.dragcontainer());
    });
  }
  dragcontainer(): any {
    return d3.drag().on('drag', (d, i, n) => {
      console.log(d, i, n, n[i]);

      d3.select(n[i]).attr(
        'transform',
        'translate(' + d3.event.x + ',' + d3.event.y + ')'
      );
    });
  }

  ngOnInit(): void {}
}
