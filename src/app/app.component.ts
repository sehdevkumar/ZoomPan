import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as d3 from 'd3';

export type d3DragBehavior = d3.DragBehavior<Element, any, any>;

export type d3SelectionBase = d3.Selection<
  d3.BaseType,
  any,
  HTMLElement | any,
  any
>;

interface Point {
  x: number;
  y: number;
}

interface RectInstance {
  id?: string;
  x: number;
  y: number;
  w: number;
  h: number;
  topLeft?: Point;
  topRight?: Point;
  bottomLeft?: Point;
  bottomRight?: Point;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  boxes = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  view: d3SelectionBase | undefined | any;
  initialDraggedX = 0;
  initialDraggedY = 0;
  storeInstance: Array<RectInstance> = [];

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
      const x = d * 300;
      const y = 0;
      const w = 200;
      const h = 50;

      const grp: d3SelectionBase | any = boxGroup
        .append('g')
        .attr('class', 'group')
        .attr('transform', `translate(${0},${0})`);
      grp
        .append('rect')
        .attr('id', `rect-${d}`)
        .attr('x', x)
        .attr('y', y)
        .attr('width', w)
        .attr('height', h)
        .attr('fill', `#${d}f${d}b${d}c`);

      const rectInstance: RectInstance = this.getGenrated2DRect(x, y, w, h);
      rectInstance.id = `rect-${d}`;
      this.storeInstance.push(rectInstance);

      grp.datum({ x: 0, y: 0 }).call(this.dragcontainer());
    });
  }
  dragcontainer(): any {
    return d3
      .drag()
      .on('start', (d: any, i, n) => {
        console.log(d, i, n);
      })
      .on('drag', (d: any, i, n) => {
        if (!this.canRakeTranslate(d3.event.x, d3.event.y)) {
          return;
        }
        d.x = d3.event.x;
        d.y = d3.event.y;

        d3.select(n[i])
          .raise()
          .transition()
          .duration(10)
          .attr('cursor', 'move')
          .attr('transform', 'translate(' + d3.event.x + ',' + 0 + ')');

        d3.select(n[i]).node()?.lastElementChild?.setAttribute('stroke', 'red');
        d3.select(n[i])
          .node()
          ?.lastElementChild?.setAttribute('stroke-width', '5px');

        d3.select('.boxGroup')
          .transition()
          .duration(1500)

          .attr('transform', 'translate(' + -d3.event.x + ',' + 0 + ')');
      })
      .on('end', (d: any, i: number, n: any) => {
        const Mx = d3.event.x;

        const groupX = d3
          .select(n[i])
          .node()
          ?.lastElementChild?.getAttribute('x');
        const exactX: any | number | undefined = +groupX + Mx;
        const isLeftDirection = Mx < 0 ? true : false;
        const isRightDirection = Mx > 0 ? true : false;

        console.log(isLeftDirection, isRightDirection);
        let pickedInstances: Array<RectInstance> = [];
        if (isLeftDirection) {
          pickedInstances = pickedInstances = this.storeInstance.filter(
            (ins) => ins.x <= exactX
          );
        }

        if (isRightDirection) {
          pickedInstances = this.storeInstance.filter((ins) => ins.x >= exactX);
        }

        d.x = 0;
        d.y = 0;
        d3.select(n[i])
          .raise()
          .classed('activeClassDragElement', false)
          .transition()
          .duration(1000)

          .attr('transform', 'translate(' + -d.x + ',' + 0 + ')');
        d3.select('.boxGroup')
          .transition()
          .duration(1500)

          .attr('transform', 'translate(' + d.x + ',' + 0 + ')');
      });
  }

  // tslint:disable-next-line:typedef
  doOverlap(
    l1: Point | any,
    r1: Point | any,
    l2: Point | any,
    r2: Point | any
  ) {
    // if rectangle has area 0, no overlap
    if (l1.x === r1.x || l1.y === r1.y || r2.x === l2.x || l2.y === r2.y) {
      return false;
    }

    // If one rectangle is on left side of other
    if (l1.x > r2.x || l2.x > r1.x) {
      return false;
    }

    // If one rectangle is above other
    if (r1.y > l2.y || r2.y > l1.y) {
      return false;
    }

    return true;
  }

  // tslint:disable-next-line:typedef
  canRakeTranslate(x: number, y: number) {
    if (x > 3000) {
      return false;
    } else if (x < -800) {
      return false;
    }

    return true;
  }

  getGenrated2DRect(x: number, y: number, w: number, h: number): RectInstance {
    return {
      x,
      y,
      w,
      h,
      topLeft: { x, y },
      topRight: { x: x + w, y },
      bottomLeft: { x, y: y + h },
      bottomRight: { x: x + w, y: y + h },
    };
  }
  // tslint:disable-next-line:typedef
  isEmpty(x: number | undefined): boolean {
    return x === undefined || x === null;
  }
}
