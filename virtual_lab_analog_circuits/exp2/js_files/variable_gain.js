vcc = 15
function voutvingraph(freqi,vin,vout){
    X = []
    Yi = []
    Yo = []
    for (let t = 0.01/freqi; t<(10/freqi); t+=(1/(100*freqi))){
        X.push(t)
        o = vout*Math.sin(2*Math.PI*freqi*t)
        if (Math.abs(o)<vcc){
            Yo.push(o)
        }
        else{
            Yo.push(vcc*o/Math.abs(o))
        }
        o = vin*Math.sin(2*Math.PI*freqi*t)
        if (Math.abs(o) < vcc){
            Yi.push(o)
        }
        else{
            Yo.push(vcc*o/Math.abs(o))
        }
    }var data = [{
        x: X,
        y: Yi,
        mode:"lines",
        name: "Vin"
      },
      {
        x: X,
        y: Yo,
        mode:"lines",
        name: "Vout"
      } ];
      
      max_y = Math.max(...[Math.max(...Yi),Math.max(...Yo)])
      min_y = Math.min(...[Math.min(...Yi),Math.min(...Yo)])
      // Define Layout
      var layout = {
        xaxis: {range: [Math.min(...X), Math.max(...X)], title: "time"},
        yaxis: {range: [min_y, max_y], title: "Voltage"}, //  
        title: "V vs T"
      };
      x = X
      y = Yi
      // Display using Plotly
      Plotly.newPlot("volt_time_graph", data, layout);
}

function gain_a(xArray,yArray){
    var data = [{
        x: xArray,
        y: yArray,
        mode:"lines+markers"
      }];
      
      // Define Layout
      var layout = {
        xaxis: {range: [Math.min(...xArray), Math.max(...xArray)], title: "frequency"},
        yaxis: {range: [Math.min(...yArray), Math.max(...yArray)], title: "gain dB"},  
        title: "gain_vs_a"
      };
      
      // Display using Plotly
      Plotly.newPlot("gain_vs_a", data, layout);
  
}

function sorter (gain,a){
        
    for(var i = 0; i < a.length; i++){
        
        // Last i elements are already in place  
        for(var j = 0; j < ( a.length - i -1 ); j++){
            
        // Checking if the item at present iteration 
        // is greater than the next iteration
        if(a[j] > a[j+1]){
            
            // If the condition is true then swap them
            var temp = a[j]
            a[j] = a[j + 1]
            a[j+1] = temp

            var temp = gain[j]
            gain[j] = gain[j + 1]
            gain[j+1] = temp

        }
        }
    }
}


vin_input = document.getElementById("vin")
frequency_input = document.getElementById("frequency")
a_input = document.getElementById("a")
plot_button = document.getElementById("plot")

gain_vs_a = {a:[],gain:[]}



plot_button.addEventListener('click', function(){
    a = parseFloat(a_input.value)
    vin = parseFloat(vin_input.value)
    f = parseFloat(frequency_input.value)
    vout = (2*a-1)*vin
    gain_vs_a.a.push(a)
    gain_vs_a.gain.push(2*a-1)

    //sorter(gain_vs_a.gain,gain_vs_a.a)

    gain_a(gain_vs_a.a, gain_vs_a.gain)
    voutvingraph(f,vin,vout)
})

vin_input.addEventListener('mouseup',function(){
    a = parseFloat(a_input.value)
    vin = parseFloat(vin_input.value)
    f = parseFloat(frequency_input.value)
    vout = (2*a-1)*vin
    voutvingraph(f,vin,vout)
})

a_input.addEventListener('mouseup',function(){
    a = parseFloat(a_input.value)
    vin = parseFloat(vin_input.value)
    f = parseFloat(frequency_input.value)
    vout = (2*a-1)*vin
    voutvingraph(f,vin,vout)
})