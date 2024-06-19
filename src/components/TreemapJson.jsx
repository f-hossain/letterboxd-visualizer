import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";
import top50 from '../top50.json';

function TreemapJson() {
    const ref = useRef();
    const starFilled = "★"
    const starOutlined = "☆"

    let [data, setData] = useState(top50)
    let [size, setSize] = useState("likes")
    let [activeFilters, setActiveFilters] = useState([])

    // ==================================================
    //                     FILTERS
    // ==================================================

    let changeSize = (event) => {
        setSize(event.target.value)
    }

    let updateGenreFilter = (event) => {
        const element = event.currentTarget
        const genreName = element.getAttribute("data-value")
        const hasSelectedClass = element.classList.contains("btn-selected")
        const isActive = activeFilters.includes(genreName)

        if (hasSelectedClass || isActive) {
            let i = activeFilters.findIndex( filter => { return filter == genreName })
            activeFilters.splice(i, 1)

            if (activeFilters.length > 0) {
                let filteredData = top50.children.filter( genre => activeFilters.includes(genre.name))
                let newData = { "children": filteredData}
                setData(newData)
            } else {
                setData(top50)
            }

            setActiveFilters(activeFilters)
            element.classList.remove("btn-selected")
        } else {
            let newFilter = [...activeFilters, genreName]
            let filteredData = top50.children.filter( genre => newFilter.includes(genre.name))
            let newData = { "children": filteredData}

            setData(newData)
            setActiveFilters(newFilter)
            element.classList.add("btn-selected")
        }
    }

    // ==================================================
    //                  RENDER MAP
    // ==================================================


    useEffect( () => {
        draw();
    }, [data, size]);


    // ==================================================
    //                    TREEMAP
    // ==================================================
    const draw = () => {
        d3.select("svg > *").remove()

        // set the dimensions and margins of the graph
        var margin = {top: 8, right: 10, bottom: 10, left: 10},
        width = 1000,
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


        // ==================================================
        //                    TOOLTIP
        // ==================================================
        const Tooltip = d3.select(ref.current).append("div")
            .style("opacity", 0)
            .attr("class", "tooltip")

        // tooltip functions
        var mouseover = function(d) {
            Tooltip.transition()
            .style("opacity", 1)
        }

        var mousemove = function(event, d) {
            // const desc = d.data.description
            const rating = Math.round(d.data.rating)
            const ratingStr = starFilled.repeat(rating) + starOutlined.repeat(5-rating)

            Tooltip
            .html(`
                <h3 className="tooltip-label">${d.data.title}</h3> 
                <p><i> ${d.data.director}, ${d.data.year}</i></p>
                <h2> ${ratingStr} </h2>
                <p className="tooltip-label">
                    ${d.data.likes} likes <br>
                    ${d.data.fans} fans <br>
                    ${d.data.watches} watches
                </p>
            `)
            .style("top", (event.pageY - 205)+"px")
            .style("left",(event.pageX + 15)+"px")
        }

        var mouseleave = function(d) {
            Tooltip.transition()
            .style("opacity", 0)
        }


        // ==================================================
        //                    DATA
        // ==================================================
        var root = d3.hierarchy(data).sum(function(d){ 
            // TODO: write this better later
            if (size === "fans") { return d.fans}
            else if (size === "rating") { return d.rating}
            else if (size === "watches") { return d.watches}
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
            .attr('opacity', 0.9)
            .attr('rx', 5)
            .attr('ry', 5)
            .on("mousemove", mousemove)
            .on("mouseleave", mouseleave)
            .on("mouseover", mouseover)
        
        svg.selectAll("text").data(root.leaves()).enter().append('text')
        .attr('opacity', function(d) {
            const width = (d.x1) - (d.x0), height = (d.y1) - (d.y0);
            const tooSmall = width < 60 || height < 50
            const opacity = tooSmall ? 0 : 0.9
            return opacity
        })
        .attr("x", function(d){
            const width = d.x1 - d.x0, height = d.y1 - d.y0;
            const gap_size = Math.max(Math.min(width/10, height/4, Math.sqrt((width*width + height*height))/10), 9) / 2
            return d.x0 + gap_size // + gap size to adjust position (more right)
        })    
        .attr("y", function(d){ 
            const width = d.x1 - d.x0, height = d.y1 - d.y0;
            const gap_size = Math.max(Math.min(width/12, height/4, Math.sqrt((width*width + height*height))/10), 9) * 1.5
            return d.y0 + gap_size // + gap size to adjust position (lower)
        })
        // only show text if the card is big enough to display it properly
        .text(function(d){ return d.data.title + " " + d.data.year})
        .attr("font-size", function(d) {
            const width = d.x1 - d.x0, height = d.y1 - d.y0;
            return Math.max(Math.min(width/10, height/5, Math.sqrt((width*width + height*height))/10), 9)
        })
        .attr("fill", "grey")
        .call(wrapText)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)
        .on("mouseover", mouseover)
    }

    // ==================================================
    //               FORMAT TILE TEXT
    // ==================================================
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

            while (words.length > 1) {
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
            
            addTspan(words.pop(), true);
        
            function addTspan(text, year = false) {
              lineNumber += 1;

              if (year) {
                return (
                    node
                      .append('tspan')
                      .attr('x', x+5)
                      .attr('y', y)
                      .attr('dy', `${lineNumber * fontSizeLine}px`)
                      .attr('font-size', function(d) { return fontSizeLine / 2})
                      .classed("year", true)
                      .text(nodeData.data.director + ", " + text)
                  );

              } else {
                return (
                    node
                      .append('tspan')
                      .attr('x', x)
                      .attr('y', y)
                      .attr('dy', `${lineNumber * fontSizeLine}px`)
                      .text(text)
                );
              }
            }
        });
    }


    return (
        <div>
            <div className="filter-inputs">
                <div className="select-container">
                    <label>select tile size: </label>
                    <select value={size} onChange={changeSize} >
                        <option value="rating">rating</option>
                        <option value="likes">likes</option>
                        <option value="fans">fans</option>
                        <option value="watches">watches</option>
                    </select>
                </div>
                <div className="buttons-container">
                    <label> browse by genre: </label>
                    <div className="genres">
                        <button data-value="action" className="action" onClick={updateGenreFilter}>action</button>
                        <button data-value="crime" className="crime" onClick={updateGenreFilter}>crime</button>
                        <button data-value="drama" className="drama" onClick={updateGenreFilter}>drama</button>
                        <button data-value="fantasy" className="fantasy" onClick={updateGenreFilter}>fantasy</button>
                        <button data-value="history" className="history" onClick={updateGenreFilter}>history</button>
                        <button data-value="romance" className="romance" onClick={updateGenreFilter}>romance</button>
                        <button data-value="science fiction" className="science-fiction" onClick={updateGenreFilter}>science fiction</button>
                        <button data-value="thriller" className="thriller" onClick={updateGenreFilter}>thriller</button>
                        <button data-value="war" className="war" onClick={updateGenreFilter}>war</button>
                        <button data-value="western" className="western" onClick={updateGenreFilter}>western</button>
                    </div>
                </div>
            </div>
            <div className="svg-container" width="1000" ref={ref}></div>
        </div>
    )

};

export default TreemapJson;