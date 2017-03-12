'use strict';

// For any third party dependencies, like jQuery, place them in the lib folder.

// Configure loading modules from the lib directory,
// except for 'app' ones, which are in a sibling
// directory.
requirejs.config({
    baseUrl: 'src/javascript',
    paths: {
        app: '../dist'
    }
});

// Start loading the main app file. Put all of
// your application logic in there.
requirejs(['main'], function (main) {
    main.init();
});
'use strict';

define('main', ['components/side-nav'], function (SideNav) {
    'use strict';

    return {
        init: function init() {
            new SideNav();
        }
    };
});
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

define('components/side-nav', [
    // 'utils/detabinator'
], function ()
// Detabinator
{
    'use strict';

    var SideNav = function () {
        function SideNav() {
            _classCallCheck(this, SideNav);

            this.el = document.querySelector('.js-side-nav');
            this.menuShowEl = document.querySelector('.js-menu-show');
            this.menuHideEl = document.querySelector('.js-menu-hide');
            this.sideNavContainerEl = document.querySelector('.js-side-nav-container');

            /**
             * Control wether the container's children can be focused 
             * Set initial state to inert since the drawer is offscreen
             */
            // this.detabinator = new Detabinator(this.sideNavContainerEl);
            // this.detabinator.inert = true;

            // Bind this to event listeners
            this.showSideNav = this.showSideNav.bind(this);
            // this.hideSideNav = this.hideSideNav.bind(this);
            // this.blockClicks = this.blockClicks.bind(this);

            this.startX = 0;
            this.currentX = 0;
            this.touchingSideNav = false;

            this.supportsPassive = undefined;
            this.addEventListeners();
        }

        /**
         * apply passive event listening if it's supported
         */


        _createClass(SideNav, [{
            key: 'applyPassive',
            value: function applyPassive() {
                if (this.supportsPassive !== undefined) {
                    return this.supportsPassive ? { passive: true } : false;
                }

                // feature detect
                var isSupported = false;
                try {
                    document.addEventListener('test', null, { get passive() {
                            isSupported = true;
                        } });
                } catch (e) {}

                this.supportsPassive = isSupported;

                return this.applyPassive();
            }
        }, {
            key: 'addEventListeners',
            value: function addEventListeners() {
                var _this = this;

                this.menuShowEl.addEventListener('click', this.showSideNav);
                this.menuHideEl.addEventListener('click', function () {
                    return _this.hideSideNav();
                });
                this.el.addEventListener('click', function () {
                    return _this.hideSideNav();
                });
                this.sideNavContainerEl.addEventListener('click', function (e) {
                    return _this.blockClicks(e);
                });

                this.el.addEventListener('touchstart', function (e) {
                    return _this.onTouchStart(e);
                }, this.applyPassive());
                this.el.addEventListener('touchmove', function (e) {
                    return _this.onTouchMove(e);
                }, this.applyPassive());
                this.el.addEventListener('touchend', function (e) {
                    return _this.onTouchEnd(e);
                });
            }
        }, {
            key: 'onTouchStart',
            value: function onTouchStart(e) {
                var _this2 = this;

                if (!this.el.classList.contains('side-nav--visible')) {
                    return;
                }

                this.startX = e.touches[0].pageX;
                this.currentX = this.startX;

                this.touchingSideNav = true;
                requestAnimationFrame(function () {
                    return _this2.update();
                });
            }
        }, {
            key: 'onTouchMove',
            value: function onTouchMove(e) {
                if (!this.touchingSideNav) {
                    return;
                }

                this.currentX = e.touches[0].pageX;

                /**
                 * Instead of updating the translate here we make use of requestanimationframe
                 * Since it loads in a loop, and requestanimationFrame was called in touchstart
                 */
                // const translateX = Math.min(0, this.currentX - this.startX);
                // this.sideNavContainerEl.style.transform = `translateX(${translateX}px)`;
            }
        }, {
            key: 'onTouchEnd',
            value: function onTouchEnd(e) {
                if (!this.touchingSideNav) {
                    return;
                }

                this.touchingSideNav = false;

                var translateX = Math.min(0, this.currentX - this.startX);
                var sideNavContainerWidth = this.sideNavContainerEl.offsetWidth;
                var absTranslateX = Math.abs(translateX);

                this.sideNavContainerEl.style.transform = '';

                // Some elasticity
                if (absTranslateX > sideNavContainerWidth / 3) {
                    this.hideSideNav();
                } else {
                    this.showSideNav();
                }
            }
        }, {
            key: 'update',
            value: function update() {
                var _this3 = this;

                if (!this.touchingSideNav) {
                    return;
                }

                requestAnimationFrame(function () {
                    return _this3.update();
                });

                var translateX = Math.min(0, this.currentX - this.startX);
                this.sideNavContainerEl.style.transform = 'translateX(' + translateX + 'px)';
            }

            /**
             * this.el has the backdrop which hides the nav, we need to prevent hiding the menu
             * when the container is clicked.
             */

        }, {
            key: 'blockClicks',
            value: function blockClicks(e) {
                /**
                 * We stop the propagation to call hideNav
                 */
                e.stopPropagation();
            }
        }, {
            key: 'onTransitionEnd',
            value: function onTransitionEnd(e) {
                var _this4 = this;

                this.el.classList.remove('side-nav--animatable');
                this.el.removeEventListener('transitionend', function (e) {
                    return _this4.onTransitionEnd();
                });
            }
        }, {
            key: 'showSideNav',
            value: function showSideNav() {
                var _this5 = this;

                this.el.classList.add('side-nav--visible');
                this.el.classList.add('side-nav--animatable');
                this.el.addEventListener('transitionend', function (e) {
                    return _this5.onTransitionEnd();
                });
            }
        }, {
            key: 'hideSideNav',
            value: function hideSideNav() {
                var _this6 = this;

                this.el.classList.remove('side-nav--visible');
                this.el.classList.add('side-nav--animatable');
                this.el.addEventListener('transitionend', function (e) {
                    return _this6.onTransitionEnd();
                });
            }
        }]);

        return SideNav;
    }();

    return SideNav;
});
'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

define('utils/detabinator', [], function () {
    'use strict';

    var Detabinator = function () {
        function Detabinator(element) {
            _classCallCheck(this, Detabinator);

            if (!element) {
                throw new Error('Missing required argument. new Detabinator needs an element reference');
            }

            this._inert = false;
            this._focusableElementsString = 'a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, [tabindex], [contenteditable]';
            this._focusableElements = Array.from(element.querySelectorAll(this._focusableElementsString));
        }

        _createClass(Detabinator, [{
            key: 'inert',
            get: function get() {
                return this._inert;
            },
            set: function set(isInert) {
                if (this._inert === isInert) {
                    return;
                }

                this._inert = isInert;

                this._focusableElements.forEach(function (child) {
                    if (isInert) {
                        // If the child has an explict tabindex save it
                        if (child.hasAttribute('tabindex')) {
                            child.__savedTabindex = child.tabIndex;
                        }

                        // Set ALL focusable children to tabindex -1
                        child.setAttribute('tabindex', -1);
                    } else {
                        // If the child has a saved tabindex, restore it
                        // Because the value could be 0, explicitly check that it's not false
                        if (child.__savedTabindex === 0 || child.__savedTabindex) {
                            return child.setAttribute('tabindex', child.__savedTabindex);
                        } else {
                            // Remove tabindex from ANY REMAINING children
                            child.removeAttribute('tabindex');
                        }
                    }
                });
            }
        }]);

        return Detabinator;
    }();
});