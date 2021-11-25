x = document.querySelectorAll('.control')
connection_list = {}
current_row = 1
for (let i =0 ; i<x.length; i++){
    console.log(x[i].id)
}


function remove_last(str) {
    console.log(str)
    return str.substring(0,str.length-1)
}

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


function id_to_circuit_element(id) // gnd1,2,3 = gnd , r1,r2,r3(left or right) = r1,r2,r3
{
    if (id == 'gnd1' || id == 'gnd2' || id == 'gnd3'){
        return "gnd"
    }

}

circles = document.querySelectorAll('circle')
source = ""
target = ""
something_selected = false

for ( let i =0 ; i<x.length; i++){
    circles[i].id = x[i].id
    circles[i].addEventListener('click',function(event){
        if(!something_selected){
            something_selected = !something_selected
            source = event.target.id
        }
    })

    circles[i].addEventListener('mouseup',function(event){
        if(something_selected){
            something_selected = !something_selected
            target = event.target.id
        }
    })

}



resistance_values = {
    "r1":0, "r2":0, "r3":0,"r4":0,"r5":"6.8K"
}

function check(){
    is_correct = true
    connections = instance.getAllConnections()
    connection_list = {}
    for (let i = 0;i<connections.length;i++){
        eps = connections[i].endpoints
        connection_list[eps[0].elementId] = eps[1].elementId
        connection_list[eps[1].elementId] = eps[0].elementId

    }
    if (Object.keys(connection_list).length ==0){
        is_correct = false
    }
    for(let key of Object.keys(connection_list)){
        
        if (key.includes("gnd")){
            if(connection_list[key]!="v1_n" && connection_list[key]!="v2_p" && connection_list[key]!="vac2n" && connection_list[key]!="vac1n")
            {
                is_correct = false
                break
            }
        }
        else if(key.includes("bjt_e") && !connection_list[key].includes('r5l')){
            
            is_correct = false
            break
        }
        else if(key == "vac1p" || key == "vac2p"){
            if (remove_last(connection_list[key]) != remove_last(connection_list["left_bjt_b"]) && remove_last(connection_list[key]) != remove_last(connection_list["right_bjt_b"])){
                is_correct = false
                break
             }
        }

        else if(key.includes("v1_p")){
            if (remove_last(connection_list[key])!=remove_last(connection_list["left_bjt_c"]) && remove_last(connection_list[key])!=remove_last(connection_list["right_bjt_c"])){
                is_correct = false
                break
            }
        }

        else if(!key.includes("bjt_e") && !connection_list[key].includes("r5") && connection_list["r5r"]!="v2_n"){
            is_correct = false
            break
        }
        
    }
    if(!is_correct){
        alert("worng")
    }
    else{
        alert("correct")
        for(key of Object.keys(connection_list)){
            if(key.includes("bjt_b")){
                resistance_values[connection_list[key].substring(0,2)] = "100"
            }
            else if(key.includes("bjt_c")){
                resistance_values[connection_list[key].substring(0,2)] = "4.7K"
            }
            
        }
    }
    for (key of Object.keys(resistance_values)){
        cell = document.getElementById(key)
        cell.textContent = key.toUpperCase() + " = " + resistance_values[key]
    }
}

function connect() {
    reset_connections()
    possible_connections = {
        "gnd1": "v1_n",
        "gnd2": "vac1n",
        'gnd3': "vac2n",
        'gnd4': "v2_p",
        'left_bjt_b': "r2l",
        'left_bjt_e': "r5l2",
        'left_bjt_c': "r4r",
        'r1l': "v1_p3",
        'r1r': "right_bjt_c",
        'r2l': "left_bjt_b",
        'r2r': "vac1p",
        'r3l': "right_bjt_b",
        'r3r': "vac2p",
        'r4l': "v1_p1",
        'r4r': "left_bjt_c",
        'r5l1': "right_bjt_e",
        'r5r': "v2_n",
        'r5l2': "left_bjt_e",
        'right_bjt_b': "r3l",
        'right_bjt_e': "r5l1",
        'right_bjt_c': "r1r",
        'v1_n': "gnd1",
        'v1_p1': "r4l",
        'v1_p3': "r1l",
        'v2_n': "r5r",
        'v2_p': "gnd4",
        'vac1n': "gnd2",
        'vac1p': "r2r",
        'vac2n': "gnd3",
        'vac2p': "r3r"
    }
    k=0
    for (i of Object.keys(possible_connections)){
        k+=1
        instance.connect({ uuids:[i,possible_connections[i]] })
    }
}

function reset_connections(){
    current_row = 1
    all_connections = instance.getAllConnections()
    for(let i = all_connections.length-1; i>=0;i--){
        instance.deleteConnection(all_connections[i])
    }
    for (key of Object.keys(resistance_values)){
        cell = document.getElementById(key)
        cell.textContent = key.toUpperCase() + " = "
    }
}


function calculate() {
    document.querySelector(`#row${current_row}`).querySelector("#vin1").querySelector("input").value = document.getElementById("vin1input").value
    document.querySelector(`#row${current_row}`).querySelector("#vin2").querySelector("input").value = document.getElementById("vin2input").value
    vin1 = parseInt(document.getElementById("vin1input").value,10)/1000
    vin2 = parseInt(document.getElementById("vin2input").value,10)/1000
    vd = vin1 - vin2
    vcm = (vin1+vin2)/2
    differential_gain = 162.068
    common_mode_gain = 0.3414 // later
    gain = 1000
    gm1  = 0.04
    gm2 = 0.04
    rc = 4700
    vo1 =  gm1*rc*vin1//gain * vin1
    vo2 = gm2*rc* vin2
    vo = differential_gain*vd + common_mode_gain*vcm

    differential_gain = Math.abs(vo/(vin1-vin2))
    
    document.querySelector(`#row${current_row}`).querySelector("#vo1").querySelector("input").value = vo1
    document.querySelector(`#row${current_row}`).querySelector("#vo2").querySelector("input").value = vo2
    document.querySelector(`#row${current_row}`).querySelector("#vo").querySelector("input").value = vo
    document.querySelector(`#row${current_row}`).querySelector("#dg").querySelector("input").value = differential_gain
    document.querySelector(`#row${current_row}`).querySelector("#cmg").querySelector("input").value = common_mode_gain
    document.querySelector(`#row${current_row}`).querySelector("#cmrr").querySelector("input").value = differential_gain/common_mode_gain //later
    if(current_row<5){
        current_row+=1
    }
        
}




check_button = document.getElementById("check_button")
connect_button = document.getElementById("connect_button")
reset = document.getElementById('reset_button')
calculate_button = document.getElementById("calculate_button")

check_button.addEventListener('click',check)
connect_button.addEventListener('click',connect)
reset.addEventListener('click',reset_connections)
calculate_button.addEventListener('click',calculate)