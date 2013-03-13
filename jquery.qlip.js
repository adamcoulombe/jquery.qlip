/*!
 * jquery.qlip() - v1.0.0
 * http://adam.co/lab/jquery/qlip/
 * 01/05/2013
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
    				$el.toggleClass('qlip-no-swf qlip-has-swf');
    			}
    		},
    		environment : {
    			touch : ('ontouchstart' in document.documentElement),
    			mac : (navigator.appVersion.indexOf("Mac")!=-1)
    		}
    	}
    });

    $.fn.extend({
        qlip: function () {
			var options = (typeof arguments[0] == "object") ? arguments[0] : arguments[1],
			stringArg = (typeof arguments[0] == "string") ? arguments[0] : null,
			batch = new Date().getTime(),
			defaults = {
                swf: "qlip.swf",
                width: null,
                height: null,
				top:null,
				left:null,
				updateOnWindowResize:false
            };
				
			options = $.extend(defaults, options);

			var $modal = $('<div id="qlip-modal"/>'),
			$modalWindow = $('<div id="qlip-modal-window"/>').appendTo($modal),
			$modalLabel = $('<div id="qlip-modal-label" />').appendTo($modalWindow);
			
			return this.each(function (i) {
				var $this = $(this),
				string = stringArg || $this.data('qlip-string'),
				qlipId = "qlip-" + batch + "-" + i,
				swfParams = 'string=' + encodeURIComponent(string) + '&id=' + qlipId;
				
				$this.addClass('qlip-no-swf');
				if(options.swf){
					if($this.css('position')=='static'){
						$this.css('position','relative');
					}
					var $swf = $('<span class="qlip-swf" />').css({
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
					
					$this.on('update.qlip',function(){
						$swf.css({
							width:options.width || $this.outerWidth(),
							height:options.height || $this.outerHeight(),
							top:options.top || -parseInt($this.css("border-top-width")),
							left:options.left || -parseInt($this.css("border-top-width"))
						});
					})
					.append($swf)
					.trigger('update')
					.attr("data-qlip-id", qlipId);
					if(options.updateOnWindowResize){
						$(window).on('resize.qlip',function(){
							$this.trigger('update.qlip');
						});
					}
				}

				$this.on('click touchdown',function(){
					if(!$.qlip.environment.touch){
						var kbdKeyLabel = $.qlip.environment.mac ? '&#8984;Cmd' : 'Ctrl';
						$modalLabel.html('<kbd>'+kbdKeyLabel+'</kbd>+<kbd>C</kbd> to copy');
						var cmdKeys = [17,91,224,93];
						$(window).on('keydown.qlip keyup.qlip',function(e){
							if( $.inArray(e.which,cmdKeys) > -1 ){ // ctrl or cmd
								$modalLabel.children('kbd:nth-of-type(1)').attr('class',e.type);
							}
							if(e.which == 67 ){ // "c"
								$modalLabel.children('kbd:nth-of-type(2)').attr('class',e.type);
							}
							if(e.which == 27 ){ // escape
								$textarea.trigger('blur');
							}
						});
					}

					var $textarea = $('<textarea id="qlip-modal-selection" />')
					$modalWindow.empty().append(
						$textarea,
						$modalLabel
					);

					$('body').append($modal);
					$modal.on('click.qlip touchdown.qlip',function(e){
						if(e.target!=$textarea[0]){
							$textarea.trigger('blur');
						}
					});
					$textarea.html(string)
					.on('focus.qlip', function(){
						$(this).select().get(0).setSelectionRange(0, 9999);
					})
					.on('touchstart.qlip click.qlip',function(){
						$(this).trigger('focus.qlip');
					})
					.trigger('click.qlip')
					.one('cut copy blur',function(e){
						$(window).off('keydown.qlip keyup.qlip');
						$modal.off('click.qlip touchstart.qlip');
						$textarea.off('click.qlip touchstart.qlip focus.qlip');
						if(e.type=='cut' || e.type=='copy' ){
							$this.trigger('copy');
						}
						setTimeout(function(){
							$modal.addClass('close').one("animationend webkitAnimationEnd MSAnimationEnd oAnimationEnd",function(){
								$modal.removeClass('close').remove()
								$modalLabel.children('kbd').attr('class','');
							});
						},100);
					});
				});
			});
		}
	});
})(jQuery);
