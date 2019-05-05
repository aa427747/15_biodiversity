function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  // Use d3 to select the panel with id of `#sample-metadata`
  /* data route */
  // var metadataURL = "/metadata/" + sample;
  // d3.json(metadataURL).then(function(data) {
  d3.json(`/metadata/${sample}`).then(function(data) {
    console.log(data);
    
    // Use `.html("") to clear any existing metadata
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    var metadata = d3.select("#sample-metadata");
    metadata.html("");
    Object.entries(data).forEach(function([key, value]) {
      console.log(`Key: ${key}, Value: ${value}`);
      metadata.append("p").text(`${key}: ${value}`);
    }); 
    // BONUS: Build the Gauge Chart
    buildGauge(data.WFREQ);
  })
} 


function buildCharts(sample) {

  //@TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(`/samples/${sample}`).then(function(response) {
    console.log(response);

  //@TODO: Build a Bubble Chart using the sample data
    var trace1 = {
      x: response.otu_ids,
      y: response.sample_values,
      text: response.otu_values,
      // x: response.map(row => row.otu_ids),
      // y: response.map(row => row.sample_values),
      // text: response.map(row => row.otu_values),
      // name: response.map(row => row.otu_labels),
      mode: "markers",
      type: "scatter",
      marker: {
        color: response.otu_ids, 
        // "rgba(156, 165, 196, 1.0)",
        size: response.sample_values
      }
    };
    
  //   // data
    var data1 = [trace1];
    
  //   // Apply the group bar mode to the layout
    var layout1 = {
      title: "<b>Biodiversity Sample Bubble Chart</b>",
      margin: {
        l: 100,
        r: 100,
        t: 100,
        b: 100
      },
      // padding: {
      //   l: 100,
      //   r: 100,
      //   t: 100,
      //   b: 100
      // }
    };
    
  //   // Render the plot to the div tag with id "plot"
    Plotly.newPlot("bubble", data1, layout1);
  });  


  //   // @TODO: Build a Pie Chart
  d3.json(`/samples/${sample}`).then(function(piesamples) {
    console.log(piesamples);
  //  HINT: You will need to use slice() to grab the top 10 sample_values,
  //  otu_ids, and labels (10 each).
  //  var response = piesamples.slice(0, 10);
      
  // Build the pie chart with 10 objects
      var trace2 = {
        type: "pie",
        name: "belly",
        text: piesamples.otu_labels.slice(0, 10),
        labels: piesamples.otu_ids.slice(0, 10),
        values: piesamples.sample_values.slice(0, 10)
      };

      var data2 = [trace2];
      var layout2 = {
        title: "<b>Biodiversity Sample Pie Chart</b>",
        margin: {
          l: 75,
          r: 75,
          t: 75,
          b: 150
        },
        // padding: {
        //   l: 50,
        //   r: 50,
        //   t: 50,
        //   b: 50
        // }
      };

      Plotly.newPlot("pie", data2, layout2);
    });
}



function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
   buildCharts(newSample);
   buildMetadata(newSample);
}

// Initialize the dashboard
init();
