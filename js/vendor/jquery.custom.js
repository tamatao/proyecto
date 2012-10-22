// JavaScript Document
(function($) {
	$.extend($.fn, {
		serializeObject: function(){
			
			var json = {};
					
			jQuery.map(this.serializeArray(), function(n, i)
			{
				if(json[n['name']])
				{
					if($.isArray(json[n['name']]))//isArray
					{
						json[n['name']].push(n['value']);
					}
					else
					{
						json[n['name']] = new Array(json[n['name']]);
						json[n['name']].push(n['value']);
					}
				}
				else
				{
					if($('#' + n['name']).attr('multiple') == 'multiple')
					{
						json[n['name']] = new Array();
						json[n['name']].push(n['value']);
					}
					else
					{
						json[n['name']] = n['value'];
					}
				}
			});
			
			return json;
		}
	})
})(jQuery);