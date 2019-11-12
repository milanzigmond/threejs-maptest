import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';
import * as THREE from 'three'
import GLTFLoader from 'three-gltf-loader';
import OrbitControls from 'three-orbitcontrols'

Template.hello.onCreated(function helloOnCreated() {
  // co`unter starts at 0
  this.counter = new ReactiveVar(0);
  var camera, scene, renderer, controls, sphere, plane;
  var geometrySphere, geometryPlane, material, mesh, spotLight, directionalLight, ambientLight;
  var albedo, ao, height, normal, roughness;

  init();
  animate();

  function init() {

    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 400);
    camera.position.z = 22;


    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x999999);

    // geometry = new THREE.BoxGeometry(20, 20, 2, 32, 32, 32);
    // geometrySphere = new THREE.SphereGeometry(10, 64, 64);
    geometryPlane = new THREE.PlaneBufferGeometry(40, 40, 32, 32);
    // console.log("TCL: init -> geometryPlane", geometryPlane)

    albedo = new THREE.TextureLoader().load('albedo.png');
    ao = new THREE.TextureLoader().load('ao.png');
    height = new THREE.TextureLoader().load('height.png');
    normal = new THREE.TextureLoader().load('normal.png');
    roughness = new THREE.TextureLoader().load('roughness.png');

    material = new THREE.MeshStandardMaterial({
      map: albedo,
      normalMap: normal,
      aoMap: ao,
      roughnessMap: roughness,
      displacementMap: height,
      displacementScale: 3,
    })

    spotLight = new THREE.SpotLight(0xffffff);
    spotLight.position.set(20, 20, 20);
    spotLight.intensity = 1;
    scene.add(spotLight);

    ambientLight = new THREE.AmbientLight(0x404040); // soft white light
    scene.add(ambientLight);

    directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(0, 0, 20);
    directionalLight.intensity = 2;
    scene.add(directionalLight);

    // sphere = new THREE.Mesh(geometrySphere, material);
    // scene.add(sphere);

    plane = new THREE.Mesh(geometryPlane, material);
    scene.add(plane);

    // mesh = new THREE.Mesh(geometry, material);
    // scene.add(mesh);

    const loader = new GLTFLoader();
    loader.load(
      'height-test/height-test.gltf',
      (gltf) => {
        console.log("TCL: init -> gltf", gltf.scene.children[0])
        const mesh = gltf.scene.children[0]
        // called when the resource is loaded
        scene.add(mesh);
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



    renderer = new THREE.WebGLRenderer({ antialias: true });
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
