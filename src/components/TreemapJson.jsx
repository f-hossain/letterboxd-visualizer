import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";
import top50 from '../top50.json'

const TreemapJson = () => {
    const ref = useRef();

    let [sizeParam, setSizeParam] = useState("watches")

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
        // Here the size of each leave is given in the 'value' field in input data
        var root = d3.hierarchy(top50).sum(function(d){ 
            // TODO: write this better later
            if (sizeParam === "fans") { return d.fans}
            else if (sizeParam === "rating") { return d.rating}
            else if (sizeParam === "watches") { return d.watches}
            else { return d.likes }
        }).sort((a, b) => b.value - a.value) 


        // Then d3.treemap computes the position of each element of the hierarchy
        d3.treemap().tile(d3.treemapBinary).size([width, height]).padding(2)(root)

          // prepare a color scale
        var color = d3.scaleOrdinal()
        .domain(["action", "crime", "drama", "fantasy", "history", "romance", "science fiction", "thriller", "war", "western"])
        .range([ "#dadea4", "#fbe8b2", "#e8dbff", "#fff0f0", "#f2aba5", "#cabfc2", "#e6e2d6", "#8D91C7", "#B0DAF1", "#FFBF81"])
        
        // use this information to add rectangles:
        let nodes = svg
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
            .attr('opacity', function(d) {
                const width = (d.x1) - (d.x0), height = (d.y1) - (d.y0);
                const tooSmall = width < 50 || height < 50
                const opacity = tooSmall ? 0 : 0.9
                return opacity
            })
            .attr("x", function(d){ 
                console.log(d)
                const width = d.x1 - d.x0, height = d.y1 - d.y0;
                const gap_size = Math.max(Math.min(width/10, height/4, Math.sqrt((width*width + height*height))/10), 9) / 2
                console.log(gap_size)
                return d.x0 + gap_size // + gap size to adjust position (more right)
            })    
            .attr("y", function(d){ 
                const width = d.x1 - d.x0, height = d.y1 - d.y0;
                const gap_size = Math.max(Math.min(width/12, height/4, Math.sqrt((width*width + height*height))/10), 9) * 1.5
                console.log(gap_size)
                return d.y0 + gap_size // + gap size to adjust position (lower)
            })
            // only show text if the card is big enough to display it properly
            .text(function(d){ return d.data.title})
            .attr("font-size", function(d) {
                const width = d.x1 - d.x0, height = d.y1 - d.y0;
                return Math.max(Math.min(width/12, height/4, Math.sqrt((width*width + height*height))/10), 9)
            })
            .attr("fill", "grey")
            .call(wrapText)
    }

    const wrapText = (selection) => {
        selection.each(function () {
            const node = d3.select(this);
            const nodeData = node.data()[0]
            const width = nodeData.x1 - nodeData.x0
            const height = nodeData.y1 - nodeData.y0

            let fontSizeLine = Math.max(Math.min(width/12, height/4, Math.sqrt((width*width + height*height))/10), 9)

            const lineLimit = width - fontSizeLine


            let word;
            const words = node.text().split(' ').reverse();

            let line = [];

            const x = node.attr('x');
            const y = node.attr('y');

            let tspan = node.text('').append('tspan').attr('x', x).attr('y', y);
            let lineNumber = 0;

            while (words.length > 0) {
              word = words.pop();
              line.push(word);
              tspan.text(line.join(' '));
              const tspanLength = tspan.node().getComputedTextLength();

              if (tspanLength > lineLimit && line.length !== 1) {
                line.pop();
                tspan.text(line.join(' '));
                line = [word];
                tspan = addTspan(word);
              }
            }

            // words.pop()
            
            addTspan(words.pop());
        
            function addTspan(text) {
              lineNumber += 1;
              return (
                node
                  .append('tspan')
                  .attr('x', x)
                  .attr('y', y)
                  .attr('dy', `${lineNumber * fontSizeLine}px`)
                  .text(text)
              );
            }
        });
    
    }


    return (
        <div className="svg-container" width="1000" height="2000" ref={ref}></div>
    )

};

export default TreemapJson;