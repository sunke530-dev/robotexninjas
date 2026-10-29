/* Load Zeffy's official responsive embed, using the campaign's verified URLs. */
(function(){
  var panel = document.getElementById('give');
  if(!panel) return;
  function zeffyUrl(value, embed){
    try {
      var url = new URL(value);
      if(url.protocol !== 'https:' || !['www.zeffy.com','zeffy.com'].includes(url.hostname) || url.username || url.password || url.port) return null;
      if(embed && !url.pathname.startsWith('/embed/')) return null;
      if(url.pathname === '/') return null;
      return url.href;
    } catch(error){ return null; }
  }
  var campaign = zeffyUrl(panel.dataset.zeffyCampaignUrl, false);
  var embed = zeffyUrl(panel.dataset.zeffyEmbedUrl, true);
  if(!campaign || !embed) return;
  var widget = document.getElementById('donate-zeffy-embed');
  var fallback = document.getElementById('donate-embed-fallback');
  var url = new URL(embed);
  widget.setAttribute('data-form-url', url.pathname + url.search);
  var script = document.createElement('script');
  script.src = 'https://www.zeffy.com/embed/v2/zeffy-embed.js';
  script.async = true;
  script.onerror = function(){
    widget.hidden = true;
    var iframe = document.createElement('iframe');
    iframe.title = 'Donate to Ninjas STEM Foundation through Zeffy';
    iframe.src = embed;
    iframe.setAttribute('allow', 'payment');
    iframe.setAttribute('allowpaymentrequest', '');
    fallback.appendChild(iframe);
    fallback.hidden = false;
  };
  document.body.appendChild(script);
})();
