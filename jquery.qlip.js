/*!
 * jquery.qlip() - v0.0.1
 * http://adam.co/lab/jquery/qlip/
 * 01/03/2013
 *
 * Copyright 2013 Adam Coulombe
 * @license http://www.opensource.org/licenses/mit-license.html MIT License
 * @license http://www.gnu.org/licenses/gpl.html GPL2 License 
 */

 (function ($) {
    'use strict';

    $.extend({
    	qlip: {
    		call:function(data){
    			var $el = $("[data-qlip-id="+data.id+"]");
    			$el.trigger(data.event);
     			if(data.event=="mousedown"){
    				$el.addClass("qlip-active");
    			}
    			if(data.event=="mouseup"){
    				$el.trigger("copy").removeClass("qlip-active");
    			}
    			if(data.event=="mouseover"){
    				$el.addClass("qlip-hover");
    			}
    			if(data.event=="mouseout"){
    				$el.removeClass("qlip-hover");
    			}
    			if(data.event=="loaded"){
    				$el.toggleClass('qlip-no-copy qlip-has-copy');
    			}
    		}
    	}
    });

    $.fn.extend({
        qlip: function () {
			var options = (typeof arguments[0] == "object") ? arguments[0] : arguments[1],
			batch = new Date().getTime(),
			defaults = {
                swf: "qlip.swf",
                width: null,
                height: null,
				top:null,
				left:null
            };
				
			options = $.extend(defaults, options);

			var $modal = $('<div id="qlip-modal"/>');
			var $textarea = $('<textarea id="qlip-modal-selection" />').appendTo($modal);
			
			return this.each(function (i) {
				var $this = $(this),
				string = (typeof arguments[0] == "string") ? arguments[0] :  $this.data('qlip-string'),
				qlipId = "qlip-" + batch + "-" + i,
				qlipWidth = options.width || $this.outerWidth(),
				qlipHeight = options.height || $this.outerHeight(),
				qlipTop = options.top || -parseInt($this.css("border-top-width")),
				qlipLeft = options.left || -parseInt($this.css("border-top-width")),
				swfParams = 'string=' + encodeURIComponent(string) + '&id=' + qlipId;
				
				$this.addClass('qlip-no-copy');
				if($this.css('position')=='static'){
					$this.css('position','relative');
				}
				var $swf = $('<span class="qlip" />').css({
								display:'block',
								position:'absolute'
							}).append(
								$('<object width="100%" height="100%" />').append(
									$('<param name="movie" value="'+options.swf+'" />'),
									$('<param name="flashvars" value="' + swfParams + '" />'),
									$('<param name="wmode" value="transparent" />'),
									$('<embed src="'+options.swf+'" wmode="transparent" flashvars="' + swfParams + '"  width="100%" height="100%" />')
								)
							);
				
				$this.on('update',function(){
					$swf.css({
						width:qlipWidth,
						height:qlipHeight,
						top:qlipTop,
						left:qlipLeft
					});
				})
				.append($swf)
				.trigger('update')
				.attr("data-qlip-id", qlipId);

				$this.on('click touchdown',function(){
					$('body').append($modal);
					$textarea.html(string).focus().select().on('copy',function(){
						$this.trigger('copy');
						$modal.remove();
					}).get(0).setSelectionRange(0, 9999);
				});

			});
		}
	});
})(jQuery);
