// Original character animations, rasterized offline from the supplied APK.
// No native game code or third-party skeletal runtime executes in the browser.
const supported=new Set([101010001, 102010001, 102020001, 103010001, 103020001, 201010001, 202010001, 202020001, 204020001, 205030001, 401010001, 402010001, 402020001]);
const images=new Map(),clocks=new Map();let manifest,loading=false;
async function prepare(){if(loading)return;loading=true;try{manifest=await fetch('./public/assets/recovered/characters/sprite-sheets.json?v=0.4.0').then(r=>r.json());}catch{manifest={characters:[]};}}
function sheet(path){if(!images.has(path)){const image=new Image();image.src=path+'?v=0.4.0';images.set(path,image);while(images.size>12){const oldest=images.keys().next().value;images.get(oldest).src='';images.delete(oldest);}}const result=images.get(path);images.delete(path);images.set(path,result);return result;}
export function characterCanvas(h,event,turn){const id=Number(h.skin?.mdid);if(!supported.has(id))return '';const pose=h.hp<=0?'die':event?.actor===h.id?(event.rage?'skill':'attack'):event?.target===h.id?'hit':'idle';return `<canvas class="original-character" width="180" height="200" data-character="${id}" data-side="${h.side}" data-identity="${h.id}" data-pose="${pose}" data-turn="${turn}" aria-label="แอนิเมชันขุนพลจาก APK"></canvas>`;}
prepare();
function draw(now){if(manifest&&!document.hidden){for(const canvas of document.querySelectorAll('canvas.original-character')){const id=Number(canvas.dataset.character),meta=manifest.characters.find(x=>Number(x.id)===id);if(!meta)continue;
 const key=canvas.dataset.identity,signature=canvas.dataset.pose+':'+canvas.dataset.turn;let clock=clocks.get(key);if(!clock||clock.signature!==signature){clock={signature,start:now};clocks.set(key,clock);}
 let pose=canvas.dataset.pose,anim=meta.animations[pose]||meta.animations.idle;let elapsed=(now-clock.start)/1000;
 if(pose!=='idle'&&pose!=='die'&&elapsed>anim.duration){const finishedDuration=anim.duration;pose='idle';anim=meta.animations.idle;elapsed-=finishedDuration;}
 const image=sheet('./'+anim.file);if(!image.complete||!image.naturalWidth)continue;
 let frame=Math.floor(elapsed/Math.max(.1,anim.duration)*anim.frames);frame=pose==='die'?Math.min(anim.frames-1,frame):frame%anim.frames;
 const dpr=Math.min(2,window.devicePixelRatio||1),size=canvas.getBoundingClientRect(),w=Math.max(180,Math.round(size.width*dpr)),h=Math.max(200,Math.round(size.height*dpr));if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;}const ctx=canvas.getContext('2d');ctx.clearRect(0,0,canvas.width,canvas.height);ctx.save();if(canvas.dataset.side==='enemy'){ctx.translate(canvas.width,0);ctx.scale(-1,1);}
 const crop=meta.crop||{x:0,y:0,width:meta.frame_width,height:meta.frame_height},scale=Math.min(canvas.width/crop.width,canvas.height/crop.height),dw=crop.width*scale,dh=crop.height*scale;ctx.drawImage(image,frame*meta.frame_width+crop.x,crop.y,crop.width,crop.height,(canvas.width-dw)/2,canvas.height-dh,dw,dh);ctx.restore();canvas.dataset.loaded='true';canvas.parentElement.classList.add('has-animation');
 }}requestAnimationFrame(draw);}
requestAnimationFrame(draw);
