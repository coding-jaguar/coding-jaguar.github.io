x = document.querySelectorAll('.control')
        instance = jsPlumb.getInstance({});
instance.setContainer("diagram");

instance.bind("ready", function () {
instance.registerConnectionTypes({
    "red-connection": {
        paintStyle: { stroke: "black", strokeWidth: 2 },
        hoverPaintStyle: { stroke: "red", strokeWidth: 5 },
        // connector: "Flowchart"
    }
});


for (let i =0 ; i<x.length; i++){
    instance.addEndpoint(x[i].id, {
        endpoint: "Dot",
        anchor: ["LeftMiddle"],
        isTarget: true,
        isSource: true,
        connectionType: "red-connection",
        uuid: x[i].id
    });
}
})

vcc = 15
three_db_frequency = 1000
zero_power_frequency =10000


voltage_gain_of_opamp = 200000
reset_button = document.getElementById("reset")
check_button = document.getElementById("check button")
connect_button = document.getElementById("connect_automatically_button")
circuit_configuration_input = document.getElementById("config")

gainvsfreq = {
    open_loop:{gain: [],freq : []},
    closed_loop_inverting:{gain: [],freq : []},
    closed_loop_non_inverting:{gain: [],freq : []}
}

configuration = circuit_configuration_input.value
r1 = document.getElementById("r1")
r2 = document.getElementById("r2")
freq = document.getElementById("input_freq")
input_voltage = document.getElementById("input_voltage")
vout_amplitude = 1



all_connections = instance.getAllConnections()

open_loop_connections = {
    "input_v_p": "r1l",
    "r1r": "vin_n2",
    "vout2": "cro_in",
    "cro_gnd": "gnd4",
    "dc1n": "gnd3",
    "dc1p": "vccp",
    "vccn": "dc2n",
    "dc2p": "gnd2",
    "gnd1": "input_v_n",
    "vin_p": "gnd5"
}

inverting_closed_connections = {
    "r2l": "vin_n1",
    "input_v_p": "r1l",
    "gnd2": "dc2p",
    "dc2n": "vccn",
    "vccp": "dc1p",
    "dc1n": "gnd3",
    "r2r": "vout1",
    "vout2": "cro_in",
    "cro_gnd": "gnd4",
    "r1r": "vin_n2",
    "input_v_n": "gnd1", 
    "gnd5":"vin_p"
}

non_inverting_closed_connections = {'r2l': 'vin_n1', 
                        'vin_n1': 'r2l', 
                        'r1r': 'vin_n2', 
'vin_n2': 'r1r', 'input_v_p': 'vin_p', 'vin_p': 'input_v_p', 'r1l': 'gnd1', 'gnd1': 'r1l', 'gnd5': 'input_v_n', 'input_v_n': 'gnd5', 'gnd2': 'dc2p', 'dc2p': 'gnd2', 'dc2n': 'vccn', 'vccn': 'dc2n', 'vccp': 'dc1p', 'dc1p': 'vccp', 'dc1n': 'gnd3', 'gnd3': 'dc1n', 'r2r': 'vout1', 'vout1': 'r2r', 'vout2': 'cro_in', 'cro_in': 'vout2', 'cro_gnd': 'gnd4', 'gnd4': 'cro_gnd'}


function db_gain(voltage_ratio){
    return 20*Math.log10(voltage_ratio)
}

function printer(){
    for (let x of all_connections){
        console.log(x.endpoints[0].getUuid(),x.endpoints[1].getUuid())
        correct_connections[x.endpoints[0].getUuid()] = x.endpoints[1].getUuid()
        correct_connections[x.endpoints[1].getUuid()] = x.endpoints[0].getUuid()
    }
}

function reset(){
    instance.deleteEveryConnection()
    gain_freq_graph([],[])
    gainvsfreq = {
        open_loop:{gain: [],freq : []},
        closed_loop_inverting:{gain: [],freq : []},
        closed_loop_non_inverting:{gain: [],freq : []}
    }

}

function get_connections(){
    c = instance.getAllConnections()
    conn = {}
    for (i of c){
        console.log(i.endpoints[0].getUuid(), i.endpoints[0].getUuid())
        c2 = i.endpoints[1].getUuid()
        c1 = i.endpoints[0].getUuid()
        conn[c1] = c2
        conn[c2] = c1
    }
    return conn
}

function checker(){
    configuration = circuit_configuration_input.value
    correct = true
    x = get_connections()
    if (configuration === "open_loop")
    {
        for(i of Object.keys(open_loop_connections)){
            console.log(i === x[x[i]])
            if(i !== x[x[i]]){
                correct = false
            }
        }
    }
    else if(configuration === 'closed_loop_inverting'){
        for(i of Object.keys(inverting_closed_connections)){
            console.log(i === x[x[i]])
            if(i !== x[x[i]]){
                correct = false
            }
        }
    }
    else{
        for(i of Object.keys(inverting_closed_connections)){
            console.log(i === x[x[i]])
            if(i !== x[x[i]]){
                correct = false
            }
        }
    }


    if (correct === true){
        alert("Correct !!!")
    }   
    else{
        alert("Wrong :(")
    }
}

function connecter(){
    configuration = circuit_configuration_input.value
    instance.deleteEveryConnection()
    if (configuration === "open_loop")
    {
        for (let i of Object.keys(open_loop_connections)){
            instance.connect({uuids:[i, open_loop_connections[i]]})
            console.log(i, open_loop_connections[i])
        }   
    }
    else if(configuration === "closed_loop_inverting"){
        for (let i of Object.keys(inverting_closed_connections)){
            instance.connect({uuids:[i, inverting_closed_connections[i]]})
        }

    }
    else if(configuration === "closed_loop_non_inverting"){
        for (let i of Object.keys(non_inverting_closed_connections)){
            instance.connect({uuids:[i, non_inverting_closed_connections[i]]})
        }
    }
    else{
        console.log(configuration)
    }


    }


function calculate(){
    configuration = circuit_configuration_input.value
    if (circuit_configuration_input.value === "open_loop"){
        cal_gain = voltage_gain_of_opamp
        if (parseFloat(freq.value)<three_db_frequency)
        {
            vout_amplitude = cal_gain* parseFloat(input_voltage.value)
            if(Math.abs(vout_amplitude)>=vcc){
                vout_amplitude = Math.abs(vout_amplitude)/vout_amplitude*vcc
            }
        
        }
        else{
            vout_amplitude = (parseFloat(freq.value)-zero_power_frequency*cal_gain)/(three_db_frequency-zero_power_frequency)* parseFloat(input_voltage.value) 
            cal_gain = (parseFloat(freq.value)-zero_power_frequency*cal_gain)/(three_db_frequency-zero_power_frequency)
            if(Math.abs(vout_amplitude)>=vcc){
                vout_amplitude = Math.abs(vout_amplitude)/vout_amplitude*vcc
            }
        }
        voutvingraph(parseFloat(freq.value),parseFloat(input_voltage.value),vout_amplitude)
        console.log(cal_gain,db_gain(Math.abs(cal_gain))*cal_gain/Math.abs(cal_gain))
        gainvsfreq[configuration].gain.push(db_gain(Math.abs(cal_gain))*cal_gain/Math.abs(cal_gain))
        gainvsfreq[configuration].freq.push(parseFloat(freq.value))
        gain_freq_graph( gainvsfreq[configuration].freq,gainvsfreq[configuration].gain)

    }
    else if (circuit_configuration_input.value === "closed_loop_inverting"){
        z1 = parseFloat(r1.value)
        z2 = parseFloat(r2.value)
        cal_gain = -z1/z2

        if (parseFloat(freq.value)<three_db_frequency)
        {
            vout_amplitude = cal_gain* parseFloat(input_voltage.value)
            if(Math.abs(vout_amplitude)>=vcc){
                vout_amplitude = Math.abs(vout_amplitude)/vout_amplitude*vcc
            }
        
        }
        else{
            vout_amplitude = (parseFloat(freq.value)-zero_power_frequency*cal_gain)/(three_db_frequency-zero_power_frequency)* parseFloat(input_voltage.value) 
            cal_gain = (parseFloat(freq.value)-zero_power_frequency*cal_gain)/(three_db_frequency-zero_power_frequency)
            if(Math.abs(vout_amplitude)>=vcc){
                vout_amplitude = Math.abs(vout_amplitude)/vout_amplitude*vcc
            }
        }
        voutvingraph(parseFloat(freq.value),parseFloat(input_voltage.value),vout_amplitude)
        console.log(cal_gain,db_gain(Math.abs(cal_gain))*cal_gain/Math.abs(cal_gain))
        gainvsfreq[configuration].gain.push(db_gain(Math.abs(cal_gain))*cal_gain/Math.abs(cal_gain))
        gainvsfreq[configuration].freq.push(parseFloat(freq.value))
        gain_freq_graph( gainvsfreq[configuration].freq,gainvsfreq[configuration].gain)
    }
    else{
        z1 = parseFloat(r1.value)
        z2 = parseFloat(r2.value)
        cal_gain = 1+z1/z2
        if (parseFloat(freq.value)<three_db_frequency)
        {
            vout_amplitude = cal_gain* parseFloat(input_voltage.value)
            if(Math.abs(vout_amplitude)>=vcc){
                vout_amplitude = Math.abs(vout_amplitude)/vout_amplitude*vcc
            }
        
        }
        else{
            vout_amplitude = (parseFloat(freq.value)-zero_power_frequency*cal_gain)/(three_db_frequency-zero_power_frequency)* parseFloat(input_voltage.value) 
            cal_gain = (parseFloat(freq.value)-zero_power_frequency*cal_gain)/(three_db_frequency-zero_power_frequency)
            if(Math.abs(vout_amplitude)>=vcc){
                vout_amplitude = Math.abs(vout_amplitude)/vout_amplitude*vcc
            }
        }
        voutvingraph(parseFloat(freq.value),parseFloat(input_voltage.value),vout_amplitude)
        console.log(cal_gain,db_gain(Math.abs(cal_gain))*cal_gain/Math.abs(cal_gain))
        gainvsfreq[configuration].gain.push(db_gain(Math.abs(cal_gain))*cal_gain/Math.abs(cal_gain))
        gainvsfreq[configuration].freq.push(parseFloat(freq.value))
        gain_freq_graph( gainvsfreq[configuration].freq,gainvsfreq[configuration].gain)
    }
}

calculate_button = document.getElementById("calculate")
calculate_button.addEventListener('click',calculate)

    
connect_button.addEventListener('click',connecter)

function gain_freq_graph(xArray,yArray){
    var data = [{
        x: xArray,
        y: yArray,
        mode:"lines+markers"
      }];
      
      // Define Layout
      var layout = {
        xaxis: {range: [Math.log10(Math.min(...xArray)), Math.log10(Math.max(...xArray))], title: "frequency", type:"log"},
        yaxis: {range: [Math.min(...yArray), Math.max(...yArray)], title: "gain dB"},  
        title: "Gain vs. freq"
      };
      
      // Display using Plotly
      Plotly.newPlot("plot1", data, layout);
  
}

x = []
y = []

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
    }

    var data = [{
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
      Plotly.newPlot("vvst", data, layout);
}

// voutvingraph(1000,4,2)

// gain_freq_graph(xArray,yArray)

reset_button.addEventListener('click',reset)
check_button.addEventListener('click',checker)


function plot_preview(){
    configuration = circuit_configuration_input.value
    if (circuit_configuration_input.value === "open_loop"){
        cal_gain = voltage_gain_of_opamp
        if (parseFloat(freq.value)<three_db_frequency)
        {
            vout_amplitude = cal_gain* parseFloat(input_voltage.value)
            if(Math.abs(vout_amplitude)>=vcc){
                vout_amplitude = Math.abs(vout_amplitude)/vout_amplitude*vcc
            }
        
        }
        else{
            vout_amplitude = (parseFloat(freq.value)-zero_power_frequency*cal_gain)/(three_db_frequency-zero_power_frequency)* parseFloat(input_voltage.value) 
            cal_gain = (parseFloat(freq.value)-zero_power_frequency*cal_gain)/(three_db_frequency-zero_power_frequency)
            if(Math.abs(vout_amplitude)>=vcc){
                vout_amplitude = Math.abs(vout_amplitude)/vout_amplitude*vcc
            }
        }
        voutvingraph(parseFloat(freq.value),parseFloat(input_voltage.value),vout_amplitude)
    }
    else if (circuit_configuration_input.value === "closed_loop_inverting"){
        z1 = parseFloat(r1.value)
        z2 = parseFloat(r2.value)
        cal_gain = -z1/z2

        if (parseFloat(freq.value)<three_db_frequency)
        {
            vout_amplitude = cal_gain* parseFloat(input_voltage.value)
            if(Math.abs(vout_amplitude)>=vcc){
                vout_amplitude = Math.abs(vout_amplitude)/vout_amplitude*vcc
            }
        
        }
        else{
            vout_amplitude = (parseFloat(freq.value)-zero_power_frequency*cal_gain)/(three_db_frequency-zero_power_frequency)* parseFloat(input_voltage.value) 
            cal_gain = (parseFloat(freq.value)-zero_power_frequency*cal_gain)/(three_db_frequency-zero_power_frequency)
            if(Math.abs(vout_amplitude)>=vcc){
                vout_amplitude = Math.abs(vout_amplitude)/vout_amplitude*vcc
            }
        }
        voutvingraph(parseFloat(freq.value),parseFloat(input_voltage.value),vout_amplitude)
        
    }
    else{
        z1 = parseFloat(r1.value)
        z2 = parseFloat(r2.value)
        cal_gain = 1+z1/z2
        if (parseFloat(freq.value)<three_db_frequency)
        {
            vout_amplitude = cal_gain* parseFloat(input_voltage.value)
            if(Math.abs(vout_amplitude)>=vcc){
                vout_amplitude = Math.abs(vout_amplitude)/vout_amplitude*vcc
            }
        
        }
        else{
            vout_amplitude = (parseFloat(freq.value)-zero_power_frequency*cal_gain)/(three_db_frequency-zero_power_frequency)* parseFloat(input_voltage.value) 
            cal_gain = (parseFloat(freq.value)-zero_power_frequency*cal_gain)/(three_db_frequency-zero_power_frequency)
            if(Math.abs(vout_amplitude)>=vcc){
                vout_amplitude = Math.abs(vout_amplitude)/vout_amplitude*vcc
            }
        }
        voutvingraph(parseFloat(freq.value),parseFloat(input_voltage.value),vout_amplitude)
    }
}

input_voltage.addEventListener('mouseup',plot_preview)
freq.addEventListener('mouseup',plot_preview)
r1.addEventListener('mouseup',plot_preview)
r2.addEventListener('mouseup',plot_preview)