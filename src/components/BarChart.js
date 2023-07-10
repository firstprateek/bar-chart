import {LitElement, html, css} from 'lit';
import {styleMap} from 'lit/directives/style-map.js';

/**
 * Bar Chart: <bar-chart></bar-chart>.
 * 
 * A widget that renders a bar chart with ordinal values in the x-axis and numerical values in y-axis.
 *
 * @property width - Number. width of the widget in pixels, default value is 460
 * @property height - Number. height of the widget in pixels, default value is 400
 * @property data - Array. An array of objects. Each object should be of the form { "group": <group_str>, "value": <number> }, default value is []
 * @property min - Number. Min range value for the y-axis. Default is 0
 * @property max - Number. Max range value for the y-axis. Default is the max "value" in the data stream
 * @property dataApi - String. URL for retrieving the data
 * @property updateFrequency - Number. Seconds after which the chart data should be auto-updated, default is 60 seconds
 * @property autoUpdate - Boolean. Seconds after which the chart data should be auto-updated, default is 60 seconds
 * 
 * @fires updated - Indicates when the chart was auto-updated
 * 
 * @cssproperty --bar-chart-background-color - background color of the poll, default is white
 * @cssproperty --bar-chart-bar-color - background color for the individual bars, default is #69B3A2
 * @cssproperty --bar-chart-axis-color - color of the axis, default is black
 * @cssproperty --bar-chart-text-color - color of the axis text, default is black
 */


export default class BarChart extends LitElement {
    static styles = css`
        :host {
            --background-color: var(--bar-chart-background-color, white);
            --bar-color: var(--bar-chart-bar-color, #69B3A2);
            --axis-color: var(--bar-chart-axis-color, black);
            --text-color: var(--bar-chart-text-color, black);
        }
    `;

    static properties = {
        width: {type: Number},
        height: {type: Number},
        data: {type: Array},
        min: {type: Number},
        max: {type: Number},
        transitionDuration: {type: Number},
        dataAPI: {},
        updateFrequency: {type: Number},
        autoUpdate: {type: Boolean}
    }

    constructor() {
        super();
        // Reactive properties
        this.width = 460;
        this.height = 400;
        this.data = [];
        this.min = 0;
        this.max = 20;
        this.transitionDuration = 1000;
        this.dataAPI = "";
        this.updateFrequency = 60;
        this.autoUpdate = false;

        // Non-Reactive properties
        this._data1 = [
            {group: "A", value: 4},
            {group: "B", value: 16},
            {group: "C", value: 8}
        ];
        this._data2 = [
            {group: "A", value: 7},
            {group: "B", value: 1},
            {group: "C", value: 20}
        ];
        this._SVG = null;
        this._x = null;
        this._y = null;
        this._width = null;
        this._height = null;
    }

    async connectedCallback() {
        super.connectedCallback();
        if (this.dataAPI) {
            await this.fetchResults();

            if (this.autoUpdate) {
                this.setupUpdateTimer();
            }
        }
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        if (this.autoUpdate) {
            this.removeUpdateTimer();
        }
    }

    setupUpdateTimer() {
        if (!this._timer) {
            this._timer = setInterval(() => this.fetchResults(), this.updateFrequency * 1000);
        }
    }

    removeUpdateTimer() {
        clearInterval(this._timer);
        delete this._timer;
    }

    async fetchResults() {
        const response = await fetch(this.dataAPI);
        const result = await response.json();

        this.updateView(result);
    }

    updateView(result) {
        this.max = result.max;
        this.min = result.min;
        this.data = result.data;

        const options = {
            detail: {
                ...result
            },
            bubbles: true,
            composed: true
        }

        this.dispatchEvent(new CustomEvent('updated', options));
    }

    updated(changedProperties) {
        // Set the dimensions and margins of the graph
        const margin = {top: 30, right: 30, bottom: 70, left: 60};
        this._width = this.width - margin.left - margin.right;
        this._height = this.height - margin.top - margin.bottom;
        
        this._data1 = this.data;
        
        // Append the SVG object to the body of the page
        if (!this._SVG) {
            this._SVG = d3.select(this.containerDiv)
            .append("svg")
                .attr("width", this._width + margin.left + margin.right)
                .attr("height", this._height + margin.top + margin.bottom)
            .append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);
        }

        this._SVG.selectAll('g').remove();
        
        // X axis
        this._x = d3.scaleBand()
        .range([ 0, this._width ])
        .domain(this._data1.map(d => d.group))
        .padding(0.2);
        this._SVG.append("g")
        .attr("transform", `translate(0,${this._height})`)
        .call(d3.axisBottom(this._x))
        
        // Add Y axis
        this._y = d3.scaleLinear()
        .domain([this.min, this.max])
        .range([ this._height, 0]);
        this._SVG.append("g")
        .attr("class", "myYaxis")
        .call(d3.axisLeft(this._y));
        
        // Initialize the plot with the first dataset
        this.updateChart(this._data1)
    }

    get containerDiv() {
        return this.renderRoot?.querySelector('#my_dataviz') ?? null;
    }

    render() {
        const styles = styleMap({ width: `${this.width}px`, height: `${this.height}px` });

        return html`
            <div style=${styles} id="my_dataviz"></div>
        `;
    }

    updateChart(data) {
        // A function that create / update the plot for a given variable:
        var u = this._SVG.selectAll("rect")
            .data(data)
        
        u
            .join("rect")
            .transition()
            .duration(this.transitionDuration)
            .attr("x", d => this._x(d.group))
            .attr("y", d => this._y(d.value))
            .attr("width", this._x.bandwidth())
            .attr("height", d => this._height - this._y(d.value))
            .attr("fill", "#69b3a2")
    }
}

customElements.define('bar-chart', BarChart);
