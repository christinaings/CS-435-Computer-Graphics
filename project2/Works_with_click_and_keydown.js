"use strict";

var canvas;
var gl;

var maxNumTriangles = 200;
var maxNumVertices  = 3 * maxNumTriangles;
var index = 0;
var first = true;

var mouse_down = false;
var key_down = false;

var t1, t2, t3, t4;

var cIndex = -1;

var colors = [
    vec4(0.0,0.0,0.0,0.0),
    vec4( 0.0, 0.0, 0.0, 1.0 ),  // black 0
    vec4( 1.0, 0.0, 0.0, 1.0 ),  // red 1
    vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow 2
    vec4( 0.0, 1.0, 0.0, 1.0 ),  // green 3
    vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue 4
    vec4( 1.0, 0.0, 1.0, 1.0 ),  // magenta 5
    vec4( 0.0, 1.0, 1.0, 1.0 )   // cyan 6
];


window.onload = function init() {
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.8, 0.8, 0.8, 1.0 );
    gl.clear( gl.COLOR_BUFFER_BIT );


    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );


    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, 8*maxNumVertices, gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation( program, "vPosition");
    gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    var cBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, 16*maxNumVertices, gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor");
    gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vColor);

    document.addEventListener("keydown",function(){

        if (event.keyCode == 49){
          cIndex = 1;
        }
        else if (event.keyCode == 50){
          cIndex = 2;
        }
        else if (event.keyCode == 51){
          cIndex = 3;
        }
        if (event.keyCode == 52){
          cIndex = 4;
        }
        else if (event.keyCode == 53){
          cIndex = 5;
        }
        else if (event.keyCode == 54){
          cIndex = 6;
        }

    });

    document.addEventListener("keyup",function(){
      cIndex = -1;
    });

    canvas.addEventListener("mousedown", function(event){
        mouse_down = true;
        var x = event.pageX - canvas.offsetLeft;
        var y = event.pageY - canvas.offsetTop;

        t1 = vec2(2*x/canvas.width-1 -0.5,
                  2*(canvas.height-y)/canvas.height-1-0.5);
        t2 = vec2(2*x/canvas.width-1+0.5,
                  2*(canvas.height-y)/canvas.height-1 +0.5);
        t3 = vec2(t1[0], t2[1]);
        t4 = vec2(t2[0], t1[1]);

    if (cIndex > 0){
        gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer);
        gl.bufferSubData(gl.ARRAY_BUFFER, 8*index, flatten(t1));
        gl.bufferSubData(gl.ARRAY_BUFFER, 8*(index+1), flatten(t3));
        gl.bufferSubData(gl.ARRAY_BUFFER, 8*(index+2), flatten(t2));
        gl.bufferSubData(gl.ARRAY_BUFFER, 8*(index+3), flatten(t4));
        gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer);
                  // index += 4;

        var t = vec4(colors[cIndex]);

        gl.bufferSubData(gl.ARRAY_BUFFER, 16*(index), flatten(t));
        gl.bufferSubData(gl.ARRAY_BUFFER, 16*(index+1), flatten(t));
        gl.bufferSubData(gl.ARRAY_BUFFER, 16*(index+2), flatten(t));
        gl.bufferSubData(gl.ARRAY_BUFFER, 16*(index+3), flatten(t));
        render();
      }

    });

    canvas.addEventListener("mouseup", function(event){
      mouse_down = false;
      index +=4;
    });

    render();
}



function render() {

    gl.clear( gl.COLOR_BUFFER_BIT );

    for(var i = 0; i<index; i+=4)
        gl.drawArrays( gl.TRIANGLE_FAN, i, 4 );

    if (mouse_down) gl.drawArrays( gl.TRIANGLE_FAN, index, 4 );

    // window.requestAnimFrame(render);

}
