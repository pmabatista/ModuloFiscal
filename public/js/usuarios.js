const txtUser = document.getElementById('user');
const logout = document.getElementById('logout');
const txtnome = document.getElementById('nome');
const txtsobrenome = document.getElementById('sobrenome');
const txtemail = document.getElementById('email');
const txtsenha = document.getElementById('senha');
const txtconfsenha = document.getElementById('confsenha');
const btnCadastrar = document.getElementById('btnCadastrar');
const btnCriar = document.getElementById('btnCriar');
const btnOk = document.getElementById('btnOk');

(function() {
    const config = {
        "apiKey": "AIzaSyCtDY0GEmD5fErKPwS-3ZYCi-uz_AM6v0s",
        "appId": "1:708150240191:web:21f6269ddabe871bc5b70a",
        "authDomain": "tratamentodeinfracoes.firebaseapp.com",
        "databaseURL": "https://tratamentodeinfracoes.firebaseio.com",
        "measurementId": "G-RX1LZ9MMES",
        "messagingSenderId": "708150240191",
        "projectId": "tratamentodeinfracoes",
        "storageBucket": "tratamentodeinfracoes.appspot.com"
    };
    firebase.initializeApp(config);

    txtUser.innerHTML = localStorage.getItem("user");

    logout.addEventListener('click', e => {
        firebase.auth().signOut();
    });



    btnCadastrar.addEventListener('click', e => {
        $('#modalCadastro').modal({
            show: true
        });
    });
    btnOk.addEventListener('click', e => {
        window.location.reload(false);
    });
    
    btnCriar.addEventListener('click', e => {
        // TODO: CHECK 4 REAL EMAILZ
        
        const email = txtemail.value;
        const pass = txtsenha.value;
        const nome = txtnome.value;
        const sobrenome = txtsobrenome.value;
        const confsenha = txtconfsenha.value;
        var Result = "true";
        const auth = firebase.auth();
        var user;


        if(pass == confsenha){
            const promisse = auth.createUserWithEmailAndPassword(email, pass)
            .then(function (firebaseUser) {
                console.log("User " + firebaseUser.uid + " created successfully!");
                user = firebaseUser.uid;
                writeUserData(user, nome, sobrenome, email);
                $('#modalOk').modal({
                    show: true
                });
                return firebaseUser;
            });
            
            
            
        }
        else{
            alert('Senha não confere'); 
        }
        
    });

    async function  writeUserData(userId, nome, sobrenome, email) {
        firebase.database().ref('users/' + userId).set({
          nome: nome,
          sobrenome: sobrenome,
          email: email
        });
      }


    firebase.auth().onAuthStateChanged(firebaseUser => {
        if (firebaseUser) {
            console.log(firebaseUser);
        } else {
            console.log('not logged in');
            window.location.href = 'login.html';
        }
    });
}());

function getHttpRequest() {
    if (window.XMLHttpRequest) {
        // Outros browsers
        req = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
        // Internet Explorer
        req = new ActiveXObject("Microsoft.XMLHTTP");
    }
    return req;
}

var infracoes = "[";
$(document).ready(function() {
    var req = getHttpRequest();
    var url = "https://tratamentodeinfracoes.firebaseio.com/users.json";
    req.onreadystatechange = function() {
        if (req.readyState == 4) {
            if (req.status == 200) {
                var retorno = JSON.parse(req.responseText);
                for (var k in retorno) {
                    infracoes += "{" + "\"key\":\"" + k + "\",";
                    var retornoString = (JSON.stringify(retorno[k]) + ",");
                    infracoes += retornoString.substring(1, retornoString.length);
                }
                if (infracoes.charAt(infracoes.length - 1) === ",") {
                    infracoes = infracoes.substring(0, infracoes.length - 1);
                }
                var dataUsuarios = infracoes.substring(0, infracoes.length);
                dataUsuarios += "]";
                $(document).ready(function() {
                    var column_names = []; //Array com confi das colunas
                    var denunciaJSON = JSON.parse(dataUsuarios); //Parse no obj json, fa 
                    if (denunciaJSON.length > 0) {
                        var i = 0;
                        var column_titles = ["ID", "Email", "Nome", "Sobrenome"];
                        $.each(Object.keys(denunciaJSON[0]), function(idx, obj) {
                            column_names.push({
                                "sTitle": column_titles[i],
                                "mData": obj
                            });
                            i++;
                        });
                        var tb_usuarios = $('#tb_usuarios').DataTable({
                            "aaData": denunciaJSON,
                            "aoColumns": column_names,
                            "columnDefs": [{
                                    "targets": [0],
                                    "width": "25%"
                                },
                                {
                                    "targets": [1],
                                    "width": "25%"
                                },
                                {
                                    "targets": [2],
                                    "width": "25%"
                                },
                                {
                                    "targets": [3],
                                    "width": "25%"
                                }          
                            ],
                            "oLanguage": {
                                "sLengthMenu": "Mostrar _MENU_ registros por página",
                                "sZeroRecords": "Nenhum registro encontrado",
                                "sInfo": "Mostrando _START_ / _END_ de _TOTAL_ registro(s)",
                                "sInfoEmpty": "Mostrando 0 / 0 de 0 registros",
                                "sInfoFiltered": "(filtrado de _MAX_ registros)",
                                "sSearch": "Pesquisar: ",
                                "oPaginate": {
                                    "sFirst": "Início",
                                    "sPrevious": "Anterior",
                                    "sNext": "Próximo",
                                    "sLast": "Último"
                                }
                            },
                            "lengthMenu": [
                                [5, 10, 15, -1],
                                [5, 10, 15, "All"]
                            ]
                        });
                    }
                });
            }
        }
    }
    req.open("GET", url, true);
    req.send(null);
});

