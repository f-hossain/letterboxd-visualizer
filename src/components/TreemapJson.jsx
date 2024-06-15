import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";
import top50 from '../top50.json'

const TreemapJson = () => {
    const ref = useRef();
    let [sizeParam, setSizeParam] = useState("rating")

    useEffect( () => {
        draw();
    }, []);

    const draw = () => {
        // set the dimensions and margins of the graph
        var margin = {top: 10, right: 10, bottom: 10, left: 10},
        width = 1000 ,
        height = 1000 ;

        // append the svg object to the body of the page
        const svg = d3.select(ref.current)
        .append("svg")
        .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
        .attr("preserveAspectRatio", "xMidYMid meet")
        .classed("svg-content", true)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");


        // Give the data to this cluster layout:
        var root = d3.hierarchy(top50).sum(function(d){ 
            if (sizeParam == "fans") { return d.fans}
            else if (sizeParam == "rating") { return d.rating}
            else if (sizeParam == "watches") { return d.watches}
            else { return d.likes }
        }).sort((a, b) => b.value - a.value) // Here the size of each leave is given in the 'value' field in input data


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
            .attr('opacity', 0.7)
            .attr('rx', 5)
            .attr('ry', 5)

        svg.selectAll("text").data(root.leaves()).enter().append('text')
            .attr('opacity', 0.9)
            .attr("x", function(d){ return d.x0+5})    // +10 to adjust position (more right)
            .attr("y", function(d){ return d.y0+20})    // +20 to adjust position (lower)
            // only show text if the card is big enough to display it properly
            .text(function(d){ 
                const width = (d.x1) - (d.x0), height = (d.y1) - (d.y0);
                const tooSmall = width < 75 || height < 25
                const itemText = tooSmall ? "" : d.data.title
                return itemText 
            })
            .attr("font-size", "10px")
            .attr("fill", "slate")
        
    }


    return (
        <div class="svg-container" width="1000" height="2000" ref={ref}></div>
    )

};

export default TreemapJson;