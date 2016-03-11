require([ 
         'dojo/ready', 
         'dojo/_base/array', 
         'dojo/_base/lang',
         'dojo/query',
         'dojo/on'], function(ready, array, lang, query, on) {

	var users = [
	             {login: "user", password: "user"},
	             {login: "admin", password: "admin"}
	             ];

	var authentication = function(login, pwd){
		var result = false;
		array.some(users, function(user){
			if(user.login === login && user.password === pwd){
				result = true;
				return false;
			}
		});
		return result;
	}
	ready(function(){
		var loginButton = document.getElementById("login-button");
		on(loginButton, 'click', function(){
			var login = document.getElementById("login").value;
			var pwd = document.getElementById("pwd").value;

				console.log(login+" -- "+pwd+" -- "+authentication(login, pwd));
				if(authentication(login, pwd)){
					localStorage.setItem("username", login);
					window.location.replace("index.html");
				}else{
					alert("The provided data is invalid !");
				}
		});
	});

});


