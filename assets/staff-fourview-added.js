(()=>{
  const frames=[...document.querySelectorAll('.staff-fourview')];
  if(!frames.length)return;
  const mobile=window.matchMedia('(max-width:700px)');
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  const states=frames.map(frame=>({frame,images:[...frame.querySelectorAll('.staff-fourview-image')],index:0,visible:false,hovered:false,timer:null}));
  function stop(s){if(s.timer!==null){clearInterval(s.timer);s.timer=null;}}
  function sync(s){
    const shouldPlay=!document.hidden&&!reduced.matches&&(mobile.matches?s.visible:s.hovered);
    if(!shouldPlay){stop(s);return;}
    if(s.timer!==null||s.images.length<2)return;
    s.timer=setInterval(()=>{
      if(document.hidden)return;
      s.images[s.index].classList.remove('is-visible');
      s.index=(s.index+1)%s.images.length;
      s.images[s.index].classList.add('is-visible');
    },500);
  }
  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      const s=states.find(item=>item.frame===entry.target);
      if(!s)return;
      s.visible=entry.isIntersecting&&entry.intersectionRatio>=0.5;
      sync(s);
    });
  },{threshold:[0,0.5,1]});
  states.forEach(s=>{
    observer.observe(s.frame);
    s.frame.addEventListener('pointerenter',e=>{if(e.pointerType==='mouse'){s.hovered=true;sync(s);}});
    s.frame.addEventListener('pointerleave',()=>{s.hovered=false;sync(s);});
  });
  mobile.addEventListener('change',()=>states.forEach(sync));
  reduced.addEventListener('change',()=>states.forEach(sync));
  document.addEventListener('visibilitychange',()=>states.forEach(sync));
})();
