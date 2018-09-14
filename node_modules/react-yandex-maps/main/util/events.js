'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.separateEvents = separateEvents;
exports.addEvent = addEvent;
exports.removeEvent = removeEvent;
var events = exports.events = {
  onBallonClose: 'balloonclose',
  onBalloonOpen: 'balloonopen',
  onBeforeDrag: 'beforedrag',
  onBeforeDragStart: 'beforedragstart',
  onClick: 'click',
  onContextMenu: 'contextmenu',
  onDblClick: 'dblclick',
  onDrag: 'drag',
  onDragEnd: 'dragend',
  onDragStart: 'dragstart',
  onEditorStateChange: 'editorstatechange',
  onGeometryChange: 'geometrychange',
  onHintClose: 'hintclose',
  onHintOpen: 'hintopen',
  onMapChange: 'mapchange',
  onMouseDown: 'mousedown',
  onMouseEnter: 'mouseenter',
  onMouseLeave: 'mouseleave',
  onMouseMove: 'mousemove',
  onMouseUp: 'mouseup',
  onMultiTouchEnd: 'multitouchend',
  onMultiTouchMove: 'multitouchmove',
  onMultiTouchStart: 'multitouchstart',
  onOptionsChange: 'optionschange',
  onOverlayChange: 'overlaychange',
  onParentChange: 'parentchange',
  onPropertiesChange: 'propertieschange',
  onWheel: 'wheel',
  onBalloonClose: 'balloonclose',
  onActionBegin: 'actionbegin',
  onActionBreak: 'actionbreak',
  onActionEnd: 'actionend',
  onActionTick: 'actiontick',
  onActionTickComplete: 'actiontickcomplete',
  onBoundsChange: 'boundschange',
  onDestroy: 'destroy',
  onMarginChange: 'marginchange',
  onSizeChange: 'sizechange',
  onTypeChange: 'typechange',
  onDeselect: 'deselect',
  onDisable: 'disable',
  onEnable: 'enable',
  onPress: 'press',
  onSelect: 'select',
  onFullscreenEnter: 'fullscreenenter',
  onFullscreenExit: 'fullscreenexit',
  onLocationChange: 'locationchange',
  onClear: 'clear',
  onError: 'error',
  onLoad: 'load',
  onResultSelect: 'resultselect',
  onResultShow: 'resultshow',
  onSubmit: 'submit',
  onCollapse: 'collapse',
  onExpand: 'expand',
  onHideTraffic: 'hidetraffic',
  onProviderKeyChange: 'providerkeychange',
  onShowTraffic: 'showtraffic',
  onAdd: 'add',
  onRemove: 'remove'
};

function separateEvents(props) {
  var eventsRegExp = /^on[A-Z]/;
  var events = {};
  var rest = {};

  Object.keys(props).forEach(function (key) {
    if (eventsRegExp.test(key)) {
      events[key] = props[key];
    } else {
      rest[key] = props[key];
    }
  });

  return _extends({ events: events }, rest);
}

function addEvent(event, key, instance) {
  if (events[key] && typeof event === 'function') {
    instance.events.add(events[key], event);
  }
}

function removeEvent(event, key, instance) {
  if (events[key] && typeof event === 'function') {
    instance.events.remove(events[key], event);
  }
}