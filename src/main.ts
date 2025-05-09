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

  // Setup animation map
  const animMap: Record<string, pc.Asset | undefined> = {
    idle: container.animations.find(a => a.name.toLowerCase().includes('merged.glb/animation/0')),
    walk: container.animations.find(a => a.name.toLowerCase().includes('merged.glb/animation/1')),
    yessiree: container.animations.find(a => a.name.toLowerCase().includes('merged.glb/animation/2')),
  };

  if (!animMap.idle || !animMap.walk || !animMap.yessiree) {
    console.warn('Missing expected animations:', animMap);
  } else {
    // Ensure correct loop settings
    animMap.idle.resource.loop = true;
    animMap.walk.resource.loop = true;
    animMap.yessiree.resource.loop = false;

    let currentAnim = 'idle';
    let walkPressed = false;
    let playingYessiree = false;

    const play = (name: string, blend = 0.2) => {
      if (currentAnim !== name && animMap[name]) {
        modelRoot.animation.play(animMap[name].name, blend);
        currentAnim = name;
      }
    };

    // Start with idle
    play('idle');

    window.addEventListener('keydown', (e) => {
      if (e.code === 'ArrowDown') {
        walkPressed = true;

        // Down arrow always takes precedence, even during yessiree
        if (playingYessiree) {
          playingYessiree = false; // cancel current flow
        }

        play('walk');
      }

      if (e.code === 'Space') {
        if (!playingYessiree) {
          playingYessiree = true;

          // Override animation loop for this special case
          modelRoot.animation.loop = false;
          play('yessiree', 0.2);

          // Use time-based manual trigger to detect end of animation
          const duration = animMap.yessiree.resource.duration;
          console.log('Yessiree duration (sec):', animMap.yessiree.resource.duration);
          setTimeout(() => {
            playingYessiree = false;

            // Restore default loop behavior
            modelRoot.animation.loop = true;

            if (walkPressed) {
              play('walk');
            } else {
              play('idle');
            }
          }, duration * 1000);
        }
      }
    });

    window.addEventListener('keyup', (e) => {
      if (e.code === 'ArrowDown') {
        walkPressed = false;
        if (!playingYessiree) {
          play('idle');
        }
      }
    });
  }

  // 🎥 re‐aim camera to focus on the character
  camera.setPosition(0, 2, 5);
  camera.lookAt(0, 1, 0);
});
