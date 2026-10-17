(()=>{'use strict';if(new URLSearchParams(location.search).get('preview')!=='1')return;
const style=document.createElement('style');document.head.append(style);let mode='desktop',state={},filter='all',active=null;
function css(){let s='';for(const [k,v] of Object.entries(state[mode]||{})){const [b,p]=k.split('-');s+=`.gallery-page .collage-board-${b} .collage-p${p}{left:${v.l}%!important;top:${v.t}%!important;width:${v.w}%!important;height:${v.h}%!important}\n`}style.textContent=s}
window.addEventListener('message',e=>{if(e.source!==parent||e.data?.type!=='noii-editor-state')return;state=e.data.data;mode=e.data.mode;filter=e.data.board;css();document.querySelectorAll('.collage-board').forEach((b,i)=>b.style.display=filter==='all'||filter===String(i+1)?'':'none')});
const editstyle=document.createElement('style');editstyle.textContent=`.gallery-page .collage-photo{cursor:move!important;touch-action:none;outline:1px dashed #c63b3980;overflow:visible!important}.gallery-page .collage-photo a{pointer-events:none!important}.gallery-page .collage-photo:hover{outline:2px solid #dc5547!important}.ed-handle{position:absolute;right:-9px;bottom:-9px;width:19px;height:19px;background:#d64a40;border:2px solid white;border-radius:50%;cursor:nwse-resize;z-index:30;touch-action:none}.gallery-page .collage-photo img{pointer-events:none}.gallery-header{position:relative!important}`;document.head.append(editstyle);
const boards=[...document.querySelectorAll('.collage-board')];
boards.forEach((board,bi)=>[...board.querySelectorAll('.collage-photo')].forEach((photo,pi)=>{
const handle=document.createElement('span');handle.className='ed-handle';photo.append(handle);const key=`${bi+1}-${pi+1}`;
photo.addEventListener('pointerdown',e=>{if(e.button!==0)return;e.preventDefault();e.stopPropagation();const rect=board.getBoundingClientRect(), pr=photo.getBoundingClientRect();const start={l:100*(pr.left-rect.left)/rect.width,t:100*(pr.top-rect.top)/rect.height,w:100*pr.width/rect.width,h:100*pr.height/rect.height};const x=e.clientX,y=e.clientY,resize=e.target===handle;active={photo,key,rect,start,x,y,resize};photo.setPointerCapture(e.pointerId)});
photo.addEventListener('pointermove',e=>{if(!active||active.photo!==photo)return;const a=active,dx=100*(e.clientX-a.x)/a.rect.width,dy=100*(e.clientY-a.y)/a.rect.height;const v={...a.start};if(a.resize){v.w=Math.max(5,v.w+dx);v.h=Math.max(5,v.h+dy)}else{v.l+=dx;v.t+=dy}for(const k of Object.keys(v))v[k]=Math.round(v[k]*100)/100;state[mode][key]=v;css()});
function finish(){if(!active||active.photo!==photo)return;parent.postMessage({type:'noii-editor-update',mode,key,value:state[mode][key]},'*');active=null}
photo.addEventListener('pointerup',finish);photo.addEventListener('pointercancel',finish);
}));
})();
