(function(){
  var d=document,h=d.documentElement,n=d.getElementById("nav"),box=d.getElementById("nav-toggle");
  if(box&&n)n.addEventListener("click",function(e){if(e.target.closest("a"))box.checked=false;});
  var here=d.querySelector('.switcher a[href="/'+h.dataset.variant+'/"]');
  if(here)here.setAttribute("aria-current","page");
  var nodes=d.querySelectorAll("[data-in]");
  if(!nodes.length||!("IntersectionObserver"in window)){
    d.querySelectorAll(".section").forEach(function(el){el.classList.add("in");});
    return;
  }
  var reduced=h.classList.contains("js-reduced");
  var io=new IntersectionObserver(function(es){
    es.forEach(function(e){
      if(!e.isIntersecting)return;
      e.target.closest(".section").classList.add("in");
      io.unobserve(e.target);
    });
  },{threshold:!reduced&&h.dataset.variant==="b"?0.4:0.15});
  nodes.forEach(function(el){io.observe(el);});
  var art=d.getElementById("art");
  if(art&&h.classList.contains("js-motion")&&h.dataset.variant!=="b"){
    new IntersectionObserver(function(es){art.classList.toggle("paused",!es[0].isIntersecting);}).observe(art);
  }
})();
