'use strict';

/* ═══════════════════════════════════════════
   THISANTHAN M S — PORTFOLIO JS
   - Canvas particle/constellation background
   - Smooth scroll progress bar
   - Slideshow carousel
   - Theme toggle (localStorage)
   - Scroll reveal animations
   - Animated counters
   - Typing effect
   - ZipRAG AI demo (localStorage session db)
═══════════════════════════════════════════ */

// ── STORAGE ──────────────────────────────────
const DB = {
  get(k,fb=null){try{const r=localStorage.getItem(k);return r!==null?JSON.parse(r):fb}catch{return fb}},
  set(k,v){try{localStorage.setItem(k,JSON.stringify(v));return true}catch{return false}},
  push(k,item,max=50){const a=DB.get(k,[]);a.unshift(item);if(a.length>max)a.length=max;DB.set(k,a)},
};
const KEYS={THEME:'ts_theme',HIST:'ts_hist',QALOG:'ts_qalog'};

// ── THEME ────────────────────────────────────
const Theme={
  init(){this.apply(DB.get(KEYS.THEME,'dark'))},
  apply(t){
    document.documentElement.setAttribute('data-theme',t);
    DB.set(KEYS.THEME,t);
    const b=document.getElementById('themeBtn');
    if(b)b.textContent=t==='dark'?'☀️':'🌙';
    Particles.updateColors();
  },
  toggle(){this.apply(document.documentElement.getAttribute('data-theme')==='dark'?'light':'dark')},
};

// ── CANVAS PARTICLES ─────────────────────────
const Particles={
  canvas:null,ctx:null,pts:[],mouse:{x:-1000,y:-1000},raf:null,
  N:90,
  init(){
    this.canvas=document.getElementById('bgCanvas');
    if(!this.canvas)return;
    this.ctx=this.canvas.getContext('2d');
    this.resize();
    window.addEventListener('resize',()=>this.resize());
    window.addEventListener('mousemove',e=>{this.mouse.x=e.clientX;this.mouse.y=e.clientY});
    this.spawn();
    this.tick();
  },
  updateColors(){/* auto via getComputedStyle */},
  resize(){
    if(!this.canvas)return;
    this.canvas.width=window.innerWidth;
    this.canvas.height=window.innerHeight;
  },
  spawn(){
    this.pts=[];
    for(let i=0;i<this.N;i++){
      this.pts.push({
        x:Math.random()*window.innerWidth,
        y:Math.random()*window.innerHeight,
        vx:(Math.random()-.5)*.38,
        vy:(Math.random()-.5)*.38,
        r:Math.random()*1.8+.6,
        o:Math.random()*.5+.2,
      });
    }
  },
  tick(){
    const {canvas,ctx,pts,mouse}=this;
    if(!canvas)return;
    const W=canvas.width,H=canvas.height;
    ctx.clearRect(0,0,W,H);

    const dark=document.documentElement.getAttribute('data-theme')==='dark';
    const ptCol=dark?'rgba(224,112,64,':'rgba(192,82,30,';
    const lineCol=dark?'rgba(224,112,64,':'rgba(192,82,30,';
    const mouseCol=dark?'rgba(90,158,232,':'rgba(37,99,192,';

    // update
    pts.forEach(p=>{
      p.x+=p.vx; p.y+=p.vy;
      if(p.x<0)p.x=W; if(p.x>W)p.x=0;
      if(p.y<0)p.y=H; if(p.y>H)p.y=0;
    });

    // lines between close points
    for(let i=0;i<pts.length;i++){
      for(let j=i+1;j<pts.length;j++){
        const dx=pts[i].x-pts[j].x, dy=pts[i].y-pts[j].y;
        const d=Math.sqrt(dx*dx+dy*dy);
        if(d<130){
          ctx.beginPath();
          ctx.moveTo(pts[i].x,pts[i].y);
          ctx.lineTo(pts[j].x,pts[j].y);
          ctx.strokeStyle=lineCol+((.7-d/130)*.25)+')';
          ctx.lineWidth=.8;
          ctx.stroke();
        }
      }
    }

    // mouse attraction lines
    pts.forEach(p=>{
      const dx=p.x-mouse.x, dy=p.y-mouse.y;
      const d=Math.sqrt(dx*dx+dy*dy);
      if(d<160){
        ctx.beginPath();
        ctx.moveTo(p.x,p.y);
        ctx.lineTo(mouse.x,mouse.y);
        ctx.strokeStyle=mouseCol+((1-d/160)*.35)+')';
        ctx.lineWidth=1;
        ctx.stroke();
      }
    });

    // dots
    pts.forEach(p=>{
      ctx.beginPath();
      ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle=ptCol+p.o+')';
      ctx.fill();
    });

    this.raf=requestAnimationFrame(()=>this.tick());
  },
};

// ── SCROLL PROGRESS ──────────────────────────
const ScrollBar={
  init(){
    const bar=document.getElementById('scrollProgress');
    if(!bar)return;
    window.addEventListener('scroll',()=>{
      const pct=(window.scrollY/(document.body.scrollHeight-window.innerHeight))*100;
      bar.style.width=Math.min(pct,100)+'%';
    },{passive:true});
  },
};

// ── NAVBAR ────────────────────────────────────
const Navbar={
  init(){
    const nav=document.getElementById('navbar');
    if(!nav)return;
    window.addEventListener('scroll',()=>{
      nav.classList.toggle('scrolled',window.scrollY>20);
    },{passive:true});
    const links=document.querySelectorAll('.nav-links a, .mob-menu a');
    const secs=document.querySelectorAll('section[id]');
    const obs=new IntersectionObserver(entries=>{
      entries.forEach(e=>{
        if(e.isIntersecting){
          links.forEach(l=>l.classList.remove('active'));
          document.querySelectorAll(`a[href="#${e.target.id}"]`).forEach(l=>l.classList.add('active'));
        }
      });
    },{rootMargin:'-40% 0px -55% 0px'});
    secs.forEach(s=>obs.observe(s));
  },
};

// ── MOBILE MENU ───────────────────────────────
const MobMenu={
  init(){
    const btn=document.getElementById('menuBtn');
    const menu=document.getElementById('mobMenu');
    if(!btn||!menu)return;
    btn.addEventListener('click',()=>{btn.classList.toggle('open');menu.classList.toggle('open')});
    menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
      btn.classList.remove('open');menu.classList.remove('open');
    }));
  },
};

// ── REVEAL ON SCROLL ──────────────────────────
const Reveal={
  init(){
    const els=document.querySelectorAll('.reveal');
    if(!els.length)return;
    const obs=new IntersectionObserver(entries=>{
      entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('vis');obs.unobserve(e.target)}});
    },{threshold:.1,rootMargin:'0px 0px -30px 0px'});
    els.forEach(el=>obs.observe(el));
  },
};

// ── COUNTERS ─────────────────────────────────
const Counters={
  init(){
    document.querySelectorAll('[data-count]').forEach(el=>{
      const target=+el.dataset.count,suf=el.dataset.suffix||'';
      const obs=new IntersectionObserver(entries=>{
        if(!entries[0].isIntersecting)return;
        obs.unobserve(el);
        let v=0;const step=target/90;
        const t=setInterval(()=>{
          v+=step;
          if(v>=target){el.textContent=target+suf;clearInterval(t);}
          else el.textContent=Math.floor(v)+suf;
        },16);
      },{threshold:.5});
      obs.observe(el);
    });
  },
};

// ── TYPING EFFECT ────────────────────────────
const Typer={
  init(){
    const el=document.getElementById('typed');
    if(!el)return;
    const texts=['Associate Technical Consultant','Data Engineer','Analytics Engineer','Data Analyst','Fabric Developer'];
    let ti=0,ci=0,deleting=false;
    function tick(){
      const txt=texts[ti];
      if(deleting){
        el.textContent=txt.slice(0,ci--);
        if(ci<0){deleting=false;ti=(ti+1)%texts.length;ci=0;setTimeout(tick,500);return;}
      } else {
        el.textContent=txt.slice(0,ci++);
        if(ci>txt.length){deleting=true;setTimeout(tick,2000);return;}
      }
      setTimeout(tick,deleting?55:90);
    }
    setTimeout(tick,800);
  },
};

// ── SLIDESHOW ────────────────────────────────
const Slideshow={
  idx:0,
  slides:[
    {
      label:'Flagship Project',
      title:'ZipRAG — Multi-Format AI Analyzer',
      desc:'Upload any file (CSV, PDF, Excel, DOCX…) and get an instant AI summary plus contextual Q&A — all grounded in your document. Live demo below!',
      tags:['Python','Claude API','RAG','Multi-format','LangChain'],
    },
    {
      label:'Microsoft Fabric',
      title:'Current Focus: Fabric Ecosystem',
      desc:'Building end-to-end lakehouse architectures on OneLake, orchestrating pipelines with Data Factory, and delivering real-time Power BI dashboards.',
      tags:['OneLake','Data Factory','KQL','Spark','Power BI'],
    },
    {
      label:'Domain',
      title:'Finance Analytics & Reporting',
      desc:'Domain-specific financial modelling, automated reconciliation, P&L analysis, and KPI dashboards for enterprise finance teams.',
      tags:['DAX','Excel','Finance KPIs','Power BI','Reporting'],
    },
    {
      label:'Academic Project',
      title:'Data Warehouse Modelling',
      desc:'Star schema design, ETL pipelines, OLAP cubes, and a business reporting layer for a retail domain built on Snowflake + dbt.',
      tags:['Snowflake','dbt','Star Schema','SQL'],
    },
  ],
  init(){
    this.track=document.getElementById('slideTrack');
    this.dotsEl=document.getElementById('slideDots');
    if(!this.track||!this.dotsEl)return;
    this.render();
    document.getElementById('slidePrev')?.addEventListener('click',()=>this.go(-1));
    document.getElementById('slideNext')?.addEventListener('click',()=>this.go(1));
    setInterval(()=>this.go(1),4000);
  },
  render(){
    this.track.innerHTML=this.slides.map(s=>`
      <div class="slide">
        <div class="slide-label">${s.label}</div>
        <div class="slide-title">${s.title}</div>
        <div class="slide-desc">${s.desc}</div>
        <div class="slide-tags">${s.tags.map(t=>`<span class="stag">${t}</span>`).join('')}</div>
      </div>
    `).join('');
    this.dotsEl.innerHTML=this.slides.map((_,i)=>`<div class="sdot${i===0?' active':''}" data-i="${i}"></div>`).join('');
    this.dotsEl.querySelectorAll('.sdot').forEach(d=>d.addEventListener('click',()=>this.set(+d.dataset.i)));
  },
  go(dir){this.set((this.idx+dir+this.slides.length)%this.slides.length)},
  set(i){
    this.idx=i;
    this.track.style.transform=`translateX(-${i*100}%)`;
    this.dotsEl.querySelectorAll('.sdot').forEach((d,j)=>d.classList.toggle('active',j===i));
  },
};

// ── ZIPRAG ────────────────────────────────────
const ZipRAG={
  s:{content:'',name:'',type:'',done:false,busy:false},
  e:{},
  init(){
    const g=id=>document.getElementById(id);
    this.e={
      zone:g('upZone'),inp:g('fileInp'),bar:g('fileBar'),
      fIco:g('fbIco'),fName:g('fbName'),fSize:g('fbSize'),fClr:g('fbClr'),
      sumBox:g('sumBox'),sumTxt:g('sumTxt'),
      qaPanel:g('qaPanel'),qaMsgs:g('qaMsgs'),
      qaIn:g('qaIn'),qaBtn:g('qaBtn'),
      sDot:g('sDot'),sTxt:g('sTxt'),
      histSec:g('histSec'),histList:g('histList'),
    };
    this.bind();
    this.renderHist();
  },
  bind(){
    const{zone,inp,fClr,qaBtn,qaIn}=this.e;
    inp.addEventListener('change',e=>{if(e.target.files[0])this.load(e.target.files[0])});
    zone.addEventListener('dragover',e=>{e.preventDefault();zone.classList.add('drag')});
    zone.addEventListener('dragleave',()=>zone.classList.remove('drag'));
    zone.addEventListener('drop',e=>{
      e.preventDefault();zone.classList.remove('drag');
      if(e.dataTransfer.files[0])this.load(e.dataTransfer.files[0]);
    });
    fClr.addEventListener('click',()=>this.reset());
    qaBtn.addEventListener('click',()=>this.ask());
    qaIn.addEventListener('keydown',e=>{if(e.key==='Enter')this.ask()});
  },
  setStatus(t,c='var(--accent3)'){this.e.sTxt.textContent=t;this.e.sDot.style.background=c},
  ico(n){const m={csv:'📊',xlsx:'📗',xls:'📗',pdf:'📕',txt:'📝',json:'🔢',docx:'📘',md:'📋',xml:'🔖',html:'🌐',tsv:'📊'};return m[n.split('.').pop().toLowerCase()]||'📄'},
  fmt(b){if(b<1024)return b+'B';if(b<1048576)return(b/1024).toFixed(1)+'KB';return(b/1048576).toFixed(1)+'MB'},
  async load(file){
    this.reset(false);
    this.e.zone.style.display='none';
    this.e.bar.classList.add('show');
    this.e.fIco.textContent=this.ico(file.name);
    this.e.fName.textContent=file.name;
    this.e.fSize.textContent=this.fmt(file.size)+' · Reading…';
    Object.assign(this.s,{name:file.name,type:file.name.split('.').pop().toLowerCase()});
    this.setStatus('reading…','var(--accent)');
    try{
      const raw=await new Promise((res,rej)=>{const r=new FileReader();r.onload=e=>res(e.target.result);r.onerror=rej;r.readAsText(file)});
      this.s.content=raw.substring(0,20000);
      this.e.fSize.textContent=this.fmt(file.size)+' · Ready ✓';
      this.setStatus('analyzing…','var(--accent)');
      await this.summarize();
    }catch{this.e.fSize.textContent='Error reading file';this.setStatus('error','#e74c3c')}
  },
  async summarize(){
    const{sumBox,sumTxt,qaPanel}=this.e;
    sumBox.classList.add('show');
    sumTxt.innerHTML='<span class="lds"><span></span><span></span><span></span></span>&nbsp;Analyzing document…';
    const prompt=`You are ZipRAG, an intelligent document analyzer built by Thisanthan M S.\n\nFile: ${this.s.name} (${this.s.type.toUpperCase()})\nContent:\n---\n${this.s.content}\n---\n\nWrite a concise, insightful summary (3-5 sentences, max 130 words). Cover what the document is, key data/topics/insights, and its structure. Be specific.`;
    try{
      const res=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:1000,messages:[{role:'user',content:prompt}]})});
      const data=await res.json();
      const text=data.content?.map(b=>b.text||'').join('')||'Could not generate summary.';
      sumTxt.textContent=text;
      this.s.done=true;this.s.summary=text;
      qaPanel.classList.add('show');
      this.setStatus('ready','var(--accent3)');
      this.addMsg('ai',`✅ Analyzed <strong>${this.s.name}</strong> — ask me anything about it!`);
      DB.push(KEYS.HIST,{id:Date.now(),name:this.s.name,type:this.s.type,summary:text,ico:this.ico(this.s.name),date:new Date().toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})});
      this.renderHist();
    }catch{sumTxt.textContent='⚠ Analysis failed. Check connection.';this.setStatus('error','#e74c3c')}
  },
  async ask(){
    const q=this.e.qaIn.value.trim();
    if(!q||!this.s.content||this.s.busy)return;
    this.s.busy=true;this.e.qaBtn.disabled=true;this.e.qaIn.value='';
    this.setStatus('thinking…','var(--accent)');
    this.addMsg('user',q);
    const ld=this.addMsg('ai','<span class="lds"><span></span><span></span><span></span></span>',true);
    const prompt=`You are ZipRAG. ONLY answer based on the uploaded file content. If not found, say "This information is not found in the uploaded document."\n\nFile: ${this.s.name}\nContent:\n---\n${this.s.content}\n---\n\nQuestion: ${q}\nAnswer:`;
    try{
      const res=await fetch('https://api.anthropic.com/v1/messages',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:1000,messages:[{role:'user',content:prompt}]})});
      const data=await res.json();
      const text=data.content?.map(b=>b.text||'').join('')||'No response.';
      ld.querySelector('.qm-bub').innerHTML=text.replace(/\n/g,'<br>');
      DB.push(KEYS.QALOG,{file:this.s.name,q,a:text,ts:Date.now()});
    }catch{ld.querySelector('.qm-bub').innerHTML='⚠ Error — try again.'}
    finally{
      this.s.busy=false;this.e.qaBtn.disabled=false;
      this.setStatus('ready','var(--accent3)');
      this.e.qaMsgs.scrollTop=this.e.qaMsgs.scrollHeight;
    }
  },
  addMsg(role,html,ret=false){
    const d=document.createElement('div');
    d.className=`qm ${role}`;
    d.innerHTML=`<div class="qm-av">${role==='ai'?'AI':'U'}</div><div class="qm-bub">${html}</div>`;
    this.e.qaMsgs.appendChild(d);
    this.e.qaMsgs.scrollTop=this.e.qaMsgs.scrollHeight;
    return ret?d:undefined;
  },
  renderHist(){
    const{histSec,histList}=this.e;
    const hist=DB.get(KEYS.HIST,[]);
    if(!hist.length){histSec.classList.remove('show');return}
    histSec.classList.add('show');
    histList.innerHTML=hist.slice(0,8).map(h=>`
      <div class="h-item" data-id="${h.id}">
        <span class="h-ico">${h.ico||'📄'}</span>
        <span class="h-txt">${h.name} <span style="color:var(--faint);font-size:.7rem">— ${h.date}</span></span>
        <button class="h-del" data-del="${h.id}" title="Remove">✕</button>
      </div>
    `).join('');
    histList.querySelectorAll('[data-del]').forEach(b=>b.addEventListener('click',e=>{
      e.stopPropagation();
      DB.set(KEYS.HIST,DB.get(KEYS.HIST,[]).filter(h=>h.id!==+b.dataset.del));
      this.renderHist();
    }));
    histList.querySelectorAll('.h-item').forEach(item=>item.addEventListener('click',e=>{
      if(e.target.closest('[data-del]'))return;
      const h=DB.get(KEYS.HIST,[]).find(x=>x.id===+item.dataset.id);
      if(!h)return;
      this.e.sumBox.classList.add('show');this.e.sumTxt.textContent=h.summary;
      this.e.qaPanel.classList.add('show');
      this.e.zone.style.display='none';this.e.bar.classList.add('show');
      this.e.fIco.textContent=h.ico;this.e.fName.textContent=h.name;
      this.e.fSize.textContent=h.date+' · Loaded from history';
      this.e.qaMsgs.innerHTML='';
      this.addMsg('ai',`📂 Loaded session for <strong>${h.name}</strong>. Upload the file again to ask new questions.`);
      this.setStatus('history','var(--accent2)');
      document.getElementById('demo').scrollIntoView({behavior:'smooth'});
    }));
  },
  reset(showUp=true){
    Object.assign(this.s,{content:'',name:'',type:'',done:false,busy:false});
    if(showUp){this.e.zone.style.display='';this.e.inp.value=''}
    this.e.bar.classList.remove('show');
    this.e.sumBox.classList.remove('show');
    this.e.qaPanel.classList.remove('show');
    this.e.qaMsgs.innerHTML='';
    this.e.sumTxt.textContent='';
    this.setStatus('ready','var(--accent3)');
  },
};

// ── SMOOTH SCROLL FOR ANCHORS ─────────────────
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',e=>{
    const t=document.querySelector(a.getAttribute('href'));
    if(t){e.preventDefault();t.scrollIntoView({behavior:'smooth'})}
  });
});

// ── INIT ──────────────────────────────────────
document.addEventListener('DOMContentLoaded',()=>{
  Theme.init();
  Particles.init();
  ScrollBar.init();
  Navbar.init();
  MobMenu.init();
  Reveal.init();
  Counters.init();
  Typer.init();
  Slideshow.init();
  ZipRAG.init();
  document.getElementById('themeBtn')?.addEventListener('click',()=>Theme.toggle());
});
