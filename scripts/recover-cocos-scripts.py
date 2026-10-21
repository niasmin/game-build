"""Recover Cocos script payloads from the supplied APK, never execute recovered code."""
from elftools.elf.elffile import ELFFile
from pathlib import Path
import zipfile,xxtea,struct,gzip,hashlib,json
import argparse
p=argparse.ArgumentParser(description=__doc__);p.add_argument('apk');p.add_argument('output');args=p.parse_args()
z=zipfile.ZipFile(args.apk)
import io
f=io.BytesIO(z.read('lib/arm64-v8a/libcocos.so'))
elf=ELFFile(f);keyaddr=0x9ca6c9
key=None
for sec in elf.iter_sections():
 if sec['sh_addr']<=keyaddr<sec['sh_addr']+sec['sh_size']:
  key=sec.data()[keyaddr-sec['sh_addr']:keyaddr-sec['sh_addr']+16];break
assert key and len(key)==16
out=Path(args.output);out.mkdir(parents=True,exist_ok=True);records=[]
for n in z.namelist():
 if not n.endswith('.jsc'):continue
 data=z.read(n)
 try:
  raw=xxtea.decrypt(data,key,padding=False)
  length=struct.unpack('<I',raw[-4:])[0]
  if 0<=len(raw)-4-length<=3:raw=raw[:length]
  if raw[:2]==b'\x1f\x8b':raw=gzip.decompress(raw)
  text=raw.decode('utf-8')
  dest=out/Path(n).with_suffix('.js');dest.parent.mkdir(parents=True,exist_ok=True);dest.write_text(text)
  records.append({'member':n,'status':'decoded','bytes':len(raw),'sha256':hashlib.sha256(raw).hexdigest(),'output':str(dest.relative_to(out))})
 except Exception as exc:records.append({'member':n,'status':'failed','error':type(exc).__name__})
(out/'receipt.json').write_text(json.dumps({'method':'ARM64 static loader references 16-byte embedded asset key at virtual address 0x9ca6c9, XXTEA and optional gzip; no target execution','records':records},indent=2))
print('decoded',sum(r['status']=='decoded' for r in records),'of',len(records))
print('main',next(r for r in records if r['member']=='assets/assets/main/index.jsc'))
