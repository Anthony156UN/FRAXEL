(()=>{"use strict";
const $=(s,root=document)=>root.querySelector(s);
const $$=(s,root=document)=>[...root.querySelectorAll(s)];
$("#year").textContent=new Date().getFullYear();
const nav=$("#mobile-menu"),toggle=$(".menu-toggle");
toggle?.addEventListener("click",()=>{const open=toggle.getAttribute("aria-expanded")==="true";toggle.setAttribute("aria-expanded",String(!open));nav.hidden=open;toggle.setAttribute("aria-label",open?"Abrir menú":"Cerrar menú")});
$$('#mobile-menu a').forEach(a=>a.addEventListener("click",()=>{nav.hidden=true;toggle?.setAttribute("aria-expanded","false")}));
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&nav){nav.hidden=true;toggle?.setAttribute("aria-expanded","false")}});
const reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;
if("IntersectionObserver" in window&&!reduced){const observer=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add("is-visible");observer.unobserve(e.target)}})},{threshold:.08,rootMargin:"0px 0px -15px 0px"});$$(".reveal").forEach(el=>observer.observe(el))}else $$(".reveal").forEach(el=>el.classList.add("is-visible"));
const sections=$$("main section[id]");
if("IntersectionObserver" in window){const ob=new IntersectionObserver(entries=>{entries.forEach(e=>{if(!e.isIntersecting)return;$$(".nav-link").forEach(a=>a.classList.toggle("active",a.getAttribute("href")==="#"+e.target.id))})},{rootMargin:"-30% 0px -60% 0px"});sections.forEach(s=>ob.observe(s))}
const number="51902707751",waBase="https://wa.me/"+number;
const contact=$("#contact-whatsapp");const defaultMsg="Hola, FRAXEL. Estoy interesado en crear una página web para mi negocio y quisiera conocer más información.";
let selectedPlan="";
$$("[data-plan]").forEach(a=>a.addEventListener("click",()=>{selectedPlan=a.dataset.plan||"";const msg=selectedPlan==="Tu idea"?"Hola, FRAXEL. Tengo una idea de proyecto personalizado y quisiera contarles sobre ella.":"Hola, FRAXEL. Me interesa el plan "+selectedPlan+". ¿Podemos conversar sobre el proyecto?";if(contact)contact.href=waBase+"?text="+encodeURIComponent(msg)}));
if(contact&&!contact.href.includes("wa.me"))contact.href=waBase+"?text="+encodeURIComponent(defaultMsg);
const video=$("#anthony-video"),poster=$(".about-poster");
if(video&&!reduced){let started=false;const loadPlay=()=>{if(started)return;started=true;const mobile=matchMedia("(max-width:760px)").matches;video.src=video.dataset[mobile?"mobile":"desktop"];video.muted=true;video.playsInline=true;video.load();const p=video.play();if(p&&typeof p.catch==="function")p.catch(()=>{video.style.display="none"})};
video.addEventListener("ended",()=>{video.pause();video.currentTime=Math.max(0,video.duration-.06)},{once:true});
video.addEventListener("error",()=>{video.style.display="none"},{once:true});
if("IntersectionObserver" in window){const vo=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){loadPlay();vo.disconnect()}},{threshold:.35});vo.observe(video.closest(".about-media")||video)}else loadPlay();
}else if(video){video.remove()}
const p=$("#process-steps");
if(p&&!("IntersectionObserver" in window)) $$(".step").forEach(x=>x.classList.add("is-visible"));
$$(".faq-item").forEach(item=>item.addEventListener("toggle",()=>{if(item.open)$$(".faq-item").filter(x=>x!==item).forEach(x=>x.open=false)}));
})();