"""Generate Japanese TTS recordings using macOS Kyoko and afconvert; no API keys.
Run: python3 scripts/generate-n5-audio.py
"""
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
import json, subprocess, tempfile, hashlib
root=Path(__file__).resolve().parents[1]
path=root/'content/n5/lessons.json'
lessons=json.loads(path.read_text())
out=root/'assets/n5/audio';out.mkdir(parents=True,exist_ok=True)
texts={}
for lesson in lessons:
 for v in lesson['vocabulary']:
  for field,audiofield in [('reading','audio'),('example','exampleAudio')]:
   t=v[field];key=hashlib.sha256(t.encode()).hexdigest()[:16];v[audiofield]=f'/n5/audio/{key}.m4a';texts[key]=t
 for g in lesson['grammar']:
  t=g['example'];key=hashlib.sha256(t.encode()).hexdigest()[:16];g['audio']=f'/n5/audio/{key}.m4a';texts[key]=t

def generate(pair):
 key,t=pair;target=out/(key+'.m4a')
 if target.exists():return
 with tempfile.TemporaryDirectory() as tmp:
  aiff=Path(tmp)/'speech.aiff'
  subprocess.run(['say','-v','Kyoko','-r','155','-o',str(aiff),t],check=True)
  subprocess.run(['afconvert','-f','m4af','-d','aac','-b','64000',str(aiff),str(target)],check=True,capture_output=True)
with ThreadPoolExecutor(max_workers=3) as pool:list(pool.map(generate,texts.items()))
path.write_text(json.dumps(lessons,ensure_ascii=False,indent=2)+'\n')
print(f'Generated {len(texts)} recordings; updated lesson audio paths.')
