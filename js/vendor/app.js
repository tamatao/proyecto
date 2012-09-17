// JavaScript Document
function App(urlDefinition){
	var self = this;
	//carga la definicion de la aplicacion
	var deferred = self.request({
		url:urlDefinition,
		
	})
	
	if(location.hash){
		//si extiste un hash, cargamos esa pagina
		var page = new Page(location.hash.replace("#", ""));
		var result = page.process();
		result.fail(function(msg){
			self.notifyError(msg);
		})
	}
	
	//despues de cargar la definicion de la app
	deferred.done(function(response){
		//se ha cargado la definicion
	});
	
	//mejoramos los formularios
	$("form").each(function(index, element) {
        var aForm = $(element);
		aForm.submit(function(){
			var page = new Page(this.action);
			var result = page.process();
			result.fail(function(msg){
				self.notifyError(msg);
			})
			return false;
		})
    });
}

$.extend(App.prototype, {
	page : function(string){
		
	},
	notifyError: function(msg){
		var alertContainer = $(".alert-container");
		if(alertContainer.length == 0)
			alertContainer = $("<div/>", {"class":"alert-container"})
		var myAlert = $("<div/>", {"class":"alert container", "data-spy":"affix", "data-offset-top":"200"});
		$("body").append(alertContainer);
		myAlert.append(
			$("<a/>", {"class":"close", "data-dismiss":"alert"}).html("x"),
			$("<h4/>").append(msg.errorSummary),
			msg.errorDescription
		);
		alertContainer.append(myAlert);
		myAlert.alert();
	},
	request : function(userSettings){
		var deferred = $.Deferred();
		settings = {
			cache: false,
			dataType:"json",
			crossDomain : false,
			timeout: 120000,
			type : 'POST',
			success: function(response){
				if(response.error != 0){
					return;
				}
				deferred.resolve(response);
			},
			error: function(XMLHttpRequest, textStatus, errorThrown) {
				alert(textStatus)
			}
		}
		deferred.promise();
		
		$.extend(settings, userSettings);
		$.ajax(settings);
		
		return deferred;
	}
});