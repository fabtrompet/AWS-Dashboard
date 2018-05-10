$(document).ready(function(){

  $(document).on('click','.logout',function(){
    var instanceId = $(this).val();
    return $.ajax({
          url: "/actions",
          method: "POST",
          data: {action: 'logout'},
          dataType: 'json',
          success: function(data) {
           console.log(data);
           if (data.logout == true){
              window.location.replace("/login");
           }
          },
          error: function(data) {
            console.log(data);
          }
        });
  });


	$(document).on('click','.start',function(){
		var instanceId = $(this).val();
		return $.ajax({
          url: "/actions",
          method: "POST",
          data: {action: 'start', instanceId: instanceId},
          dataType: 'json',
          success: function(data) {
           console.log(data);
          },
          error: function(data) {
            console.log(data);
          }
        });
	});

	$(document).on('click','.stop',function(){
    swal({
  title: 'Voce tem certeza?',
  type: 'warning',
  showCancelButton: true,
  confirmButtonColor: '#3085d6',
  cancelButtonColor: '#d33',
  confirmButtonText: 'Sim, stop!',
  cancelButtonText: 'Nao, cancela!',
  confirmButtonClass: 'btn btn-success',
  cancelButtonClass: 'btn btn-danger',
  buttonsStyling: false,
  reverseButtons: true
}).then((result) => {
  if (result.value) {
   var instanceId = $(this).val();
    return $.ajax({
          url: "/actions",
          method: "POST",
          data: {action: 'stop', instanceId: instanceId},
          dataType: 'json',
          success: function(data) {
           console.log(data);
          },
          error: function(data) {
            console.log(data);
          }
        });
  } else if (
    // Read more about handling dismissals
    result.dismiss === swal.DismissReason.cancel
  ) {
    swal(
      'Cancelado',
      'Voce esta a salvo! :)',
      'error'
    )
  }
})
		
	});

	$(document).on('click','.remove',function(){
    swal({
  title: 'Voce tem certeza?',
  type: 'warning',
  showCancelButton: true,
  confirmButtonColor: '#3085d6',
  cancelButtonColor: '#d33',
  confirmButtonText: 'Sim, remove!',
  cancelButtonText: 'Nao, cancela!',
  confirmButtonClass: 'btn btn-success',
  cancelButtonClass: 'btn btn-danger',
  buttonsStyling: false,
  reverseButtons: true
}).then((result) => {
  if (result.value) {
		var volumeId = $(this).val();
		return $.ajax({
          url: "/actions",
          method: "POST",
          data: {action: 'remove', volumeId: volumeId},
          dataType: 'json',
          success: function(data) {
           console.log(data);
          },
          error: function(data) {
            console.log(data);
          }
        });
   } else if (
    // Read more about handling dismissals
    result.dismiss === swal.DismissReason.cancel
  ) {
    swal(
      'Cancelado',
      'Voce esta a salvo! :)',
      'error'
    )
  }
}) 
	});

	function getDataInstances(){
		return $.ajax({
          url: "/getData",
          method: "POST",
          data: {action: 'instances'},
          dataType: 'json',
          success: function(data) {
           console.log(data);
           $("#tableDataInstances").empty();
           	for(var instances in data) {
           		for(var i in data[instances]) {
           			if(data[instances][i].state == "running"){
           				$("#tableDataInstances").append("<tr><td>"+data[instances][i].name+"</td><td>"+data[instances][i].id+"</td><td>"+data[instances][i].type+"</td><td>"+data[instances][i].state+"</td><td><button value='"+data[instances][i].id+"' type='button' class='stop btn btn-danger'>Stop</button></td></tr>");
           			}else if(data[instances][i].state == "stopped"){
           				$("#tableDataInstances").append("<tr><td>"+data[instances][i].name+"</td><td>"+data[instances][i].id+"</td><td>"+data[instances][i].type+"</td><td>"+data[instances][i].state+"</td><td><button value='"+data[instances][i].id+"' type='button' class='start btn btn-primary mr-5'>Start</button></td></tr>");
           			}
           			else{
           				$("#tableDataInstances").append("<tr><td>"+data[instances][i].name+"</td><td>"+data[instances][i].id+"</td><td>"+data[instances][i].type+"</td><td>"+data[instances][i].state+"</td><td><button value='"+data[instances][i].id+"' type='button' class='btn btn-warning'>Pending</button></td></tr>");
           			}	
            	}
            }
          },
          error: function(data) {
            console.log(data);
          }
        });
	}
	function getDataVolumes(){
		return $.ajax({
          url: "/getData",
          method: "POST",
          data: {action: 'volumes'},
          dataType: 'json',
          success: function(data) {
           console.log(data);
           $("#tableDataVolumes").empty();
           	for(var volumes in data) {
           		for(var i in data[volumes]) {
           			if(data[volumes][i].status == "attached"){
           				$("#tableDataVolumes").append("<tr><td>"+data[volumes][i].name+"</td><td>"+data[volumes][i].id+"</td><td>"+data[volumes][i].size+"</td><td>"+data[volumes][i].type+"</td><td>"+data[volumes][i].state+"</td><td><button value='"+data[volumes][i].id+"' type='button' class='btn btn-info mr-5'>No action</button></td></tr>");
           			}else if(data[volumes][i].status == "deleting"){
                  $("#tableDataVolumes").append("<tr><td>"+data[volumes][i].name+"</td><td>"+data[volumes][i].id+"</td><td>"+data[volumes][i].size+"</td><td>"+data[volumes][i].type+"</td><td>"+data[volumes][i].state+"</td><td><button value='"+data[volumes][i].id+"' type='button' class='btn btn-warning mr-5'>Deleting</button></td></tr>");  
                }
                else{
  	         			$("#tableDataVolumes").append("<tr><td>"+data[volumes][i].name+"</td><td>"+data[volumes][i].id+"</td><td>"+data[volumes][i].size+"</td><td>"+data[volumes][i].type+"</td><td>"+data[volumes][i].state+"</td><td><button value='"+data[volumes][i].id+"' type='button' class='remove btn btn-danger mr-5'>Remove</button></td></tr>");	
           			}
            	}
            }
          },
          error: function(data) {
            console.log(data);
          }
        });
	}
	getDataInstances();
	setInterval(getDataInstances, 5000);
	getDataVolumes();
	setInterval(getDataVolumes, 5000);
});