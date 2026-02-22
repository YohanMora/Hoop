const host = "https://hoopcr.com/api/"
const myHeaders = new Headers();
myHeaders.append('Authorization', 'Bearer hoop2023!');

function login(body) {
    return new Promise((resolve, reject) => {
        try {
            
            var requestOptions = {
                method: 'POST',
                body: body,
                redirect: 'follow'
            };
            fetch(host+"login", requestOptions)
                .then(response => response.text())
                .then(result => {
                    resolve({error:false,data:JSON.parse(result)})
                })
                .catch(error => console.log('error', error));
        } catch {
            reject ({error: true })
        }
    })
}
function deleteUser(user) {
    return new Promise((resolve, reject) => {
        try {

            const myHeaders = new Headers();
            myHeaders.append('Authorization', 'Bearer hoop2023!');
      
            var requestOptions = {
                method: 'DELETE', 
                redirect: 'follow',  
                headers: myHeaders,
            };
            fetch(host+"user/"+user, requestOptions)
                .then(response => response.text())
                .then(result => {
                    resolve({error:false,data:JSON.parse(result)})
                })
                .catch(error => console.log('error', error));
        } catch {
            reject ({error: true })
        }
    })
}

function lostPass(body) {
    return new Promise((resolve, reject) => {
        try {
            var requestOptions = {
                method: 'POST',
                body: body,
                redirect: 'follow'
                
            };
            fetch(host+"lost_password", requestOptions)
                .then(response => response.text())
                .then(result => {
                    resolve({error:false,data:JSON.parse(result)})
                })
                .catch(error => console.log('error', error));
        } catch {
            reject ({error: true })
        }
    })
}

function datosMembresias(id) {
    console.log('id',id)
    return new Promise((resolve, reject) => {
        try {
            var requestOptions = {
                method: 'GET', 
                redirect: 'follow',
                headers: myHeaders,
            };
            fetch(host+"memberships/"+id, requestOptions)
                .then(response => response.text())
                .then(result => {
                    console.log('result',result)
                    resolve({error:false,data:JSON.parse(result)})
                })
                .catch(error => console.log('error', error));
        } catch {
            reject ({error: true })
        }
    })
}
function deleteClass(id) { 
    console.log(host+"booking/"+id);
    return new Promise((resolve, reject) => {
        try {
            var requestOptions = {
                method: 'DELETE', 
                redirect: 'follow',
                headers: myHeaders,
            };
            fetch(host+"booking/"+id, requestOptions)
                .then(response => response.text())
                .then(result => {
                    console.log('result',result)
                    resolve({error:false,data:JSON.parse(result)})
                })
                .catch(error => console.log('error', error));
        } catch {
            reject ({error: true })
        }
    })
}

function horarios() {

}
export default { login, horarios,lostPass,deleteUser,datosMembresias,deleteClass }