// Packaged rules with explicit local-only service adaptations.
import {rewards,heroStats} from './game.js?v=0.4.0';
let config={},items={},heroes=[],rules={};
export function configureExpanded(c,i,h,r){config=c;items=i;heroes=h;rules=r;}
export function expanded(){return config;}
export function dayState(s,now=Date.now()){
 const day=new Date(now).toISOString().slice(0,10);
 if(!s.daily||typeof s.daily.day!=='string'||s.daily.day<day)s.daily={day,counts:{1:1},claimed:[],purchases:{}};
 const d=s.daily;d.counts??={1:1};d.claimed=Array.isArray(d.claimed)?d.claimed:[];d.purchases??={};return d;
}
export function recordAction(s,type,now=Date.now()){const d=dayState(s,now);d.counts[type]=Math.max(0,Number(d.counts[type])||0)+1;}
function debit(s,costs){if(!costs.length||costs.some(c=>!Number.isSafeInteger(c.amount)||c.amount<=0||(s.bag[c.id]||0)<c.amount))throw Error('ทรัพยากรไม่เพียงพอ');for(const c of costs)s.bag[c.id]-=c.amount;}
export function offerAvailable(s,o){return !o.show_cond||Number(o.show_cond.lev||0)<=Math.max(...Object.values(s.levels));}
export function buyOffer(s,id,now=Date.now()){
 const o=config.offers.find(x=>x.id===id);if(!o||!offerAvailable(s,o))throw Error('ยังไม่เปิดสินค้า');
 const d=dayState(s,now),bought=Number(d.purchases[id])||0;if(bought>=o.limit_num)throw Error('ซื้อครบจำนวนวันนี้แล้ว');
 const costs=rewards(o.loss);debit(s,costs);s.bag[o.base_id]=(s.bag[o.base_id]||0)+o.num;d.purchases[id]=bought+1;recordAction(s,7,now);return o;
}
export const supportedTaskTypes=[1,7,10,3];
export function claimTask(s,id,now=Date.now()){
 const t=config.tasks.find(x=>x.task_id===id),d=dayState(s,now);
 if(!t||!supportedTaskTypes.includes(t.task_type)||d.claimed.includes(id)||(Number(d.counts[t.task_type])||0)<t.target)throw Error('ยังรับรางวัลภารกิจนี้ไม่ได้');
 const gains=rewards(t.normal_gain);if(!gains.length)throw Error('ไม่พบรางวัลคงที่');for(const g of gains)s.bag[g.id]=(s.bag[g.id]||0)+g.amount;d.claimed.push(id);return gains;
}
export function equipmentSlots(s,id){const all=s.equipment?.[id]||{};return config.equipment_slots.map(x=>({pos:x.pos,item:items[all[x.pos]]||null}));}
export function equip(s,heroId,itemId){
 const item=items[itemId];if(!s.owned.includes(heroId)||!item||item.class!==5||!config.equipment_slots.some(x=>x.pos===item.subclass))throw Error('อุปกรณ์ไม่ถูกต้อง');
 if((s.bag[itemId]||0)<1)throw Error('ไม่มีอุปกรณ์ชิ้นนี้');
 const slots=(s.equipment??={})[heroId]??={};const old=slots[item.subclass];s.bag[itemId]--;if(old)s.bag[old]=(s.bag[old]||0)+1;slots[item.subclass]=itemId;
}
export function unequip(s,heroId,pos){const slots=s.equipment?.[heroId];if(!s.owned.includes(heroId)||!slots?.[pos])throw Error('ช่องนี้ไม่มีอุปกรณ์');const id=slots[pos];s.bag[id]=(s.bag[id]||0)+1;delete slots[pos];}
export function equipmentBonus(s,id){const out={hp:0,atk:0,def:0,mdef:0};for(const {item} of equipmentSlots(s,id))if(item)for(const [k,key] of Object.entries({2:'hp',3:'atk',4:'def',5:'mdef'}))out[key]+=Number(item.attr?.[k]||0);return out;}
export function currentStar(s,h){const n=s.stars?.[h.base_id];return Number.isInteger(n)&&n>=h.star_first&&n<=21?n:h.star_first;}
export function starPlan(s,h){
 const next=currentStar(s,h)+1,rule=rules.hero_star_rules?.[h.realm*10000+next];if(!rule)return null;
 const conds=String(rule.conds||'').split(',').filter(Boolean).map(id=>rules.hero_star_conditions[id]).filter(Boolean);
 const heroLink=config.hero_item_links?.find(x=>x.base_id===h.base_id);
 const costs=rewards(rule.cost),requirements=conds.map(c=>{
  const itemId=c.type===1?heroLink?.item_id:Number(c.replace_goods)||0;
  const reserve=c.type===1&&s.owned.includes(h.base_id)?1:0;
  return {condition:c,itemId,amount:c.num,reserve,have:Math.max(0,(s.bag[itemId]||0)-reserve),label:c.type===1?`ขุนพลเดียวกัน ${c.need_star} ดาว`:c.name};
 });
 return {next,rule,costs,requirements,enabled:!rule.leader_conds&&conds.length>0&&requirements.every(r=>r.itemId&&r.have>=r.amount&&(r.condition.type!==1||r.condition.need_star===h.star_first))&&costs.every(c=>(s.bag[c.id]||0)>=c.amount)};
}
export function raiseStar(s,id){const h=heroes.find(h=>h.base_id===id);if(!h||!s.owned.includes(id))throw Error('ยังไม่มีขุนพลนี้');const p=starPlan(s,h);if(!p?.enabled)throw Error('วัตถุดิบเพิ่มดาวไม่ครบ หรือยังไม่รองรับขุนพลซ้ำระดับนี้');
 const need=new Map();for(const c of [...p.costs,...p.requirements.map(r=>({id:r.itemId,amount:r.amount}))])need.set(c.id,(need.get(c.id)||0)+c.amount);
 for(const [key,n] of need)if((s.bag[key]||0)<n+(p.requirements.some(r=>r.itemId===key&&r.reserve)?1:0))throw Error('วัตถุดิบไม่เพียงพอ');
 for(const [key,n] of need)s.bag[key]-=n;(s.stars??={})[id]=p.next;return p.next;
}
export function totalStats(s,h){const base=heroStats(h,s.levels[h.base_id]||1,s.stages?.[h.base_id]||0),bonus=equipmentBonus(s,h.base_id);return Object.fromEntries(Object.entries(base).map(([k,v])=>[k,v+bonus[k]]));}
export function sanitizeExpanded(s){
 const clean={};for(const id of s.owned){const slots=s.equipment?.[id];if(!slots||typeof slots!=='object')continue;clean[id]={};for(const row of config.equipment_slots){const item=items[slots[row.pos]];if(item?.class===5&&item.subclass===row.pos)clean[id][row.pos]=item.base_id;}}s.equipment=clean;
 const stars={};for(const h of heroes)if(s.owned.includes(h.base_id))stars[h.base_id]=currentStar(s,h);s.stars=stars;
 dayState(s);return s;
}
