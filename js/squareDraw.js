var gridData;
var maxRow = 100;
var maxCol = 100;
var widthpx = "5510px";
var heightpx = "5510px";
var grid;
var width = 10;
var height = 10;


function gridData() {
    var data = new Array();
    var xpos = 1; //starting xpos and ypos at 1 so the stroke will show when we make the grid below
    var ypos = 1;
    var click = 0;

    // iterate for rows	
    for (var row = 0; row < maxRow; row++) {
        data.push(new Array());

        // iterate for cells/columns inside rows
        for (var column = 0; column < maxCol; column++) {
            data[row].push({
                x: xpos,
                y: ypos,
                width: width,
                height: height,
                click: click
            })
            // increment the x position. I.e. move it over by 50 (width variable)
            xpos += width;
        }
        // reset the x position after a row is complete
        xpos = 1;
        // increment the y position for the next row. Move it down 50 (height variable)
        ypos += height;
    }
    return data;
}

function zoom() {
    grid.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
}


function zoomed() {
    grid.attr("transform",
        "translate(" + d3.behavior.zoom().translate() + ")" +
        "scale(" + d3.behavior.zoom().scale() + ")"
    );
}

function interpolateZoom(translate, scale) {
    var self = this;
    return d3.transition().duration(350).tween("zoom", function () {
        var iTranslate = d3.interpolate(d3.behavior.zoom().translate(), translate),
            iScale = d3.interpolate(d3.behavior.zoom().scale(), scale);
        return function (t) {
            d3.behavior.zoom()
                .scale(iScale(t))
                .translate(iTranslate(t));
            zoomed();
        };
    });
}


function zoomClick() {
    var clicked = d3.event.target,
        direction = 1,
        factor = 0.2,
        target_zoom = 1,
        center = [width / 2, height / 2],
        extent = d3.behavior.zoom().scaleExtent(),
        translate = d3.behavior.zoom().translate(),
        translate0 = [],
        l = [],
        view = {
            x: translate[0],
            y: translate[1],
            k: d3.behavior.zoom().scale()
        };

    d3.event.preventDefault();
    direction = (this.id === 'zoom_in') ? 1 : -1;
    target_zoom = d3.behavior.zoom().scale() * (1 + factor * direction);

    if (target_zoom < extent[0] || target_zoom > extent[1]) {
        return false;
    }

    translate0 = [(center[0] - view.x) / view.k, (center[1] - view.y) / view.k];
    view.k = target_zoom;
    l = [translate0[0] * view.k + view.x, translate0[1] * view.k + view.y];

    view.x += center[0] - l[0];
    view.y += center[1] - l[1];

    interpolateZoom([view.x, view.y], view.k);
}



function fnStart() {

    gridData = gridData();

    grid = d3.select("body")
        .append("svg")
        .attr("width", widthpx)
        .attr("height", heightpx)
        .call(d3.behavior.zoom().scaleExtent([.01, 50]).on("zoom", zoom));

    var row = grid.selectAll(".row")
        .data(gridData)
        .enter().append("g")
        .attr("class", "row");

    var column = row.selectAll(".square")
        .data(function (d) {
            return d;
        })
        .enter().append("rect")
        .attr("class", "square")
        .attr("x", function (d) {
            return d.x;
        })
        .attr("y", function (d) {
            return d.y;
        })
        .attr("width", function (d) {
            return d.width;
        })
        .attr("height", function (d) {
            return d.height;
        })
        .style("fill", "#fff")
        .style("stroke", "#222")
        .on('click', function (d) {
            d.click++;
            if ((d.click) % 4 == 0) {
                d3.select(this).style("fill", "#fff");
            }
            if ((d.click) % 4 == 1) {
                d3.select(this).style("fill", "#2C93E8");
            }
            if ((d.click) % 4 == 2) {
                d3.select(this).style("fill", "#F56C4E");
            }
            if ((d.click) % 4 == 3) {
                d3.select(this).style("fill", "#838690");
            }
        });

    d3.selectAll('button').on('click', zoomClick);
}
