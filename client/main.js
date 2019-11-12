import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';
import * as THREE from 'three'
import GLTFLoader from 'three-gltf-loader';
import OrbitControls from 'three-orbitcontrols'

Template.hello.onCreated(function helloOnCreated() {
  // co`unter starts at 0
  this.counter = new ReactiveVar(0);
  var camera, scene, renderer, controls, sphere, planeLeather, planeBricks, planeFloor;
  var geometrySphere, geometryPlane, materialLeather, materialBricks, materialFloor, mesh, spotLight, directionalLight, ambientLight;
  var albedo, ao, height, normal, roughness;

  init();
  animate();

  function init() {

    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 400);
    camera.position.z = 22;


    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x999999);

    geometry = new THREE.BoxGeometry(20, 20, 2, 32, 32, 32);
    geometrySphere = new THREE.SphereGeometry(10, 64, 64);
    geometryPlane = new THREE.PlaneBufferGeometry(40, 40, 256, 256);

    albedo = new THREE.TextureLoader().load('albedo.png');
    ao = new THREE.TextureLoader().load('ao.png');
    height = new THREE.TextureLoader().load('height.png');
    normal = new THREE.TextureLoader().load('normal.png');
    roughness = new THREE.TextureLoader().load('roughness.png');

    materialLeather = new THREE.MeshStandardMaterial({
      map: albedo,
      normalMap: normal,
      aoMap: ao,
      roughnessMap: roughness,
      displacementMap: height,
      displacementScale: 2,
      // wireframe: true
    })

    // albedo = new THREE.TextureLoader().load('medieval-floor/albedo.png');
    // ao = new THREE.TextureLoader().load('medieval-floor/ao.png');
    // height = new THREE.TextureLoader().load('medieval-floor/height.png');
    // normal = new THREE.TextureLoader().load('medieval-floor/normal.png');
    // roughness = new THREE.TextureLoader().load('medieval-floor/roughness.png');
    albedo = new THREE.TextureLoader().load('4k/TexturesCom_Pavement_Medieval_4K_albedo.png');
    ao = new THREE.TextureLoader().load('4k/TexturesCom_Pavement_Medieval_4K_ao.png');
    height = new THREE.TextureLoader().load('4k/TexturesCom_Pavement_Medieval_4K_height.png');
    normal = new THREE.TextureLoader().load('4k/TexturesCom_Pavement_Medieval_4K_normal.png');
    roughness = new THREE.TextureLoader().load('4k/TexturesCom_Pavement_Medieval_4K_roughness.png');

    materialFloor = new THREE.MeshStandardMaterial({
      map: albedo,
      normalMap: normal,
      aoMap: ao,
      roughnessMap: roughness,
      displacementMap: height,
      displacementScale: 1,
      displacementBias: 0.5,
      // wireframe: true
    })


    albedo = new THREE.TextureLoader().load('height-test/TexturesCom_Pavement_HerringboneNew_1K_albedo_tif.png');

    height = new THREE.TextureLoader().load('height-test/TexturesCom_Pavement_HerringboneNew_1K_height.png');
    normal = new THREE.TextureLoader().load('height-test/TexturesCom_Pavement_HerringboneNew_1K_normal_tif.png');
    roughness = new THREE.TextureLoader().load('height-test/TexturesCom_Pavement_HerringboneNew_1K_roughness_tif.png');


    materialBricks = new THREE.MeshStandardMaterial({
      map: albedo,
      normalMap: normal,
      roughnessMap: roughness,
      displacementMap: height,
      displacementScale: 1,
      displacementBias: 0.2,
      // wireframe: true
    })

    spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(-20, 120, 120);
    spotLight.intensity = 0.5;
    // spotLight.castShadow = true;
    // spotLight.shadowCameraVisible = true;

    scene.add(spotLight);

    ambientLight = new THREE.AmbientLight(0x404040); // soft white light
    scene.add(ambientLight);

    directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(0, 0, 1);
    directionalLight.intensity = 0.5;
    // directionalLight.castShadow = true;
    // spotLight.shadowCameraVisible = true;
    scene.add(directionalLight);

    // sphere = new THREE.Mesh(geometrySphere, material);
    // scene.add(sphere);

    // plane = new THREE.Mesh(geometryPlane, materialLeather);
    plane = new THREE.Mesh(geometryPlane, materialBricks);
    // plane = new THREE.Mesh(geometryPlane, materialFloor);
    plane.castShadow = true;
    plane.receiveShadow = true;
    scene.add(plane);

    // mesh = new THREE.Mesh(geometry, material);
    // scene.add(mesh);

    const loader = new GLTFLoader();
    loader.load(
      'height-test/height-test.gltf',
      (gltf) => {
        const mesh = gltf.scene.children[0]
        mesh.geometry.scale(2, 2, 2);
        // mesh.geometry.rotateX(Math.PI / 2);
        console.log(mesh.material)
        mesh.material.displacementScale = 2;
        // mesh.material.wireframe = true;
        mesh.material.displacementMap = new THREE.TextureLoader().load('height-test/TexturesCom_Pavement_HerringboneNew_1K_height.png');
        // called when the resource is loaded
        // scene.add(mesh);
      },
      (xhr) => {
        // called while loading is progressing
        console.log(`${(xhr.loaded / xhr.total * 100)}% loaded`);
      },
      (error) => {
        // called when loading has errors
        console.error('An error happened', error);
      },
    );
    // var loader = new GLTFLoader();
    // loader.load(
    //   'height-test/height-test.gltf',
    //   (gltf) => {
    //     scene.add(gltf.scene);
    //   },
    //   (error) => {
    //     console.log(error);
    //   }
    // );



    renderer = new THREE.WebGLRenderer({
      antialias: true
    });
    renderer.shadowMap.enabled = true;

    renderer.setSize(window.innerWidth, window.innerHeight);

    controls = new OrbitControls(camera, renderer.domElement);
    controls.update();

    document.body.appendChild(renderer.domElement);

  }

  function animate() {

    requestAnimationFrame(animate);

    // mesh.rotation.x += 0.001;
    // mesh.rotation.y += 0.002;

    renderer.render(scene, camera);

  }
});

Template.hello.helpers({
  counter() {
    return Template.instance().counter.get();
  },
});

Template.hello.events({
  'click button'(event, instance) {
    // increment the counter when button is clicked
    instance.counter.set(instance.counter.get() + 1);
  },
});
