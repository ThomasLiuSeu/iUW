/*global jQuery, sap, clearTimeout, console, window */
/*global jQuery, sap, clearTimeout, console, window */
(function () {
    "use strict";

    jQuery.sap.declare("sap.ushell.UIActions");

    sap.ushell.UIActions = function(cfg) {

        if (!cfg || !cfg.rootSelector || !cfg.containerSelector || !cfg.draggableSelector) {
            throw new Error("No configuration object to initialize User Interaction module.");
        }

        /* PRIVATE MEMBERS */
        //TO DO: write optional and mandatory parameters.
        this.animationDuration = null;         // {Number} animation duration in ms
        this.captureStart = null;              // {Function} capture start event X and Y position
        this.captureMove = null;               // {Function} capture move event X and Y position
        this.captureEnd = null;                // {Function} capture end event X and Y position
        this.clickCallback = null;             //{Function} Callback function execute after capture `click` event
        this.clickEvent = null;                // {String} `click` event
        this.clickHandler = null;              // {Function} capture click event and prevent the default behaviour on IOS
        this.clone = null;                     // {Element} cloned draggable element
        this.cloneClass = null;                // {String} clone CSS Class
        this.container = null;                 // {Element} content container to be scrolled
        this.contextMenuEvent = null;          // {String} `contextmenu` event for Windows 8 Chrome
        this.debug = null;                     // {Boolean} for debug mode
        this.defaultDragStartEvent = null;     // {String} `dragStart` event which we need to prevent its default behavior
        this.disabledDraggableSelector = null; //{String} name of css class to avoid drag (e.g. locked tiles class identifier)
        this.dragAndScrollCallback = null;     // {Function} Callback function executes while drag mode is active
        this.dragAndScrollDuration = null;     // {Number} Scroll timer duration in ms
        this.dragAndScrollTimer = null;        // {Number} timer ID. Used in drag & scroll animation
        this.draggable = null;                 // {Array<Element>|NodeList<Element>} list of draggable elements
        this.placeHolderClass = null;          // {String} placeholder CSS Class
        this.draggableSelector = null;         // {String} CSS Selector String which specifies the draggable elements
        this.draggableSelectorExclude = null;  // {String} CSS Selector String which specifies the elements that can not be draggable but can be droppable
        this.doubleTapCallback = null;         // {Function} Callback function execute when double tap
        this.doubleTapDelay = null;            // {Number} number of milliseconds to recognize double tap
        this.element = null;                   // {Element} draggable element
        this.endX = null;                      // {Number} X coordinate of end event
        this.endY = null;                      // {Number} Y coordinate of end event
        this.isLayoutEngine = null;            // {Boolean} is layout engine available
        this.isTouch = null;                   // {Boolean} does browser supports touch events
        this.lastElement = null;               // {Element} last tapped element
        this.lastTapTime = null;               // {Number} number of milliseconds elapsed since last touchstart or mousedown
        this.lockMode = null;                  // {Boolean} if the value is true, preventing change element mode
        this.log = null;                       // {Function} logs to console in debug mode
        this.mode = null;                      // {String} current feature mode `normal`, `scroll`, `drag`, `move`
        this.mouseDownEvent = null;            // {String} 'mousedown'
        this.mouseMoveEvent = null;            // {String} 'mousemove'
        this.mouseUpEvent = null;              // {String} 'mouseup'
        this.moveTolerance = null;             // {Number} tolerance in pixels between touchStart/mousedwon and touchMove/mousemove
        this.moveX = null;                     // {Number} X coordinate of move event
        this.moveY = null;                     // {Number} Y coordinate of move event
        this.noop = null;                      // {Function} empty function
        this.onDragStartUIHandler = null;      // {Function} Handler that will be called when drag starts in order to add visual effects. it will be called also for items that are belong to the disabledDraggableSelector, although the drag will be prevented immediately.
        this.onDragEndUIHandler = null;        // {Function} Handler that will be called when drag ends. to revert the drag visual effects.
        this.preventClickFlag;                 // {Boolean} flag indicates if prevent default click behaviour
        this.preventClickTimeoutId;            // {Number}  timer ID. Used to clear click preventing
        this.scrollContainer = null;           // {Element} the element we would like to transition while drag and scroll
        this.scrollContainerSelector = null;   // {String} CSS Selector String which specifies the element we would like to transition while drag and scroll
        this.scrollEvent = null;               // {String} `scroll` event
        this.scrollTimer = null;               // {Number} number of milliseconds elapsed since the last scroll event
        this.startX = null;                    // {Number} X coordinate of start event
        this.startY = null;                    // {Number} Y coordinate of start event
        this.switchModeDelay = null;           // {Number} switch mode delay in ms
        this.tapsNumber = null;                // {Number} the number of taps. could be 0 / 1 / 2
        this.timer = null;                     // {Number} timer ID. Used to decide mode
        this.scrollHandler = null;             // {Function} scroll event handler
        this.touchCancelEvent = null;          // {String} `touchcanel` event
        this.dragCallback = null;              // {Function} Callback function execute when drag mode is active
        this.endCallback = null;               // {Function} Callback function execute after capture `touchend` or `mouseup` event
        this.touchEndEvent = null;             // {String} `touchend`
        this.touchMoveEvent = null;            // {String} `touchmove`
        this.startCallback = null;             // {Function} Callback function execute after capture `touchstart` or `mousedown` event
        this.touchStartEvent = null;           // {String} `touchstart`
        this.wrapper = null;                   // {Element} content container parent
        this.wrapperRect = null;               // {Object} wrapper Bounding Rect
        this.scrollCallback = null;            // {Function} Callback function when scroll was performed


        /**
         * Initialize state using configuration
         *
         * @private
         */
        this.init = function (cfg) {
            this.startX = -1;
            this.startY = -1;
            this.moveX = -1;
            this.moveY = -1;
            this.endX = -1;
            this.endY = -1;

            this.noop = function() {};

            this.isLayoutEngine = cfg.isLayoutEngine || false;
            if (this.isLayoutEngine) {
                this.moveDraggable = this.noop;
            }

            this.isTouch = cfg.isTouch  ? !!cfg.isTouch : false;
            this.container = document.querySelector(cfg.containerSelector);
            this.scrollContainerSelector = cfg.scrollContainerSelector || cfg.containerSelector;
            this.switchModeDelay = cfg.switchModeDelay || 1500;
            this.dragAndScrollDuration = cfg.dragAndScrollDuration || 230;
            this.moveTolerance = cfg.moveTolerance === 0 ? 0 : cfg.moveTolerance || 10;
            this.draggableSelector = cfg.draggableSelector;
            this.draggableSelectorBlocker = cfg.draggableSelectorBlocker || cfg.rootSelector;
            this.draggableSelectorExclude = cfg.draggableSelectorExclude;
            this.mode = 'normal';
            this.debug = cfg.debug || false;
            this.root = document.querySelector(cfg.rootSelector);
            this.animationDuration = cfg.animationDuration || 330;
            this.tapsNumber = 0;
            this.lastTapTime = 0;
            this.log = this.debug ? this.logToConsole : this.noop;
            this.lockMode = false;
            this.placeHolderClass = cfg.placeHolderClass || "";
            this.cloneClass = cfg.cloneClass || "";
            this.wrapper = cfg.wrapperSelector ? document.querySelector(cfg.wrapperSelector) : this.container.parentNode;
            this.clickCallback = typeof cfg.clickCallback === 'function' ? cfg.clickCallback : this.noop;
            this.startCallback = typeof cfg.startCallback === 'function' ? cfg.startCallback : this.noop;
            this.doubleTapCallback = typeof cfg.doubleTapCallback === 'function' ? cfg.doubleTapCallback : this.noop;
            this.endCallback = typeof cfg.endCallback === 'function' ? cfg.endCallback : this.noop;
            this.dragCallback = typeof cfg.dragCallback === 'function' ? cfg.dragCallback : this.noop;
            this.dragAndScrollCallback = typeof cfg.dragAndScrollCallback === 'function' ? cfg.dragAndScrollCallback : this.noop;
            this.scrollCallback = typeof cfg.scrollCallback === 'function' ? cfg.scrollCallback : this.noop;
            this.doubleTapDelay = cfg.doubleTapDelay || 500;
            this.wrapperRect = this.wrapper.getBoundingClientRect();
            this.scrollEvent = 'scroll';
            this.touchStartEvent = 'touchstart';
            this.touchMoveEvent = 'touchmove';
            this.touchEndEvent = 'touchend';
            this.mouseDownEvent = 'mousedown';
            this.mouseMoveEvent = 'mousemove';
            this.mouseUpEvent = 'mouseup';
            this.contextMenuEvent = 'contextmenu';
            this.touchCancelEvent = 'touchcancel';
            this.defaultDragStartEvent = 'dragstart';
            this.clickEvent = 'click';
            this.isVerticalDragOnly = cfg.isVerticalDragOnly || false;

            // Apply specific ui effects upon drag and drop.
            // (currently ONLY locked groups feature uses. See DashboardContent.view.js method _getDashboardGroupsBox)
            this.disabledDraggableSelector = cfg.disabledDraggableSelector;
            this.onDragStartUIHandler = typeof cfg.onDragStartUIHandler === 'function' ? cfg.onDragStartUIHandler : this.noop;
            this.onDragEndUIHandler = typeof cfg.onDragEndUIHandler === 'function' ? cfg.onDragEndUIHandler : this.noop;
        };

        /* PRIVATE METHODS */

        /**
         * Iterates over array-like object and calls callback function
         * for each item
         *
         * @param {Array|NodeList|Arguments} scope - array-like object
         * @param {Function} callback - function to be called for each element in scope
         * @returns {Array|NodeList|Arguments} scope
         */
        this.forEach = function (scope, callback) {
            /*
             * NodeList and Arguments don't have forEach,
             * therefore borrow it from Array.prototype
             */
            return Array.prototype.forEach.call(scope, callback);
        };

        /**
         * Returns index of item in array-like object
         *
         * @param {Array|NodeList|Arguments} scope - array-like object
         * @param {*} item - item which index to be found
         * @returns {Number} index of item in the array-like object
         */
        this.indexOf = function (scope, item) {
            /*
             * NodeList and Arguments don't have indexOf,
             * therefore borrow it from Array.prototype
             */
            return Array.prototype.indexOf.call(scope, item);
        };

        /**
         * Cuts item from array-like object and pastes before reference item
         *
         * @param {Array|NodeList|Arguments} scope
         * @param {*} item
         * @param {*} referenceItem
         */
        this.insertBefore = function (scope, item, referenceItem) {
            var itemIndex,
                referenceItemIndex,
                splice;

            splice = Array.prototype.splice;
            itemIndex = this.indexOf(scope, item);
            referenceItemIndex = this.indexOf(scope, referenceItem);

            splice.call(
                scope,
                referenceItemIndex - (itemIndex < referenceItemIndex ? 1 : 0),
                0,
                splice.call(scope, itemIndex, 1)[0]
            );
        };

        /**
         * Log to console
         *
         * @private
         */
        this.logToConsole = function () {
            window.console.log.apply(console, arguments);
        };


        this.getDraggableElement = function (currentElement) {
            var element;

            this.draggable = jQuery(this.draggableSelector, this.container);
            //Since we are listening on the root element,
            //we would like to identify when a draggable element is being touched.
            //The target element of the event is the lowest element in the DOM hierarchy
            //where the user touched the screen.
            //We need to climb in the DOM tree from the target element until we identify the draggable element,
            //or getting out of container scope.
            while (typeof element === 'undefined' && currentElement !== this.root && !jQuery(currentElement).is(this.draggableSelectorBlocker)) {
                //Only draggable tiles
                if (this.indexOf(this.draggable, currentElement) >= 0 && jQuery(currentElement).not(this.draggableSelectorExclude).length > 0) {
                    element = currentElement;
                }
                currentElement = currentElement.parentNode;
            }

            return element;
        };

        /**
         * Capture X and Y coordinates of touchstart or mousedown event
         *
         * @param {Event} evt - touchstart or mousedowm event
         * @private
         */
        this.captureStart = function (evt) {
            var eventObj;

            if (evt.type === 'touchstart' && evt.touches.length === 1) {
                eventObj = evt.touches[0];
            } else if (evt.type === 'mousedown') {
                eventObj = evt;
                if (evt.which != 1) {//Only LEFT click operation is enabled. Otherwise do nothing.
                    return;
                }
            }

            if (eventObj) {
                this.element = this.getDraggableElement(eventObj.target);
                this.startX = eventObj.pageX;
                this.startY = eventObj.pageY;
                this.lastMoveX = 0;
                this.lastMoveY = 0;
                //Check if it is a doubletap flow or single tap
                if (this.lastTapTime && this.lastElement && this.element && (this.lastElement === this.element)
                    && Math.abs(Date.now() - this.lastTapTime) < this.doubleTapDelay) {
                    this.lastTapTime = 0;
                    this.tapsNumber = 2;
                } else {
                    this.lastTapTime = Date.now();
                    this.tapsNumber = 1;
                    this.lastElement = this.element;
                }

                this.log('captureStart(' + this.startX + ', ' + this.startY + ')');
            }
        };

        /**
         * Handler for `mousedown` or `touchstart`
         *
         * @private
         */
        this.startHandler = function (evt) {
            this.log('startHandler');
            clearTimeout(this.timer);
            delete this.timer;
            this.captureStart(evt);
            if (this.element) {
                this.startCallback(evt, this.element);
                if (this.lockMode === false) {
                    if (this.tapsNumber === 2) {
                        this.mode = 'double-tap';
                        return;
                    }
                    if (this.isTouch) {
                        this.timer = setTimeout(function () {
                            //In Mobile prevent drag of locked tile
                            if (!jQuery(this.element).hasClass(this.disabledDraggableSelector)) {
                                this.log('mode switched to drag');
                                this.mode = 'drag';
                                this.createClone();
                                this.dragCallback(evt, this.element);
                            } else {
                                this.onDragStartUIHandler();
                            }
                        }.bind(this), this.switchModeDelay);
                    }
                }
            }
        }.bind(this);

        /**
         * Capture X and Y coordinates of touchmove or mousemove event
         *
         * @param {Event} evt - touchmove or mousemove event
         * @private
         */
        this.captureMove = function (evt) {
            var eventObj;

            if (evt.type === 'touchmove' && evt.touches.length === 1) {
                eventObj = evt.touches[0];
            } else if (evt.type === 'mousemove') {
                eventObj = evt;
            }
            if (eventObj) {
                this.moveX = eventObj.pageX;
                this.moveY = eventObj.pageY;

                this.log('captureMove(' + this.moveX + ', ' + this.moveY + ')');
            }
        };

        /**
         * Handler for `mousemove` or `touchmove`
         *
         * @private
         */
        this.moveHandler = function(evt) {
            var isScrolling;
            this.log('moveHandler');
            this.captureMove(evt);
            switch (this.mode) {
            case 'normal':
                if ((Math.abs(this.startX - this.moveX) > this.moveTolerance || Math.abs(this.startY - this.moveY) > this.moveTolerance)) {
                    if (this.isTouch) {
                        this.log('-> normal');
                        clearTimeout(this.timer);
                        delete this.timer;
                    } else if (this.element) { //In desktop start dragging immediately
                        this.onDragStartUIHandler();
                        if (!jQuery(this.element).hasClass(this.disabledDraggableSelector)) {
                            this.log('mode switched to drag');
                            this.mode = 'drag';
                            this.createClone();
                        } else {
                            //In case the element has the disable draggable selector, we prevent the drag action and in addition make sure to prevent the click from being executed.
                            this.preventClick();
                            this.element = null;
                        }
                    }
                }
                break;
            case 'drag':
                evt.preventDefault();
                this.onDragStartUIHandler();
                this.log('-> drag');
                if (this.isVerticalDragOnly) {
                    this.mode = 'vertical-drag';
                } else {
                    this.mode = 'drag-and-scroll';
                }
                window.addEventListener(this.mouseUpEvent, this.endHandler, true);
                this.translateClone();
                this.scrollContainer = document.querySelector(this.scrollContainerSelector);
                this.dragAndScroll();

                if (!this.isTouch) {
                    this.dragCallback(evt, this.element);
                }
                break;
            case 'drag-and-scroll':
                evt.stopPropagation();
                evt.preventDefault();
                this.log('-> drag-and-scroll');
                isScrolling = this.dragAndScroll();
                this.translateClone();
                if (!isScrolling) {
                    this.moveDraggable();
                }
                this.dragAndScrollCallback({evt : evt, clone : this.clone, isScrolling: isScrolling, moveX : this.moveX, moveY : this.moveY});
                break;
            case 'vertical-drag':
                evt.stopPropagation();
                evt.preventDefault();
                isScrolling = this.dragAndScroll();
                this.translateClone();
                if (!isScrolling) {
                    this.moveDraggableVerticalOnly(this.moveX, this.moveY);
                }
                this.dragAndScrollCallback({evt : evt, clone : this.clone, isScrolling: isScrolling, moveX : this.moveX, moveY : this.moveY});
                break;
            default:
                break;
            }
        }.bind(this);

        /**
         * Capture X and Y coordinates of touchend or mouseup event
         *
         * @param {Event} evt - touchmove or mouseup event
         * @private
         */
        this.captureEnd = function (evt) {
            var eventObj;

            if ((evt.type === 'touchend' || evt.type ===  'touchcancel') && (evt.changedTouches.length === 1)) {
                eventObj = evt.changedTouches[0];
            } else if (evt.type === 'mouseup') {
                eventObj = evt;
            }
            if (eventObj) {
                this.endX = eventObj.pageX;
                this.endY = eventObj.pageY;

                this.log('captureEnd(' + this.endX + ', ' + this.endY + ')');
            }
        };

        /**
         * Handler for `contextmenu` event. Disable right click on Chrome
         *
         * @private
         */
        this.contextMenuHandler = function (evt) {
            if (this.isTouch) {
                evt.preventDefault();
            }

        }.bind(this);

        /**
         *
         * @param event
         */
        this.clickHandler = function (event) {

            if (this.preventClickFlag) {
                this.preventClickFlag = false;
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();
                clearTimeout(this.preventClickTimeoutId);
            }
            this.clickCallback();

        }.bind(this);

        /**
         * This function solves a bug which causes the tile to be launched after D&D.
         */
        this.preventClick = function () {
            this.preventClickFlag = true;
            this.preventClickTimeoutId = setTimeout(function () {
                this.preventClickFlag = false;
            }.bind(this), 100);
        };

        /**
         * Handler for `mouseup` or `touchend`
         *
         * @private
         */
        this.endHandler = function (evt) {
            this.log('endHandler');
            this.captureEnd(evt);
            this.onDragEndUIHandler();
            switch (this.mode) {
            case 'normal':
                this.log('-> normal');
                break;
            case 'drag':
                this.log('-> drag');
                this.removeClone();
                this.endCallback(evt, this.element);
                this.preventClick();
                break;
            case 'drag-and-scroll':
                this.log('-> drag-and-scroll');
                window.removeEventListener(this.mouseUpEvent, this.endHandler, true);
                this.removeClone();
                this.endCallback(evt, this.element);
                this.preventClick();
                evt.stopPropagation();
                evt.preventDefault();
                break;
            case 'vertical-drag':
                this.log('-> vertical-drag');
                window.removeEventListener(this.mouseUpEvent, this.endHandler, true);
                this.removeClone();
                this.endCallback(evt, this.element);
                evt.stopPropagation();
                evt.preventDefault();
                break;
            case 'double-tap':
                this.log('-> double-tap');
                this.doubleTapCallback(evt, this.element);
                break;
            default:
                break;
            }
            clearTimeout(this.timer);
            delete this.timer;
            this.lastMoveX = 0;
            this.lastMoveY = 0;
            this.element = null;
            this.mode = 'normal';
        }.bind(this);

        this.defaultDragStartHandler = function (evt) {
            //prevent the Native Drag behavior of the browser
            evt.preventDefault();
        };

        this.scrollHandler = function() {
            clearTimeout(this.scrollTimer);
            this.lockMode = true;
            //release the scroll lock after 100 ms
            this.scrollTimer = setTimeout(function(){
                this.lockMode = false;
            }.bind(this), 500);
        }.bind(this);

        /**
         * Create clone of draggable element
         *
         * @private
         */
        this.createClone = function () {
            var style,
                rect;

            rect = this.element.getBoundingClientRect();
            this.clone = this.element.cloneNode(true);
            this.clone.className += (' ' + this.cloneClass);
            this.element.className += (' ' + this.placeHolderClass);
            style = this.clone.style;
            style.position = 'fixed';
            style.display = 'block';
            style.top = rect.top + 'px';
            style.left = rect.left + 'px';
            style.width = rect.width + 'px';
            style.zIndex = '100';
            style.webkitTransition = '-webkit-transform 0ms cubic-bezier(0.33, 0.66, 0.66, 1)';
            style.mozTransition = '-moz-transform 0ms cubic-bezier(0.33, 0.66, 0.66, 1)';
            style.msTransition = '-ms-transform 0ms cubic-bezier(0.33, 0.66, 0.66, 1)';
            style.transition = 'transform 0ms cubic-bezier(0.33, 0.66, 0.66, 1)';
            style.webkitTransform = 'translate3d(0px, 0px, 0px) ';
            style.mozTransform = 'translate3d(0px, 0px, 0px) ';
            style.msTransform = 'translate3d(0px, 0px, 0px) ';
            style.transform = 'translate3d(0px, 0px, 0px) ';
            this.root.appendChild(this.clone);
            this.log('createClone');
        };

        /**
         * Remove clone of draggable element
         *
         * @private
         */
        this.removeClone = function () {
            this.element.className = this.element.className.split(' ' + this.placeHolderClass).join('');
            this.clone.parentElement.removeChild(this.clone);
            // unset reference to DOM element of the clone, otherwise it will remain DOM fragment
            this.clone = null;
            this.log('removeClone');
        };

        /**
         * Translate clone of draggable element
         *
         * @private
         */
        this.translateClone = function () {
            var deltaX,
                deltaY;

            deltaX = this.moveX - this.startX;
            deltaY = this.moveY - this.startY;
            this.clone.style.webkitTransform = 'translate3d(' + deltaX + 'px, ' + deltaY + 'px, 0px)';
            this.clone.style.mozTransform = 'translate3d(' + deltaX + 'px, ' + deltaY + 'px, 0px)';
            //IE9 contains only 2-D transform
            this.clone.style.msTransform = 'translate(' + deltaX + 'px, ' + deltaY + 'px)';
            this.clone.style.transform = 'translate3d(' + deltaX + 'px, ' + deltaY + 'px, 0px)';

            this.log('translateClone (' + deltaX + ', ' + deltaY + ')');
        };

        /**
         * Scroll while dragging if needed
         *
         * @private
         */
        this.dragAndScroll = function () {
            var
            /*
             * Indicates how much pixels of draggable element are overflowing in a vertical axis.
             * When deltaY is negative - content should be scrolled down,
             * when deltaY is positive - content should be scrolled up,
             * when deltaY is zero - content should not be scrolled
             */
                deltaY,
            /*
             * Duration of scrolling animation in milliseconds.
             * Greater value makes scroll faster, lower values - smoother
             */
                duration,
                style,
                that = this;

            function startAnimation() {
                style.webkitTransition = '-webkit-transform ' + duration + 'ms linear';
                style.transition = 'transform ' + duration + 'ms linear';
                style.mozTransition = '-moz-transform ' + duration + 'ms linear';
                style.msTransition = '-ms-transform ' + duration + 'ms linear';
                style.webkitTransform = 'translate(0px, ' + deltaY + 'px) scale(1) translateZ(0px)';
                style.mozTransform = 'translate(0px, ' + deltaY + 'px) scale(1) translateZ(0px)';
                style.msTransform = 'translate(0px, ' + deltaY + 'px) scale(1) translateZ(0px)';
                style.transform = 'translate(0px, ' + deltaY + 'px) scale(1) translateZ(0px)';
            }

            function clearAnimation() {
                style.webkitTransition = '';
                style.mozTransition = '';
                style.msTransition = '';
                style.transition = '';
                style.webkitTransform = '';
                style.mozTransform = '';
                style.msTransform = '';
                style.transform = '';
                that.wrapper.scrollTop -= deltaY;
            }

            function getDeltaY() {
                var rect,
                    delta;

                if (that.clone) {
                    rect = that.clone.getBoundingClientRect();

                    // Up
                    delta = that.wrapperRect.top - rect.top;
                    if (delta > 0) {
                        return delta;
                    }

                    // Down
                    delta = that.wrapper.offsetTop + that.wrapper.offsetHeight - (rect.top + that.clone.offsetHeight);
                    if (delta < 0) {
                        return delta;
                    }
                }
                return 0;
            }

            function isScrollPossible() {
                //Down
                if (deltaY < 0) {
                    //Calculate the difference between (document - wrapper) and (difference between : document - wrapper + container height + wrapper height )
                    return that.wrapper.getBoundingClientRect().top - (that.container.getBoundingClientRect().top + that.container.offsetHeight) + that.wrapper.offsetHeight < 0;
                }
                //Up
                //Calculate the difference between (document - wrapper) and (document - container + container.top)
                return that.container.getBoundingClientRect().top - (that.wrapper.getBoundingClientRect().top + that.container.offsetTop) < 0;
            }

            function start() {
                startAnimation();
                that.dragAndScrollTimer = setTimeout(function() {
                    clearAnimation();
                    that.dragAndScrollTimer = undefined;
                    if ((deltaY = getDeltaY()) !== 0 && isScrollPossible()) {
                        start();
                    }
                    that.scrollCallback();
                }, duration);
            }

            deltaY = getDeltaY();
            if (deltaY !== 0 && !this.dragAndScrollTimer && isScrollPossible()) {
                duration = this.dragAndScrollDuration;
                //in IE when reaching the drag and scroll we lose the ref to this.scrollContainer
                this.scrollContainer = this.scrollContainer || document.querySelector(this.scrollContainerSelector);
                style = this.scrollContainer.style;
                start();
            }

            this.log('dragAndScroll (' + deltaY + ')');

            return (deltaY != 0) && isScrollPossible();
        };

        this.moveDraggableVerticalOnly = function() {
            var hoverElement,
                isVerticalIntersection,
                rect,
                movedElementPositionAboveMiddle = true;

            this.forEach(this.draggable, function(item, index) {
                /*
                 * There is no way to break native forEach,
                 * so just speed it up using fast check
                 * before executing expensive DOM manipulations
                 */
                if (!hoverElement) {
                    rect = item.getBoundingClientRect();
                    isVerticalIntersection = !(rect.bottom < this.moveY || rect.top > this.moveY);
                    if (isVerticalIntersection) {
                        hoverElement = item;

                        // Check if the moved object is currently above of below the middle of the hover element
                        // (rect.top + rect.height/2) => is the middle point of the hover element
                        if (rect.top + rect.height / 2 < this.moveY){
                            movedElementPositionAboveMiddle = false;
                        }
                    }
                }
            }.bind(this));
            if (hoverElement && this.element !== hoverElement) {

                /*
                 * Reorder draggable elements
                 */
                if (movedElementPositionAboveMiddle) {
                    this.insertBefore(this.draggable, this.element, hoverElement);
                    hoverElement.parentNode.insertBefore(this.element, hoverElement);

                }else {
                    this.insertBefore(this.draggable, this.element, hoverElement.nextSibling);
                    hoverElement.parentNode.insertBefore(this.element, hoverElement.nextSibling);
                }

                this.lastMoveX = this.moveX;
                this.lastMoveY = this.moveY;

            }

            this.log('moveDraggableVerticalonly');
        };

        /**
         * Move draggable element forward and backward
         * across another draggable elements
         *
         * @private
         */
        this.moveDraggable = function(moveX, moveY) {
            var elementIndex,
                hoverElement,
                hoverElementIndex,
                isHorizontalIntersection,
                isVerticalIntersection,
                rect;

            this.forEach(this.draggable, function(item, index) {
                /*
                 * There is no way to break native forEach,
                 * so just speed it up using fast check
                 * before executing expensive DOM manipulations
                 */
                if (!hoverElement) {
                    rect = item.getBoundingClientRect();
                    //style = window.getComputedStyle(item);
                    isHorizontalIntersection = !(rect.right < this.moveX || rect.left > this.moveX);
                    isVerticalIntersection = !(rect.bottom < this.moveY || rect.top > this.moveY);
                    if (isHorizontalIntersection && isVerticalIntersection) {
                        hoverElement = item;
                        hoverElementIndex = index;
                    }
                }
            }.bind(this));

            if (hoverElement && this.element !== hoverElement) {

                /*
                 * Reorder draggable elements
                 */
                elementIndex = this.indexOf(this.draggable, this.element);
                //Check if there was enough movement in order to mover the element
                if (Math.abs(this.lastMoveX - this.moveX) >= this.moveTolerance || Math.abs(this.lastMoveY - this.moveY) >= this.moveTolerance) {
                    if (hoverElementIndex <= elementIndex) {
                        hoverElement.parentNode.insertBefore(this.element, hoverElement);
                        this.insertBefore(this.draggable, this.element, hoverElement);
                    } else if (hoverElementIndex  > elementIndex) {
                        hoverElement.parentNode.insertBefore(this.element, hoverElement.nextSibling);
                        this.insertBefore(this.draggable, this.element, this.draggable[hoverElementIndex + 1]);
                    }
                    this.lastMoveX = this.moveX;
                    this.lastMoveY = this.moveY;
                }
            }

            this.log('moveDraggable');
        };

        /* PUBLIC METHODS */

        /**
         * Enable feature
         *
         * @public
         */
        this.enable = function () {
            this.log('enable');
            //Touch Events
            this.root.addEventListener(this.touchStartEvent, this.startHandler, false);
            this.root.addEventListener(this.touchMoveEvent, this.moveHandler, true);
            this.root.addEventListener(this.touchEndEvent, this.endHandler, false);
            this.root.addEventListener(this.touchCancelEvent, this.endHandler, false);
            //Mouse Events
            this.root.addEventListener(this.mouseMoveEvent, this.moveHandler, true);
            this.root.addEventListener(this.mouseDownEvent, this.startHandler, false);
            this.root.addEventListener(this.mouseUpEvent, this.endHandler, false);
            //Additional Events
            this.root.addEventListener(this.contextMenuEvent, this.contextMenuHandler, false);
            this.root.addEventListener(this.clickEvent, this.clickHandler, true);
            this.root.addEventListener(this.defaultDragStartEvent, this.defaultDragStartHandler, true);
            this.wrapper.addEventListener(this.scrollEvent, this.scrollHandler, false);

            return this;
        };

        /**
         * Disable feature
         *
         * @public
         */
        this.disable = function () {
            this.log('disable');
            this.root.removeEventListener(this.touchStartEvent, this.startHandler, false);
            this.root.removeEventListener(this.touchMoveEvent, this.moveHandler, true);
            this.root.removeEventListener(this.touchEndEvent, this.endHandler, false);
            this.root.removeEventListener(this.mouseDownEvent, this.startHandler, false);
            this.root.removeEventListener(this.mouseMoveEvent, this.moveHandler, true);
            this.root.removeEventListener(this.mouseUpEvent, this.endHandler, false);
            this.root.removeEventListener(this.contextMenuEvent, this.contextMenuHandler, false);
            this.root.removeEventListener(this.clickEvent, this.clickHandler, true);
            this.root.removeEventListener(this.touchCancelEvent, this.endHandler, false);
            this.wrapper.removeEventListener(this.scrollEvent, this.scrollHandler, false);

            return this;
        };
        /*
         * Initialize dynamic feature state
         * and behaviour using configuration
         */
        this.init(cfg);
    };
})();
