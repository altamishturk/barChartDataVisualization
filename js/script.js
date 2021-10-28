const url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json';

let data = undefined;
let values = undefined;
let heightScale = undefined;
let xScale = undefined;
let xAxisScale = undefined;
let yAxisScale = undefined;

const width = 800;
const height = 600;
const padding = 40;


let svg = d3.select('svg')

let drawCanvas = () => {
    svg.attr('width', width)
    svg.attr('height', height)
}

let generateScales = () => {

    heightScale = d3.scaleLinear()
        .domain([0, d3.max(values, value => value[1])])
        .range([0, height - (padding * 2)])

    xScale = d3.scaleLinear()
        .domain([0, values.length - 1])
        .range([padding, width - padding])

    let datesArray = values.map(value => new Date(value[0]));
    // console.log(datesArray);

    xAxisScale = d3.scaleTime()
        .domain([d3.min(datesArray), d3.max(datesArray)])
        .range([padding, width - padding])


    yAxisScale = d3.scaleLinear()
        .domain([0, d3.max(values, value => value[1])])
        .range([height - padding, padding])
}


let drawBars = () => {

    let tooltip = d3.select('body')
        .append('div')
        .attr('id', 'tooltip')
        .style('visibility', 'hidden')
        .style('width', 'auto')
        .style('height', 'auto')

    svg.selectAll('rect')
        .data(values)
        .enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('width', (width - (padding * 2)) / values.length)
        .attr('data-date', (d) => d[0])
        .attr('data-gdp', (d) => d[1])
        .attr('height', (d) => heightScale(d[1]))
        .attr('x', (d, i) => xScale(i))
        .attr('y', (d) => {
            return (height - padding) - heightScale(d[1])
        })
        .on('mouseover', (d) => {
            tooltip.transition()
                .style('visibility', 'visible')


            document.querySelector('#tooltip').innerHTML = `
            <div class="date">
            <strong>
            Date: 
            </strong>
            ${d.target.__data__[0]}
            </div>
            <div class="gdp">
            <strong>
            GDP: 
            </strong>
            ${d.target.__data__[1]} Billion
            </div>`;
            document.querySelector('#tooltip').setAttribute('data-date', d.target.__data__[0])
        })
        .on('mouseout', (d) => {
            tooltip.transition()
                .style('visibility', 'hidden')
        })
}

let generateAxes = () => {
    let xAxis = d3.axisBottom(xAxisScale);
    let yAxis = d3.axisLeft(yAxisScale);

    svg.append('g')
        .call(xAxis)
        .attr('id', 'x-axis')
        .style('color', 'white')
        .attr('transform', 'translate(0,' + (height - padding) + ')')

    svg.append('g')
        .call(yAxis)
        .attr('id', 'y-axis')
        .style('color', 'white')
        .attr('transform', 'translate(' + padding + ',0)')


}

// get request for fetching data 
fetch(url)
    .then(res => res.json())
    .then(res => {
        data = res;
        values = data.data;
        // console.log(data);
        // console.log(values);

        drawCanvas();
        generateScales();
        drawBars();
        generateAxes();
    });


