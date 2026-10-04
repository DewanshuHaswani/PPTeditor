import { chromium } from 'playwright';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import { unzipSync } from 'fflate';
const root=process.cwd(); const out=path.join(root,'brag-output/composition/assets/captures'); const temp='/private/tmp/ahm-launch-demo';
await mkdir(out,{recursive:true});await mkdir(temp+'/.local',{recursive:true});
const artwork='data:image/png;base64,'+(await readFile('brag-output/composition/assets/artwork/ideas-in-motion.png')).toString('base64');
const image={id:'studio-image',src:artwork,title:'Ideas in motion',subtitle:'A visual direction for our next chapter',caption:'Ideas in motion',details:'An exploration of form, light, and new perspectives. Open the image to share the full creative direction.',fit:'cover',position:'center',expandable:true};
const section=(id,title,layout,blocks,extra={})=>({id,title,layout,visible:true,fullSlide:true,blocks,text:'',bullets:[],images:[],...extra});
const deck={eventTitle:'Ideas in motion',groupName:'Creative workshop',date:'Your next chapter',kahootLink:'https://kahoot.com',slides:[
{id:'welcome',type:'title',title:'Your next big idea',subtitle:'A creative workshop',theme:'indigo',heroImage:artwork,notes:'Welcome the room. Today we turn ideas into a shared direction.'},
{id:'build',type:'content',title:'From thought to possibility',subtitle:'Every piece tells part of the story',theme:'teal',sections:[section('pieces','The building blocks','bento',[
{id:'text',type:'text',title:'The idea',role:'summary',text:'Make space for fresh perspectives. Give every idea a clear place to begin.',size:'normal',textSize:'md'},
{id:'bullets',type:'bullets',title:'Our next steps',bullets:['Explore together','Shape the direction','Share what matters'],size:'normal',textSize:'md'},
{id:'metric',type:'metric',title:'A focused session',metricValue:'30',text:'Minutes to discover what comes next',size:'normal',textSize:'lg'},
{id:'quote',type:'quote',title:'Our starting point',text:'The best ideas begin with a better question.',size:'normal',textSize:'md'}])]},
{id:'visual',type:'content',title:'A new perspective',subtitle:'Make your visuals part of the conversation',theme:'warm',sections:[section('visual-section','The creative direction','business-update',[
{id:'visual-text',type:'text',title:'The direction',role:'summary',text:'Give your next idea a shape. Bring form, light, and texture into the conversation.',size:'normal',textSize:'md'},
{id:'visual-image',type:'image',title:'Ideas in motion',caption:'Ideas in motion',image,size:'hero',textSize:'md'}],{businessUpdateVersion:3})]},
{id:'design',type:'group',groupName:'Design Team',title:'Design Team',subtitle:'Progress worth sharing',theme:'purple',sections:[section('design-progress','Design Team','business-update',[
{id:'design-text',type:'text',title:'Our direction',role:'summary',text:'A clearer story. A stronger visual language. A shared next step.',size:'normal'},
{id:'design-bullets',type:'bullets',title:'This week',bullets:['Explore the visual direction','Refine the workshop story','Share the next iteration'],details:['Gather diverse perspectives and test the strongest ideas.','Make every moment clear and easy to understand.','Invite feedback and keep the direction visible.'],size:'wide'}],{businessUpdateVersion:3})]},
{id:'product',type:'group',groupName:'Product Team',title:'Product Team',theme:'blue',sections:[section('product-progress','Product Team','bento',[
{id:'product-text',type:'text',title:'The next chapter',text:'Turn the shared direction into a practical plan.',size:'normal'},
{id:'product-metric',type:'metric',title:'Next priorities',metricValue:'03',text:'Explore. Build. Learn.',size:'normal'},
{id:'product-quote',type:'quote',title:'Our focus',text:'Progress becomes clearer when everyone can see it.',size:'wide'}])]},
{id:'quote-slide',type:'quote',title:'A moment to reflect',body:'Great ideas grow when we share them.',theme:'blue',notes:'Invite the audience to name an idea they want to explore.'},
{id:'quiz-slide',type:'quiz',title:'Ask the room',subtitle:'A quick interactive moment',question:'What would you explore next?',buttonText:'Start Quiz',link:'https://kahoot.com',theme:'purple'},
{id:'activity',type:'activity',title:'Make room for ideas',subtitle:'A team activity',theme:'green',sections:[section('activity-steps','Try it together','steps',[],{text:'Choose a challenge. Share a fresh perspective. Find one next step.',bullets:['Choose a challenge','Share a fresh perspective','Find one next step']})]},
{id:'timer-slide',type:'timer',title:'A minute for your next idea',subtitle:'Think. Share. Build.',theme:'navy'},
{id:'close',type:'thanks',title:'Make it memorable.',subtitle:'Your next chapter starts here.',theme:'indigo'}]};
await writeFile(temp+'/.local/presentation.json',JSON.stringify(deck));
await writeFile('brag-output/demo-presentation.json',JSON.stringify({...deck,slides:deck.slides.map(s=>({...s,heroImage:s.heroImage===artwork?'composition/assets/artwork/ideas-in-motion.png':s.heroImage,sections:s.sections?.map(sec=>({...sec,blocks:sec.blocks.map(b=>b.image?{...b,image:{...b.image,src:'composition/assets/artwork/ideas-in-motion.png'}}:b)}))}))},null,2));
const port=5191,url=`http://127.0.0.1:${port}`;
const server=spawn(process.execPath,['node_modules/vite/bin/vite.js','preview','--host','127.0.0.1','--port',String(port),'--strictPort'],{env:{...process.env,AHM_DATA_ROOT:temp},stdio:'pipe'});
let output='';server.stderr.on('data',b=>output+=b);server.stdout.on('data',b=>output+=b);
let browser;const manifest={viewport:{width:1920,height:1080},fictionalDemo:true,captures:{},errors:[]};
try{
for(let i=0;i<100;i++){try{if((await fetch(url)).ok)break;}catch{}await new Promise(r=>setTimeout(r,100));}
browser=await chromium.launch({headless:true,executablePath:'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'});
const context=await browser.newContext({viewport:manifest.viewport,acceptDownloads:true});const page=await context.newPage();page.setDefaultTimeout(60000);page.on('pageerror',e=>manifest.errors.push(e.message));
const shot=async(name,description,targets={})=>{await page.waitForTimeout(900);manifest.captures[name]={file:`${name}.png`,description,targets:{}};for(const[k,loc]of Object.entries(targets)){const b=await loc.boundingBox();if(b)manifest.captures[name].targets[k]={...b,cx:b.x+b.width/2,cy:b.y+b.height/2};}await page.screenshot({path:path.join(out,`${name}.png`)});console.log('Captured',name);};
await page.goto(url+'/edit');await page.getByLabel('Title',{exact:true}).waitFor();await page.waitForTimeout(1800);
await shot('editor-before','Initial title selected, live preview beside real editing controls',{title:page.getByLabel('Title',{exact:true}),save:page.getByRole('button',{name:'Save to Local File',exact:true}).first()});
await page.getByLabel('Title',{exact:true}).fill('');await page.getByLabel('Title',{exact:true}).pressSequentially('Ideas in motion',{delay:120});await page.getByLabel('Title',{exact:true}).blur();
await shot('editor-after','Title edited, live preview updated',{title:page.getByLabel('Title',{exact:true})});
await page.getByRole('button',{name:/From thought to possibility content/}).click();await page.getByText('Object Editor',{exact:true}).scrollIntoViewIfNeeded();
await shot('objects','Real object editor with conversion, sizing, visibility and order controls',{convert:page.getByLabel('Convert Type',{exact:true}).first(),size:page.getByLabel('Object Size',{exact:true}).first(),text:page.getByRole('button',{name:'Text',exact:true}).first()});
await page.getByRole('button',{name:/A new perspective content/}).click();await page.getByLabel('Image Fit',{exact:true}).scrollIntoViewIfNeeded();
await page.locator('input[type=file][accept="image/*"]').first().setInputFiles('brag-output/composition/assets/artwork/ideas-in-motion.png');
await page.getByLabel('Image Fit',{exact:true}).selectOption('cover');await page.getByLabel('Crop Position',{exact:true}).selectOption('center');
await shot('image-settings','Actual uploaded image fit, crop and expansion controls',{fit:page.getByLabel('Image Fit',{exact:true}),crop:page.getByLabel('Crop Position',{exact:true}),upload:page.getByText('Upload Image',{exact:true}).first()});
await page.evaluate(()=>window.scrollTo(0,0));await page.getByRole('button',{name:'Save to Local File',exact:true}).first().click();await page.getByText('Saved on disk · .local/presentation.json',{exact:true}).first().waitFor();
await shot('save-status','Actual local disk save confirmation',{save:page.getByRole('button',{name:'Save to Local File',exact:true}).first(),undo:page.getByRole('button',{name:'Undo',exact:true}),redo:page.getByRole('button',{name:'Redo',exact:true})});
await shot('export-action','Export Web ZIP button in real editor toolbar',{export:page.getByRole('button',{name:'Export Web ZIP',exact:true})});
const downloadPromise=page.waitForEvent('download');await page.getByRole('button',{name:'Export Web ZIP',exact:true}).click();const dl=await downloadPromise;await dl.saveAs(temp+'/demo.zip');const zipped=unzipSync(await readFile(temp+'/demo.zip'));await writeFile(temp+'/Open Presentation.html',zipped['Open Presentation.html']);
await page.goto(url+'/present');await page.getByLabel('Jump to slide').waitFor();await page.waitForTimeout(2800);await shot('hero','Actual live title deck, fictional workshop',{next:page.getByLabel('Next slide')});
await page.getByLabel('Jump to slide').selectOption('1');await page.waitForTimeout(2000);await shot('layout-bento','Text bullets metrics and quote arranged in actual bento layout');
await page.getByLabel('Jump to slide').selectOption('2');await page.waitForTimeout(1800);await shot('image-slide','Generated artwork in actual live presentation',{image:page.locator('figure').first()});
await page.locator('figure').first().click();await page.getByRole('dialog',{name:'Expanded content'}).waitFor();await shot('image-expanded','Actual image detail overlay opened');await page.keyboard.press('Escape');
await page.getByLabel('Jump to slide').selectOption('3');await page.waitForTimeout(1800);await shot('layout-update','Actual business update layout, fictional Design Team');
await page.getByLabel('Jump to slide').selectOption('5');await page.waitForTimeout(1800);await shot('layout-quote','Actual quote slide');
await page.getByLabel('Jump to slide').selectOption('6');await page.waitForTimeout(1800);await shot('layout-quiz','Actual quiz slide with link');
await page.getByLabel('Jump to slide').selectOption('7');await page.waitForTimeout(1800);await shot('layout-activity','Actual activity steps slide');
await page.getByLabel('Jump to slide').selectOption('0');await page.getByRole('button',{name:'Notes',exact:true}).click();await shot('live-notes','Actual notes dialog and presentation toolbar');await page.keyboard.press('Escape');
await page.getByRole('button',{name:'Story',exact:true}).click();await page.getByText('Scroll to move through FlowArt slides').waitFor();await page.mouse.wheel(0,1080);await page.waitForTimeout(1600);await shot('story','Actual Story scrolling view');
await page.getByRole('button',{name:'Presentation',exact:true}).click();await page.getByRole('button',{name:'Movie',exact:true}).click();await page.getByText('Movie Mode',{exact:true}).waitFor();await page.waitForTimeout(2500);await shot('movie','Actual Movie group selection gallery',{design:page.locator('[data-movie-target="design"]')});await page.keyboard.press('Escape');
await page.getByLabel('Jump to slide').selectOption('8');await page.getByRole('button',{name:'1 min',exact:true}).click();await shot('timer-before','One-minute timer ready',{start:page.getByRole('button',{name:'Start',exact:true})});
await page.getByRole('button',{name:'Start',exact:true}).click();await page.waitForTimeout(1500);await shot('timer-running','Timer running',{pause:page.getByRole('button',{name:'Pause',exact:true})});await page.getByRole('button',{name:'Pause',exact:true}).click();await page.getByRole('button',{name:'+30 sec',exact:true}).click();await shot('timer-paused-plus','Paused timer after adding thirty seconds',{resume:page.getByRole('button',{name:'Start',exact:true}),plus:page.getByRole('button',{name:'+30 sec',exact:true})});
const offline=await browser.newContext({viewport:manifest.viewport,offline:true});const offpage=await offline.newPage();offpage.on('pageerror',e=>manifest.errors.push(e.message));await offpage.goto(pathToFileURL(temp+'/Open Presentation.html').href);await offpage.getByLabel('Jump to slide').waitFor();await offpage.waitForTimeout(2700);await offpage.screenshot({path:path.join(out,'offline.png')});manifest.captures.offline={file:'offline.png',description:'Exported HTML opened via file URL with network offline; no server required'};console.log('Captured offline');
await writeFile(path.join(out,'manifest.json'),JSON.stringify(manifest,null,2));if(manifest.errors.length)throw new Error(JSON.stringify(manifest.errors));
}finally{await browser?.close();server.kill('SIGTERM');}
