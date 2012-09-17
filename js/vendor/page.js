// JavaScript Document
function Page(url){
	var self = this;
	//parseanos la url
	this.uri = self.parseURL(url);
	
}

$.extend(Page.prototype, {
	process: function(){
		var self = this;
		//mandamos a pedir la pagina
		var deferred = $.Deferred();
		$.ajax({
			"url":"template/"+self.uri.filename,
			"success": function(response){
				location.hash = self.uri.filename;
				$("body").empty().append(response.documentElement);
			},
			"error": function(){
				deferred.reject( {
					"errorSummary":"Error loading page.",
					"errorDescription":"Error loading page: "+ self.uri.filename +"."
				} )
			}
		});
		deferred.promise();
		return deferred;
	},
	parseURL : function(url){
		var uri = URI(url);
		return {filename:(uri.filename() || url)}
	}
})