
const pages=[...document.querySelectorAll('[data-page]')];
const tabs=[...document.querySelectorAll('[data-page-target]')];
function openPage(name,anchor){
  pages.forEach(p=>p.classList.toggle('is-page-active',p.dataset.page===name));
  tabs.forEach(t=>t.classList.toggle('active',t.dataset.pageTarget===name));
  if(location.hash!==`#${name}` && !anchor) history.pushState(null,'',`#${name}`);
  requestAnimationFrame(()=>{ if(anchor){document.getElementById(anchor)?.scrollIntoView({behavior:'smooth',block:'start'});} else window.scrollTo({top:0,behavior:'instant'}); updateProgress(); });
}
document.addEventListener('click',e=>{
 const b=e.target.closest('[data-open-page]'); if(b){openPage(b.dataset.openPage);return;}
 const t=e.target.closest('[data-page-target]'); if(t){openPage(t.dataset.pageTarget);return;}
});
function fromHash(){const h=location.hash.slice(1); if(!h){openPage('home');return;} const direct=pages.find(p=>p.dataset.page===h); if(direct){openPage(h);return;} const target=document.getElementById(h); if(target){const pg=target.closest('[data-page]'); openPage(pg.dataset.page,h);return;} openPage('home');}
window.addEventListener('popstate',fromHash); window.addEventListener('DOMContentLoaded',fromHash);
function updateProgress(){const p=document.querySelector('.page.is-page-active'); if(!p)return; const r=p.getBoundingClientRect(); const total=Math.max(1,p.scrollHeight-innerHeight); const done=Math.min(1,Math.max(0,-r.top/total)); document.getElementById('readingProgress').style.width=(done*100)+'%';}
addEventListener('scroll',updateProgress,{passive:true});addEventListener('resize',updateProgress);
const panel=document.getElementById('searchPanel'),toggle=document.getElementById('searchToggle'),input=document.getElementById('searchInput'),results=document.getElementById('searchResults'); let idx=[];
fetch('search-index.json').then(r=>r.json()).then(d=>idx=d);
toggle.addEventListener('click',()=>{panel.classList.toggle('open'); if(panel.classList.contains('open'))input.focus();});
input.addEventListener('input',()=>{const q=input.value.trim().toLocaleLowerCase('tr-TR'); if(q.length<2){results.innerHTML='';return;} const hits=idx.filter(x=>(x.heading+' '+x.text).toLocaleLowerCase('tr-TR').includes(q)).slice(0,12); results.innerHTML=hits.length?hits.map((x,i)=>`<button class="search-hit" data-i="${i}"><b>${x.pageLabel} · ${x.heading}</b><span>${x.anchor}</span><p>${x.text.slice(0,180)}…</p></button>`).join(''):'<div class="nohit">Sonuç bulunamadı.</div>'; results.querySelectorAll('.search-hit').forEach((b,i)=>b.onclick=()=>{const x=hits[i];panel.classList.remove('open');history.pushState(null,'','#'+x.anchor);openPage(x.page,x.anchor);});});
