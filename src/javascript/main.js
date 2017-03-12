define('main', [
    'components/side-nav'
], function(
    SideNav
) {
    'use strict';
    
    return {
        init: function() {
            new SideNav();
        }
    };
});