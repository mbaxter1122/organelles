function plantDiagram(){
 const c=id=>colors.plant[id]||parts[id].color;
 const fill=id=>`url(#plant-${id})`;
 let s='<defs>'+lists.plant.map(id=>`<radialGradient id="plant-${id}" cx="30%" cy="20%" r="90%"><stop stop-color="#fff" stop-opacity=".6"/><stop offset=".4" stop-color="${c(id)}"/><stop offset="1" stop-color="${c(id)}"/></radialGradient>`).join('')+'<filter id="plant-shadow" x="-40%" y="-50%" width="180%" height="220%"><feDropShadow dx="2" dy="7" stdDeviation="5" flood-color="#203b34" flood-opacity=".3"/></filter></defs><ellipse cx="300" cy="421" rx="220" ry="24" fill="#294b35" opacity=".12"/>';
 const g=(id,shape,x,y)=>group(id,shape,parts[id].name,x,y,'plant');
 const line=d=>`<path d="${d}" stroke="#385a51" stroke-width="2" fill="none" pointer-events="none"/>`;
 s+=g('wall',`<path class="body" d="M75 134Q70 103 107 89L360 48Q387 44 410 64L535 177Q554 194 547 223L501 362Q494 383 469 389L235 440Q210 447 187 427L70 320Q55 305 59 282Z" fill="${c('wall')}" stroke="#497a42" stroke-width="4"/><path d="M59 282L187 398Q210 418 235 411L474 359Q494 352 501 331L547 202L501 362Q494 383 469 389L235 440Q210 447 187 427L70 320Q55 305 59 282" fill="#23472a" opacity=".24" pointer-events="none"/>${line('M235 425V465')}`,235,485);
 s+=g('membrane',`<path class="body" d="M90 139Q86 117 114 108L358 67Q380 63 397 80L521 190Q534 202 527 222L482 340Q477 354 460 359L233 410Q213 415 198 402L84 300Q73 289 78 270Z" fill="${fill('membrane')}" stroke="#ae7135" stroke-width="3"/>${line('M474 355L519 407H563')}`,497,430);
 s+=g('cytoplasm',`<path class="body" d="M106 145Q102 130 122 125L357 84Q375 81 386 93L503 195Q517 207 509 224L468 326Q463 340 447 343L233 391Q220 395 208 384L99 288Q91 281 94 267Z" fill="${fill('cytoplasm')}" stroke="#849993" stroke-width="2"/>${line('M318 285L294 322H268')}`,290,350);
 let chloroplasts='';for(const [x,y,angle] of [[360,151,27],[397,353,-13]]){chloroplasts+=`<g transform="translate(${x} ${y}) rotate(${angle})"><ellipse class="body" rx="57" ry="29" fill="${fill('chloroplast')}" stroke="#205b39" stroke-width="3" filter="url(#plant-shadow)"/>${[-31,-7,17].map(x=>[ -10,-3,4,11].map(y=>`<path d="M${x} ${y}h16" stroke="#b7df9b" stroke-width="4"/>`).join('')).join('')}</g>`}
 s+=g('chloroplast',chloroplasts+line('M391 151L451 111H527'),477,94);
 s+=g('nucleus',`<ellipse class="body" cx="208" cy="276" rx="66" ry="55" fill="${fill('nucleus')}" stroke="#78563c" stroke-width="3" filter="url(#plant-shadow)"/><path d="M174 263q16-22 32 1t34-1m-58 26q19-22 38-1" fill="none" stroke="#f4dbc0" stroke-width="5" stroke-linecap="round"/><path d="M162 254q12-25 39-23" stroke="white" stroke-opacity=".45" stroke-width="5" fill="none"/>${line('M153 297L110 343H45')}`,71,365);
 let mitos='';for(const [x,y,a] of [[206,153,-24],[464,251,-61]])mitos+=`<g transform="translate(${x} ${y}) rotate(${a})"><rect class="body" x="-40" y="-20" width="80" height="40" rx="20" fill="${fill('mitochondria')}" stroke="#a34849" stroke-width="2.5" filter="url(#plant-shadow)"/><path d="M-29 0q8-21 16 0t16 0t16 0t12 0" fill="none" stroke="#8b3b43" stroke-width="3"/></g>`;
 s+=g('mitochondria',mitos+line('M189 133L153 74H68'),102,55);
 let ribs='';for(const [x,y] of [[298,212],[321,229],[335,206],[354,237],[284,235],[136,210]])ribs+=`<circle class="body" cx="${x}" cy="${y}" r="7" fill="${fill('ribosome')}" stroke="#6a4781" stroke-width="1.5"/>`;
 s+=g('ribosome',`<ellipse cx="319" cy="222" rx="48" ry="27" fill="transparent"/>${ribs}${line('M353 235L398 265H445')}`,405,286);
 return `<svg viewBox="0 0 600 500" aria-label="Plant cell cutaway diagram. Choose a labeled part." xmlns="http://www.w3.org/2000/svg">${s}</svg>`;
}

function animalDiagram(){
 const c=id=>colors.animal[id]||parts[id].color;
 const gradient=(id,color)=>`<radialGradient id="animal-${id}" cx="32%" cy="22%" r="85%"><stop stop-color="#ffffff" stop-opacity=".58"/><stop offset=".35" stop-color="${color}"/><stop offset="1" stop-color="${color}"/><stop offset="1" stop-color="#172532" stop-opacity=".3"/></radialGradient>`;
 const fill=id=>`url(#animal-${id})`;
 const label=(id,shape,title,x,y)=>group(id,shape,title,x,y,'animal');
 const line=d=>`<path d="${d}" fill="none" stroke="#3a5864" stroke-width="2" stroke-linecap="round" pointer-events="none"/>`;
 let s=`<defs>${['membrane','cytoplasm','nucleus','mitochondria','ribosome'].map(id=>gradient(id,c(id))).join('')}<linearGradient id="animal-depth" x2="0" y2="1"><stop stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#50351f" stop-opacity=".5"/></linearGradient><filter id="animal-shadow" x="-40%" y="-50%" width="180%" height="220%"><feDropShadow dx="2" dy="9" stdDeviation="6" flood-color="#233941" flood-opacity=".25"/></filter></defs><ellipse cx="302" cy="405" rx="208" ry="24" fill="#294553" opacity=".10"/>`;
 s+=label('membrane',`<path class="body" d="M65 229C57 142 155 96 292 97C433 94 539 144 539 230L520 314C495 387 402 424 290 421C175 422 88 378 76 309Z" fill="${fill('membrane')}" stroke="#9a6030" stroke-width="3"/><path d="M65 229C67 315 178 362 303 363C424 363 528 318 539 230L520 314C495 387 402 424 290 421C175 422 88 378 76 309Z" fill="url(#animal-depth)" pointer-events="none"/>${line('M455 381L487 442H527')}`,'Cell Membrane',477,464);
 s+=label('cytoplasm',`<ellipse class="body" cx="302" cy="230" rx="219" ry="119" fill="${fill('cytoplasm')}" stroke="#829299" stroke-width="2"/><path d="M102 217C120 154 211 126 289 128" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="7" stroke-linecap="round" pointer-events="none"/>${line('M175 306L102 374H57')}`,'Cytoplasm',73,396);
 // Repeated mitochondria share one lesson and one coloring choice.
 let mitos='';for(const [x,y,angle,scale] of [[410,201,-24,1],[205,300,18,.78],[147,201,-36,.65]]){mitos+=`<g transform="translate(${x} ${y}) rotate(${angle}) scale(${scale})"><path class="body" d="M-52-13C-37-39 2-31 28-23C55-14 58 9 38 22C18 34-4 16-25 22C-55 30-66 9-52-13Z" fill="${fill('mitochondria')}" stroke="#963f45" stroke-width="3" filter="url(#animal-shadow)"/><path d="M-42-2Q-30-24-20-3T0-3T20-3T40 2" fill="none" stroke="#84383e" stroke-width="5" stroke-linecap="round"/><path d="M-41-14Q-19-29 14-17" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="3" stroke-linecap="round"/></g>`}
 s+=label('mitochondria',mitos+line('M446 180L489 107H539'),'Mitochondria',493,88);
 s+=label('nucleus',`<ellipse cx="286" cy="237" rx="81" ry="39" fill="#4b3327" opacity=".17"/><path class="body" d="M211 207C207 134 235 111 284 111C335 110 366 147 362 205C354 246 224 249 211 207Z" fill="${fill('nucleus')}" stroke="#77563c" stroke-width="3" filter="url(#animal-shadow)"/><ellipse cx="286" cy="202" rx="68" ry="32" fill="${c('nucleus')}" stroke="#79593f" stroke-width="2"/><path d="M244 195q18-20 34 1t36-1m-60 18q16-21 34-1t31-6" fill="none" stroke="#f2d8b7" stroke-width="5" stroke-linecap="round"/><path d="M233 151Q248 122 283 125" fill="none" stroke="white" stroke-opacity=".45" stroke-width="6" stroke-linecap="round"/>${line('M286 114V61')}`,'Nucleus',286,43);
 let ribs='';for(const [x,y] of [[361,288],[387,303],[411,281],[430,306],[339,313],[207,164],[177,242]])ribs+=`<circle class="body" cx="${x}" cy="${y}" r="8" fill="${fill('ribosome')}" stroke="#65417f" stroke-width="1.5"/>`;
 s+=label('ribosome',`<ellipse cx="385" cy="300" rx="61" ry="31" fill="transparent"/>${ribs}${line('M411 312L441 357H534')}`,'Ribosome',507,378);
 return `<svg viewBox="0 0 600 490" aria-label="Animal cell cutaway diagram. Choose a labeled part." xmlns="http://www.w3.org/2000/svg">${s}</svg>`;
}

const parts={
membrane:{name:'Cell Membrane',color:'#f3a348',colorName:'orange',job:'Controls what enters and leaves the cell.',steps:['Materials reach the cell membrane.','The membrane lets some materials enter.','Other materials stay outside. Waste can leave.']},
wall:{name:'Cell Wall',color:'#a9d981',colorName:'light green',job:'Supports and protects the plant cell. It helps the cell keep its shape.',steps:['The cell wall surrounds the plant cell.','Water inside the cell pushes outward.','The strong wall helps the cell keep its shape.']},
ribosome:{name:'Ribosome',color:'#a16cca',colorName:'purple',job:'Joins small building blocks called amino acids to make proteins.',steps:['Amino acids arrive at a ribosome.','The ribosome joins the amino acids together.','A protein chain grows. Cells use proteins to work and grow.']},
mitochondria:{name:'Mitochondria',color:'#ed7775',colorName:'red',job:'Use energy from food to make ATP, a form of energy the cell can use.',steps:['Food molecules and oxygen reach the mitochondria.','Mitochondria use the energy in food to make ATP.','ATP supplies energy for the cell’s activities.']},
chloroplast:{name:'Chloroplasts',color:'#388c58',colorName:'dark green',job:'Use sunlight, water, and carbon dioxide to make sugar. Oxygen is released.',steps:['Chloroplasts capture energy from sunlight.','They use water and carbon dioxide to make sugar.','Sugar stores energy. Oxygen is released.']},
cytoplasm:{name:'Cytoplasm',color:'#c4cbd0',colorName:'gray',job:'Jelly-like material inside the cell. It holds cell parts, and many chemical reactions happen here.',steps:['Cytoplasm fills the space inside the cell.','Cell parts sit in this jelly-like material.','Materials move through it. Many chemical reactions happen here.']},
nucleus:{name:'Nucleus',color:'#b18b6b',colorName:'brown',job:'Holds DNA, the instructions that guide the cell’s activities.',steps:['The nucleus holds the cell’s DNA.','The cell copies a needed instruction from DNA.','The copy leaves the nucleus and helps direct protein making.']}
};
const lists={animal:['membrane','nucleus','mitochondria','cytoplasm','ribosome'],plant:['membrane','wall','ribosome','mitochondria','chloroplast','cytoplasm','nucleus']};
let cell='animal',selected='nucleus',step=0,timer=null,paused=false;const notes={animal:{},plant:{}},colors={animal:{},plant:{}},seen={animal:new Set(),plant:new Set()};
const $=id=>document.getElementById(id);const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function group(id,shape,label,x,y,type=cell){return `<g class="cell-part ${selected===id&&type===cell?'selected':''}" role="button" tabindex="0" aria-label="${parts[id].name}" data-part="${id}"><title>${parts[id].name}</title>${shape}<text x="${x}" y="${y}" text-anchor="middle">${label}</text></g>`}
function diagram(type=cell){if(type==='animal')return animalDiagram();if(type==='plant')return plantDiagram();const c=id=>colors[type][id]||parts[id].color;const plant=type==='plant';let s='';
if(plant)s+=group('wall',`<rect class="body" x="38" y="32" width="524" height="425" rx="65" fill="${c('wall')}" stroke="#427448" stroke-width="4"/>`,'Cell Wall',300,55,type);
s+=group('membrane',plant?`<rect class="body" x="57" y="69" width="486" height="368" rx="54" fill="${c('membrane')}" stroke="#ad6b27" stroke-width="3"/>`:`<path class="body" d="M64 185C80 55 255 20 385 56S569 176 551 301S422 456 281 452S31 355 64 185Z" fill="${c('membrane')}" stroke="#b6742e" stroke-width="4"/>`,'Cell Membrane',plant?310:306,plant?426:435,type);
s+=group('cytoplasm',plant?`<rect class="body" x="73" y="84" width="454" height="329" rx="42" fill="${c('cytoplasm')}" stroke="#849499" stroke-width="2"/>`:`<path class="body" d="M81 189C99 76 257 39 381 73S550 179 533 297S415 438 282 434S51 350 81 189Z" fill="${c('cytoplasm')}" stroke="#849499" stroke-width="2"/>`,'Cytoplasm',plant?410:306,plant?395:393,type);
if(plant){s+=group('chloroplast',`<ellipse class="body" cx="428" cy="104" rx="59" ry="24" fill="${c('chloroplast')}" stroke="#23593c" stroke-width="3"/><path d="M397 98h18m-18 7h18m-18 7h18m11-14h18m-18 7h18m-18 7h18m10-14h15m-15 7h15" stroke="#bce1a8" stroke-width="3"/>`,'Chloroplasts',424,79,type)}

const nx=plant?177:246,ny=plant?158:213;s+=group('nucleus',`<ellipse class="body" cx="${nx}" cy="${ny}" rx="70" ry="57" fill="${c('nucleus')}" stroke="#795839" stroke-width="3"/><path d="M${nx-33} ${ny-20}q20 30 43 0m-39 25q23-30 46 0" fill="none" stroke="#f4dbc0" stroke-width="6" stroke-linecap="round"/>`,'Nucleus',nx,ny+80,type);
const mx=plant?167:406,my=plant?363:291;s+=group('mitochondria',`<g transform="rotate(-15 ${mx} ${my})"><rect class="body" x="${mx-57}" y="${my-26}" width="114" height="52" rx="26" fill="${c('mitochondria')}" stroke="#b94b50" stroke-width="3"/><path d="M${mx-38} ${my}q12-27 20 0t20 0t20 0t18 0" fill="none" stroke="#913b47" stroke-width="4"/></g>`,'Mitochondria',mx,my+47,type);
const rx=plant?486:408,ry=plant?354:154;s+=group('ribosome',`<rect x="${rx-34}" y="${ry-24}" width="68" height="52" rx="20" fill="transparent"/><g fill="${c('ribosome')}" stroke="#6b4387" stroke-width="2"><circle class="body" cx="${rx-16}" cy="${ry}" r="8"/><circle cx="${rx+8}" cy="${ry-12}" r="8"/><circle cx="${rx+22}" cy="${ry+12}" r="8"/></g>`,'Ribosome',rx,ry-31,type);
return `<svg viewBox="0 0 600 490" aria-label="${plant?'Plant':'Animal'} cell diagram. Choose a labeled part." xmlns="http://www.w3.org/2000/svg">${s}</svg>`}
function renderCell(){ $('cellTitle').textContent=cell==='plant'?'Plant cell':'Animal cell';$('animalTab').setAttribute('aria-pressed',cell==='animal');$('plantTab').setAttribute('aria-pressed',cell==='plant');$('cellDiagram').innerHTML=diagram();$('explored').textContent=`${seen[cell].size} of ${lists[cell].length} explored`;$('partButtons').innerHTML=lists[cell].map(id=>`<button data-part="${id}" aria-pressed="${id===selected}">${parts[id].name}${seen[cell].has(id)?' ✓':''}</button>`).join('');document.querySelectorAll('[data-part]').forEach(el=>{el.onclick=()=>selectPart(el.dataset.part);if(el.tagName.toLowerCase()==='g')el.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();selectPart(el.dataset.part)}}})}
function setCell(value){if(!lists[value])throw Error('Unknown cell');cell=value;selectPart(lists[cell].includes(selected)?selected:'nucleus')}
function selectPart(id,animate=true){if(!lists[cell].includes(id))throw Error('Part is not on this worksheet');selected=id;seen[cell].add(id);if(window.speechSynthesis)speechSynthesis.cancel();renderCell();const p=parts[id];$('partName').textContent=p.name;$('jobText').textContent=p.job;$('partBadge').textContent=`Color: ${p.colorName}`;$('partColor').value=colors[cell][id]||p.color;$('studentJob').value=notes[cell][id]||'';$('writeHint').textContent=`The ${p.name.toLowerCase()}…`;renderQuestion();liftPart(animate);replay()}
function colorPart(value){colors[cell][selected]=value;renderCell();liftPart(false)}
function saveNote(value){notes[cell][selected]=value;completed[cell].delete(selected);$('answerFeedback').textContent='';updateWritingProgress()}
const txt=(x,y,t)=>`<text x="${x}" y="${y}" text-anchor="middle">${t}</text>`;
const dot=(x,y,col,r=10)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${col}"/>`;
function animationScene(){let s='';const n=step;
if(selected==='membrane'){s=`<path d="M220 25v65m0 35v50" stroke="#f3a348" stroke-width="16" stroke-linecap="round"/>${txt(110,30,'Outside')}${txt(334,30,'Inside')}`;s+=`<g class="motion">${dot(n===0?135:300,105,'#368caf')}</g>${dot(160,155,'#b06bc8',15)}${txt(115,191,'Some stay out')}${txt(335,191,n===2?'Waste can leave':'Some enter')}`;if(n===2)s+=`<path d="M330 62h-74l12-9m-12 9l12 9" fill="none" stroke="#576a7f" stroke-width="4"/>`}
if(selected==='nucleus'){s=`<ellipse cx="158" cy="102" rx="90" ry="70" fill="#b18b6b" stroke="#785936" stroke-width="3"/><path d="M120 65q70 20 0 40t0 40m66-80q-70 20 0 40t0 40" stroke="#fff0d7" stroke-width="5" fill="none"/>${txt(155,192,'DNA stays inside')}`;if(n>0)s+=`<g class="motion"><rect x="${n===1?194:297}" y="80" width="42" height="35" rx="5" fill="#fff" stroke="#64859b" stroke-width="3"/></g>${txt(337,151,'Instruction copy')}`}
if(selected==='mitochondria'){s=`<rect x="151" y="65" width="168" height="81" rx="40" fill="#ed7775" stroke="#b04c53" stroke-width="3"/><path d="M172 108q15-45 30 0t30 0t30 0t30 0" stroke="#9e3d48" stroke-width="5" fill="none"/>`;if(n===0)s+=`${txt(76,65,'Food +')}${txt(76,88,'oxygen')}<g class="motion">${dot(93,120,'#5597ca')}</g>`;if(n>0)s+=`<g class="pulse">${dot(365,100,'#f3c447',26)}${txt(365,106,'ATP')}</g>`;s+=txt(232,185,n===2?'Energy for cell activities':'Energy from food → ATP')}
if(selected==='ribosome'){s=`<ellipse cx="215" cy="114" rx="52" ry="29" fill="#a16cca"/><ellipse cx="215" cy="82" rx="42" ry="23" fill="#bd93dc"/>${txt(96,182,'Amino acids')}${txt(318,182,'Protein chain')}`;s+=`<g class="motion">${dot(90,97,'#47a7a3')}${dot(120,120,'#f3b556')}</g>`;if(n>0){for(let i=0;i<(n===1?3:7);i++)s+=dot(263+i*18,100-Math.sin(i)*14,i%2?'#f3b556':'#47a7a3',9)}}
if(selected==='chloroplast'){s=`<ellipse cx="237" cy="110" rx="82" ry="47" fill="#388c58" stroke="#1b6542" stroke-width="3"/><path d="M185 94h35m-35 11h35m-35 11h35m17-22h35m-35 11h35m-35 11h35" stroke="#c4e8a0" stroke-width="6"/>`;if(n===0)s+=`<g class="pulse">${dot(78,57,'#f1bf30',25)}<path d="M109 64l49 26m-40-4l34 21" stroke="#e7ad22" stroke-width="4"/></g>${txt(75,105,'Sunlight')}`;if(n===1)s+=`${txt(76,83,'Water +')}${txt(78,108,'CO₂')}<g class="motion">${dot(116,139,'#5e9ed8')}</g>`;if(n===2)s+=`${txt(377,94,'Sugar')}${txt(377,127,'Oxygen')}<g class="motion">${dot(340,104,'#e9b444')}</g>`;s+=txt(235,191,'Making food for the plant')}
if(selected==='wall'){s=`<rect x="123" y="27" width="215" height="150" rx="23" fill="#a9d981" stroke="#467c46" stroke-width="10"/><rect x="139" y="43" width="183" height="118" rx="16" fill="#dcebdd"/>`;if(n>0)s+=`<ellipse cx="231" cy="102" rx="78" ry="47" fill="#91c5ec"/><path class="pulse" d="M159 103h-22l9-9m-9 9l9 9m157-9h22l-9-9m9 9l-9 9" fill="none" stroke="#426b87" stroke-width="4"/>`;s+=txt(230,205,n===0?'A strong outer layer':'Supported shape')}
if(selected==='cytoplasm'){s=`<ellipse cx="233" cy="105" rx="161" ry="76" fill="#c4cbd0" stroke="#83969a" stroke-width="3"/>${dot(186,100,'#b18b6b',31)}<rect x="283" y="115" width="53" height="23" rx="12" fill="#ed7775"/>`;if(n>0)s+=`<g class="motion">${dot(245,73,'#4c9eb1',7)}${dot(261,100,'#4c9eb1',7)}${dot(123,112,'#a16cca',6)}</g>`;s+=txt(232,204,n===2?'A place for chemical reactions':'Jelly-like material inside the cell')}

$('jobAnimation').innerHTML=s;$('jobAnimation').setAttribute('aria-label',parts[selected].steps[step]);$('stepText').textContent=parts[selected].steps[step];$('stepCount').textContent=`${step+1} / 3`}
function stop(){clearInterval(timer);timer=null}
function replay(){stop();step=0;paused=false;$('jobAnimation').classList.remove('paused');$('pauseBtn').textContent='Pause';animationScene();if(matchMedia('(prefers-reduced-motion: reduce)').matches){paused=true;freezeGif();$('pauseBtn').textContent='Play';$('jobAnimation').classList.add('paused');return}showGif();startTimer()}
function startTimer(){timer=setInterval(()=>{if(step===2){unlockQuestion();step=0}else step++;animationScene()},3600)}
function pauseAnimation(){if(timer){stop();paused=true;freezeGif();$('pauseBtn').textContent='Play';$('jobAnimation').classList.add('paused')}else replay()}
function nextStep(){stop();paused=true;freezeGif();step=(step+1)%3;animationScene();if(step===2)unlockQuestion();$('pauseBtn').textContent='Play';$('jobAnimation').classList.add('paused')}
function readJob(){if(!window.speechSynthesis){$('readBtn').textContent='Audio unavailable';return}speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(`${parts[selected].name}. ${parts[selected].job}`);u.rate=.85;speechSynthesis.speak(u)}
window.addEventListener('beforeprint',()=>{$('printPages').innerHTML=['animal','plant'].map(type=>`<div class="print-page"><h1>${type==='plant'?'Plant':'Animal'} Cell Coloring</h1><p>Name: __________________________ Date: ______________</p>${diagram(type)}<p>${lists[type].map(id=>`${parts[id].name}: ${parts[id].colorName}`).join(' · ')}</p><p>My writing: ${completed[type].size} of ${lists[type].length} sections complete</p>${lists[type].map(id=>`<section class="print-response"><h2>${parts[id].name}</h2><p><strong>1. What does this organelle do?</strong></p><div class="print-answer">${esc(notes[type][id]||'')}</div><p><strong>2. ${questions[id].q}</strong></p><div class="print-answer">${esc(answers[type][id]||'')}</div></section>`).join('')}</div>`).join('')});
if(document.modelContext?.registerTool){try{Promise.resolve(document.modelContext.registerTool({name:'explore_cell_part',description:'Select a worksheet cell and organelle and start its job animation.',inputSchema:{type:'object',properties:{cell:{enum:['animal','plant']},part:{type:'string'}},required:['cell','part'],additionalProperties:false},annotations:{readOnlyHint:false},execute(input){if(!lists[input.cell]?.includes(input.part))throw Error('Invalid cell or worksheet part');cell=input.cell;selectPart(input.part);return {cell,part:selected,description:parts[selected].job}}})).catch(()=>{})}catch(e){}}
const questions={
 membrane:{q:'Why is it important for the cell membrane to control what enters and leaves?',starter:'This helps the cell because…'},
 nucleus:{q:'Why does the cell need the instructions stored in the nucleus?',starter:'The instructions help the cell…'},
 mitochondria:{q:'Why would a cell have trouble working if its mitochondria stopped making usable energy?',starter:'Without enough energy, the cell…'},
 cytoplasm:{q:'How does the cytoplasm help the parts inside the cell?',starter:'The cytoplasm helps by…'},
 ribosome:{q:'Why does a cell need ribosomes to make proteins?',starter:'The cell uses proteins to…'},
 wall:{q:'How does a cell wall help a plant cell keep its shape?',starter:'The cell wall helps because…'},
 chloroplast:{q:'How would less sunlight affect a chloroplast’s ability to make sugar?',starter:'With less sunlight, the chloroplast…'}
};
const watched={animal:new Set(),plant:new Set()},answers={animal:{},plant:{}},completed={animal:new Set(),plant:new Set()};
let flyingPart=null,liftAnimation=null;
function renderQuestion(){
 const q=questions[selected],ready=watched[cell].has(selected);
 $('questionTitle').textContent=q.q;$('questionHint').textContent=ready?'Use the animation and description to explain your thinking.':'Watch the animation first, or use Next step to go through it.';
 $('functionStarter').textContent=q.starter;$('functionAnswer').value=answers[cell][selected]||'';$('functionAnswer').disabled=!ready;
 $('answerFeedback').textContent=completed[cell].has(selected)?'Both responses are filled in. Your teacher can review your explanation.':'';
 updateWritingProgress();
}
function updateWritingProgress(){$('questionProgress').textContent=`${completed[cell].size} of ${lists[cell].length} writing sections complete`}
function saveFunctionAnswer(value){answers[cell][selected]=value;completed[cell].delete(selected);$('answerFeedback').textContent='';updateWritingProgress()}
function completeResponse(){
 if(!watched[cell].has(selected)){$('answerFeedback').textContent='Watch the animation or go through its three steps first.';return}
 if(!(notes[cell][selected]||'').trim()){$('answerFeedback').textContent='First, write what this organelle does.';$('studentJob').focus();return}
 if(!(answers[cell][selected]||'').trim()){$('answerFeedback').textContent='Now answer the question about its function.';$('functionAnswer').focus();return}
 completed[cell].add(selected);renderQuestion();$('answerFeedback').focus({preventScroll:true});
}
function unlockQuestion(){if(watched[cell].has(selected))return;watched[cell].add(selected);renderQuestion()}
function showGif(){const img=$('jobGif');img.src=`gifs/${selected}.gif?play=${Date.now()}`;img.alt=`${parts[selected].name}: ${parts[selected].job}`;img.hidden=false;$('jobAnimation').style.display='none'}
function freezeGif(){$('jobGif').hidden=true;$('jobGif').removeAttribute('src');$('jobAnimation').style.display='block'}
function liftPart(animate=true){
 if(liftAnimation)liftAnimation.cancel();if(flyingPart)flyingPart.remove();
 const source=document.querySelector(`#cellDiagram [data-part="${selected}"]`),stage=$('liftedPart');
 if(!source?.getBBox)return;
 const clone=source.cloneNode(true);clone.removeAttribute('tabindex');clone.removeAttribute('role');clone.removeAttribute('data-part');clone.classList.remove('selected','cell-part');
 clone.querySelectorAll('text,title,[pointer-events="none"]').forEach(e=>e.remove());
 const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');const defs=source.ownerSVGElement.querySelector('defs');if(defs)svg.append(defs.cloneNode(true));svg.append(clone);stage.replaceChildren(svg);
 // Measure in the real SVG so the crop includes every copy of this part.
 const b=clone.getBBox();svg.setAttribute('viewBox',`${b.x-12} ${b.y-12} ${b.width+24} ${b.height+24}`);svg.setAttribute('aria-hidden','true');
 stage.dataset.part=selected;$('liftCaption').textContent=`${parts[selected].name} — up close`;
 const originalRect=source.getBoundingClientRect(),destination=stage.getBoundingClientRect();
 if(!animate||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
 flyingPart=svg.cloneNode(true);flyingPart.classList.add('flying-part');flyingPart.style.cssText=`left:${originalRect.left}px;top:${originalRect.top}px;width:${originalRect.width}px;height:${originalRect.height}px`;
 document.body.append(flyingPart);const ghost=flyingPart;
 liftAnimation=ghost.animate([{transform:'translate(0,0) scale(1)',opacity:1},{transform:`translate(${destination.left+destination.width/2-originalRect.left-originalRect.width/2}px,${destination.top+destination.height/2-originalRect.top-originalRect.height/2}px) scale(${Math.min(destination.width/originalRect.width,destination.height/originalRect.height)})`,opacity:1}],{duration:1000,easing:'cubic-bezier(.2,.75,.2,1)',fill:'forwards'});
 stage.classList.add('arriving');liftAnimation.onfinish=()=>{ghost.remove();stage.classList.remove('arriving')};liftAnimation.oncancel=()=>{ghost.remove();stage.classList.remove('arriving')};
}

selectPart('nucleus',false);
