var height = 2000,
    width = 500,
    n = 50,  // number of nodes
    dur = 12000, // duration of transition
    hop = 25, // delay between rects in transition
    stackSize = 1,
    barHeight = height/n,
    d3stack = d3.layout.stack(),
    arrays = d3.range(5).map(function(d, i) { return sine(n, .1, i) }),
    stack = d3stack(arrays)

//var height = document.body.offsetHeight;

function color(i) {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.round(Math.random() * 15)];
    }
    return color;
}


var svg = d3.select("#sidewall")
    .attr("width", width)
    .attr("height", height)
  .append('g')
    .attr('class', 'inner');

// this has problems
var x = d3.scale.linear()
    .domain([0, findStackMax(stack)])
    .range([0, 2*width/3]);

var layer = svg.selectAll(".layer")
    .data(stack);

layer.enter().append('g')
    .attr("class", "layer")
    .style('fill', update_color);

var rect = layer.selectAll("rect")
    .data(function(d){ return d;})
  .enter().append('rect')
    .call(rect_posish)

// fuction that positions elements on the right side of our svg
function rect_posish(select) {
   select.attr('width', function(d) { return x(d.y) -1 })
    .attr('x', function(d) {return width - x(d.y0 + d.y)})
    .attr('y', function (d, i){ return barHeight*i + 2 })
    .attr('height', barHeight - 2);
}
delay_func(gray_update)

function gray_update() {
    var a = sine(n, .1);
    arrays = d3.range(3).map(function () { return sine(n, .1, 1) });
    var stack = d3.layout.stack()(arrays);
    x.domain([0, findStackMax(stack)]);

    // Update!
    var layerUp = svg.selectAll(".layer") 
      .data(stack)

    // Transition on update
    layerUp.transition().duration(dur*2/3).delay(200)
        .style('fill', update_color);
    
    layerUp.enter().append('g')
        .attr("class", "layer")
        .style('fill', 'gray');
    
    layerUp.exit().transition()
        .duration(dur/2)
        .style('fill', 'brown')
        .style('opacity', 0)
        .remove();

    // Join new data to existing rectangles
    // Update!
    var rectUpdate = layerUp.selectAll('rect')
       .data(function(d) { return d })

    // Update transition
    rectUpdate.transition()
        .call(rect_timing)
        .call(rect_posish);

    // Enter transition
    rectUpdate.enter().append('rect')
        .attr('x', function(d){ 
            //var g = x(d.y + d.y0)/2;
            //return w - x(d.y + d.y0) - g; });
          return width; })
        .attr('width', 0)
        .transition()
        .call(rect_timing)
        .call(rect_posish);

    // Exit trans
    rectUpdate.exit().transition()
        .call(rect_timing)
        .remove()
}

function findStackMax(stack) {
     var xStackMax = d3.max(stack, function(layer) { return d3.max(layer, function
(d) { return d.y + d.y0 }) });
    return xStackMax
}

function update_color(d, i) {
    g = 40 + i*40;
    return 'rgb(' + g + ',' + g + ',' + g +')';
}


function rect_timing(select) {
    select.duration(dur)
        .delay(function(d, i){ return i*hop + 600 })
}


function delay_func(callback) {
    //gray_update();
 //   setTimeout(function() { delay_func(gray_update) }, dur+250);
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
        var tmp = (val > 0) ? val : .05;
        array[i] = tmp;
    }
    return array.map(function(d, i) { return {x: i, y: d}; });
}
