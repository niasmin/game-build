import test from 'node:test';import assert from 'node:assert/strict';
import {createAdmin,unlockAdmin,createCoupon,verifyCoupon,issuerId,applyCoupon} from './coupons.js';
const items={1:{name:'gold'},2:{name:'coin'}},password='local-test-password-only',now=Date.now();
test('encrypted admin key requires password; signed coupons reject tampering, unknown issuer, expiry and replay',async()=>{
 const admin=await createAdmin(password);assert.equal(JSON.stringify(admin).includes(password),false);await assert.rejects(unlockAdmin(admin,'wrong password'));const key=await unlockAdmin(admin,password),fingerprint=await issuerId(admin.publicKey);
 const code=await createCoupon(key,admin.publicKey,{name:'Gift',expires:now+86400000,rewards:[{id:1,amount:100},{id:2,amount:50}]},items,now);
 await assert.rejects(verifyCoupon(code,[],items,now));const valid=await verifyCoupon(code,[fingerprint],items,now),s={bag:{1:20}};applyCoupon(s,valid,now);assert.equal(s.bag[1],120);assert.equal(s.bag[2],50);const before=JSON.stringify(s);assert.throws(()=>applyCoupon(s,valid,now));assert.equal(JSON.stringify(s),before);
 const parts=code.split('.'),payload=JSON.parse(Buffer.from(parts[1],'base64url'));payload.rewards[0].amount=999;parts[1]=Buffer.from(JSON.stringify(payload)).toString('base64url');await assert.rejects(verifyCoupon(parts.join('.'),[fingerprint],items,now));await assert.rejects(verifyCoupon(code,[fingerprint],items,now+86400001));
 await assert.rejects(createCoupon(key,admin.publicKey,{name:'Invalid',expires:now+1000,rewards:[{id:999,amount:5}]},items,now));await assert.rejects(createCoupon(key,admin.publicKey,{name:'Invalid',expires:now+1000,rewards:[{id:1,amount:1},{id:1,amount:2}]},items,now));
 const full={bag:{1:Number.MAX_SAFE_INTEGER}};assert.throws(()=>applyCoupon(full,valid,now));assert.equal(full.bag[1],Number.MAX_SAFE_INTEGER);assert.equal(full.couponClaims,undefined);
});
