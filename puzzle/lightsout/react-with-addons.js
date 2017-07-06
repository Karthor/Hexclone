!function(e){"object"==typeof exports?module.exports=e():"function"==typeof define&&define.amd?define(e):"undefined"!=typeof window?window.React=e():"undefined"!=typeof global?global.React=e():"undefined"!=typeof self&&(self.React=e())}(function(){var define,module,exports;return(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){var ge=require("./ge");var ex=require("./ex");function $(id){var element=ge(id);if(!element){throw new Error(ex('Tried to get element with id of "%s" but it is not present on the page.',id));}
return element;}
module.exports=$;},{"./ex":94,"./ge":98}],2:[function(require,module,exports){var invariant=require("./invariant");function hasClass(element,className){if(element.classList){return!!className&&element.classList.contains(className);}
return(' '+ element.className+' ').indexOf(' '+ className+' ')>-1;}
var CSSCore={addClass:function(element,className){invariant(!/\s/.test(className),'CSSCore.addClass takes only a single class name. "%s" contains '+'multiple classes.',className);if(className){if(element.classList){element.classList.add(className);}else if(!hasClass(element,className)){element.className=element.className+' '+ className;}}
return element;},removeClass:function(element,className){invariant(!/\s/.test(className),'CSSCore.removeClass takes only a single class name. "%s" contains '+'multiple classes.',className);if(className){if(element.classList){element.classList.remove(className);}else if(hasClass(element,className)){element.className=element.className.replace(new RegExp('(^|\\s)'+ className+'(?:\\s|$)','g'),'$1').replace(/\s+/g,' ').replace(/^\s*|\s*$/g,'');}}
return element;},conditionClass:function(element,className,bool){return(bool?CSSCore.addClass:CSSCore.removeClass)(element,className);}};module.exports=CSSCore;},{"./invariant":106}],3:[function(require,module,exports){"use strict";var isUnitlessNumber={fillOpacity:true,fontWeight:true,lineHeight:true,opacity:true,orphans:true,zIndex:true,zoom:true};var shorthandPropertyExpansions={background:{backgroundImage:true,backgroundPosition:true,backgroundRepeat:true,backgroundColor:true},border:{borderWidth:true,borderStyle:true,borderColor:true},borderBottom:{borderBottomWidth:true,borderBottomStyle:true,borderBottomColor:true},borderLeft:{borderLeftWidth:true,borderLeftStyle:true,borderLeftColor:true},borderRight:{borderRightWidth:true,borderRightStyle:true,borderRightColor:true},borderTop:{borderTopWidth:true,borderTopStyle:true,borderTopColor:true},font:{fontStyle:true,fontVariant:true,fontWeight:true,fontSize:true,lineHeight:true,fontFamily:true}};var CSSProperty={isUnitlessNumber:isUnitlessNumber,shorthandPropertyExpansions:shorthandPropertyExpansions};module.exports=CSSProperty;},{}],4:[function(require,module,exports){"use strict";var CSSProperty=require("./CSSProperty");var dangerousStyleValue=require("./dangerousStyleValue");var escapeTextForBrowser=require("./escapeTextForBrowser");var hyphenate=require("./hyphenate");var memoizeStringOnly=require("./memoizeStringOnly");var processStyleName=memoizeStringOnly(function(styleName){return escapeTextForBrowser(hyphenate(styleName));});var CSSPropertyOperations={createMarkupForStyles:function(styles){var serialized='';for(var styleName in styles){if(!styles.hasOwnProperty(styleName)){continue;}
var styleValue=styles[styleName];if(styleValue!=null){serialized+=processStyleName(styleName)+':';serialized+=dangerousStyleValue(styleName,styleValue)+';';}}
return serialized||null;},setValueForStyles:function(node,styles){var style=node.style;for(var styleName in styles){if(!styles.hasOwnProperty(styleName)){continue;}
var styleValue=dangerousStyleValue(styleName,styles[styleName]);if(styleValue){style[styleName]=styleValue;}else{var expansion=CSSProperty.shorthandPropertyExpansions[styleName];if(expansion){for(var individualStyleName in expansion){style[individualStyleName]='';}}else{style[styleName]='';}}}}};module.exports=CSSPropertyOperations;},{"./CSSProperty":3,"./dangerousStyleValue":91,"./escapeTextForBrowser":93,"./hyphenate":105,"./memoizeStringOnly":114}],5:[function(require,module,exports){"use strict";var listenerBank={};var CallbackRegistry={putListener:function(id,registrationName,listener){var bankForRegistrationName=listenerBank[registrationName]||(listenerBank[registrationName]={});bankForRegistrationName[id]=listener;},getListener:function(id,registrationName){var bankForRegistrationName=listenerBank[registrationName];return bankForRegistrationName&&bankForRegistrationName[id];},deleteListener:function(id,registrationName){var bankForRegistrationName=listenerBank[registrationName];if(bankForRegistrationName){delete bankForRegistrationName[id];}},deleteAllListeners:function(id){for(var registrationName in listenerBank){delete listenerBank[registrationName][id];}},__purge:function(){listenerBank={};}};module.exports=CallbackRegistry;},{}],6:[function(require,module,exports){"use strict";var EventConstants=require("./EventConstants");var EventPluginHub=require("./EventPluginHub");var EventPropagators=require("./EventPropagators");var ExecutionEnvironment=require("./ExecutionEnvironment");var SyntheticEvent=require("./SyntheticEvent");var isEventSupported=require("./isEventSupported");var isTextInputElement=require("./isTextInputElement");var keyOf=require("./keyOf");var topLevelTypes=EventConstants.topLevelTypes;var eventTypes={change:{phasedRegistrationNames:{bubbled:keyOf({onChange:null}),captured:keyOf({onChangeCapture:null})}}};var activeElement=null;var activeElementID=null;var activeElementValue=null;var activeElementValueProp=null;function shouldUseChangeEvent(elem){return(elem.nodeName==='SELECT'||(elem.nodeName==='INPUT'&&elem.type==='file'));}
var doesChangeEventBubble=false;if(ExecutionEnvironment.canUseDOM){doesChangeEventBubble=isEventSupported('change')&&(!('documentMode'in document)||document.documentMode>8);}
function manualDispatchChangeEvent(nativeEvent){var event=SyntheticEvent.getPooled(eventTypes.change,activeElementID,nativeEvent);EventPropagators.accumulateTwoPhaseDispatches(event);EventPluginHub.enqueueEvents(event);EventPluginHub.processEventQueue();}
function startWatchingForChangeEventIE8(target,targetID){activeElement=target;activeElementID=targetID;activeElement.attachEvent('onchange',manualDispatchChangeEvent);}
function stopWatchingForChangeEventIE8(){if(!activeElement){return;}
activeElement.detachEvent('onchange',manualDispatchChangeEvent);activeElement=null;activeElementID=null;}
function getTargetIDForChangeEvent(topLevelType,topLevelTarget,topLevelTargetID){if(topLevelType===topLevelTypes.topChange){return topLevelTargetID;}}
function handleEventsForChangeEventIE8(topLevelType,topLevelTarget,topLevelTargetID){if(topLevelType===topLevelTypes.topFocus){stopWatchingForChangeEventIE8();startWatchingForChangeEventIE8(topLevelTarget,topLevelTargetID);}else if(topLevelType===topLevelTypes.topBlur){stopWatchingForChangeEventIE8();}}
var isInputEventSupported=false;if(ExecutionEnvironment.canUseDOM){isInputEventSupported=isEventSupported('input')&&(!('documentMode'in document)||document.documentMode>9);}
var newValueProp={get:function(){return activeElementValueProp.get.call(this);},set:function(val){activeElementValue=''+ val;activeElementValueProp.set.call(this,val);}};function startWatchingForValueChange(target,targetID){activeElement=target;activeElementID=targetID;activeElementValue=target.value;activeElementValueProp=Object.getOwnPropertyDescriptor(target.constructor.prototype,'value');Object.defineProperty(activeElement,'value',newValueProp);activeElement.attachEvent('onpropertychange',handlePropertyChange);}
function stopWatchingForValueChange(){if(!activeElement){return;}
delete activeElement.value;activeElement.detachEvent('onpropertychange',handlePropertyChange);activeElement=null;activeElementID=null;activeElementValue=null;activeElementValueProp=null;}
function handlePropertyChange(nativeEvent){if(nativeEvent.propertyName!=='value'){return;}
var value=nativeEvent.srcElement.value;if(value===activeElementValue){return;}
activeElementValue=value;manualDispatchChangeEvent(nativeEvent);}
function getTargetIDForInputEvent(topLevelType,topLevelTarget,topLevelTargetID){if(topLevelType===topLevelTypes.topInput){return topLevelTargetID;}}
function handleEventsForInputEventIE(topLevelType,topLevelTarget,topLevelTargetID){if(topLevelType===topLevelTypes.topFocus){stopWatchingForValueChange();startWatchingForValueChange(topLevelTarget,topLevelTargetID);}else if(topLevelType===topLevelTypes.topBlur){stopWatchingForValueChange();}}
function getTargetIDForInputEventIE(topLevelType,topLevelTarget,topLevelTargetID){if(topLevelType===topLevelTypes.topSelectionChange||topLevelType===topLevelTypes.topKeyUp||topLevelType===topLevelTypes.topKeyDown){if(activeElement&&activeElement.value!==activeElementValue){activeElementValue=activeElement.value;return activeElementID;}}}
function shouldUseClickEvent(elem){return(elem.nodeName==='INPUT'&&(elem.type==='checkbox'||elem.type==='radio'));}
function getTargetIDForClickEvent(topLevelType,topLevelTarget,topLevelTargetID){if(topLevelType===topLevelTypes.topClick){return topLevelTargetID;}}
var ChangeEventPlugin={eventTypes:eventTypes,extractEvents:function(topLevelType,topLevelTarget,topLevelTargetID,nativeEvent){var getTargetIDFunc,handleEventFunc;if(shouldUseChangeEvent(topLevelTarget)){if(doesChangeEventBubble){getTargetIDFunc=getTargetIDForChangeEvent;}else{handleEventFunc=handleEventsForChangeEventIE8;}}else if(isTextInputElement(topLevelTarget)){if(isInputEventSupported){getTargetIDFunc=getTargetIDForInputEvent;}else{getTargetIDFunc=getTargetIDForInputEventIE;handleEventFunc=handleEventsForInputEventIE;}}else if(shouldUseClickEvent(topLevelTarget)){getTargetIDFunc=getTargetIDForClickEvent;}
if(getTargetIDFunc){var targetID=getTargetIDFunc(topLevelType,topLevelTarget,topLevelTargetID);if(targetID){var event=SyntheticEvent.getPooled(eventTypes.change,targetID,nativeEvent);EventPropagators.accumulateTwoPhaseDispatches(event);return event;}}
if(handleEventFunc){handleEventFunc(topLevelType,topLevelTarget,topLevelTargetID);}}};module.exports=ChangeEventPlugin;},{"./EventConstants":15,"./EventPluginHub":17,"./EventPropagators":20,"./ExecutionEnvironment":21,"./SyntheticEvent":75,"./isEventSupported":107,"./isTextInputElement":109,"./keyOf":113}],7:[function(require,module,exports){"use strict";var EventConstants=require("./EventConstants");var EventPropagators=require("./EventPropagators");var ExecutionEnvironment=require("./ExecutionEnvironment");var ReactInputSelection=require("./ReactInputSelection");var SyntheticCompositionEvent=require("./SyntheticCompositionEvent");var getTextContentAccessor=require("./getTextContentAccessor");var keyOf=require("./keyOf");var END_KEYCODES=[9,13,27,32];var START_KEYCODE=229;var useCompositionEvent=ExecutionEnvironment.canUseDOM&&'CompositionEvent'in window;var topLevelTypes=EventConstants.topLevelTypes;var currentComposition=null;var eventTypes={compositionEnd:{phasedRegistrationNames:{bubbled:keyOf({onCompositionEnd:null}),captured:keyOf({onCompositionEndCapture:null})}},compositionStart:{phasedRegistrationNames:{bubbled:keyOf({onCompositionStart:null}),captured:keyOf({onCompositionStartCapture:null})}},compositionUpdate:{phasedRegistrationNames:{bubbled:keyOf({onCompositionUpdate:null}),captured:keyOf({onCompositionUpdateCapture:null})}}};function getCompositionEventType(topLevelType){switch(topLevelType){case topLevelTypes.topCompositionStart:return eventTypes.compositionStart;case topLevelTypes.topCompositionEnd:return eventTypes.compositionEnd;case topLevelTypes.topCompositionUpdate:return eventTypes.compositionUpdate;}}
function isFallbackStart(topLevelType,nativeEvent){return(topLevelType===topLevelTypes.topKeyDown&&nativeEvent.keyCode===START_KEYCODE);}
function isFallbackEnd(topLevelType,nativeEvent){switch(topLevelType){case topLevelTypes.topKeyUp:return(END_KEYCODES.indexOf(nativeEvent.keyCode)!==-1);case topLevelTypes.topKeyDown:return(nativeEvent.keyCode!==START_KEYCODE);case topLevelTypes.topKeyPress:case topLevelTypes.topMouseDown:case topLevelTypes.topBlur:return true;default:return false;}}
function FallbackCompositionState(root){this.root=root;this.startSelection=ReactInputSelection.getSelection(root);this.startValue=this.getText();}
FallbackCompositionState.prototype.getText=function(){return this.root.value||this.root[getTextContentAccessor()];};FallbackCompositionState.prototype.getData=function(){var endValue=this.getText();var prefixLength=this.startSelection.start;var suffixLength=this.startValue.length- this.startSelection.end;return endValue.substr(prefixLength,endValue.length- suffixLength- prefixLength);};var CompositionEventPlugin={eventTypes:eventTypes,extractEvents:function(topLevelType,topLevelTarget,topLevelTargetID,nativeEvent){var eventType;var data;if(useCompositionEvent){eventType=getCompositionEventType(topLevelType);}else if(!currentComposition){if(isFallbackStart(topLevelType,nativeEvent)){eventType=eventTypes.start;currentComposition=new FallbackCompositionState(topLevelTarget);}}else if(isFallbackEnd(topLevelType,nativeEvent)){eventType=eventTypes.compositionEnd;data=currentComposition.getData();currentComposition=null;}
if(eventType){var event=SyntheticCompositionEvent.getPooled(eventType,topLevelTargetID,nativeEvent);if(data){event.data=data;}
EventPropagators.accumulateTwoPhaseDispatches(event);return event;}}};module.exports=CompositionEventPlugin;},{"./EventConstants":15,"./EventPropagators":20,"./ExecutionEnvironment":21,"./ReactInputSelection":49,"./SyntheticCompositionEvent":74,"./getTextContentAccessor":104,"./keyOf":113}],8:[function(require,module,exports){"use strict";var Danger=require("./Danger");var ReactMultiChildUpdateTypes=require("./ReactMultiChildUpdateTypes");var getTextContentAccessor=require("./getTextContentAccessor");var textContentAccessor=getTextContentAccessor()||'NA';function insertChildAt(parentNode,childNode,index){var childNodes=parentNode.childNodes;if(childNodes[index]===childNode){return;}
if(childNode.parentNode===parentNode){parentNode.removeChild(childNode);}
if(index>=childNodes.length){parentNode.appendChild(childNode);}else{parentNode.insertBefore(childNode,childNodes[index]);}}
var DOMChildrenOperations={dangerouslyReplaceNodeWithMarkup:Danger.dangerouslyReplaceNodeWithMarkup,processUpdates:function(updates,markupList){var update;var initialChildren=null;var updatedChildren=null;for(var i=0;update=updates[i];i++){if(update.type===ReactMultiChildUpdateTypes.MOVE_EXISTING||update.type===ReactMultiChildUpdateTypes.REMOVE_NODE){var updatedIndex=update.fromIndex;var updatedChild=update.parentNode.childNodes[updatedIndex];var parentID=update.parentID;initialChildren=initialChildren||{};initialChildren[parentID]=initialChildren[parentID]||[];initialChildren[parentID][updatedIndex]=updatedChild;updatedChildren=updatedChildren||[];updatedChildren.push(updatedChild);}}
var renderedMarkup=Danger.dangerouslyRenderMarkup(markupList);if(updatedChildren){for(var j=0;j<updatedChildren.length;j++){updatedChildren[j].parentNode.removeChild(updatedChildren[j]);}}
for(var k=0;update=updates[k];k++){switch(update.type){case ReactMultiChildUpdateTypes.INSERT_MARKUP:insertChildAt(update.parentNode,renderedMarkup[update.markupIndex],update.toIndex);break;case ReactMultiChildUpdateTypes.MOVE_EXISTING:insertChildAt(update.parentNode,initialChildren[update.parentID][update.fromIndex],update.toIndex);break;case ReactMultiChildUpdateTypes.TEXT_CONTENT:update.parentNode[textContentAccessor]=update.textContent;break;case ReactMultiChildUpdateTypes.REMOVE_NODE:break;}}}};module.exports=DOMChildrenOperations;},{"./Danger":11,"./ReactMultiChildUpdateTypes":56,"./getTextContentAccessor":104}],9:[function(require,module,exports){"use strict";var invariant=require("./invariant");var DOMPropertyInjection={MUST_USE_ATTRIBUTE:0x1,MUST_USE_PROPERTY:0x2,HAS_BOOLEAN_VALUE:0x4,HAS_SIDE_EFFECTS:0x8,injectDOMPropertyConfig:function(domPropertyConfig){var Properties=domPropertyConfig.Properties||{};var DOMAttributeNames=domPropertyConfig.DOMAttributeNames||{};var DOMPropertyNames=domPropertyConfig.DOMPropertyNames||{};var DOMMutationMethods=domPropertyConfig.DOMMutationMethods||{};if(domPropertyConfig.isCustomAttribute){DOMProperty._isCustomAttributeFunctions.push(domPropertyConfig.isCustomAttribute);}
for(var propName in Properties){invariant(!DOMProperty.isStandardName[propName],'injectDOMPropertyConfig(...): You\'re trying to inject DOM property '+'\'%s\' which has already been injected. You may be accidentally '+'injecting the same DOM property config twice, or you may be '+'injecting two configs that have conflicting property names.',propName);DOMProperty.isStandardName[propName]=true;var lowerCased=propName.toLowerCase();DOMProperty.getPossibleStandardName[lowerCased]=propName;var attributeName=DOMAttributeNames[propName];if(attributeName){DOMProperty.getPossibleStandardName[attributeName]=propName;}
DOMProperty.getAttributeName[propName]=attributeName||lowerCased;DOMProperty.getPropertyName[propName]=DOMPropertyNames[propName]||propName;var mutationMethod=DOMMutationMethods[propName];if(mutationMethod){DOMProperty.getMutationMethod[propName]=mutationMethod;}
var propConfig=Properties[propName];DOMProperty.mustUseAttribute[propName]=propConfig&DOMPropertyInjection.MUST_USE_ATTRIBUTE;DOMProperty.mustUseProperty[propName]=propConfig&DOMPropertyInjection.MUST_USE_PROPERTY;DOMProperty.hasBooleanValue[propName]=propConfig&DOMPropertyInjection.HAS_BOOLEAN_VALUE;DOMProperty.hasSideEffects[propName]=propConfig&DOMPropertyInjection.HAS_SIDE_EFFECTS;invariant(!DOMProperty.mustUseAttribute[propName]||!DOMProperty.mustUseProperty[propName],'DOMProperty: Cannot use require using both attribute and property: %s',propName);invariant(DOMProperty.mustUseProperty[propName]||!DOMProperty.hasSideEffects[propName],'DOMProperty: Properties that have side effects must use property: %s',propName);}}};var defaultValueCache={};var DOMProperty={isStandardName:{},getPossibleStandardName:{},getAttributeName:{},getPropertyName:{},getMutationMethod:{},mustUseAttribute:{},mustUseProperty:{},hasBooleanValue:{},hasSideEffects:{},_isCustomAttributeFunctions:[],isCustomAttribute:function(attributeName){return DOMProperty._isCustomAttributeFunctions.some(function(isCustomAttributeFn){return isCustomAttributeFn.call(null,attributeName);});},getDefaultValueForProperty:function(nodeName,prop){var nodeDefaults=defaultValueCache[nodeName];var testElement;if(!nodeDefaults){defaultValueCache[nodeName]=nodeDefaults={};}
if(!(prop in nodeDefaults)){testElement=document.createElement(nodeName);nodeDefaults[prop]=testElement[prop];}
return nodeDefaults[prop];},injection:DOMPropertyInjection};module.exports=DOMProperty;},{"./invariant":106}],10:[function(require,module,exports){"use strict";var DOMProperty=require("./DOMProperty");var escapeTextForBrowser=require("./escapeTextForBrowser");var memoizeStringOnly=require("./memoizeStringOnly");var processAttributeNameAndPrefix=memoizeStringOnly(function(name){return escapeTextForBrowser(name)+'="';});if(true){var reactProps={__owner__:true,children:true,dangerouslySetInnerHTML:true,key:true,ref:true};var warnedProperties={};var warnUnknownProperty=function(name){if(reactProps[name]||warnedProperties[name]){return;}
warnedProperties[name]=true;var lowerCasedName=name.toLowerCase();var standardName=DOMProperty.isCustomAttribute(lowerCasedName)?lowerCasedName:DOMProperty.getPossibleStandardName[lowerCasedName];if(standardName!=null){console.warn('Unknown DOM property '+ name+'. Did you mean '+ standardName+'?');}};}
var DOMPropertyOperations={createMarkupForProperty:function(name,value){if(DOMProperty.isStandardName[name]){if(value==null||DOMProperty.hasBooleanValue[name]&&!value){return'';}
var attributeName=DOMProperty.getAttributeName[name];return processAttributeNameAndPrefix(attributeName)+
escapeTextForBrowser(value)+'"';}else if(DOMProperty.isCustomAttribute(name)){if(value==null){return'';}
return processAttributeNameAndPrefix(name)+
escapeTextForBrowser(value)+'"';}else if(true){warnUnknownProperty(name);}
return null;},setValueForProperty:function(node,name,value){if(DOMProperty.isStandardName[name]){var mutationMethod=DOMProperty.getMutationMethod[name];if(mutationMethod){mutationMethod(node,value);}else if(DOMProperty.mustUseAttribute[name]){if(DOMProperty.hasBooleanValue[name]&&!value){node.removeAttribute(DOMProperty.getAttributeName[name]);}else{node.setAttribute(DOMProperty.getAttributeName[name],''+ value);}}else{var propName=DOMProperty.getPropertyName[name];if(!DOMProperty.hasSideEffects[name]||node[propName]!==value){node[propName]=value;}}}else if(DOMProperty.isCustomAttribute(name)){node.setAttribute(name,''+ value);}else if(true){warnUnknownProperty(name);}},deleteValueForProperty:function(node,name){if(DOMProperty.isStandardName[name]){var mutationMethod=DOMProperty.getMutationMethod[name];if(mutationMethod){mutationMethod(node,undefined);}else if(DOMProperty.mustUseAttribute[name]){node.removeAttribute(DOMProperty.getAttributeName[name]);}else{var propName=DOMProperty.getPropertyName[name];node[propName]=DOMProperty.getDefaultValueForProperty(node.nodeName,name);}}else if(DOMProperty.isCustomAttribute(name)){node.removeAttribute(name);}else if(true){warnUnknownProperty(name);}}};module.exports=DOMPropertyOperations;},{"./DOMProperty":9,"./escapeTextForBrowser":93,"./memoizeStringOnly":114}],11:[function(require,module,exports){"use strict";var ExecutionEnvironment=require("./ExecutionEnvironment");var createNodesFromMarkup=require("./createNodesFromMarkup");var emptyFunction=require("./emptyFunction");var getMarkupWrap=require("./getMarkupWrap");var invariant=require("./invariant");var mutateHTMLNodeWithMarkup=require("./mutateHTMLNodeWithMarkup");var OPEN_TAG_NAME_EXP=/^(<[^ \/>]+)/;var RESULT_INDEX_ATTR='data-danger-index';function getNodeName(markup){return markup.substring(1,markup.indexOf(' '));}
var Danger={dangerouslyRenderMarkup:function(markupList){invariant(ExecutionEnvironment.canUseDOM,'dangerouslyRenderMarkup(...): Cannot render markup in a Worker '+'thread. This is likely a bug in the framework. Please report '+'immediately.');var nodeName;var markupByNodeName={};for(var i=0;i<markupList.length;i++){invariant(markupList[i],'dangerouslyRenderMarkup(...): Missing markup.');nodeName=getNodeName(markupList[i]);nodeName=getMarkupWrap(nodeName)?nodeName:'*';markupByNodeName[nodeName]=markupByNodeName[nodeName]||[];markupByNodeName[nodeName][i]=markupList[i];}
var resultList=[];var resultListAssignmentCount=0;for(nodeName in markupByNodeName){if(!markupByNodeName.hasOwnProperty(nodeName)){continue;}
var markupListByNodeName=markupByNodeName[nodeName];for(var resultIndex in markupListByNodeName){if(markupListByNodeName.hasOwnProperty(resultIndex)){var markup=markupListByNodeName[resultIndex];markupListByNodeName[resultIndex]=markup.replace(OPEN_TAG_NAME_EXP,'$1 '+ RESULT_INDEX_ATTR+'="'+ resultIndex+'" ');}}
var renderNodes=createNodesFromMarkup(markupListByNodeName.join(''),emptyFunction);for(i=0;i<renderNodes.length;++i){var renderNode=renderNodes[i];if(renderNode.hasAttribute&&renderNode.hasAttribute(RESULT_INDEX_ATTR)){resultIndex=+renderNode.getAttribute(RESULT_INDEX_ATTR);renderNode.removeAttribute(RESULT_INDEX_ATTR);invariant(!resultList.hasOwnProperty(resultIndex),'Danger: Assigning to an already-occupied result index.');resultList[resultIndex]=renderNode;resultListAssignmentCount+=1;}else if(true){console.error("Danger: Discarding unexpected node:",renderNode);}}}
invariant(resultListAssignmentCount===resultList.length,'Danger: Did not assign to every index of resultList.');invariant(resultList.length===markupList.length,'Danger: Expected markup to render %s nodes, but rendered %s.',markupList.length,resultList.length);return resultList;},dangerouslyReplaceNodeWithMarkup:function(oldChild,markup){invariant(ExecutionEnvironment.canUseDOM,'dangerouslyReplaceNodeWithMarkup(...): Cannot render markup in a '+'worker thread. This is likely a bug in the framework. Please report '+'immediately.');invariant(markup,'dangerouslyReplaceNodeWithMarkup(...): Missing markup.');if(oldChild.tagName.toLowerCase()==='html'){mutateHTMLNodeWithMarkup(oldChild,markup);return;}
var newChild=createNodesFromMarkup(markup,emptyFunction)[0];oldChild.parentNode.replaceChild(newChild,oldChild);}};module.exports=Danger;},{"./ExecutionEnvironment":21,"./createNodesFromMarkup":88,"./emptyFunction":92,"./getMarkupWrap":101,"./invariant":106,"./mutateHTMLNodeWithMarkup":119}],12:[function(require,module,exports){"use strict";var DOMProperty=require("./DOMProperty");var MUST_USE_ATTRIBUTE=DOMProperty.injection.MUST_USE_ATTRIBUTE;var MUST_USE_PROPERTY=DOMProperty.injection.MUST_USE_PROPERTY;var HAS_BOOLEAN_VALUE=DOMProperty.injection.HAS_BOOLEAN_VALUE;var HAS_SIDE_EFFECTS=DOMProperty.injection.HAS_SIDE_EFFECTS;var DefaultDOMPropertyConfig={isCustomAttribute:RegExp.prototype.test.bind(/^(data|aria)-[a-z_][a-z\d_.\-]*$/),Properties:{accept:null,accessKey:null,action:null,allowFullScreen:MUST_USE_ATTRIBUTE|HAS_BOOLEAN_VALUE,allowTransparency:MUST_USE_ATTRIBUTE,alt:null,autoComplete:null,autoFocus:HAS_BOOLEAN_VALUE,autoPlay:HAS_BOOLEAN_VALUE,cellPadding:null,cellSpacing:null,charSet:MUST_USE_ATTRIBUTE,checked:MUST_USE_PROPERTY|HAS_BOOLEAN_VALUE,className:MUST_USE_PROPERTY,colSpan:null,content:null,contentEditable:null,contextMenu:MUST_USE_ATTRIBUTE,controls:MUST_USE_PROPERTY|HAS_BOOLEAN_VALUE,data:null,dateTime:MUST_USE_ATTRIBUTE,dir:null,disabled:MUST_USE_ATTRIBUTE|HAS_BOOLEAN_VALUE,draggable:null,encType:null,form:MUST_USE_ATTRIBUTE,frameBorder:MUST_USE_ATTRIBUTE,height:MUST_USE_ATTRIBUTE,hidden:MUST_USE_ATTRIBUTE|HAS_BOOLEAN_VALUE,href:null,htmlFor:null,httpEquiv:null,icon:null,id:MUST_USE_PROPERTY,label:null,lang:null,list:null,max:null,maxLength:MUST_USE_ATTRIBUTE,method:null,min:null,multiple:MUST_USE_PROPERTY|HAS_BOOLEAN_VALUE,name:null,pattern:null,placeholder:null,poster:null,preload:null,radioGroup:null,readOnly:MUST_USE_PROPERTY|HAS_BOOLEAN_VALUE,rel:null,required:HAS_BOOLEAN_VALUE,role:MUST_USE_ATTRIBUTE,rowSpan:null,scrollLeft:MUST_USE_PROPERTY,scrollTop:MUST_USE_PROPERTY,selected:MUST_USE_PROPERTY|HAS_BOOLEAN_VALUE,size:null,spellCheck:null,src:null,step:null,style:null,tabIndex:null,target:null,title:null,type:null,value:MUST_USE_PROPERTY|HAS_SIDE_EFFECTS,width:MUST_USE_ATTRIBUTE,wmode:MUST_USE_ATTRIBUTE,autoCapitalize:null,cx:MUST_USE_ATTRIBUTE,cy:MUST_USE_ATTRIBUTE,d:MUST_USE_ATTRIBUTE,fill:MUST_USE_ATTRIBUTE,fx:MUST_USE_ATTRIBUTE,fy:MUST_USE_ATTRIBUTE,gradientTransform:MUST_USE_ATTRIBUTE,gradientUnits:MUST_USE_ATTRIBUTE,offset:MUST_USE_ATTRIBUTE,points:MUST_USE_ATTRIBUTE,r:MUST_USE_ATTRIBUTE,rx:MUST_USE_ATTRIBUTE,ry:MUST_USE_ATTRIBUTE,spreadMethod:MUST_USE_ATTRIBUTE,stopColor:MUST_USE_ATTRIBUTE,stopOpacity:MUST_USE_ATTRIBUTE,stroke:MUST_USE_ATTRIBUTE,strokeLinecap:MUST_USE_ATTRIBUTE,strokeWidth:MUST_USE_ATTRIBUTE,transform:MUST_USE_ATTRIBUTE,version:MUST_USE_ATTRIBUTE,viewBox:MUST_USE_ATTRIBUTE,x1:MUST_USE_ATTRIBUTE,x2:MUST_USE_ATTRIBUTE,x:MUST_USE_ATTRIBUTE,y1:MUST_USE_ATTRIBUTE,y2:MUST_USE_ATTRIBUTE,y:MUST_USE_ATTRIBUTE},DOMAttributeNames:{className:'class',gradientTransform:'gradientTransform',gradientUnits:'gradientUnits',htmlFor:'for',spreadMethod:'spreadMethod',stopColor:'stop-color',stopOpacity:'stop-opacity',strokeLinecap:'stroke-linecap',strokeWidth:'stroke-width',viewBox:'viewBox'},DOMPropertyNames:{autoCapitalize:'autocapitalize',autoComplete:'autocomplete',autoFocus:'autofocus',autoPlay:'autoplay',encType:'enctype',radioGroup:'radiogroup',spellCheck:'spellcheck'},DOMMutationMethods:{className:function(node,value){node.className=value||'';}}};module.exports=DefaultDOMPropertyConfig;},{"./DOMProperty":9}],13:[function(require,module,exports){"use strict";var keyOf=require("./keyOf");var DefaultEventPluginOrder=[keyOf({ResponderEventPlugin:null}),keyOf({SimpleEventPlugin:null}),keyOf({TapEventPlugin:null}),keyOf({EnterLeaveEventPlugin:null}),keyOf({ChangeEventPlugin:null}),keyOf({SelectEventPlugin:null}),keyOf({CompositionEventPlugin:null}),keyOf({AnalyticsEventPlugin:null}),keyOf({MobileSafariClickEventPlugin:null})];module.exports=DefaultEventPluginOrder;},{"./keyOf":113}],14:[function(require,module,exports){"use strict";var EventConstants=require("./EventConstants");var EventPropagators=require("./EventPropagators");var SyntheticMouseEvent=require("./SyntheticMouseEvent");var ReactMount=require("./ReactMount");var keyOf=require("./keyOf");var topLevelTypes=EventConstants.topLevelTypes;var getFirstReactDOM=ReactMount.getFirstReactDOM;var eventTypes={mouseEnter:{registrationName:keyOf({onMouseEnter:null})},mouseLeave:{registrationName:keyOf({onMouseLeave:null})}};var extractedEvents=[null,null];var EnterLeaveEventPlugin={eventTypes:eventTypes,extractEvents:function(topLevelType,topLevelTarget,topLevelTargetID,nativeEvent){if(topLevelType===topLevelTypes.topMouseOver&&(nativeEvent.relatedTarget||nativeEvent.fromElement)){return null;}
if(topLevelType!==topLevelTypes.topMouseOut&&topLevelType!==topLevelTypes.topMouseOver){return null;}
var from,to;if(topLevelType===topLevelTypes.topMouseOut){from=topLevelTarget;to=getFirstReactDOM(nativeEvent.relatedTarget||nativeEvent.toElement)||window;}else{from=window;to=topLevelTarget;}
if(from===to){return null;}
var fromID=from?ReactMount.getID(from):'';var toID=to?ReactMount.getID(to):'';var leave=SyntheticMouseEvent.getPooled(eventTypes.mouseLeave,fromID,nativeEvent);var enter=SyntheticMouseEvent.getPooled(eventTypes.mouseEnter,toID,nativeEvent);EventPropagators.accumulateEnterLeaveDispatches(leave,enter,fromID,toID);extractedEvents[0]=leave;extractedEvents[1]=enter;return extractedEvents;}};module.exports=EnterLeaveEventPlugin;},{"./EventConstants":15,"./EventPropagators":20,"./ReactMount":53,"./SyntheticMouseEvent":78,"./keyOf":113}],15:[function(require,module,exports){"use strict";var keyMirror=require("./keyMirror");var PropagationPhases=keyMirror({bubbled:null,captured:null});var topLevelTypes=keyMirror({topBlur:null,topChange:null,topClick:null,topCompositionEnd:null,topCompositionStart:null,topCompositionUpdate:null,topCopy:null,topCut:null,topDoubleClick:null,topDrag:null,topDragEnd:null,topDragEnter:null,topDragExit:null,topDragLeave:null,topDragOver:null,topDragStart:null,topDrop:null,topFocus:null,topInput:null,topKeyDown:null,topKeyPress:null,topKeyUp:null,topMouseDown:null,topMouseMove:null,topMouseOut:null,topMouseOver:null,topMouseUp:null,topPaste:null,topScroll:null,topSelectionChange:null,topSubmit:null,topTouchCancel:null,topTouchEnd:null,topTouchMove:null,topTouchStart:null,topWheel:null});var EventConstants={topLevelTypes:topLevelTypes,PropagationPhases:PropagationPhases};module.exports=EventConstants;},{"./keyMirror":112}],16:[function(require,module,exports){var EventListener={listen:function(el,handlerBaseName,cb){if(el.addEventListener){el.addEventListener(handlerBaseName,cb,false);}else if(el.attachEvent){el.attachEvent('on'+ handlerBaseName,cb);}},capture:function(el,handlerBaseName,cb){if(!el.addEventListener){if(true){console.error('You are attempting to use addEventlistener '+'in a browser that does not support it support it.'+'This likely means that you will not receive events that '+'your application relies on (such as scroll).');}
return;}else{el.addEventListener(handlerBaseName,cb,true);}}};module.exports=EventListener;},{}],17:[function(require,module,exports){"use strict";var CallbackRegistry=require("./CallbackRegistry");var EventPluginRegistry=require("./EventPluginRegistry");var EventPluginUtils=require("./EventPluginUtils");var EventPropagators=require("./EventPropagators");var ExecutionEnvironment=require("./ExecutionEnvironment");var accumulate=require("./accumulate");var forEachAccumulated=require("./forEachAccumulated");var invariant=require("./invariant");var eventQueue=null;var executeDispatchesAndRelease=function(event){if(event){var executeDispatch=EventPluginUtils.executeDispatch;var PluginModule=EventPluginRegistry.getPluginModuleForEvent(event);if(PluginModule&&PluginModule.executeDispatch){executeDispatch=PluginModule.executeDispatch;}
EventPluginUtils.executeDispatchesInOrder(event,executeDispatch);if(!event.isPersistent()){event.constructor.release(event);}}};var EventPluginHub={injection:{injectInstanceHandle:EventPropagators.injection.injectInstanceHandle,injectEventPluginOrder:EventPluginRegistry.injectEventPluginOrder,injectEventPluginsByName:EventPluginRegistry.injectEventPluginsByName},registrationNames:EventPluginRegistry.registrationNames,putListener:CallbackRegistry.putListener,getListener:CallbackRegistry.getListener,deleteListener:CallbackRegistry.deleteListener,deleteAllListeners:CallbackRegistry.deleteAllListeners,extractEvents:function(topLevelType,topLevelTarget,topLevelTargetID,nativeEvent){var events;var plugins=EventPluginRegistry.plugins;for(var i=0,l=plugins.length;i<l;i++){var possiblePlugin=plugins[i];if(possiblePlugin){var extractedEvents=possiblePlugin.extractEvents(topLevelType,topLevelTarget,topLevelTargetID,nativeEvent);if(extractedEvents){events=accumulate(events,extractedEvents);}}}
return events;},enqueueEvents:function(events){if(events){eventQueue=accumulate(eventQueue,events);}},processEventQueue:function(){var processingEventQueue=eventQueue;eventQueue=null;forEachAccumulated(processingEventQueue,executeDispatchesAndRelease);invariant(!eventQueue,'processEventQueue(): Additional events were enqueued while processing '+'an event queue. Support for this has not yet been implemented.');}};if(ExecutionEnvironment.canUseDOM){window.EventPluginHub=EventPluginHub;}
module.exports=EventPluginHub;},{"./CallbackRegistry":5,"./EventPluginRegistry":18,"./EventPluginUtils":19,"./EventPropagators":20,"./ExecutionEnvironment":21,"./accumulate":84,"./forEachAccumulated":97,"./invariant":106}],18:[function(require,module,exports){"use strict";var invariant=require("./invariant");var EventPluginOrder=null;var namesToPlugins={};function recomputePluginOrdering(){if(!EventPluginOrder){return;}
for(var pluginName in namesToPlugins){var PluginModule=namesToPlugins[pluginName];var pluginIndex=EventPluginOrder.indexOf(pluginName);invariant(pluginIndex>-1,'EventPluginRegistry: Cannot inject event plugins that do not exist in '+'the plugin ordering, `%s`.',pluginName);if(EventPluginRegistry.plugins[pluginIndex]){continue;}
invariant(PluginModule.extractEvents,'EventPluginRegistry: Event plugins must implement an `extractEvents` '+'method, but `%s` does not.',pluginName);EventPluginRegistry.plugins[pluginIndex]=PluginModule;var publishedEvents=PluginModule.eventTypes;for(var eventName in publishedEvents){invariant(publishEventForPlugin(publishedEvents[eventName],PluginModule),'EventPluginRegistry: Failed to publish event `%s` for plugin `%s`.',eventName,pluginName);}}}
function publishEventForPlugin(dispatchConfig,PluginModule){var phasedRegistrationNames=dispatchConfig.phasedRegistrationNames;if(phasedRegistrationNames){for(var phaseName in phasedRegistrationNames){if(phasedRegistrationNames.hasOwnProperty(phaseName)){var phasedRegistrationName=phasedRegistrationNames[phaseName];publishRegistrationName(phasedRegistrationName,PluginModule);}}
return true;}else if(dispatchConfig.registrationName){publishRegistrationName(dispatchConfig.registrationName,PluginModule);return true;}
return false;}
function publishRegistrationName(registrationName,PluginModule){invariant(!EventPluginRegistry.registrationNames[registrationName],'EventPluginHub: More than one plugin attempted to publish the same '+'registration name, `%s`.',registrationName);EventPluginRegistry.registrationNames[registrationName]=PluginModule;EventPluginRegistry.registrationNamesKeys.push(registrationName);}
var EventPluginRegistry={plugins:[],registrationNames:{},registrationNamesKeys:[],injectEventPluginOrder:function(InjectedEventPluginOrder){invariant(!EventPluginOrder,'EventPluginRegistry: Cannot inject event plugin ordering more than once.');EventPluginOrder=Array.prototype.slice.call(InjectedEventPluginOrder);recomputePluginOrdering();},injectEventPluginsByName:function(injectedNamesToPlugins){var isOrderingDirty=false;for(var pluginName in injectedNamesToPlugins){if(!injectedNamesToPlugins.hasOwnProperty(pluginName)){continue;}
var PluginModule=injectedNamesToPlugins[pluginName];if(namesToPlugins[pluginName]!==PluginModule){invariant(!namesToPlugins[pluginName],'EventPluginRegistry: Cannot inject two different event plugins '+'using the same name, `%s`.',pluginName);namesToPlugins[pluginName]=PluginModule;isOrderingDirty=true;}}
if(isOrderingDirty){recomputePluginOrdering();}},getPluginModuleForEvent:function(event){var dispatchConfig=event.dispatchConfig;if(dispatchConfig.registrationName){return EventPluginRegistry.registrationNames[dispatchConfig.registrationName]||null;}
for(var phase in dispatchConfig.phasedRegistrationNames){if(!dispatchConfig.phasedRegistrationNames.hasOwnProperty(phase)){continue;}
var PluginModule=EventPluginRegistry.registrationNames[dispatchConfig.phasedRegistrationNames[phase]];if(PluginModule){return PluginModule;}}
return null;},_resetEventPlugins:function(){EventPluginOrder=null;for(var pluginName in namesToPlugins){if(namesToPlugins.hasOwnProperty(pluginName)){delete namesToPlugins[pluginName];}}
EventPluginRegistry.plugins.length=0;var registrationNames=EventPluginRegistry.registrationNames;for(var registrationName in registrationNames){if(registrationNames.hasOwnProperty(registrationName)){delete registrationNames[registrationName];}}
EventPluginRegistry.registrationNamesKeys.length=0;}};module.exports=EventPluginRegistry;},{"./invariant":106}],19:[function(require,module,exports){"use strict";var EventConstants=require("./EventConstants");var invariant=require("./invariant");var topLevelTypes=EventConstants.topLevelTypes;function isEndish(topLevelType){return topLevelType===topLevelTypes.topMouseUp||topLevelType===topLevelTypes.topTouchEnd||topLevelType===topLevelTypes.topTouchCancel;}
function isMoveish(topLevelType){return topLevelType===topLevelTypes.topMouseMove||topLevelType===topLevelTypes.topTouchMove;}
function isStartish(topLevelType){return topLevelType===topLevelTypes.topMouseDown||topLevelType===topLevelTypes.topTouchStart;}
var validateEventDispatches;if(true){validateEventDispatches=function(event){var dispatchListeners=event._dispatchListeners;var dispatchIDs=event._dispatchIDs;var listenersIsArr=Array.isArray(dispatchListeners);var idsIsArr=Array.isArray(dispatchIDs);var IDsLen=idsIsArr?dispatchIDs.length:dispatchIDs?1:0;var listenersLen=listenersIsArr?dispatchListeners.length:dispatchListeners?1:0;invariant(idsIsArr===listenersIsArr&&IDsLen===listenersLen,'EventPluginUtils: Invalid `event`.');};}
function forEachEventDispatch(event,cb){var dispatchListeners=event._dispatchListeners;var dispatchIDs=event._dispatchIDs;if(true){validateEventDispatches(event);}
if(Array.isArray(dispatchListeners)){for(var i=0;i<dispatchListeners.length;i++){if(event.isPropagationStopped()){break;}
cb(event,dispatchListeners[i],dispatchIDs[i]);}}else if(dispatchListeners){cb(event,dispatchListeners,dispatchIDs);}}
function executeDispatch(event,listener,domID){listener(event,domID);}
function executeDispatchesInOrder(event,executeDispatch){forEachEventDispatch(event,executeDispatch);event._dispatchListeners=null;event._dispatchIDs=null;}
function executeDispatchesInOrderStopAtTrue(event){var dispatchListeners=event._dispatchListeners;var dispatchIDs=event._dispatchIDs;if(true){validateEventDispatches(event);}
if(Array.isArray(dispatchListeners)){for(var i=0;i<dispatchListeners.length;i++){if(event.isPropagationStopped()){break;}
if(dispatchListeners[i](event,dispatchIDs[i])){return dispatchIDs[i];}}}else if(dispatchListeners){if(dispatchListeners(event,dispatchIDs)){return dispatchIDs;}}
return null;}
function executeDirectDispatch(event){if(true){validateEventDispatches(event);}
var dispatchListener=event._dispatchListeners;var dispatchID=event._dispatchIDs;invariant(!Array.isArray(dispatchListener),'executeDirectDispatch(...): Invalid `event`.');var res=dispatchListener?dispatchListener(event,dispatchID):null;event._dispatchListeners=null;event._dispatchIDs=null;return res;}
function hasDispatches(event){return!!event._dispatchListeners;}
var EventPluginUtils={isEndish:isEndish,isMoveish:isMoveish,isStartish:isStartish,executeDispatchesInOrder:executeDispatchesInOrder,executeDispatchesInOrderStopAtTrue:executeDispatchesInOrderStopAtTrue,executeDirectDispatch:executeDirectDispatch,hasDispatches:hasDispatches,executeDispatch:executeDispatch};module.exports=EventPluginUtils;},{"./EventConstants":15,"./invariant":106}],20:[function(require,module,exports){"use strict";var CallbackRegistry=require("./CallbackRegistry");var EventConstants=require("./EventConstants");var accumulate=require("./accumulate");var forEachAccumulated=require("./forEachAccumulated");var getListener=CallbackRegistry.getListener;var PropagationPhases=EventConstants.PropagationPhases;var injection={InstanceHandle:null,injectInstanceHandle:function(InjectedInstanceHandle){injection.InstanceHandle=InjectedInstanceHandle;if(true){injection.validate();}},validate:function(){var invalid=!injection.InstanceHandle||!injection.InstanceHandle.traverseTwoPhase||!injection.InstanceHandle.traverseEnterLeave;if(invalid){throw new Error('InstanceHandle not injected before use!');}}};function listenerAtPhase(id,event,propagationPhase){var registrationName=event.dispatchConfig.phasedRegistrationNames[propagationPhase];return getListener(id,registrationName);}
function accumulateDirectionalDispatches(domID,upwards,event){if(true){if(!domID){throw new Error('Dispatching id must not be null');}
injection.validate();}
var phase=upwards?PropagationPhases.bubbled:PropagationPhases.captured;var listener=listenerAtPhase(domID,event,phase);if(listener){event._dispatchListeners=accumulate(event._dispatchListeners,listener);event._dispatchIDs=accumulate(event._dispatchIDs,domID);}}
function accumulateTwoPhaseDispatchesSingle(event){if(event&&event.dispatchConfig.phasedRegistrationNames){injection.InstanceHandle.traverseTwoPhase(event.dispatchMarker,accumulateDirectionalDispatches,event);}}
function accumulateDispatches(id,ignoredDirection,event){if(event&&event.dispatchConfig.registrationName){var registrationName=event.dispatchConfig.registrationName;var listener=getListener(id,registrationName);if(listener){event._dispatchListeners=accumulate(event._dispatchListeners,listener);event._dispatchIDs=accumulate(event._dispatchIDs,id);}}}
function accumulateDirectDispatchesSingle(event){if(event&&event.dispatchConfig.registrationName){accumulateDispatches(event.dispatchMarker,null,event);}}
function accumulateTwoPhaseDispatches(events){if(true){injection.validate();}
forEachAccumulated(events,accumulateTwoPhaseDispatchesSingle);}
function accumulateEnterLeaveDispatches(leave,enter,fromID,toID){if(true){injection.validate();}
injection.InstanceHandle.traverseEnterLeave(fromID,toID,accumulateDispatches,leave,enter);}
function accumulateDirectDispatches(events){if(true){injection.validate();}
forEachAccumulated(events,accumulateDirectDispatchesSingle);}
var EventPropagators={accumulateTwoPhaseDispatches:accumulateTwoPhaseDispatches,accumulateDirectDispatches:accumulateDirectDispatches,accumulateEnterLeaveDispatches:accumulateEnterLeaveDispatches,injection:injection};module.exports=EventPropagators;},{"./CallbackRegistry":5,"./EventConstants":15,"./accumulate":84,"./forEachAccumulated":97}],21:[function(require,module,exports){"use strict";var canUseDOM=typeof window!=='undefined';var ExecutionEnvironment={canUseDOM:canUseDOM,canUseWorkers:typeof Worker!=='undefined',isInWorker:!canUseDOM};module.exports=ExecutionEnvironment;},{}],22:[function(require,module,exports){"use strict";var ReactLink=require("./ReactLink");var ReactStateSetters=require("./ReactStateSetters");var LinkedStateMixin={linkState:function(key){return new ReactLink(this.state[key],ReactStateSetters.createStateKeySetter(this,key));}};module.exports=LinkedStateMixin;},{"./ReactLink":51,"./ReactStateSetters":63}],23:[function(require,module,exports){"use strict";var invariant=require("./invariant");var LinkedValueMixin={_assertLink:function(){invariant(this.props.value==null&&this.props.onChange==null,'Cannot provide a valueLink and a value or onChange event. If you '+'want to use value or onChange, you probably don\'t want to use '+'valueLink');},getValue:function(){if(this.props.valueLink){this._assertLink();return this.props.valueLink.value;}
return this.props.value;},getOnChange:function(){if(this.props.valueLink){this._assertLink();return this._handleLinkedValueChange;}
return this.props.onChange;},_handleLinkedValueChange:function(e){this.props.valueLink.requestChange(e.target.value);}};module.exports=LinkedValueMixin;},{"./invariant":106}],24:[function(require,module,exports){"use strict";var EventConstants=require("./EventConstants");var emptyFunction=require("./emptyFunction");var topLevelTypes=EventConstants.topLevelTypes;var MobileSafariClickEventPlugin={eventTypes:null,extractEvents:function(topLevelType,topLevelTarget,topLevelTargetID,nativeEvent){if(topLevelType===topLevelTypes.topTouchStart){var target=nativeEvent.target;if(target&&!target.onclick){target.onclick=emptyFunction;}}}};module.exports=MobileSafariClickEventPlugin;},{"./EventConstants":15,"./emptyFunction":92}],25:[function(require,module,exports){"use strict";var oneArgumentPooler=function(copyFieldsFrom){var Klass=this;if(Klass.instancePool.length){var instance=Klass.instancePool.pop();Klass.call(instance,copyFieldsFrom);return instance;}else{return new Klass(copyFieldsFrom);}};var twoArgumentPooler=function(a1,a2){var Klass=this;if(Klass.instancePool.length){var instance=Klass.instancePool.pop();Klass.call(instance,a1,a2);return instance;}else{return new Klass(a1,a2);}};var threeArgumentPooler=function(a1,a2,a3){var Klass=this;if(Klass.instancePool.length){var instance=Klass.instancePool.pop();Klass.call(instance,a1,a2,a3);return instance;}else{return new Klass(a1,a2,a3);}};var fiveArgumentPooler=function(a1,a2,a3,a4,a5){var Klass=this;if(Klass.instancePool.length){var instance=Klass.instancePool.pop();Klass.call(instance,a1,a2,a3,a4,a5);return instance;}else{return new Klass(a1,a2,a3,a4,a5);}};var standardReleaser=function(instance){var Klass=this;if(instance.destructor){instance.destructor();}
if(Klass.instancePool.length<Klass.poolSize){Klass.instancePool.push(instance);}};var DEFAULT_POOL_SIZE=10;var DEFAULT_POOLER=oneArgumentPooler;var addPoolingTo=function(CopyConstructor,pooler){var NewKlass=CopyConstructor;NewKlass.instancePool=[];NewKlass.getPooled=pooler||DEFAULT_POOLER;if(!NewKlass.poolSize){NewKlass.poolSize=DEFAULT_POOL_SIZE;}
NewKlass.release=standardReleaser;return NewKlass;};var PooledClass={addPoolingTo:addPoolingTo,oneArgumentPooler:oneArgumentPooler,twoArgumentPooler:twoArgumentPooler,threeArgumentPooler:threeArgumentPooler,fiveArgumentPooler:fiveArgumentPooler};module.exports=PooledClass;},{}],26:[function(require,module,exports){"use strict";var ReactComponent=require("./ReactComponent");var ReactCompositeComponent=require("./ReactCompositeComponent");var ReactCurrentOwner=require("./ReactCurrentOwner");var ReactDOM=require("./ReactDOM");var ReactDOMComponent=require("./ReactDOMComponent");var ReactDefaultInjection=require("./ReactDefaultInjection");var ReactInstanceHandles=require("./ReactInstanceHandles");var ReactMount=require("./ReactMount");var ReactMultiChild=require("./ReactMultiChild");var ReactPerf=require("./ReactPerf");var ReactPropTypes=require("./ReactPropTypes");var ReactServerRendering=require("./ReactServerRendering");var ReactTextComponent=require("./ReactTextComponent");ReactDefaultInjection.inject();var React={DOM:ReactDOM,PropTypes:ReactPropTypes,initializeTouchEvents:function(shouldUseTouch){ReactMount.useTouchEvents=shouldUseTouch;},createClass:ReactCompositeComponent.createClass,constructAndRenderComponent:ReactMount.constructAndRenderComponent,constructAndRenderComponentByID:ReactMount.constructAndRenderComponentByID,renderComponent:ReactPerf.measure('React','renderComponent',ReactMount.renderComponent),renderComponentToString:ReactServerRendering.renderComponentToString,unmountComponentAtNode:ReactMount.unmountComponentAtNode,unmountAndReleaseReactRootNode:ReactMount.unmountAndReleaseReactRootNode,isValidClass:ReactCompositeComponent.isValidClass,isValidComponent:ReactComponent.isValidComponent,__internals:{Component:ReactComponent,CurrentOwner:ReactCurrentOwner,DOMComponent:ReactDOMComponent,InstanceHandles:ReactInstanceHandles,Mount:ReactMount,MultiChild:ReactMultiChild,TextComponent:ReactTextComponent}};React.version='0.5.1';module.exports=React;},{"./ReactComponent":28,"./ReactCompositeComponent":31,"./ReactCurrentOwner":32,"./ReactDOM":33,"./ReactDOMComponent":35,"./ReactDefaultInjection":44,"./ReactInstanceHandles":50,"./ReactMount":53,"./ReactMultiChild":55,"./ReactPerf":58,"./ReactPropTypes":60,"./ReactServerRendering":62,"./ReactTextComponent":64}],27:[function(require,module,exports){"use strict";var PooledClass=require("./PooledClass");var invariant=require("./invariant");var traverseAllChildren=require("./traverseAllChildren");var twoArgumentPooler=PooledClass.twoArgumentPooler;var threeArgumentPooler=PooledClass.threeArgumentPooler;function ForEachBookKeeping(forEachFunction,forEachContext){this.forEachFunction=forEachFunction;this.forEachContext=forEachContext;}
PooledClass.addPoolingTo(ForEachBookKeeping,twoArgumentPooler);function forEachSingleChild(traverseContext,child,name,i){var forEachBookKeeping=traverseContext;forEachBookKeeping.forEachFunction.call(forEachBookKeeping.forEachContext,child,i);}
function forEachChildren(children,forEachFunc,forEachContext){if(children==null){return children;}
var traverseContext=ForEachBookKeeping.getPooled(forEachFunc,forEachContext);traverseAllChildren(children,forEachSingleChild,traverseContext);ForEachBookKeeping.release(traverseContext);}
function MapBookKeeping(mapResult,mapFunction,mapContext){this.mapResult=mapResult;this.mapFunction=mapFunction;this.mapContext=mapContext;}
PooledClass.addPoolingTo(MapBookKeeping,threeArgumentPooler);function mapSingleChildIntoContext(traverseContext,child,name,i){var mapBookKeeping=traverseContext;var mapResult=mapBookKeeping.mapResult;var mappedChild=mapBookKeeping.mapFunction.call(mapBookKeeping.mapContext,child,i);invariant(!mapResult.hasOwnProperty(name),'ReactChildren.map(...): Encountered two children with the same key, '+'`%s`. Children keys must be unique.',name);mapResult[name]=mappedChild;}
function mapChildren(children,func,context){if(children==null){return children;}
var mapResult={};var traverseContext=MapBookKeeping.getPooled(mapResult,func,context);traverseAllChildren(children,mapSingleChildIntoContext,traverseContext);MapBookKeeping.release(traverseContext);return mapResult;}
var ReactChildren={forEach:forEachChildren,map:mapChildren};module.exports=ReactChildren;},{"./PooledClass":25,"./invariant":106,"./traverseAllChildren":125}],28:[function(require,module,exports){"use strict";var ReactComponentEnvironment=require("./ReactComponentEnvironment");var ReactCurrentOwner=require("./ReactCurrentOwner");var ReactOwner=require("./ReactOwner");var ReactUpdates=require("./ReactUpdates");var invariant=require("./invariant");var keyMirror=require("./keyMirror");var merge=require("./merge");var ComponentLifeCycle=keyMirror({MOUNTED:null,UNMOUNTED:null});var ownerHasWarned={};function validateExplicitKey(component){if(component.__keyValidated__||component.props.key!=null){return;}
component.__keyValidated__=true;if(!ReactCurrentOwner.current){return;}
var currentName=ReactCurrentOwner.current.constructor.displayName;if(ownerHasWarned.hasOwnProperty(currentName)){return;}
ownerHasWarned[currentName]=true;var message='Each child in an array should have a unique "key" prop. '+'Check the render method of '+ currentName+'.';if(!component.isOwnedBy(ReactCurrentOwner.current)){var childOwnerName=component.props.__owner__&&component.props.__owner__.constructor.displayName;message+=' It was passed a child from '+ childOwnerName+'.';}
console.warn(message);}
function validateChildKeys(component){if(Array.isArray(component)){for(var i=0;i<component.length;i++){var child=component[i];if(ReactComponent.isValidComponent(child)){validateExplicitKey(child);}}}else if(ReactComponent.isValidComponent(component)){component.__keyValidated__=true;}}
var ReactComponent={isValidComponent:function(object){return!!(object&&typeof object.mountComponentIntoNode==='function'&&typeof object.receiveProps==='function');},getKey:function(component,index){if(component&&component.props&&component.props.key!=null){return'{'+ component.props.key+'}';}
return'['+ index+']';},LifeCycle:ComponentLifeCycle,DOMIDOperations:ReactComponentEnvironment.DOMIDOperations,unmountIDFromEnvironment:ReactComponentEnvironment.unmountIDFromEnvironment,mountImageIntoNode:ReactComponentEnvironment.mountImageIntoNode,ReactReconcileTransaction:ReactComponentEnvironment.ReactReconcileTransaction,Mixin:merge(ReactComponentEnvironment.Mixin,{isMounted:function(){return this._lifeCycleState===ComponentLifeCycle.MOUNTED;},setProps:function(partialProps,callback){this.replaceProps(merge(this._pendingProps||this.props,partialProps),callback);},replaceProps:function(props,callback){invariant(!this.props.__owner__,'replaceProps(...): You called `setProps` or `replaceProps` on a '+'component with an owner. This is an anti-pattern since props will '+'get reactively updated when rendered. Instead, change the owner\'s '+'`render` method to pass the correct value as props to the component '+'where it is created.');invariant(this.isMounted(),'replaceProps(...): Can only update a mounted component.');this._pendingProps=props;ReactUpdates.enqueueUpdate(this,callback);},construct:function(initialProps,children){this.props=initialProps||{};this.props.__owner__=ReactCurrentOwner.current;this._lifeCycleState=ComponentLifeCycle.UNMOUNTED;this._pendingProps=null;this._pendingCallbacks=null;var childrenLength=arguments.length- 1;if(childrenLength===1){if(true){validateChildKeys(children);}
this.props.children=children;}else if(childrenLength>1){var childArray=Array(childrenLength);for(var i=0;i<childrenLength;i++){if(true){validateChildKeys(arguments[i+ 1]);}
childArray[i]=arguments[i+ 1];}
this.props.children=childArray;}},mountComponent:function(rootID,transaction,mountDepth){invariant(!this.isMounted(),'mountComponent(%s, ...): Can only mount an unmounted component.',rootID);var props=this.props;if(props.ref!=null){ReactOwner.addComponentAsRefTo(this,props.ref,props.__owner__);}
this._rootNodeID=rootID;this._lifeCycleState=ComponentLifeCycle.MOUNTED;this._mountDepth=mountDepth;},unmountComponent:function(){invariant(this.isMounted(),'unmountComponent(): Can only unmount a mounted component.');var props=this.props;if(props.ref!=null){ReactOwner.removeComponentAsRefFrom(this,props.ref,props.__owner__);}
ReactComponent.unmountIDFromEnvironment(this._rootNodeID);this._rootNodeID=null;this._lifeCycleState=ComponentLifeCycle.UNMOUNTED;},receiveProps:function(nextProps,transaction){invariant(this.isMounted(),'receiveProps(...): Can only update a mounted component.');this._pendingProps=nextProps;this._performUpdateIfNecessary(transaction);},performUpdateIfNecessary:function(){var transaction=ReactComponent.ReactReconcileTransaction.getPooled();transaction.perform(this._performUpdateIfNecessary,this,transaction);ReactComponent.ReactReconcileTransaction.release(transaction);},_performUpdateIfNecessary:function(transaction){if(this._pendingProps==null){return;}
var prevProps=this.props;this.props=this._pendingProps;this._pendingProps=null;this.updateComponent(transaction,prevProps);},updateComponent:function(transaction,prevProps){var props=this.props;if(props.__owner__!==prevProps.__owner__||props.ref!==prevProps.ref){if(prevProps.ref!=null){ReactOwner.removeComponentAsRefFrom(this,prevProps.ref,prevProps.__owner__);}
if(props.ref!=null){ReactOwner.addComponentAsRefTo(this,props.ref,props.__owner__);}}},mountComponentIntoNode:function(rootID,container,shouldReuseMarkup){var transaction=ReactComponent.ReactReconcileTransaction.getPooled();transaction.perform(this._mountComponentIntoNode,this,rootID,container,transaction,shouldReuseMarkup);ReactComponent.ReactReconcileTransaction.release(transaction);},_mountComponentIntoNode:function(rootID,container,transaction,shouldReuseMarkup){var markup=this.mountComponent(rootID,transaction,0);ReactComponent.mountImageIntoNode(markup,container,shouldReuseMarkup);},isOwnedBy:function(owner){return this.props.__owner__===owner;},getSiblingByRef:function(ref){var owner=this.props.__owner__;if(!owner||!owner.refs){return null;}
return owner.refs[ref];}})};module.exports=ReactComponent;},{"./ReactComponentEnvironment":30,"./ReactCurrentOwner":32,"./ReactOwner":57,"./ReactUpdates":69,"./invariant":106,"./keyMirror":112,"./merge":115}],29:[function(require,module,exports){"use strict";var ReactDOMIDOperations=require("./ReactDOMIDOperations");var ReactMarkupChecksum=require("./ReactMarkupChecksum");var ReactMount=require("./ReactMount");var ReactReconcileTransaction=require("./ReactReconcileTransaction");var getReactRootElementInContainer=require("./getReactRootElementInContainer");var invariant=require("./invariant");var mutateHTMLNodeWithMarkup=require("./mutateHTMLNodeWithMarkup");var ELEMENT_NODE_TYPE=1;var DOC_NODE_TYPE=9;var ReactComponentBrowserEnvironment={Mixin:{getDOMNode:function(){invariant(this.isMounted(),'getDOMNode(): A component must be mounted to have a DOM node.');return ReactMount.getNode(this._rootNodeID);}},ReactReconcileTransaction:ReactReconcileTransaction,DOMIDOperations:ReactDOMIDOperations,unmountIDFromEnvironment:function(rootNodeID){ReactMount.purgeID(rootNodeID);},mountImageIntoNode:function(markup,container,shouldReuseMarkup){invariant(container&&(container.nodeType===ELEMENT_NODE_TYPE||container.nodeType===DOC_NODE_TYPE&&ReactMount.allowFullPageRender),'mountComponentIntoNode(...): Target container is not valid.');if(shouldReuseMarkup){if(ReactMarkupChecksum.canReuseMarkup(markup,getReactRootElementInContainer(container))){return;}else{if(true){console.warn('React attempted to use reuse markup in a container but the '+'checksum was invalid. This generally means that you are using '+'server rendering and the markup generated on the server was '+'not what the client was expecting. React injected new markup '+'to compensate which works but you have lost many of the '+'benefits of server rendering. Instead, figure out why the '+'markup being generated is different on the client or server.');}}}
if(container.nodeType===DOC_NODE_TYPE){mutateHTMLNodeWithMarkup(container.documentElement,markup);return;}
var parent=container.parentNode;if(parent){var next=container.nextSibling;parent.removeChild(container);container.innerHTML=markup;if(next){parent.insertBefore(container,next);}else{parent.appendChild(container);}}else{container.innerHTML=markup;}}};module.exports=ReactComponentBrowserEnvironment;},{"./ReactDOMIDOperations":37,"./ReactMarkupChecksum":52,"./ReactMount":53,"./ReactReconcileTransaction":61,"./getReactRootElementInContainer":103,"./invariant":106,"./mutateHTMLNodeWithMarkup":119}],30:[function(require,module,exports){var ReactComponentBrowserEnvironment=require("./ReactComponentBrowserEnvironment");var ReactComponentEnvironment=ReactComponentBrowserEnvironment;module.exports=ReactComponentEnvironment;},{"./ReactComponentBrowserEnvironment":29}],31:[function(require,module,exports){"use strict";var ReactComponent=require("./ReactComponent");var ReactCurrentOwner=require("./ReactCurrentOwner");var ReactOwner=require("./ReactOwner");var ReactPerf=require("./ReactPerf");var ReactPropTransferer=require("./ReactPropTransferer");var ReactUpdates=require("./ReactUpdates");var invariant=require("./invariant");var keyMirror=require("./keyMirror");var merge=require("./merge");var mixInto=require("./mixInto");var objMap=require("./objMap");var SpecPolicy=keyMirror({DEFINE_ONCE:null,DEFINE_MANY:null,OVERRIDE_BASE:null,DEFINE_MANY_MERGED:null});var ReactCompositeComponentInterface={mixins:SpecPolicy.DEFINE_MANY,propTypes:SpecPolicy.DEFINE_ONCE,getDefaultProps:SpecPolicy.DEFINE_MANY_MERGED,getInitialState:SpecPolicy.DEFINE_MANY_MERGED,render:SpecPolicy.DEFINE_ONCE,componentWillMount:SpecPolicy.DEFINE_MANY,componentDidMount:SpecPolicy.DEFINE_MANY,componentWillReceiveProps:SpecPolicy.DEFINE_MANY,shouldComponentUpdate:SpecPolicy.DEFINE_ONCE,componentWillUpdate:SpecPolicy.DEFINE_MANY,componentDidUpdate:SpecPolicy.DEFINE_MANY,componentWillUnmount:SpecPolicy.DEFINE_MANY,updateComponent:SpecPolicy.OVERRIDE_BASE};var RESERVED_SPEC_KEYS={displayName:function(Constructor,displayName){Constructor.displayName=displayName;},mixins:function(Constructor,mixins){if(mixins){for(var i=0;i<mixins.length;i++){mixSpecIntoComponent(Constructor,mixins[i]);}}},propTypes:function(Constructor,propTypes){Constructor.propTypes=propTypes;}};function validateMethodOverride(proto,name){var specPolicy=ReactCompositeComponentInterface[name];if(ReactCompositeComponentMixin.hasOwnProperty(name)){invariant(specPolicy===SpecPolicy.OVERRIDE_BASE,'ReactCompositeComponentInterface: You are attempting to override '+'`%s` from your class specification. Ensure that your method names '+'do not overlap with React methods.',name);}
if(proto.hasOwnProperty(name)){invariant(specPolicy===SpecPolicy.DEFINE_MANY||specPolicy===SpecPolicy.DEFINE_MANY_MERGED,'ReactCompositeComponentInterface: You are attempting to define '+'`%s` on your component more than once. This conflict may be due '+'to a mixin.',name);}}
function validateLifeCycleOnReplaceState(instance){var compositeLifeCycleState=instance._compositeLifeCycleState;invariant(instance.isMounted()||compositeLifeCycleState===CompositeLifeCycle.MOUNTING,'replaceState(...): Can only update a mounted or mounting component.');invariant(compositeLifeCycleState!==CompositeLifeCycle.RECEIVING_STATE&&compositeLifeCycleState!==CompositeLifeCycle.UNMOUNTING,'replaceState(...): Cannot update while unmounting component or during '+'an existing state transition (such as within `render`).');}
function mixSpecIntoComponent(Constructor,spec){var proto=Constructor.prototype;for(var name in spec){var property=spec[name];if(!spec.hasOwnProperty(name)||!property){continue;}
validateMethodOverride(proto,name);if(RESERVED_SPEC_KEYS.hasOwnProperty(name)){RESERVED_SPEC_KEYS[name](Constructor,property);}else{var isCompositeComponentMethod=name in ReactCompositeComponentInterface;var isInherited=name in proto;var markedDontBind=property.__reactDontBind;var isFunction=typeof property==='function';var shouldAutoBind=isFunction&&!isCompositeComponentMethod&&!isInherited&&!markedDontBind;if(shouldAutoBind){if(!proto.__reactAutoBindMap){proto.__reactAutoBindMap={};}
proto.__reactAutoBindMap[name]=property;proto[name]=property;}else{if(isInherited){if(ReactCompositeComponentInterface[name]===SpecPolicy.DEFINE_MANY_MERGED){proto[name]=createMergedResultFunction(proto[name],property);}else{proto[name]=createChainedFunction(proto[name],property);}}else{proto[name]=property;}}}}}
function mergeObjectsWithNoDuplicateKeys(one,two){invariant(one&&two&&typeof one==='object'&&typeof two==='object','mergeObjectsWithNoDuplicateKeys(): Cannot merge non-objects');objMap(two,function(value,key){invariant(one[key]===undefined,'mergeObjectsWithNoDuplicateKeys(): '+'Tried to merge two objects with the same key: %s',key);one[key]=value;});return one;}
function createMergedResultFunction(one,two){return function mergedResult(){return mergeObjectsWithNoDuplicateKeys(one.apply(this,arguments),two.apply(this,arguments));};}
function createChainedFunction(one,two){return function chainedFunction(){one.apply(this,arguments);two.apply(this,arguments);};}
var CompositeLifeCycle=keyMirror({MOUNTING:null,UNMOUNTING:null,RECEIVING_PROPS:null,RECEIVING_STATE:null});var ReactCompositeComponentMixin={construct:function(initialProps,children){ReactComponent.Mixin.construct.apply(this,arguments);this.state=null;this._pendingState=null;this._compositeLifeCycleState=null;},isMounted:function(){return ReactComponent.Mixin.isMounted.call(this)&&this._compositeLifeCycleState!==CompositeLifeCycle.MOUNTING;},mountComponent:ReactPerf.measure('ReactCompositeComponent','mountComponent',function(rootID,transaction,mountDepth){ReactComponent.Mixin.mountComponent.call(this,rootID,transaction,mountDepth);this._compositeLifeCycleState=CompositeLifeCycle.MOUNTING;this._defaultProps=this.getDefaultProps?this.getDefaultProps():null;this._processProps(this.props);if(this.__reactAutoBindMap){this._bindAutoBindMethods();}
this.state=this.getInitialState?this.getInitialState():null;this._pendingState=null;this._pendingForceUpdate=false;if(this.componentWillMount){this.componentWillMount();if(this._pendingState){this.state=this._pendingState;this._pendingState=null;}}
this._renderedComponent=this._renderValidatedComponent();this._compositeLifeCycleState=null;var markup=this._renderedComponent.mountComponent(rootID,transaction,mountDepth+ 1);if(this.componentDidMount){transaction.getReactMountReady().enqueue(this,this.componentDidMount);}
return markup;}),unmountComponent:function(){this._compositeLifeCycleState=CompositeLifeCycle.UNMOUNTING;if(this.componentWillUnmount){this.componentWillUnmount();}
this._compositeLifeCycleState=null;this._defaultProps=null;ReactComponent.Mixin.unmountComponent.call(this);this._renderedComponent.unmountComponent();this._renderedComponent=null;if(this.refs){this.refs=null;}},setState:function(partialState,callback){this.replaceState(merge(this._pendingState||this.state,partialState),callback);},replaceState:function(completeState,callback){validateLifeCycleOnReplaceState(this);this._pendingState=completeState;ReactUpdates.enqueueUpdate(this,callback);},_processProps:function(props){var propName;var defaultProps=this._defaultProps;for(propName in defaultProps){if(!(propName in props)){props[propName]=defaultProps[propName];}}
var propTypes=this.constructor.propTypes;if(propTypes){var componentName=this.constructor.displayName;for(propName in propTypes){var checkProp=propTypes[propName];if(checkProp){checkProp(props,propName,componentName);}}}},performUpdateIfNecessary:function(){var compositeLifeCycleState=this._compositeLifeCycleState;if(compositeLifeCycleState===CompositeLifeCycle.MOUNTING||compositeLifeCycleState===CompositeLifeCycle.RECEIVING_PROPS){return;}
ReactComponent.Mixin.performUpdateIfNecessary.call(this);},_performUpdateIfNecessary:function(transaction){if(this._pendingProps==null&&this._pendingState==null&&!this._pendingForceUpdate){return;}
var nextProps=this.props;if(this._pendingProps!=null){nextProps=this._pendingProps;this._processProps(nextProps);this._pendingProps=null;this._compositeLifeCycleState=CompositeLifeCycle.RECEIVING_PROPS;if(this.componentWillReceiveProps){this.componentWillReceiveProps(nextProps,transaction);}}
this._compositeLifeCycleState=CompositeLifeCycle.RECEIVING_STATE;var nextState=this._pendingState||this.state;this._pendingState=null;if(this._pendingForceUpdate||!this.shouldComponentUpdate||this.shouldComponentUpdate(nextProps,nextState)){this._pendingForceUpdate=false;this._performComponentUpdate(nextProps,nextState,transaction);}else{this.props=nextProps;this.state=nextState;}
this._compositeLifeCycleState=null;},_performComponentUpdate:function(nextProps,nextState,transaction){var prevProps=this.props;var prevState=this.state;if(this.componentWillUpdate){this.componentWillUpdate(nextProps,nextState,transaction);}
this.props=nextProps;this.state=nextState;this.updateComponent(transaction,prevProps,prevState);if(this.componentDidUpdate){transaction.getReactMountReady().enqueue(this,this.componentDidUpdate.bind(this,prevProps,prevState));}},updateComponent:ReactPerf.measure('ReactCompositeComponent','updateComponent',function(transaction,prevProps,prevState){ReactComponent.Mixin.updateComponent.call(this,transaction,prevProps);var currentComponent=this._renderedComponent;var nextComponent=this._renderValidatedComponent();if(currentComponent.constructor===nextComponent.constructor){currentComponent.receiveProps(nextComponent.props,transaction);}else{var thisID=this._rootNodeID;var currentComponentID=currentComponent._rootNodeID;currentComponent.unmountComponent();this._renderedComponent=nextComponent;var nextMarkup=nextComponent.mountComponent(thisID,transaction,this._mountDepth+ 1);ReactComponent.DOMIDOperations.dangerouslyReplaceNodeWithMarkupByID(currentComponentID,nextMarkup);}}),forceUpdate:function(callback){var compositeLifeCycleState=this._compositeLifeCycleState;invariant(this.isMounted()||compositeLifeCycleState===CompositeLifeCycle.MOUNTING,'forceUpdate(...): Can only force an update on mounted or mounting '+'components.');invariant(compositeLifeCycleState!==CompositeLifeCycle.RECEIVING_STATE&&compositeLifeCycleState!==CompositeLifeCycle.UNMOUNTING,'forceUpdate(...): Cannot force an update while unmounting component '+'or during an existing state transition (such as within `render`).');this._pendingForceUpdate=true;ReactUpdates.enqueueUpdate(this,callback);},_renderValidatedComponent:function(){var renderedComponent;ReactCurrentOwner.current=this;try{renderedComponent=this.render();}catch(error){throw error;}finally{ReactCurrentOwner.current=null;}
invariant(ReactComponent.isValidComponent(renderedComponent),'%s.render(): A valid ReactComponent must be returned.',this.constructor.displayName||'ReactCompositeComponent');return renderedComponent;},_bindAutoBindMethods:function(){for(var autoBindKey in this.__reactAutoBindMap){if(!this.__reactAutoBindMap.hasOwnProperty(autoBindKey)){continue;}
var method=this.__reactAutoBindMap[autoBindKey];this[autoBindKey]=this._bindAutoBindMethod(method);}},_bindAutoBindMethod:function(method){var component=this;var boundMethod=function(){return method.apply(component,arguments);};if(true){boundMethod.__reactBoundContext=component;boundMethod.__reactBoundMethod=method;boundMethod.__reactBoundArguments=null;var componentName=component.constructor.displayName;var _bind=boundMethod.bind;boundMethod.bind=function(newThis){if(newThis!==component&&newThis!==null){console.warn('bind(): React component methods may only be bound to the '+'component instance. See '+ componentName);}else if(arguments.length===1){console.warn('bind(): You are binding a component method to the component. '+'React does this for you automatically in a high-performance '+'way, so you can safely remove this call. See '+ componentName);return boundMethod;}
var reboundMethod=_bind.apply(boundMethod,arguments);reboundMethod.__reactBoundContext=component;reboundMethod.__reactBoundMethod=method;reboundMethod.__reactBoundArguments=Array.prototype.slice.call(arguments,1);return reboundMethod;};}
return boundMethod;}};var ReactCompositeComponentBase=function(){};mixInto(ReactCompositeComponentBase,ReactComponent.Mixin);mixInto(ReactCompositeComponentBase,ReactOwner.Mixin);mixInto(ReactCompositeComponentBase,ReactPropTransferer.Mixin);mixInto(ReactCompositeComponentBase,ReactCompositeComponentMixin);var ReactCompositeComponent={LifeCycle:CompositeLifeCycle,Base:ReactCompositeComponentBase,createClass:function(spec){var Constructor=function(){};Constructor.prototype=new ReactCompositeComponentBase();Constructor.prototype.constructor=Constructor;mixSpecIntoComponent(Constructor,spec);invariant(Constructor.prototype.render,'createClass(...): Class specification must implement a `render` method.');if(true){if(Constructor.prototype.componentShouldUpdate){console.warn((spec.displayName||'A component')+' has a method called '+'componentShouldUpdate(). Did you mean shouldComponentUpdate()? '+'The name is phrased as a question because the function is '+'expected to return a value.');}}
for(var methodName in ReactCompositeComponentInterface){if(!Constructor.prototype[methodName]){Constructor.prototype[methodName]=null;}}
var ConvenienceConstructor=function(props,children){var instance=new Constructor();instance.construct.apply(instance,arguments);return instance;};ConvenienceConstructor.componentConstructor=Constructor;ConvenienceConstructor.originalSpec=spec;return ConvenienceConstructor;},isValidClass:function(componentClass){return componentClass instanceof Function&&'componentConstructor'in componentClass&&componentClass.componentConstructor instanceof Function;}};module.exports=ReactCompositeComponent;},{"./ReactComponent":28,"./ReactCurrentOwner":32,"./ReactOwner":57,"./ReactPerf":58,"./ReactPropTransferer":59,"./ReactUpdates":69,"./invariant":106,"./keyMirror":112,"./merge":115,"./mixInto":118,"./objMap":121}],32:[function(require,module,exports){"use strict";var ReactCurrentOwner={current:null};module.exports=ReactCurrentOwner;},{}],33:[function(require,module,exports){"use strict";var ReactDOMComponent=require("./ReactDOMComponent");var mergeInto=require("./mergeInto");var objMapKeyVal=require("./objMapKeyVal");function createDOMComponentClass(tag,omitClose){var Constructor=function(){};Constructor.prototype=new ReactDOMComponent(tag,omitClose);Constructor.prototype.constructor=Constructor;Constructor.displayName=tag;var ConvenienceConstructor=function(props,children){var instance=new Constructor();instance.construct.apply(instance,arguments);return instance;};ConvenienceConstructor.componentConstructor=Constructor;return ConvenienceConstructor;}
var ReactDOM=objMapKeyVal({a:false,abbr:false,address:false,area:false,article:false,aside:false,audio:false,b:false,base:false,bdi:false,bdo:false,big:false,blockquote:false,body:false,br:true,button:false,canvas:false,caption:false,cite:false,code:false,col:true,colgroup:false,data:false,datalist:false,dd:false,del:false,details:false,dfn:false,div:false,dl:false,dt:false,em:false,embed:true,fieldset:false,figcaption:false,figure:false,footer:false,form:false,h1:false,h2:false,h3:false,h4:false,h5:false,h6:false,head:false,header:false,hr:true,html:false,i:false,iframe:false,img:true,input:true,ins:false,kbd:false,keygen:true,label:false,legend:false,li:false,link:false,main:false,map:false,mark:false,menu:false,menuitem:false,meta:true,meter:false,nav:false,noscript:false,object:false,ol:false,optgroup:false,option:false,output:false,p:false,param:true,pre:false,progress:false,q:false,rp:false,rt:false,ruby:false,s:false,samp:false,script:false,section:false,select:false,small:false,source:false,span:false,strong:false,style:false,sub:false,summary:false,sup:false,table:false,tbody:false,td:false,textarea:false,tfoot:false,th:false,thead:false,time:false,title:false,tr:false,track:true,u:false,ul:false,'var':false,video:false,wbr:false,circle:false,g:false,line:false,path:false,polyline:false,rect:false,svg:false,text:false},createDOMComponentClass);var injection={injectComponentClasses:function(componentClasses){mergeInto(ReactDOM,componentClasses);}};ReactDOM.injection=injection;module.exports=ReactDOM;},{"./ReactDOMComponent":35,"./mergeInto":117,"./objMapKeyVal":122}],34:[function(require,module,exports){"use strict";var ReactCompositeComponent=require("./ReactCompositeComponent");var ReactDOM=require("./ReactDOM");var keyMirror=require("./keyMirror");var button=ReactDOM.button;var mouseListenerNames=keyMirror({onClick:true,onDoubleClick:true,onMouseDown:true,onMouseMove:true,onMouseUp:true,onClickCapture:true,onDoubleClickCapture:true,onMouseDownCapture:true,onMouseMoveCapture:true,onMouseUpCapture:true});var ReactDOMButton=ReactCompositeComponent.createClass({render:function(){var props={};for(var key in this.props){if(this.props.hasOwnProperty(key)&&(!this.props.disabled||!mouseListenerNames[key])){props[key]=this.props[key];}}
return button(props,this.props.children);}});module.exports=ReactDOMButton;},{"./ReactCompositeComponent":31,"./ReactDOM":33,"./keyMirror":112}],35:[function(require,module,exports){"use strict";var CSSPropertyOperations=require("./CSSPropertyOperations");var DOMProperty=require("./DOMProperty");var DOMPropertyOperations=require("./DOMPropertyOperations");var ReactComponent=require("./ReactComponent");var ReactEventEmitter=require("./ReactEventEmitter");var ReactMultiChild=require("./ReactMultiChild");var ReactMount=require("./ReactMount");var ReactPerf=require("./ReactPerf");var escapeTextForBrowser=require("./escapeTextForBrowser");var invariant=require("./invariant");var keyOf=require("./keyOf");var merge=require("./merge");var mixInto=require("./mixInto");var putListener=ReactEventEmitter.putListener;var deleteListener=ReactEventEmitter.deleteListener;var registrationNames=ReactEventEmitter.registrationNames;var CONTENT_TYPES={'string':true,'number':true};var STYLE=keyOf({style:null});function assertValidProps(props){if(!props){return;}
invariant(props.children==null||props.dangerouslySetInnerHTML==null,'Can only set one of `children` or `props.dangerouslySetInnerHTML`.');invariant(props.style==null||typeof props.style==='object','The `style` prop expects a mapping from style properties to values, '+'not a string.');}
function ReactDOMComponent(tag,omitClose){this._tagOpen='<'+ tag;this._tagClose=omitClose?'':'</'+ tag+'>';this.tagName=tag.toUpperCase();}
ReactDOMComponent.Mixin={mountComponent:ReactPerf.measure('ReactDOMComponent','mountComponent',function(rootID,transaction,mountDepth){ReactComponent.Mixin.mountComponent.call(this,rootID,transaction,mountDepth);assertValidProps(this.props);return(this._createOpenTagMarkup()+
this._createContentMarkup(transaction)+
this._tagClose);}),_createOpenTagMarkup:function(){var props=this.props;var ret=this._tagOpen;for(var propKey in props){if(!props.hasOwnProperty(propKey)){continue;}
var propValue=props[propKey];if(propValue==null){continue;}
if(registrationNames[propKey]){putListener(this._rootNodeID,propKey,propValue);}else{if(propKey===STYLE){if(propValue){propValue=props.style=merge(props.style);}
propValue=CSSPropertyOperations.createMarkupForStyles(propValue);}
var markup=DOMPropertyOperations.createMarkupForProperty(propKey,propValue);if(markup){ret+=' '+ markup;}}}
var escapedID=escapeTextForBrowser(this._rootNodeID);return ret+' '+ ReactMount.ATTR_NAME+'="'+ escapedID+'">';},_createContentMarkup:function(transaction){var innerHTML=this.props.dangerouslySetInnerHTML;if(innerHTML!=null){if(innerHTML.__html!=null){return innerHTML.__html;}}else{var contentToUse=CONTENT_TYPES[typeof this.props.children]?this.props.children:null;var childrenToUse=contentToUse!=null?null:this.props.children;if(contentToUse!=null){return escapeTextForBrowser(contentToUse);}else if(childrenToUse!=null){var mountImages=this.mountChildren(childrenToUse,transaction);return mountImages.join('');}}
return'';},receiveProps:function(nextProps,transaction){assertValidProps(nextProps);ReactComponent.Mixin.receiveProps.call(this,nextProps,transaction);},updateComponent:ReactPerf.measure('ReactDOMComponent','updateComponent',function(transaction,prevProps){ReactComponent.Mixin.updateComponent.call(this,transaction,prevProps);this._updateDOMProperties(prevProps);this._updateDOMChildren(prevProps,transaction);}),_updateDOMProperties:function(lastProps){var nextProps=this.props;var propKey;var styleName;var styleUpdates;for(propKey in lastProps){if(nextProps.hasOwnProperty(propKey)||!lastProps.hasOwnProperty(propKey)){continue;}
if(propKey===STYLE){var lastStyle=lastProps[propKey];for(styleName in lastStyle){if(lastStyle.hasOwnProperty(styleName)){styleUpdates=styleUpdates||{};styleUpdates[styleName]='';}}}else if(registrationNames[propKey]){deleteListener(this._rootNodeID,propKey);}else if(DOMProperty.isStandardName[propKey]||DOMProperty.isCustomAttribute(propKey)){ReactComponent.DOMIDOperations.deletePropertyByID(this._rootNodeID,propKey);}}
for(propKey in nextProps){var nextProp=nextProps[propKey];var lastProp=lastProps[propKey];if(!nextProps.hasOwnProperty(propKey)||nextProp===lastProp){continue;}
if(propKey===STYLE){if(nextProp){nextProp=nextProps.style=merge(nextProp);}
if(lastProp){for(styleName in lastProp){if(lastProp.hasOwnProperty(styleName)&&!nextProp.hasOwnProperty(styleName)){styleUpdates=styleUpdates||{};styleUpdates[styleName]='';}}
for(styleName in nextProp){if(nextProp.hasOwnProperty(styleName)&&lastProp[styleName]!==nextProp[styleName]){styleUpdates=styleUpdates||{};styleUpdates[styleName]=nextProp[styleName];}}}else{styleUpdates=nextProp;}}else if(registrationNames[propKey]){putListener(this._rootNodeID,propKey,nextProp);}else if(DOMProperty.isStandardName[propKey]||DOMProperty.isCustomAttribute(propKey)){ReactComponent.DOMIDOperations.updatePropertyByID(this._rootNodeID,propKey,nextProp);}}
if(styleUpdates){ReactComponent.DOMIDOperations.updateStylesByID(this._rootNodeID,styleUpdates);}},_updateDOMChildren:function(lastProps,transaction){var nextProps=this.props;var lastContent=CONTENT_TYPES[typeof lastProps.children]?lastProps.children:null;var nextContent=CONTENT_TYPES[typeof nextProps.children]?nextProps.children:null;var lastHtml=lastProps.dangerouslySetInnerHTML&&lastProps.dangerouslySetInnerHTML.__html;var nextHtml=nextProps.dangerouslySetInnerHTML&&nextProps.dangerouslySetInnerHTML.__html;var lastChildren=lastContent!=null?null:lastProps.children;var nextChildren=nextContent!=null?null:nextProps.children;var lastHasContentOrHtml=lastContent!=null||lastHtml!=null;var nextHasContentOrHtml=nextContent!=null||nextHtml!=null;if(lastChildren!=null&&nextChildren==null){this.updateChildren(null,transaction);}else if(lastHasContentOrHtml&&!nextHasContentOrHtml){this.updateTextContent('');}
if(nextContent!=null){if(lastContent!==nextContent){this.updateTextContent(''+ nextContent);}}else if(nextHtml!=null){if(lastHtml!==nextHtml){ReactComponent.DOMIDOperations.updateInnerHTMLByID(this._rootNodeID,nextHtml);}}else if(nextChildren!=null){this.updateChildren(nextChildren,transaction);}},unmountComponent:function(){ReactEventEmitter.deleteAllListeners(this._rootNodeID);ReactComponent.Mixin.unmountComponent.call(this);this.unmountChildren();}};mixInto(ReactDOMComponent,ReactComponent.Mixin);mixInto(ReactDOMComponent,ReactDOMComponent.Mixin);mixInto(ReactDOMComponent,ReactMultiChild.Mixin);module.exports=ReactDOMComponent;},{"./CSSPropertyOperations":4,"./DOMProperty":9,"./DOMPropertyOperations":10,"./ReactComponent":28,"./ReactEventEmitter":46,"./ReactMount":53,"./ReactMultiChild":55,"./ReactPerf":58,"./escapeTextForBrowser":93,"./invariant":106,"./keyOf":113,"./merge":115,"./mixInto":118}],36:[function(require,module,exports){"use strict";var ReactCompositeComponent=require("./ReactCompositeComponent");var ReactDOM=require("./ReactDOM");var ReactEventEmitter=require("./ReactEventEmitter");var EventConstants=require("./EventConstants");var form=ReactDOM.form;var ReactDOMForm=ReactCompositeComponent.createClass({render:function(){return this.transferPropsTo(form(null,this.props.children));},componentDidMount:function(node){ReactEventEmitter.trapBubbledEvent(EventConstants.topLevelTypes.topSubmit,'submit',node);}});module.exports=ReactDOMForm;},{"./EventConstants":15,"./ReactCompositeComponent":31,"./ReactDOM":33,"./ReactEventEmitter":46}],37:[function(require,module,exports){"use strict";var CSSPropertyOperations=require("./CSSPropertyOperations");var DOMChildrenOperations=require("./DOMChildrenOperations");var DOMPropertyOperations=require("./DOMPropertyOperations");var ReactMount=require("./ReactMount");var getTextContentAccessor=require("./getTextContentAccessor");var invariant=require("./invariant");var INVALID_PROPERTY_ERRORS={dangerouslySetInnerHTML:'`dangerouslySetInnerHTML` must be set using `updateInnerHTMLByID()`.',style:'`style` must be set using `updateStylesByID()`.'};var textContentAccessor=getTextContentAccessor()||'NA';var LEADING_SPACE=/^ /;var ReactDOMIDOperations={updatePropertyByID:function(id,name,value){var node=ReactMount.getNode(id);invariant(!INVALID_PROPERTY_ERRORS.hasOwnProperty(name),'updatePropertyByID(...): %s',INVALID_PROPERTY_ERRORS[name]);if(value!=null){DOMPropertyOperations.setValueForProperty(node,name,value);}else{DOMPropertyOperations.deleteValueForProperty(node,name);}},deletePropertyByID:function(id,name,value){var node=ReactMount.getNode(id);invariant(!INVALID_PROPERTY_ERRORS.hasOwnProperty(name),'updatePropertyByID(...): %s',INVALID_PROPERTY_ERRORS[name]);DOMPropertyOperations.deleteValueForProperty(node,name,value);},updatePropertiesByID:function(id,properties){for(var name in properties){if(!properties.hasOwnProperty(name)){continue;}
ReactDOMIDOperations.updatePropertiesByID(id,name,properties[name]);}},updateStylesByID:function(id,styles){var node=ReactMount.getNode(id);CSSPropertyOperations.setValueForStyles(node,styles);},updateInnerHTMLByID:function(id,html){var node=ReactMount.getNode(id);node.innerHTML=html.replace(LEADING_SPACE,'&nbsp;');},updateTextContentByID:function(id,content){var node=ReactMount.getNode(id);node[textContentAccessor]=content;},dangerouslyReplaceNodeWithMarkupByID:function(id,markup){var node=ReactMount.getNode(id);DOMChildrenOperations.dangerouslyReplaceNodeWithMarkup(node,markup);},dangerouslyProcessChildrenUpdates:function(updates,markup){for(var i=0;i<updates.length;i++){updates[i].parentNode=ReactMount.getNode(updates[i].parentID);}
DOMChildrenOperations.processUpdates(updates,markup);}};module.exports=ReactDOMIDOperations;},{"./CSSPropertyOperations":4,"./DOMChildrenOperations":8,"./DOMPropertyOperations":10,"./ReactMount":53,"./getTextContentAccessor":104,"./invariant":106}],38:[function(require,module,exports){"use strict";var DOMPropertyOperations=require("./DOMPropertyOperations");var LinkedValueMixin=require("./LinkedValueMixin");var ReactCompositeComponent=require("./ReactCompositeComponent");var ReactDOM=require("./ReactDOM");var ReactMount=require("./ReactMount");var invariant=require("./invariant");var merge=require("./merge");var input=ReactDOM.input;var instancesByReactID={};var ReactDOMInput=ReactCompositeComponent.createClass({mixins:[LinkedValueMixin],getInitialState:function(){var defaultValue=this.props.defaultValue;return{checked:this.props.defaultChecked||false,value:defaultValue!=null?defaultValue:''};},shouldComponentUpdate:function(){return!this._isChanging;},render:function(){var props=merge(this.props);props.defaultChecked=null;props.defaultValue=null;props.checked=this.props.checked!=null?this.props.checked:this.state.checked;var value=this.getValue();props.value=value!=null?value:this.state.value;props.onChange=this._handleChange;return input(props,this.props.children);},componentDidMount:function(rootNode){var id=ReactMount.getID(rootNode);instancesByReactID[id]=this;},componentWillUnmount:function(){var rootNode=this.getDOMNode();var id=ReactMount.getID(rootNode);delete instancesByReactID[id];},componentDidUpdate:function(prevProps,prevState,rootNode){if(this.props.checked!=null){DOMPropertyOperations.setValueForProperty(rootNode,'checked',this.props.checked||false);}
var value=this.getValue();if(value!=null){DOMPropertyOperations.setValueForProperty(rootNode,'value',''+ value);}},_handleChange:function(event){var returnValue;var onChange=this.getOnChange();if(onChange){this._isChanging=true;returnValue=onChange(event);this._isChanging=false;}
this.setState({checked:event.target.checked,value:event.target.value});var name=this.props.name;if(this.props.type==='radio'&&name!=null){var rootNode=this.getDOMNode();var group=document.getElementsByName(name);for(var i=0,groupLen=group.length;i<groupLen;i++){var otherNode=group[i];if(otherNode===rootNode||otherNode.nodeName!=='INPUT'||otherNode.type!=='radio'||otherNode.form!==rootNode.form){continue;}
var otherID=ReactMount.getID(otherNode);invariant(otherID,'ReactDOMInput: Mixing React and non-React radio inputs with the '+'same `name` is not supported.');var otherInstance=instancesByReactID[otherID];invariant(otherInstance,'ReactDOMInput: Unknown radio button ID %s.',otherID);otherInstance.setState({checked:false});}}
return returnValue;}});module.exports=ReactDOMInput;},{"./DOMPropertyOperations":10,"./LinkedValueMixin":23,"./ReactCompositeComponent":31,"./ReactDOM":33,"./ReactMount":53,"./invariant":106,"./merge":115}],39:[function(require,module,exports){"use strict";var ReactCompositeComponent=require("./ReactCompositeComponent");var ReactDOM=require("./ReactDOM");var option=ReactDOM.option;var ReactDOMOption=ReactCompositeComponent.createClass({componentWillMount:function(){if(this.props.selected!=null){if(true){console.warn('Use the `defaultValue` or `value` props on <select> instead of '+'setting `selected` on <option>.');}}},render:function(){return option(this.props,this.props.children);}});module.exports=ReactDOMOption;},{"./ReactCompositeComponent":31,"./ReactDOM":33}],40:[function(require,module,exports){"use strict";var LinkedValueMixin=require("./LinkedValueMixin");var ReactCompositeComponent=require("./ReactCompositeComponent");var ReactDOM=require("./ReactDOM");var invariant=require("./invariant");var merge=require("./merge");var select=ReactDOM.select;function selectValueType(props,propName,componentName){if(props[propName]==null){return;}
if(props.multiple){invariant(Array.isArray(props[propName]),'The `%s` prop supplied to <select> must be an array if `multiple` is '+'true.',propName);}else{invariant(!Array.isArray(props[propName]),'The `%s` prop supplied to <select> must be a scalar value if '+'`multiple` is false.',propName);}}
function updateOptions(){var propValue=this.getValue();var value=propValue!=null?propValue:this.state.value;var options=this.getDOMNode().options;var selectedValue=''+ value;for(var i=0,l=options.length;i<l;i++){var selected=this.props.multiple?selectedValue.indexOf(options[i].value)>=0:selected=options[i].value===selectedValue;if(selected!==options[i].selected){options[i].selected=selected;}}}
var ReactDOMSelect=ReactCompositeComponent.createClass({mixins:[LinkedValueMixin],propTypes:{defaultValue:selectValueType,value:selectValueType},getInitialState:function(){return{value:this.props.defaultValue||(this.props.multiple?[]:'')};},componentWillReceiveProps:function(nextProps){if(!this.props.multiple&&nextProps.multiple){this.setState({value:[this.state.value]});}else if(this.props.multiple&&!nextProps.multiple){this.setState({value:this.state.value[0]});}},shouldComponentUpdate:function(){return!this._isChanging;},render:function(){var props=merge(this.props);props.onChange=this._handleChange;props.value=null;return select(props,this.props.children);},componentDidMount:updateOptions,componentDidUpdate:updateOptions,_handleChange:function(event){var returnValue;var onChange=this.getOnChange();if(onChange){this._isChanging=true;returnValue=onChange(event);this._isChanging=false;}
var selectedValue;if(this.props.multiple){selectedValue=[];var options=event.target.options;for(var i=0,l=options.length;i<l;i++){if(options[i].selected){selectedValue.push(options[i].value);}}}else{selectedValue=event.target.value;}
this.setState({value:selectedValue});return returnValue;}});module.exports=ReactDOMSelect;},{"./LinkedValueMixin":23,"./ReactCompositeComponent":31,"./ReactDOM":33,"./invariant":106,"./merge":115}],41:[function(require,module,exports){"use strict";var getNodeForCharacterOffset=require("./getNodeForCharacterOffset");var getTextContentAccessor=require("./getTextContentAccessor");function getIEOffsets(node){var selection=document.selection;var selectedRange=selection.createRange();var selectedLength=selectedRange.text.length;var fromStart=selectedRange.duplicate();fromStart.moveToElementText(node);fromStart.setEndPoint('EndToStart',selectedRange);var startOffset=fromStart.text.length;var endOffset=startOffset+ selectedLength;return{start:startOffset,end:endOffset};}
function getModernOffsets(node){var selection=window.getSelection();if(selection.rangeCount===0){return null;}
var anchorNode=selection.anchorNode;var anchorOffset=selection.anchorOffset;var focusNode=selection.focusNode;var focusOffset=selection.focusOffset;var currentRange=selection.getRangeAt(0);var rangeLength=currentRange.toString().length;var tempRange=currentRange.cloneRange();tempRange.selectNodeContents(node);tempRange.setEnd(currentRange.startContainer,currentRange.startOffset);var start=tempRange.toString().length;var end=start+ rangeLength;var detectionRange=document.createRange();detectionRange.setStart(anchorNode,anchorOffset);detectionRange.setEnd(focusNode,focusOffset);var isBackward=detectionRange.collapsed;detectionRange.detach();return{start:isBackward?end:start,end:isBackward?start:end};}
function setIEOffsets(node,offsets){var range=document.selection.createRange().duplicate();var start,end;if(typeof offsets.end==='undefined'){start=offsets.start;end=start;}else if(offsets.start>offsets.end){start=offsets.end;end=offsets.start;}else{start=offsets.start;end=offsets.end;}
range.moveToElementText(node);range.moveStart('character',start);range.setEndPoint('EndToStart',range);range.moveEnd('character',end- start);range.select();}
function setModernOffsets(node,offsets){var selection=window.getSelection();var length=node[getTextContentAccessor()].length;var start=Math.min(offsets.start,length);var end=typeof offsets.end==='undefined'?start:Math.min(offsets.end,length);var startMarker=getNodeForCharacterOffset(node,start);var endMarker=getNodeForCharacterOffset(node,end);if(startMarker&&endMarker){var range=document.createRange();range.setStart(startMarker.node,startMarker.offset);selection.removeAllRanges();selection.addRange(range);selection.extend(endMarker.node,endMarker.offset);range.detach();}}
var ReactDOMSelection={getOffsets:function(node){var getOffsets=document.selection?getIEOffsets:getModernOffsets;return getOffsets(node);},setOffsets:function(node,offsets){var setOffsets=document.selection?setIEOffsets:setModernOffsets;setOffsets(node,offsets);}};module.exports=ReactDOMSelection;},{"./getNodeForCharacterOffset":102,"./getTextContentAccessor":104}],42:[function(require,module,exports){"use strict";var DOMPropertyOperations=require("./DOMPropertyOperations");var LinkedValueMixin=require("./LinkedValueMixin");var ReactCompositeComponent=require("./ReactCompositeComponent");var ReactDOM=require("./ReactDOM");var invariant=require("./invariant");var merge=require("./merge");var textarea=ReactDOM.textarea;var ReactDOMTextarea=ReactCompositeComponent.createClass({mixins:[LinkedValueMixin],getInitialState:function(){var defaultValue=this.props.defaultValue;var children=this.props.children;if(children!=null){if(true){console.warn('Use the `defaultValue` or `value` props instead of setting '+'children on <textarea>.');}
invariant(defaultValue==null,'If you supply `defaultValue` on a <textarea>, do not pass children.');if(Array.isArray(children)){invariant(children.length<=1,'<textarea> can only have at most one child.');children=children[0];}
defaultValue=''+ children;}
if(defaultValue==null){defaultValue='';}
var value=this.getValue();return{initialValue:''+(value!=null?value:defaultValue),value:defaultValue};},shouldComponentUpdate:function(){return!this._isChanging;},render:function(){var props=merge(this.props);var value=this.getValue();invariant(props.dangerouslySetInnerHTML==null,'`dangerouslySetInnerHTML` does not make sense on <textarea>.');props.defaultValue=null;props.value=value!=null?value:this.state.value;props.onChange=this._handleChange;return textarea(props,this.state.initialValue);},componentDidUpdate:function(prevProps,prevState,rootNode){var value=this.getValue();if(value!=null){DOMPropertyOperations.setValueForProperty(rootNode,'value',''+ value);}},_handleChange:function(event){var returnValue;var onChange=this.getOnChange();if(onChange){this._isChanging=true;returnValue=onChange(event);this._isChanging=false;}
this.setState({value:event.target.value});return returnValue;}});module.exports=ReactDOMTextarea;},{"./DOMPropertyOperations":10,"./LinkedValueMixin":23,"./ReactCompositeComponent":31,"./ReactDOM":33,"./invariant":106,"./merge":115}],43:[function(require,module,exports){"use strict";var ReactUpdates=require("./ReactUpdates");var Transaction=require("./Transaction");var emptyFunction=require("./emptyFunction");var mixInto=require("./mixInto");var RESET_BATCHED_UPDATES={initialize:emptyFunction,close:function(){ReactDefaultBatchingStrategy.isBatchingUpdates=false;}};var FLUSH_BATCHED_UPDATES={initialize:emptyFunction,close:ReactUpdates.flushBatchedUpdates.bind(ReactUpdates)};var TRANSACTION_WRAPPERS=[FLUSH_BATCHED_UPDATES,RESET_BATCHED_UPDATES];function ReactDefaultBatchingStrategyTransaction(){this.reinitializeTransaction();}
mixInto(ReactDefaultBatchingStrategyTransaction,Transaction.Mixin);mixInto(ReactDefaultBatchingStrategyTransaction,{getTransactionWrappers:function(){return TRANSACTION_WRAPPERS;}});var transaction=new ReactDefaultBatchingStrategyTransaction();var ReactDefaultBatchingStrategy={isBatchingUpdates:false,batchedUpdates:function(callback,param){var alreadyBatchingUpdates=ReactDefaultBatchingStrategy.isBatchingUpdates;ReactDefaultBatchingStrategy.isBatchingUpdates=true;if(alreadyBatchingUpdates){callback(param);}else{transaction.perform(callback,null,param);}}};module.exports=ReactDefaultBatchingStrategy;},{"./ReactUpdates":69,"./Transaction":82,"./emptyFunction":92,"./mixInto":118}],44:[function(require,module,exports){"use strict";var ReactDOM=require("./ReactDOM");var ReactDOMButton=require("./ReactDOMButton");var ReactDOMForm=require("./ReactDOMForm");var ReactDOMInput=require("./ReactDOMInput");var ReactDOMOption=require("./ReactDOMOption");var ReactDOMSelect=require("./ReactDOMSelect");var ReactDOMTextarea=require("./ReactDOMTextarea");var ReactEventEmitter=require("./ReactEventEmitter");var ReactEventTopLevelCallback=require("./ReactEventTopLevelCallback");var ReactPerf=require("./ReactPerf");var DefaultDOMPropertyConfig=require("./DefaultDOMPropertyConfig");var DOMProperty=require("./DOMProperty");var ChangeEventPlugin=require("./ChangeEventPlugin");var CompositionEventPlugin=require("./CompositionEventPlugin");var DefaultEventPluginOrder=require("./DefaultEventPluginOrder");var EnterLeaveEventPlugin=require("./EnterLeaveEventPlugin");var EventPluginHub=require("./EventPluginHub");var MobileSafariClickEventPlugin=require("./MobileSafariClickEventPlugin");var ReactInstanceHandles=require("./ReactInstanceHandles");var SelectEventPlugin=require("./SelectEventPlugin");var SimpleEventPlugin=require("./SimpleEventPlugin");var ReactDefaultBatchingStrategy=require("./ReactDefaultBatchingStrategy");var ReactUpdates=require("./ReactUpdates");function inject(){ReactEventEmitter.TopLevelCallbackCreator=ReactEventTopLevelCallback;EventPluginHub.injection.injectEventPluginOrder(DefaultEventPluginOrder);EventPluginHub.injection.injectInstanceHandle(ReactInstanceHandles);EventPluginHub.injection.injectEventPluginsByName({SimpleEventPlugin:SimpleEventPlugin,EnterLeaveEventPlugin:EnterLeaveEventPlugin,ChangeEventPlugin:ChangeEventPlugin,CompositionEventPlugin:CompositionEventPlugin,MobileSafariClickEventPlugin:MobileSafariClickEventPlugin,SelectEventPlugin:SelectEventPlugin});ReactDOM.injection.injectComponentClasses({button:ReactDOMButton,form:ReactDOMForm,input:ReactDOMInput,option:ReactDOMOption,select:ReactDOMSelect,textarea:ReactDOMTextarea});DOMProperty.injection.injectDOMPropertyConfig(DefaultDOMPropertyConfig);if(true){ReactPerf.injection.injectMeasure(require("./ReactDefaultPerf").measure);}
ReactUpdates.injection.injectBatchingStrategy(ReactDefaultBatchingStrategy);}
module.exports={inject:inject};},{"./ChangeEventPlugin":6,"./CompositionEventPlugin":7,"./DOMProperty":9,"./DefaultDOMPropertyConfig":12,"./DefaultEventPluginOrder":13,"./EnterLeaveEventPlugin":14,"./EventPluginHub":17,"./MobileSafariClickEventPlugin":24,"./ReactDOM":33,"./ReactDOMButton":34,"./ReactDOMForm":36,"./ReactDOMInput":38,"./ReactDOMOption":39,"./ReactDOMSelect":40,"./ReactDOMTextarea":42,"./ReactDefaultBatchingStrategy":43,"./ReactDefaultPerf":45,"./ReactEventEmitter":46,"./ReactEventTopLevelCallback":48,"./ReactInstanceHandles":50,"./ReactPerf":58,"./ReactUpdates":69,"./SelectEventPlugin":71,"./SimpleEventPlugin":72}],45:[function(require,module,exports){"use strict";var performanceNow=require("./performanceNow");var ReactDefaultPerf={};if(true){ReactDefaultPerf={getInfo:function(objName,fnName){if(!this.info[objName]||!this.info[objName][fnName]){return null;}
return this.info[objName][fnName];},getLogs:function(objName,fnName){if(!this.getInfo(objName,fnName)){return null;}
return this.logs.filter(function(log){return log.objName===objName&&log.fnName===fnName;});},getRawRenderHistory:function(rootID){var history=[];var logs=this.logs.filter(function(log){return log.reactID.indexOf(rootID)===0;}).reverse();var subHistory=[];logs.forEach(function(log,i){if(i&&log.reactID===rootID&&logs[i- 1].reactID!==rootID){subHistory.length&&history.push(subHistory);subHistory=[];}
subHistory.push(log);});if(subHistory.length){history.push(subHistory);}
return history.reverse();},getRenderHistory:function(rootID){var history=this.getRawRenderHistory(rootID);return history.map(function(subHistory){var headerString=('log# Component (execution time) [bloat from logging]\n'+'================================================================\n');return headerString+ subHistory.map(function(log){var indents='\t'+ Array(log.reactID.split('.[').length).join('  ');var delta=_microTime(log.timing.delta);var bloat=_microTime(log.timing.timeToLog);return log.index+ indents+ log.name+' ('+ delta+'ms)'+' ['+ bloat+'ms]';}).join('\n');});},printRenderHistory:function(rootID,index){var history=this.getRenderHistory(rootID);if(!history[index]){console.warn('Index',index,'isn\'t available! '+'The render history is',history.length,'long.');return;}
console.log('Loading render history #'+(index+ 1)+' of '+ history.length+':\n'+ history[index]);},printHeatmapLegend:function(){if(!this.options.heatmap.enabled){return;}
var max=this.info.React&&this.info.React.renderComponent&&this.info.React.renderComponent.max;if(max){var logStr='Heatmap: ';for(var ii=0;ii<=10*max;ii+=max){logStr+='%c '+(Math.round(ii)/ 10) + 'ms ';
}
console.log(logStr,'background-color: hsla(100, 100%, 50%, 0.6);','background-color: hsla( 90, 100%, 50%, 0.6);','background-color: hsla( 80, 100%, 50%, 0.6);','background-color: hsla( 70, 100%, 50%, 0.6);','background-color: hsla( 60, 100%, 50%, 0.6);','background-color: hsla( 50, 100%, 50%, 0.6);','background-color: hsla( 40, 100%, 50%, 0.6);','background-color: hsla( 30, 100%, 50%, 0.6);','background-color: hsla( 20, 100%, 50%, 0.6);','background-color: hsla( 10, 100%, 50%, 0.6);','background-color: hsla(  0, 100%, 50%, 0.6);');}},measure:function(objName,fnName,func){var info=_getNewInfo(objName,fnName);var fnArgs=_getFnArguments(func);return function(){var timeBeforeFn=performanceNow();var fnReturn=func.apply(this,arguments);var timeAfterFn=performanceNow();var args={};for(var i=0;i<arguments.length;i++){args[fnArgs[i]]=arguments[i];}
var log={index:ReactDefaultPerf.logs.length,fnName:fnName,objName:objName,timing:{before:timeBeforeFn,after:timeAfterFn,delta:timeAfterFn- timeBeforeFn}};ReactDefaultPerf.logs.push(log);var callback=_getCallback(objName,fnName);callback&&callback(this,args,fnReturn,log,info);log.timing.timeToLog=performanceNow()- timeAfterFn;return fnReturn;};},info:{},logs:[],options:{heatmap:{enabled:true}}};var _getNewInfo=function(objName,fnName){var info=ReactDefaultPerf.getInfo(objName,fnName);if(info){return info;}
ReactDefaultPerf.info[objName]=ReactDefaultPerf.info[objName]||{};return ReactDefaultPerf.info[objName][fnName]={getLogs:function(){return ReactDefaultPerf.getLogs(objName,fnName);}};};var _getFnArguments=function(fn){var STRIP_COMMENTS=/((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;var fnStr=fn.toString().replace(STRIP_COMMENTS,'');fnStr=fnStr.slice(fnStr.indexOf('(')+ 1,fnStr.indexOf(')'));return fnStr.match(/([^\s,]+)/g);};var _getCallback=function(objName,fnName){switch(objName+'.'+ fnName){case'React.renderComponent':return _renderComponentCallback;case'ReactDOMComponent.mountComponent':case'ReactDOMComponent.updateComponent':return _nativeComponentCallback;case'ReactCompositeComponent.mountComponent':case'ReactCompositeComponent.updateComponent':return _compositeComponentCallback;default:return null;}};var _renderComponentCallback=function(component,args,fnReturn,log,info){log.name=args.nextComponent.constructor.displayName||'[unknown]';log.reactID=fnReturn._rootNodeID||null;if(ReactDefaultPerf.options.heatmap.enabled){var container=args.container;if(!container.loggedByReactDefaultPerf){container.loggedByReactDefaultPerf=true;info.components=info.components||[];info.components.push(container);}
container.count=container.count||0;container.count+=log.timing.delta;info.max=info.max||0;if(container.count>info.max){info.max=container.count;info.components.forEach(function(component){_setHue(component,100- 100*component.count/info.max);});}else{_setHue(container,100- 100*container.count/info.max);}}};var _nativeComponentCallback=function(component,args,fnReturn,log,info){log.name=component.tagName||'[unknown]';log.reactID=component._rootNodeID;};var _compositeComponentCallback=function(component,args,fnReturn,log,info){log.name=component.constructor.displayName||'[unknown]';log.reactID=component._rootNodeID;};var _setHue=function(el,hue){el.style.backgroundColor='hsla('+ hue+', 100%, 50%, 0.6)';};var _microTime=function(time){return Math.round(time*1000)/ 1000;
};}
module.exports=ReactDefaultPerf;},{"./performanceNow":123}],46:[function(require,module,exports){"use strict";var EventConstants=require("./EventConstants");var EventListener=require("./EventListener");var EventPluginHub=require("./EventPluginHub");var ExecutionEnvironment=require("./ExecutionEnvironment");var ReactEventEmitterMixin=require("./ReactEventEmitterMixin");var ViewportMetrics=require("./ViewportMetrics");var invariant=require("./invariant");var isEventSupported=require("./isEventSupported");var merge=require("./merge");function trapBubbledEvent(topLevelType,handlerBaseName,element){EventListener.listen(element,handlerBaseName,ReactEventEmitter.TopLevelCallbackCreator.createTopLevelCallback(topLevelType));}
function trapCapturedEvent(topLevelType,handlerBaseName,element){EventListener.capture(element,handlerBaseName,ReactEventEmitter.TopLevelCallbackCreator.createTopLevelCallback(topLevelType));}
function registerScrollValueMonitoring(){var refresh=ViewportMetrics.refreshScrollValues;EventListener.listen(window,'scroll',refresh);EventListener.listen(window,'resize',refresh);}
var ReactEventEmitter=merge(ReactEventEmitterMixin,{TopLevelCallbackCreator:null,ensureListening:function(touchNotMouse,contentDocument){invariant(ExecutionEnvironment.canUseDOM,'ensureListening(...): Cannot toggle event listening in a Worker '+'thread. This is likely a bug in the framework. Please report '+'immediately.');invariant(ReactEventEmitter.TopLevelCallbackCreator,'ensureListening(...): Cannot be called without a top level callback '+'creator being injected.');ReactEventEmitterMixin.ensureListening.call(ReactEventEmitter,{touchNotMouse:touchNotMouse,contentDocument:contentDocument});},setEnabled:function(enabled){invariant(ExecutionEnvironment.canUseDOM,'setEnabled(...): Cannot toggle event listening in a Worker thread. '+'This is likely a bug in the framework. Please report immediately.');if(ReactEventEmitter.TopLevelCallbackCreator){ReactEventEmitter.TopLevelCallbackCreator.setEnabled(enabled);}},isEnabled:function(){return!!(ReactEventEmitter.TopLevelCallbackCreator&&ReactEventEmitter.TopLevelCallbackCreator.isEnabled());},listenAtTopLevel:function(touchNotMouse,contentDocument){invariant(!contentDocument._isListening,'listenAtTopLevel(...): Cannot setup top-level listener more than once.');var topLevelTypes=EventConstants.topLevelTypes;var mountAt=contentDocument;registerScrollValueMonitoring();trapBubbledEvent(topLevelTypes.topMouseOver,'mouseover',mountAt);trapBubbledEvent(topLevelTypes.topMouseDown,'mousedown',mountAt);trapBubbledEvent(topLevelTypes.topMouseUp,'mouseup',mountAt);trapBubbledEvent(topLevelTypes.topMouseMove,'mousemove',mountAt);trapBubbledEvent(topLevelTypes.topMouseOut,'mouseout',mountAt);trapBubbledEvent(topLevelTypes.topClick,'click',mountAt);trapBubbledEvent(topLevelTypes.topDoubleClick,'dblclick',mountAt);if(touchNotMouse){trapBubbledEvent(topLevelTypes.topTouchStart,'touchstart',mountAt);trapBubbledEvent(topLevelTypes.topTouchEnd,'touchend',mountAt);trapBubbledEvent(topLevelTypes.topTouchMove,'touchmove',mountAt);trapBubbledEvent(topLevelTypes.topTouchCancel,'touchcancel',mountAt);}
trapBubbledEvent(topLevelTypes.topKeyUp,'keyup',mountAt);trapBubbledEvent(topLevelTypes.topKeyPress,'keypress',mountAt);trapBubbledEvent(topLevelTypes.topKeyDown,'keydown',mountAt);trapBubbledEvent(topLevelTypes.topInput,'input',mountAt);trapBubbledEvent(topLevelTypes.topChange,'change',mountAt);trapBubbledEvent(topLevelTypes.topSelectionChange,'selectionchange',mountAt);trapBubbledEvent(topLevelTypes.topCompositionEnd,'compositionend',mountAt);trapBubbledEvent(topLevelTypes.topCompositionStart,'compositionstart',mountAt);trapBubbledEvent(topLevelTypes.topCompositionUpdate,'compositionupdate',mountAt);if(isEventSupported('drag')){trapBubbledEvent(topLevelTypes.topDrag,'drag',mountAt);trapBubbledEvent(topLevelTypes.topDragEnd,'dragend',mountAt);trapBubbledEvent(topLevelTypes.topDragEnter,'dragenter',mountAt);trapBubbledEvent(topLevelTypes.topDragExit,'dragexit',mountAt);trapBubbledEvent(topLevelTypes.topDragLeave,'dragleave',mountAt);trapBubbledEvent(topLevelTypes.topDragOver,'dragover',mountAt);trapBubbledEvent(topLevelTypes.topDragStart,'dragstart',mountAt);trapBubbledEvent(topLevelTypes.topDrop,'drop',mountAt);}
if(isEventSupported('wheel')){trapBubbledEvent(topLevelTypes.topWheel,'wheel',mountAt);}else if(isEventSupported('mousewheel')){trapBubbledEvent(topLevelTypes.topWheel,'mousewheel',mountAt);}else{trapBubbledEvent(topLevelTypes.topWheel,'DOMMouseScroll',mountAt);}
if(isEventSupported('scroll',true)){trapCapturedEvent(topLevelTypes.topScroll,'scroll',mountAt);}else{trapBubbledEvent(topLevelTypes.topScroll,'scroll',window);}
if(isEventSupported('focus',true)){trapCapturedEvent(topLevelTypes.topFocus,'focus',mountAt);trapCapturedEvent(topLevelTypes.topBlur,'blur',mountAt);}else if(isEventSupported('focusin')){trapBubbledEvent(topLevelTypes.topFocus,'focusin',mountAt);trapBubbledEvent(topLevelTypes.topBlur,'focusout',mountAt);}
if(isEventSupported('copy')){trapBubbledEvent(topLevelTypes.topCopy,'copy',mountAt);trapBubbledEvent(topLevelTypes.topCut,'cut',mountAt);trapBubbledEvent(topLevelTypes.topPaste,'paste',mountAt);}},registrationNames:EventPluginHub.registrationNames,putListener:EventPluginHub.putListener,getListener:EventPluginHub.getListener,deleteListener:EventPluginHub.deleteListener,deleteAllListeners:EventPluginHub.deleteAllListeners,trapBubbledEvent:trapBubbledEvent,trapCapturedEvent:trapCapturedEvent});module.exports=ReactEventEmitter;},{"./EventConstants":15,"./EventListener":16,"./EventPluginHub":17,"./ExecutionEnvironment":21,"./ReactEventEmitterMixin":47,"./ViewportMetrics":83,"./invariant":106,"./isEventSupported":107,"./merge":115}],47:[function(require,module,exports){"use strict";var EventPluginHub=require("./EventPluginHub");var ReactUpdates=require("./ReactUpdates");function runEventQueueInBatch(events){EventPluginHub.enqueueEvents(events);EventPluginHub.processEventQueue();}
var ReactEventEmitterMixin={_isListening:false,ensureListening:function(config){if(!config.contentDocument._reactIsListening){this.listenAtTopLevel(config.touchNotMouse,config.contentDocument);config.contentDocument._reactIsListening=true;}},handleTopLevel:function(topLevelType,topLevelTarget,topLevelTargetID,nativeEvent){var events=EventPluginHub.extractEvents(topLevelType,topLevelTarget,topLevelTargetID,nativeEvent);ReactUpdates.batchedUpdates(runEventQueueInBatch,events);}};module.exports=ReactEventEmitterMixin;},{"./EventPluginHub":17,"./ReactUpdates":69}],48:[function(require,module,exports){"use strict";var ReactEventEmitter=require("./ReactEventEmitter");var ReactMount=require("./ReactMount");var getEventTarget=require("./getEventTarget");var _topLevelListenersEnabled=true;var ReactEventTopLevelCallback={setEnabled:function(enabled){_topLevelListenersEnabled=!!enabled;},isEnabled:function(){return _topLevelListenersEnabled;},createTopLevelCallback:function(topLevelType){return function(nativeEvent){if(!_topLevelListenersEnabled){return;}
if(nativeEvent.srcElement&&nativeEvent.srcElement!==nativeEvent.target){nativeEvent.target=nativeEvent.srcElement;}
var topLevelTarget=ReactMount.getFirstReactDOM(getEventTarget(nativeEvent))||window;var topLevelTargetID=ReactMount.getID(topLevelTarget)||'';ReactEventEmitter.handleTopLevel(topLevelType,topLevelTarget,topLevelTargetID,nativeEvent);};}};module.exports=ReactEventTopLevelCallback;},{"./ReactEventEmitter":46,"./ReactMount":53,"./getEventTarget":100}],49:[function(require,module,exports){"use strict";var ReactDOMSelection=require("./ReactDOMSelection");var getActiveElement=require("./getActiveElement");var nodeContains=require("./nodeContains");function isInDocument(node){return nodeContains(document.documentElement,node);}
var ReactInputSelection={hasSelectionCapabilities:function(elem){return elem&&((elem.nodeName==='INPUT'&&elem.type==='text')||elem.nodeName==='TEXTAREA'||elem.contentEditable==='true');},getSelectionInformation:function(){var focusedElem=getActiveElement();return{focusedElem:focusedElem,selectionRange:ReactInputSelection.hasSelectionCapabilities(focusedElem)?ReactInputSelection.getSelection(focusedElem):null};},restoreSelection:function(priorSelectionInformation){var curFocusedElem=getActiveElement();var priorFocusedElem=priorSelectionInformation.focusedElem;var priorSelectionRange=priorSelectionInformation.selectionRange;if(curFocusedElem!==priorFocusedElem&&isInDocument(priorFocusedElem)){if(ReactInputSelection.hasSelectionCapabilities(priorFocusedElem)){ReactInputSelection.setSelection(priorFocusedElem,priorSelectionRange);}
priorFocusedElem.focus();}},getSelection:function(input){var selection;if('selectionStart'in input){selection={start:input.selectionStart,end:input.selectionEnd};}else if(document.selection&&input.nodeName==='INPUT'){var range=document.selection.createRange();if(range.parentElement()===input){selection={start:-range.moveStart('character',-input.value.length),end:-range.moveEnd('character',-input.value.length)};}}else{selection=ReactDOMSelection.getOffsets(input);}
return selection||{start:0,end:0};},setSelection:function(input,offsets){var start=offsets.start;var end=offsets.end;if(typeof end==='undefined'){end=start;}
if('selectionStart'in input){input.selectionStart=start;input.selectionEnd=Math.min(end,input.value.length);}else if(document.selection&&input.nodeName==='INPUT'){var range=input.createTextRange();range.collapse(true);range.moveStart('character',start);range.moveEnd('character',end- start);range.select();}else{ReactDOMSelection.setOffsets(input,offsets);}}};module.exports=ReactInputSelection;},{"./ReactDOMSelection":41,"./getActiveElement":99,"./nodeContains":120}],50:[function(require,module,exports){"use strict";var invariant=require("./invariant");var SEPARATOR='.';var SEPARATOR_LENGTH=SEPARATOR.length;var MAX_TREE_DEPTH=100;var GLOBAL_MOUNT_POINT_MAX=9999999;function getReactRootIDString(index){return SEPARATOR+'r['+ index.toString(36)+']';}
function isBoundary(id,index){return id.charAt(index)===SEPARATOR||index===id.length;}
function isValidID(id){return id===''||(id.charAt(0)===SEPARATOR&&id.charAt(id.length- 1)!==SEPARATOR);}
function isAncestorIDOf(ancestorID,descendantID){return(descendantID.indexOf(ancestorID)===0&&isBoundary(descendantID,ancestorID.length));}
function getParentID(id){return id?id.substr(0,id.lastIndexOf(SEPARATOR)):'';}
function getNextDescendantID(ancestorID,destinationID){invariant(isValidID(ancestorID)&&isValidID(destinationID),'getNextDescendantID(%s, %s): Received an invalid React DOM ID.',ancestorID,destinationID);invariant(isAncestorIDOf(ancestorID,destinationID),'getNextDescendantID(...): React has made an invalid assumption about '+'the DOM hierarchy. Expected `%s` to be an ancestor of `%s`.',ancestorID,destinationID);if(ancestorID===destinationID){return ancestorID;}
var start=ancestorID.length+ SEPARATOR_LENGTH;for(var i=start;i<destinationID.length;i++){if(isBoundary(destinationID,i)){break;}}
return destinationID.substr(0,i);}
function getFirstCommonAncestorID(oneID,twoID){var minLength=Math.min(oneID.length,twoID.length);if(minLength===0){return'';}
var lastCommonMarkerIndex=0;for(var i=0;i<=minLength;i++){if(isBoundary(oneID,i)&&isBoundary(twoID,i)){lastCommonMarkerIndex=i;}else if(oneID.charAt(i)!==twoID.charAt(i)){break;}}
var longestCommonID=oneID.substr(0,lastCommonMarkerIndex);invariant(isValidID(longestCommonID),'getFirstCommonAncestorID(%s, %s): Expected a valid React DOM ID: %s',oneID,twoID,longestCommonID);return longestCommonID;}
function traverseParentPath(start,stop,cb,arg,skipFirst,skipLast){start=start||'';stop=stop||'';invariant(start!==stop,'traverseParentPath(...): Cannot traverse from and to the same ID, `%s`.',start);var traverseUp=isAncestorIDOf(stop,start);invariant(traverseUp||isAncestorIDOf(start,stop),'traverseParentPath(%s, %s, ...): Cannot traverse from two IDs that do '+'not have a parent path.',start,stop);var depth=0;var traverse=traverseUp?getParentID:getNextDescendantID;for(var id=start;;id=traverse(id,stop)){if((!skipFirst||id!==start)&&(!skipLast||id!==stop)){cb(id,traverseUp,arg);}
if(id===stop){break;}
invariant(depth++<MAX_TREE_DEPTH,'traverseParentPath(%s, %s, ...): Detected an infinite loop while '+'traversing the React DOM ID tree. This may be due to malformed IDs: %s',start,stop);}}
var ReactInstanceHandles={createReactRootID:function(){return getReactRootIDString(Math.ceil(Math.random()*GLOBAL_MOUNT_POINT_MAX));},createReactID:function(rootID,name){return rootID+ SEPARATOR+ name;},getReactRootIDFromNodeID:function(id){var regexResult=/\.r\[[^\]]+\]/.exec(id);return regexResult&&regexResult[0];},traverseEnterLeave:function(leaveID,enterID,cb,upArg,downArg){var ancestorID=getFirstCommonAncestorID(leaveID,enterID);if(ancestorID!==leaveID){traverseParentPath(leaveID,ancestorID,cb,upArg,false,true);}
if(ancestorID!==enterID){traverseParentPath(ancestorID,enterID,cb,downArg,true,false);}},traverseTwoPhase:function(targetID,cb,arg){if(targetID){traverseParentPath('',targetID,cb,arg,true,false);traverseParentPath(targetID,'',cb,arg,false,true);}},_getFirstCommonAncestorID:getFirstCommonAncestorID,_getNextDescendantID:getNextDescendantID,isAncestorIDOf:isAncestorIDOf,SEPARATOR:SEPARATOR};module.exports=ReactInstanceHandles;},{"./invariant":106}],51:[function(require,module,exports){"use strict";function ReactLink(value,requestChange){this.value=value;this.requestChange=requestChange;}
module.exports=ReactLink;},{}],52:[function(require,module,exports){"use strict";var adler32=require("./adler32");var ReactMarkupChecksum={CHECKSUM_ATTR_NAME:'data-react-checksum',addChecksumToMarkup:function(markup){var checksum=adler32(markup);return markup.replace('>',' '+ ReactMarkupChecksum.CHECKSUM_ATTR_NAME+'="'+ checksum+'">');},canReuseMarkup:function(markup,element){var existingChecksum=element.getAttribute(ReactMarkupChecksum.CHECKSUM_ATTR_NAME);existingChecksum=existingChecksum&&parseInt(existingChecksum,10);var markupChecksum=adler32(markup);return markupChecksum===existingChecksum;}};module.exports=ReactMarkupChecksum;},{"./adler32":85}],53:[function(require,module,exports){"use strict";var ReactEventEmitter=require("./ReactEventEmitter");var ReactInstanceHandles=require("./ReactInstanceHandles");var $=require("./$");var getReactRootElementInContainer=require("./getReactRootElementInContainer");var invariant=require("./invariant");var nodeContains=require("./nodeContains");var SEPARATOR=ReactInstanceHandles.SEPARATOR;var ATTR_NAME='data-reactid';var nodeCache={};var ELEMENT_NODE_TYPE=1;var DOC_NODE_TYPE=9;var instancesByReactRootID={};var containersByReactRootID={};if(true){var rootElementsByReactRootID={};}
function getReactRootID(container){var rootElement=getReactRootElementInContainer(container);return rootElement&&ReactMount.getID(rootElement);}
function getID(node){var id=internalGetID(node);if(id){if(nodeCache.hasOwnProperty(id)){var cached=nodeCache[id];if(cached!==node){invariant(!isValid(cached,id),'ReactMount: Two valid but unequal nodes with the same `%s`: %s',ATTR_NAME,id);nodeCache[id]=node;}}else{nodeCache[id]=node;}}
return id;}
function internalGetID(node){return node&&node.getAttribute&&node.getAttribute(ATTR_NAME)||'';}
function setID(node,id){var oldID=internalGetID(node);if(oldID!==id){delete nodeCache[oldID];}
node.setAttribute(ATTR_NAME,id);nodeCache[id]=node;}
function getNode(id){if(!nodeCache.hasOwnProperty(id)||!isValid(nodeCache[id],id)){nodeCache[id]=ReactMount.findReactNodeByID(id);}
return nodeCache[id];}
function isValid(node,id){if(node){invariant(internalGetID(node)===id,'ReactMount: Unexpected modification of `%s`',ATTR_NAME);var container=ReactMount.findReactContainerForID(id);if(container&&nodeContains(container,node)){return true;}}
return false;}
function purgeID(id){delete nodeCache[id];}
var ReactMount={allowFullPageRender:false,totalInstantiationTime:0,totalInjectionTime:0,useTouchEvents:false,_instancesByReactRootID:instancesByReactRootID,scrollMonitor:function(container,renderCallback){renderCallback();},prepareEnvironmentForDOM:function(container){invariant(container&&(container.nodeType===ELEMENT_NODE_TYPE||container.nodeType===DOC_NODE_TYPE),'prepareEnvironmentForDOM(...): Target container is not a DOM element.');var doc=container.nodeType===ELEMENT_NODE_TYPE?container.ownerDocument:container;ReactEventEmitter.ensureListening(ReactMount.useTouchEvents,doc);},_updateRootComponent:function(prevComponent,nextComponent,container,callback){var nextProps=nextComponent.props;ReactMount.scrollMonitor(container,function(){prevComponent.replaceProps(nextProps,callback);});if(true){rootElementsByReactRootID[getReactRootID(container)]=getReactRootElementInContainer(container);}
return prevComponent;},_registerComponent:function(nextComponent,container){ReactMount.prepareEnvironmentForDOM(container);var reactRootID=ReactMount.registerContainer(container);instancesByReactRootID[reactRootID]=nextComponent;return reactRootID;},_renderNewRootComponent:function(nextComponent,container,shouldReuseMarkup){var reactRootID=ReactMount._registerComponent(nextComponent,container);nextComponent.mountComponentIntoNode(reactRootID,container,shouldReuseMarkup);if(true){rootElementsByReactRootID[reactRootID]=getReactRootElementInContainer(container);}
return nextComponent;},renderComponent:function(nextComponent,container,callback){var registeredComponent=instancesByReactRootID[getReactRootID(container)];if(registeredComponent){if(registeredComponent.constructor===nextComponent.constructor){return ReactMount._updateRootComponent(registeredComponent,nextComponent,container,callback);}else{ReactMount.unmountComponentAtNode(container);}}
var reactRootElement=getReactRootElementInContainer(container);var containerHasReactMarkup=reactRootElement&&ReactMount.isRenderedByReact(reactRootElement);var shouldReuseMarkup=containerHasReactMarkup&&!registeredComponent;var component=ReactMount._renderNewRootComponent(nextComponent,container,shouldReuseMarkup);callback&&callback();return component;},constructAndRenderComponent:function(constructor,props,container){return ReactMount.renderComponent(constructor(props),container);},constructAndRenderComponentByID:function(constructor,props,id){return ReactMount.constructAndRenderComponent(constructor,props,$(id));},registerContainer:function(container){var reactRootID=getReactRootID(container);if(reactRootID){reactRootID=ReactInstanceHandles.getReactRootIDFromNodeID(reactRootID);}
if(!reactRootID){reactRootID=ReactInstanceHandles.createReactRootID();}
containersByReactRootID[reactRootID]=container;return reactRootID;},unmountComponentAtNode:function(container){var reactRootID=getReactRootID(container);var component=instancesByReactRootID[reactRootID];if(!component){return false;}
ReactMount.unmountComponentFromNode(component,container);delete instancesByReactRootID[reactRootID];delete containersByReactRootID[reactRootID];if(true){delete rootElementsByReactRootID[reactRootID];}
return true;},unmountAndReleaseReactRootNode:function(){if(true){console.warn('unmountAndReleaseReactRootNode() has been renamed to '+'unmountComponentAtNode() and will be removed in the next '+'version of React.');}
return ReactMount.unmountComponentAtNode.apply(this,arguments);},unmountComponentFromNode:function(instance,container){instance.unmountComponent();if(container.nodeType===DOC_NODE_TYPE){container=container.documentElement;}
while(container.lastChild){container.removeChild(container.lastChild);}},findReactContainerForID:function(id){var reactRootID=ReactInstanceHandles.getReactRootIDFromNodeID(id);var container=containersByReactRootID[reactRootID];if(true){var rootElement=rootElementsByReactRootID[reactRootID];if(rootElement&&rootElement.parentNode!==container){invariant(internalGetID(rootElement)===reactRootID,'ReactMount: Root element ID differed from reactRootID.');var containerChild=container.firstChild;if(containerChild&&reactRootID===internalGetID(containerChild)){rootElementsByReactRootID[reactRootID]=containerChild;}else{console.warn('ReactMount: Root element has been removed from its original '+'container. New container:',rootElement.parentNode);}}}
return container;},findReactNodeByID:function(id){var reactRoot=ReactMount.findReactContainerForID(id);return ReactMount.findComponentRoot(reactRoot,id);},isRenderedByReact:function(node){if(node.nodeType!==1){return false;}
var id=ReactMount.getID(node);return id?id.charAt(0)===SEPARATOR:false;},getFirstReactDOM:function(node){var current=node;while(current&&current.parentNode!==current){if(ReactMount.isRenderedByReact(current)){return current;}
current=current.parentNode;}
return null;},findComponentRoot:function(ancestorNode,id){var firstChildren=[ancestorNode.firstChild];var childIndex=0;while(childIndex<firstChildren.length){var child=firstChildren[childIndex++];while(child){var childID=ReactMount.getID(child);if(childID){if(id===childID){return child;}else if(ReactInstanceHandles.isAncestorIDOf(childID,id)){firstChildren.length=childIndex=0;firstChildren.push(child.firstChild);break;}else{firstChildren.push(child.firstChild);}}else{firstChildren.push(child.firstChild);}
child=child.nextSibling;}}
if(true){console.error('Error while invoking `findComponentRoot` with the following '+'ancestor node:',ancestorNode);}
invariant(false,'findComponentRoot(..., %s): Unable to find element. This probably '+'means the DOM was unexpectedly mutated (e.g. by the browser).',id,ReactMount.getID(ancestorNode));},ATTR_NAME:ATTR_NAME,getReactRootID:getReactRootID,getID:getID,setID:setID,getNode:getNode,purgeID:purgeID,injection:{}};module.exports=ReactMount;},{"./$":1,"./ReactEventEmitter":46,"./ReactInstanceHandles":50,"./getReactRootElementInContainer":103,"./invariant":106,"./nodeContains":120}],54:[function(require,module,exports){"use strict";var PooledClass=require("./PooledClass");var mixInto=require("./mixInto");function ReactMountReady(initialCollection){this._queue=initialCollection||null;}
mixInto(ReactMountReady,{enqueue:function(component,callback){this._queue=this._queue||[];this._queue.push({component:component,callback:callback});},notifyAll:function(){var queue=this._queue;if(queue){this._queue=null;for(var i=0,l=queue.length;i<l;i++){var component=queue[i].component;var callback=queue[i].callback;callback.call(component,component.getDOMNode());}
queue.length=0;}},reset:function(){this._queue=null;},destructor:function(){this.reset();}});PooledClass.addPoolingTo(ReactMountReady);module.exports=ReactMountReady;},{"./PooledClass":25,"./mixInto":118}],55:[function(require,module,exports){"use strict";var ReactComponent=require("./ReactComponent");var ReactMultiChildUpdateTypes=require("./ReactMultiChildUpdateTypes");var flattenChildren=require("./flattenChildren");function shouldUpdateChild(curChild,newChild){return curChild&&newChild&&curChild.constructor===newChild.constructor;}
var updateDepth=0;var updateQueue=[];var markupQueue=[];function enqueueMarkup(parentID,markup,toIndex){updateQueue.push({parentID:parentID,parentNode:null,type:ReactMultiChildUpdateTypes.INSERT_MARKUP,markupIndex:markupQueue.push(markup)- 1,fromIndex:null,textContent:null,toIndex:toIndex});}
function enqueueMove(parentID,fromIndex,toIndex){updateQueue.push({parentID:parentID,parentNode:null,type:ReactMultiChildUpdateTypes.MOVE_EXISTING,markupIndex:null,textContent:null,fromIndex:fromIndex,toIndex:toIndex});}
function enqueueRemove(parentID,fromIndex){updateQueue.push({parentID:parentID,parentNode:null,type:ReactMultiChildUpdateTypes.REMOVE_NODE,markupIndex:null,textContent:null,fromIndex:fromIndex,toIndex:null});}
function enqueueTextContent(parentID,textContent){updateQueue.push({parentID:parentID,parentNode:null,type:ReactMultiChildUpdateTypes.TEXT_CONTENT,markupIndex:null,textContent:textContent,fromIndex:null,toIndex:null});}
function processQueue(){if(updateQueue.length){ReactComponent.DOMIDOperations.dangerouslyProcessChildrenUpdates(updateQueue,markupQueue);clearQueue();}}
function clearQueue(){updateQueue.length=0;markupQueue.length=0;}
var ReactMultiChild={Mixin:{mountChildren:function(nestedChildren,transaction){var children=flattenChildren(nestedChildren);var mountImages=[];var index=0;this._renderedChildren=children;for(var name in children){var child=children[name];if(children.hasOwnProperty(name)&&child){var rootID=this._rootNodeID+'.'+ name;var mountImage=child.mountComponent(rootID,transaction,this._mountDepth+ 1);child._mountImage=mountImage;child._mountIndex=index;mountImages.push(mountImage);index++;}}
return mountImages;},updateTextContent:function(nextContent){updateDepth++;try{var prevChildren=this._renderedChildren;for(var name in prevChildren){if(prevChildren.hasOwnProperty(name)&&prevChildren[name]){this._unmountChildByName(prevChildren[name],name);}}
this.setTextContent(nextContent);}catch(error){updateDepth--;updateDepth||clearQueue();throw error;}
updateDepth--;updateDepth||processQueue();},updateChildren:function(nextNestedChildren,transaction){updateDepth++;try{this._updateChildren(nextNestedChildren,transaction);}catch(error){updateDepth--;updateDepth||clearQueue();throw error;}
updateDepth--;updateDepth||processQueue();},_updateChildren:function(nextNestedChildren,transaction){var nextChildren=flattenChildren(nextNestedChildren);var prevChildren=this._renderedChildren;if(!nextChildren&&!prevChildren){return;}
var name;var lastIndex=0;var nextIndex=0;for(name in nextChildren){if(!nextChildren.hasOwnProperty(name)){continue;}
var prevChild=prevChildren&&prevChildren[name];var nextChild=nextChildren[name];if(shouldUpdateChild(prevChild,nextChild)){this.moveChild(prevChild,nextIndex,lastIndex);lastIndex=Math.max(prevChild._mountIndex,lastIndex);prevChild.receiveProps(nextChild.props,transaction);prevChild._mountIndex=nextIndex;}else{if(prevChild){lastIndex=Math.max(prevChild._mountIndex,lastIndex);this._unmountChildByName(prevChild,name);}
if(nextChild){this._mountChildByNameAtIndex(nextChild,name,nextIndex,transaction);}}
if(nextChild){nextIndex++;}}
for(name in prevChildren){if(prevChildren.hasOwnProperty(name)&&prevChildren[name]&&!(nextChildren&&nextChildren[name])){this._unmountChildByName(prevChildren[name],name);}}},unmountChildren:function(){var renderedChildren=this._renderedChildren;for(var name in renderedChildren){var renderedChild=renderedChildren[name];if(renderedChild&&renderedChild.unmountComponent){renderedChild.unmountComponent();}}
this._renderedChildren=null;},moveChild:function(child,toIndex,lastIndex){if(child._mountIndex<lastIndex){enqueueMove(this._rootNodeID,child._mountIndex,toIndex);}},createChild:function(child){enqueueMarkup(this._rootNodeID,child._mountImage,child._mountIndex);},removeChild:function(child){enqueueRemove(this._rootNodeID,child._mountIndex);},setTextContent:function(textContent){enqueueTextContent(this._rootNodeID,textContent);},_mountChildByNameAtIndex:function(child,name,index,transaction){var rootID=this._rootNodeID+'.'+ name;var mountImage=child.mountComponent(rootID,transaction,this._mountDepth+ 1);child._mountImage=mountImage;child._mountIndex=index;this.createChild(child);this._renderedChildren=this._renderedChildren||{};this._renderedChildren[name]=child;},_unmountChildByName:function(child,name){if(ReactComponent.isValidComponent(child)){this.removeChild(child);child._mountImage=null;child._mountIndex=null;child.unmountComponent();delete this._renderedChildren[name];}}}};module.exports=ReactMultiChild;},{"./ReactComponent":28,"./ReactMultiChildUpdateTypes":56,"./flattenChildren":96}],56:[function(require,module,exports){var keyMirror=require("./keyMirror");var ReactMultiChildUpdateTypes=keyMirror({INSERT_MARKUP:null,MOVE_EXISTING:null,REMOVE_NODE:null,TEXT_CONTENT:null});module.exports=ReactMultiChildUpdateTypes;},{"./keyMirror":112}],57:[function(require,module,exports){"use strict";var invariant=require("./invariant");var ReactOwner={isValidOwner:function(object){return!!(object&&typeof object.attachRef==='function'&&typeof object.detachRef==='function');},addComponentAsRefTo:function(component,ref,owner){invariant(ReactOwner.isValidOwner(owner),'addComponentAsRefTo(...): Only a ReactOwner can have refs.');owner.attachRef(ref,component);},removeComponentAsRefFrom:function(component,ref,owner){invariant(ReactOwner.isValidOwner(owner),'removeComponentAsRefFrom(...): Only a ReactOwner can have refs.');if(owner.refs[ref]===component){owner.detachRef(ref);}},Mixin:{attachRef:function(ref,component){invariant(component.isOwnedBy(this),'attachRef(%s, ...): Only a component\'s owner can store a ref to it.',ref);var refs=this.refs||(this.refs={});refs[ref]=component;},detachRef:function(ref){delete this.refs[ref];}}};module.exports=ReactOwner;},{"./invariant":106}],58:[function(require,module,exports){"use strict";var ReactPerf={enableMeasure:false,storedMeasure:_noMeasure,measure:function(objName,fnName,func){if(true){var measuredFunc=null;return function(){if(ReactPerf.enableMeasure){if(!measuredFunc){measuredFunc=ReactPerf.storedMeasure(objName,fnName,func);}
return measuredFunc.apply(this,arguments);}
return func.apply(this,arguments);};}
return func;},injection:{injectMeasure:function(measure){ReactPerf.storedMeasure=measure;}}};if(true){var ExecutionEnvironment=require("./ExecutionEnvironment");var URL=ExecutionEnvironment.canUseDOM?window.location.href:'';ReactPerf.enableMeasure=ReactPerf.enableMeasure||!!URL.match(/[?&]react_perf\b/);}
function _noMeasure(objName,fnName,func){return func;}
module.exports=ReactPerf;},{"./ExecutionEnvironment":21}],59:[function(require,module,exports){"use strict";var emptyFunction=require("./emptyFunction");var invariant=require("./invariant");var joinClasses=require("./joinClasses");var merge=require("./merge");function createTransferStrategy(mergeStrategy){return function(props,key,value){if(!props.hasOwnProperty(key)){props[key]=value;}else{props[key]=mergeStrategy(props[key],value);}};}
var TransferStrategies={children:emptyFunction,className:createTransferStrategy(joinClasses),ref:emptyFunction,style:createTransferStrategy(merge)};var ReactPropTransferer={TransferStrategies:TransferStrategies,Mixin:{transferPropsTo:function(component){invariant(component.props.__owner__===this,'%s: You can\'t call transferPropsTo() on a component that you '+'don\'t own, %s. This usually means you are calling '+'transferPropsTo() on a component passed in as props or children.',this.constructor.displayName,component.constructor.displayName);var props={};for(var thatKey in component.props){if(component.props.hasOwnProperty(thatKey)){props[thatKey]=component.props[thatKey];}}
for(var thisKey in this.props){if(!this.props.hasOwnProperty(thisKey)){continue;}
var transferStrategy=TransferStrategies[thisKey];if(transferStrategy){transferStrategy(props,thisKey,this.props[thisKey]);}else if(!props.hasOwnProperty(thisKey)){props[thisKey]=this.props[thisKey];}}
component.props=props;return component;}}};module.exports=ReactPropTransferer;},{"./emptyFunction":92,"./invariant":106,"./joinClasses":111,"./merge":115}],60:[function(require,module,exports){"use strict";var createObjectFrom=require("./createObjectFrom");var invariant=require("./invariant");var Props={array:createPrimitiveTypeChecker('array'),bool:createPrimitiveTypeChecker('boolean'),func:createPrimitiveTypeChecker('function'),number:createPrimitiveTypeChecker('number'),object:createPrimitiveTypeChecker('object'),string:createPrimitiveTypeChecker('string'),oneOf:createEnumTypeChecker,instanceOf:createInstanceTypeChecker};var ANONYMOUS='<<anonymous>>';function createPrimitiveTypeChecker(expectedType){function validatePrimitiveType(propValue,propName,componentName){var propType=typeof propValue;if(propType==='object'&&Array.isArray(propValue)){propType='array';}
invariant(propType===expectedType,'Invalid prop `%s` of type `%s` supplied to `%s`, expected `%s`.',propName,propType,componentName,expectedType);}
return createChainableTypeChecker(validatePrimitiveType);}
function createEnumTypeChecker(expectedValues){var expectedEnum=createObjectFrom(expectedValues);function validateEnumType(propValue,propName,componentName){invariant(expectedEnum[propValue],'Invalid prop `%s` supplied to `%s`, expected one of %s.',propName,componentName,JSON.stringify(Object.keys(expectedEnum)));}
return createChainableTypeChecker(validateEnumType);}
function createInstanceTypeChecker(expectedClass){function validateInstanceType(propValue,propName,componentName){invariant(propValue instanceof expectedClass,'Invalid prop `%s` supplied to `%s`, expected instance of `%s`.',propName,componentName,expectedClass.name||ANONYMOUS);}
return createChainableTypeChecker(validateInstanceType);}
function createChainableTypeChecker(validate){function createTypeChecker(isRequired){function checkType(props,propName,componentName){var propValue=props[propName];if(propValue!=null){validate(propValue,propName,componentName||ANONYMOUS);}else{invariant(!isRequired,'Required prop `%s` was not specified in `%s`.',propName,componentName||ANONYMOUS);}}
if(!isRequired){checkType.isRequired=createTypeChecker(true);}
return checkType;}
return createTypeChecker(false);}
module.exports=Props;},{"./createObjectFrom":89,"./invariant":106}],61:[function(require,module,exports){"use strict";var ExecutionEnvironment=require("./ExecutionEnvironment");var PooledClass=require("./PooledClass");var ReactEventEmitter=require("./ReactEventEmitter");var ReactInputSelection=require("./ReactInputSelection");var ReactMountReady=require("./ReactMountReady");var Transaction=require("./Transaction");var mixInto=require("./mixInto");var SELECTION_RESTORATION={initialize:ReactInputSelection.getSelectionInformation,close:ReactInputSelection.restoreSelection};var EVENT_SUPPRESSION={initialize:function(){var currentlyEnabled=ReactEventEmitter.isEnabled();ReactEventEmitter.setEnabled(false);return currentlyEnabled;},close:function(previouslyEnabled){ReactEventEmitter.setEnabled(previouslyEnabled);}};var ON_DOM_READY_QUEUEING={initialize:function(){this.reactMountReady.reset();},close:function(){this.reactMountReady.notifyAll();}};var TRANSACTION_WRAPPERS=[SELECTION_RESTORATION,EVENT_SUPPRESSION,ON_DOM_READY_QUEUEING];function ReactReconcileTransaction(){this.reinitializeTransaction();this.reactMountReady=ReactMountReady.getPooled(null);}
var Mixin={getTransactionWrappers:function(){if(ExecutionEnvironment.canUseDOM){return TRANSACTION_WRAPPERS;}else{return[];}},getReactMountReady:function(){return this.reactMountReady;},destructor:function(){ReactMountReady.release(this.reactMountReady);this.reactMountReady=null;}};mixInto(ReactReconcileTransaction,Transaction.Mixin);mixInto(ReactReconcileTransaction,Mixin);PooledClass.addPoolingTo(ReactReconcileTransaction);module.exports=ReactReconcileTransaction;},{"./ExecutionEnvironment":21,"./PooledClass":25,"./ReactEventEmitter":46,"./ReactInputSelection":49,"./ReactMountReady":54,"./Transaction":82,"./mixInto":118}],62:[function(require,module,exports){"use strict";var ReactMarkupChecksum=require("./ReactMarkupChecksum");var ReactReconcileTransaction=require("./ReactReconcileTransaction");var ReactInstanceHandles=require("./ReactInstanceHandles");function renderComponentToString(component,callback){var id=ReactInstanceHandles.createReactRootID();var transaction=ReactReconcileTransaction.getPooled();transaction.reinitializeTransaction();try{transaction.perform(function(){var markup=component.mountComponent(id,transaction,0);markup=ReactMarkupChecksum.addChecksumToMarkup(markup);callback(markup);},null);}finally{ReactReconcileTransaction.release(transaction);}}
module.exports={renderComponentToString:renderComponentToString};},{"./ReactInstanceHandles":50,"./ReactMarkupChecksum":52,"./ReactReconcileTransaction":61}],63:[function(require,module,exports){"use strict";var ReactStateSetters={createStateSetter:function(component,funcReturningState){return function(a,b,c,d,e,f){var partialState=funcReturningState.call(component,a,b,c,d,e,f);if(partialState){component.setState(partialState);}};},createStateKeySetter:function(component,key){var cache=component.__keySetters||(component.__keySetters={});return cache[key]||(cache[key]=createStateKeySetter(component,key));}};function createStateKeySetter(component,key){var partialState={};return function stateKeySetter(value){partialState[key]=value;component.setState(partialState);};}
ReactStateSetters.Mixin={createStateSetter:function(funcReturningState){return ReactStateSetters.createStateSetter(this,funcReturningState);},createStateKeySetter:function(key){return ReactStateSetters.createStateKeySetter(this,key);}};module.exports=ReactStateSetters;},{}],64:[function(require,module,exports){"use strict";var ReactComponent=require("./ReactComponent");var ReactMount=require("./ReactMount");var escapeTextForBrowser=require("./escapeTextForBrowser");var mixInto=require("./mixInto");var ReactTextComponent=function(initialText){this.construct({text:initialText});};mixInto(ReactTextComponent,ReactComponent.Mixin);mixInto(ReactTextComponent,{mountComponent:function(rootID,transaction,mountDepth){ReactComponent.Mixin.mountComponent.call(this,rootID,transaction,mountDepth);return('<span '+ ReactMount.ATTR_NAME+'="'+ rootID+'">'+
escapeTextForBrowser(this.props.text)+'</span>');},receiveProps:function(nextProps,transaction){if(nextProps.text!==this.props.text){this.props.text=nextProps.text;ReactComponent.DOMIDOperations.updateTextContentByID(this._rootNodeID,nextProps.text);}}});module.exports=ReactTextComponent;},{"./ReactComponent":28,"./ReactMount":53,"./escapeTextForBrowser":93,"./mixInto":118}],65:[function(require,module,exports){"use strict";var ExecutionEnvironment=require("./ExecutionEnvironment");var EVENT_NAME_MAP={transitionend:{'transition':'transitionend','WebkitTransition':'webkitTransitionEnd','MozTransition':'mozTransitionEnd','OTransition':'oTransitionEnd','msTransition':'MSTransitionEnd'},animationend:{'animation':'animationend','WebkitAnimation':'webkitAnimationEnd','MozAnimation':'mozAnimationEnd','OAnimation':'oAnimationEnd','msAnimation':'MSAnimationEnd'}};var endEvents=[];function detectEvents(){var testEl=document.createElement('div');var style=testEl.style;for(var baseEventName in EVENT_NAME_MAP){var baseEvents=EVENT_NAME_MAP[baseEventName];for(var styleName in baseEvents){if(styleName in style){endEvents.push(baseEvents[styleName]);break;}}}}
if(ExecutionEnvironment.canUseDOM){detectEvents();}
function addEventListener(node,eventName,eventListener){node.addEventListener(eventName,eventListener,false);}
function removeEventListener(node,eventName,eventListener){node.removeEventListener(eventName,eventListener,false);}
var ReactTransitionEvents={addEndEventListener:function(node,eventListener){if(endEvents.length===0){window.setTimeout(eventListener,0);return;}
endEvents.forEach(function(endEvent){addEventListener(node,endEvent,eventListener);});},removeEndEventListener:function(node,eventListener){if(endEvents.length===0){return;}
endEvents.forEach(function(endEvent){removeEventListener(node,endEvent,eventListener);});}};module.exports=ReactTransitionEvents;},{"./ExecutionEnvironment":21}],66:[function(require,module,exports){"use strict";var React=require("./React");var ReactTransitionableChild=require("./ReactTransitionableChild");var ReactTransitionKeySet=require("./ReactTransitionKeySet");var invariant=require("./invariant");var ReactTransitionGroupMixin={componentWillMount:function(){this._transitionGroupCurrentKeys={};},renderTransitionableChildren:function(sourceChildren){invariant(this.getTransitionConfig,'renderTransitionableChildren(): You must provide a '+'getTransitionConfig() method.');var children={};var childMapping=ReactTransitionKeySet.getChildMapping(sourceChildren);var transitionConfig=this.getTransitionConfig();var currentKeys=ReactTransitionKeySet.mergeKeySets(this._transitionGroupCurrentKeys,ReactTransitionKeySet.getKeySet(sourceChildren));for(var key in currentKeys){if(childMapping[key]||transitionConfig.leave){children[key]=ReactTransitionableChild({name:transitionConfig.name,enter:transitionConfig.enter,onDoneLeaving:this._handleDoneLeaving.bind(this,key)},childMapping[key]);}}
this._transitionGroupCurrentKeys=currentKeys;return children;},_handleDoneLeaving:function(key){delete this._transitionGroupCurrentKeys[key];this.forceUpdate();}};var ReactTransitionGroup=React.createClass({mixins:[ReactTransitionGroupMixin],getDefaultProps:function(){return{transitionEnter:true,transitionLeave:true,component:React.DOM.span};},getTransitionConfig:function(){return{name:this.props.transitionName,enter:this.props.transitionEnter,leave:this.props.transitionLeave};},render:function(){return this.transferPropsTo(this.props.component({transitionName:null,transitionEnter:null,transitionLeave:null,component:null},this.renderTransitionableChildren(this.props.children)));}});module.exports=ReactTransitionGroup;},{"./React":26,"./ReactTransitionKeySet":67,"./ReactTransitionableChild":68,"./invariant":106}],67:[function(require,module,exports){"use strict";var ReactChildren=require("./ReactChildren");var MERGE_KEY_SETS_TAIL_SENTINEL={};var ReactTransitionKeySet={getChildMapping:function(children){return ReactChildren.map(children,function(child){return child;});},getKeySet:function(children){return ReactChildren.map(children,function(){return true;});},mergeKeySets:function(prev,next){var keySet={};var prevKeys=Object.keys(prev).concat([MERGE_KEY_SETS_TAIL_SENTINEL]);var nextKeys=Object.keys(next).concat([MERGE_KEY_SETS_TAIL_SENTINEL]);var i;for(i=0;i<prevKeys.length- 1;i++){var prevKey=prevKeys[i];if(next[prevKey]){continue;}
var insertPos=-1;for(var j=i+ 1;j<prevKeys.length;j++){insertPos=nextKeys.indexOf(prevKeys[j]);if(insertPos>=0){break;}}
nextKeys.splice(insertPos,0,prevKey);}
for(i=0;i<nextKeys.length- 1;i++){keySet[nextKeys[i]]=true;}
return keySet;}};module.exports=ReactTransitionKeySet;},{"./ReactChildren":27}],68:[function(require,module,exports){"use strict";var React=require("./React");var CSSCore=require("./CSSCore");var ReactTransitionEvents=require("./ReactTransitionEvents");var TICK=17;var NO_EVENT_TIMEOUT=5000;var noEventListener=null;if(true){noEventListener=function(){console.warn('transition(): tried to perform an animation without '+'an animationend or transitionend event after timeout ('+
NO_EVENT_TIMEOUT+'ms). You should either disable this '+'transition in JS or add a CSS animation/transition.');};}
var ReactTransitionableChild=React.createClass({transition:function(animationType,noReset,finishCallback){var node=this.getDOMNode();var className=this.props.name+'-'+ animationType;var activeClassName=className+'-active';var noEventTimeout=null;var endListener=function(){if(true){clearTimeout(noEventTimeout);}
if(!noReset){CSSCore.removeClass(node,className);CSSCore.removeClass(node,activeClassName);}
ReactTransitionEvents.removeEndEventListener(node,endListener);finishCallback&&finishCallback();};ReactTransitionEvents.addEndEventListener(node,endListener);CSSCore.addClass(node,className);this.queueClass(activeClassName);if(true){noEventTimeout=setTimeout(noEventListener,NO_EVENT_TIMEOUT);}},queueClass:function(className){this.classNameQueue.push(className);if(this.props.runNextTick){this.props.runNextTick(this.flushClassNameQueue);return;}
if(!this.timeout){this.timeout=setTimeout(this.flushClassNameQueue,TICK);}},flushClassNameQueue:function(){if(this.isMounted()){this.classNameQueue.forEach(CSSCore.addClass.bind(CSSCore,this.getDOMNode()));}
this.classNameQueue.length=0;this.timeout=null;},componentWillMount:function(){this.classNameQueue=[];},componentWillUnmount:function(){if(this.timeout){clearTimeout(this.timeout);}},componentWillReceiveProps:function(nextProps){if(!nextProps.children&&this.props.children){this.savedChildren=this.props.children;}},componentDidMount:function(node){if(this.props.enter){this.transition('enter');}},componentDidUpdate:function(prevProps,prevState,node){if(prevProps.children&&!this.props.children){this.transition('leave',true,this.props.onDoneLeaving);}},render:function(){return this.props.children||this.savedChildren;}});module.exports=ReactTransitionableChild;},{"./CSSCore":2,"./React":26,"./ReactTransitionEvents":65}],69:[function(require,module,exports){"use strict";var invariant=require("./invariant");var dirtyComponents=[];var batchingStrategy=null;function ensureBatchingStrategy(){invariant(batchingStrategy,'ReactUpdates: must inject a batching strategy');}
function batchedUpdates(callback,param){ensureBatchingStrategy();batchingStrategy.batchedUpdates(callback,param);}
function mountDepthComparator(c1,c2){return c1._mountDepth- c2._mountDepth;}
function runBatchedUpdates(){dirtyComponents.sort(mountDepthComparator);for(var i=0;i<dirtyComponents.length;i++){var component=dirtyComponents[i];if(component.isMounted()){var callbacks=component._pendingCallbacks;component._pendingCallbacks=null;component.performUpdateIfNecessary();if(callbacks){for(var j=0;j<callbacks.length;j++){callbacks[j].call(component);}}}}}
function clearDirtyComponents(){dirtyComponents.length=0;}
function flushBatchedUpdates(){try{runBatchedUpdates();}catch(e){throw e;}finally{clearDirtyComponents();}}
function enqueueUpdate(component,callback){invariant(!callback||typeof callback==="function",'enqueueUpdate(...): You called `setProps`, `replaceProps`, '+'`setState`, `replaceState`, or `forceUpdate` with a callback that '+'isn\'t callable.');ensureBatchingStrategy();if(!batchingStrategy.isBatchingUpdates){component.performUpdateIfNecessary();callback&&callback();return;}
dirtyComponents.push(component);if(callback){if(component._pendingCallbacks){component._pendingCallbacks.push(callback);}else{component._pendingCallbacks=[callback];}}}
var ReactUpdatesInjection={injectBatchingStrategy:function(_batchingStrategy){invariant(_batchingStrategy,'ReactUpdates: must provide a batching strategy');invariant(typeof _batchingStrategy.batchedUpdates==='function','ReactUpdates: must provide a batchedUpdates() function');invariant(typeof _batchingStrategy.isBatchingUpdates==='boolean','ReactUpdates: must provide an isBatchingUpdates boolean attribute');batchingStrategy=_batchingStrategy;}};var ReactUpdates={batchedUpdates:batchedUpdates,enqueueUpdate:enqueueUpdate,flushBatchedUpdates:flushBatchedUpdates,injection:ReactUpdatesInjection};module.exports=ReactUpdates;},{"./invariant":106}],70:[function(require,module,exports){"use strict";var LinkedStateMixin=require("./LinkedStateMixin");var React=require("./React");var ReactTransitionGroup=require("./ReactTransitionGroup");var cx=require("./cx");React.addons={classSet:cx,LinkedStateMixin:LinkedStateMixin,TransitionGroup:ReactTransitionGroup};module.exports=React;},{"./LinkedStateMixin":22,"./React":26,"./ReactTransitionGroup":66,"./cx":90}],71:[function(require,module,exports){"use strict";var EventConstants=require("./EventConstants");var EventPluginHub=require("./EventPluginHub");var EventPropagators=require("./EventPropagators");var ExecutionEnvironment=require("./ExecutionEnvironment");var ReactInputSelection=require("./ReactInputSelection");var SyntheticEvent=require("./SyntheticEvent");var getActiveElement=require("./getActiveElement");var isEventSupported=require("./isEventSupported");var isTextInputElement=require("./isTextInputElement");var keyOf=require("./keyOf");var shallowEqual=require("./shallowEqual");var topLevelTypes=EventConstants.topLevelTypes;var eventTypes={select:{phasedRegistrationNames:{bubbled:keyOf({onSelect:null}),captured:keyOf({onSelectCapture:null})}}};var useSelectionChange=false;var useSelect=false;if(ExecutionEnvironment.canUseDOM){useSelectionChange='onselectionchange'in document;useSelect=isEventSupported('select');}
var activeElement=null;var activeElementID=null;var activeNativeEvent = null;
var lastSelection = null;
var mouseDown = false;

/**
 * Get an object which is a unique representation of the current selection.
 *
 * The return value will not be consistent across nodes or browsers, but
 * two identical selections on the same node will return identical objects.
 *
 * @param {DOMElement} node
 * @param {object}
 */
function getSelection(node) {
  if ('selectionStart' in node &&
      ReactInputSelection.hasSelectionCapabilities(node)) {
    return {
      start: node.selectionStart,
      end: node.selectionEnd
    };
  } else if (document.selection) {
    var range = document.selection.createRange();
    return {
      parentElement: range.parentElement(),
      text: range.text,
      top: range.boundingTop,
      left: range.boundingLeft
    };
  } else {
    var selection = window.getSelection();
    return {
      anchorNode: selection.anchorNode,
      anchorOffset: selection.anchorOffset,
      focusNode: selection.focusNode,
      focusOffset: selection.focusOffset
    };
  }
}

/**
 * Poll selection to see whether it's changed.
 *
 * @param {object} nativeEvent
 * @return {?SyntheticEvent}
 */
function constructSelectEvent(nativeEvent) {
  // Ensure we have the right element, and that the user is not dragging a
  // selection (this matches native `select` event behavior).
  if (mouseDown || activeElement != getActiveElement()) {
    return;
  }

  // Only fire when selection has actually changed.
  var currentSelection = getSelection(activeElement);
  if (!lastSelection || !shallowEqual(lastSelection, currentSelection)) {
    lastSelection = currentSelection;

    var syntheticEvent = SyntheticEvent.getPooled(
      eventTypes.select,
      activeElementID,
      nativeEvent
    );

    syntheticEvent.type = 'select';
    syntheticEvent.target = activeElement;

    EventPropagators.accumulateTwoPhaseDispatches(syntheticEvent);

    return syntheticEvent;
  }
}

/**
 * Handle deferred event. And manually dispatch synthetic events.
 */
function dispatchDeferredSelectEvent() {
  if (!activeNativeEvent) {
    return;
  }

  var syntheticEvent = constructSelectEvent(activeNativeEvent);
  activeNativeEvent = null;

  // Enqueue and process the abstract event manually.
  if (syntheticEvent) {
    EventPluginHub.enqueueEvents(syntheticEvent);
    EventPluginHub.processEventQueue();
  }
}

/**
 * This plugin creates an `onSelect` event that normalizes select events
 * across form elements.
 *
 * Supported elements are:
 * - input (see `isTextInputElement`)
 * - textarea
 * - contentEditable
 *
 * This differs from native browser implementations in the following ways:
 * - Fires on contentEditable fields as well as inputs.
 * - Fires for collapsed selection.
 * - Fires after user input.
 */
var SelectEventPlugin = {

  eventTypes: eventTypes,

  /**
   * @param {string} topLevelType Record from `EventConstants`.
   * @param {DOMEventTarget} topLevelTarget The listening component root node.
   * @param {string} topLevelTargetID ID of `topLevelTarget`.
   * @param {object} nativeEvent Native browser event.
   * @return {*} An accumulation of synthetic events.
   * @see {EventPluginHub.extractEvents}
   */
  extractEvents: function(
      topLevelType,
      topLevelTarget,
      topLevelTargetID,
      nativeEvent) {

    switch (topLevelType) {
      // Track the input node that has focus.
      case topLevelTypes.topFocus:
        if (isTextInputElement(topLevelTarget) ||
            topLevelTarget.contentEditable === 'true') {
          activeElement = topLevelTarget;
          activeElementID = topLevelTargetID;
          lastSelection = null;
        }
        break;
      case topLevelTypes.topBlur:
        activeElement = null;
        activeElementID = null;
        lastSelection = null;
        break;

      // Don't fire the event while the user is dragging. This matches the
      // semantics of the native select event.
      case topLevelTypes.topMouseDown:
        mouseDown = true;
        break;
      case topLevelTypes.topMouseUp:
        mouseDown = false;
        return constructSelectEvent(nativeEvent);

      // Chrome and IE fire non-standard event when selection is changed (and
      // sometimes when it hasn't).
      case topLevelTypes.topSelectionChange:
        return constructSelectEvent(nativeEvent);

      // Firefox doesn't support selectionchange, so check selection status
      // after each key entry.
      case topLevelTypes.topKeyDown:
        if (!useSelectionChange) {
          activeNativeEvent = nativeEvent;
          setTimeout(dispatchDeferredSelectEvent, 0);
        }
        break;
    }
  }
};

module.exports = SelectEventPlugin;

},{"./EventConstants":15,"./EventPluginHub":17,"./EventPropagators":20,"./ExecutionEnvironment":21,"./ReactInputSelection":49,"./SyntheticEvent":75,"./getActiveElement":99,"./isEventSupported":107,"./isTextInputElement":109,"./keyOf":113,"./shallowEqual":124}],72:[function(require,module,exports){
/**
 * Copyright 2013 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule SimpleEventPlugin
 */

"use strict";

var EventConstants = require("./EventConstants");
var EventPropagators = require("./EventPropagators");
var SyntheticClipboardEvent = require("./SyntheticClipboardEvent");
var SyntheticEvent = require("./SyntheticEvent");
var SyntheticFocusEvent = require("./SyntheticFocusEvent");
var SyntheticKeyboardEvent = require("./SyntheticKeyboardEvent");
var SyntheticMouseEvent = require("./SyntheticMouseEvent");
var SyntheticTouchEvent = require("./SyntheticTouchEvent");
var SyntheticUIEvent = require("./SyntheticUIEvent");
var SyntheticWheelEvent = require("./SyntheticWheelEvent");

var invariant = require("./invariant");
var keyOf = require("./keyOf");

var topLevelTypes = EventConstants.topLevelTypes;

var eventTypes = {
  blur: {
    phasedRegistrationNames: {
      bubbled: keyOf({onBlur: true}),
      captured: keyOf({onBlurCapture: true})
    }
  },
  click: {
    phasedRegistrationNames: {
      bubbled: keyOf({onClick: true}),
      captured: keyOf({onClickCapture: true})
    }
  },
  copy: {
    phasedRegistrationNames: {
      bubbled: keyOf({onCopy: true}),
      captured: keyOf({onCopyCapture: true})
    }
  },
  cut: {
    phasedRegistrationNames: {
      bubbled: keyOf({onCut: true}),
      captured: keyOf({onCutCapture: true})
    }
  },
  doubleClick: {
    phasedRegistrationNames: {
      bubbled: keyOf({onDoubleClick: true}),
      captured: keyOf({onDoubleClickCapture: true})
    }
  },
  drag: {
    phasedRegistrationNames: {
      bubbled: keyOf({onDrag: true}),
      captured: keyOf({onDragCapture: true})
    }
  },
  dragEnd: {
    phasedRegistrationNames: {
      bubbled: keyOf({onDragEnd: true}),
      captured: keyOf({onDragEndCapture: true})
    }
  },
  dragEnter: {
    phasedRegistrationNames: {
      bubbled: keyOf({onDragEnter: true}),
      captured: keyOf({onDragEnterCapture: true})
    }
  },
  dragExit: {
    phasedRegistrationNames: {
      bubbled: keyOf({onDragExit: true}),
      captured: keyOf({onDragExitCapture: true})
    }
  },
  dragLeave: {
    phasedRegistrationNames: {
      bubbled: keyOf({onDragLeave: true}),
      captured: keyOf({onDragLeaveCapture: true})
    }
  },
  dragOver: {
    phasedRegistrationNames: {
      bubbled: keyOf({onDragOver: true}),
      captured: keyOf({onDragOverCapture: true})
    }
  },
  dragStart: {
    phasedRegistrationNames: {
      bubbled: keyOf({onDragStart: true}),
      captured: keyOf({onDragStartCapture: true})
    }
  },
  drop: {
    phasedRegistrationNames: {
      bubbled: keyOf({onDrop: true}),
      captured: keyOf({onDropCapture: true})
    }
  },
  focus: {
    phasedRegistrationNames: {
      bubbled: keyOf({onFocus: true}),
      captured: keyOf({onFocusCapture: true})
    }
  },
  input: {
    phasedRegistrationNames: {
      bubbled: keyOf({onInput: true}),
      captured: keyOf({onInputCapture: true})
    }
  },
  keyDown: {
    phasedRegistrationNames: {
      bubbled: keyOf({onKeyDown: true}),
      captured: keyOf({onKeyDownCapture: true})
    }
  },
  keyPress: {
    phasedRegistrationNames: {
      bubbled: keyOf({onKeyPress: true}),
      captured: keyOf({onKeyPressCapture: true})
    }
  },
  keyUp: {
    phasedRegistrationNames: {
      bubbled: keyOf({onKeyUp: true}),
      captured: keyOf({onKeyUpCapture: true})
    }
  },
  // Note: We do not allow listening to mouseOver events. Instead, use the
  // onMouseEnter/onMouseLeave created by `EnterLeaveEventPlugin`.
  mouseDown: {
    phasedRegistrationNames: {
      bubbled: keyOf({onMouseDown: true}),
      captured: keyOf({onMouseDownCapture: true})
    }
  },
  mouseMove: {
    phasedRegistrationNames: {
      bubbled: keyOf({onMouseMove: true}),
      captured: keyOf({onMouseMoveCapture: true})
    }
  },
  mouseUp: {
    phasedRegistrationNames: {
      bubbled: keyOf({onMouseUp: true}),
      captured: keyOf({onMouseUpCapture: true})
    }
  },
  paste: {
    phasedRegistrationNames: {
      bubbled: keyOf({onPaste: true}),
      captured: keyOf({onPasteCapture: true})
    }
  },
  scroll: {
    phasedRegistrationNames: {
      bubbled: keyOf({onScroll: true}),
      captured: keyOf({onScrollCapture: true})
    }
  },
  submit: {
    phasedRegistrationNames: {
      bubbled: keyOf({onSubmit: true}),
      captured: keyOf({onSubmitCapture: true})
    }
  },
  touchCancel: {
    phasedRegistrationNames: {
      bubbled: keyOf({onTouchCancel: true}),
      captured: keyOf({onTouchCancelCapture: true})
    }
  },
  touchEnd: {
    phasedRegistrationNames: {
      bubbled: keyOf({onTouchEnd: true}),
      captured: keyOf({onTouchEndCapture: true})
    }
  },
  touchMove: {
    phasedRegistrationNames: {
      bubbled: keyOf({onTouchMove: true}),
      captured: keyOf({onTouchMoveCapture: true})
    }
  },
  touchStart: {
    phasedRegistrationNames: {
      bubbled: keyOf({onTouchStart: true}),
      captured: keyOf({onTouchStartCapture: true})
    }
  },
  wheel: {
    phasedRegistrationNames: {
      bubbled: keyOf({onWheel: true}),
      captured: keyOf({onWheelCapture: true})
    }
  }
};

var topLevelEventsToDispatchConfig = {
  topBlur:        eventTypes.blur,
  topClick:       eventTypes.click,
  topCopy:        eventTypes.copy,
  topCut:         eventTypes.cut,
  topDoubleClick: eventTypes.doubleClick,
  topDrag:        eventTypes.drag,
  topDragEnd:     eventTypes.dragEnd,
  topDragEnter:   eventTypes.dragEnter,
  topDragExit:    eventTypes.dragExit,
  topDragLeave:   eventTypes.dragLeave,
  topDragOver:    eventTypes.dragOver,
  topDragStart:   eventTypes.dragStart,
  topDrop:        eventTypes.drop,
  topFocus:       eventTypes.focus,
  topInput:       eventTypes.input,
  topKeyDown:     eventTypes.keyDown,
  topKeyPress:    eventTypes.keyPress,
  topKeyUp:       eventTypes.keyUp,
  topMouseDown:   eventTypes.mouseDown,
  topMouseMove:   eventTypes.mouseMove,
  topMouseUp:     eventTypes.mouseUp,
  topPaste:       eventTypes.paste,
  topScroll:      eventTypes.scroll,
  topSubmit:      eventTypes.submit,
  topTouchCancel: eventTypes.touchCancel,
  topTouchEnd:    eventTypes.touchEnd,
  topTouchMove:   eventTypes.touchMove,
  topTouchStart:  eventTypes.touchStart,
  topWheel:       eventTypes.wheel
};

var SimpleEventPlugin = {

  eventTypes: eventTypes,

  /**
   * Same as the default implementation, except cancels the event when return
   * value is false.
   *
   * @param {object} Event to be dispatched.
   * @param {function} Application-level callback.
   * @param {string} domID DOM ID to pass to the callback.
   */
  executeDispatch: function(event, listener, domID) {
    var returnValue = listener(event, domID);
    if (returnValue === false) {
      event.stopPropagation();
      event.preventDefault();
    }
  },

  /**
   * @param {string} topLevelType Record from `EventConstants`.
   * @param {DOMEventTarget} topLevelTarget The listening component root node.
   * @param {string} topLevelTargetID ID of `topLevelTarget`.
   * @param {object} nativeEvent Native browser event.
   * @return {*} An accumulation of synthetic events.
   * @see {EventPluginHub.extractEvents}
   */
  extractEvents: function(
      topLevelType,
      topLevelTarget,
      topLevelTargetID,
      nativeEvent) {
    var dispatchConfig = topLevelEventsToDispatchConfig[topLevelType];
    if (!dispatchConfig) {
      return null;
    }
    var EventConstructor;
    switch(topLevelType) {
      case topLevelTypes.topInput:
      case topLevelTypes.topSubmit:
        // HTML Events
        // @see http://www.w3.org/TR/html5/index.html#events-0
        EventConstructor = SyntheticEvent;
        break;
      case topLevelTypes.topKeyDown:
      case topLevelTypes.topKeyPress:
      case topLevelTypes.topKeyUp:
        EventConstructor = SyntheticKeyboardEvent;
        break;
      case topLevelTypes.topBlur:
      case topLevelTypes.topFocus:
        EventConstructor = SyntheticFocusEvent;
        break;
      case topLevelTypes.topClick:
        // Firefox creates a click event on right mouse clicks. This removes the
        // unwanted click events.
        if (nativeEvent.button === 2) {
          return null;
        }
        /* falls through */
      case topLevelTypes.topDoubleClick:
      case topLevelTypes.topDrag:
      case topLevelTypes.topDragEnd:
      case topLevelTypes.topDragEnter:
      case topLevelTypes.topDragExit:
      case topLevelTypes.topDragLeave:
      case topLevelTypes.topDragOver:
      case topLevelTypes.topDragStart:
      case topLevelTypes.topDrop:
      case topLevelTypes.topMouseDown:
      case topLevelTypes.topMouseMove:
      case topLevelTypes.topMouseUp:
        EventConstructor = SyntheticMouseEvent;
        break;
      case topLevelTypes.topTouchCancel:
      case topLevelTypes.topTouchEnd:
      case topLevelTypes.topTouchMove:
      case topLevelTypes.topTouchStart:
        EventConstructor = SyntheticTouchEvent;
        break;
      case topLevelTypes.topScroll:
        EventConstructor = SyntheticUIEvent;
        break;
      case topLevelTypes.topWheel:
        EventConstructor = SyntheticWheelEvent;
        break;
      case topLevelTypes.topCopy:
      case topLevelTypes.topCut:
      case topLevelTypes.topPaste:
        EventConstructor = SyntheticClipboardEvent;
        break;
    }
    invariant(
      EventConstructor,
      'SimpleEventPlugin: Unhandled event type, `%s`.',
      topLevelType
    );
    var event = EventConstructor.getPooled(
      dispatchConfig,
      topLevelTargetID,
      nativeEvent
    );
    EventPropagators.accumulateTwoPhaseDispatches(event);
    return event;
  }

};

module.exports = SimpleEventPlugin;

},{"./EventConstants":15,"./EventPropagators":20,"./SyntheticClipboardEvent":73,"./SyntheticEvent":75,"./SyntheticFocusEvent":76,"./SyntheticKeyboardEvent":77,"./SyntheticMouseEvent":78,"./SyntheticTouchEvent":79,"./SyntheticUIEvent":80,"./SyntheticWheelEvent":81,"./invariant":106,"./keyOf":113}],73:[function(require,module,exports){
/**
 * Copyright 2013 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule SyntheticClipboardEvent
 * @typechecks static-only
 */

"use strict";

var SyntheticEvent = require("./SyntheticEvent");

/**
 * @interface Event
 * @see http://www.w3.org/TR/clipboard-apis/
 */
var ClipboardEventInterface = {
  clipboardData: null
};

/**
 * @param {object} dispatchConfig Configuration used to dispatch this event.
 * @param {string} dispatchMarker Marker identifying the event target.
 * @param {object} nativeEvent Native browser event.
 * @extends {SyntheticUIEvent}
 */
function SyntheticClipboardEvent(dispatchConfig, dispatchMarker, nativeEvent) {
  SyntheticEvent.call(this, dispatchConfig, dispatchMarker, nativeEvent);
}

SyntheticEvent.augmentClass(SyntheticClipboardEvent, ClipboardEventInterface);

module.exports = SyntheticClipboardEvent;


},{"./SyntheticEvent":75}],74:[function(require,module,exports){
/**
 * Copyright 2013 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule SyntheticCompositionEvent
 * @typechecks static-only
 */

"use strict";

var SyntheticEvent = require("./SyntheticEvent");

/**
 * @interface Event
 * @see http://www.w3.org/TR/DOM-Level-3-Events/#events-compositionevents
 */
var CompositionEventInterface = {
  data: null
};

/**
 * @param {object} dispatchConfig Configuration used to dispatch this event.
 * @param {string} dispatchMarker Marker identifying the event target.
 * @param {object} nativeEvent Native browser event.
 * @extends {SyntheticUIEvent}
 */
function SyntheticCompositionEvent(
  dispatchConfig,
  dispatchMarker,
  nativeEvent) {
  SyntheticEvent.call(this, dispatchConfig, dispatchMarker, nativeEvent);
}

SyntheticEvent.augmentClass(
  SyntheticCompositionEvent,
  CompositionEventInterface
);

module.exports = SyntheticCompositionEvent;


},{"./SyntheticEvent":75}],75:[function(require,module,exports){
/**
 * Copyright 2013 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule SyntheticEvent
 * @typechecks static-only
 */

"use strict";

var PooledClass = require("./PooledClass");

var emptyFunction = require("./emptyFunction");
var getEventTarget = require("./getEventTarget");
var merge = require("./merge");
var mergeInto = require("./mergeInto");

/**
 * @interface Event
 * @see http://www.w3.org/TR/DOM-Level-3-Events/
 */
var EventInterface = {
  type: null,
  target: getEventTarget,
  currentTarget: null,
  eventPhase: null,
  bubbles: null,
  cancelable: null,
  timeStamp: function(event) {
    return event.timeStamp || Date.now();
  },
  defaultPrevented: null,
  isTrusted: null
};

/**
 * Synthetic events are dispatched by event plugins, typically in response to a
 * top-level event delegation handler.
 *
 * These systems should generally use pooling to reduce the frequency of garbage
 * collection. The system should check `isPersistent` to determine whether the
 * event should be released into the pool after being dispatched. Users that
 * need a persisted event should invoke `persist`.
 *
 * Synthetic events (and subclasses) implement the DOM Level 3 Events API by
 * normalizing browser quirks. Subclasses do not necessarily have to implement a
 * DOM interface; custom application-specific events can also subclass this.
 *
 * @param {object} dispatchConfig Configuration used to dispatch this event.
 * @param {string} dispatchMarker Marker identifying the event target.
 * @param {object} nativeEvent Native browser event.
 */
function SyntheticEvent(dispatchConfig, dispatchMarker, nativeEvent) {
  this.dispatchConfig = dispatchConfig;
  this.dispatchMarker = dispatchMarker;
  this.nativeEvent = nativeEvent;

  var Interface = this.constructor.Interface;
  for (var propName in Interface) {
    if (!Interface.hasOwnProperty(propName)) {
      continue;
    }
    var normalize = Interface[propName];
    if (normalize) {
      this[propName] = normalize(nativeEvent);
    } else {
      this[propName] = nativeEvent[propName];
    }
  }

  if (nativeEvent.defaultPrevented || nativeEvent.returnValue === false) {
    this.isDefaultPrevented = emptyFunction.thatReturnsTrue;
  } else {
    this.isDefaultPrevented = emptyFunction.thatReturnsFalse;
  }
  this.isPropagationStopped = emptyFunction.thatReturnsFalse;
}

mergeInto(SyntheticEvent.prototype, {

  preventDefault: function() {
    this.defaultPrevented = true;
    var event = this.nativeEvent;
    event.preventDefault ? event.preventDefault() : event.returnValue = false;
    this.isDefaultPrevented = emptyFunction.thatReturnsTrue;
  },

  stopPropagation: function() {
    var event = this.nativeEvent;
    event.stopPropagation ? event.stopPropagation() : event.cancelBubble = true;
    this.isPropagationStopped = emptyFunction.thatReturnsTrue;
  },

  /**
   * We release all dispatched `SyntheticEvent`s after each event loop, adding
   * them back into the pool. This allows a way to hold onto a reference that
   * won't be added back into the pool.
   */
  persist: function() {
    this.isPersistent = emptyFunction.thatReturnsTrue;
  },

  /**
   * Checks if this event should be released back into the pool.
   *
   * @return {boolean} True if this should not be released, false otherwise.
   */
  isPersistent: emptyFunction.thatReturnsFalse,

  /**
   * `PooledClass` looks for `destructor` on each instance it releases.
   */
  destructor: function() {
    var Interface = this.constructor.Interface;
    for (var propName in Interface) {
      this[propName] = null;
    }
    this.dispatchConfig = null;
    this.dispatchMarker = null;
    this.nativeEvent = null;
  }

});

SyntheticEvent.Interface = EventInterface;

/**
 * Helper to reduce boilerplate when creating subclasses.
 *
 * @param {function} Class
 * @param {?object} Interface
 */
SyntheticEvent.augmentClass = function(Class, Interface) {
  var Super = this;

  var prototype = Object.create(Super.prototype);
  mergeInto(prototype, Class.prototype);
  Class.prototype = prototype;
  Class.prototype.constructor = Class;

  Class.Interface = merge(Super.Interface, Interface);
  Class.augmentClass = Super.augmentClass;

  PooledClass.addPoolingTo(Class, PooledClass.threeArgumentPooler);
};

PooledClass.addPoolingTo(SyntheticEvent, PooledClass.threeArgumentPooler);

module.exports = SyntheticEvent;

},{"./PooledClass":25,"./emptyFunction":92,"./getEventTarget":100,"./merge":115,"./mergeInto":117}],76:[function(require,module,exports){
/**
 * Copyright 2013 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule SyntheticFocusEvent
 * @typechecks static-only
 */

"use strict";

var SyntheticUIEvent = require("./SyntheticUIEvent");

/**
 * @interface FocusEvent
 * @see http://www.w3.org/TR/DOM-Level-3-Events/
 */
var FocusEventInterface = {
  relatedTarget: null
};

/**
 * @param {object} dispatchConfig Configuration used to dispatch this event.
 * @param {string} dispatchMarker Marker identifying the event target.
 * @param {object} nativeEvent Native browser event.
 * @extends {SyntheticUIEvent}
 */
function SyntheticFocusEvent(dispatchConfig, dispatchMarker, nativeEvent) {
  SyntheticUIEvent.call(this, dispatchConfig, dispatchMarker, nativeEvent);
}

SyntheticUIEvent.augmentClass(SyntheticFocusEvent, FocusEventInterface);

module.exports = SyntheticFocusEvent;

},{"./SyntheticUIEvent":80}],77:[function(require,module,exports){
/**
 * Copyright 2013 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule SyntheticKeyboardEvent
 * @typechecks static-only
 */

"use strict";

var SyntheticUIEvent = require("./SyntheticUIEvent");

/**
 * @interface KeyboardEvent
 * @see http://www.w3.org/TR/DOM-Level-3-Events/
 */
var KeyboardEventInterface = {
  'char': null,
  key: null,
  location: null,
  ctrlKey: null,
  shiftKey: null,
  altKey: null,
  metaKey: null,
  repeat: null,
  locale: null,
  // Legacy Interface
  charCode: null,
  keyCode: null,
  which: null
};

/**
 * @param {object} dispatchConfig Configuration used to dispatch this event.
 * @param {string} dispatchMarker Marker identifying the event target.
 * @param {object} nativeEvent Native browser event.
 * @extends {SyntheticUIEvent}
 */
function SyntheticKeyboardEvent(dispatchConfig, dispatchMarker, nativeEvent) {
  SyntheticUIEvent.call(this, dispatchConfig, dispatchMarker, nativeEvent);
}

SyntheticUIEvent.augmentClass(SyntheticKeyboardEvent, KeyboardEventInterface);

module.exports = SyntheticKeyboardEvent;

},{"./SyntheticUIEvent":80}],78:[function(require,module,exports){
/**
 * Copyright 2013 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule SyntheticMouseEvent
 * @typechecks static-only
 */

"use strict";

var SyntheticUIEvent = require("./SyntheticUIEvent");
var ViewportMetrics = require("./ViewportMetrics");

/**
 * @interface MouseEvent
 * @see http://www.w3.org/TR/DOM-Level-3-Events/
 */
var MouseEventInterface = {
  screenX: null,
  screenY: null,
  clientX: null,
  clientY: null,
  ctrlKey: null,
  shiftKey: null,
  altKey: null,
  metaKey: null,
  button: function(event) {
    // Webkit, Firefox, IE9+
    // which:  1 2 3
    // button: 0 1 2 (standard)
    var button = event.button;
    if ('which' in event) {
      return button;
    }
    // IE<9
    // which:  undefined
    // button: 0 0 0
    // button: 1 4 2 (onmouseup)
    return button === 2 ? 2 : button === 4 ? 1 : 0;
  },
  buttons: null,
  relatedTarget: function(event) {
    return event.relatedTarget || (
      event.fromElement === event.srcElement ?
        event.toElement :
        event.fromElement
    );
  },
  // "Proprietary" Interface.
  pageX: function(event) {
    return 'pageX' in event ?
      event.pageX :
      event.clientX + ViewportMetrics.currentScrollLeft;
  },
  pageY: function(event) {
    return 'pageY' in event ?
      event.pageY :
      event.clientY + ViewportMetrics.currentScrollTop;
  }
};

/**
 * @param {object} dispatchConfig Configuration used to dispatch this event.
 * @param {string} dispatchMarker Marker identifying the event target.
 * @param {object} nativeEvent Native browser event.
 * @extends {SyntheticUIEvent}
 */
function SyntheticMouseEvent(dispatchConfig, dispatchMarker, nativeEvent) {
  SyntheticUIEvent.call(this, dispatchConfig, dispatchMarker, nativeEvent);
}

SyntheticUIEvent.augmentClass(SyntheticMouseEvent, MouseEventInterface);

module.exports = SyntheticMouseEvent;

},{"./SyntheticUIEvent":80,"./ViewportMetrics":83}],79:[function(require,module,exports){
/**
 * Copyright 2013 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule SyntheticTouchEvent
 * @typechecks static-only
 */

"use strict";

var SyntheticUIEvent = require("./SyntheticUIEvent");

/**
 * @interface TouchEvent
 * @see http://www.w3.org/TR/touch-events/
 */
var TouchEventInterface = {
  touches: null,
  targetTouches: null,
  changedTouches: null,
  altKey: null,
  metaKey: null,
  ctrlKey: null,
  shiftKey: null
};

/**
 * @param {object} dispatchConfig Configuration used to dispatch this event.
 * @param {string} dispatchMarker Marker identifying the event target.
 * @param {object} nativeEvent Native browser event.
 * @extends {SyntheticUIEvent}
 */
function SyntheticTouchEvent(dispatchConfig, dispatchMarker, nativeEvent) {
  SyntheticUIEvent.call(this, dispatchConfig, dispatchMarker, nativeEvent);
}

SyntheticUIEvent.augmentClass(SyntheticTouchEvent, TouchEventInterface);

module.exports = SyntheticTouchEvent;

},{"./SyntheticUIEvent":80}],80:[function(require,module,exports){
/**
 * Copyright 2013 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule SyntheticUIEvent
 * @typechecks static-only
 */

"use strict";

var SyntheticEvent = require("./SyntheticEvent");

/**
 * @interface UIEvent
 * @see http://www.w3.org/TR/DOM-Level-3-Events/
 */
var UIEventInterface = {
  view: null,
  detail: null
};

/**
 * @param {object} dispatchConfig Configuration used to dispatch this event.
 * @param {string} dispatchMarker Marker identifying the event target.
 * @param {object} nativeEvent Native browser event.
 * @extends {SyntheticEvent}
 */
function SyntheticUIEvent(dispatchConfig, dispatchMarker, nativeEvent) {
  SyntheticEvent.call(this, dispatchConfig, dispatchMarker, nativeEvent);
}

SyntheticEvent.augmentClass(SyntheticUIEvent, UIEventInterface);

module.exports = SyntheticUIEvent;

},{"./SyntheticEvent":75}],81:[function(require,module,exports){
/**
 * Copyright 2013 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule SyntheticWheelEvent
 * @typechecks static-only
 */

"use strict";

var SyntheticMouseEvent = require("./SyntheticMouseEvent");

/**
 * @interface WheelEvent
 * @see http://www.w3.org/TR/DOM-Level-3-Events/
 */
var WheelEventInterface = {
  deltaX: function(event) {
    // NOTE: IE<9 does not support x-axis delta.
    return (
      'deltaX' in event ? event.deltaX :
      // Fallback to `wheelDeltaX` for Webkit and normalize (right is positive).
      'wheelDeltaX' in event ? -event.wheelDeltaX : 0
    );
  },
  deltaY: function(event) {
    return (
      // Normalize (up is positive).
      'deltaY' in event ? -event.deltaY :
      // Fallback to `wheelDeltaY` for Webkit.
      'wheelDeltaY' in event ? event.wheelDeltaY :
      // Fallback to `wheelDelta` for IE<9.
      'wheelDelta' in event ? event.wheelData : 0
    );
  },
  deltaZ: null,
  deltaMode: null
};

/**
 * @param {object} dispatchConfig Configuration used to dispatch this event.
 * @param {string} dispatchMarker Marker identifying the event target.
 * @param {object} nativeEvent Native browser event.
 * @extends {SyntheticMouseEvent}
 */
function SyntheticWheelEvent(dispatchConfig, dispatchMarker, nativeEvent) {
  SyntheticMouseEvent.call(this, dispatchConfig, dispatchMarker, nativeEvent);
}

SyntheticMouseEvent.augmentClass(SyntheticWheelEvent, WheelEventInterface);

module.exports = SyntheticWheelEvent;

},{"./SyntheticMouseEvent":78}],82:[function(require,module,exports){
/**
 * Copyright 2013 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule Transaction
 */

"use strict";

var invariant = require("./invariant");

/**
 * `Transaction` creates a black box that is able to wrap any method such that
 * certain invariants are maintained before and after the method is invoked
 * (Even if an exception is thrown while invoking the wrapped method). Whoever
 * instantiates a transaction can provide enforcers of the invariants at
 * creation time. The `Transaction` class itself will supply one additional
 * automatic invariant for you - the invariant that any transaction instance
 * should not be ran while it is already being ran. You would typically create a
 * single instance of a `Transaction` for reuse multiple times, that potentially
 * is used to wrap several different methods. Wrappers are extremely simple -
 * they only require implementing two methods.
 *
 * <pre>
 *                       wrappers (injected at creation time)
 *                                      +        +
 *                                      |        |
 *                    +-----------------|--------|--------------+
 *                    |                 v        |              |
 *                    |      +---------------+   |              |
 *                    |   +--|    wrapper1   |---|----+         |
 *                    |   |  +---------------+   v    |         |
 *                    |   |          +-------------+  |         |
 *                    |   |     +----|   wrapper2  |--------+   |
 *                    |   |     |    +-------------+  |     |   |
 *                    |   |     |                     |     |   |
 *                    |   v     v                     v     v   | wrapper
 *                    | +---+ +---+   +---------+   +---+ +---+ | invariants
 * perform(anyMethod) | |   | |   |   |         |   |   | |   | | maintained
 * +----------------->|-|---|-|---|-->|anyMethod|---|---|-|---|-|-------->
 *                    | |   | |   |   |         |   |   | |   | |
 *                    | |   | |   |   |         |   |   | |   | |
 *                    | |   | |   |   |         |   |   | |   | |
 *                    | +---+ +---+   +---------+   +---+ +---+ |
 *                    |  initialize                    close    |
 *                    +-----------------------------------------+
 * </pre>
 *
 * Bonus:
 * - Reports timing metrics by method name and wrapper index.
 *
 * Use cases:
 * - Preserving the input selection ranges before/after reconciliation.
 *   Restoring selection even in the event of an unexpected error.
 * - Deactivating events while rearranging the DOM, preventing blurs/focuses,
 *   while guaranteeing that afterwards, the event system is reactivated.
 * - Flushing a queue of collected DOM mutations to the main UI thread after a
 *   reconciliation takes place in a worker thread.
 * - Invoking any collected `componentDidRender` callbacks after rendering new
 *   content.
 * - (Future use case): Wrapping particular flushes of the `ReactWorker` queue
 *   to preserve the `scrollTop` (an automatic scroll aware DOM).
 * - (Future use case): Layout calculations before and after DOM upates.
 *
 * Transactional plugin API:
 * - A module that has an `initialize` method that returns any precomputation.
 * - and a `close` method that accepts the precomputation. `close` is invoked
 *   when the wrapped process is completed, or has failed.
 *
 * @param {Array<TransactionalWrapper>} transactionWrapper Wrapper modules
 * that implement `initialize` and `close`.
 * @return {Transaction} Single transaction for reuse in thread.
 *
 * @class Transaction
 */
var Mixin = {
  /**
   * Sets up this instance so that it is prepared for collecting metrics. Does
   * so such that this setup method may be used on an instance that is already
   * initialized, in a way that does not consume additional memory upon reuse.
   * That can be useful if you decide to make your subclass of this mixin a
   * "PooledClass".
   */
  reinitializeTransaction: function() {
    this.transactionWrappers = this.getTransactionWrappers();
    if (!this.wrapperInitData) {
      this.wrapperInitData = [];
    } else {
      this.wrapperInitData.length = 0;
    }
    if (!this.timingMetrics) {
      this.timingMetrics = {};
    }
    this.timingMetrics.methodInvocationTime = 0;
    if (!this.timingMetrics.wrapperInitTimes) {
      this.timingMetrics.wrapperInitTimes = [];
    } else {
      this.timingMetrics.wrapperInitTimes.length = 0;
    }
    if (!this.timingMetrics.wrapperCloseTimes) {
      this.timingMetrics.wrapperCloseTimes = [];
    } else {
      this.timingMetrics.wrapperCloseTimes.length = 0;
    }
    this._isInTransaction = false;
  },

  _isInTransaction: false,

  /**
   * @abstract
   * @return {Array<TransactionWrapper>} Array of transaction wrappers.
   */
  getTransactionWrappers: null,

  isInTransaction: function() {
    return !!this._isInTransaction;
  },

  /**
   * Executes the function within a safety window. Use this for the top level
   * methods that result in large amounts of computation/mutations that would
   * need to be safety checked.
   *
   * @param {function} method Member of scope to call.
   * @param {Object} scope Scope to invoke from.
   * @param {Object?=} args... Arguments to pass to the method (optional).
   *                           Helps prevent need to bind in many cases.
   * @return Return value from `method`.
   */
  perform: function(method, scope, a, b, c, d, e, f) {
    invariant(
      !this.isInTransaction(),
      'Transaction.perform(...): Cannot initialize a transaction when there ' +
      'is already an outstanding transaction.'
    );
    var memberStart = Date.now();
    var errorToThrow = null;
    var ret;
    try {
      this.initializeAll();
      ret = method.call(scope, a, b, c, d, e, f);
    } catch (error) {
      // IE8 requires `catch` in order to use `finally`.
      errorToThrow = error;
    } finally {
      var memberEnd = Date.now();
      this.methodInvocationTime += (memberEnd - memberStart);
      try {
        this.closeAll();
      } catch (closeError) {
        // If `method` throws, prefer to show that stack trace over any thrown
        // by invoking `closeAll`.
        errorToThrow = errorToThrow || closeError;
      }
    }
    if (errorToThrow) {
      throw errorToThrow;
    }
    return ret;
  },

  initializeAll: function() {
    this._isInTransaction = true;
    var transactionWrappers = this.transactionWrappers;
    var wrapperInitTimes = this.timingMetrics.wrapperInitTimes;
    var errorToThrow = null;
    for (var i = 0; i < transactionWrappers.length; i++) {
      var initStart = Date.now();
      var wrapper = transactionWrappers[i];
      try {
        this.wrapperInitData[i] = wrapper.initialize ?
          wrapper.initialize.call(this) :
          null;
      } catch (initError) {
        // Prefer to show the stack trace of the first error.
        errorToThrow = errorToThrow || initError;
        this.wrapperInitData[i] = Transaction.OBSERVED_ERROR;
      } finally {
        var curInitTime = wrapperInitTimes[i];
        var initEnd = Date.now();
        wrapperInitTimes[i] = (curInitTime || 0) + (initEnd - initStart);
      }
    }
    if (errorToThrow) {
      throw errorToThrow;
    }
  },

  /**
   * Invokes each of `this.transactionWrappers.close[i]` functions, passing into
   * them the respective return values of `this.transactionWrappers.init[i]`
   * (`close`rs that correspond to initializers that failed will not be
   * invoked).
   */
  closeAll: function() {
    invariant(
      this.isInTransaction(),
      'Transaction.closeAll(): Cannot close transaction when none are open.'
    );
    var transactionWrappers = this.transactionWrappers;
    var wrapperCloseTimes = this.timingMetrics.wrapperCloseTimes;
    var errorToThrow = null;
    for (var i = 0; i < transactionWrappers.length; i++) {
      var wrapper = transactionWrappers[i];
      var closeStart = Date.now();
      var initData = this.wrapperInitData[i];
      try {
        if (initData !== Transaction.OBSERVED_ERROR) {
          wrapper.close && wrapper.close.call(this, initData);
        }
      } catch (closeError) {
        // Prefer to show the stack trace of the first error.
        errorToThrow = errorToThrow || closeError;
      } finally {
        var closeEnd = Date.now();
        var curCloseTime = wrapperCloseTimes[i];
        wrapperCloseTimes[i] = (curCloseTime || 0) + (closeEnd - closeStart);
      }
    }
    this.wrapperInitData.length = 0;
    this._isInTransaction = false;
    if (errorToThrow) {
      throw errorToThrow;
    }
  }
};

var Transaction = {

  Mixin: Mixin,

  /**
   * Token to look for to determine if an error occured.
   */
  OBSERVED_ERROR: {}

};

module.exports = Transaction;

},{"./invariant":106}],83:[function(require,module,exports){
/**
 * Copyright 2013 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule ViewportMetrics
 */

"use strict";

var ViewportMetrics = {

  currentScrollLeft: 0,

  currentScrollTop: 0,

  refreshScrollValues: function() {
    ViewportMetrics.currentScrollLeft =
      document.body.scrollLeft + document.documentElement.scrollLeft;
    ViewportMetrics.currentScrollTop =
      document.body.scrollTop + document.documentElement.scrollTop;
  }

};

module.exports = ViewportMetrics;

},{}],84:[function(require,module,exports){
/**
 * Copyright 2013 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule accumulate
 */

"use strict";

var invariant = require("./invariant");

/**
 * Accumulates items that must not be null or undefined.
 *
 * This is used to conserve memory by avoiding array allocations.
 *
 * @return {*|array<*>} An accumulation of items.
 */
function accumulate(current, next) {
  invariant(
    next != null,
    'accumulate(...): Accumulated items must be not be null or undefined.'
  );
  if (current == null) {
    return next;
  } else {
    // Both are not empty. Warning: Never call x.concat(y) when you are not
    // certain that x is an Array (x could be a string with concat method).
    var currentIsArray = Array.isArray(current);
    var nextIsArray = Array.isArray(next);
    if (currentIsArray) {
      return current.concat(next);
    } else {
      if (nextIsArray) {
        return [current].concat(next);
      } else {
        return [current, next];
      }
    }
  }
}

module.exports = accumulate;

},{"./invariant":106}],85:[function(require,module,exports){
/**
 * Copyright 2013 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule adler32
 */

/* jslint bitwise:true */

"use strict";

var MOD = 65521;

// This is a clean-room implementation of adler32 designed for detecting
// if markup is not what we expect it to be. It does not need to be
// cryptographically strong, only reasonable good at detecting if markup
// generated on the server is different than that on the client.
function adler32(data) {
  var a = 1;
  var b = 0;
  for (var i = 0; i < data.length; i++) {
    a = (a + data.charCodeAt(i)) % MOD;
    b = (b + a) % MOD;
  }
  return a | (b << 16);
}

module.exports = adler32;

},{}],86:[function(require,module,exports){
/**
 * Copyright 2013 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule copyProperties
 */

/**
 * Copy properties from one or more objects (up to 5) into the first object.
 * This is a shallow copy. It mutates the first object and also returns it.
 *
 * NOTE: `arguments` has a very significant performance penalty, which is why
 * we don't support unlimited arguments.
 */
function copyProperties(obj, a, b, c, d, e, f) {
  obj = obj || {};

  if (true) {
    if (f) {
      throw new Error('Too many arguments passed to copyProperties');
    }
  }

  var args = [a, b, c, d, e];
  var ii = 0, v;
  while (args[ii]) {
    v = args[ii++];
    for (var k in v) {
      obj[k] = v[k];
    }

    // IE ignores toString in object iteration.. See:
    // webreflection.blogspot.com/2007/07/quick-fix-internet-explorer-and.html
    if (v.hasOwnProperty && v.hasOwnProperty('toString') &&
        (typeof v.toString != 'undefined') && (obj.toString !== v.toString)) {
      obj.toString = v.toString;
    }
  }

  return obj;
}

module.exports = copyProperties;

},{}],87:[function(require,module,exports){
/**
 * Copyright 2013 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule createArrayFrom
 * @typechecks
 */

/**
 * NOTE: if you are a previous user of this function, it has been considered
 * unsafe because it's inconsistent across browsers for some inputs.
 * Instead use `Array.isArray()`.
 *
 * Perform a heuristic test to determine if an object is "array-like".
 *
 *   A monk asked Joshu, a Zen master, "Has a dog Buddha nature?"
 *   Joshu replied: "Mu."
 *
 * This function determines if its argument has "array nature": it returns
 * true if the argument is an actual array, an `arguments' object, or an
 * HTMLCollection (e.g. node.childNodes or node.getElementsByTagName()).
 *
 * @param {*} obj
 * @return {boolean}
 */
function hasArrayNature(obj) {
  return (
    // not null/false
    !!obj &&
    // arrays are objects, NodeLists are functions in Safari
    (typeof obj == 'object' || typeof obj == 'function') &&
    // quacks like an array
    ('length' in obj) &&
    // not window
    !('setInterval' in obj) &&
    // no DOM node should be considered an array-like
    // a 'select' element has 'length' and 'item' properties on IE8
    (typeof obj.nodeType != 'number') &&
    (
      // a real array
      (// HTMLCollection/NodeList
      (Array.isArray(obj) ||
      // arguments
      ('callee' in obj) || 'item' in obj))
    )
  );
}

/**
 * Ensure that the argument is an array by wrapping it in an array if it is not.
 * Creates a copy of the argument if it is already an array.
 *
 * This is mostly useful idiomatically:
 *
 *   var createArrayFrom = require('createArrayFrom');
 *
 *   function takesOneOrMoreThings(things) {
 *     things = createArrayFrom(things);
 *     ...
 *   }
 *
 * This allows you to treat `things' as an array, but accept scalars in the API.
 *
 * This is also good for converting certain pseudo-arrays, like `arguments` or
 * HTMLCollections, into arrays.
 *
 * @param {*} obj
 * @return {array}
 */
function createArrayFrom(obj) {
  if (!hasArrayNature(obj)) {
    return [obj];
  }
  if (obj.item) {
    // IE does not support Array#slice on HTMLCollections
    var l = obj.length, ret = new Array(l);
    while (l--) { ret[l] = obj[l]; }
    return ret;
  }
  return Array.prototype.slice.call(obj);
}

module.exports = createArrayFrom;

},{}],88:[function(require,module,exports){
/**
 * Copyright 2013 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule createNodesFromMarkup
 * @typechecks
 */

/*jslint evil: true, sub: true */

var ExecutionEnvironment = require("./ExecutionEnvironment");

var createArrayFrom = require("./createArrayFrom");
var getMarkupWrap = require("./getMarkupWrap");
var invariant = require("./invariant");

/**
 * Dummy container used to render all markup.
 */
var dummyNode =
  ExecutionEnvironment.canUseDOM ? document.createElement('div') : null;

/**
 * Pattern used by `getNodeName`.
 */
var nodeNamePattern = /^\s*<(\w+)/;

/**
 * Extracts the `nodeName` of the first element in a string of markup.
 *
 * @param {string} markup String of markup.
 * @return {?string} Node name of the supplied markup.
 */
function getNodeName(markup) {
  var nodeNameMatch = markup.match(nodeNamePattern);
  return nodeNameMatch && nodeNameMatch[1].toLowerCase();
}

/**
 * Creates an array containing the nodes rendered from the supplied markup. The
 * optionally supplied `handleScript` function will be invoked once for each
 * <script> element that is rendered. If no `handleScript` function is supplied,
 * an exception is thrown if any <script> elements are rendered.
 *
 * @param {string} markup A string of valid HTML markup.
 * @param {?function} handleScript Invoked once for each rendered <script>.
 * @return {array<DOMElement|DOMTextNode>} An array of rendered nodes.
 */
function createNodesFromMarkup(markup, handleScript) {
  var node = dummyNode;
  invariant(!!dummyNode, 'createNodesFromMarkup dummy not initialized');
  var nodeName = getNodeName(markup);

  var wrap = nodeName && getMarkupWrap(nodeName);
  if (wrap) {
    node.innerHTML = wrap[1] + markup + wrap[2];

    var wrapDepth = wrap[0];
    while (wrapDepth--) {
      node = node.lastChild;
    }
  } else {
    node.innerHTML = markup;
  }

  var scripts = node.getElementsByTagName('script');
  if (scripts.length) {
    invariant(
      handleScript,
      'createNodesFromMarkup(...): Unexpected <script> element rendered.'
    );
    createArrayFrom(scripts).forEach(handleScript);
  }

  var nodes = createArrayFrom(node.childNodes);
  while (node.lastChild) {
    node.removeChild(node.lastChild);
  }
  return nodes;
}

module.exports = createNodesFromMarkup;

},{"./ExecutionEnvironment":21,"./createArrayFrom":87,"./getMarkupWrap":101,"./invariant":106}],89:[function(require,module,exports){
/**
 * Copyright 2013 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule createObjectFrom
 */

/**
 * Construct an object from an array of keys
 * and optionally specified value or list of values.
 *
 *  >>> createObjectFrom(['a','b','c']);
 *  {a: true, b: true, c: true}
 *
 *  >>> createObjectFrom(['a','b','c'], false);
 *  {a: false, b: false, c: false}
 *
 *  >>> createObjectFrom(['a','b','c'], 'monkey');
 *  {c:'monkey', b:'monkey' c:'monkey'}
 *
 *  >>> createObjectFrom(['a','b','c'], [1,2,3]);
 *  {a: 1, b: 2, c: 3}
 *
 *  >>> createObjectFrom(['women', 'men'], [true, false]);
 *  {women: true, men: false}
 *
 * @param   Array   list of keys
 * @param   mixed   optional value or value array.  defaults true.
 * @returns object
 */
function createObjectFrom(keys, values /* = true */) {
  if (true) {
    if (!Array.isArray(keys)) {
      throw new TypeError('Must pass an array of keys.');
    }
  }

  var object = {};
  var isArray = Array.isArray(values);
  if (typeof values == 'undefined') {
    values = true;
  }

  for (var ii = keys.length; ii--;) {
    object[keys[ii]] = isArray ? values[ii] : values;
  }
  return object;
}

module.exports = createObjectFrom;

},{}],90:[function(require,module,exports){
/**
 * Copyright 2013 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule cx
 */

/**
 * This function is used to mark string literals representing CSS class names
 * so that they can be transformed statically. This allows for modularization
 * and minification of CSS class names.
 *
 * In static_upstream, this function is actually implemented, but it should
 * eventually be replaced with something more descriptive, and the transform
 * that is used in the main stack should be ported for use elsewhere.
 *
 * @param string|object className to modularize, or an object of key/values.
 *                      In the object case, the values are conditions that
 *                      determine if the className keys should be included.
 * @param [string ...]  Variable list of classNames in the string case.
 * @return string       Renderable space-separated CSS className.
 */
function cx(classNames) {
  if (typeof classNames == 'object') {
    return Object.keys(classNames).map(function(className) {
      return classNames[className] ? className : '';
    }).join(' ');
  } else {
    return Array.prototype.join.call(arguments, ' ');
  }
}

module.exports = cx;

},{}],91:[function(require,module,exports){
/**
 * Copyright 2013 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule dangerousStyleValue
 * @typechecks static-only
 */

"use strict";

var CSSProperty = require("./CSSProperty");

/**
 * Convert a value into the proper css writable value. The `styleName` name
 * name should be logical (no hyphens), as specified
 * in `CSSProperty.isUnitlessNumber`.
 *
 * @param {string} styleName CSS property name such as `topMargin`.
 * @param {*} value CSS property value such as `10px`.
 * @return {string} Normalized style value with dimensions applied.
 */
function dangerousStyleValue(styleName, value) {
  // Note that we've removed escapeTextForBrowser() calls here since the
  // whole string will be escaped when the attribute is injected into
  // the markup. If you provide unsafe user data here they can inject
  // arbitrary CSS which may be problematic (I couldn't repro this):
  // https://www.owasp.org/index.php/XSS_Filter_Evasion_Cheat_Sheet
  // http://www.thespanner.co.uk/2007/11/26/ultimate-xss-css-injection/
  // This is not an XSS hole but instead a potential CSS injection issue
  // which has lead to a greater discussion about how we're going to
  // trust URLs moving forward. See #2115901

  var isEmpty = value == null || typeof value === 'boolean' || value === '';
  if (isEmpty) {
    return '';
  }

  var isNonNumeric = isNaN(value);
  if (isNonNumeric || value === 0 || CSSProperty.isUnitlessNumber[styleName]) {
    return '' + value; // cast to string
  }

  return value + 'px';
}

module.exports = dangerousStyleValue;

},{"./CSSProperty":3}],92:[function(require,module,exports){
/**
 * Copyright 2013 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule emptyFunction
 */

var copyProperties = require("./copyProperties");

function makeEmptyFunction(arg) {
  return function() {
    return arg;
  };
}

/**
 * This function accepts and discards inputs; it has no side effects. This is
 * primarily useful idiomatically for overridable function endpoints which
 * always need to be callable, since JS lacks a null-call idiom ala Cocoa.
 */
function emptyFunction() {}

copyProperties(emptyFunction, {
  thatReturns: makeEmptyFunction,
  thatReturnsFalse: makeEmptyFunction(false),
  thatReturnsTrue: makeEmptyFunction(true),
  thatReturnsNull: makeEmptyFunction(null),
  thatReturnsThis: function() { return this; },
  thatReturnsArgument: function(arg) { return arg; }
});

module.exports = emptyFunction;

},{"./copyProperties":86}],93:[function(require,module,exports){
/**
 * Copyright 2013 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule escapeTextForBrowser
 * @typechecks static-only
 */

"use strict";

var ESCAPE_LOOKUP = {
  "&": "&amp;",
  ">": "&gt;",
  "<": "&lt;",
  "\"": "&quot;",
  "'": "&#x27;",
  "/": "&#x2f;"
};

var ESCAPE_REGEX = /[&><"'\/]/g;

function escaper(match) {
  return ESCAPE_LOOKUP[match];
}

/**
 * Escapes text to prevent scripting attacks.
 *
 * @param {*} text Text value to escape.
 * @return {string} An escaped string.
 */
function escapeTextForBrowser(text) {
  return ('' + text).replace(ESCAPE_REGEX, escaper);
}

module.exports = escapeTextForBrowser;

},{}],94:[function(require,module,exports){
/**
 * Copyright 2013 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule ex
 * @typechecks
 * @nostacktrace
 */

/**
 * This function transforms error message with arguments into plain text error
 * message, so that it can be passed to window.onerror without losing anything.
 * It can then be transformed back by `erx()` function.
 *
 * Usage:
 *   throw new Error(ex('Error %s from %s', errorCode, userID));
 *
 * @param {string} errorMessage
 */

var ex = function(errorMessage/*, arg1, arg2, ...*/) {
  var args = Array.prototype.slice.call(arguments).map(function(arg) {
    return String(arg);
  });
  var expectedLength = errorMessage.split('%s').length - 1;

  if (expectedLength !== args.length - 1) {
    // something wrong with the formatting string
    return ex('ex args number mismatch: %s', JSON.stringify(args));
  }

  return ex._prefix + JSON.stringify(args) + ex._suffix;
};

ex._prefix = '<![EX[';
ex._suffix = ']]>';

module.exports = ex;

},{}],95:[function(require,module,exports){
/**
 * Copyright 2013 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule filterAttributes
 * @typechecks static-only
 */

/*jslint evil: true */

'use strict';

/**
 * Like filter(), but for a DOM nodes attributes. Returns an array of
 * the filter DOMAttribute objects. Does some perf related this like
 * caching attributes.length.
 *
 * @param {DOMElement} node Node whose attributes you want to filter
 * @return {array} array of DOM attribute objects.
 */
function filterAttributes(node, func, context) {
  var attributes = node.attributes;
  var numAttributes = attributes.length;
  var accumulator = [];
  for (var i = 0; i < numAttributes; i++) {
    var attr = attributes.item(i);
    if (func.call(context, attr)) {
      accumulator.push(attr);
    }
  }
  return accumulator;
}

module.exports = filterAttributes;

},{}],96:[function(require,module,exports){
/**
 * Copyright 2013 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule flattenChildren
 */

"use strict";

var invariant = require("./invariant");
var traverseAllChildren = require("./traverseAllChildren");

/**
 * @param {function} traverseContext Context passed through traversal.
 * @param {?ReactComponent} child React child component.
 * @param {!string} name String name of key path to child.
 */
function flattenSingleChildIntoContext(traverseContext, child, name) {
  // We found a component instance.
  var result = traverseContext;
  invariant(
    !result.hasOwnProperty(name),
    'flattenChildren(...): Encountered two children with the same key, `%s`. ' +
    'Children keys must be unique.',
    name
  );
  result[name] = child;
}

/**
 * Flattens children that are typically specified as `props.children`.
 * @return {!object} flattened children keyed by name.
 */
function flattenChildren(children) {
  if (children == null) {
    return children;
  }
  var result = {};
  traverseAllChildren(children, flattenSingleChildIntoContext, result);
  return result;
}

module.exports = flattenChildren;

},{"./invariant":106,"./traverseAllChildren":125}],97:[function(require,module,exports){
/**
 * Copyright 2013 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule forEachAccumulated
 */

"use strict";

/**
 * @param {array} an "accumulation" of items which is either an Array or
 * a single item. Useful when paired with the `accumulate` module. This is a
 * simple utility that allows us to reason about a collection of items, but
 * handling the case when there is exactly one item (and we do not need to
 * allocate an array).
 */
var forEachAccumulated = function(arr, cb, scope) {
  if (Array.isArray(arr)) {
    arr.forEach(cb, scope);
  } else if (arr) {
    cb.call(scope, arr);
  }
};

module.exports = forEachAccumulated;

},{}],98:[function(require,module,exports){
/**
 * Copyright 2013 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule ge
 */

/**
 * Find a node by ID.  Optionally search a sub-tree outside of the document
 *
 * Use ge if you're not sure whether or not the element exists. You can test
 * for existence yourself in your application code.
 *
 * If your application code depends on the existence of the element, use $
 * instead, which will throw in DEV if the element doesn't exist.
 */
function ge(arg, root, tag) {
  return typeof arg != 'string' ? arg :
    !root ? document.getElementById(arg) :
    _geFromSubtree(arg, root, tag);
}

function _geFromSubtree(id, root, tag) {
  var elem, children, ii;

  if (_getNodeID(root) == id) {
    return root;
  } else if (root.getElementsByTagName) {
    // All Elements implement this, which does an iterative DFS, which is
    // faster than recursion and doesn't run into stack depth issues.
    children = root.getElementsByTagName(tag || '*');
    for (ii = 0; ii < children.length; ii++) {
      if (_getNodeID(children[ii]) == id) {
        return children[ii];
      }
    }
  } else {
    // DocumentFragment does not implement getElementsByTagName, so
    // recurse over its children. Its children must be Elements, so
    // each child will use the getElementsByTagName case instead.
    children = root.childNodes;
    for (ii = 0; ii < children.length; ii++) {
      elem = _geFromSubtree(id, children[ii]);
      if (elem) {
        return elem;
      }
    }
  }

  return null;
}

/**
 * Return the ID value for a given node. This allows us to avoid issues
 * with forms that contain inputs with name="id".
 *
 * @return string (null if attribute not set)
 */
function _getNodeID(node) {
  // #document and #document-fragment do not have getAttributeNode.
  var id = node.getAttributeNode && node.getAttributeNode('id');
  return id ? id.value : null;
}

module.exports = ge;

},{}],99:[function(require,module,exports){
/**
 * Copyright 2013 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule getActiveElement
 * @typechecks
 */

/**
 * Same as document.activeElement but wraps in a try-catch block. In IE it is
 * not safe to call document.activeElement if there is nothing focused.
 */
function getActiveElement() /*?DOMElement*/ {
  try {
    return document.activeElement;
  } catch (e) {
    return null;
  }
}

module.exports = getActiveElement;


},{}],100:[function(require,module,exports){
/**
 * Copyright 2013 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule getEventTarget
 * @typechecks static-only
 */

"use strict";

/**
 * Gets the target node from a native browser event by accounting for
 * inconsistencies in browser DOM APIs.
 *
 * @param {object} nativeEvent Native browser event.
 * @return {DOMEventTarget} Target node.
 */
function getEventTarget(nativeEvent) {
  var target = nativeEvent.target || nativeEvent.srcElement || window;
  // Safari may fire events on text nodes (Node.TEXT_NODE is 3).
  // @see http://www.quirksmode.org/js/events_properties.html
  return target.nodeType === 3 ? target.parentNode : target;
}

module.exports = getEventTarget;

},{}],101:[function(require,module,exports){
/**
 * Copyright 2013 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule getMarkupWrap
 */

var ExecutionEnvironment = require("./ExecutionEnvironment");

var invariant = require("./invariant");

/**
 * Dummy container used to detect which wraps are necessary.
 */
var dummyNode =
  ExecutionEnvironment.canUseDOM ? document.createElement('div') : null;

/**
 * Some browsers cannot use `innerHTML` to render certain elements standalone,
 * so we wrap them, render the wrapped nodes, then extract the desired node.
 *
 * In IE8, certain elements cannot render alone, so wrap all elements ('*').
 */
var shouldWrap = {
  // Force wrapping for SVG elements because if they get created inside a <div>,
  // they will be initialized in the wrong namespace (and will not display).
  'circle': true,
  'g': true,
  'line': true,
  'path': true,
  'polyline': true,
  'rect': true,
  'text': true
};

var selectWrap = [1, '<select multiple="true">', '</select>'];
var tableWrap = [1, '<table>', '</table>'];
var trWrap = [3, '<table><tbody><tr>', '</tr></tbody></table>'];

var svgWrap = [1, '<svg>', '</svg>'];

var markupWrap = {
  '*': [1, '?<div>', '</div>'],

  'area': [1, '<map>', '</map>'],
  'col': [2, '<table><tbody></tbody><colgroup>', '</colgroup></table>'],
  'legend': [1, '<fieldset>', '</fieldset>'],
  'param': [1, '<object>', '</object>'],
  'tr': [2, '<table><tbody>', '</tbody></table>'],

  'optgroup': selectWrap,
  'option': selectWrap,

  'caption': tableWrap,
  'colgroup': tableWrap,
  'tbody': tableWrap,
  'tfoot': tableWrap,
  'thead': tableWrap,

  'td': trWrap,
  'th': trWrap,

  'circle': svgWrap,
  'g': svgWrap,
  'line': svgWrap,
  'path': svgWrap,
  'polyline': svgWrap,
  'rect': svgWrap,
  'text': svgWrap
};

/**
 * Gets the markup wrap configuration for the supplied `nodeName`.
 *
 * NOTE: This lazily detects which wraps are necessary for the current browser.
 *
 * @param {string} nodeName Lowercase `nodeName`.
 * @return {?array} Markup wrap configuration, if applicable.
 */
function getMarkupWrap(nodeName) {
  invariant(!!dummyNode, 'Markup wrapping node not initialized');
  if (!markupWrap.hasOwnProperty(nodeName)) {
    nodeName = '*';
  }
  if (!shouldWrap.hasOwnProperty(nodeName)) {
    if (nodeName === '*') {
      dummyNode.innerHTML = '<link />';
    } else {
      dummyNode.innerHTML = '<' + nodeName + '></' + nodeName + '>';
    }
    shouldWrap[nodeName] = !dummyNode.firstChild;
  }
  return shouldWrap[nodeName] ? markupWrap[nodeName] : null;
}


module.exports = getMarkupWrap;

},{"./ExecutionEnvironment":21,"./invariant":106}],102:[function(require,module,exports){
/**
 * Copyright 2013 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule getNodeForCharacterOffset
 */

"use strict";

/**
 * Given any node return the first leaf node without children.
 *
 * @param {DOMElement|DOMTextNode} node
 * @return {DOMElement|DOMTextNode}
 */
function getLeafNode(node) {
  while (node && node.firstChild) {
    node = node.firstChild;
  }
  return node;
}

/**
 * Get the next sibling within a container. This will walk up the
 * DOM if a node's siblings have been exhausted.
 *
 * @param {DOMElement|DOMTextNode} node
 * @return {?DOMElement|DOMTextNode}
 */
function getSiblingNode(node) {
  while (node) {
    if (node.nextSibling) {
      return node.nextSibling;
    }
    node = node.parentNode;
  }
}

/**
 * Get object describing the nodes which contain characters at offset.
 *
 * @param {DOMElement|DOMTextNode} root
 * @param {number} offset
 * @return {?object}
 */
function getNodeForCharacterOffset(root, offset) {
  var node = getLeafNode(root);
  var nodeStart = 0;
  var nodeEnd = 0;

  while (node) {
    if (node.nodeType == 3) {
      nodeEnd = nodeStart + node.textContent.length;

      if (nodeStart <= offset && nodeEnd >= offset) {
        return {
          node: node,
          offset: offset - nodeStart
        };
      }

      nodeStart = nodeEnd;
    }

    node = getLeafNode(getSiblingNode(node));
  }
}

module.exports = getNodeForCharacterOffset;

},{}],103:[function(require,module,exports){
/**
 * Copyright 2013 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule getReactRootElementInContainer
 */

"use strict";

var DOC_NODE_TYPE = 9;

/**
 * @param {DOMElement|DOMDocument} container DOM element that may contain
 *                                           a React component
 * @return {?*} DOM element that may have the reactRoot ID, or null.
 */
function getReactRootElementInContainer(container) {
  if (!container) {
    return null;
  }

  if (container.nodeType === DOC_NODE_TYPE) {
    return container.documentElement;
  } else {
    return container.firstChild;
  }
}

module.exports = getReactRootElementInContainer;

},{}],104:[function(require,module,exports){
/**
 * Copyright 2013 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule getTextContentAccessor
 */

"use strict";

var ExecutionEnvironment = require("./ExecutionEnvironment");

var contentKey = null;

/**
 * Gets the key used to access text content on a DOM node.
 *
 * @return {?string} Key used to access text content.
 * @internal
 */
function getTextContentAccessor() {
  if (!contentKey && ExecutionEnvironment.canUseDOM) {
    contentKey = 'innerText' in document.createElement('div') ?
      'innerText' :
      'textContent';
  }
  return contentKey;
}

module.exports = getTextContentAccessor;

},{"./ExecutionEnvironment":21}],105:[function(require,module,exports){
/**
 * Copyright 2013 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule hyphenate
 * @typechecks
 */

var _uppercasePattern = /([A-Z])/g;

/**
 * Hyphenates a camelcased string, for example:
 *
 *   > hyphenate('backgroundColor')
 *   < "background-color"
 *
 * @param {string} string
 * @return {string}
 */
function hyphenate(string) {
  return string.replace(_uppercasePattern, '-$1').toLowerCase();
}

module.exports = hyphenate;

},{}],106:[function(require,module,exports){
/**
 * Copyright 2013 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule invariant
 */

/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf style format and arguments to provide information about
 * what broke and what you were expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

function invariant(condition) {
  if (!condition) {
    throw new Error('Invariant Violation');
  }
}

module.exports = invariant;

if (true) {
  var invariantDev = function(condition, format, a, b, c, d, e, f) {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }

    if (!condition) {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      throw new Error(
        'Invariant Violation: ' +
        format.replace(/%s/g, function() { return args[argIndex++]; })
      );
    }
  };

  module.exports = invariantDev;
}

},{}],107:[function(require,module,exports){
/**
 * Copyright 2013 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule isEventSupported
 */

"use strict";

var ExecutionEnvironment = require("./ExecutionEnvironment");

var testNode, useHasFeature;
if (ExecutionEnvironment.canUseDOM) {
  testNode = document.createElement('div');
  useHasFeature =
    document.implementation &&
    document.implementation.hasFeature &&
    // `hasFeature` always returns true in Firefox 19+.
    document.implementation.hasFeature('', '') !== true;
}

/**
 * Checks if an event is supported in the current execution environment.
 *
 * NOTE: This will not work correctly for non-generic events such as `change`,
 * `reset`, `load`, `error`, and `select`.
 *
 * Borrows from Modernizr.
 *
 * @param {string} eventNameSuffix Event name, e.g. "click".
 * @param {?boolean} capture Check if the capture phase is supported.
 * @return {boolean} True if the event is supported.
 * @internal
 * @license Modernizr 3.0.0pre (Custom Build) | MIT
 */
function isEventSupported(eventNameSuffix, capture) {
  if (!testNode || (capture && !testNode.addEventListener)) {
    return false;
  }
  var element = document.createElement('div');

  var eventName = 'on' + eventNameSuffix;
  var isSupported = eventName in element;

  if (!isSupported) {
    element.setAttribute(eventName, 'return;');
    isSupported = typeof element[eventName] === 'function';
    if (typeof element[eventName] !== 'undefined') {
      element[eventName] = undefined;
    }
    element.removeAttribute(eventName);
  }

  if (!isSupported && useHasFeature && eventNameSuffix === 'wheel') {
    // This is the only way to test support for the `wheel` event in IE9+.
    isSupported = document.implementation.hasFeature('Events.wheel', '3.0');
  }

  element = null;
  return isSupported;
}

module.exports = isEventSupported;

},{"./ExecutionEnvironment":21}],108:[function(require,module,exports){
/**
 * Copyright 2013 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule isNode
 * @typechecks
 */

/**
 * @param {*} object The object to check.
 * @return {boolean} Whether or not the object is a DOM node.
 */
function isNode(object) {
  return !!(object && (
    typeof Node !== 'undefined' ? object instanceof Node :
      typeof object === 'object' &&
      typeof object.nodeType === 'number' &&
      typeof object.nodeName === 'string'
  ));
}

module.exports = isNode;

},{}],109:[function(require,module,exports){
/**
 * Copyright 2013 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule isTextInputElement
 */

"use strict";

/**
 * @see http://www.whatwg.org/specs/web-apps/current-work/multipage/the-input-element.html#input-type-attr-summary
 */
var supportedInputTypes = {
  'color': true,
  'date': true,
  'datetime': true,
  'datetime-local': true,
  'email': true,
  'month': true,
  'number': true,
  'password': true,
  'range': true,
  'search': true,
  'tel': true,
  'text': true,
  'time': true,
  'url': true,
  'week': true
};

function isTextInputElement(elem) {
  return elem && (
    (elem.nodeName === 'INPUT' && supportedInputTypes[elem.type]) ||
    elem.nodeName === 'TEXTAREA'
  );
}

module.exports = isTextInputElement;

},{}],110:[function(require,module,exports){
/**
 * Copyright 2013 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule isTextNode
 * @typechecks
 */

var isNode = require("./isNode");

/**
 * @param {*} object The object to check.
 * @return {boolean} Whether or not the object is a DOM text node.
 */
function isTextNode(object) {
  return isNode(object) && object.nodeType == 3;
}

module.exports = isTextNode;

},{"./isNode":108}],111:[function(require,module,exports){
/**
 * Copyright 2013 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule joinClasses
 * @typechecks static-only
 */

"use strict";

/**
 * Combines multiple className strings into one.
 * http://jsperf.com/joinclasses-args-vs-array
 *
 * @param {...?string} classes
 * @return {string}
 */
function joinClasses(className/*, ... */) {
  if (!className) {
    className = '';
  }
  var nextClass;
  var argLength = arguments.length;
  if (argLength > 1) {
    for (var ii = 1; ii < argLength; ii++) {
      nextClass = arguments[ii];
      nextClass && (className += ' ' + nextClass);
    }
  }
  return className;
}

module.exports = joinClasses;

},{}],112:[function(require,module,exports){
/**
 * Copyright 2013 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule keyMirror
 * @typechecks static-only
 */

"use strict";

var invariant = require("./invariant");

/**
 * Constructs an enumeration with keys equal to their value.
 *
 * For example:
 *
 *   var COLORS = keyMirror({blue: null, red: null});
 *   var myColor = COLORS.blue;
 *   var isColorValid = !!COLORS[myColor];
 *
 * The last line could not be performed if the values of the generated enum were
 * not equal to their keys.
 *
 *   Input:  {key1: val1, key2: val2}
 *   Output: {key1: key1, key2: key2}
 *
 * @param {object} obj
 * @return {object}
 */
var keyMirror = function(obj) {
  var ret = {};
  var key;
  invariant(
    obj instanceof Object && !Array.isArray(obj),
    'keyMirror(...): Argument must be an object.'
  );
  for (key in obj) {
    if (!obj.hasOwnProperty(key)) {
      continue;
    }
    ret[key] = key;
  }
  return ret;
};

module.exports = keyMirror;

},{"./invariant":106}],113:[function(require,module,exports){
/**
 * Copyright 2013 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule keyOf
 */

/**
 * Allows extraction of a minified key. Let's the build system minify keys
 * without loosing the ability to dynamically use key strings as values
 * themselves. Pass in an object with a single key/val pair and it will return
 * you the string key of that single record. Suppose you want to grab the
 * value for a key 'className' inside of an object. Key/val minification may
 * have aliased that key to be 'xa12'. keyOf({className: null}) will return
 * 'xa12' in that case. Resolve keys you want to use once at startup time, then
 * reuse those resolutions.
 */
var keyOf = function(oneKeyObj) {
  var key;
  for (key in oneKeyObj) {
    if (!oneKeyObj.hasOwnProperty(key)) {
      continue;
    }
    return key;
  }
  return null;
};


module.exports = keyOf;

},{}],114:[function(require,module,exports){
/**
 * Copyright 2013 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule memoizeStringOnly
 * @typechecks static-only
 */

"use strict";

/**
 * Memoizes the return value of a function that accepts one string argument.
 *
 * @param {function} callback
 * @return {function}
 */
function memoizeStringOnly(callback) {
  var cache = {};
  return function(string) {
    if (cache.hasOwnProperty(string)) {
      return cache[string];
    } else {
      return cache[string] = callback.call(this, string);
    }
  };
}

module.exports = memoizeStringOnly;

},{}],115:[function(require,module,exports){
/**
 * Copyright 2013 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule merge
 */

"use strict";

var mergeInto = require("./mergeInto");

/**
 * Shallow merges two structures into a return value, without mutating either.
 *
 * @param {?object} one Optional object with properties to merge from.
 * @param {?object} two Optional object with properties to merge from.
 * @return {object} The shallow extension of one by two.
 */
var merge = function(one, two) {
  var result = {};
  mergeInto(result, one);
  mergeInto(result, two);
  return result;
};

module.exports = merge;

},{"./mergeInto":117}],116:[function(require,module,exports){
/**
 * Copyright 2013 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule mergeHelpers
 *
 * requiresPolyfills: Array.isArray
 */

"use strict";

var invariant = require("./invariant");
var keyMirror = require("./keyMirror");

/**
 * Maximum number of levels to traverse. Will catch circular structures.
 * @const
 */
var MAX_MERGE_DEPTH = 36;

/**
 * We won't worry about edge cases like new String('x') or new Boolean(true).
 * Functions are considered terminals, and arrays are not.
 * @param {*} o The item/object/value to test.
 * @return {boolean} true iff the argument is a terminal.
 */
var isTerminal = function(o) {
  return typeof o !== 'object' || o === null;
};

var mergeHelpers = {

  MAX_MERGE_DEPTH: MAX_MERGE_DEPTH,

  isTerminal: isTerminal,

  /**
   * Converts null/undefined values into empty object.
   *
   * @param {?Object=} arg Argument to be normalized (nullable optional)
   * @return {!Object}
   */
  normalizeMergeArg: function(arg) {
    return arg === undefined || arg === null ? {} : arg;
  },

  /**
   * If merging Arrays, a merge strategy *must* be supplied. If not, it is
   * likely the caller's fault. If this function is ever called with anything
   * but `one` and `two` being `Array`s, it is the fault of the merge utilities.
   *
   * @param {*} one Array to merge into.
   * @param {*} two Array to merge from.
   */
  checkMergeArrayArgs: function(one, two) {
    invariant(
      Array.isArray(one) && Array.isArray(two),
      'Critical assumptions about the merge functions have been violated. ' +
      'This is the fault of the merge functions themselves, not necessarily ' +
      'the callers.'
    );
  },

  /**
   * @param {*} one Object to merge into.
   * @param {*} two Object to merge from.
   */
  checkMergeObjectArgs: function(one, two) {
    mergeHelpers.checkMergeObjectArg(one);
    mergeHelpers.checkMergeObjectArg(two);
  },

  /**
   * @param {*} arg
   */
  checkMergeObjectArg: function(arg) {
    invariant(
      !isTerminal(arg) && !Array.isArray(arg),
      'Critical assumptions about the merge functions have been violated. ' +
      'This is the fault of the merge functions themselves, not necessarily ' +
      'the callers.'
    );
  },

  /**
   * Checks that a merge was not given a circular object or an object that had
   * too great of depth.
   *
   * @param {number} Level of recursion to validate against maximum.
   */
  checkMergeLevel: function(level) {
    invariant(
      level < MAX_MERGE_DEPTH,
      'Maximum deep merge depth exceeded. You may be attempting to merge ' +
      'circular structures in an unsupported way.'
    );
  },

  /**
   * Checks that the supplied merge strategy is valid.
   *
   * @param {string} Array merge strategy.
   */
  checkArrayStrategy: function(strategy) {
    invariant(
      strategy === undefined || strategy in mergeHelpers.ArrayStrategies,
      'You must provide an array strategy to deep merge functions to ' +
      'instruct the deep merge how to resolve merging two arrays.'
    );
  },

  /**
   * Set of possible behaviors of merge algorithms when encountering two Arrays
   * that must be merged together.
   * - `clobber`: The left `Array` is ignored.
   * - `indexByIndex`: The result is achieved by recursively deep merging at
   *   each index. (not yet supported.)
   */
  ArrayStrategies: keyMirror({
    Clobber: true,
    IndexByIndex: true
  })

};

module.exports = mergeHelpers;

},{"./invariant":106,"./keyMirror":112}],117:[function(require,module,exports){
/**
 * Copyright 2013 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule mergeInto
 * @typechecks static-only
 */

"use strict";

var mergeHelpers = require("./mergeHelpers");

var checkMergeObjectArg = mergeHelpers.checkMergeObjectArg;

/**
 * Shallow merges two structures by mutating the first parameter.
 *
 * @param {object} one Object to be merged into.
 * @param {?object} two Optional object with properties to merge from.
 */
function mergeInto(one, two) {
  checkMergeObjectArg(one);
  if (two != null) {
    checkMergeObjectArg(two);
    for (var key in two) {
      if (!two.hasOwnProperty(key)) {
        continue;
      }
      one[key] = two[key];
    }
  }
}

module.exports = mergeInto;

},{"./mergeHelpers":116}],118:[function(require,module,exports){
/**
 * Copyright 2013 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule mixInto
 */

"use strict";

/**
 * Simply copies properties to the prototype.
 */
var mixInto = function(constructor, methodBag) {
  var methodName;
  for (methodName in methodBag) {
    if (!methodBag.hasOwnProperty(methodName)) {
      continue;
    }
    constructor.prototype[methodName] = methodBag[methodName];
  }
};

module.exports = mixInto;

},{}],119:[function(require,module,exports){
/**
 * Copyright 2013 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule mutateHTMLNodeWithMarkup
 * @typechecks static-only
 */

/*jslint evil: true */

'use strict';

var createNodesFromMarkup = require("./createNodesFromMarkup");
var filterAttributes = require("./filterAttributes");
var invariant = require("./invariant");

/**
 * You can't set the innerHTML of a document. Unless you have
 * this function.
 *
 * @param {DOMElement} node with tagName == 'html'
 * @param {string} markup markup string including <html>.
 */
function mutateHTMLNodeWithMarkup(node, markup) {
  invariant(
    node.tagName.toLowerCase() === 'html',
    'mutateHTMLNodeWithMarkup(): node must have tagName of "html", got %s',
    node.tagName
  );

  markup = markup.trim();
  invariant(
    markup.toLowerCase().indexOf('<html') === 0,
    'mutateHTMLNodeWithMarkup(): markup must start with <html'
  );

  // First let's extract the various pieces of markup.
  var htmlOpenTagEnd = markup.indexOf('>') + 1;
  var htmlCloseTagStart = markup.lastIndexOf('<');
  var htmlOpenTag = markup.substring(0, htmlOpenTagEnd);
  var innerHTML = markup.substring(htmlOpenTagEnd, htmlCloseTagStart);

  // Now for the fun stuff. Pass through both sets of attributes and
  // bring them up-to-date. We get the new set by creating a markup
  // fragment.
  var shouldExtractAttributes = htmlOpenTag.indexOf(' ') > -1;
  var attributeHolder = null;

  if (shouldExtractAttributes) {
    // We extract the attributes by creating a <span> and evaluating
    // the node.
    attributeHolder = createNodesFromMarkup(
      htmlOpenTag.replace('html ', 'span ') + '</span>'
    )[0];

    // Add all attributes present in attributeHolder
    var attributesToSet = filterAttributes(
      attributeHolder,
      function(attr) {
        return node.getAttributeNS(attr.namespaceURI, attr.name) !== attr.value;
      }
    );
    attributesToSet.forEach(function(attr) {
      node.setAttributeNS(attr.namespaceURI, attr.name, attr.value);
    });
  }

  // Remove all attributes not present in attributeHolder
  var attributesToRemove = filterAttributes(
    node,
    function(attr) {
      // Remove all attributes if attributeHolder is null or if it does not have
      // the desired attribute.
      return !(
        attributeHolder &&
          attributeHolder.hasAttributeNS(attr.namespaceURI, attr.name)
      );
    }
  );
  attributesToRemove.forEach(function(attr) {
    node.removeAttributeNS(attr.namespaceURI, attr.name);
  });

  // Finally, set the inner HTML. No tricks needed. Do this last to
  // minimize likelihood of triggering reflows.
  node.innerHTML = innerHTML;
}

module.exports = mutateHTMLNodeWithMarkup;

},{"./createNodesFromMarkup":88,"./filterAttributes":95,"./invariant":106}],120:[function(require,module,exports){
/**
 * Copyright 2013 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule nodeContains
 * @typechecks
 */

var isTextNode = require("./isTextNode");

/*jslint bitwise:true */

/**
 * Checks if a given DOM node contains or is another DOM node.
 *
 * @param {?DOMNode} outerNode Outer DOM node.
 * @param {?DOMNode} innerNode Inner DOM node.
 * @return {boolean} True if `outerNode` contains or is `innerNode`.
 */
function nodeContains(outerNode, innerNode) {
  if (!outerNode || !innerNode) {
    return false;
  } else if (outerNode === innerNode) {
    return true;
  } else if (isTextNode(outerNode)) {
    return false;
  } else if (isTextNode(innerNode)) {
    return nodeContains(outerNode, innerNode.parentNode);
  } else if (outerNode.contains) {
    return outerNode.contains(innerNode);
  } else if (outerNode.compareDocumentPosition) {
    return !!(outerNode.compareDocumentPosition(innerNode) & 16);
  } else {
    return false;
  }
}

module.exports = nodeContains;

},{"./isTextNode":110}],121:[function(require,module,exports){
/**
 * Copyright 2013 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule objMap
 */

"use strict";

/**
 * For each key/value pair, invokes callback func and constructs a resulting
 * object which contains, for every key in obj, values that are the result of
 * of invoking the function:
 *
 *   func(value, key, iteration)
 *
 * @param {?object} obj Object to map keys over
 * @param {function} func Invoked for each key/val pair.
 * @param {?*} context
 * @return {?object} Result of mapping or null if obj is falsey
 */
function objMap(obj, func, context) {
  if (!obj) {
    return null;
  }
  var i = 0;
  var ret = {};
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      ret[key] = func.call(context, obj[key], key, i++);
    }
  }
  return ret;
}

module.exports = objMap;

},{}],122:[function(require,module,exports){
/**
 * Copyright 2013 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule objMapKeyVal
 */

"use strict";

/**
 * Behaves the same as `objMap` but invokes func with the key first, and value
 * second. Use `objMap` unless you need this special case.
 * Invokes func as:
 *
 *   func(key, value, iteration)
 *
 * @param {?object} obj Object to map keys over
 * @param {!function} func Invoked for each key/val pair.
 * @param {?*} context
 * @return {?object} Result of mapping or null if obj is falsey
 */
function objMapKeyVal(obj, func, context) {
  if (!obj) {
    return null;
  }
  var i = 0;
  var ret = {};
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      ret[key] = func.call(context, key, obj[key], i++);
    }
  }
  return ret;
}

module.exports = objMapKeyVal;

},{}],123:[function(require,module,exports){
/**
 * Copyright 2013 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule performanceNow
 * @typechecks static-only
 */

"use strict";

var ExecutionEnvironment = require("./ExecutionEnvironment");

/**
 * Detect if we can use window.performance.now() and gracefully
 * fallback to Date.now() if it doesn't exist.
 * We need to support Firefox < 15 for now due to Facebook's webdriver
 * infrastructure.
 */
var performance = null;

if (ExecutionEnvironment.canUseDOM) {
  performance = window.performance || window.webkitPerformance;
}

if (!performance || !performance.now) {
  performance = Date;
}

var performanceNow = performance.now.bind(performance);

module.exports = performanceNow;

},{"./ExecutionEnvironment":21}],124:[function(require,module,exports){
/**
 * Copyright 2013 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule shallowEqual
 */

"use strict";

/**
 * Performs equality by iterating through keys on an object and returning
 * false when any key has values which are not strictly equal between
 * objA and objB. Returns true when the values of all keys are strictly equal.
 *
 * @return {boolean}
 */
function shallowEqual(objA, objB) {
  if (objA === objB) {
    return true;
  }
  var key;
  // Test for A's keys different from B.
  for (key in objA) {
    if (objA.hasOwnProperty(key) &&
        (!objB.hasOwnProperty(key) || objA[key] !== objB[key])) {
      return false;
    }
  }
  // Test for B'a keys missing from A.
  for (key in objB) {
    if (objB.hasOwnProperty(key) && !objA.hasOwnProperty(key)) {
      return false;
    }
  }
  return true;
}

module.exports = shallowEqual;

},{}],125:[function(require,module,exports){
/**
 * Copyright 2013 Facebook, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @providesModule traverseAllChildren
 */

"use strict";

var ReactComponent = require("./ReactComponent");
var ReactTextComponent = require("./ReactTextComponent");

var invariant = require("./invariant");

/**
 * TODO: Test that:
 * 1. `mapChildren` transforms strings and numbers into `ReactTextComponent`.
 * 2. it('should fail when supplied duplicate key', function() {
 * 3. That a single child and an array with one item have the same key pattern.
 * });
 */

/**
 * @param {?*} children Children tree container.
 * @param {!string} nameSoFar Name of the key path so far.
 * @param {!number} indexSoFar Number of children encountered until this point.
 * @param {!function} callback Callback to invoke with each child found.
 * @param {?*} traverseContext Used to pass information throughout the traversal
 * process.
 * @return {!number} The number of children in this subtree.
 */
var traverseAllChildrenImpl =
  function(children, nameSoFar, indexSoFar, callback, traverseContext) {
    var subtreeCount = 0;  // Count of children found in the current subtree.
    if (Array.isArray(children)) {
      for (var i = 0; i < children.length; i++) {
        var child = children[i];
        var nextName = nameSoFar + ReactComponent.getKey(child, i);
        var nextIndex = indexSoFar + subtreeCount;
        subtreeCount += traverseAllChildrenImpl(
          child,
          nextName,
          nextIndex,
          callback,
          traverseContext
        );
      }
    } else {
      var type = typeof children;
      var isOnlyChild = nameSoFar === '';
      // If it's the only child, treat the name as if it was wrapped in an array
      // so that it's consistent if the number of children grows
      var storageName = isOnlyChild ?
        ReactComponent.getKey(children, 0):
        nameSoFar;
      if (children === null || children === undefined || type === 'boolean') {
        // All of the above are perceived as null.
        callback(traverseContext, null, storageName, indexSoFar);
        subtreeCount = 1;
      } else if (children.mountComponentIntoNode) {
        callback(traverseContext, children, storageName, indexSoFar);
        subtreeCount = 1;
      } else {
        if (type === 'object') {
          invariant(
            !children || children.nodeType !== 1,
            'traverseAllChildren(...): Encountered an invalid child; DOM ' +
            'elements are not valid children of React components.'
          );
          for (var key in children) {
            if (children.hasOwnProperty(key)) {
              subtreeCount += traverseAllChildrenImpl(
                children[key],
                nameSoFar + '{' + key + '}',
                indexSoFar + subtreeCount,
                callback,
                traverseContext
              );
            }
          }
        } else if (type === 'string') {
          var normalizedText = new ReactTextComponent(children);
          callback(traverseContext, normalizedText, storageName, indexSoFar);
          subtreeCount += 1;
        } else if (type === 'number') {
          var normalizedNumber = new ReactTextComponent('' + children);
          callback(traverseContext, normalizedNumber, storageName, indexSoFar);
          subtreeCount += 1;
        }
      }
    }
    return subtreeCount;
  };

/**
 * Traverses children that are typically specified as `props.children`, but
 * might also be specified through attributes:
 *
 * - `traverseAllChildren(this.props.children, ...)`
 * - `traverseAllChildren(this.props.leftPanelChildren, ...)`
 *
 * The `traverseContext` is an optional argument that is passed through the
 * entire traversal. It can be used to store accumulations or anything else that
 * the callback might find relevant.
 *
 * @param {?*} children Children tree object.
 * @param {!function} callback To invoke upon traversing each child.
 * @param {?*} traverseContext Context for traversal.
 */
function traverseAllChildren(children, callback, traverseContext) {
  if (children !== null && children !== undefined) {
    traverseAllChildrenImpl(children, '', 0, callback, traverseContext);
  }
}

module.exports = traverseAllChildren;

},{"./ReactComponent":28,"./ReactTextComponent":64,"./invariant":106}]},{},[70])
(70)
});
;
