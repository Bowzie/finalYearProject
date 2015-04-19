define(function () {
    //Empty constructor
    function musicPanel() {

    }

    musicPanel.prototype = {
    	loadMusicPanel: function(div) {
    		require(['jquery'], function() {
    			$(div).load('libs/musicPanel/musicPanel.html');
    		});		
    	},

    	removeMusicPanel: function() {
    		require(['jquery'], function() {
    			$('#musicPanel').hide();
    		});
    	}
    }

    return musicPanel;

});