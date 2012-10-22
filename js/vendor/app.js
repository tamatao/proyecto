// JavaScript Document
App = {
	init:function(urlDefinition){
		var self = this;
		//carga la definicion de la aplicacion
		var deferred = self.request({
			url:urlDefinition
		})
		
		/*if(location.hash){
			//si extiste un hash, cargamos esa pagina
			var page = new Page(location.hash.replace("#", ""));
			var result = page.process();
			result.fail(function(msg){
				self.notifyError(msg);
			})
		}*/
		
		//despues de cargar la definicion de la app
		deferred.done(function(response){
			self.application = app(response.payload);
			//se ha cargado la definicion
			//mandamos a la pagina de login
			var page = new Page("login.html")
			var result = page.process();
			result.fail(function(msg){
				self.notifyError(msg);
			})
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
}/*
function App(urlDefinition){
	
}*/

$.extend(App, {
	dataApp: {},
	//procesamiento de las peticiones
	process: function(o){
		var promise = $.Deferred();
		//verificamos si hay datos por almacenar
		if(o.data && !$.isEmptyObject(o.data)){
			App.setData(o.data).then(function(){promise.resolve();});
		}else{
			promise.resolve();
		}
		promise.promise();
		promise.then(function(){
			switch(o.action){
				case "signin":
					//despues de haber guardado la informacion hay que procesar la primera pagina
					App.viewforms({view:App.application.main.viewMain.view, form:App.application.main.viewMain.form});
					break;
				case "viewforms":
					bitamApp.viewforms(o);
					break;
			}
		});
	},
	//guarda datos en el almacen
	setData: function(data){
		//guarda la informacion del usuario directamente en la app
		if("User" in data){
			App.dataApp.User = data.User;
			delete data.User;
		}
		var dfd = $.Deferred();
		dfd.resolve();
		dfd.promise();
		return dfd;
	},
	//obtiene los datos de una vista
	//si esta online va al server, si esta offline los busca en el almacen
	getDataForView: function(o){
		//obtenemos la definicion de la vista y la forma
		var params = {};
		var dfd = $.Deferred();
		var aForm = App.application.getForm(o.form);
		var aView = aForm.getView(o.view);
		params.view = o.view;
		if(App.onLine()){
			App.request({url:"getData.inc.php", data:params}).then(function(){
				dfd.resolve();
			})
		}else{
			dfd.resolve();
		}
		dfd.promise();
		return dfd;
	},
	viewforms: function(o){
		//obtenemos la definicion de la vista y la forma
		var aForm = App.application.getForm(o.form);
		var aView = aForm.getView(o.view);
		//ahora hay que obtener los datos para la vista, armamos el query de la vista
		App.getDataForView(o).then(function(){
			//despues de obtener los datos construimos la vista
			alert(aForm.getQueryView(o.view))
		});
	},
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
				App.notifyError({
					"errorSummary":"Error loading page.",
					"errorDescription":"Error loading page: "+ userSettings.url +". Status: " +textStatus + "."
				} )
			}
		}
		deferred.promise();
		
		$.extend(settings, userSettings);
		$.ajax(settings);
		
		return deferred;
	},
	alert: function(msg){
	},
	onLine: function(){
		return true;
	}
});

function app(aApp){
	for(var key in aApp.forms){
		aApp.forms[key] = form(aApp.forms[key]);
	}
	
	$.extend(aApp, {
		getForm: function(sForm){
			return this.forms[sForm]
		}
	});
	return aApp;
}
function form(aForm){
	$.extend(aForm, {
		getView: function(sView){
			return this.views[sView];
		},
		getQueryView: function(sView){
			var aView = this.getView(sView);
			var sQuery = "SELECT "
			var tableAlias = {};
			var alias = "A"
			tableAlias[this.name] = alias;
			for(var key in aView.fields){
				var eachField = aView.fields[key]
				alias = (tableAlias[eachField.form] || (tableAlias[eachField.form] = String.fromCharCode(alias.charCodeAt() + 1)))
				sQuery += alias + "." + eachField.name + " ";
			}
			sQuery += " FROM " + this.name + " " + tableAlias[this.name];
			return sQuery;
		}
	});
	return aForm;
}
