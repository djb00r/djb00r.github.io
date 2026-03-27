import * as THREE from "three";
import { config } from "./config.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";

// Create the scene and set its background color from config.
const scene = new THREE.Scene();
scene.background = new THREE.Color(config.backgroundColor);

// Set up the camera.
const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 2, 8);

// Create the renderer and attach it to the DOM.
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("container").appendChild(renderer.domElement);

// Add ambient and directional lighting.
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 10, 7.5);
scene.add(directionalLight);

// Function to create a turkey sandwich as a 3D group.
function createSandwich() {
  const sandwich = new THREE.Group();

  // Create materials based on config values.
  const breadMat = new THREE.MeshPhongMaterial({
    color: config.sandwich.bread.color,
    shininess: config.sandwich.bread.shininess,
  });
  const turkeyMat = new THREE.MeshPhongMaterial({
    color: config.sandwich.turkey.color,
    shininess: config.sandwich.turkey.shininess,
  });
  const lettuceMat = new THREE.MeshPhongMaterial({
    color: config.sandwich.lettuce.color,
    shininess: config.sandwich.lettuce.shininess,
  });
  const tomatoMat = new THREE.MeshPhongMaterial({
    color: config.sandwich.tomato.color,
    shininess: config.sandwich.tomato.shininess,
  });

  // Dimensions for sandwich parts.
  const breadWidth = 4,
    breadDepth = 3,
    breadHeight = 0.3;
  const fillingWidth = 3.6,
    fillingDepth = 2.7,
    fillingHeight = 0.2;

  // Bottom Bread.
  const bottomBreadGeo = new THREE.BoxGeometry(breadWidth, breadHeight, breadDepth);
  const bottomBread = new THREE.Mesh(bottomBreadGeo, breadMat);
  bottomBread.position.y = breadHeight / 2; // 0.15
  sandwich.add(bottomBread);

  // Turkey Layer.
  const turkeyGeo = new THREE.BoxGeometry(fillingWidth, fillingHeight, fillingDepth);
  const turkey = new THREE.Mesh(turkeyGeo, turkeyMat);
  turkey.position.y = breadHeight + fillingHeight / 2; // 0.3 + 0.1 = 0.4
  sandwich.add(turkey);

  // Lettuce Layer.
  const lettuceGeo = new THREE.BoxGeometry(fillingWidth, fillingHeight, fillingDepth);
  const lettuce = new THREE.Mesh(lettuceGeo, lettuceMat);
  lettuce.position.y = breadHeight + fillingHeight + fillingHeight / 2; // 0.3+0.2+0.1 = 0.6
  sandwich.add(lettuce);

  // Tomato Layer.
  const tomatoGeo = new THREE.BoxGeometry(fillingWidth, fillingHeight, fillingDepth);
  const tomato = new THREE.Mesh(tomatoGeo, tomatoMat);
  tomato.position.y = breadHeight + 2 * fillingHeight + fillingHeight / 2; // 0.3+0.4+0.1 = 0.8
  sandwich.add(tomato);

  // Top Bread.
  const topBreadGeo = new THREE.BoxGeometry(breadWidth, breadHeight, breadDepth);
  const topBread = new THREE.Mesh(topBreadGeo, breadMat);
  topBread.position.y = breadHeight + 3 * fillingHeight + breadHeight / 2; // 0.3+0.6+0.15 = 1.05
  sandwich.add(topBread);

  return sandwich;
}

// Create two spinning sandwiches and position them.
const sandwich1 = createSandwich();
sandwich1.position.x = -3;
scene.add(sandwich1);

const sandwich2 = createSandwich();
sandwich2.position.x = 3;
scene.add(sandwich2);

// NEW: Create a third spinning turkey sandwich.
const sandwich3 = createSandwich();
sandwich3.position.x = 0;
scene.add(sandwich3);

// Add global variables for text interaction
let textGroup;
let clickableSuffix;
let loadedFont;
let textUpdated = false;

const loader = new FontLoader();
loader.load(
  "https://unpkg.com/three@0.150.0/examples/fonts/helvetiker_regular.typeface.json",
  (font) => {
    loadedFont = font;
    const textParams = {
      font: font,
      size: 0.7,
      height: 0.2,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.05,
      bevelOffset: 0,
      bevelSegments: 3,
    };
    const textMaterial = new THREE.MeshPhongMaterial({ color: config.text.color });

    // Split the message "turkey sandwich 2." into prefix and suffix parts.
    const message = config.text.message; // "turkey sandwich 2."
    const prefixText = message.slice(0, -2); // "turkey sandwich "
    const suffixText = message.slice(-2);    // "2."

    // Create separate geometries for the prefix and the clickable suffix.
    const prefixGeo = new TextGeometry(prefixText, textParams);
    const suffixGeo = new TextGeometry(suffixText, textParams);
    prefixGeo.computeBoundingBox();
    suffixGeo.computeBoundingBox();
    const prefixWidth = prefixGeo.boundingBox.max.x - prefixGeo.boundingBox.min.x;
    const suffixWidth = suffixGeo.boundingBox.max.x - suffixGeo.boundingBox.min.x;
    const totalWidth = prefixWidth + suffixWidth;

    const prefixMesh = new THREE.Mesh(prefixGeo, textMaterial);
    const suffixMesh = new THREE.Mesh(suffixGeo, textMaterial);
    // Position so that the combined group is centered at x = 0.
    prefixMesh.position.x = -totalWidth / 2;
    suffixMesh.position.x = -totalWidth / 2 + prefixWidth;

    textGroup = new THREE.Group();
    textGroup.add(prefixMesh);
    textGroup.add(suffixMesh);
    textGroup.position.y = 3;
    scene.add(textGroup);

    // Mark the suffix mesh (displaying "2.") as clickable.
    clickableSuffix = suffixMesh;
  }
);

// Animation loop to spin the sandwiches (the 3D text remains static).
function animate() {
  requestAnimationFrame(animate);
  sandwich1.rotation.y += 0.01;
  sandwich2.rotation.y += 0.01;
  sandwich3.rotation.y += 0.01;
  renderer.render(scene, camera);
}
animate();

// Handle window resizing.
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Add click event listener to update the 3D text when the clickable suffix ("2.") is clicked.
function onDocumentMouseDown(event) {
  const mouse = new THREE.Vector2();
  const raycaster = new THREE.Raycaster();
  const rect = renderer.domElement.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);

  if (!clickableSuffix || textUpdated) return;
  const intersects = raycaster.intersectObject(clickableSuffix, true);
  if (intersects.length > 0) {
    textUpdated = true;
    scene.remove(textGroup);
    const textParams = {
      font: loadedFont,
      size: 0.7,
      height: 0.2,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.05,
      bevelOffset: 0,
      bevelSegments: 3,
    };
    const textMaterial = new THREE.MeshPhongMaterial({ color: config.text.color });
    const newTextGeo = new TextGeometry("all hail...", textParams);
    newTextGeo.computeBoundingBox();
    newTextGeo.center();
    const newTextMesh = new THREE.Mesh(newTextGeo, textMaterial);
    newTextMesh.position.set(0, 3, 0);
    scene.add(newTextMesh);
  }
}

renderer.domElement.addEventListener("click", onDocumentMouseDown, false);