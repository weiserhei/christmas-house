import {
  WebGLRenderer,
  PCFShadowMap,
  SRGBColorSpace,
  PCFSoftShadowMap,
  ACESFilmicToneMapping,
} from "three";

// Main webGL renderer class
export default class Renderer {
  constructor(container) {
    // Properties
    this.container = container;

    // Create WebGL renderer and set its antialias
    this.threeRenderer = new WebGLRenderer({ antialias: true });

    this.threeRenderer.toneMapping = ACESFilmicToneMapping;
    // this.threeRenderer.toneMappingExposure = 0.5;

    // this.threeRenderer.outputEncoding = GammaEncoding; // r123
    // this.threeRenderer.outputEncoding = sRGBEncoding; // r152
    // this.threeRenderer.outputColorSpace = SRGBColorSpace; //r152+, its default now
    // this.threeRenderer.gammaInput = true;
    // Set clear color to fog to enable fog or to hex color for no fog
    // this.threeRenderer.setClearColor('#555'); // scene.fog.color
    // this.threeRenderer.setPixelRatio(window.devicePixelRatio); // For retina

    // Appends canvas
    container.appendChild(this.threeRenderer.domElement);
    // Shadow map options
    this.threeRenderer.shadowMap.enabled = true;
    this.threeRenderer.shadowMap.type = PCFShadowMap;
    // this.threeRenderer.shadowMap.type = PCFSoftShadowMap;

    // Initial size update set to canvas container
    this.updateSize();

    // Listeners
    // document.addEventListener(
    //   "DOMContentLoaded",
    //   () => this.updateSize(),
    //   false
    // );
    window.addEventListener("resize", () => this.updateSize(), false);
  }

  updateSize() {
    // this.threeRenderer.setSize(
    //   this.container.offsetWidth,
    //   this.container.offsetHeight
    // );
    this.threeRenderer.setSize(window.innerWidth, window.innerHeight);
  }

  render(scene, camera) {
    // Renders scene to canvas target
    this.threeRenderer.render(scene, camera);
  }
}
