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
app.assets.loadFromUrl('/assets/merged.glb', 'container', (err, asset) => {
  if (err) {
    console.error('Failed to load model:', err);
    return;
  }

  const container = asset.resource as pc.ContainerResource;
  const modelRoot = container.instantiateModelEntity();

  console.log('🧩 Model root:', modelRoot);
  console.log('🎞️ Animation assets:', container.animations);
  console.log('🎬 Available animations:', container.animations.map(a => a.name));

  // position & scale
  modelRoot.setLocalPosition(0, 0, 0);
  modelRoot.setLocalScale(1, 1, 1);
  app.root.addChild(modelRoot);

  // 🎬 Add animation component
  modelRoot.addComponent('animation', {
    assets: container.animations,
    activate: true,
  });

  // Store animation names
  const idleClip = container.animations.find(a => a.name === 'merged.glb/animation/0');
  const walkClip = container.animations.find(a => a.name === 'merged.glb/animation/1');

  if (!idleClip) {
    console.warn('Idle animation not found!');
  } else if (!walkClip) {
    console.warn('Walking animation not found!');
  } else {
    // Start in idle state
    modelRoot.animation.play(idleClip.name, 0.2);

    let isWalking = false;

    // 🏃 Toggle on spacebar
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space') {
        isWalking = !isWalking;
        const nextAnim = isWalking ? walkClip.name : idleClip.name;
        modelRoot.animation.play(nextAnim, 0.2);
      }
    });
  }

  // 🎥 re‐aim camera to focus on the character
  camera.setPosition(0, 2, 5);
  camera.lookAt(0, 1, 0);
});
