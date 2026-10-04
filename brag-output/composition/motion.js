/* Camera servo adapted from registry ui-focus-zoom. One world transform per camera; authored poses preserve the same product surface between focus states. */
(async function(){
 await document.fonts.ready;
 const tl=gsap.timeline({paused:true});
 const chapters=[['hook',0,6],['editor',6,8],['objects',14,9],['images',23,8],['layouts',31,8],['present',39,8],['modes',47,9],['timer',56,9],['save',65,9],['share',74,11],['outro',85,7]];
 chapters.forEach(([id,t,d])=>{
   const words=document.querySelectorAll('#'+id+' .word');
   words.forEach((w,i)=>tl.fromTo(w,{y:55,opacity:0},{y:0,opacity:1,duration:.48,ease:i%2?'power3.out':'power4.out'},t+.12+i*.065));
   tl.fromTo('#'+id+' .chapter',{x:-32,opacity:0},{x:0,opacity:1,duration:.55,ease:'power2.out'},t+.07);
   tl.fromTo('#'+id+' .chapter-counter',{opacity:0},{opacity:1,duration:.4},t+.5);
 });
 function reveal(target,t,from={},dur=.85){tl.fromTo(target,{y:65,scale:.97,opacity:0,...from},{y:0,x:0,scale:1,opacity:1,rotation:0,rotationY:0,duration:dur,ease:'power3.out'},t)}
 function camera(id,t,s,x,y,d=1.3){tl.to(id,{scale:s,x,y,duration:d,ease:'power2.inOut'},t)}
 function switchShot(id,t){tl.set(id,{opacity:1},t)}
 function click(id,t,x,y,px=x-125,py=y+100){
   tl.fromTo(id,{x:px,y:py,scale:1,opacity:0},{x,y,opacity:1,scale:1,duration:.7,ease:'power3.out'},t-.8);
   tl.to(id,{scale:.82,duration:.075,yoyo:true,repeat:1,ease:'power2.in'},t);
   tl.fromTo(id+'-ring',{x:x-23,y:y-23,scale:.25,opacity:.7},{x:x-23,y:y-23,scale:2.2,opacity:0,duration:.65,ease:'power2.out'},t);
   tl.to(id,{opacity:0,duration:.35},t+1.1);
 }
 // 01 — staggered product surfaces resolve in real perspective.
 ['#hook-a','#hook-b','#hook-c'].forEach((id,i)=>{
   tl.fromTo(id,{x:220,y:90+i*24,z:-180,rotationY:-19,rotation:-5+i*4,opacity:0},{x:0,y:0,z:0,rotationY:0,rotation:i===0?-2:i===1?3:-3,opacity:1,duration:1.1,ease:'power4.out'},.35+i*.18);
   tl.to(id,{y:i%2?-14:18,duration:4.3,ease:'sine.inOut'},1.55);
 });
 reveal('#hook .hero-mark',1.3,{x:-65,y:0},.7);
 tl.fromTo('#hook .hero-sub',{opacity:0},{opacity:1,duration:.7},1.8);
 // 02 — UI establishes, then continuous focus on title and live preview.
 reveal('#editor-ui',6.35,{y:110},.9);
 tl.to('#editor-ui-cam',{scale:1.35,x:-45,y:115,duration:1.1,ease:'power2.inOut'},8.2);
 click('#editor-cursor',9.5,858,543,1100,700);
 switchShot('#editor-typing-blank',9.56);
 switchShot('#editor-typing-1',9.8);
 switchShot('#editor-typing-2',10.2);
 switchShot('#editor-typing-3',10.6);
 switchShot('#editor-after',11.1);
 tl.to('#editor-ui-cam',{scale:1.08,x:0,y:-10,duration:1.25,ease:'power2.inOut'},11.4);
 reveal('#editor .labels',6.8,{y:35},.5);
 // 03 — object vocabulary lands while the camera proves editable controls.
 reveal('#object-ui',14.5,{x:140,y:15},.8);
 document.querySelectorAll('#objects .feature').forEach((e,i)=>tl.fromTo(e,{x:-65,opacity:0},{x:0,opacity:1,duration:.6,ease:i%2?'back.out(1.15)':'power3.out'},14.7+i*.2));
 camera('#object-ui-cam',16,1.7,205,-160,1.35);
 click('#object-cursor',17.7,1315,719,1250,750);
 camera('#object-ui-cam',20.45,1.08,0,-8,1.4);
 // 04 — real image controls plus actual expanded view.
 reveal('#image-settings-ui',23.5,{x:-80,y:15},.85);
 reveal('#image-expanded-ui',24.5,{x:100,y:30},.9);
 camera('#image-settings-ui-cam',23.5,1.5,90,-58,.01);
 camera('#image-expanded-ui-cam',25.8,1.08,0,-4,3.6);
 click('#image-cursor',24.8,405,830,716,790);
 reveal('#images .labels',25.2,{y:30},.5);
 // 05 — three layouts share a gallery; different depths and scale.
 ['#layout-a','#layout-b','#layout-c'].forEach((id,i)=>{
   tl.fromTo(id,{x:i===0?-190:180,y:90,z:-140-i*70,rotationY:i===0?14:-13,opacity:0},{x:0,y:0,z:0,rotationY:0,rotation:i===0?-3:i===1?3:1,opacity:1,duration:1.05,ease:'power3.out'},31.55+i*.19);
   tl.to(id,{y:i%2?-16:18,duration:4.8,ease:'sine.inOut'},33);
 });
 reveal('#layouts .labels',32.7,{y:30},.5);
 // 06 — controls remain real; notes proof panel establishes beside main viewer.
 reveal('#present-ui',39.4,{x:-60,y:30},.8);
 switchShot('#live-content',40.6);
 reveal('#notes-ui',41.85,{x:95,y:15},.65);
 camera('#present-ui-cam',42.7,1.1,0,-10,3.5);
 document.querySelectorAll('#present .pill').forEach((e,i)=>tl.fromTo(e,{y:24,opacity:0},{y:0,opacity:1,duration:.45,ease:'power2.out'},39.9+i*.18));
 // 07 — a page scroll becomes a spatial group gallery.
 reveal('#story-ui',47.35,{x:-120,y:50},.8);

 camera('#story-ui-cam',48.3,1.1,0,-30,2.5);
 tl.to('#story-ui',{scale:.77,x:-126,y:-46,duration:1.1,ease:'power3.inOut'},50.6);
 reveal('#movie-ui',51,{x:140,y:90},1.0);
 click('#movie-cursor',53.1,1194,1005,1280,820);
 camera('#movie-ui-cam',53.5,1.13,-42,-9,2.0);
 reveal('#modes .labels',47.9,{y:40},.6);
 // 08 — timer presets, countdown and add-time state are actual captures.
 reveal('#timer-ui',56.4,{x:105,y:35},.9);
 camera('#timer-ui-cam',56.4,1.27,0,7,.01);
 document.querySelectorAll('#timer .feature').forEach((e,i)=>tl.fromTo(e,{x:-65,opacity:0},{x:0,opacity:1,duration:.6,ease:'power3.out'},57+i*.3));
 click('#timer-cursor',58.3,1149,788,1445,850);
 switchShot('#timer-running',58.4);
 click('#timer-cursor',60.5,1230,788,1420,900);
 click('#timer-cursor',62.4,1452,788,1520,880);
 switchShot('#timer-paused-plus',62.52);
 camera('#timer-ui-cam',63.1,1.18,0,-8,1.2);
 // 09 — local save proof and a separate editable file metaphor.
 reveal('#save-ui',65.4,{x:-80,y:60},.8);
 camera('#save-ui-cam',65.5,1.04,0,0,.01);
 camera('#save-ui-cam',66.4,1.7,-850,100,1.1);
 reveal('#json-file',66,{x:120,y:25},.85);
 click('#save-cursor',67.7,1109,510,1270,740);
 switchShot('#save-status',67.82);
 reveal('#save .labels',66.8,{y:30},.5);
 // 10 — instructions never imply automatic email; process resolves into offline proof.
 document.querySelectorAll('#share .step').forEach((e,i)=>tl.fromTo(e,{x:75,opacity:0},{x:0,opacity:1,duration:.65,ease:'power3.out'},74.6+i*.25));
 reveal('#export-ui',74.9,{y:35},.6);
 camera('#export-ui-cam',74.9,2.4,-850,-5,.01);
 click('#export-cursor',75.2,504,869,615,960);
 tl.to('#share-steps',{y:-55,opacity:0,duration:.5,ease:'power2.in'},79.8);
 tl.fromTo('#offline-ui',{x:130,y:40,opacity:0,scale:.96},{x:0,y:0,opacity:1,scale:1,duration:.95,ease:'power3.out'},80.25);
 tl.fromTo('#offline-copy',{x:-70,opacity:0},{x:0,opacity:1,duration:.8,ease:'power3.out'},80.35);
 camera('#offline-ui-cam',81.6,1.04,0,0,3.1);
 // 11 — final brand and audience hold, no reset or black tail.
 reveal('#outro-ui',85.45,{x:160,y:10},1.0);
 camera('#outro-ui-cam',86.3,1.025,0,0,4.0);
 reveal('#outro .hero-mark',86.1,{x:-60,y:0},.8);
 tl.fromTo('#outro .hero-sub',{opacity:0},{opacity:1,duration:.7},86.6);
 document.querySelectorAll('#outro .pill').forEach((e,i)=>tl.fromTo(e,{y:24,opacity:0},{y:0,opacity:1,duration:.5,ease:'power2.out'},86.8+i*.14));
 // Music analysis is precomputed, never a live audio clock.
 try{
   const data=await fetch('assets/music/audio-data.json').then(r=>r.json());
   const samples=data.frames||[];
   const pulse=document.querySelector('.pulse-line');
   const state={t:0};
   tl.to(state,{t:92,duration:92,ease:'none',onUpdate:()=>{
     const f=samples[Math.min(samples.length-1,Math.floor(state.t*(data.fps||30)))];
     const bass=f?.bands?.[0]||f?.rms||0;
     pulse.style.transform='scaleX('+(1+bass*.20)+')';
     pulse.style.opacity=String(.72+bass*.28);
   }},0);
 }catch(e){console.error('Missing precomputed music analysis',e)}
 window.__timelines['main']=tl;
})();
