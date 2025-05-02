import * as pc from 'playcanvas';

// get canvas
const canvas = document.getElementById('application') as HTMLCanvasElement;

// create application
const app = new pc.Application(canvas, {
  mouse: new pc.Mouse(canvas),
  touch: new pc.TouchDevice(canvas),
  elementInput: new pc.ElementInput(canvas)
});

function resizeCanvas() {
  const dpr = window.devicePixelRatio || 1;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  app.graphicsDevice.setResolution(canvas.width, canvas.height);
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// set up basic scene
const root = new pc.Entity();

// camera
const camera = new pc.Entity();
camera.addComponent('camera', { clearColor: new pc.Color(0.2, 0.2, 0.2) });
camera.setPosition(0, 1.5, 3);
root.addChild(camera);

// light
const light = new pc.Entity();
light.addComponent('light', { type: 'directional', intensity: 1 });
light.setEulerAngles(45, 30, 0);
root.addChild(light);

// add root to app
app.root.addChild(root);

// start the app
app.start();

// Load and instantiate model
app.assets.loadFromUrl('/assets/yessiree.glb', 'container', (err, asset) => {
  if (err) {
    console.error('Failed to load model:', err);
    return;
  }

  const container = asset.resource as pc.ContainerResource;
  const modelRoot = container.instantiateModelEntity();

    // position & scale
  modelRoot.setLocalPosition(0, 0, 0);
  modelRoot.setLocalScale(1, 1, 1);
  app.root.addChild(modelRoot);

  // 🎬 Add animation component
  modelRoot.addComponent('animation', {
    assets: container.animations,
    activate: true,
  });

  // 🏃 Play the first available animation
  if (container.animations.length > 0) {
    modelRoot.animation.play(container.animations[0].name, 0);
  } else {
    console.warn('No animations found in container!');
  }

  // 🎥 re‐aim camera to focus on the character
  camera.setPosition(0, 2, 5);
  camera.lookAt(0, 1, 0);
});
