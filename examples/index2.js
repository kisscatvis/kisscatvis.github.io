replay = null
n = 200
height = 600
width = 600
color = d3.scaleSequential(d3.interpolateTurbo).domain([0, n])
nodes = (replay,
    Array.from({ length: n }, (_, i) => ({
        r: 2 * (4 + 9 * Math.random() ** 2),
        color: color(i)
    })))

chart = function() {
    // the default phyllotaxis arrangement is centered on <0,0> with a distance between nodes of ~10 pixels
    // we will scale & translate it to fit the canvas
    const scale = 1.7,
        center = [width / 2, height / 2],
        rescale = isNaN(nodes[0].x);

    const svg = d3.select("#id_svg").attr("viewBox", [0, 0, width, height]);

    const node = svg
        .append("g")
        .selectAll("circle")
        .data(nodes)
        .join("circle")
        .attr("r", 4)
        .attr("fill", d => d.color);

    const simulation = d3
        .forceSimulation(nodes)
        .on("tick", tick)
        .force("collide", d3.forceCollide().radius(d => 1 + d.r))
        .force("x", d3.forceX(center[0]).strength(0.001))
        .force("y", d3.forceY(center[1]).strength(0.001))
        .stop();

    // differ application of the forces
    setTimeout(() => {
        simulation.restart();
        node.transition().attr("r", d => d.r);
    }, 2000);

    // once the arrangement is initialized, scale and translate it
    if (rescale) {
        for (const node of nodes) {
            node.x = node.x * scale + center[0];
            node.y = node.y * scale + center[1];
        }
    }

    // show the initial arrangement
    tick();

    return svg.node();

    function tick() {
        node.attr("cx", d => d.x).attr("cy", d => d.y);
    }
}
chart()