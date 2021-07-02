<template>
  <div class="home-model tcenter content-model">
    <div class="relative w-screen h-screen">
      <div class="ray-marching w-full h-full bg-black"></div>
    </div>
    <my-footer :active="0"></my-footer>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import * as THREE from "https://cdn.skypack.dev/three@0.124.0";
import ky from "https://cdn.skypack.dev/kyouka@1.2.2";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.124.0/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.124.0/examples/jsm/loaders/GLTFLoader";
import { FBXLoader } from "https://cdn.skypack.dev/three@0.124.0/examples/jsm/loaders/FBXLoader";
import { EffectComposer } from "https://cdn.skypack.dev/three@0.124.0/examples/jsm/postprocessing/EffectComposer";
import Stats from "https://cdn.skypack.dev/three@0.124.0/examples/jsm/libs/stats.module";
import * as dat from "https://cdn.skypack.dev/dat.gui@0.7.7";

@Component({
  name: "Home",
})
export default class Home extends Vue {
  private signToShow: Boolean = false; //
  private num: number = 0;
  private active: number = 0;
  private activeTab: number = 0;

  created() {}

  mounted() {
    console.info("222222");
    this.getInitData();
  }

  getInitData() {
    const calcAspect = (el: HTMLElement) => el.clientWidth / el.clientHeight;

    const getNormalizedMousePos = (e: MouseEvent | Touch) => {
      return {
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      };
    };

    const matcapTextureUrl = "https://i.loli.net/2021/02/27/7zhBySIYxEqUFW3.png";

    const rayMarchingVertexShader = `
varying vec2 vUv;
 
void main(){
    vec4 modelPosition=modelMatrix*vec4(position,1.);
    vec4 viewPosition=viewMatrix*modelPosition;
    vec4 projectedPosition=projectionMatrix*viewPosition;
    gl_Position=projectedPosition;
     
    vUv=uv;
}
`;

    const rayMarchingFragmentShader = `
uniform float uTime;
uniform vec2 uMouse;
uniform vec2 uResolution;
uniform float uVelocityBox;
uniform float uProgress;
uniform float uAngle;
uniform float uDistance;
uniform float uVelocitySphere;
uniform sampler2D uTexture;
 
varying vec2 vUv;
 
const float EPSILON=.0001;
const float PI=3.14159265359;
 
// https://gist.github.com/yiwenl/3f804e80d0930e34a0b33359259b556c
mat4 rotationMatrix(vec3 axis,float angle){
    axis=normalize(axis);
    float s=sin(angle);
    float c=cos(angle);
    float oc=1.-c;
     
    return mat4(oc*axis.x*axis.x+c,oc*axis.x*axis.y-axis.z*s,oc*axis.z*axis.x+axis.y*s,0.,
        oc*axis.x*axis.y+axis.z*s,oc*axis.y*axis.y+c,oc*axis.y*axis.z-axis.x*s,0.,
        oc*axis.z*axis.x-axis.y*s,oc*axis.y*axis.z+axis.x*s,oc*axis.z*axis.z+c,0.,
    0.,0.,0.,1.);
}
 
vec3 rotate(vec3 v,vec3 axis,float angle){
    mat4 m=rotationMatrix(axis,angle);
    return(m*vec4(v,1.)).xyz;
}
 
vec3 background(vec2 uv){
    float dist=length(uv-vec2(.5));
    vec3 bg=mix(vec3(.3),vec3(.0),dist);
    return bg;
}
 
// https://www.iquilezles.org/www/articles/distfunctions/distfunctions.htm
float sdSphere(vec3 p,float r)
{
    return length(p)-r;
}
 
float sdBox(vec3 p,vec3 b)
{
    vec3 q=abs(p)-b;
    return length(max(q,0.))+min(max(q.x,max(q.y,q.z)),0.);
}
 
// https://www.iquilezles.org/www/articles/smin/smin.htm
float smin(float a,float b,float k)
{
    float h=clamp(.5+.5*(b-a)/k,0.,1.);
    return mix(b,a,h)-k*h*(1.-h);
}
 
float movingSphere(vec3 p,float shape){
    float rad=uAngle*PI;
    vec3 pos=vec3(cos(rad),sin(rad),0.)*uDistance;
    vec3 displacement=pos*fract(uTime*uVelocitySphere);
    float gotoCenter=sdSphere(p-displacement,.1);
    return smin(shape,gotoCenter,.3);
}
 
float sdf(vec3 p){
    vec3 p1=rotate(p,vec3(1.),uTime*uVelocityBox);
    float box=sdBox(p1,vec3(.3));
    float sphere=sdSphere(p,.3);
    float sBox=smin(box,sphere,.3);
    float mixedBox=mix(sBox,box,uProgress);
    mixedBox=movingSphere(p,mixedBox);
    float aspect=uResolution.x/uResolution.y;
    vec2 mousePos=uMouse;
    mousePos.x*=aspect;
    float mouseSphere=sdSphere(p-vec3(mousePos,0.),.15);
    return smin(mixedBox,mouseSphere,.1);
}
 
// http://jamie-wong.com/2016/07/15/ray-marching-signed-distance-functions/
// https://gist.github.com/sephirot47/f942b8c252eb7d1b7311
float rayMarch(vec3 eye,vec3 ray,float end,int maxIter){
    float depth=0.;
    for(int i=0;i<maxIter;i++){
        vec3 pos=eye+depth*ray;
        float dist=sdf(pos);
        depth+=dist;
        if(dist<EPSILON||dist>=end){
            break;
        }
    }
    return depth;
}
 
vec2 centerUv(vec2 uv){
    uv=2.*uv-1.;
    float aspect=uResolution.x/uResolution.y;
    uv.x*=aspect;
    return uv;
}
 
// https://www.iquilezles.org/www/articles/normalsSDF/normalsSDF.htm
vec3 calcNormal(in vec3 p)
{
    const float eps=.0001;
    const vec2 h=vec2(eps,0);
    return normalize(vec3(sdf(p+h.xyy)-sdf(p-h.xyy),
    sdf(p+h.yxy)-sdf(p-h.yxy),
    sdf(p+h.yyx)-sdf(p-h.yyx)));
}
 
// https://github.com/hughsk/matcap/blob/master/matcap.glsl
vec2 matcap(vec3 eye,vec3 normal){
    vec3 reflected=reflect(eye,normal);
    float m=2.8284271247461903*sqrt(reflected.z+1.);
    return reflected.xy/m+.5;
}
 
// https://www.shadertoy.com/view/4scSW4
float fresnel(float bias,float scale,float power,vec3 I,vec3 N)
{
    return bias+scale*pow(1.+dot(I,N),power);
}
 
void main(){
    vec2 cUv=centerUv(vUv);
    vec3 eye=vec3(0.,0.,2.5);
    vec3 ray=normalize(vec3(cUv,-eye.z));
    vec3 bg=background(vUv);
    vec3 color=bg;
    float end=5.;
    int maxIter=256;
    float depth=rayMarch(eye,ray,end,maxIter);
    if(depth<end){
        vec3 pos=eye+depth*ray;
        vec3 normal=calcNormal(pos);
        vec2 matcapUv=matcap(ray,normal);
        color=texture2D(uTexture,matcapUv).rgb;
        float F=fresnel(0.,.4,3.2,ray,normal);
        color=mix(color,bg,F);
    }
    gl_FragColor=vec4(color,1.);
}
`;

    class Base {
      debug: boolean;
      container: HTMLElement | null;
      scene!: THREE.Scene;
      camera!: THREE.PerspectiveCamera | THREE.OrthographicCamera;
      rendererParams!: Record<string, any>;
      perspectiveCameraParams!: Record<string, any>;
      orthographicCameraParams!: Record<string, any>;
      cameraPosition!: THREE.Vector3;
      lookAtPosition!: THREE.Vector3;
      renderer!: THREE.WebGLRenderer;
      controls!: OrbitControls;
      mousePos!: THREE.Vector2;
      raycaster!: THREE.Raycaster;
      sound!: THREE.Audio;
      stats!: Stats;
      composer!: EffectComposer;
      shaderMaterial!: THREE.ShaderMaterial;
      mouseSpeed!: number;
      constructor(sel: string, debug = false) {
        this.debug = debug;
        this.container = document.querySelector(sel);
        this.perspectiveCameraParams = {
          fov: 75,
          near: 0.1,
          far: 100,
        };
        this.orthographicCameraParams = {
          zoom: 2,
          near: -100,
          far: 1000,
        };
        this.cameraPosition = new THREE.Vector3(0, 3, 10);
        this.lookAtPosition = new THREE.Vector3(0, 0, 0);
        this.rendererParams = {
          outputEncoding: THREE.LinearEncoding,
          config: {
            alpha: true,
            antialias: true,
          },
        };
        this.mousePos = new THREE.Vector2(0, 0);
        this.mouseSpeed = 0;
      }
      // 初始化
      init() {
        this.createScene();
        this.createPerspectiveCamera();
        this.createRenderer();
        this.createMesh({});
        this.createLight();
        this.createOrbitControls();
        this.addListeners();
        this.setLoop();
      }
      // 创建场景
      createScene() {
        const scene = new THREE.Scene();
        if (this.debug) {
          scene.add(new THREE.AxesHelper());
          const stats = Stats();
          this.container!.appendChild(stats.dom);
          this.stats = stats;
        }
        this.scene = scene;
      }
      // 创建透视相机
      createPerspectiveCamera() {
        const { perspectiveCameraParams, cameraPosition, lookAtPosition } = this;
        const { fov, near, far } = perspectiveCameraParams;
        const aspect = calcAspect(this.container!);
        const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        camera.position.copy(cameraPosition);
        camera.lookAt(lookAtPosition);
        this.camera = camera;
      }
      // 创建正交相机
      createOrthographicCamera() {
        const { orthographicCameraParams, cameraPosition, lookAtPosition } = this;
        const { left, right, top, bottom, near, far } = orthographicCameraParams;
        const camera = new THREE.OrthographicCamera(left, right, top, bottom, near, far);
        camera.position.copy(cameraPosition);
        camera.lookAt(lookAtPosition);
        this.camera = camera;
      }
      // 更新正交相机参数
      updateOrthographicCameraParams() {
        const { container } = this;
        const { zoom, near, far } = this.orthographicCameraParams;
        const aspect = calcAspect(container!);
        this.orthographicCameraParams = {
          left: -zoom * aspect,
          right: zoom * aspect,
          top: zoom,
          bottom: -zoom,
          near,
          far,
          zoom,
        };
      }
      // 创建渲染
      createRenderer(useWebGL1 = false) {
        const { rendererParams } = this;
        const { outputEncoding, config } = rendererParams;
        const renderer = !useWebGL1
          ? new THREE.WebGLRenderer(config)
          : new THREE.WebGL1Renderer(config);
        renderer.setSize(this.container!.clientWidth, this.container!.clientHeight);
        renderer.outputEncoding = outputEncoding;
        this.resizeRendererToDisplaySize();
        this.container?.appendChild(renderer.domElement);
        this.renderer = renderer;
        this.renderer.setClearColor(0x000000, 0);
      }
      // 允许投影
      enableShadow() {
        this.renderer.shadowMap.enabled = true;
      }
      // 调整渲染器尺寸
      resizeRendererToDisplaySize() {
        const { renderer } = this;
        if (!renderer) {
          return;
        }
        const canvas = renderer.domElement;
        const pixelRatio = window.devicePixelRatio;
        const { clientWidth, clientHeight } = canvas;
        const width = (clientWidth * pixelRatio) | 0;
        const height = (clientHeight * pixelRatio) | 0;
        const isResizeNeeded = canvas.width !== width || canvas.height !== height;
        if (isResizeNeeded) {
          renderer.setSize(width, height, false);
        }
        return isResizeNeeded;
      }
      // 创建网格
      createMesh(meshObject: MeshObject, container: THREE.Scene | THREE.Mesh = this.scene) {
        const {
          geometry = new THREE.BoxGeometry(1, 1, 1),
          material = new THREE.MeshStandardMaterial({
            color: new THREE.Color("#d9dfc8"),
          }),
          position = new THREE.Vector3(0, 0, 0),
        } = meshObject;
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.copy(position);
        container.add(mesh);
        return mesh;
      }
      // 创建光源
      createLight() {
        const dirLight = new THREE.DirectionalLight(new THREE.Color("#ffffff"), 0.5);
        dirLight.position.set(0, 50, 0);
        this.scene.add(dirLight);
        const ambiLight = new THREE.AmbientLight(new THREE.Color("#ffffff"), 0.4);
        this.scene.add(ambiLight);
      }
      // 创建轨道控制
      createOrbitControls() {
        const controls = new OrbitControls(this.camera, this.renderer.domElement);
        const { lookAtPosition } = this;
        controls.target.copy(lookAtPosition);
        controls.update();
        this.controls = controls;
      }
      // 监听事件
      addListeners() {
        this.onResize();
      }
      // 监听画面缩放
      onResize() {
        window.addEventListener("resize", (e) => {
          if (this.shaderMaterial) {
            this.shaderMaterial.uniforms.uResolution.value.x = window.innerWidth;
            this.shaderMaterial.uniforms.uResolution.value.y = window.innerHeight;
            this.renderer.setSize(window.innerWidth, window.innerHeight);
          } else {
            if (this.camera instanceof THREE.PerspectiveCamera) {
              const aspect = calcAspect(this.container!);
              const camera = this.camera as THREE.PerspectiveCamera;
              camera.aspect = aspect;
              camera.updateProjectionMatrix();
            } else if (this.camera instanceof THREE.OrthographicCamera) {
              this.updateOrthographicCameraParams();
              const camera = this.camera as THREE.OrthographicCamera;
              const { left, right, top, bottom, near, far } = this.orthographicCameraParams;
              camera.left = left;
              camera.right = right;
              camera.top = top;
              camera.bottom = bottom;
              camera.near = near;
              camera.far = far;
              camera.updateProjectionMatrix();
            }
            this.renderer.setSize(this.container!.clientWidth, this.container!.clientHeight);
          }
        });
      }
      // 动画
      update() {
        console.log("animation");
      }
      // 渲染
      setLoop() {
        this.renderer.setAnimationLoop(() => {
          this.resizeRendererToDisplaySize();
          this.update();
          if (this.controls) {
            this.controls.update();
          }
          if (this.stats) {
            this.stats.update();
          }
          if (this.composer) {
            this.composer.render();
          } else {
            this.renderer.render(this.scene, this.camera);
          }
        });
      }
      // 创建文本
      createText(
        text = "",
        config: THREE.TextGeometryParameters,
        material: THREE.Material = new THREE.MeshStandardMaterial({
          color: "#ffffff",
        })
      ) {
        const geo = new THREE.TextGeometry(text, config);
        const mesh = new THREE.Mesh(geo, material);
        return mesh;
      }
      // 创建音效源
      createAudioSource() {
        const listener = new THREE.AudioListener();
        this.camera.add(listener);
        const sound = new THREE.Audio(listener);
        this.sound = sound;
      }
      // 加载音效
      loadAudio(url: string): Promise<AudioBuffer> {
        const loader = new THREE.AudioLoader();
        return new Promise((resolve) => {
          loader.load(url, (buffer) => {
            this.sound.setBuffer(buffer);
            resolve(buffer);
          });
        });
      }
      // 加载模型
      loadModel(url: string): Promise<THREE.Object3D> {
        const loader = new GLTFLoader();
        return new Promise((resolve, reject) => {
          loader.load(
            url,
            (gltf) => {
              const model = gltf.scene;
              console.log(model);
              resolve(model);
            },
            undefined,
            (err) => {
              console.log(err);
              reject();
            }
          );
        });
      }
      // 加载FBX模型
      loadFBXModel(url: string): Promise<THREE.Object3D> {
        const loader = new FBXLoader();
        return new Promise((resolve, reject) => {
          loader.load(
            url,
            (obj) => {
              resolve(obj);
            },
            undefined,
            (err) => {
              console.log(err);
              reject();
            }
          );
        });
      }
      // 加载字体
      loadFont(url: string): Promise<THREE.Font> {
        const loader = new THREE.FontLoader();
        return new Promise((resolve) => {
          loader.load(url, (font) => {
            resolve(font);
          });
        });
      }
      // 创建点选模型
      createRaycaster() {
        this.raycaster = new THREE.Raycaster();
        this.trackMousePos();
      }
      // 追踪鼠标位置
      trackMousePos() {
        window.addEventListener("mousemove", (e) => {
          this.setMousePos(e);
        });
        window.addEventListener(
          "touchstart",
          (e: TouchEvent) => {
            this.setMousePos(e.touches[0]);
          },
          { passive: false }
        );
        window.addEventListener("touchmove", (e: TouchEvent) => {
          this.setMousePos(e.touches[0]);
        });
      }
      // 设置鼠标位置
      setMousePos(e: MouseEvent | Touch) {
        const { x, y } = getNormalizedMousePos(e);
        this.mousePos.x = x;
        this.mousePos.y = y;
      }
      // 获取点击物
      getInterSects(): THREE.Intersection[] {
        this.raycaster.setFromCamera(this.mousePos, this.camera);
        const intersects = this.raycaster.intersectObjects(this.scene.children, true);
        return intersects;
      }
      // 选中点击物时
      onChooseIntersect(target: THREE.Object3D) {
        const intersects = this.getInterSects();
        const intersect = intersects[0];
        if (!intersect || !intersect.face) {
          return null;
        }
        const { object } = intersect;
        return target === object ? intersect : null;
      }
      // 获取跟屏幕同像素的fov角度
      getScreenFov() {
        return ky.rad2deg(2 * Math.atan(window.innerHeight / 2 / this.cameraPosition.z));
      }
      // 获取重心坐标系
      getBaryCoord(bufferGeometry: THREE.BufferGeometry) {
        // https://gist.github.com/mattdesl/e399418558b2b52b58f5edeafea3c16c
        const length = bufferGeometry.attributes.position.array.length;
        const count = length / 3;
        const bary = [];
        for (let i = 0; i < count; i++) {
          bary.push(0, 0, 1, 0, 1, 0, 1, 0, 0);
        }
        const aCenter = new Float32Array(bary);
        bufferGeometry.setAttribute("aCenter", new THREE.BufferAttribute(aCenter, 3));
      }
      // 追踪鼠标速度
      trackMouseSpeed() {
        // https://stackoverflow.com/questions/6417036/track-mouse-speed-with-js
        let lastMouseX = -1;
        let lastMouseY = -1;
        let mouseSpeed = 0;
        window.addEventListener("mousemove", (e) => {
          const mousex = e.pageX;
          const mousey = e.pageY;
          if (lastMouseX > -1) {
            mouseSpeed = Math.max(Math.abs(mousex - lastMouseX), Math.abs(mousey - lastMouseY));
            this.mouseSpeed = mouseSpeed / 100;
          }
          lastMouseX = mousex;
          lastMouseY = mousey;
        });
        document.addEventListener("mouseleave", () => {
          this.mouseSpeed = 0;
        });
      }
      // 使用PCFSoft阴影
      usePCFSoftShadowMap() {
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      }
      // 使用VSM阴影
      useVSMShadowMap() {
        this.renderer.shadowMap.type = THREE.VSMShadowMap;
      }
      // 将相机的方向设为z轴
      setCameraUpZ() {
        this.camera.up.set(0, 0, 1);
      }
    }

    class RayMarching extends Base {
      clock!: THREE.Clock;
      rayMarchingMaterial!: THREE.ShaderMaterial;
      constructor(sel: string, debug: boolean) {
        super(sel, debug);
        this.clock = new THREE.Clock();
        this.cameraPosition = new THREE.Vector3(0, 0, 0);
      }
      // 初始化
      init() {
        this.createScene();
        this.createOrthographicCamera();
        this.createRenderer();
        this.createRayMarchingMaterial();
        this.createPlane();
        this.createLight();
        this.trackMousePos();
        this.addListeners();
        // this.createDebugPanel();
        this.setLoop();
      }
      // 创建光线追踪材质
      createRayMarchingMaterial() {
        const loader = new THREE.TextureLoader();
        const texture = loader.load(matcapTextureUrl);
        const rayMarchingMaterial = new THREE.ShaderMaterial({
          vertexShader: rayMarchingVertexShader,
          fragmentShader: rayMarchingFragmentShader,
          side: THREE.DoubleSide,
          uniforms: {
            uTime: {
              value: 0,
            },
            uMouse: {
              value: new THREE.Vector2(0, 0),
            },
            uResolution: {
              value: new THREE.Vector2(window.innerWidth, window.innerHeight),
            },
            uTexture: {
              value: texture,
            },
            uProgress: {
              value: 1,
            },
            uVelocityBox: {
              value: 0.25,
            },
            uVelocitySphere: {
              value: 0.5,
            },
            uAngle: {
              value: 1.5,
            },
            uDistance: {
              value: 1.2,
            },
          },
        });
        this.rayMarchingMaterial = rayMarchingMaterial;
        this.shaderMaterial = rayMarchingMaterial;
      }
      // 创建平面
      createPlane() {
        const geometry = new THREE.PlaneBufferGeometry(2, 2, 100, 100);
        const material = this.rayMarchingMaterial;
        this.createMesh({
          geometry,
          material,
        });
      }
      // 动画
      update() {
        const elapsedTime = this.clock.getElapsedTime();
        const mousePos = this.mousePos;
        if (this.rayMarchingMaterial) {
          this.rayMarchingMaterial.uniforms.uTime.value = elapsedTime;
          this.rayMarchingMaterial.uniforms.uMouse.value = mousePos;
        }
      }
      // 创建调试面板
      createDebugPanel() {
        const { rayMarchingMaterial } = this;
        const gui = new dat.GUI({ width: 300 });
        gui
          .add(rayMarchingMaterial.uniforms.uProgress, "value")
          .min(0)
          .max(1)
          .step(0.01)
          .name("progress");
        gui
          .add(rayMarchingMaterial.uniforms.uVelocityBox, "value")
          .min(0)
          .max(1)
          .step(0.01)
          .name("velocityBox");
        gui
          .add(rayMarchingMaterial.uniforms.uVelocitySphere, "value")
          .min(0)
          .max(1)
          .step(0.01)
          .name("velocitySphere");
        gui
          .add(rayMarchingMaterial.uniforms.uAngle, "value")
          .min(0)
          .max(2)
          .step(0.01)
          .name("angle");
        gui
          .add(rayMarchingMaterial.uniforms.uDistance, "value")
          .min(0)
          .max(2)
          .step(0.01)
          .name("distance");
      }
    }

    const start = () => {
      const rayMarching = new RayMarching(".ray-marching", false);
      rayMarching.init();
    };

    start();
  }
}
</script>

<style lang='less' scoped>
.content-model {
  display: flex;
  min-height: 100vh;
  margin: 0;
  overflow: hidden;
  background: hsl(240, 56%, 98%);
  justify-content: center;
  align-items: center;
}
</style>
















