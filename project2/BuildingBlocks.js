"use strict"

//Christina Alexander - CS 435 - Project #2

/* This program allows users to spawn various sized and colored circles and triangles.
They can then move these shapes to build a design.*/

var canvas;
var gl;


var mouse_down = false;
var key_down = false;

var t1, t2, t3, t4;

var cIndex = -1;

var colors = [
    vec4( 1.0, 0.0, 0.0, 1.0 ),  // red 1
    vec4( 0.0, 1.0, 0.0, 1.0 ),  // green 3
    vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue 4
    vec4( 1.0, 0.0, 1.0, 1.0 ),  // magenta 5
    vec4( 0.0, 1.0, 1.0, 1.0 ),   // cyan 6
    vec4( 1.0, 1.0, 0.0, 1.0 )  // yellow 2
];

var projection; // projection matrix uniform shader variable location
var transformation; // projection matrix uniform shader variable location
var vPosition;
var vColor;

// state representation
var Blocks; // seven blocks
var BlockIdToBeMoved; // this black is moving
var MoveCount;
var OldX;
var OldY;

var rotIndex = 1; // default
var rotDegrees = [ 1, 5, 10, 30, 45, 90];

function CPiece (n, color, x0, y0, x1, y1, x2, y2, x3, y3) {
    this.NumVertices = n+1;
    this.color = color;
    this.points=[];
    this.colors=[];
    if (n ==4){
      this.points.push(vec2(x0, y0));
      this.points.push(vec2(x1, y1));
      this.points.push(vec2(x2, y2));
      this.points.push(vec2(x3, y3));
      this.points.push(vec2(x1, y1));
      for (var i=0; i<5; i++) this.colors.push(color);
    }
    else{
        this.NumVertices = 42;
        this.points.push(vec2(x0,y0)); //center of the circle

        var radiusOfCircle;
        if (cIndex == 0) radiusOfCircle= 20; //smallest circle
        else if(cIndex ==1) radiusOfCircle = 30;
        else if (cIndex ==2) radiusOfCircle = 40;

        var anglePerFan = (2*Math.PI) / 40;
        for(var i = 0; i < 41; i++)
        {
          var CirIndex = 2 * i + 2;
          var angle = anglePerFan * (i+1);
          var xCoordinate = x0 + Math.cos(angle) * radiusOfCircle;
          var yCoordinate = y0 + Math.sin(angle) * radiusOfCircle;

          var point = vec2(xCoordinate, yCoordinate);
          this.points.push(point);
        }

        for (var i=0; i<42; i++) this.colors.push(color);
    }
    this.vBuffer=0;
    this.cBuffer=0;

    this.OffsetX=0;
    this.OffsetY=0;
    this.Angle=0;

    this.UpdateOffset = function(dx, dy) {
        this.OffsetX += dx;
        this.OffsetY += dy;
    }

    this.SetOffset = function(dx, dy) {
        this.OffsetX = dx;
        this.OffsetY = dy;
    }

    this.UpdateAngle = function(deg) {
        this.Angle += deg;
    }

    this.SetAngle = function(deg) {
        this.Angle = deg;
    }

    this.isLeft = function(x, y, id) {	// Is Point (x, y) located to the left when walking from id to id+1?
        var id1=(id+1)%this.NumVertices;
        return (y-this.points[id][1])*(this.points[id1][0]-this.points[id][0])>(x-this.points[id][0])*(this.points[id1][1]-this.points[id][1]);
    }

    this.isInTriangle = function(p,a,b,c){  //checks to see if a point is in a sliver of the overall shape
                                            //p is the point we're checking, a is the center of the shape, b and c are two corners of the shape.
        var v0 = vec2(c[0]-a[0],c[1]-a[1]);
        var v1 = vec2(b[0]-a[0],b[1]-a[1]);
        var v2 = vec2(p[0]-a[0],p[1]-a[1]);

        var dot00 = (v0[0]*v0[0]) + (v0[1]*v0[1]);
        var dot01 = (v0[0]*v1[0]) + (v0[1]*v1[1]);
        var dot02 = (v0[0]*v2[0]) + (v0[1]*v2[1]);
        var dot11 = (v1[0]*v1[0]) + (v1[1]*v1[1]);
        var dot12 = (v1[0]*v2[0]) + (v1[1]*v2[1]);

        var invDenom = 1/ (dot00 * dot11 - dot01 * dot01);

        var u = (dot11 * dot02 - dot01 * dot12) * invDenom;
        var v = (dot00 * dot12 - dot01 * dot02) * invDenom;

        return ((u >= 0) && (v >= 0) && (u + v < 1));
    }

    this.transform = function(x, y) {
        var theta = -Math.PI/180*this.Angle;	// in radians
        var x2 = this.points[0][0] + (x - this.points[0][0]-this.OffsetX) * Math.cos(theta) - (y - this.points[0][1]-this.OffsetY) * Math.sin(theta);
        var y2 = this.points[0][1] + (x - this.points[0][0]-this.OffsetX) * Math.sin(theta) + (y - this.points[0][1]-this.OffsetY) * Math.cos(theta);
        return vec2(x2, y2);
    }

    this.isInside = function(x, y) {
        var p= this.transform(x, y);
        for (var i=0; i<this.NumVertices-1; i++) {
            if (this.isInTriangle(p,this.points[0],this.points[i],this.points[i+1])){ return true;} //checks every sliver apart from the last one

        }
        if (this.isInTriangle(p,this.points[0],this.points[this.NumVertices-1],this.points[1])) return true;  //checks the final sliver

        return false; //if it's not in any of the slivers, return false
    }

    this.init = function() {

        this.vBuffer = gl.createBuffer();

        gl.bindBuffer( gl.ARRAY_BUFFER, this.vBuffer );

        gl.bufferData( gl.ARRAY_BUFFER, flatten(this.points), gl.STATIC_DRAW );

        this.cBuffer = gl.createBuffer();

        gl.bindBuffer( gl.ARRAY_BUFFER, this.cBuffer );

        gl.bufferData( gl.ARRAY_BUFFER, flatten(this.colors), gl.STATIC_DRAW );

    }

    this.draw = function() {
        var tm=translate(this.points[0][0]+this.OffsetX, this.points[0][1]+this.OffsetY, 0.0);
        tm=mult(tm, rotate(this.Angle, vec3(0, 0, 1)));
        tm=mult(tm, translate(-this.points[0][0], -this.points[0][1], 0.0));
        gl.uniformMatrix4fv( transformation, gl.TRUE, flatten(tm) );

        gl.bindBuffer( gl.ARRAY_BUFFER, this.vBuffer );
        gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
        gl.enableVertexAttribArray( vPosition );


        gl.bindBuffer( gl.ARRAY_BUFFER, this.cBuffer );
        gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
        gl.enableVertexAttribArray( vColor );


        gl.drawArrays( gl.TRIANGLE_FAN, 0, this.NumVertices );

    }

}

window.onload = function initialize() {
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    document.addEventListener("keydown",function(){//if a key is pressed

        if (event.keyCode == 49){//if 1 is pressed
          cIndex = 0;
        }
        else if (event.keyCode == 50){//if 2 is pressed
          cIndex = 1;
        }
        else if (event.keyCode == 51){//if 3 is pressed
          cIndex = 2;
        }
        if (event.keyCode == 52){//if 4 is pressed
          cIndex = 3;
        }
        else if (event.keyCode == 53){//if 5 is pressed
          cIndex = 4;
        }
        else if (event.keyCode == 54){//if 6 is pressed
          cIndex = 5;
        }

    });

    document.addEventListener("keyup",function(){//when key is released
      cIndex = -1;
    });


  canvas.addEventListener("mousedown", function(event){
    if (event.button!=0) return; // left button only
    var x = event.pageX - canvas.offsetLeft;
    var y = event.pageY - canvas.offsetTop;
    y=canvas.height-y;

    if (cIndex >= 0){
        if(cIndex == 3){//For the smallest square
          t1 = vec2(x-20,y-20);
          t2 = vec2(x+20,y+20);
        }
        if (cIndex == 4){//for the medium sized square
          t1 = vec2(x-40,y-40);
          t2 = vec2(x+40,y+40);
        }
        if (cIndex == 5){//for the largest square
          t1 = vec2(x-75,y-75);
          t2 = vec2(x+75,y+75);
        }
        if (cIndex < 3){//for the circles - radius is determined in the CPiece class
          t1 = vec2(x,y);
          t2 = vec2(x,y);

        }

       t3 = vec2(t1[0], t2[1]);
       t4 = vec2(t2[0], t1[1]);

       if (cIndex > 2){
         Blocks.push( new CPiece(4, vec4(colors[cIndex]), t1[0], t1[1], t2[0], t2[1], t3[0], t3[1], t4[0], t4[1])); //make a new square
       }
       else{
        Blocks.push(new CPiece(2, vec4(colors[cIndex]), t1[0], t1[1], t2[0], t2[1], t3[0], t3[1], t4[0], t4[1])); //make a new circle
       }
       Blocks[Blocks.length-1].init();
     }

    if (event.shiftKey) {  // with shift key, delete
      for (var i=Blocks.length-1; i>=0; i--) {	// search from last to first
        if (Blocks[i].isInside(x, y)) {
          // move Blocks[i] to the top
          var temp=Blocks[i];
          for (var j=i; j<Blocks.length-1; j++) Blocks[j]=Blocks[j+1];
          Blocks[Blocks.length-1]=temp;
          // rotate the block
          Blocks.pop();
          // redraw
          // render();
          window.requestAnimFrame(render);
          return;
        }
      }
      return;
    }
    for (var i=Blocks.length-1; i>=0; i--) {	// search from last to first
      if (Blocks[i].isInside(x, y)) {
        // move Blocks[i] to the top
        var temp=Blocks[i];
        for (var j=i; j<Blocks.length-1; j++) Blocks[j]=Blocks[j+1];
        Blocks[Blocks.length-1]=temp;
        // remember the one to be moved
        BlockIdToBeMoved=Blocks.length-1;
        MoveCount=0;
        OldX=x;
        OldY=y;
        // redraw
        window.requestAnimFrame(render);
        // render();
        break;
      }
    }
  });

  canvas.addEventListener("mouseup", function(event){
    if (BlockIdToBeMoved>=0) {

      BlockIdToBeMoved=-1;
    }
  });

  canvas.addEventListener("mousemove", function(event){
    if (BlockIdToBeMoved>=0) {  // if dragging
      var x = event.pageX - canvas.offsetLeft;
      var y = event.pageY - canvas.offsetTop;
      y=canvas.height-y;
      Blocks[BlockIdToBeMoved].UpdateOffset(x-OldX, y-OldY);
      MoveCount++;
      OldX=x;
      OldY=y;
      window.requestAnimFrame(render);
      // render();
    }
  });

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.5, 0.5, 0.5, 1.0 );

    //
    //  Load shaders and initialize attribute buffers
    //
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Initial State
    Blocks=[];


    BlockIdToBeMoved=-1; // no piece selected

    projection = gl.getUniformLocation( program, "projection" );
    var pm = ortho( 0.0, canvas.width, 0.0, canvas.height, -1.0, 1.0 );
    gl.uniformMatrix4fv( projection, gl.TRUE, flatten(pm) );

    transformation = gl.getUniformLocation( program, "transformation" );

    vPosition = gl.getAttribLocation( program, "vPosition" );
    vColor = gl.getAttribLocation( program, "vColor" );

    render();
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);

    for (var i=0; i<Blocks.length; i++) {
        Blocks[i].draw();
    }

    // window.requestAnimFrame(render);
}
