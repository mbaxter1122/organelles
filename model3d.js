import * as THREE from './vendor/three.module.min.js';
const host=document.getElementById('cell3d');
let renderer,scene,camera,root,type='',selectedId='',frame=0,drag=null,objects={};
const ray=new THREE.Raycaster(),pointer=new THREE.Vector2();
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
function material(color){return new THREE.MeshStandardMaterial({color,roughness:.48,metalness:.03,side:THREE.DoubleSide})}
function mesh(group,geometry,color,position=[0,0,0],scale=[1,1,1]){const m=new THREE.Mesh(geometry,material(color));m.position.set(...position);m.scale.set(...scale);m.userData.part=group.userData.part;m.userData.colorable=true;group.add(m);return m}
function tube(group,points,color,r=.035){const curve=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p)));const m=mesh(group,new THREE.TubeGeometry(curve,45,r,8,false),color);m.userData.colorable=false;return m}
function part(id){const g=new THREE.Group();g.userData.part=id;g.userData.lift=0;objects[id]=g;root.add(g);return g}
function color(id){return window.cellExplorer.getColor(type,id)}
function roundedShape(w,h,r){const x=-w/2,y=-h/2,s=new THREE.Shape();s.moveTo(x+r,y);s.lineTo(x+w-r,y);s.quadraticCurveTo(x+w,y,x+w,y+r);s.lineTo(x+w,y+h-r);s.quadraticCurveTo(x+w,y+h,x+w-r,y+h);s.lineTo(x+r,y+h);s.quadraticCurveTo(x,y+h,x,y+h-r);s.lineTo(x,y+r);s.quadraticCurveTo(x,y,x+r,y);return s}
function rim(id,w,h,inset,depth){const g=part(id),s=roundedShape(w,h,.5),hole=roundedShape(w-inset*2,h-inset*2,.37);s.holes.push(new THREE.Path(hole.getPoints(24).reverse()));const m=mesh(g,new THREE.ExtrudeGeometry(s,{depth,bevelEnabled:true,bevelThickness:.05,bevelSize:.05,bevelSegments:3,steps:1,curveSegments:16}),color(id));m.rotation.x=Math.PI/2;return g}
function disposeModel(){if(!root)return;root.traverse(o=>{o.geometry?.dispose();if(o.material)o.material.dispose()});scene.remove(root)}
function build(next){
 if(type===next)return;disposeModel();type=next;objects={};selectedId='';root=new THREE.Group();scene.add(root);root.rotation.y=-.18;
 if(type==='animal'){
  const membrane=part('membrane');const shell=mesh(membrane,new THREE.SphereGeometry(2.48,56,24,0,Math.PI*2,Math.PI/2,Math.PI/2),color('membrane'),[0,0,0],[1,.46,.85]);
  const ring=mesh(membrane,new THREE.TorusGeometry(2.43,.09,14,70),color('membrane'));ring.rotation.x=Math.PI/2;ring.scale.y=.85;
  const cyto=part('cytoplasm');mesh(cyto,new THREE.CylinderGeometry(2.32,2.25,.12,64),color('cytoplasm'),[0,-.08,0],[1,1,.85]);
 }else{
  rim('wall',5.2,4.35,.19,.75);rim('membrane',4.79,3.94,.11,.54);
  const cyto=part('cytoplasm'),s=roundedShape(4.52,3.68,.35),m=mesh(cyto,new THREE.ExtrudeGeometry(s,{depth:.12,bevelEnabled:false,curveSegments:18}),color('cytoplasm'));m.rotation.x=Math.PI/2;m.position.y=-.08;
 }
 const nucleus=part('nucleus');const nx=type==='plant'?-.95:-.65,nz=type==='plant'?.55:.1;
 mesh(nucleus,new THREE.SphereGeometry(.68,48,30),color('nucleus'),[nx,.48,nz],[1,.86,1]);
 for(let j=0;j<2;j++){const points=[];for(let i=0;i<25;i++){const x=-.4+i*.033;points.push([nx+x,.98+Math.cos(x*3)*.03,nz-.1+j*.25+Math.sin(i*.4)*.09])}tube(nucleus,points,'#edd3b5',.025)}
 const mito=part('mitochondria');
 for(const [x,z,angle,size] of (type==='plant'?[[1.3,.35,.5,.85],[-1.35,-1.05,-.35,.8]]:[[1,.65,-.3,1],[-1.4,-.85,.55,.75]])){
  const item=new THREE.Group();item.userData.part='mitochondria';item.position.set(x,.26,z);item.rotation.y=angle;item.scale.setScalar(size);mito.add(item);
  mesh(item,new THREE.SphereGeometry(1,36,20),color('mitochondria'),[0,0,0],[.62,.25,.31]);
  const points=[];for(let i=0;i<36;i++)points.push([-.46+i*.026,.23,Math.sin(i*.6)*.14]);tube(item,points,'#923d47',.035);
 }
 const ribs=part('ribosome');for(const [x,z] of [[.4,-.85],[.7,-1],[.95,-.75],[1.2,-1.1],[1.35,-.7],[.65,-.5]]){
  mesh(ribs,new THREE.SphereGeometry(.085,18,12),color('ribosome'),[x,.13,z]);
  const pick=mesh(ribs,new THREE.SphereGeometry(.17,10,8),color('ribosome'),[x,.15,z]);pick.material.transparent=true;pick.material.opacity=0;pick.material.depthWrite=false;pick.userData.pickOnly=true;
 }
 if(type==='plant'){
  const chloro=part('chloroplast');for(const [x,z,angle] of [[.15,1.2,-.25],[.7,-1.3,.15]]){
   const item=new THREE.Group();item.userData.part='chloroplast';item.position.set(x,.25,z);item.rotation.y=angle;chloro.add(item);
   mesh(item,new THREE.SphereGeometry(1,36,20),color('chloroplast'),[0,0,0],[.68,.28,.38]);
   for(const x of [-.35,0,.35])for(let j=0;j<3;j++){const m=mesh(item,new THREE.CylinderGeometry(.12,.12,.035,18),'#b5d790',[x,.23+j*.035,0]);m.userData.colorable=false}
  }
 }
 refreshColors();resetView();
}
function refreshColors(){for(const [id,g] of Object.entries(objects))g.traverse(m=>{if(m.isMesh&&m.userData.colorable)m.material.color.set(color(id))})}
function select(id){if(!objects[id])return;selectedId=id;for(const [key,g]of Object.entries(objects)){g.userData.lift=key===id?(['membrane','cytoplasm','wall'].includes(id)?.65:1.5):0;g.traverse(m=>{if(m.material&&!m.userData.pickOnly){m.material.emissive?.set(key===id?'#153b35':'#000000');m.material.emissiveIntensity=key===id?.18:0}})}document.getElementById('modelStatus').textContent=`${window.cellExplorer.getName(id)} selected. It is lifted above the cell.`}
function resetView(){if(!root)return;root.rotation.set(0,-.18,0);camera.position.set(0,5.8,8.6);camera.lookAt(0,.35,0)}
function resize(){if(!renderer)return;const w=host.clientWidth,h=host.clientHeight;if(!w||!h)return;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix()}
function hit(e){const b=renderer.domElement.getBoundingClientRect();pointer.set((e.clientX-b.left)/b.width*2-1,-(e.clientY-b.top)/b.height*2+1);ray.setFromCamera(pointer,camera);return ray.intersectObjects(root.children,true).find(h=>h.object.userData.part)?.object.userData.part}
function tick(){frame=requestAnimationFrame(tick);if(document.hidden||document.getElementById('scopeView').hidden)return;for(const g of Object.values(objects))g.position.y=reduced?g.userData.lift:THREE.MathUtils.lerp(g.position.y,g.userData.lift,.075);renderer.render(scene,camera)}
try{
 renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'low-power'});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.setClearColor(0x081c29,0);host.append(renderer.domElement);renderer.domElement.setAttribute('aria-label','Interactive 3D cell. Drag to rotate. Click a cell part, or use the labeled buttons below.');renderer.domElement.setAttribute('role','img');
 scene=new THREE.Scene();camera=new THREE.PerspectiveCamera(39,1,.1,100);scene.add(new THREE.HemisphereLight(0xe9faff,0x415975,1.5));const key=new THREE.DirectionalLight(0xffffff,2);key.position.set(-4,7,5);scene.add(key);const side=new THREE.DirectionalLight(0xb8e5ff,1);side.position.set(5,3,-4);scene.add(side);
 renderer.domElement.addEventListener('pointerdown',e=>{drag={x:e.clientX,y:e.clientY,lastX:e.clientX,lastY:e.clientY,moved:0};renderer.domElement.setPointerCapture(e.pointerId)});
 renderer.domElement.addEventListener('pointermove',e=>{if(drag){const dx=e.clientX-drag.lastX,dy=e.clientY-drag.lastY;drag.moved+=Math.abs(dx)+Math.abs(dy);root.rotation.y+=dx*.008;root.rotation.x=THREE.MathUtils.clamp(root.rotation.x+dy*.004,-.35,.55);drag.lastX=e.clientX;drag.lastY=e.clientY}else if(root)renderer.domElement.style.cursor=hit(e)?'pointer':'grab'});
 renderer.domElement.addEventListener('pointerup',e=>{if(!drag)return;const click=drag.moved<9;drag=null;if(click){const id=hit(e);if(id)window.cellExplorer.select(id)}});renderer.domElement.addEventListener('pointercancel',()=>drag=null);
 renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();document.body.classList.remove('three-ready');document.getElementById('modelStatus').textContent='3D is unavailable. Use the clickable diagram below.';window.cellModel.ready=false;cancelAnimationFrame(frame)});
 new ResizeObserver(resize).observe(host);
 window.cellModel={ready:true,setCell(next){build(next);resize()},clearSelection(){selectedId='';for(const g of Object.values(objects)){g.userData.lift=0;g.traverse(m=>m.material?.emissive?.set(0))}document.getElementById('modelStatus').textContent='Drag to rotate. Tap an organelle to explore.'},selectPart:select,refreshColors,reset:resetView,rotate(direction){root.rotation.y+=direction*.35},zoom(direction){camera.position.multiplyScalar(direction>0?.9:1.1);const l=camera.position.length();if(l<7)camera.position.setLength(7);if(l>15)camera.position.setLength(15);camera.lookAt(0,.35,0)},resize};
 document.body.classList.add('three-ready');build(window.cellExplorer.getCell());select(window.cellExplorer.getSelected());resize();tick();
}catch(e){console.warn('3D viewer unavailable',e);host.hidden=true;document.getElementById('modelStatus').textContent='Use the clickable cell diagram. 3D is unavailable on this device.'}
