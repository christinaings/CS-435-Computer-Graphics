// CS 435, Project 4, Christina Alexander
//This program creates a two dimensional stage that is lit by a spotlight
//The spotlight can be moved into 5x5 different positions that are specified
//in the lightPositionMatrix and is moved using buttons defined in the UI
//it can also be moved using arrow keys
//the number of subdivisions of the stage can be changed by using a slider
//on the UI. It defines a minimum and maximum number of times the stage
//can be subdivided to prevent the user from stalling the program by creating
//too many subdivisions.

var canvas;
var gl;
var program;
var numTimesToSubdivide = 3;

var index = 0;

var pointsArray = [];
var normalsArray = [];
var colorsArray = [];

var shader = 0;


var near = -10;
var far = 10;
var radius = 1.5;
var theta  = 0.0;
var phi    = 0.0;
var dr = 5.0 * Math.PI/180.0;

var left = -3.0;
var right = 3.0;
var ytop =3.0;
var bottom = -3.0;

var max = 7;
var min = 1;

posX = 2;
posY = 2;

var va = vec4(-2.75, 2.75, 1, 1);
var vb = vec4(-2.75, -2.75, 1, 1);
var vc = vec4(2.75, -2.75, 1, 1);
var vd = vec4(2.75, 2.75, 1, 1);

var lightPositionMatrix = [
  [
    vec4(-2.5, 2.5, 1, 2),
    vec4(-1.3, 2.5, 1, 2),
    vec4(0, 2.5, 1, 2),
    vec4(1.3, 2.5, 1, 2),
    vec4(2.5, 2.5, 1, 2)
  ],
  [
    vec4(-2.5, 1.3, 1, 2),
    vec4(-1.3, 1.3, 1,2),
    vec4(0, 1.3, 1, 2),
    vec4(1.3, 1.3, 1, 2),
    vec4(2.5, 1.3, 1, 2)
  ],
  [
    vec4(-2.5, 0, 1, 2),
    vec4(-1.3, 0, 1, 2),
    vec4(0, 0, 1, 2),
    vec4(1.3, 0, 1, 2),
    vec4(2.5, 0, 1, 2)
  ],
  [
    vec4(-2.5, -1.3, 1, 2),
    vec4(-1.3, -1.3, 1, 2),
    vec4(0, -1.3, 1, 2),
    vec4(1.3, -1.3, 1, 2),
    vec4(2.5, -1.3, 1, 2)
  ],
  [
    vec4(-2.5, -2.5, 1, 2),
    vec4(-1.3, -2.5, 1, 2),
    vec4(0, -2.5, 1, 2),
    vec4(1.3,-2.5, 1, 2),
    vec4(2.5, -2.5, 1, 2)
  ]
];

var lightPosition = vec4(0,0,1,2);
var lightAmbient = vec4(.2, .2, .2, 1.0 );
var lightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
var lightSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );

var materialAmbient = vec4( 1.0, 0.0, 1.0, 1.0 );
var materialDiffuse = vec4( 1.0, 0.8, 1.0, 1.0 );
var materialSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );
var shininess = 10.0;

var ctm;
var ambientColor, diffuseColor, specularColor;

var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;

var normalMatrix, normalMatrixLoc;

var eye;
var at = vec3(0.0, 0.0, 0.0);
var up = vec3(0.0, 1.0, 0.0);

function square(a, b, c, d) {



     pointsArray.push(a);
     pointsArray.push(b);
     pointsArray.push(c);
     pointsArray.push(a);
     pointsArray.push(c);
     pointsArray.push(d);
     // normals are vectors

     normalsArray.push(a[0],a[1], a[2], 0.0);
     normalsArray.push(b[0],b[1], b[2], 0.0);
     normalsArray.push(c[0],c[1], c[2], 0.0);
     normalsArray.push(a[0],a[1], a[2], 0.0);
     normalsArray.push(c[0],c[1], c[2], 0.0);
     normalsArray.push(d[0],d[1], d[2], 0.0);

     for (var i = 0; i < 6; i++)
      colorsArray.push(vec4(0,0,0,1));

     index += 6;

}


function divideSquare(a, b, c, d, count) {
    if ( count - 1> 0 ) {

        var ab = mix( a, b, 0.5);
        var ac = mix( a, c, 0.5);
        var bc = mix( b, c, 0.5);
        var ad = mix( a, d, 0.5);
        var cd = mix( c, d, 0.5);


        divideSquare( a, ab, ac, ad, count - 1 );
        divideSquare( ab, b, bc, ac, count - 1 );
        divideSquare( ac, bc, c, cd, count - 1 );
        divideSquare( ad, ac, cd, d, count - 1 );
    }
    else {
        square( a, b, c, d);
    }
}

window.onload = function init() {

    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //
  ;
    if (shader ==  0)
      program = initShaders( gl, "per-vertex-vertex-shader", "per-vertex-fragment-shader" );
    else {
      program = initShaders( gl, "per-fragment-vertex-shader", "per-fragment-fragment-shader" );
    }
    gl.useProgram( program );


    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);


    divideSquare(va, vb, vc, vd, numTimesToSubdivide);

    var nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normalsArray), gl.STATIC_DRAW );

    var vNormal = gl.getAttribLocation( program, "vNormal" );
    gl.vertexAttribPointer( vNormal, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal);

    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation( program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );
    normalMatrixLoc = gl.getUniformLocation( program, "normalMatrix" );

    document.addEventListener("keyup",function(){//if a key is pressed

        if (event.keyCode == 37){//if left is pressed
          if(posY - 1 >= 0){
            posY -= 1;
            lightPosition = lightPositionMatrix[posX][posY];
            init();
            }
        }
        else if (event.keyCode == 38){//if up is pressed
          if(posX - 1 >= 0){
          posX -= 1;
          lightPosition = lightPositionMatrix[posX][posY];
          init();
          }
        }
        else if (event.keyCode == 39){//if right is pressed
          if(posY + 1 < 5){

            posY += 1;
            lightPosition = lightPositionMatrix[posX][posY];
            init();
            }
        }
        if (event.keyCode == 40){//if down is pressed
          if(posX + 1 < 5){

          posX += 1;
          lightPosition = lightPositionMatrix[posX][posY];
          init();
          }
        }
    });

    document.getElementById("Button0").onclick = function(){
      shader = 0;
      init();
    }
    document.getElementById("Button1").onclick = function(){
      shader = 1;
      init();
    }

    document.getElementById("Button2").onclick = function(){
      if(posY - 1 >= 0){

        posY -= 1;
        lightPosition = lightPositionMatrix[posX][posY];
        init();
        }
      };
    document.getElementById("Button3").onclick = function(){
      if(posY + 1 < 5){

        posY += 1;
        lightPosition = lightPositionMatrix[posX][posY];
        init();
        }
      };
    document.getElementById("Button4").onclick = function(){
      if(posX - 1 >= 0){
      posX -= 1;
      lightPosition = lightPositionMatrix[posX][posY];
      init();
      }
    };
    document.getElementById("Button5").onclick = function(){
      if(posX + 1 < 5){

      posX += 1;
      lightPosition = lightPositionMatrix[posX][posY];
      init();
      }
    };

    document.getElementById("subdiv").onchange = function(event) {
          numTimesToSubdivide = document.getElementById("subdiv").value;
          index = 0;
          pointsArray = [];
          normalsArray = [];
          init();
      };


    gl.uniform4fv( gl.getUniformLocation(program,
       "ambientProduct"),flatten(ambientProduct) );
    gl.uniform4fv( gl.getUniformLocation(program,
       "diffuseProduct"),flatten(diffuseProduct) );
    gl.uniform4fv( gl.getUniformLocation(program,
       "specularProduct"),flatten(specularProduct) );
    gl.uniform4fv( gl.getUniformLocation(program,
       "lightPosition"),flatten(lightPosition) );
    gl.uniform1f( gl.getUniformLocation(program,
       "shininess"),shininess );

    render();
}


function render() {

    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    eye = vec3(radius*Math.sin(90)*Math.cos(90),
        radius*Math.sin(90)*Math.sin(90), radius*Math.cos(0));

    modelViewMatrix = rotate(30,1,0,0);
    projectionMatrix = ortho(left, right, bottom, ytop, near, far);

    // normal matrix only really need if there is nonuniform scaling
    // it's here for generality but since there is
    // no scaling in this example we could just use modelView matrix in shaders

    normalMatrix = [
        vec3(modelViewMatrix[0][0], modelViewMatrix[0][1], modelViewMatrix[0][2]),
        vec3(modelViewMatrix[1][0], modelViewMatrix[1][1], modelViewMatrix[1][2]),
        vec3(modelViewMatrix[2][0], modelViewMatrix[2][1], modelViewMatrix[2][2])
    ];

    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix) );
    gl.uniformMatrix4fv(projectionMatrixLoc, false, flatten(projectionMatrix) );
    gl.uniformMatrix3fv(normalMatrixLoc, false, flatten(normalMatrix) );

    for( var i=0; i<index; i+=6)
        gl.drawArrays( gl.TRIANGLES, i, 6 );

    window.requestAnimFrame(render);
}
