drawBarChart();
drawParallelChart();
drawPieChart();
function drawBarChart() {
    const margin = {top: 40, right: 20, bottom: 100, left: 40}, 
    width = 960 - margin.left - margin.right,
    height = 550 - margin.top - margin.bottom; 

    const x = d3.scaleBand()
            .range([0, width])
            .padding(0.1);
    const y = d3.scaleLinear()
            .range([height, 0]);

    const svg = d3.select("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", 
                    "translate(" + margin.left + "," + margin.top + ")");

    svg.append("text")
    .attr("class", "chart-title")
    .attr("x", width / 2)
    .attr("y", -margin.top / 2)
    .text("Favorite Music Genres Among Respondents");

    d3.csv("mxmh_survey_results.csv").then(function(data) {
    const genreCounts = d3.rollups(data, v => v.length, d => d['Fav genre'])
                        .map(([key, value]) => ({ Genre: key, Count: value }));
    genreCounts.sort((a, b) => d3.descending(a.Count, b.Count));

    x.domain(genreCounts.map(d => d.Genre));
    y.domain([0, d3.max(genreCounts, d => d.Count)]);

    svg.selectAll(".bar")
        .data(genreCounts)
    .enter().append("rect")
        .attr("class", "bar")
        .attr("x", d => x(d.Genre))
        .attr("width", x.bandwidth())
        .attr("y", d => y(d.Count))
        .attr("height", d => height - y(d.Count));

    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
    .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-65)");

    svg.append("g")
        .call(d3.axisLeft(y));

    svg.append("text")
        .attr("class", "axis-label")
        .attr("text-anchor", "end")
        .attr("x", width / 2)
        .attr("y", height + margin.top + 40)
        .text("Genre");

    svg.append("text")
        .attr("class", "axis-label")
        .attr("text-anchor", "end")
        .attr("x", -height / 2)
        .attr("y", -margin.left + 20)
        .attr("transform", "rotate(-90)")
        .text("Count");
    });
}

function drawParallelChart() {
    const data = [{'Frequency [Classical]': 0.3333333333333333,
    'Frequency [Pop]': 1.0,
    'Frequency [Metal]': 0.0,
    'Anxiety': 0.3,
    'Depression': 0.0,
    'Insomnia': 0.1,
    'OCD': 0.0},
    {'Frequency [Classical]': 0.6666666666666666,
    'Frequency [Pop]': 0.6666666666666666,
    'Frequency [Metal]': 0.0,
    'Anxiety': 0.7,
    'Depression': 0.2,
    'Insomnia': 0.2,
    'OCD': 0.1},
    {'Frequency [Classical]': 0.0,
    'Frequency [Pop]': 0.3333333333333333,
    'Frequency [Metal]': 0.6666666666666666,
    'Anxiety': 0.7,
    'Depression': 0.7,
    'Insomnia': 1.0,
    'OCD': 0.2},
    {'Frequency [Classical]': 0.6666666666666666,
    'Frequency [Pop]': 0.6666666666666666,
    'Frequency [Metal]': 0.0,
    'Anxiety': 0.9,
    'Depression': 0.7,
    'Insomnia': 0.3,
    'OCD': 0.3},
    {'Frequency [Classical]': 0.0,
    'Frequency [Pop]': 0.6666666666666666,
    'Frequency [Metal]': 0.0,
    'Anxiety': 0.7,
    'Depression': 0.2,
    'Insomnia': 0.5,
    'OCD': 0.9}];
    
  const margin = {top: 60, right: 10, bottom: 10, left: 0},
        width = 960 - margin.left - margin.right,
        height = 550 - margin.top - margin.bottom;
  
  const svg = d3.select(d3.selectAll("svg").nodes()[1])
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
    .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
  const dimensions = Object.keys(data[0]);
  const y = {};
  for (const d of dimensions) {
    y[d] = d3.scaleLinear()
      .domain(d3.extent(data, function(p) { return +p[d]; }))
      .range([height, 0]);
  }
  
  const x = d3.scalePoint()
    .range([0, width])
    .padding(1)
    .domain(dimensions);
  
  svg.append("text")
        .attr("class", "chart-title")  
        .attr("x", width / 2)
        .attr("y", -20)
        .style("text-anchor", "middle")
        .text("Music Genre Frequency and Mental Health Correlation");
  svg.selectAll("myPath")
    .data(data)
    .enter().append("path")
      .attr("d", function(d) {
        return d3.line()(dimensions.map(function(p) { return [x(p), y[p](d[p])]; }));
      })
      .style("fill", "none")
      .style("stroke", "#69b3a2")
      .style("opacity", 0.5)
  

  svg.selectAll("myAxis")
    .data(dimensions).enter()
    .append("g")
    .attr("transform", function(d) { return "translate(" + x(d) + ")"; })
    .each(function(d) { d3.select(this).call(d3.axisLeft().scale(y[d])); })
    .append("text")
      .style("text-anchor", "middle")
      .attr("y", -9)
      .text(function(d) { return d; })
      .style("fill", "black")
  
}

function drawPieChart() {

    d3.csv("mxmh_survey_results.csv").then(function(data) {

        const counts = d3.rollup(data, v => v.length, d => d.Anxiety);
                
        let total = 736;

        const pieData = Array.from(counts, ([level, count]) => {
            return { level: level, count: count, percentage: (count / total * 100).toFixed(2) };
        });

        data = pieData;

        const margin = { top: 50, right: 50, bottom: 50, left: 50 };
        const width = 1100 - margin.left - margin.right;
        const height = 600 - margin.top - margin.bottom;
        const radius = Math.min(width, height) / 2;

        const svg = d3.select(d3.selectAll("svg").nodes()[2])
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left + width / 2}, ${margin.top + height / 2})`);

        const color = d3.scaleOrdinal(d3.schemeCategory10);

        const pie = d3.pie()
            .value(function(d) { return d.count; })(data);

        const arc = d3.arc()
            .innerRadius(0)
            .outerRadius(radius);

        svg.selectAll("path")
          .data(pie)
          .enter()
          .append("path")
            .attr("d", arc)
            .attr("fill", function(d) { return color(d.data.level); })
            .attr("stroke", "white")
            .style("stroke-width", "2px")
            .style("opacity", 0.7);
    
        svg.selectAll("text")
          .data(pie)
          .enter()
          .append("text")
            .text(function(d) { if (d.data.percentage > 1) return d.data.percentage + '%'; else return ""})
            .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
            .style("text-anchor", "middle")
            .style("font-size", "12px");
        
            svg.append("text")
            .attr("x", 0)
            .attr("y", -height / 2 -10) 
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .text("Mental Health Assessment Overview");
            const legend = svg.append("g")
    .attr("transform", `translate(${width / 2 - 100}, ${-height / 2 + 40})`); 
    pieData.forEach(function(d, i) {
        legend.append("rect")
            .attr("x", 0)
            .attr("y", i * 20) 
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", color(d.level));
    
        legend.append("text")
            .attr("x", 24)
            .attr("y", i * 20 + 9)
            .attr("dy", "0.35em")
            .style("text-anchor", "start")
            .text(`Level ${d.level}`);
    });

        
    });

}
