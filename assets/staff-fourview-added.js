(()=>{
const cards=[...document.querySelectorAll('.staff-fourview')];if(!cards.length)return;
const mobile=matchMedia('(max-width:700px)'),reduced=matchMedia('(prefers-reduced-motion: reduce)');
const states=cards.map(el=>({el,imgs:[...el.querySelectorAll('.staff-fourview-image')],idx:0,visible:false,hover:false,timer:null,fade:null}));
function stop(s){if(s.timer!==null){clearInterval(s.timer);s.timer=null;}}
function advance(s){if(s.imgs.length<2)return;if(s.fade!==null){clearTimeout(s.fade);s.fade=null;}
const old=s.imgs[s.idx],ni=(s.idx+1)%s.imgs.length,next=s.imgs[ni];
s.imgs.forEach(img=>{img.style.transition='none';img.style.opacity=img===old?'1':'0';img.style.zIndex=img===old?'1':'0';});
next.style.zIndex='2';void next.offsetWidth;next.style.transition='opacity 280ms ease-in-out';next.style.opacity='1';s.idx=ni;
s.fade=setTimeout(()=>{old.style.opacity='0';old.style.zIndex='0';s.fade=null;},300);}
function resetFront(s){
 stop(s);
 if(s.fade!==null){clearTimeout(s.fade);s.fade=null;}
 const front=s.imgs[0];if(!front)return;
 s.imgs.forEach((img,i)=>{img.style.transition='none';img.style.zIndex=i===0?'2':'1';});
 void front.offsetWidth;
 front.style.transition='opacity 280ms ease-in-out';front.style.opacity='1';
 s.imgs.slice(1).forEach(img=>{img.style.transition='opacity 280ms ease-in-out';img.style.opacity='0';});
 s.idx=0;
 }
function sync(s){const play=!document.hidden&&!reduced.matches&&(mobile.matches?s.visible:s.hover);if(!play){stop(s);return;}if(s.timer===null&&s.imgs.length>1)s.timer=setInterval(()=>advance(s),500);}
states.forEach(s=>{s.imgs.forEach((img,i)=>{img.style.transition='none';img.style.opacity=i===0?'1':'0';img.style.zIndex=i===0?'1':'0';img.loading='eager';const pre=new Image();pre.src=img.src;});s.el.addEventListener('mouseenter',()=>{s.hover=true;sync(s)});s.el.addEventListener('mouseleave',()=>{s.hover=false;sync(s);if(!mobile.matches){if(s.fade!==null){clearTimeout(s.fade);s.fade=null;}const front=s.imgs[0];if(front){s.imgs.forEach((img,i)=>{img.style.transition='none';img.style.zIndex=i===0?'2':'1';});void front.offsetWidth;front.style.transition='opacity 280ms ease-in-out';front.style.opacity='1';s.imgs.slice(1).forEach(img=>{img.style.transition='opacity 280ms ease-in-out';img.style.opacity='0';});s.idx=0;}}});});
const obs=new IntersectionObserver(entries=>entries.forEach(e=>{const s=states.find(x=>x.el===e.target);if(!s)return;s.visible=e.intersectionRatio>=.5;sync(s);if(mobile.matches&&!s.visible)resetFront(s);}),{threshold:[0,.5,1]});states.forEach(s=>obs.observe(s.el));
mobile.addEventListener('change',()=>states.forEach(sync));reduced.addEventListener('change',()=>states.forEach(sync));document.addEventListener('visibilitychange',()=>states.forEach(sync));})();
