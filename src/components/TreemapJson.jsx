import * as d3 from "d3";
import * as d3plus from "d3plus";
import * as d3text from "d3plus-text"
import { useEffect, useRef, useState } from "react";
import top50 from '../top50.json'

const TreemapJson = () => {
    const ref = useRef();
    // let [size, setSize] = useState("fans")

    // var obj = document.getElementById('chart');
	// var chartWidth = obj.offsetWidth;

    useEffect( () => {
        
        let currentWidth = parseInt(d3.select(ref.current).style('width'), 10)
        // let currentHeight = parseInt(d3.select(ref.current).style('height'), 10)

        // set the dimensions and margins of the graph
        var margin = {top: 10, right: 10, bottom: 10, left: 10},
        width = currentWidth - margin.left - margin.right,
        height = 2000 - margin.top - margin.bottom;


        // append the svg object to the body of the page
        d3.select(ref.current)
        .append("svg")
        .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
        // .attr("width", width + margin.left + margin.right)
        // .attr("width", currentWidth)
        // .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    }, []);

    useEffect(() => {
        draw();
    }, [top50]);

    const draw = () => {
        let currentWidth = parseInt(d3.select(ref.current).style('width'), 10)

        // set the dimensions and margins of the graph
        var margin = {top: 10, right: 10, bottom: 10, left: 10},
        width = currentWidth - margin.left - margin.right,
        height = 2000 - margin.top - margin.bottom;

        const svg = d3.select(ref.current);

        // read json data
        // d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/data_dendrogram_full.json").then(data =>  {
        // d3.json(test).then(data =>  {

        // Give the data to this cluster layout:
        var root = d3.hierarchy(top50).sum(function(d){ return d.fans}) // Here the size of each leave is given in the 'value' field in input data
        // var root = d3.hierarchy(top50).sum(function(d){ return d.fans}).sort((a,b) => a.fans - b.fans)


        // Then d3.treemap computes the position of each element of the hierarchy
        d3.treemap().tile(d3.treemapBinary).size([width, height]).padding(2)(root)

          // prepare a color scale
        var color = d3.scaleOrdinal()
        .domain(["action", "crime", "drama", "fantasy", "history", "romance", "science fiction", "thriller", "war", "western"])
        .range([ "#dadea4", "#fbe8b2", "#e8dbff", "#fff0f0", "#f2aba5", "#cabfc2", "#e6e2d6", "#8D91C7", "#B0DAF1", "#FFBF81"])
        
        // use this information to add rectangles:
        svg
        .selectAll("rect")
        .data(root.leaves())
        .enter()
        .append("rect")
            .attr('x', function (d) { return d.x0; })
            .attr('y', function (d) { return d.y0; })
            .attr('width', function (d) { return d.x1 - d.x0; })
            .attr('height', function (d) { return d.y1 - d.y0; })
            // .style("stroke", "black")
            .style("fill", function(d){ return color(d.parent.data.name)} )
            .attr('rx', 5)
            .attr('ry', 5)
        
        


        svg.selectAll("text").data(root.leaves()).enter().append('text')
            // If it's too small, don't show the text
            .attr('opacity', 0.9)
            .attr("x", function(d){ return d.x0+5})    // +10 to adjust position (more right)
            .attr("y", function(d){ return d.y0+20})    // +20 to adjust position (lower)
            .text(function(d){ 
                const width = (d.x1) - (d.x0), height = (d.y1) - (d.y0);
                const tooSmall = width < 75 || height < 25
                const itemText = tooSmall ? "" : d.data.title
                return itemText 
            })
            .attr("font-size", "10px")
            .attr("fill", "slate")
        
        // TEXT LABELS FOR EACH MOVIE
        // svg
        // .selectAll("text")
        // .data(root.leaves())
        // .enter()
        // .append("text")
        //     .attr("x", function(d){ return d.x0+5})    // +10 to adjust position (more right)
        //     .attr("y", function(d){ return d.y0+5})    // +20 to adjust position (lower)
        //     .text(function(d){ return d.data.title })
        //     // .attr("font-size", d => {
        //     //     if (d === root) return "1em";
        //     //     const width = x(d.x1) - x(d.x0), height = y(d.y1) - y(d.y0);
        //     //     return Math.max(Math.min(width/5, height/2, Math.sqrt((width*width + height*height))/10), 9)
        //     //   })
        //     .attr("font-size", "5px")
        //     .attr("fill", "slate")
        //     .style("text-wrap", "pretty")
        // // })

        // new d3plus.TextBox()
        //     .data(data)
        //     .fontSize(16)
        //     .width(200)
        //     .x(function(d, i) { return i * 250; })
        //     .render();

        // var rect = svg.selectAll("rect")

        // // d3plus.textWrap().overflow(true)
        // d3text.textWrap().overflow(true)
        // d3text.textWrap()
        // d3text.textWrap().
        
    }


    return <svg id="chart" width="100%" height="2000" ref={ref} />;


};

export default TreemapJson;