import * as pc from 'playcanvas';

// get canvas
const canvas = document.getElementById('application') as HTMLCanvasElement;

// create application
const app = new pc.Application(canvas, {
  mouse: new pc.Mouse(canvas),
  touch: new pc.TouchDevice(canvas),
  elementInput: new pc.ElementInput(canvas)
});

// fill the canvas on resize
window.addEventListener('resize', () => app.resizeCanvas());
app.resizeCanvas();

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

// load Mixamo glTF model
app.assets
  .loadFromUrl('assets/mixamo_model.glb', 'container')
  .then((asset: pc.Asset) => {
    const modelRoot = (asset.resource as pc.ContainerResource).instantiateModelEntity();
    modelRoot.setLocalScale(1, 1, 1);
    app.root.addChild(modelRoot);
  })
  .catch(err => console.error('Failed to load model:', err));
