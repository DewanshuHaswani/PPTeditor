from pathlib import Path
import json,html,subprocess
P=Path(__file__).parent
scenes=json.loads((P.parent/'scenes.json').read_text())
def esc(s):return html.escape(str(s),quote=True)
def words(s):return ' '.join('<span class="word">'+esc(x)+'</span>' for x in s.split())
def deck(i,file,cls='',states=None):
    imgs='<img src="assets/captures/'+file+'.png" alt="'+file.replace('-',' ')+'"/>'
    for state in states or []:imgs+='<img id="'+state+'" class="shot-state" src="assets/captures/'+state+'.png" alt="'+state.replace('-',' ')+'"/>'
    return '<div id="'+i+'" class="deck '+cls+'"><div id="'+i+'-cam" class="camera" data-layout-allow-overflow>'+imgs+'</div></div>'
def pills(values):return ''.join('<span class="pill">'+esc(x)+'</span>' for x in values)
def features(values):return '<div class="feature-list">'+''.join('<div class="feature">'+esc(x)+'</div>' for x in values)+'</div>'
def cursor(id):return '<div id="'+id+'" class="cursor" data-layout-ignore><svg viewBox="0 0 40 48"><path d="M3 2 4 36 13 29 21 45 27 42 19 26 31 25Z" fill="#15192b" stroke="#f3f3ef" stroke-width="3" stroke-linejoin="round"/></svg></div><div id="'+id+'-ring" class="ripple" data-layout-ignore></div>'
slots={
'hook':'<div class="hook-stage">'+deck('hook-a','hero','deck-a')+deck('hook-b','layout-bento','deck-b')+deck('hook-c','layout-quote','deck-c')+'</div><div class="hero-mark">All <span>Hands.</span></div><div class="hero-sub">Ideas in motion.</div>',
'editor':deck('editor-ui','editor-before','main-screen',['editor-typing-blank','editor-typing-1','editor-typing-2','editor-typing-3','editor-after'])+'<div class="labels">'+pills(['Edit your story','Live preview'])+'</div>'+cursor('editor-cursor'),
'objects':features(['Text & bullets','Metrics & quotes','Images','Resize · reorder · hide'])+deck('object-ui','objects','object-screen')+cursor('object-cursor'),
'images':deck('image-settings-ui','image-settings','settings-screen')+deck('image-expanded-ui','image-expanded','expanded-screen')+'<div class="labels">'+pills(['Upload','Crop or contain','Open for detail'])+'</div>'+cursor('image-cursor'),
'layouts':'<div class="gallery">'+deck('layout-a','layout-update','gallery-a')+deck('layout-b','layout-quote','gallery-b')+deck('layout-c','layout-quiz','gallery-c')+'</div><div class="labels">'+pills(['Layouts','Themes','Sections'])+'</div>',
'present':deck('present-ui','hero','present-screen',['live-content'])+deck('notes-ui','live-notes','notes-screen')+'<div class="labels">'+pills(['← → Navigate','N  Notes','F  Fullscreen','B  Blank screen','Clock + elapsed'])+'</div>',
'modes':deck('story-ui','story','story-screen',['story-scrolled'])+deck('movie-ui','movie','movie-screen')+'<div class="labels">'+pills(['Story view','Movie mode'])+'</div>'+cursor('movie-cursor'),
'timer':features(['Presets or custom time','Pause · resume · restart','Add 30 seconds'])+deck('timer-ui','timer-before','timer-screen',['timer-running','timer-paused-plus'])+cursor('timer-cursor'),
'save':deck('save-ui','save-before','save-screen',['save-status'])+'<div id="json-file" class="file-card"><div class="file-icon">{ }</div><div class="filename">presentation.json</div><div class="copy">Your editable local copy</div><span class="pill accent">Saved locally</span></div><div class="labels">'+pills(['Undo','Redo','Export JSON','Import'])+'</div>'+cursor('save-cursor'),
'share':'<div id="share-steps" class="steps"><div class="step"><span class="num">01</span><h3>Export a web ZIP</h3><p>Attach your entire deck to an email.</p><span class="arrow" data-layout-allow-overflow>→</span></div><div class="step"><span class="num">02</span><h3>Extract the folder</h3><p>The recipient unzips the attachment.</p><span class="arrow" data-layout-allow-overflow>→</span></div><div class="step"><span class="num">03</span><h3>Double-click to open</h3><p>Open Presentation.html</p></div></div>'+deck('offline-ui','offline','offline-screen')+'<div id="offline-copy" class="offline-copy"><h3>Live. Even offline.</h3><p class="copy">Images and presentation modes. All in the same package.</p><span class="pill accent">No connection needed</span></div>'+deck('export-ui','export-action','export-proof')+cursor('export-cursor'),
'outro':deck('outro-ui','hero','outro-screen')+'<div class="hero-mark">All <span>Hands.</span></div><div class="hero-sub">Make your next presentation one they remember.</div><div class="labels">'+pills(['Teams','Teachers','Creators'])+'</div>'
}
chunks=[]
for n,s in enumerate(scenes):
    chunks.append(f'<section id="{s["id"]}" class="scene clip {s["id"]}" data-start="{s["start"]}" data-duration="{s["duration"]}" data-track-index="1"><div class="chapter">{n+1:02d} / '+{'hook':'Meet All Hands','editor':'The editor','objects':'Objects','images':'Your visuals','layouts':'Shape your story','present':'Live presentation','modes':'Presentation modes','timer':'Session tools','save':'Local saving','share':'Portable sharing','outro':'Your next presentation'}[s['id']]+'</div><h1 class="headline">'+words(s['headline'])+'</h1>'+slots[s['id']]+f'<div class="chapter-counter">{n+1:02d} / 11</div></section>')
auto={'version':1,'lanes':[{'target':'volume','points':[{'t':0,'v':0},{'t':.65,'v':.26},{'t':89,'v':.26},{'t':92,'v':0}]}]}
audio='<audio id="music-bed" src="assets/music/bed.mp3" data-start="0" data-duration="92" data-track-index="3" data-volume="0.26" data-automation="'+esc(json.dumps(auto,separators=(',',':')))+'"></audio>\n'
for s in scenes:
    file=P/'assets'/'voice'/f'{s["id"]}.wav'
    dur=s['duration']-.6
    if file.exists():dur=float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','csv=p=0',str(file)]))
    audio+=f'<audio id="voice-{s["id"]}" data-audio-group="voiceover" src="assets/voice/{s["id"]}.wav" data-start="{s["start"]+.18}" data-duration="{dur}" data-track-index="4" data-volume="0.95"></audio>\n'
sfx=[]
for t in [0.18,6,14.2,23,31,39,47,56,65,74,85]:sfx.append(('impact',t,.18,.28))
for t in [.55,.88,1.15,14.7,15.15,15.6,23.55,31.6,31.82,32.05,47.4,51,65.7,75.2,75.45,75.7,85.6]:sfx.append(('slide',t,.43,.16))
for t in [9.5,9.66,9.82,10.0,10.2,10.44,10.7,17.7,24.8,42,53.1,58.3,60.5,62.4,67.7,75.2]:sfx.append(('click',t,.025,.42))
for t in [68.3,80.7,89]:sfx.append(('confirm',t,1.1,.1))
for i,(name,t,d,v) in enumerate(sfx):audio+=f'<audio id="sfx-{i}" src="assets/sfx/{name}.ogg" data-start="{t}" data-duration="{d}" data-track-index="{5+i}" data-volume="{v}"></audio>\n'
source='<!doctype html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=1920,height=1080"><title>All Hands — Ideas in motion</title><link rel="stylesheet" href="style.css"><script src="assets/runtime/gsap.min.js"></script></head><body><div id="root" data-composition-id="main" data-duration="92" data-width="1920" data-height="1080" data-fps="30"><div class="paper" data-layout-ignore></div><div class="brand">All <span>Hands.</span></div><div class="series">IDEAS IN MOTION</div><div class="stage-line" data-layout-ignore></div><div class="pulse-line" data-layout-ignore></div>'+''.join(chunks)+audio+'</div><script>'+(P/'motion.js').read_text()+'</script></body></html>'
old=P/'index.html'
if old.exists():
    import re
    oldbed=re.search(r'<audio id="music-bed"[^>]*>',old.read_text())
    if oldbed and 'data-fx-carve' in oldbed.group(0):
        source=re.sub(r'<audio id="music-bed"[^>]*>',lambda _:oldbed.group(0),source,count=1)
(P/'index.html').write_text(source)
