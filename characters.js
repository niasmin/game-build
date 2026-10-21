// Original character animations, rasterized offline from the supplied APK.
// No native game code or third-party skeletal runtime executes in the browser.
const supported=new Set([201010001,202020001,202010001]);
const images=new Map(),clocks=new Map();let manifest,loading=false;
async function prepare(){if(loading)return;loading=true;try{manifest=await fetch('./public/assets/recovered/characters/sprite-sheets.json').then(r=>r.json());}catch{manifest={characters:[]};}}
function sheet(path){if(!images.has(path)){const image=new Image();image.src=path;images.set(path,image);}return images.get(path);}
export function characterCanvas(h,event,turn){const id=Number(h.skin?.mdid);if(!supported.has(id))return '';const pose=h.hp<=0?'die':event?.actor===h.id?(event.rage?'skill':'attack'):event?.target===h.id?'hit':'idle';return `<canvas class="original-character" width="180" height="200" data-character="${id}" data-side="${h.side}" data-identity="${h.id}" data-pose="${pose}" data-turn="${turn}" aria-label="แอนิเมชันขุนพลจาก APK"></canvas>`;}
prepare();
function draw(now){if(manifest&&!document.hidden){for(const canvas of document.querySelectorAll('canvas.original-character')){const id=Number(canvas.dataset.character),meta=manifest.characters.find(x=>Number(x.id)===id);if(!meta)continue;
 const key=canvas.dataset.identity,signature=canvas.dataset.pose+':'+canvas.dataset.turn;let clock=clocks.get(key);if(!clock||clock.signature!==signature){clock={signature,start:now};clocks.set(key,clock);}
 let pose=canvas.dataset.pose,anim=meta.animations[pose]||meta.animations.idle;let elapsed=(now-clock.start)/1000;
 if(pose!=='idle'&&pose!=='die'&&elapsed>anim.duration){pose='idle';anim=meta.animations.idle;elapsed-=anim.duration;}
 const image=sheet('./'+anim.file);if(!image.complete||!image.naturalWidth)continue;
 let frame=Math.floor(elapsed/Math.max(.1,anim.duration)*anim.frames);frame=pose==='die'?Math.min(anim.frames-1,frame):frame%anim.frames;
 const ctx=canvas.getContext('2d');ctx.clearRect(0,0,canvas.width,canvas.height);ctx.save();if(canvas.dataset.side==='enemy'){ctx.translate(canvas.width,0);ctx.scale(-1,1);}
 ctx.drawImage(image,frame*meta.frame_width+45,55,175,185,0,0,180,200);ctx.restore();canvas.dataset.loaded='true';canvas.parentElement.classList.add('has-animation');
 }}requestAnimationFrame(draw);}
requestAnimationFrame(draw);
