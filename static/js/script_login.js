$(document).ready(function(){
	$("#loginModal").modal('toggle');

	function login(){
		var user = $("#usuario").val();
		var password = $("#senha").val();
		return $.ajax({
          url: "/actions",
          method: "POST",
          data: {action: 'login', user: user, password: password},
          dataType: 'json',
          success: function(data) {
           console.log(data.login);
           if (data.login == true){
           		window.location.replace("/");
           }else{
				swal({
					type: 'error',
					title: 'Oops...',
					text: 'Erro ao logar! Usuario ou senha incorretos!',
				})
           }
           
          },
          error: function(data) {
            console.log(data);
          }
        });
	}

	$(document).on('click','.login',function(){
		login();
	});

	$(document).on('keyup','#usuario, #senha',function(e){
		var code = e.which;
		if(code==13)e.preventDefault();
	    if(code==32||code==13||code==188||code==186){
	    	login();
	    }
	});
});