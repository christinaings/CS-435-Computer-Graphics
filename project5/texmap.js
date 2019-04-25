//Christina Alexander - CS 435 - Project 5

var canvas;
var gl;

var numVertices  = 18;

var texSize = 64;

var program;

var pointsArray = [];

var colorsArray = [];
var texCoordsArray = [];

var modelViewMatrix = rotate(-10,1,0,0);
var modelViewMatrixLoc;

var wallTex;
var carpetTex;
var woodTex;
var shinyTex;

var monitorTex = [];
var currFrame = 0;
var maxFrame = 4;

var paused = false;

function scale4(a, b, c) {
   var result = mat4();
   result[0][0] = a;
   result[1][1] = b;
   result[2][2] = c;
   return result;
}

var texCoord = [
    vec2(0, 0),
    vec2(0, 1),
    vec2(1, 1),
    vec2(1, 0)
];

var vertices = [
    vec4( -0.8, -0.8,  0.8, 1.0 ),
    vec4( -0.8,  0.8,  0.8, 1.0 ),
    vec4( 0.8,  0.8,  0.8, 1.0 ),
    vec4( 0.8, -0.8,  0.8, 1.0 ),
    vec4( -1, -0.8, -1, 1.0 ),
    vec4( -1,  0.8, -1, 1.0 ),
    vec4( 1,  0.8, -1, 1.0 ),
    vec4( 1, -0.8, -1, 1.0 )
];


var cubeVert = [
    vec4( -0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5,  0.5,  0.5, 1.0 ),
    vec4( 0.5,  0.5,  0.5, 1.0 ),
    vec4( 0.5, -0.5,  0.5, 1.0 ),
    vec4( -.5, -0.5, -.5, 1.0 ),
    vec4( -.5,  0.5, -.5, 1.0 ),
    vec4( .5,  0.5, -.5, 1.0 ),
    vec4( .5, -0.5, -.5, 1.0 )
];



var vertexColors = [
    vec4( 0.0, 0.0, 0.0, 1.0 ),  // black
    vec4( 1.0, 0.0, 0.0, 1.0 ),  // red
    vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow
    vec4( 0.0, 1.0, 0.0, 1.0 ),  // green
    vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue
    vec4( 1.0, 0.0, 1.0, 1.0 ),  // magenta
    vec4( 0.0, 1.0, 1.0, 1.0),  // white
    vec4( 0.0, 1.0, 1.0, 1.0 )   // cyan
];

var xAxis = 0;
var yAxis = 1;
var zAxis = 2;
var axis = xAxis;
var theta = [-10, 0, 0];

var thetaLoc;

function configureTexture( image ) {
    var texture = gl.createTexture();
    gl.bindTexture( gl.TEXTURE_2D, texture );
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGB,
         gl.RGB, gl.UNSIGNED_BYTE, image );
    gl.generateMipmap( gl.TEXTURE_2D );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
                      gl.NEAREST_MIPMAP_LINEAR );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );

    // gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);

    return texture;
}

//This function is used only for the walls and floor
function quad(a, b, c, d) {
     pointsArray.push(vertices[a]);
     colorsArray.push(vertexColors[6]);
     texCoordsArray.push(texCoord[0]);

     pointsArray.push(vertices[b]);
     colorsArray.push(vertexColors[6]);
     texCoordsArray.push(texCoord[1]);

     pointsArray.push(vertices[c]);
     colorsArray.push(vertexColors[6]);
     texCoordsArray.push(texCoord[2]);

     pointsArray.push(vertices[a]);
     colorsArray.push(vertexColors[6]);
     texCoordsArray.push(texCoord[0]);

     pointsArray.push(vertices[c]);
     colorsArray.push(vertexColors[6]);
     texCoordsArray.push(texCoord[2]);

     pointsArray.push(vertices[d]);
     colorsArray.push(vertexColors[6]);
     texCoordsArray.push(texCoord[3]);
}



//Draw three walls and the floor
function colorCube()
{
    quad( 1, 0, 3, 2 ); //back wall
    quad( 2, 3, 7, 6 ); //right wall
    quad( 5, 4, 0, 1 );//left wall
    quad( 3, 0, 4, 7 );//floor
}



//Used for everything apart from the walls and floor
function cube(a, b, c, d) {
     pointsArray.push(cubeVert[a]);
     colorsArray.push(vertexColors[a]);
     texCoordsArray.push(texCoord[0]);

     pointsArray.push(cubeVert[b]);
     colorsArray.push(vertexColors[a]);
     texCoordsArray.push(texCoord[1]);

     pointsArray.push(cubeVert[c]);
     colorsArray.push(vertexColors[a]);
     texCoordsArray.push(texCoord[2]);

     pointsArray.push(cubeVert[a]);
     colorsArray.push(vertexColors[a]);
     texCoordsArray.push(texCoord[0]);

     pointsArray.push(cubeVert[c]);
     colorsArray.push(vertexColors[a]);
     texCoordsArray.push(texCoord[2]);

     pointsArray.push(cubeVert[d]);
     colorsArray.push(vertexColors[a]);
     texCoordsArray.push(texCoord[3]);
}


function drawCube()
{
    cube( 1, 0, 3, 2 );//back
    cube( 2, 3, 7, 6 );//right
    cube( 3, 0, 4, 7 );//bottom
    cube( 6, 5, 1, 2 );//top
    cube( 5, 4, 0, 1 );//left
    cube( 4, 5, 6, 7 );//front
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
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    colorCube();
    drawCube();

  //  drawTable();

    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    var tBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW );

    var vTexCoord = gl.getAttribLocation( program, "vTexCoord" );
    gl.vertexAttribPointer( vTexCoord, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vTexCoord );


    //
    // Initialize a texture
    //

    //var image = new Image();
    //image.onload = function() {
     //   configureTexture( image );
    //}
    //image.src = "SA2011_black.gif"


    var image = document.getElementById("texImage"); //wallpaper image
    var image2 = document.getElementById("texImage2"); //carpet image
    var image3 = document.getElementById("texImage3"); //wood image
    var image4 = document.getElementById("texImage4"); //tv material image
    var image9 = document.getElementById("texImage9"); //tv off image

    wallTex = configureTexture( image ); //wallpaper
    carpetTex = configureTexture( image2 ); //carpet
    woodTex = configureTexture( image3 ); //wood
    shinyTex = configureTexture( image4 ); //tv material
    monitorTex.push(configureTexture(image9)); //push tv off into monitor array of textures

    for (var i = 5; i < 9; i++){
      var tempImage = document.getElementById("texImage" + i);
      monitorTex.push(configureTexture(tempImage)); //push frames for tv
    };

    modelViewMatrixLoc = gl.getUniformLocation(program,"modelViewMatrix");
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

    document.getElementById("ButtonOff").onclick = function(){
      if (currFrame != 0){//if it's on turn it off
        currFrame = 0;
      }
      else {  //if it's off turn it on
        currFrame = 1;
      }
      render();
    };

    document.getElementById("ButtonPausePlay").onclick = function(){
      if (paused == true){ //if it's paused, play it
        paused = false;
      }
      else {
        paused = true; //if it's playing, pause it
      }
      render();
    };
    document.getElementById("ButtonPrev").onclick = function(){
      if(paused == true){
        if (currFrame == 1){
          currFrame = maxFrame;
        }
        else {
          currFrame--;
        }
      }
      render();
    };
    document.getElementById("ButtonNext").onclick = function(){
      if(paused == true){
        if (currFrame == 1){
          currFrame++;
        }
        else {
          currFrame = 1;
        }
      }
      render();
    };

    var intervalID = window.setInterval(function (){
      if(currFrame != 0 && paused == false){//if tv is on and playing change frame
        if(currFrame == maxFrame){
          currFrame = 1;
        }
        else {
          currFrame++;
        }
      }
    }, 1000);

    render();

}

function drawTable(){

  //draw table top
  gl.bindTexture(gl.TEXTURE_2D, woodTex);
  var s = scalem(1,.1, 1);
  var instanceMatrix = mult(translate( 0.0, -.3, 0.0 ),s);
  var t = mult(modelViewMatrix, instanceMatrix);
  gl.uniformMatrix4fv( modelViewMatrixLoc,  false, flatten(t) );
  gl.drawArrays(gl.TRIANGLES, 24, 36);

  //left back leg
  var s = scalem(.1,.2, 1);
  s = mult(s, rotate(90,0,1,0));
  var instanceMatrix = mult(translate( -0.4, -.5, 0.0 ),s);
  var t = mult(modelViewMatrix, instanceMatrix);
  gl.uniformMatrix4fv( modelViewMatrixLoc,  false, flatten(t) );
  gl.drawArrays(gl.TRIANGLES, 24, 36);

  //left front leg
  var instanceMatrix = mult(translate( -0.45, -.5, -0.5 ),s);
  var t = mult(modelViewMatrix, instanceMatrix);
  gl.uniformMatrix4fv( modelViewMatrixLoc,  false, flatten(t) );
  gl.drawArrays(gl.TRIANGLES, 24, 36);

  //right front leg
  var instanceMatrix = mult(translate( 0.45, -.5, -0.5 ),s);
  var t = mult(modelViewMatrix, instanceMatrix);
  gl.uniformMatrix4fv( modelViewMatrixLoc,  false, flatten(t) );
  gl.drawArrays(gl.TRIANGLES, 24, 36);
  //right back leg
  var instanceMatrix = mult(translate( 0.4, -.5, 0 ),s);
  var t = mult(modelViewMatrix, instanceMatrix);
  gl.uniformMatrix4fv( modelViewMatrixLoc,  false, flatten(t) );
  gl.drawArrays(gl.TRIANGLES, 24, 36);
}

function drawMonitor(){
  gl.bindTexture(gl.TEXTURE_2D, shinyTex);
  //draw stand
  var s = scalem(.05,.3, .1);
  var instanceMatrix = mult(translate( 0.0, -.2, .1 ),s);
  var t = mult(modelViewMatrix, instanceMatrix);
  gl.uniformMatrix4fv( modelViewMatrixLoc,  false, flatten(t) );
  gl.drawArrays(gl.TRIANGLES, 24, 36);
  //draw base
  var s = scalem(.5,.02, .5);
  var instanceMatrix = mult(translate( 0.0, -.25, 0 ),s);
  var t = mult(modelViewMatrix, instanceMatrix);
  gl.uniformMatrix4fv( modelViewMatrixLoc,  false, flatten(t) );
  gl.drawArrays(gl.TRIANGLES, 24, 36);
  //draw draw monitor
  var s = scalem(1,.5, .1);
  var instanceMatrix = mult(translate( 0.0, .2, 0.0 ),s);
  var t = mult(modelViewMatrix, instanceMatrix);
  gl.uniformMatrix4fv( modelViewMatrixLoc,  false, flatten(t) );
  gl.drawArrays(gl.TRIANGLES, 24, 36);

  //draw screen
  gl.bindTexture(gl.TEXTURE_2D, monitorTex[currFrame]);
  var s = scalem(.9,.4, .1);
  var instanceMatrix = mult(translate( 0.0, .2, -.01 ),s);
  var t = mult(modelViewMatrix, instanceMatrix);
  gl.uniformMatrix4fv( modelViewMatrixLoc,  false, flatten(t) );
  gl.drawArrays(gl.TRIANGLES, 54, 6);

}


var render = function(){
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    modelViewMatrix = rotate(-10,1,0,0);
    modelViewMatrixLoc = gl.getUniformLocation(program,"modelViewMatrix");
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

    gl.uniform3fv(thetaLoc, flatten(theta));
    gl.bindTexture(gl.TEXTURE_2D, wallTex);
    gl.drawArrays(gl.TRIANGLES, 0, 18);
    gl.bindTexture(gl.TEXTURE_2D, carpetTex);
    gl.drawArrays(gl.TRIANGLES, 18, 6);
    drawTable();
    drawMonitor();

    requestAnimFrame(render);
}
