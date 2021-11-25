possible_connections = {
    "gnd1": "v1_n",
    "gnd2": "vac1n",
    'gnd3': "vac2n",
    'gnd4': "v2_p",
    'left_bjt_b': "r2l",
    'left_bjt_c': "rgl2",
    'left_bjt_e': "r4r",
    'r1l': "v1_p3",
    'r1r': "right_bjt_e",
    'r2l': "left_bjt_b",
    'r2r': "vac1p",
    'r3l': "right_bjt_b",
    'r3r': "vac2p",
    'r4l': "v1_p1",
    'r4r': "left_bjt_e",
    'r5l1': "right_bjt_c",
    'r5r': "v2_n",
    'rgl2': "left_bjt_c",
    'right_bjt_b': "r3l",
    'right_bjt_c': "r5l1",
    'right_bjt_e': "r1r",
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
// connect existing endpoints
// jsPlumb.ready(function () {  
//     var e0 = jsPlumb.addEndpoint("container0",{uuid:"ep0"}), //set your own uuid for endpoint to access later.
//     e1 = jsPlumb.addEndpoint("container1",{uuid:"ep1"});  
//     jsPlumb.connect({ uuids:[e0.getUuid(),e1.getUuid()] }); 
//             // (or) 
//     jsPlumb.connect({ uuids:["ep0","ep1"] });
// });

for (i of Object.keys(possible_connections)){
    console.log(i,"=",possible_connections[i])
}