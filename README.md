# bar-chart

A customizable web component that plots a bar chart with ordinal values in the x axis and numerical values in y axis.
The web component is built using [LIT](https://lit.dev/) and the chart is rendered using [D3](https://d3js.org/)
The widget can render real-time data.

## Live Demo

[Demo](https://firstprateek.github.io/bar-chart/)

## Installation

```bash
npm install @firstprateek/bar-chart --save
```

## Usage

### Properties

1. width - Number. width of the widget in pixels, default value is 460
2. height - Number. height of the widget in pixels, default value is 400
3. data - Array. An array of objects. Each object should be of the form { "group": <group_str>, "value": <number> }, default value is []
4. min - Number. Min range value for the y-axis. Default is 0
5. max - Number. Max range value for the y-axis. Default is the max "value" in the data stream
6. transitionDuration - Number. Time taken to transition from one data value to another in ms. Default is 1000
7. dataApi - String. URL for retrieving the data
8. updateFrequency - Number. Seconds after which the chart data should be auto-updated, default is 60 seconds
9. autoUpdate - Boolean. Seconds after which the chart data should be auto-updated, default is 60 seconds

### Events

1. updated - Indicates when the chart was auto-updated

### CSS variables

1. --bar-chart-background-color - background color of the poll, default is white
2. --bar-chart-bar-color - background color for the individual bars, default is #69B3A2
3. --bar-chart-axis-color - color of the axis, default is black
4. --bar-chart-text-color - color of the axis text, default is black

### Example

```js
// In index.js
import BarChart from '@firstprateek/bar-chart';
```

```jsx
<!DOCTYPE html>
<head>
    <script src="./index.js"></script>
    <script src="https://d3js.org/d3.v6.js"></script>
</head>
<body>
    <bar-chart
        width="500" 
        height="440" 
        data='[{"group":"A","value":10},{"group":"B","value":19},{"group":"C","value":8}]'
        min="0"
        max="20"
    ></bar-chart>
</body>
</html>
```

## Note

```
Data needs to be in the following format:
[
    {'group': 'group1', 'value': 1},
    {'group': 'group2', 'value': 2},
    {'group': 'group3', 'value': 3},
    ...
]
```

D3 library is not bundled with this widget. Make sure that the D3 library is available in your webpage.
For example, see the example section above where D3 is downloaded via CDN using the script tag.
