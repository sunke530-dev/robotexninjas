/* Deep links reveal every enclosing disclosure, including nested packages. */
(function(){
 function revealEntry(hash){
  if(!/^#(?:doc-|package-)/.test(hash||'')) return;
  var target=document.getElementById(hash.slice(1)); if(!target) return;
  var node=target;
  while(node){if(node.tagName==='DETAILS') node.open=true; node=node.parentElement;}
  target.scrollIntoView({block:'start',behavior:'auto'});
 }
 document.querySelectorAll('.governance-library a[href^="#doc-"],.governance-library a[href^="#package-"]').forEach(function(link){
  link.addEventListener('click',function(){revealEntry(link.getAttribute('href'));});
 });
 window.addEventListener('hashchange',function(){revealEntry(window.location.hash);});
 revealEntry(window.location.hash);
})();
