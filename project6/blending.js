//Christina Alexander - CS 435 - Project 6

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
var wallWindow;
var outsideTex;
var white;

var x = 2;
var y = 2;


var atMat = [
    [
        translate( -.7, -.7, .01 ),
        translate( -.4, -.7, .01 ),
        translate( 0, -.7, .01 ),
        translate( .4, -.7, .01 ),
        translate( .7, -.7, .01 )
    ],
    [
        translate( -.7, -.4, .01 ),
        translate( -.4, -.4, .01 ),
        translate( 0, -.4, .01 ),
        translate( .4, -.4, .01 ),
        translate( .7, -.4, .01 )
    ],
    [
        translate( -.7, 0, .01 ),
        translate( -.4, 0, .01 ),
        translate( 0, 0, .01 ),
        translate( .4, 0, .01 ),
        translate( .7, 0, .01 )
    ],
    [
        translate( -.7, .4, .01 ),
        translate( -.4, .4, .01 ),
        translate( 0, .4, .01 ),
        translate( .4, .4, .01 ),
        translate( .7, .4, .01 )
    ],
    [
        translate( -.7, .7, .01 ),
        translate( -.4, .7, .01 ),
        translate( 0, .7, .01 ),
        translate( .4, .7, .01 ),
        translate( .7, .7, .01 )
    ],

]



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

function configureTexture2( image ) {
    var texture = gl.createTexture();
    gl.bindTexture( gl.TEXTURE_2D, texture );
    //gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
    gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGBA,
         gl.RGBA, gl.UNSIGNED_BYTE, image );
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

window.onload = function init() {

    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    colorCube();
   

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

    document.addEventListener("keydown",function(){//if a key is pressed

        if (event.keyCode == 38){
            if (x > 0) --x;
        }
        if (event.keyCode == 40){
            if (x < 4) ++x;
        }
        if (event.keyCode == 39){
            if (y > 0) --y;
        }
        if (event.keyCode == 37){
            if (y < 4) ++y;
        }

    });
    
    

    var image = document.getElementById("texImage"); //wallpaper image
    var image2 = document.getElementById("texImage2"); //carpet image
    var image3 = document.getElementById("texImage3"); //window wall
    var image4 = document.getElementById("texImage4");
    var image5 = document.getElementById("texImage5");

    wallTex = configureTexture( image ); //wallpaper
    carpetTex = configureTexture( image2 ); //carpet
    wallWindow = configureTexture2( image3 ); //window wall
    outsideTex = configureTexture( image4 );
    white = configureTexture( image5 );
    modelViewMatrixLoc = gl.getUniformLocation(program,"modelViewMatrix");
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

    render();

}


var render = function(){
    
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    modelViewMatrix = mult(rotate(-10,1,0,0),scalem(1.02,1.02,1.02));
    modelViewMatrix = mult(translate(0,.06,0),modelViewMatrix);
    modelViewMatrixLoc = gl.getUniformLocation(program,"modelViewMatrix");
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));


    gl.uniform3fv(thetaLoc, flatten(theta));
    gl.bindTexture(gl.TEXTURE_2D, wallTex);
    gl.drawArrays(gl.TRIANGLES, 6, 12);

    
    gl.bindTexture(gl.TEXTURE_2D, carpetTex);
    gl.drawArrays(gl.TRIANGLES, 18, 6);

    gl.bindTexture(gl.TEXTURE_2D,outsideTex);
    var s = mult(rotate(180,0,0,1),scalem(1.5,1.5,1));
    var instanceMatrix = mult(atMat[x][y],s);
    var t = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv( modelViewMatrixLoc,  false, flatten(t) );
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    modelViewMatrix = mult(rotate(-10,1,0,0),mult(rotate(180,0,0,1),scalem(1.02,1.02,1.02)));
    modelViewMatrix = mult(translate(0,.06,0),modelViewMatrix);
    modelViewMatrixLoc = gl.getUniformLocation(program,"modelViewMatrix");
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));

    
    gl.bindTexture(gl.TEXTURE_2D, wallWindow);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    gl.bindTexture(gl.TEXTURE_2D,white);
    modelViewMatrix = mult(translate(1.641,0,0),modelViewMatrix);
    modelViewMatrixLoc = gl.getUniformLocation(program,"modelViewMatrix");
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    modelViewMatrix = mult(translate(-3.28,0,0),modelViewMatrix);
    modelViewMatrixLoc = gl.getUniformLocation(program,"modelViewMatrix");
    gl.uniformMatrix4fv(modelViewMatrixLoc, false, flatten(modelViewMatrix));
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    requestAnimFrame(render);
}
