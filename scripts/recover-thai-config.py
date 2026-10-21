import zipfile,io,json,hashlib
from pathlib import Path
import argparse
p=argparse.ArgumentParser(description='Decode Thai configuration from the supplied Cocos APK without executing it');p.add_argument('apk');p.add_argument('output');a=p.parse_args()
root=Path(a.output);root.mkdir(parents=True,exist_ok=True);out=root/'thai';out.mkdir(exist_ok=True)
z=zipfile.ZipFile(a.apk);t=zipfile.ZipFile(io.BytesIO(z.read('assets/areaCfg/config_th.zip')));manifest=[]
for name in t.namelist():
 if not name.endswith('.bin'):continue
 b=t.read(name);key1=b[4]^ord('{');length=int.from_bytes(bytes(v^key1 for v in b[:4]),'little');key2=b[5]^ord('}' if length==2 else chr(34))
 raw=bytes(v^([key1,key2][i%2]) for i,v in enumerate(b[4:4+length]));
 try:j=json.loads(raw)
 except Exception as e:print("FAILED",name,len(b),length,repr(raw[:30]));continue
 fname=Path(name).stem+'.json';(out/fname).write_text(json.dumps(j,ensure_ascii=False,indent=2))
 keys=sorted({k for section in j.values() if isinstance(section,dict) for row in section.values() if isinstance(row,dict) for k in row})
 manifest.append({'file':fname,'member':name,'sha256':hashlib.sha256(b).hexdigest(),'json_length':length,'sections':list(j),'fields':keys})
(root/'thai-manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2));print('decoded',len(manifest))
