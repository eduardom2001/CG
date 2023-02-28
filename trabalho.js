import * as THREE from './three.js-master/src/Three.js';

// var keyboard = new THREE.KeyboardState();

// init
var up, down, left, right;
var speed = 0.02;
var cubespeed = 0.01;
var gameover = false;
var Clock = new THREE.Clock();
Clock.start();
var delta = 0;
var interval = 1 / 60;


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
var j = 0;
const geometry = new THREE.BoxGeometry( 0.1, 0.1, 0.1 );

function addCube() {
    var material = new THREE.MeshNormalMaterial();
    var cube = new THREE.Mesh( geometry, material );
    cube.position.x = (Math.random()*8)-4;
    cube.position.y = (Math.random()*6)-3;
    lista.push(cube);
    j += 1;
    scene.add( cube );
}

function movecube() {
    for ( var i = 0; i < j; i++ ) {
        lista[i].rotation.x += 0.05;
        lista[i].rotation.y += 0.05;
        

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
            return;
        }

        if (distanciaY != 0) {
           var ratio = Math.abs(distanciaX / distanciaY);
           var totaldiv = (distanciaX + distanciaY) / distanciaY;
           var unidadevelocidade = Math.abs(cubespeed / totaldiv);
        } else { var ratio = 1; var unidadevelocidade = cubespeed; }
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
        //console.log(ratio*unidadevelocidade);
        //console.log("distanciaX", distanciaX);
        //console.log("distanciaY", distanciaY);
        //console.log("ratio", ratio);
        //console.log("totaldiv", totaldiv);
        //console.log("unidadevelocidade", unidadevelocidade);
        //console.log("positionx", lista[i].position.x);
        //console.log("positiony", lista[i].position.y);
        //console.log("speed", Math.sqrt( (ratio*unidadevelocidade)**2 + unidadevelocidade**2 ));

        for (var k = 0; k < j; k++ ) {
            if (k == i) {
                continue;
            }
            var cubedistanciaY = lista[k].position.y - lista[i].position.y;
            var cubedistanciaX = lista[k].position.x - lista[i].position.x;
            // if (cubedistanciaX < 0.1 && cubedistanciaX > -0.1) {
            //     if (cubedistanciaX > 0) {
            //         lista[i].position.x += 0.1;
            //     } else {
            //         lista[i].position.x -= 0.1;
            //     }
            // }
            // if (cubedistanciaY < 0.1 && cubedistanciaY > -0.1) {
            //     if (cubedistanciaX > 0) {
            //         lista[i].position.y += unidadevelocidade;
            //     } else {
            //         lista[i].position.y -= unidadevelocidade;
            //     }
            // }

            // var ray = new THREE.Raycaster( lista[i].position, lista[k].position, 0, 2 );
            // var collisionResults = ray.intersectObjects( lista[k] );
            // console.log(collisionResults.distance);
        }

        if (lista[i].position.y > 4) {
            scene.remove(lista[i]);
            lista.splice(i, 1);
            i -= 1;
            j -= 1;
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
//gameoverMaterial.color = 0xff0000;
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

    
    
    //console.log(playerMesh.position.x, playerMesh.position.y);
    
    if (playerMesh.position.x > 5 || playerMesh.position.x < -5 || playerMesh.position.y > 5 || playerMesh.position.y < -5) {
        endGame();
    }

    camera.position.y = playerMesh.position.y;
    camera.position.x = playerMesh.position.x;


    // var distancia = posCube.distanceTo(posPlayer);
    // mesh.position.add(posCube);
    

    delta += Clock.getDelta();
    if ( delta > interval ) {

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
        movecube();

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
    floor.position.z = -0.6;
    gameoverfloor.position.z = -0.5;
    gameover = true;
    console.log("gameover");
    renderer.render( scene, camera );
  }




