(function($){$('head').append('\
    <style>\
    .typist-container {\
      overflow: hidden;\
      padding-left: 4px;\
    }\
    .typist-container p {\
      margin: 0 0 3px;\
    }\
    .typist-container p.prompt {\
      margin: 5px 0;\
    }\
    </style>');var MAX_SCROLL=999999999;var defaults={backgroundColor:'#333',textColor:'#00CC00',fontFamily:'monospace',height:300};var $el,typeDelay=80;var curID=0
var blinkTimer;var startBlink=function(next){blinkTimer=setInterval(function(){$('.cursor').toggle();},500);next&&next();};var stopBlink=function(next){clearInterval(blinkTimer);next&&next();};var addLine=function(nl){$('.cursor').remove();if(nl==0){var p=$('<span>');$el.append(p);}else{var p=$('<br/><span>');$el.append(p);}
var height=0;$el.children().each(function(){height+=$(this).height();});$el.scrollTop(height);return p;};var methods={init:function(config){config=$.extend(defaults,config);$el=this;var oldStyle=$el.attr('style')+';'||'';var style='background-color: '+ config.backgroundColor;style+='; color: '+ config.textColor;style+='; font-family: '+ config.fontFamily;$el.addClass('typist-container').attr('style',oldStyle+ style).height(config.height);startBlink();return $el;},prompt:function(){return $el.queue(function(next){$('.cursor').remove();addLine().addClass('prompt').html('$> <span class="cursor">|</span>');next();});},promptecho:function(){return $el.queue(function(next){$('.cursor').remove();addLine(0).addClass('prompt').html(' <span class="cursor">|</span>');next();});},type:function(text){$el.queue(stopBlink);var typeChar=function(index){$el.queue(function(next){$('.cursor').before(text[index]);next();}).delay(typeDelay);};for(var i=0;i<text.length;i++){typeChar(i);}
return $el.queue(startBlink);},echo:function(text){var $p;var typeChar=function(index){$el.queue(function(next){if(index===0){$p=addLine();}
$p.append(text[index]);next();}).delay(typeDelay);};for(var i=0;i<text.length;i++){typeChar(i);}
return $el;},print:function(text){var $p;$el.queue(function(next){$p=addLine();$p.append(text);next();})
return $el;},println:function(text){var $p;$el.queue(function(next){$p=addLine(0);$p.append(text);next();})
return $el;},wait:function(millis){return $el.delay(millis);},speed:function(speed){if(speed==='fast'){typeDelay=20;}
else if(speed==='slow'){typeDelay=120;}else if(speed==='normal'){typeDelay=80;}else if(speed==='veryslow'){typeDelay=180;}
return $el;}};$.fn.typist=function(method){if(methods[method]){return methods[method].apply(this,Array.prototype.slice.call(arguments,1));}else if(typeof method==='object'||!method){return methods.init.apply(this,arguments);}else{$.error('Method '+ method+' does not exist on jQuery.tooltip');}};})(jQuery);