import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as d3 from 'd3';
import { Selection, zoom } from 'd3';
type d3DragBehavior = d3.DragBehavior<Element, any, any>;
type d3SelectionBase = d3.Selection<d3.BaseType, any, HTMLElement | any, any>;
@Component({
  selector: 'app-axis-domain-range',
  templateUrl: './axis-domain-range.component.html',
  styleUrls: ['./axis-domain-range.component.scss'],
})
export class AxisDomainRangeComponent implements OnInit, AfterViewInit {
  view!: d3SelectionBase;
  width: number = 0;
  height: number = 0;
  xLinear: any;
  yLinear: any;
  xAxis: any;
  yAxis: any;
  xAxisGroup!: d3SelectionBase | any;
  yAxisGroup!: d3SelectionBase | any;
  zoom!: d3.ZoomBehavior<Element, unknown | any>;
  viewGroup!: d3SelectionBase | any;
  rectGroup!: d3SelectionBase | any;

  constructor() {}
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.getDrawAxis();
    });
    this.zoomRegistered();
  }

  ngOnInit(): void {}

  getDrawAxis() {
    // select the SVG Group
    this.view = d3
      .select('svg')
      .on('dblclick.zoom', null)
      .call(this.zoom as any);
    this.width = +this.view.attr('width');
    this.height = +this.view.attr('height');
    this.view
      .append('svg')
      .attr('version', '1.1')
      .attr('xmlns', 'http://www.w3.org/2000/svg')
      .attr('xmlns:xlink', 'http://www.w3.org/1999/xlink')
      .attr('xmlns:xhtml', 'http://www.w3.org/1999/xhtml')
      .attr('viewBox', `0 0 ${this.width} ${this.height}`)
      .attr('preserveAspectRatio', 'xMinYMin meet')
      .style('background-color', 'transparent')
      .style('border-radius', 'inherit');

    this.viewGroup = this.view.append('g').attr('class', 'viewGroup');
    this.rectGroup = this.view.append('g').attr('class', 'rectGroup');

    const viewRect = this.rectGroup
      .append('rect')
      .attr('class', 'viewRect')
      .attr('x', 0.5)
      .attr('y', 0.5)
      .attr('fill', 'red')
      .attr('width', this.width - 1)
      .attr('height', this.height - 1);

    this.xLinear = d3
      .scaleLinear()
      .domain([-1, this.width])
      .range([-1, this.width]);

    this.yLinear = d3
      .scaleLinear()
      .domain([-1, this.height + 1])
      .range([-1, this.height + 1]);

    this.xAxis = d3.axisBottom(this.xLinear).ticks(10).tickSize(10);

    this.yAxis = d3.axisRight(this.yLinear).ticks(10).tickSize(10);

    this.xAxisGroup = this.viewGroup
      .append('g')
      .attr('class', 'axis axis--x')
      .call(this.xAxis);

    this.yAxisGroup = this.viewGroup
      .append('g')
      .attr('class', 'axis axis--y')
      .call(this.yAxis);
  }

  zoomRegistered() {
    this.zoom = d3
      .zoom()
      .scaleExtent([0.1, 90])
      .translateExtent([
        [-1000, -1000],
        [1000, 1000],
      ])
      .on('zoom', () => this.zoomed());
  }

  zoomed() {
    this.rectGroup.attr('transform', d3.event.transform?.toString());

    this.xAxisGroup.call(
      this.xAxis.scale(d3.event.transform.rescaleX(this.xLinear))
    );
    this.yAxisGroup.call(
      this.yAxis.scale(d3.event.transform.rescaleY(this.yLinear))
    );
  }
}
