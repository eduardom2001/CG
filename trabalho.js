import * as THREE from './three.js-master/src/Three.js';

// init
var up, down, left, right;
var speed = 0.02;
var cubespeed = 0.015;
var cubesize = 1;
var gameover = false;
var Clock = new THREE.Clock();
Clock.start();
var delta = 0;
var interval = 1 / 60;
var cont = 0;
var donutspeed = 0.02;
var donutspeedy = 0.015


// camera
const camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );
var posCamera = new THREE.Vector3(0, 0, 3);
camera.position.add(posCamera);

// scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xdddddd);

//lights
{
    const color = 'white';
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    scene.add(light);
}
{
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(1, -2, -4);
    scene.add(light);
}

// cube
var lista = [];
var listatamanho = [];
var listavelocidade = [];
var j = 0;
const geometry = new THREE.BoxGeometry( 0.1, 0.1, 0.1 );

function addCube() {
    var material = new THREE.MeshNormalMaterial();
    var cube = new THREE.Mesh( geometry, material );
    while (true) {
        cube.position.x = (Math.random()*10)-5;
        cube.position.y = (Math.random()*8)-4;
        var distanciaY = Math.abs(playerMesh.position.y - cube.position.y);
        var distanciaX = Math.abs(playerMesh.position.x - cube.position.x);
        if (distanciaY > 0.1 && distanciaX > 0.1) {
            break;
        }
    }
    var cubevelocidade = cubespeed;
    var cubetamanho = cubesize;
    lista.push(cube);
    listatamanho.push(cubetamanho);
    listavelocidade.push(cubevelocidade);
    j += 1;
    scene.add( cube );
}
function removeCube(i) {
    scene.remove(lista[i]);
    lista.splice(i, 1);
    listatamanho.splice(i, 1);
    listavelocidade.splice(i, 1);
    i -= 1;
    j -= 1;
    return i;
}

function movecube() {
    for ( var i = 0; i < j; i++ ) {
        lista[i].rotation.x += 0.05;
        lista[i].rotation.y += 0.05;
        
        // primeira
        // if (lista[i].position.x > playerMesh.position.x) {
        //     lista[i].position.x -= cubespeed;
        // } else if (lista[i].position.x < playerMesh.position.x) {
        //     lista[i].position.x += cubespeed;
        // }
        // if (lista[i].position.y > playerMesh.position.y) {
        //     lista[i].position.y -= cubespeed;
        // } else if (lista[i].position.y < playerMesh.position.y) {
        //     lista[i].position.y += cubespeed;
        // }
        
        var distanciaY = Math.abs(playerMesh.position.y - lista[i].position.y);
        var distanciaX = Math.abs(playerMesh.position.x - lista[i].position.x);

        if (distanciaY <= (0.06*listatamanho[i]) && distanciaX <= (0.06*listatamanho[i])) {
            endGame();
            break;
        }

        // segunda
        if (distanciaY != 0) {
           var ratio = Math.abs(distanciaX / distanciaY);
           var totaldiv = (distanciaX + distanciaY) / distanciaY;
           var unidadevelocidade = Math.abs(listavelocidade[i] / totaldiv);
        } else { var ratio = 1; var unidadevelocidade = listavelocidade[i]; }
        var unidadevelocidadex = ratio*unidadevelocidade; 
        
        if (lista[i].position.x > playerMesh.position.x) {
           lista[i].position.x -= unidadevelocidadex;
        } else if (lista[i].position.x < playerMesh.position.x) {
           lista[i].position.x += unidadevelocidadex;
        }
        if (lista[i].position.y > playerMesh.position.y) {
           lista[i].position.y -= unidadevelocidade;    
        } else if (lista[i].position.y < playerMesh.position.y) {
           lista[i].position.y += unidadevelocidade;
        }

        // EVOLUIR CUBO
        if (listatamanho[i] >= 5) {
            addDonut(lista[i].position.x, lista[i].position.y);
            i = removeCube(i);
            continue;
        }

        // JUNTAR OS CUBOS
        for (var k = 0; k < j; k++ ) {
            if (k == i) {
                continue;
            }
            var cubedistanciaY = Math.abs(lista[k].position.y - lista[i].position.y);
            var cubedistanciaX = Math.abs(lista[k].position.x - lista[i].position.x);
            if (cubedistanciaX < (0.1*listatamanho[k]) && cubedistanciaY < (0.1*listatamanho[i])) {
                if (listatamanho[i] > listatamanho[k]) {
                    lista[k].position.y = lista[i].position.y;
                    lista[k].position.x = lista[i].position.x;
                }
                listatamanho[k] += listatamanho[i];
                lista[k].scale.set(listatamanho[k], listatamanho[k], listatamanho[k]);
                listavelocidade[k] -= 0.002*(listatamanho[k] - 1);
                i = removeCube(i);
                break;
            }
        }
    }
}

function removeAll(){
    // console.log("REMOVEALL");
    for ( var i = 0; i < j; i++ ) {
        i = removeCube(i);
    }
    for ( var a = 0; a < b; a++ ) {
        console.log("a",a);
        scene.remove(listadonut[a]);
        listadonut.splice(a, 1);
        listadonutspeed.splice(a, 1);
        listadonutspeedy.splice(a, 1);
        a -= 1;
        b -= 1;
    }
}

// donut
var listadonut = [];
var listadonutspeed = [];
var listadonutspeedy = [];
const donutgeometry = new THREE.TorusGeometry( 0.2, 0.06, 10, 20 );
var donutmaterial = new THREE.MeshPhongMaterial();
donutmaterial.color = new THREE.Color(0xff0000);
donutmaterial.flatShading = true;
donutmaterial.emissive = new THREE.Color(0x003903);
donutmaterial.shininess = 100;
donutmaterial.specular = new THREE.Color(0x333333);
var b = 0;

function addDonut(donutX, donutY) {
    var donut = new THREE.Mesh( donutgeometry, donutmaterial );
    listadonut.push(donut);
    listadonutspeed.push(Math.random() <= 0.5 ? donutspeed : -donutspeed);
    listadonutspeedy.push(Math.random() <= 0.5 ? donutspeedy : -donutspeedy);
    donut.position.x = donutX;
    donut.position.y = donutY;
    b += 1;
    scene.add( donut );
}
function moveDonut() {
    for (var a = 0; a < b; a++){
        listadonut[a].rotation.z += 0.05;
        var distanciaY = Math.abs(playerMesh.position.y - listadonut[a].position.y);
        var distanciaX = Math.abs(playerMesh.position.x - listadonut[a].position.x);
        if (distanciaY <= 0.25 && distanciaX <= 0.25) {
            endGame();
            break;
        }
        console.log(listadonutspeed[a]);
        listadonut[a].position.x += listadonutspeed[a];
        if (listadonut[a].position.x > 5 || listadonut[a].position.x < -5){
            listadonutspeed[a] *= -1;
        }
        listadonut[a].position.y += listadonutspeedy[a];
        if (listadonut[a].position.y > 5 || listadonut[a].position.y < -5){
            listadonutspeedy[a] *= -1;
        }
    }
}

// fundo
const floorTexture = new THREE.TextureLoader().load( "./checkerboard.jpg" );
floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping; 
floorTexture.repeat.set( 10, 10 );
var floorMaterial = new THREE.MeshBasicMaterial( { map: floorTexture, side: THREE.DoubleSide } );
var floorGeometry = new THREE.PlaneGeometry(10, 10, 100, 100);
var floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.position.z = -0.5;
scene.add(floor);
// gameover fundo
const gameoverTexture = new THREE.TextureLoader().load( "./gameover.jpg" );
gameoverTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping; 
gameoverTexture.repeat.set( 1, 1 );
var gameoverMaterial = new THREE.MeshBasicMaterial( { map: gameoverTexture, side: THREE.DoubleSide } );
var gameoverGeometry = new THREE.PlaneGeometry(10, 10, 100, 100);
var gameoverfloor = new THREE.Mesh(gameoverGeometry, gameoverMaterial);
gameoverfloor.position.z = -0.6;
scene.add(gameoverfloor);

//player
const playerGeometry = new THREE.IcosahedronGeometry(0.06, 10);
const playerMaterial = new THREE.MeshPhysicalMaterial({});
playerMaterial.color = new THREE.Color(0xff8800);
playerMaterial.roughness = 0.4;
playerMaterial.metalness = 0.7;
playerMaterial.clearcoat = 0.5;
playerMaterial.clearcoatRoughness = 1;
playerMaterial.flatShading = true;
const playerMesh = new THREE.Mesh( playerGeometry, playerMaterial);
scene.add( playerMesh );

// renderer
const renderer = new THREE.WebGLRenderer( { antialias: false } );
renderer.setSize( window.innerWidth/3, window.innerHeight/3, false);
renderer.setAnimationLoop( animation );
document.body.appendChild( renderer.domElement );

// animation
var posPlayer = new THREE.Vector3(playerMesh.position.x, playerMesh.position.y, playerMesh.position.z);
function animation( time ) {
    requestAnimationFrame( animation );

    if (gameover) {
        return;
    }

    playerMesh.rotation.x = time / 20000;
    playerMesh.rotation.y = time / 20000;
    
    if (playerMesh.position.x > 5 || playerMesh.position.x < -5 || playerMesh.position.y > 5 || playerMesh.position.y < -5) {
        endGame();
    }

    camera.position.y = playerMesh.position.y;
    camera.position.x = playerMesh.position.x;

    delta += Clock.getDelta();
    if ( delta > interval ) {
        if (up == true) {
            playerMesh.position.y += speed;
        } else if (down == true) {
            playerMesh.position.y -= speed;
        }
        if (left == true) {
            playerMesh.position.x -= speed;
        } else if (right == true) {
            playerMesh.position.x += speed;
        }
        movecube();
        moveDonut();
        cont += 1;
        if (cont == 60) {
            addCube();
            cont = 0;
        }

        renderer.render( scene, camera );
        delta = delta % interval;
    }

}


function onKeyDown(event) {
    var keyCode = event.which;

    console.log('keyCode', keyCode);

    if (keyCode == 87) {
        up = true; // w
    } else if (keyCode == 83) {
        down = true; // s
    }
    if (keyCode == 65) {
        left = true; // a
    } else if (keyCode == 68) {
        right = true; // d
    }
    if (keyCode == 32 && gameover) {
        playerMesh.position.set(0, 0, 0); // spacebar
        removeAll();
        gameover = false;
        floor.position.z = -0.5;
        gameoverfloor.position.z = -0.6;
    }
    if (keyCode == 69 ) {
        addCube(); // e
    }
};
function onKeyUp(event) {
    var keyCode = event.which;

    if (keyCode == 87) {
        up = false;
    } else if (keyCode == 83) {
        down = false;
    }
    if (keyCode == 65) {
        left = false;
    } else if (keyCode == 68) {
        right = false;
    }
}
document.addEventListener("keydown", onKeyDown, false);
document.addEventListener("keyup", onKeyUp, false);



function endGame() {
    floor.position.z = -0.6;
    gameoverfloor.position.z = -0.5;
    gameover = true;
    console.log("gameover");
    renderer.render( scene, camera );
  }




