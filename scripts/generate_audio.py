from pathlib import Path
import os, json, subprocess, sys
import argparse
parser=argparse.ArgumentParser(description='Render authored English/Hindi narration with the established local Kokoro voices.')
parser.add_argument('source',type=Path)
parser.add_argument('output',type=Path)
parser.add_argument('--model-cache',type=Path,required=True)
args=parser.parse_args()
os.environ['HF_HOME']=str(args.model_cache.resolve())
os.environ.setdefault('HF_HUB_OFFLINE','1')
os.environ['HF_HUB_DISABLE_XET']='1'
import espeakng_loader
os.environ['PHONEMIZER_ESPEAK_LIBRARY']=espeakng_loader.get_library_path()
os.environ['ESPEAK_DATA_PATH']=espeakng_loader.get_data_path()
import torch,numpy as np,soundfile as sf
torch.set_num_threads(4)
from kokoro import KPipeline
p=KPipeline(lang_code='a',repo_id='hexgrad/Kokoro-82M',device='cpu')
h=KPipeline(lang_code='h',repo_id='hexgrad/Kokoro-82M',model=p.model)
items=json.loads(args.source.read_text())
out=args.output;out.mkdir(parents=True,exist_ok=True)
report=json.loads((out/'report.json').read_text()) if (out/'report.json').exists() else {}
for i,(key,(old,text)) in enumerate(items.items()):
 target=out/(key+'.m4a')
 if target.exists() and key in report:continue
 hindi=old=='Lekha'
 if hindi:
  for letter,name in {'C':'सी','D':'डी','F':'एफ','R':'आर','E':'ई','L':'एल'}.items():text=text.replace(letter+' वाला',name+' वाला')
 voice='hf_alpha' if hindi else 'af_heart'
 pipe=h if hindi else p
 chunks=[a.numpy() for _,_,a in pipe(text,voice=voice,speed=.9)]
 audio=np.concatenate(chunks)
 assert np.isfinite(audio).all() and len(audio)>2400,key
 peak=float(np.max(np.abs(audio)))
 audio=audio*min(1,.88/max(peak,.0001))
 wav=out/(key+'.wav');sf.write(wav,audio,24000)
 subprocess.run(['afconvert','-f','m4af','-d','aac','-b','64000',str(wav),str(target)],check=True)
 report[key]={'text':text,'voice':voice,'seconds':len(audio)/24000}
 print(i+1,len(items),key,round(len(audio)/24000,2),flush=True)
 (out/'report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
(out/'report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
