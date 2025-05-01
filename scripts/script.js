var gl = document.getElementById(`gl`).getContext(`webgl`) || document.getElementById(`gl`).getContext(`experimental-webgl`); 
var vertices = [];
function InitWebGL()
{
    if (!gl)
    {
        alert(`WebGL is not supported!!!!`);
        return;
    }
    let canvas = document.getElementById(`gl`);
    if (canvas.width != canvas.clientWidth || canvas.height != canvas.clientHeight)
    {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
    }
    InitViewport();
}

function InitViewport()
{
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0.0, 0.4, 0.6, 1);
    gl.enable(gl.DEPTH_TEST);
    // gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);

    InitShaders();
}

function InitShaders()
{
    const vertex = InitVertexShader();
    const fragment = InitFragmentShader();

    let program = InitShaderProgram(vertex, fragment);
    if (!ValidateShaderProgram(program))
    {
        return false;
    }
    return CreateGeometryBuffers(program);
}

function InitVertexShader()
{
    let e = document.getElementById(`vs`);
    let vs = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vs, e.value);
    gl.compileShader(vs);

    if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS))
    {
        let e = gl.getShaderInfoLog(vs);
        console.error(`Failed init vertex shader: `, e);
        return;
    }
    return vs;
}

function InitFragmentShader()
{
    let e = document.getElementById(`fs`);
    let fs = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fs, e.value);
    gl.compileShader(fs);

    if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS))
    {
        let e = gl.getShaderInfoLog(fs);
        console.error(`Failed init fragment shader: `, e);
        return;
    }
    return fs;
}

function InitShaderProgram(vs, fs)
{
    let p = gl.createProgram();
    gl.attachShader(p, vs);
    gl.attachShader(p, fs);
    gl.linkProgram(p);

    if (!gl.getProgramParameter(p, gl.LINK_STATUS))
    {
        console.error(gl.getProgramInfoLog(p));
        alert(`Failed linking program`);
        return;
    }
    return p;
}

function ValidateShaderProgram(p)
{
    gl.validateProgram(p);
    if(!gl.getProgramParameter(p, gl.VALIDATE_STATUS))
    {
        console.error(gl.getProgramInfoLog(p));
        alert(`Errors found validating shader program`);
        return false;
    }
    return true;
}

function CreateGeometryBuffers(program)
{
    CreateGeometryUI();

    CreateVBO(program, new Float32Array(vertices));

    angleGL = gl.getUniformLocation(program, 'Angle');
    CreateTexture(program, 'img/tekstur.jpg');

    gl.useProgram(program);
    Render();
}
function CreateGeometryUI()
{
    const ew = document.getElementById('w');
    const w = ew ? ew.value : 1.0;
    const eh = document.getElementById('h');
    const h = eh ? eh.value : 1.0;
    document.getElementById('ui').innerHTML = `
    Width: <input type="number" id="w" value="${w}" onchange="InitShaders();"><br>
    Height: <input type="number" id="h" value="${h}" onchange="InitShaders();">
  `;
    let e = document.getElementById('shape');
    switch (e.selectedIndex)
    {
        case 0: CreateTriangle(w, h); break;
        case 1: CreateQuad(w, h,); break;
    }

}

function CreateVBO(program, vert)
{
    let vbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, vert, gl.STATIC_DRAW);
    const s = 11 * Float32Array.BYTES_PER_ELEMENT;

    let p = gl.getAttribLocation(program, `Pos`);
    gl.vertexAttribPointer(p, 3, gl.FLOAT, gl.FALSE, s, 0);
    gl.enableVertexAttribArray(p);

    const o = 3 * Float32Array.BYTES_PER_ELEMENT;
    let c = gl.getAttribLocation(program, `Color`);
    gl.vertexAttribPointer(c, 3, gl.FLOAT, gl.FALSE, s, o);
    gl.enableVertexAttribArray(c);

    const o2 = o * 2;
    let u = gl.getAttribLocation(program, 'UV');
    gl.vertexAttribPointer(u, 2, gl.FLOAT, gl.FALSE, s, o2);
    gl.enableVertexAttribArray(u);

    const o3 = o2 + 2 * Float32Array.BYTES_PER_ELEMENT;
    let n = gl.getAttribLocation(program, 'Normal');
    gl.vertexAttribPointer(n, 3, gl.FLOAT, gl.FALSE, s, o3);
    gl.enableVertexAttribArray(n);
}

function Render()
{
    gl.clearColor(0.0, 0.4, 0.6, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 11);
}

function AddVertex(x, y, z, r, g, b, u, v, nx, ny, nz)
{
    const index = vertices.length;
    vertices.length += 11;
    vertices[index + 0] = x;
    vertices[index + 1] = y;
    vertices[index + 2] = z;
    vertices[index + 3] = r;
    vertices[index + 4] = g;
    vertices[index + 5] = b;
    vertices[index + 6] = u;
    vertices[index + 7] = v;
    vertices[index + 8] = nx;
    vertices[index + 9] = ny;
    vertices[index + 10] = nz;



}

function AddTriangle(x1, y1, z1, r1, g1, b1, u1, v1, nx1, ny1, nz1,     
                     x2, y2, z2, r2, g2, b2, u2, v2, nx2, ny2, nz2,
                     x3, y3, z3, r3, g3, b3, u3, v3, nx3, ny3, nz3)
{
AddVertex(x1, y1, z1, r1, g1, b1, u1, v1, nx1, ny1, nz1);
AddVertex(x2, y2, z2, r2, g2, b2, u2, v2, nx2, ny2, nz2);
AddVertex(x3, y3, z3, r3, g3, b3, u3, v3, nx3, ny3, nz3);
}

function AddQuad(x1, y1, z1, r1, g1, b1, u1, v1, nx1, ny1, nz1,
                 x2, y2, z2, r2, g2, b2, u2, v2, nx2, ny2, nz2,
                 x3, y3, z3, r3, g3, b3, u3, v3, nx3, ny3, nz3,
                 x4, y4, z4, r4, g4, b4, u4, v4, nx4, ny4, nz4)
{
    AddTriangle(x1, y1, z1, r1, g1, b1, u1, v1, nx1, ny1, nz1,
                x2, y2, z2, r2, g2, b2, u2, v2, nx2, ny2, nz2,
                x3, y3, z3, r3, g3, b3, u3, v3, nx3, ny3, nz3)
    AddTriangle(x3, y3, z3, r3, g3, b3, u3, v3, nx3, ny3, nz3,
                x4, y4, z4, r4, g4, b4, u4, v4, nx4, ny4, nz4,
                x1, y1, z1, r1, g1, b1, u1, v1, nx1, ny1, nz1)
}

function CreateTriangle(width, height)
{
    vertices.length = 0;
    const w = width * 0.5;
    const h = height * 0.5;

    AddTriangle(0.0, h, 0.0, 1.0, 0.0, 0.0, 0.5, 1.0, 0.0, 0.0, 1.0,
               -w,-h, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0,
                w,-h, 0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0
    );

}
function CreateQuad(width, height)
{
    vertices.length = 0;
    const w = width * 0.5;
    const h = height * 0.5;


    AddQuad(
        -w, h, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,
        -w,-h, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1.0,
         w,-h, 0.0, 0.0, 0.0, 1.0, 1.0, 0.0, 0.0, 0.0, 1.0,
         w, h, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0, 0.0, 0.0, 1.0
    );

}

var mouseX = 0;
var mouseY = 0;
var angle = [ 0.0, 0.0, 0.0, 1.0 ];
var angleGL = 0;
document.getElementById('gl').addEventListener(
    'mousemove', function(e) {
        if (e.buttons == 1)
        {
            angle[0] -= (mouseY - e.y) * 0.1;
            angle[1] -= (mouseX - e.x) * 0.1;
            gl.uniform4fv(angleGL, new Float32Array(angle));
            Render();
        }
        mouseX = e.x;
        mouseY = e.y;
    }
);

var textureGL = 0;
var display = [ 0.0, 0.0, 0.0, 0.0 ];
var displayGL = 0;

function CreateTexture(program, url)
{
    const texture = LoadTexture(url);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    textureGL = gl.getUniformLocation(program, 'Texture');
    displayGL = gl.getUniformLocation(program, 'Display');
}

function LoadTexture(url)
{
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    const pixel = new Uint8Array([0, 0, 255, 255]);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, pixel);
    const image = new Image();
    image.onload = () => {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
        SetTextureFilters(image);
    };
    image.src = url;
    return texture;
}
function SetTextureFilters(image)
{
    if (IsPow2(image.width) && IsPow2(image.height))
    {
        gl.generateMipmap(gl.TEXTURE_2D);
    }
    else
    {
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    }
}

function IsPow2(value)
{
    return (value & (value - 1)) === 0;
}

function Update()
{
    const t = document.getElementById('t');
    display[3] = t.checked ? 1.0 : 0.0;

    const l = document.getElementById('l').value;
    display[0] = parseInt(l.substring(1,3),16) / 255.0;
    display[1] = parseInt(l.substring(3,5),16) / 255.0;
    display[2] = parseInt(l.substring(5,7),16) / 255.0;


    gl.uniform4fv(displayGL, new Float32Array(display));
    Render();
}