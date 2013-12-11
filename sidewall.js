window.onload = function() {
var height = document.body.scrollHeight,
    width = 1/3*window.innerWidth,
    n = Math.floor(height/140),  // number of nodes
    dur = 30000, // duration of transition
    hop = 10,
    barHeight = height/n,
    d3stack = d3.layout.stack(),
    min = 0,
    arrays = d3.range(3).map(function(d, i) { return sine(n, .1, i) }),
    stack = d3stack(arrays);

var svg = d3.select("#sidewall")
    .attr("width", width)
    .attr("height", height)

// this has problems
var x = d3.scale.linear()
    .clamp(true)
    .domain([0, findStackMax(stack)])
    .range([min, width]);

var layer = svg.selectAll(".layer")
    .data(stack);

layer.enter().append('g')
    .attr("class", "layer")
    .style('fill', update_color);

var rect = layer.selectAll("rect")
    .data(function(d){ return d;})
  .enter().append('rect')
    .call(rect_posish)
    .attr('rx', 2)
    .attr('ry', 2);

// fuction that positions elements on the right side of our svg
function rect_posish(select) {
   select.attr('width', function(d) { return x(d.y) - 6 })
    .attr('x', function(d) {return width - x(d.y0 + d.y)})
    .attr('y', function (d, i){ return barHeight*i})
    .attr('height', barHeight - 5);
}
//delay_func(gray_update)

function gray_update() {
    var a = sine(n, .1);
    arrays = d3.range(3).map(function () { return sine(n, .1, 1) });
    var stack = d3.layout.stack()(arrays);
    width = 1/3*window.innerWidth;
    svg.attr('width', width);
    x = d3.scale.linear()
      .clamp(true)
      .domain([0, findStackMax(stack)])
      .range([min, width]);

    // Update!
    var layerUp = svg.selectAll(".layer") 
      .data(stack);

    // Transition on update
    layerUp.transition().duration(dur*2/3).delay(40)
        .style('fill', update_color);

    // Join new data to existing rectangles
    // Update!
    var rectUpdate = layerUp.selectAll('rect')
       .data(function(d) { return d });

    // Update transition
    rectUpdate.transition()
        .call(rect_timing)
        .call(rect_posish);
}

function findStackMax(stack) {
     var xStackMax = d3.max(stack, function(layer) { return d3.max(layer, function
(d) { return d.y + d.y0 }) });
    return xStackMax
}

function update_color(d, i) {
    g = 120 + i*40;
    return 'rgb(' + g + ',' + g + ',' + g +')';
}


function rect_timing(select) {
    select.duration(dur)
        .delay(function(d, i){ return i*hop})
}


function delay_func(callback) {
    gray_update();
   // setTimeout(function() { delay_func(gray_update) }, dur+250);
}

function sine(n, o, j) {
    var array = []
    for (g = 0; g < n; g++) array[g] = 0
    var amp = 3*Math.random() + o;
    var pi = Math.PI;
    var freq = 20*pi/(Math.random()*n/2 + n/2); //+ (.5*Math.random() + .5);
    var c = (Math.random()*2 + .1)*pi
    j = j + 1;
    a = j*amp;
    f = j*freq;
    for (i = 0; i < n + 1; ++i) {
        var val = a*Math.sin(f*(i+1)) + c;
        var tmp = (val > 1) ? val : 1;
        array[i] = tmp;
    }
    return array.map(function(d, i) { return {x: i, y: d}; });
}
};
