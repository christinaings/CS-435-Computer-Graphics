

var canvas;
var gl;

var numVertices  = 6;

var pointsArray = [];
var colorsArray = [];

var vertices = [
        vec4( -0.3, .2,  0.5, 1.0 ),
        vec4( -0.3,  0.5,  0.5, 1.0 ),
        vec4( 0.3,  0.5,  0.5, 1.0 ),
        vec4( 0.3, 0.2,  0.5, 1.0 ),
        vec4( -0.5, -0.5, -0.5, 1.0 ),
        vec4( -0.5,  0.5, -0.5, 1.0 ),
        vec4( 0.5,  0.5, -0.5, 1.0 ),
        vec4( 0.5, -0.5, -0.5, 1.0 ),
    ];

var vertexColors = [
        vec4( 0.0, 0.0, 0.0, 1.0 ),  // black
        vec4( 1.0, 0.0, 0.0, 1.0 ),  // red
        vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow
        vec4( 0.0, 1.0, 0.0, 1.0 ),  // green
        vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue
        vec4( 1.0, 0.0, 1.0, 1.0 ),  // magenta
        vec4( 0.0, 1.0, 1.0, 1.0 ),  // cyan
        vec4( 1.0, 1.0, 1.0, 1.0 ),  // white
    ];

var base = new Base();
var display = new Display();

var near = -1;
var far = 1;
var radius = 0;
var theta  = 0.0;
var phi    = 0.0;
var dr = Math.PI/180.0;

var left = -1.0;
var right = 1.0;
var ytop = 1.0;
var bottom = -1.0;


var mvMatrix, pMatrix;
var modelView, projection;
var eye;

const at = vec3(0.0, 0.0, 0.0);
const up = vec3(0.0, 1.0, 0.0);

// quad uses first index to set color for face

function quad(a, b, c, d) {
     pointsArray.push(vertices[a]);
     colorsArray.push(vertexColors[a]);
     pointsArray.push(vertices[b]);
     colorsArray.push(vertexColors[a]);
     pointsArray.push(vertices[c]);
     colorsArray.push(vertexColors[a]);
     pointsArray.push(vertices[a]);
     colorsArray.push(vertexColors[a]);
     pointsArray.push(vertices[c]);
     colorsArray.push(vertexColors[a]);
     pointsArray.push(vertices[d]);
     colorsArray.push(vertexColors[a]);
}

// Each face determines two triangles

function colorCube()
{
    quad( 1, 0, 3, 2 );
}


function Display () {

  function quad(a, b, c, d) {
       this.points.push(vertices[a]);
       this.colors.push(vertexColors[a]);
       this.points.push(vertices[b]);
       this.colors.push(vertexColors[a]);
       this.points.push(vertices[c]);
       this.colors.push(vertexColors[a]);
       this.points.push(vertices[a]);
       this.colors.push(vertexColors[a]);
       this.points.push(vertices[c]);
       this.colors.push(vertexColors[a]);
       this.points.push(vertices[d]);
       this.colors.push(vertexColors[a]);
  }

    this.init = function() {

        this.vBuffer = gl.createBuffer();

        gl.bindBuffer( gl.ARRAY_BUFFER, this.vBuffer );

        gl.bufferData( gl.ARRAY_BUFFER, flatten(this.points), gl.STATIC_DRAW );

        this.cBuffer = gl.createBuffer();

        gl.bindBuffer( gl.ARRAY_BUFFER, this.cBuffer );

        gl.bufferData( gl.ARRAY_BUFFER, flatten(this.colors), gl.STATIC_DRAW );

        this.vColor = gl.getAttribLocation( program, "vColor" );
        gl.vertexAttribPointer( this.vColor, 4, gl.FLOAT, false, 0, 0 );
        gl.enableVertexAttribArray( this.vColor);

        this.vPosition = gl.getAttribLocation( program, "vPosition" );
        gl.vertexAttribPointer( this.vPosition, 4, gl.FLOAT, false, 0, 0 );
        gl.enableVertexAttribArray( this.vPosition );

        quad();

    }

    this.draw = function() {
      eye = vec3(Math.sin(phi), Math.sin(theta),
           Math.cos(phi));

      mvMatrix = lookAt(eye, at , up);
      pMatrix = ortho(left, right, bottom, ytop, near, far);

      gl.uniformMatrix4fv( modelView, false, flatten(mvMatrix) );
      gl.uniformMatrix4fv( projection, false, flatten(pMatrix) );

      gl.drawArrays( gl.TRIANGLES, 0, 6 );

    }

}

function Base () {


    this.init = function() {

        this.vBuffer = gl.createBuffer();

        gl.bindBuffer( gl.ARRAY_BUFFER, this.vBuffer );

        gl.bufferData( gl.ARRAY_BUFFER, flatten(this.points), gl.STATIC_DRAW );

        this.cBuffer = gl.createBuffer();

        gl.bindBuffer( gl.ARRAY_BUFFER, this.cBuffer );

        gl.bufferData( gl.ARRAY_BUFFER, flatten(this.colors), gl.STATIC_DRAW );

        this.points.push(vec3(-.5,-.5,-.5));
        this.points.push(vec3(-.5,-.1,-.5));
        this.points.push(vec3(.5,-.1,-.5));
        this.points.push(vec3(.5,-.5,-.5));


    }

    this.draw = function() {

      gl.drawArrays( gl.TRIANGLES, 0, this.NumVertices );

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
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    colorCube();

    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor);

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    modelView = gl.getUniformLocation( program, "modelView" );
    projection = gl.getUniformLocation( program, "projection" );

    //display.init();
    //base.init();
// buttons to change viewing parameters


    document.getElementById("Button5").onclick = function(){theta += dr;};
    document.getElementById("Button6").onclick = function(){theta -= dr;};
    document.getElementById("Button7").onclick = function(){phi += dr;};
    document.getElementById("Button8").onclick = function(){phi -= dr;};

    render();
}


var render = function() {
        gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        base.draw();
        eye = vec3(Math.sin(phi), Math.sin(theta),
             Math.cos(phi));

        mvMatrix = lookAt(eye, at , up);

        pMatrix = ortho(left, right, bottom, ytop, near, far);

        gl.uniformMatrix4fv( modelView, false, flatten(mvMatrix) );
        gl.uniformMatrix4fv( projection, false, flatten(pMatrix) );


        gl.drawArrays( gl.TRIANGLES, 0, numVertices );
        requestAnimFrame(render);
    }
