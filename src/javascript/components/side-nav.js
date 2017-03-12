define('components/side-nav', [
    // 'utils/detabinator'
], function(
    // Detabinator
) {
    'use strict';
    
    class SideNav {

        constructor() {
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
        applyPassive() {
            if (this.supportsPassive !== undefined) {
                return this.supportsPassive ? {passive: true} : false;
            }
            
            // feature detect
            let isSupported = false;
            try {
                document.addEventListener('test', null, {get passive() {
                    isSupported = true;
                }});
            } catch (e) {

            }

            this.supportsPassive = isSupported;

            return this.applyPassive();
        }

        addEventListeners() {
            this.menuShowEl.addEventListener('click', this.showSideNav);
            this.menuHideEl.addEventListener('click', () => this.hideSideNav());
            this.el.addEventListener('click', () => this.hideSideNav());
            this.sideNavContainerEl.addEventListener('click', (e) => this.blockClicks(e));

            this.el.addEventListener('touchstart', (e) => this.onTouchStart(e), this.applyPassive());
            this.el.addEventListener('touchmove', (e) => this.onTouchMove(e), this.applyPassive());
            this.el.addEventListener('touchend', (e) => this.onTouchEnd(e));
        }

        onTouchStart(e) {
            if (!this.el.classList.contains('side-nav--visible')) {
                return;
            }

            this.startX = e.touches[0].pageX;
            this.currentX = this.startX;

            this.touchingSideNav = true;
            requestAnimationFrame(() => this.update());
        }

        onTouchMove(e) {
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

        onTouchEnd(e) {
            if (!this.touchingSideNav) {
                return;
            }

            this.touchingSideNav = false;

            const translateX = Math.min(0, this.currentX - this.startX);
            const sideNavContainerWidth = this.sideNavContainerEl.offsetWidth;
            const absTranslateX = Math.abs(translateX);

            this.sideNavContainerEl.style.transform = '';

            // Some elasticity
            if (absTranslateX > (sideNavContainerWidth / 3)) {
                this.hideSideNav();
            } else {
                this.showSideNav();
            }
        }

        update() {
            if (!this.touchingSideNav) {
                return;
            }

            requestAnimationFrame(() => this.update());

            const translateX = Math.min(0, this.currentX - this.startX);
            this.sideNavContainerEl.style.transform = `translateX(${translateX}px)`;
        }

        /**
         * this.el has the backdrop which hides the nav, we need to prevent hiding the menu
         * when the container is clicked.
         */
        blockClicks(e) {
            /**
             * We stop the propagation to call hideNav
             */
            e.stopPropagation();
        }

        onTransitionEnd(e) {
            this.el.classList.remove('side-nav--animatable');
            this.el.removeEventListener('transitionend', (e) => this.onTransitionEnd());
        }

        showSideNav() {
            this.el.classList.add('side-nav--visible');
            this.el.classList.add('side-nav--animatable');
            this.el.addEventListener('transitionend', (e) => this.onTransitionEnd());
        }

        hideSideNav() {
            this.el.classList.remove('side-nav--visible');
            this.el.classList.add('side-nav--animatable');
            this.el.addEventListener('transitionend', (e) => this.onTransitionEnd());
        }
    }

    return SideNav;
});