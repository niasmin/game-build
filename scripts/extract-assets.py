"""Extract selected APK art; requires Pillow and texture2ddecoder. Never executes APK code."""
import base64, hashlib, io, json, sys, uuid, zipfile
from pathlib import Path
import texture2ddecoder
from PIL import Image
apk=Path(sys.argv[1]); root=Path(__file__).resolve().parents[1]
out=root/'public/assets/original';out.mkdir(parents=True,exist_ok=True)
z=zipfile.ZipFile(apk); names=set(z.namelist()); receipt=[]
def expand(s):
 return str(uuid.UUID(s[:2]+base64.b64decode(s[2:]+'==').hex())) if len(s)==22 else s
picks=[]
for bundle in ['jspre','exresdir']:
 c=json.loads(z.read(f'assets/assets/{bundle}/cc.config.json'))
 count=0
 for k,v in c['paths'].items():
  if c['types'][v[1]]!='cc.ImageAsset':continue
  logical=v[0]
  target=None
  if logical=='ui/login/cnl/1-1':target='login-background.png'
  if logical=='ui/login/cnl/logo':target='logo.png'
  if logical.startswith('hricon/') and count<6:target=f'hero-{count}.png';count+=1
  if target:
   u=expand(c['uuids'][int(k)])
   found=next((f'assets/assets/{bundle}/native/{u[:2]}/{u}{ext}' for ext in ['.png','.jpg','.astc'] if f'assets/assets/{bundle}/native/{u[:2]}/{u}{ext}' in names),None)
   if found:picks.append((logical,found,target))
for logical,member,target in picks:
 data=z.read(member)
 if member.endswith('.astc'):
  if data[:4]!=b'\x13\xab\xa1\x5c':raise ValueError('invalid ASTC magic')
  bx,by,bz=data[4:7];w=int.from_bytes(data[7:10],'little');h=int.from_bytes(data[10:13],'little')
  if bz!=1:raise ValueError('unsupported ASTC depth')
  pixels=texture2ddecoder.decode_astc(data[16:],w,h,bx,by)
  img=Image.frombytes('RGBA',(w,h),pixels,'raw','BGRA')
 else:img=Image.open(io.BytesIO(data)).convert('RGBA')
 img.save(out/target)
 receipt.append({'output':target,'source':member,'logical_path':logical,'source_sha256':hashlib.sha256(data).hexdigest(),'output_sha256':hashlib.sha256((out/target).read_bytes()).hexdigest(),'size':list(img.size)})
(out/'provenance.json').write_text(json.dumps({'apk_sha256':hashlib.file_digest(apk.open('rb'),'sha256').hexdigest(),'note':'Art extracted from user-supplied APK. Original hero identities are not verified. No third-party relicensing is implied.','assets':receipt},indent=2))
print(json.dumps(receipt,indent=2))
