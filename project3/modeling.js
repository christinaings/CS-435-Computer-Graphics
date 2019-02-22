
var NumVertices = 36; //(6 faces)(2 triangles/face)(3 vertices/triangle)

var points = [];
var seven = [];
var seven_colors = [];
var colors = [];

var word = "";

var paragraph = "Hello. My name is Christina. I am a student at the University of Alabama, and I am taking Computer Graphics this Spring."
var parIndex = 0;

var vertices = [
    vec4( -0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5,  0.5,  0.5, 1.0 ),
    vec4(  0.5,  0.5,  0.5, 1.0 ),
    vec4(  0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5, -0.5, -0.5, 1.0 ),
    vec4( -0.5,  0.5, -0.5, 1.0 ),
    vec4(  0.5,  0.5, -0.5, 1.0 ),
    vec4(  0.5, -0.5, -0.5, 1.0 )
];

// RGBA colors
var vertexColors = [
    vec4( 0.0, 0.0, 0.0, 1.0 ),  // black
    vec4( 1.0, 0.0, 0.0, 1.0 ),  // red
    vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow
    vec4( 0.0, 1.0, 0.0, 1.0 ),  // green
    vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue
    vec4( 1.0, 0.0, 1.0, 1.0 ),  // magenta
  // white
    vec4( 0.0, 1.0, 1.0, 1.0 ),   // cyan
    vec4(1.0,1.0,1.0,1.0)
];


// Parameters controlling the size of the Robot's arm

var BASE_HEIGHT      = .3;
var BASE_WIDTH       = 5.0;
var LOWER_ARM_HEIGHT = 2.0;
var LOWER_ARM_WIDTH  = .5;
var UPPER_ARM_HEIGHT = 6.0;
var UPPER_ARM_WIDTH  = 12.0;

var alphaNum = {
  A: 0,
  B: 1,
  C: 2,
  D: 3,
  E: 4,
  F: 5,
  G: 6,
  H: 7,
  I: 8,
  J: 9,
  K: 10,
  L: 11,
  M: 12,
  N: 13,
  O: 14,
  P: 15,
  Q: 16,
  R: 17,
  S: 18,
  T: 19,
  U: 20,
  V: 21,
  W: 22,
  X: 23,
  Y: 24,
  Z: 25
}

var chars = [
  [1,1,1,0,0,0,1,1,1,1,0,0,0,1,0,0], //A
  [1,1,0,1,0,0,1,0,1,1,1,0,0,0,1,1], //B
  [1,1,1,0,0,0,0,0,0,0,0,0,0,1,1,1], //C
  [1,1,0,1,0,0,1,0,0,1,1,0,0,0,1,1], //D
  [1,1,1,0,0,0,0,1,0,0,0,0,0,1,1,1], //E
  [1,1,1,0,0,0,0,1,0,0,0,0,0,1,0,0], //F
  [1,1,1,0,0,0,0,0,1,1,0,0,0,1,1,1], //G
  [0,0,1,0,0,0,1,1,1,1,0,0,0,1,0,0], //H
  [1,1,0,1,0,0,0,0,0,0,1,0,0,0,1,1], //I
  [0,0,0,0,0,0,1,0,0,1,0,0,0,1,1,1], //J
  [0,0,1,0,0,1,0,1,0,0,0,1,0,1,0,0], //K
  [0,0,1,0,0,0,0,0,0,0,0,0,0,1,1,1], //L
  [0,0,1,0,1,1,1,0,0,1,0,0,0,1,0,0], //M
  [0,0,1,0,1,0,1,0,0,1,0,1,0,1,0,0], //N
  [1,1,1,0,0,0,1,0,0,1,0,0,0,1,1,1], //O
  [1,1,1,0,0,0,1,1,1,0,0,0,0,1,0,0], //P
  [1,1,1,0,0,0,1,0,0,1,0,1,0,1,1,1], //Q
  [1,1,1,0,0,0,1,1,1,0,0,1,0,1,0,0], //R
  [1,1,0,0,1,0,0,0,1,1,0,0,0,0,1,1], //S
  [1,1,0,1,0,0,0,0,0,0,1,0,0,0,0,0], //T
  [0,0,1,0,0,0,1,0,0,1,0,0,0,1,1,1], //U
  [0,0,1,0,0,1,0,0,0,0,0,0,1,1,0,0], //V
  [0,0,1,0,0,0,1,0,0,1,0,1,1,1,0,0], //W
  [0,0,0,0,1,1,0,0,0,0,0,1,1,0,0,0], //X
  [0,0,1,0,0,0,1,1,1,0,1,0,0,0,0,0], //Y
  [1,1,0,0,0,1,0,0,0,0,0,0,1,0,1,1] //Z
  ]

// Shader transformation matrices

var modelViewMatrix, projectionMatrix;

// Array of rotation angles (in degrees) for each rotation axis

var Base = 0;
var LowerArm = 1;
var UpperArm = 2;


var theta= [ 0, 0, 0];
var phi = 0;

var angle = 0;

var modelViewMatrixLoc;

var vBuffer, cBuffer;

//----------------------------------------------------------------------------

function quad(  a,  b,  c,  d ) {
    colors.push(vertexColors[a]);
    points.push(vertices[a]);
    colors.push(vertexColors[a]);
    points.push(vertices[b]);
    colors.push(vertexColors[a]);
    points.push(vertices[c]);
    colors.push(vertexColors[a]);
    points.push(vertices[a]);
    colors.push(vertexColors[a]);
    points.push(vertices[c]);
    colors.push(vertexColors[a]);
    points.push(vertices[d]);
}


function colorCube() {
    quad( 1, 0, 3, 2 );
    quad( 2, 3, 7, 6 );
    quad( 3, 0, 4, 7 );
    quad( 6, 5, 1, 2 );
    quad( 4, 5, 6, 7 );
    quad( 5, 4, 0, 1 );
}


function quadLetter(  a,  b,  c,  d ) {
    seven_colors.push(vertexColors[7]);
    seven.push(vertices[a]);
    seven_colors.push(vertexColors[7]);
    seven.push(vertices[b]);
    seven_colors.push(vertexColors[7]);
    seven.push(vertices[c]);
    seven_colors.push(vertexColors[7]);
    seven.push(vertices[a]);
    seven_colors.push(vertexColors[7]);
    seven.push(vertices[c]);
    seven_colors.push(vertexColors[7]);
    seven.push(vertices[d]);
}



function colorLetter() {
    quadLetter( 1, 0, 3, 2 );
    quadLetter( 2, 3, 7, 6 );
    quadLetter( 3, 0, 4, 7 );
    quadLetter( 6, 5, 1, 2 );
    quadLetter( 4, 5, 6, 7 );
    quadLetter( 5, 4, 0, 1 );
}

//____________________________________________

// Remmove when scale in MV.js supports scale matrices

function scale4(a, b, c) {
   var result = mat4();
   result[0][0] = a;
   result[1][1] = b;
   result[2][2] = c;
   return result;
}

function isLetter(str) {
  return str.match(/[a-z]/i) || str.match(/[A-Z]/i);
}

window.onload = function init() {

    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );

    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    gl.enable( gl.DEPTH_TEST );

    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders( gl, "vertex-shader", "fragment-shader" );

    gl.useProgram( program );

    colorCube();
    //cyl();
    // Load shaders and use the resulting shader program

    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

  //  drawCylinder(10,10,10,10);

    // Create and initialize  buffer objects

    document.getElementById("Button5").onclick = function(){theta[2] += 10;};
    document.getElementById("Button6").onclick = function(){theta[2] -= 10;};
    document.getElementById("Button7").onclick = function(){phi -= 10;};
    document.getElementById("Button8").onclick = function(){phi += 10;};

    var intervalID = window.setInterval(function (){
        word = "";
        if (parIndex >= paragraph.length)
          parIndex = 0;
        while(paragraph[parIndex] != ' ' && parIndex != paragraph.length){
          if (isLetter(paragraph[parIndex]))
            word += paragraph[parIndex];
          ++parIndex;
        }
        ++parIndex;
        word = word.toUpperCase();
        console.log(word);
        //word.toUpperCase();
    }, 1000);


    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");

    projectionMatrix = ortho(-10, 10, -10, 10, -10, 10);
    gl.uniformMatrix4fv( gl.getUniformLocation(program, "projectionMatrix"),  false, flatten(projectionMatrix) );

    render();
}

//----------------------------------------------------------------------------



function base() {
  this.vBuffer = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER, this.vBuffer );
  gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

  this.vPosition = gl.getAttribLocation( program, "vPosition" );
  gl.vertexAttribPointer( this.vPosition, 4, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( this.vPosition );

  this.cBuffer = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER, this.cBuffer );
  gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

  this.vColor = gl.getAttribLocation( program, "vColor" );
  gl.vertexAttribPointer( this.vColor, 4, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( this.vColor );

    modelViewMatrix = rotate(theta[Base], 0, 1, 0 );
    var s = scale4(BASE_WIDTH, BASE_HEIGHT, BASE_WIDTH);
    var instanceMatrix = mult( translate( 0.0, 0.5 * BASE_HEIGHT, 0.0 ), s);
    var t = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv(modelViewMatrixLoc,  false, flatten(t) );
    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
}

//----------------------------------------------------------------------------


function upperArm() {
    var s = scale4(UPPER_ARM_WIDTH, UPPER_ARM_HEIGHT, .1);
    var instanceMatrix = mult(translate( 0.0, 0.5 * UPPER_ARM_HEIGHT, 0.0 ),s);
    var t = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv( modelViewMatrixLoc,  false, flatten(t) );
    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
}

//----------------------------------------------------------------------------


function lowerArm()
{

    var s = scale4(LOWER_ARM_WIDTH, LOWER_ARM_HEIGHT, 1);
    var instanceMatrix = mult( translate( 0.0, 0.5 * LOWER_ARM_HEIGHT, 0.0 ), s);
    var t = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv( modelViewMatrixLoc,  false, flatten(t) );
    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
}

//----------------------------------------------------------------------------

//need to give it position and character
function sevenSeg(char){
    colorLetter();


  this.vBuffer = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER, this.vBuffer );
  gl.bufferData( gl.ARRAY_BUFFER, flatten(seven), gl.STATIC_DRAW );

  this.vPosition = gl.getAttribLocation( program, "vPosition" );
  gl.vertexAttribPointer( this.vPosition, 4, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( this.vPosition );

  this.cBuffer = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER, this.cBuffer );
  gl.bufferData( gl.ARRAY_BUFFER, flatten(seven_colors), gl.STATIC_DRAW );

  this.vColor = gl.getAttribLocation( program, "vColor" );
  gl.vertexAttribPointer( this.vColor, 4, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( this.vColor );

  var s = scale4(.2, .1, .2);
  var s2 = scale4(.45,.1,.2);
  var slant = scale4(.35,.08,.15);
  var angle = 0;
  //top horiz left

  var instanceMatrix = mult(translate( -0.1,.2, 0.0 ),s);
  var t = mult(modelViewMatrix, instanceMatrix);

  if (char[0] == 1){
    gl.uniformMatrix4fv( modelViewMatrixLoc,  false, flatten(t) );
    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
  }

//top horiz right

  instanceMatrix = mult(translate( 0.15,0.2, 0.0 ),s);
  t = mult(modelViewMatrix, instanceMatrix);
  if(char[1] == 1){
    gl.uniformMatrix4fv( modelViewMatrixLoc,  false, flatten(t) );
    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
  }
//top vert left
  modelViewMatrix = mult(modelViewMatrix,rotate(90,0,0,1));
  instanceMatrix = mult(translate( -.1,.25, 0.0 ),s2);
  t = mult(modelViewMatrix, instanceMatrix);
  if(char[2] == 1)
    gl.uniformMatrix4fv( modelViewMatrixLoc,  false, flatten(t) );
    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
//top vert mid
  instanceMatrix = mult(translate( -0.1,-0.05, 0.0 ),s2);
  t = mult(modelViewMatrix, instanceMatrix);
  if (char[3] == 1)
    gl.uniformMatrix4fv( modelViewMatrixLoc,  false, flatten(t) );
    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
  //top slant up
  instanceMatrix = mult(translate( -.1,.1, 0.0 ),slant);
  instanceMatrix = mult(instanceMatrix,rotate(-60,0,0,1));
  t = mult(modelViewMatrix, instanceMatrix);
  if (char[4] == 1){
    gl.uniformMatrix4fv( modelViewMatrixLoc,  false, flatten(t) );
    gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
  }
  //top slant down
  instanceMatrix = mult(translate( -.1,-.2, 0.0 ),slant);
  instanceMatrix = mult(instanceMatrix,rotate(60,0,0,1));
  t = mult(modelViewMatrix, instanceMatrix);
  if (char[5] == 1){
  gl.uniformMatrix4fv( modelViewMatrixLoc,  false, flatten(t) );
  gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
}
//top vert right
instanceMatrix = mult(translate( -.1,.2-.55, 0.0 ),s2);
t = mult(modelViewMatrix, instanceMatrix);
if (char[6] == 1){
gl.uniformMatrix4fv( modelViewMatrixLoc,  false, flatten(t) );
gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
}
//middle horiz left
  instanceMatrix = mult(translate( .1,.4, 0.0 ),s);
  modelViewMatrix = mult(modelViewMatrix,rotate(90,0,0,1));
  var t = mult(modelViewMatrix, instanceMatrix);
  if (char[7] == 1){
  gl.uniformMatrix4fv( modelViewMatrixLoc,  false, flatten(t) );
  gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
}
//middle horiz right
instanceMatrix = mult(translate( -.15,.4, 0.0 ),s);
t = mult(modelViewMatrix, instanceMatrix);
if (char[8] == 1){
gl.uniformMatrix4fv( modelViewMatrixLoc,  false, flatten(t) );
gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
}
//bottom right vert
modelViewMatrix = mult(modelViewMatrix,rotate(90,0,0,1));
instanceMatrix = mult(translate( .7,.35, 0.0 ),s2);
t = mult(modelViewMatrix, instanceMatrix);
if (char[9] == 1){
gl.uniformMatrix4fv( modelViewMatrixLoc,  false, flatten(t) );
gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
}
//bottom mid vert
instanceMatrix = mult(translate( 0.7,.05, 0.0 ),s2);
t = mult(modelViewMatrix, instanceMatrix);
if (char[10] == 1){
gl.uniformMatrix4fv( modelViewMatrixLoc,  false, flatten(t) );
gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
}
//bottom down slant
instanceMatrix = mult(translate( 0.7,.2, 0.0 ),slant);
instanceMatrix = mult(instanceMatrix,rotate(30,0,0,1));
t = mult(modelViewMatrix, instanceMatrix);
if (char[11] == 1){
gl.uniformMatrix4fv( modelViewMatrixLoc,  false, flatten(t) );
gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
}
//bottom up slant
instanceMatrix = mult(translate( 0.7,-.1, 0.0 ),slant);
instanceMatrix = mult(instanceMatrix,rotate(-30,0,0,1));
t = mult(modelViewMatrix, instanceMatrix);
if (char[12] == 1){
gl.uniformMatrix4fv( modelViewMatrixLoc,  false, flatten(t) );
gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
}
//bottom vert left
  instanceMatrix = mult(translate( 0.7,-.25, 0.0 ),s2);
  t = mult(modelViewMatrix, instanceMatrix);
  if (char[13] == 1){
  gl.uniformMatrix4fv( modelViewMatrixLoc,  false, flatten(t) );
  gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
}

//bottom hoiz left
  instanceMatrix = mult(translate( -0.1,-1, 0.0 ),s);
  modelViewMatrix = mult(modelViewMatrix,rotate(90,0,0,1));
  var t = mult(modelViewMatrix, instanceMatrix);
  if(char[14] == 1){
  gl.uniformMatrix4fv( modelViewMatrixLoc,  false, flatten(t) );
  gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
}
//bottom horiz right
  instanceMatrix = mult(translate( 0.15,-1, 0.0 ),s);
  var t = mult(modelViewMatrix, instanceMatrix);
  if (char[15] == 1){
  gl.uniformMatrix4fv( modelViewMatrixLoc,  false, flatten(t) );
  gl.drawArrays( gl.TRIANGLES, 0, NumVertices );
}

}

var renderWord = function(word){
  for(var i = 0; i < word.length; i++){
    sevenSeg(chars[alphaNum[word[i]]- alphaNum['A']]);
    modelViewMatrix  = mult(modelViewMatrix, translate(.9, 0, 0.0));
  }
}

var render = function() {

    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );

    modelViewMatrix = rotate(theta[Base], 0, 1, 0 );
    base();

    modelViewMatrix = mult(modelViewMatrix, translate(0.0, BASE_HEIGHT, 0.0));
    modelViewMatrix = mult(modelViewMatrix, rotate(theta[LowerArm], 0, 0, 1 ));

    lowerArm();
    modelViewMatrix  = mult(modelViewMatrix, translate(0.0, LOWER_ARM_HEIGHT, 0.0));
    modelViewMatrix  = mult(modelViewMatrix, rotate(theta[UpperArm], 0, 1, 0) );
    modelViewMatrix = mult(modelViewMatrix,rotate(phi, 1, 0, 0 ));
    upperArm();
    modelViewMatrix  = mult(modelViewMatrix, translate(-5.5, LOWER_ARM_HEIGHT+1.5, 0.0));
    renderWord(word);

    requestAnimFrame(render);
}
