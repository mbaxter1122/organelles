import * as THREE from './vendor/three.module.min.js';
const host=document.getElementById('cell3d');
let renderer,scene,camera,root,type='',selectedId='',frame=0,drag=null,objects={};
const ray=new THREE.Raycaster(),pointer=new THREE.Vector2();
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
// Original scientific cutaway geometry: no third-party model assets.
let noiseTexture;
function surfaceTexture(){
 if(noiseTexture)return noiseTexture;
 const canvas=document.createElement('canvas');canvas.width=canvas.height=256;const ctx=canvas.getContext('2d'),img=ctx.createImageData(256,256);let seed=7921;
 for(let i=0;i<img.data.length;i+=4){seed=(seed*16807)%2147483647;const v=110+seed%65;img.data[i]=img.data[i+1]=img.data[i+2]=v;img.data[i+3]=255}
 ctx.putImageData(img,0,0);noiseTexture=new THREE.CanvasTexture(canvas);noiseTexture.wrapS=noiseTexture.wrapT=THREE.RepeatWrapping;noiseTexture.repeat.set(3,3);return noiseTexture;
}
function material(color){return new THREE.MeshPhysicalMaterial({color,roughness:.46,metalness:0,clearcoat:.32,clearcoatRoughness:.24,bumpMap:surfaceTexture(),bumpScale:.012,side:THREE.DoubleSide})}
function mesh(group,geometry,color,position=[0,0,0],scale=[1,1,1],detail=false){const m=new THREE.Mesh(geometry,material(color));m.position.set(...position);m.scale.set(...scale);m.userData.part=group.userData.part;m.userData.colorable=!detail;m.castShadow=true;m.receiveShadow=true;group.add(m);return m}
function tube(group,points,color,r=.025,closed=false){const curve=new THREE.CatmullRomCurve3(points.map(p=>new THREE.Vector3(...p)),closed);return mesh(group,new THREE.TubeGeometry(curve,Math.max(40,points.length*2),r,7,closed),color,[0,0,0],[1,1,1],true)}
const units={};let pendingUnit=null;
function part(id){const g=new THREE.Group();g.userData={part:id,unitRoot:true,lift:0,baseY:0};objects[id]=g;units[id]=[g];root.add(g);return g}
function unit(parent,position,angle=0,scale=1){if(units[parent.userData.part][0]===parent)units[parent.userData.part]=[];const g=new THREE.Group();g.userData={part:parent.userData.part,unitRoot:true,lift:0,baseY:position[1]};g.position.set(...position);g.rotation.y=angle;g.scale.setScalar(scale);parent.add(g);units[parent.userData.part].push(g);return g}
function color(id){return window.cellExplorer.getColor(type,id)}
function parametric(nu,nv,fn){const positions=[],uv=[],indices=[];for(let u=0;u<=nu;u++)for(let v=0;v<=nv;v++){const p=fn(u/nu,v/nv);positions.push(...p);uv.push(u/nu,v/nv)}for(let u=0;u<nu;u++)for(let v=0;v<nv;v++){const a=u*(nv+1)+v,b=a+nv+1;indices.push(a,b,a+1,b,b+1,a+1)}const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geo.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));geo.setIndex(indices);geo.computeVertexNormals();return geo}
function distortedSphere(radius,detail=32,amount=.025){const geo=new THREE.SphereGeometry(radius,detail,detail),p=geo.attributes.position;for(let i=0;i<p.count;i++){const x=p.getX(i),y=p.getY(i),z=p.getZ(i),n=1+amount*(Math.sin(x*17+y*9)*Math.cos(z*13)+.45*Math.sin(y*23-z*11));p.setXYZ(i,x*n,y*n,z*n)}geo.computeVertexNormals();return geo}
function plantOutline(scale=1){const c=new THREE.CatmullRomCurve3([[-2.2,0,-1.55],[-1.3,0,-2.03],[1.5,0,-1.94],[2.38,0,-.85],[2.08,0,1.55],[.3,0,2.02],[-2.18,0,1.38]].map(p=>new THREE.Vector3(...p)),true,'catmullrom',.16);return c.getPoints(112).slice(0,-1).map(p=>[p.x*scale,p.z*scale])}
function outlineShape(points){const s=new THREE.Shape();points.forEach(([x,z],i)=>i?s.lineTo(x,z):s.moveTo(x,z));s.closePath();return s}
function plantRim(id,scale,thickness,depth){const g=part(id),outer=plantOutline(scale),s=outlineShape(outer),hole=outlineShape(plantOutline(scale-thickness));s.holes.push(new THREE.Path(hole.getPoints().reverse()));const m=mesh(g,new THREE.ExtrudeGeometry(s,{depth,bevelEnabled:true,bevelThickness:.026,bevelSize:.023,bevelSegments:3,steps:1}),color(id));m.rotation.x=Math.PI/2;
 if(id==='wall')for(let j=1;j<=4;j++)tube(g,outer.map(([x,z])=>[x,-j*depth/5,z]),'#6d9457',.009,true);
 return g}
function beadInstances(group,positions,radius,colorValue,detail=false){const geo=distortedSphere(radius,10,.065),mat=material(colorValue),m=new THREE.InstancedMesh(geo,mat,positions.length),matrix=new THREE.Matrix4();positions.forEach((p,i)=>{matrix.makeTranslation(...p);m.setMatrixAt(i,matrix)});m.userData={part:group.userData.part,colorable:!detail};m.castShadow=true;m.receiveShadow=true;group.add(m);return m}
function organicRadius(a){return 2.34*(1+.055*Math.sin(3*a)+.026*Math.cos(5*a+.6))}
function buildAnimalBase(){
 const membrane=part('membrane');
 mesh(membrane,parametric(100,30,(u,v)=>{const a=u*Math.PI*2,t=v*Math.PI/2,r=organicRadius(a)*Math.cos(t);return [r*Math.cos(a),-1.18*Math.sin(t),r*Math.sin(a)*.89]}),color('membrane'));
 const rim=[],inner=[];for(let i=0;i<120;i++){const a=i/120*Math.PI*2,r=organicRadius(a);rim.push([r*Math.cos(a),0,r*Math.sin(a)*.89]);inner.push([(r-.07)*Math.cos(a),-.01,(r-.07)*Math.sin(a)*.89])}
 tube(membrane,rim,color('membrane'),.045,true);tube(membrane,inner,'#d49b66',.025,true);
 const lipids=[];for(let i=0;i<190;i++){const a=i/190*Math.PI*2,r=organicRadius(a);lipids.push([r*Math.cos(a),.012,r*Math.sin(a)*.89],[(r-.08)*Math.cos(a),-.022,(r-.08)*Math.sin(a)*.89])}beadInstances(membrane,lipids,.023,'#f4c58f',true);
 const cyto=part('cytoplasm');const fluid=mesh(cyto,parametric(100,24,(u,v)=>{const a=u*Math.PI*2,r=(organicRadius(a)-.11)*v;return [r*Math.cos(a),-.075+.018*Math.sin(r*6+a*2),r*Math.sin(a)*.89]}),color('cytoplasm'));fluid.material.roughness=.25;fluid.material.clearcoat=.75;fluid.material.bumpScale=.018;
}
function buildPlantBase(){plantRim('wall',1.02,.065,.88);plantRim('membrane',.943,.026,.72);const cyto=part('cytoplasm'),s=outlineShape(plantOutline(.91)),m=mesh(cyto,new THREE.ExtrudeGeometry(s,{depth:.15,bevelEnabled:false}),color('cytoplasm'));m.rotation.x=Math.PI/2;m.position.y=-.07;m.material.clearcoat=.7;m.material.roughness=.29;}
function addNucleus(){
 const g=part('nucleus'),nx=type==='plant'?-1.03:-.65,nz=type==='plant'?.55:.05,center=.53,r=.77,cut=.86;
 const shell=mesh(g,new THREE.SphereGeometry(r,64,40,0,Math.PI*2,cut,Math.PI-cut),color('nucleus'),[nx,center,nz],[1,.88,1]);shell.material.bumpScale=.023;
 const opening=r*Math.sin(cut),height=center+r*Math.cos(cut)*.88;
 const lip=mesh(g,new THREE.TorusGeometry(opening,.025,10,64),'#d6b28d',[nx,height,nz],[1,1,1],true);lip.rotation.x=Math.PI/2;
 const inner=mesh(g,new THREE.SphereGeometry(r*.94,56,32,0,Math.PI*2,cut,Math.PI-cut),'#836247',[nx,center,nz],[1,.87,1],true);inner.material.roughness=.63;
 // Chromatin threads are features within the nucleus, not extra lesson parts.
 for(let j=0;j<7;j++){const pts=[];for(let i=0;i<65;i++){const a=i/64*Math.PI*3.7+j*.8,rad=.19+.12*Math.sin(a*.7+j);pts.push([nx+Math.cos(a)*rad,center+.16+.12*Math.sin(a*1.3+j),nz+Math.sin(a)*rad])}tube(g,pts,j%2?'#c8aa87':'#aa8b68',.017)}
 for(let i=0;i<42;i++){const a=i*2.39996,theta=1.0+(i%7)/7*1.3,normal=new THREE.Vector3(Math.sin(theta)*Math.cos(a),Math.cos(theta),Math.sin(theta)*Math.sin(a));const pore=mesh(g,new THREE.TorusGeometry(.031,.009,6,12),'#785a43',[nx+normal.x*r,center+normal.y*r*.88,nz+normal.z*r],[1,1,1],true);pore.quaternion.setFromUnitVectors(new THREE.Vector3(0,0,1),normal);}
}
function beanPoint(u,v,rx=.68,rz=.3,ry=.28){const x=(u*2-1)*rx,q=Math.sqrt(Math.max(0,1-(u*2-1)**2)),a=Math.PI/2+v*Math.PI;return [x,Math.cos(a)*q*ry,Math.sin(a)*q*rz+.11*(1-(x/rx)**2)]}
function addMitochondria(){const group=part('mitochondria');const places=type==='plant'?[[1.38,.22,.43,.6,.86],[-1.35,.21,-1.05,-.45,.75],[1.55,.19,1.3,-.4,.5]]:[[1.12,.22,.65,-.42,.97],[-1.35,.22,-.85,.48,.8],[.75,.19,-1.14,.2,.64]];
 for(const [x,y,z,a,scale]of places){const g=unit(group,[x,y,z],a,scale);mesh(g,parametric(45,24,(u,v)=>beanPoint(u,v)),color('mitochondria'));
 const outline=[];for(let i=0;i<96;i++){const a=i/96*Math.PI*2,x=.68*Math.cos(a);outline.push([x,.005,.3*Math.sin(a)+.11*(1-(x/.68)**2)])}tube(g,outline,'#c65659',.025,true);
 const matrix=mesh(g,parametric(40,16,(u,v)=>{const p=beanPoint(u,v);p[1]=-.07+Math.abs(p[1])*.08;return p}),'#eab2a1',[0,0,0],[.94,1,.9],true);matrix.material.roughness=.35;
 for(let j=0;j<7;j++){const x=-.48+j*.155,span=.21*Math.sqrt(1-(x/.68)**2);const fold=mesh(g,parametric(12,10,(u,v)=>[x+.065*Math.sin(u*Math.PI*2),-.055+v*.19,(-span+2*span*u)+.11*(1-(x/.68)**2)]),'#b45b58',[0,0,0],[1,1,1],true);fold.material.roughness=.43;const pts=[];for(let k=0;k<22;k++){const u=k/21;pts.push([x+.065*Math.sin(u*Math.PI*2),.14,-span+2*span*u+.11*(1-(x/.68)**2)])}tube(g,pts,'#d07d72',.015)}
 }}
function addChloroplasts(){const group=part('chloroplast');for(const [x,y,z,a,scale]of [[.15,.24,1.28,-.32,1],[.55,.24,-1.25,.18,.93],[1.58,.2,-.62,.95,.7]]){
 const g=unit(group,[x,y,z],a,scale);mesh(g,parametric(48,24,(u,v)=>{const x=(u*2-1)*.76,q=Math.sqrt(Math.max(0,1-(u*2-1)**2)),a=Math.PI/2+v*Math.PI;return [x,.3*q*Math.cos(a),.39*q*Math.sin(a)]}),color('chloroplast'));
 const rim=[];for(let j=0;j<100;j++){const a=j/100*Math.PI*2;rim.push([.76*Math.cos(a),0,.39*Math.sin(a)])}tube(g,rim,'#3d754b',.023,true);
 const stroma=mesh(g,new THREE.CircleGeometry(1,48),'#93b88a',[0,-.08,0],[.7,.34,1],true);stroma.rotation.x=-Math.PI/2;stroma.material.roughness=.35;
 for(const [sx,sz,height]of [[-.42,-.08,6],[-.15,.13,7],[.12,-.12,6],[.4,.08,7]]){
  for(let j=0;j<height;j++){const m=mesh(g,new THREE.CylinderGeometry(.115,.12,.022,24),'#4a8052',[sx,-.04+j*.029,sz],[1,1,1],true);m.material.roughness=.55}
 }
 for(let j=0;j<3;j++)tube(g,[[-.42+j*.27,.015,j%2? .12:-.08],[-.28+j*.27,.025,.03],[-.15+j*.27,.02,j%2?-.12:.13]],'#6b995e',.018);
 }}
function addRibosomes(){const parent=part('ribosome');let seed=591;
 const random=()=>{seed=(seed*16807)%2147483647;return seed/2147483647};
 for(let j=0;j<26;j++){const a=random()*Math.PI*2,r=.7+random()*1.35,x=Math.cos(a)*r,z=Math.sin(a)*r*.8;
  // Avoid the nucleus and keep the small structures visible on the surface.
  if(x<-.15&&z>-.6&&z<1.2)continue;
  const g=unit(parent,[x,.07+random()*.035,z],random()*Math.PI,.85+random()*.4);
  mesh(g,distortedSphere(.061,14,.13),color('ribosome'),[0,.04,0],[1,.78,1]);mesh(g,distortedSphere(.046,12,.12),color('ribosome'),[.013,.105,.006],[1,.72,.9]);
  const pick=mesh(g,new THREE.SphereGeometry(.135,8,6),color('ribosome'),[0,.08,0]);pick.material.transparent=true;pick.material.opacity=0;pick.material.depthWrite=false;pick.castShadow=false;pick.userData.pickOnly=true;
 }
}
function addCytoplasmGranules(){const g=objects.cytoplasm,positions=[];let seed=731;for(let i=0;i<150;i++){seed=(seed*16807)%2147483647;const x=(seed/2147483647-.5)*4.2;seed=(seed*16807)%2147483647;const z=(seed/2147483647-.5)*3.4;if(type==='animal'&&(x*x/5+z*z/3.5)>1)continue;positions.push([x,-.045,z])}const m=beadInstances(g,positions,.012,'#a9b3b6',true);m.castShadow=false;}
function disposeModel(){if(!root)return;root.traverse(o=>{o.geometry?.dispose();if(o.material)o.material.dispose()});scene.remove(root)}
function build(next){if(type===next)return;disposeModel();type=next;objects={};for(const k in units)delete units[k];selectedId='';root=new THREE.Group();scene.add(root);root.rotation.y=-.18;
 if(type==='animal')buildAnimalBase();else buildPlantBase();addCytoplasmGranules();addNucleus();addMitochondria();addRibosomes();if(type==='plant')addChloroplasts();refreshColors();resetView();}
function refreshColors(){for(const [id,g]of Object.entries(objects))g.traverse(m=>{if(m.isMesh&&m.userData.colorable)m.material.color.set(color(id))})}
function clearSelection(){selectedId='';for(const list of Object.values(units))for(const g of list){g.userData.lift=0;g.traverse(m=>m.material?.emissive?.set(0))}document.getElementById('modelStatus').textContent='Drag to rotate. Tap an organelle to explore.'}
function select(id){if(!objects[id])return;clearSelection();selectedId=id;const focus=pendingUnit?.userData.part===id?pendingUnit:units[id][0];pendingUnit=null;focus.userData.lift=['membrane','cytoplasm','wall'].includes(id)?.7:1.35;focus.traverse(m=>{if(m.material&&!m.userData.pickOnly){m.material.emissive?.set('#324133');m.material.emissiveIntensity=.08}});document.getElementById('modelStatus').textContent=`${window.cellExplorer.getName(id)} selected. It is lifted above the cell.`}
function resetView(){if(!root)return;root.rotation.set(0,-.16,0);camera.position.set(0,5.9,7.7);camera.lookAt(0,.22,0)}
function resize(){if(!renderer)return;const w=host.clientWidth,h=host.clientHeight;if(!w||!h)return;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix()}
function hit(e){const b=renderer.domElement.getBoundingClientRect();pointer.set((e.clientX-b.left)/b.width*2-1,-(e.clientY-b.top)/b.height*2+1);ray.setFromCamera(pointer,camera);const h=ray.intersectObjects(root.children,true).find(h=>h.object.userData.part);if(!h)return null;let unit=h.object;while(unit&&!unit.userData.unitRoot)unit=unit.parent;return {id:h.object.userData.part,unit:unit||objects[h.object.userData.part]}}
function tick(){frame=requestAnimationFrame(tick);if(document.hidden||document.getElementById('scopeView').hidden)return;for(const list of Object.values(units))for(const g of list){const target=g.userData.baseY+g.userData.lift;g.position.y=reduced?target:THREE.MathUtils.lerp(g.position.y,target,.075)}renderer.render(scene,camera)}

try{
 renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'low-power'});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.setClearColor(0x081c29,0);host.append(renderer.domElement);renderer.domElement.setAttribute('aria-label','Interactive 3D cell. Drag to rotate. Click a cell part, or use the labeled buttons below.');renderer.domElement.setAttribute('role','img');
 scene=new THREE.Scene();camera=new THREE.PerspectiveCamera(36,1,.1,100);scene.add(new THREE.HemisphereLight(0xe9faff,0x415975,1.5));const key=new THREE.DirectionalLight(0xffffff,2);key.position.set(-3,7,4);key.castShadow=true;key.shadow.mapSize.set(1024,1024);key.shadow.camera.left=-4;key.shadow.camera.right=4;key.shadow.camera.top=4;key.shadow.camera.bottom=-4;key.shadow.bias=-.0003;key.shadow.normalBias=.025;scene.add(key);const side=new THREE.DirectionalLight(0xb8e5ff,1);side.position.set(5,3,-4);scene.add(side);
 renderer.domElement.addEventListener('pointerdown',e=>{drag={x:e.clientX,y:e.clientY,lastX:e.clientX,lastY:e.clientY,moved:0};renderer.domElement.setPointerCapture(e.pointerId)});
 renderer.domElement.addEventListener('pointermove',e=>{if(drag){const dx=e.clientX-drag.lastX,dy=e.clientY-drag.lastY;drag.moved+=Math.abs(dx)+Math.abs(dy);root.rotation.y+=dx*.008;root.rotation.x=THREE.MathUtils.clamp(root.rotation.x+dy*.004,-.35,.55);drag.lastX=e.clientX;drag.lastY=e.clientY}else if(root)renderer.domElement.style.cursor=hit(e)?'pointer':'grab'});
 renderer.domElement.addEventListener('pointerup',e=>{if(!drag)return;const click=drag.moved<9;drag=null;if(click){const hitPart=hit(e);if(hitPart){pendingUnit=hitPart.unit;window.cellExplorer.select(hitPart.id)}}});renderer.domElement.addEventListener('pointercancel',()=>drag=null);
 renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();document.body.classList.remove('three-ready');document.getElementById('modelStatus').textContent='3D is unavailable. Use the clickable diagram below.';window.cellModel.ready=false;cancelAnimationFrame(frame)});
 new ResizeObserver(resize).observe(host);
 window.cellModel={ready:true,setCell(next){build(next);resize()},clearSelection,selectPart:select,refreshColors,reset:resetView,rotate(direction){root.rotation.y+=direction*.35},zoom(direction){camera.position.multiplyScalar(direction>0?.9:1.1);const l=camera.position.length();if(l<7)camera.position.setLength(7);if(l>15)camera.position.setLength(15);camera.lookAt(0,.35,0)},resize};
 document.body.classList.add('three-ready');build(window.cellExplorer.getCell());select(window.cellExplorer.getSelected());resize();tick();
}catch(e){console.warn('3D viewer unavailable',e);host.hidden=true;document.querySelector('.eyepiece-view').hidden=true;document.querySelector('.model-controls').hidden=true;document.getElementById('modelStatus').textContent='Use the clickable cell diagram. 3D is unavailable on this device.'}
