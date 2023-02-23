import * as THREE from './three.js-master/src/Three.js';

// var keyboard = new THREE.KeyboardState();

// init
var up, down, left, right;
var speed = 0.0001;
var cubespeed = 0.00005;
var gameover = false;
var Clock = new THREE.Clock();
Clock.start();

// camera
const camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );
var posCamera = new THREE.Vector3(0, 0, 4);
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
var j = 0;
const geometry = new THREE.BoxGeometry( 0.1, 0.1, 0.1 );
//const material = new THREE.MeshNormalMaterial();
//const mesh = new THREE.Mesh( geometry, material );
// var posCube = new THREE.Vector3(0.5, 0, 0);
// mesh.position.x = 0.5;
//scene.add( mesh );

function addCube() {
    var material = new THREE.MeshNormalMaterial();
    var cube = new THREE.Mesh( geometry, material );
    
    cube.position.x = (Math.random()*6)-3;
    cube.position.y = (Math.random()*6)-3;
    lista.push(cube);
    j += 1;
    scene.add( cube );
    //return mesh;
}

function movecube() {
    for ( var i = 0; i < j; i++ ) {
        lista[i].rotation.x += 0.00005;
        lista[i].rotation.y += 0.00005;
        

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

        if (distanciaY <= 0.06 && distanciaX <= 0.05) {
            endGame();
        }

       if (distanciaY != 0) {
           var ratio = Math.abs(distanciaX / distanciaY);
           var totaldiv = (distanciaX + distanciaY) / distanciaY;
           var unidadevelocidade = Math.abs(cubespeed / totaldiv);
       } else { var ratio = 1; var unidadevelocidade = cubespeed; }
        
       if (lista[i].position.x > playerMesh.position.x) {
           lista[i].position.x -= ratio*unidadevelocidade;
       } else if (lista[i].position.x < playerMesh.position.x) {
           lista[i].position.x += ratio*unidadevelocidade;
       }
       if (lista[i].position.y > playerMesh.position.y) {
           lista[i].position.y -= unidadevelocidade;
       } else if (lista[i].position.y < playerMesh.position.y) {
           lista[i].position.y += unidadevelocidade;
       }
        //console.log(ratio*unidadevelocidade);
        //console.log("distanciaX", distanciaX);
        //console.log("distanciaY", distanciaY);
        //console.log("ratio", ratio);
        //console.log("totaldiv", totaldiv);
        //console.log("unidadevelocidade", unidadevelocidade);
        //console.log("positionx", lista[i].position.x);
        //console.log("positiony", lista[i].position.y);
        //console.log("speed", Math.sqrt( (ratio*unidadevelocidade)**2 + unidadevelocidade**2 ));

        // lista[i].lookAt(playerMesh);
        // lista[i].translateY(cubespeed);
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
//floor.rotation.x = Math.PI / 2;
scene.add(floor);


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

//var cube = new addCube(geometry);
//scene.add( cube );

// animation
var posPlayer = new THREE.Vector3(playerMesh.position.x, playerMesh.position.y, playerMesh.position.z);
function animation( time ) {
    requestAnimationFrame( animation );
    if (gameover) {
        return;
    }

    //console.log(time);
    //console.log(Clock);

    


    playerMesh.rotation.x = time / 20000;
    playerMesh.rotation.y = time / 20000;

    if (up == true) {
        playerMesh.position.y += speed;
        //console.log("up");
    } else if (down == true) {
        playerMesh.position.y -= speed;
        //console.log("down");
    }
    if (left == true) {
        playerMesh.position.x -= speed;
        //console.log("left");
    } else if (right == true) {
        playerMesh.position.x += speed;
        //console.log("right");
    }
    
    //console.log(playerMesh.position.x, playerMesh.position.y);
    
    if (playerMesh.position.x > 5 || playerMesh.position.x < -5 || playerMesh.position.y > 5 || playerMesh.position.y < -5) {
        endGame();
    }

    camera.position.y = playerMesh.position.y;
    camera.position.x = playerMesh.position.x;

    movecube();

    // var distancia = posCube.distanceTo(posPlayer);
    // mesh.position.add(posCube);
    

	renderer.render( scene, camera );

}


function onKeyDown(event) {
    var keyCode = event.which;

    console.log('keyCode', keyCode);

    if (keyCode == 87) {
        up = true;
    } else if (keyCode == 83) {
        down = true;
    }
    if (keyCode == 65) {
        left = true;
    } else if (keyCode == 68) {
        right = true;
    }
    if (keyCode == 32) {
        playerMesh.position.set(0, 0, 0);
        j = 0;
    }
    if (keyCode == 69 ) {
        addCube();   
    }
};
function onKeyUp(event) {
    var keyCode = event.which;

    if (keyCode == 87) {
        up = false;
        console.log("Nup");
    } else if (keyCode == 83) {
        down = false;
        console.log("Ndown");
    }
    if (keyCode == 65) {
        left = false;
        console.log("Nleft");
    } else if (keyCode == 68) {
        right = false;
        console.log("Nright");
    }
}
document.addEventListener("keydown", onKeyDown, false);
document.addEventListener("keyup", onKeyUp, false);



function endGame() {
    const gameoverTexture = new THREE.TextureLoader().load( "./gameover.png" );
    var gameoverMaterial = new THREE.MeshBasicMaterial( { map: gameoverTexture, side: THREE.DoubleSide } );
    var gameoverfloor = new THREE.Mesh(floorGeometry, gameoverMaterial);
    gameoverfloor.position.z = -0.5;
    scene.add(gameoverfloor);
    gameover = true;
    console.log("gameover");
  }




