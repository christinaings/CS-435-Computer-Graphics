//Christina Alexander - CS 435 - Project 1
//This program generates a Koch snowflake using a similar technique to that of a Serpinski Gadget


var canvas;
var gl;

// variable that will hold all the vertices
var points = [];

// select the number of times to divide
var NumTimesToSubdivide = 10;

// select the location and size of the triangle
var center = [0, 0];
var side_length = 1.5;

window.onload = function init()
{
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    //
    //  Initialize our data for the Snowflake
    //

	// calculate the vertices of the triangle
	vertices = calculateVertices(center, side_length)

	// begin creating the triangle(s)
    divideLine(vertices[0],vertices[1],NumTimesToSubdivide);
    divideLine(vertices[1],vertices[2],NumTimesToSubdivide);
    divideLine(vertices[2],vertices[0],NumTimesToSubdivide);

    //
    //  Configure WebGL
    //
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );

    //  Load shaders and initialize attribute buffers

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // Load the data into the GPU

    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

    // Associate out shader variables with our data buffer

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    render();
};


// Based on a given center and side length, calculate and return triangle vertices
function calculateVertices(center, side_length)
{
	a = [center[0], center[1] + Math.sqrt(3)/3 * side_length];
	b = [center[0] - side_length/2, center[1] - Math.sqrt(3)/6 * side_length];
	c = [center[0] + side_length/2, center[1] - Math.sqrt(3)/6 * side_length];

	vertices = [a, b, c];

	return vertices;
}

// create the Koch snowflake
function divideLine(coord_start, coord_end, count)
{
    // check for end of recursion
    if ( count == 0 ) {
		/*
		only add the starting coordinate because the ending
		coordinate will get added as the next line's
		starting coordinate
		*/
        points.push(coord_start);
    }

    else {
        // cut the input line into three lines
        var coord_one_third = mix(coord_start, coord_end, 1/3); // coordinate at 1/3 the line
        var coord_two_thirds = mix(coord_start, coord_end, 2/3); // coordinate at 2/3 the line

		/*
		the triangle coming off our input line will have two lines
		that are 120 degrees off of our input line
		one will start at coord_one_third, the other will start at coord_two_thirds
		*/

		diff_x = coord_end[0] - coord_start[0];
		diff_y = coord_end[1] - coord_start[1];
		angle = 120 + Math.atan2(diff_y,diff_x) * 180 / Math.PI;

		/*
		calculate the length of the lines that will come off our
		primary line at a 120 degree angle.
		this length should be 1/3 of our input line
		*/
		one_third_length = 1/3 * Math.sqrt(Math.pow(coord_end[0] - coord_start[0], 2) + Math.pow(coord_end[1] - coord_start[1], 2));

		/*
		using one_third_length, angle, and coord_one_third...calculate the coordinate
		where the two lines coming off the input line will meet
		*/
		new_x = coord_one_third[0] + (-1) * one_third_length * Math.cos(angle*Math.PI/180);
		new_y = coord_one_third[1] + (-1) * one_third_length * Math.sin(angle*Math.PI/180);
		var coord_new = [new_x, new_y];

		// keep track of our recursions
		--count;

    // if count > 0, we will run more recursions on the 4 lines we have created
		// if count == 0, then the coordinates for the 4 lines we have created will be added to 'points'
        divideLine(coord_start, coord_one_third, count);
        divideLine(coord_one_third, coord_new, count);
        divideLine(coord_new, coord_two_thirds, count);
        divideLine(coord_two_thirds, coord_end, count);
    }
}

function render()
{
    gl.clear( gl.COLOR_BUFFER_BIT );
    gl.drawArrays( gl.LINE_LOOP, 0, points.length );
}
