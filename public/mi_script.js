function deleteUser(id){
    
    fetch('http://localhost:3000/deleteUser/' + id , {method: 'GET'})
    .then(res=> {
                // let wid = "user_" + id.toString();
                // let l = document.getElementById(wid);
                // let padre = l.parentNode;
		        // padre.removeChild(l);
 
                document.getElementById(`user_${id}`)?.remove();
            })
    .catch(err=>console.log(err))
}