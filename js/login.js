// JavaScript Document
$(function(){
	$("#login").submit(function(){
		
		/*App.request({url:this.action, data:$(this).serializeObject()}).then(function(res){
			App.process(res);
		})*/
		App.process({action:"signin",data:{User:{username:"aramirez",password:"demo"}}});
		return false;
	})
})