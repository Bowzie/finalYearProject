define(function () {
    //Empty constructor
    function musicPanel() {

    }

    musicPanel.prototype = {
    	loadMusicPanel: function(div, callback) {
    		require(['jquery'], function() {
    			$(div).load('libs/musicPanel/musicPanel.html', function() {
                    callback(true);
                });
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