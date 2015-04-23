define(function () {
    //Empty constructor
    function musicPanel() {

    }

    musicPanel.prototype = {
    	loadMainPanel: function(div, callback) {
    		require(['jquery'], function() {
    			$(div).load('libs/mainPanel/mainPanel.html', function() {
                    callback(true);
                });
    		});		
    	},

    	removeMainPanel: function() {
    		require(['jquery'], function() {
    			$('#mainPanel').hide();
    		});
    	}
    }

    return musicPanel;

});