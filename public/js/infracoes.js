const txtUser = document.getElementById('user');
const logout = document.getElementById('logout');

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
    var url = "https://registrodeinfracoes.firebaseio.com/modulousuario/infracoes/-LswuMCniuWvb1lffMx9.json";
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
                var dataInfracoes = infracoes.substring(0, infracoes.length);
                dataInfracoes += "]";
                $(document).ready(function() {
                    var column_names = []; //Array com confi das colunas
                    console.log(dataInfracoes);
                    var denunciaJSON = JSON.parse(dataInfracoes); //Parse no obj json, fa 
                    if (denunciaJSON.length > 0) {
                        var i = 0;
                        var column_titles = ["Código", "Artigo", "Gravidade", "Infração", "Pontos","Suspende CNH?","Valor da Multa"];
                        $.each(Object.keys(denunciaJSON[0]), function(idx, obj) {
                            column_names.push({
                                "sTitle": column_titles[i],
                                "mData": obj
                            });
                            i++;
                        });
                        var tb_infracoes = $('#tb_infracoes').DataTable({
                            "aaData": denunciaJSON,
                            "aoColumns": column_names,
                            "columnDefs": [
                                   
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
                                [10, 15, 20, -1],
                                [10, 15, 20, "All"]
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