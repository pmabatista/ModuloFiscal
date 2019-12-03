const logout = document.getElementById('logout');
const txtUser = document.getElementById('user');
const close = document.getElementById('close');
const btnCdastrar = document.getElementById('btnCadastrar');
const btnGravar = document.getElementById('btnGravar');
const btnCapturar = document.getElementById('btnCapturar');
const btnAprovar = document.getElementById('btnAprovar');
const btnReprovar = document.getElementById('btnReprovar');
const btnClose = document.getElementById('btnClose');
const btnSelecionar = document.getElementById('btnSelecionar');
const btnGerar = document.getElementById('btnGerar');
const txtDenuncia = document.getElementById('txtDenuncia');
const txtData = document.getElementById('txtData');
const txtVeiculo = document.getElementById('txtVeiculo');
const txtPlaca = document.getElementById('txtPlaca');
const txtMarca = document.getElementById('txtMarca');
const txtLocal = document.getElementById('txtLocal');
const txtObservacao = document.getElementById('txtObservacao');
const txtInfracao = document.getElementById('txtInfracao');
const video1 = document.getElementById('video1');
const video2 = document.getElementById('video2');
const video3 = document.getElementById('video3');
const btnConfirmar = document.getElementById('btnConfirmar');

var fiscal;
var denuncia;


close.addEventListener('click', e => {
    window.location.reload(false);
});

btnClose.addEventListener('click', e => {
    window.location.reload(false);
});

txtDenuncia.addEventListener('click', e => {
    $('#modalInfracao').modal({
        show: true
    });
});

btnSelecionar.addEventListener('click', e => {
    txtDenuncia.value = denuncia;
    $("#modalInfracao").modal('toggle');
    $('#modal_aberto').modal('show');
});

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

function gerarProtocolo() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 12; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function gerarSenha() {
    var text = "";
    var possible = "0123456789";

    for (var i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

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
var denunciasAberto = "[";
var denunciasAnalise = "[";
var denunciasFinalizado = "[";

$(document).ready(function() {
    var req = getHttpRequest();
    var url = "https://registrodeinfracoes.firebaseio.com/modulousuario/denuncias.json";
    req.onreadystatechange = function() {
        if (req.readyState == 4) {
            if (req.status == 200) {
                // Converte o retorno em JSON para um objeto válido
                var retorno = JSON.parse(req.responseText);
                for (var k in retorno) {
                    if (retorno[k].status == "em aberto") {
                        denunciasAberto += "{" + "\"key\":\"" + k + "\",";
                        var retornoString = (JSON.stringify(retorno[k]) + ",")
                        denunciasAberto += retornoString.substring(1, retornoString.length);
                    }
                    if (retorno[k].status == "em analise") {
                        denunciasAnalise += "{" + "\"key\":\"" + k + "\",";
                        var retornoString = (JSON.stringify(retorno[k]) + ",")
                        denunciasAnalise += retornoString.substring(1, retornoString.length);
                    }

                    if (retorno[k].status == "aprovada" || retorno[k].status == "reprovada") {
                        denunciasFinalizado += "{" + "\"key\":\"" + k + "\",";
                        var retornoString = (JSON.stringify(retorno[k]) + ",")
                        denunciasFinalizado += retornoString.substring(1, retornoString.length);
                    }
                }
            }
            if (denunciasFinalizado.charAt(denunciasFinalizado.length - 1) === ",") {
                denunciasFinalizado = denunciasFinalizado.substring(0, denunciasFinalizado.length - 1);
            }
            if (denunciasAberto.charAt(denunciasAberto.length - 1) === ",") {
                denunciasAberto = denunciasAberto.substring(0, denunciasAberto.length - 1);
            }
            if (denunciasAnalise.charAt(denunciasAnalise.length - 1) === ",") {
                denunciasAnalise = denunciasAnalise.substring(0, denunciasAnalise.length - 1);
            }
            var dataAberto = denunciasAberto.substring(0, denunciasAberto.length);
            var dataAnalise = denunciasAnalise.substring(0, denunciasAnalise.length);
            var dataFinalizado = denunciasFinalizado.substring(0, denunciasFinalizado.length);
            dataAberto += "]";
            dataAnalise += "]";
            dataFinalizado += "]";
            $(document).ready(function() {
                var column_names = []; //Array com confi das colunas
                var denunciaJSON = JSON.parse(dataAberto); //Parse no obj json, fa 
                if (denunciaJSON.length > 0) {
                    var i = 0;
                    var column_titles = ["Key", "Data", "Veiculo", "Denúncia", "Endereço", "Marca", "Observação", "Placa", "Provas", "Status"];
                    $.each(Object.keys(denunciaJSON[0]), function(idx, obj) {
                        column_names.push({
                            "sTitle": column_titles[i],
                            "mData": obj
                        });
                        i++;
                    });
                    var tb_aberto = $('#tb_aberto').DataTable({
                        "aaData": denunciaJSON,
                        "columns": [{
                                "data": "key",
                                "targets": [0],
                                "title": "key",
                                "visible": false,
                                "searchable": false,
                            },
                            {
                                "data": "data",
                                "title": "Data",
                                "targets": [1],
                                "width": "10%"
                            },
                            {
                                "title": "Denúncia",
                                "data": "indInfracao",
                                "targets": [2],
                                "width": "20%"
                            },
                            {
                                "title": "Local",
                                "data": "indLocal",
                                "targets": [3],
                                "width": "30%"
                            },
                            {
                                "title": "Placa",
                                "data": "placaVeiculo",
                                "targets": [4],
                                "width": "5%"
                            },
                            {
                                "title": "Veiculo",
                                "data": "especieVeiculo",
                                "targets": [5],
                                "visible": false,
                                "searchable": false,
                                "width": "5%"
                            },
                            {
                                "title": "Marca",
                                "data": "marcaVeiculo",
                                "targets": [6],
                                "visible": false,
                                "searchable": false,
                                "width": "5%"
                            },
                            {
                                "title": "Observações",
                                "data": "observacao",
                                "visible": false,
                                "searchable": false,
                                "targets": [7],
                                "width": "20%"
                            },
                            {
                                "title": "Status",
                                "data": "status",
                                "targets": [8],
                                "width": "7%"
                            },
                            {
                                "data": "provas",
                                "targets": [9],
                                "visible": false,
                                "searchable": false
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
                $('#tb_aberto tbody').on('click', 'tr', function() {
                    $("#video").attr('src', "");
                    btnAprovar.remove();
                    btnReprovar.remove();
                    btnGerar.remove();
                    var data = tb_aberto.row(this).data();
                    txtData.value = data.data;
                    txtDenuncia.value = data.indInfracao;
                    txtVeiculo.value = data.especieVeiculo;
                    txtMarca.value = data.marcaVeiculo;
                    txtPlaca.value = data.placaVeiculo;
                    txtLocal.value = data.indLocal;
                    txtObservacao.value = data.observacao;
                    var provas = data.provas;
                    var videos = [];
                    var x = 0;
                    for (var k in provas) {
                        videos[x] = provas[k];
                        x++;
                    }
                    if (videos[1] == null) {
                        $(video2).hide();
                    }
                    if (videos[2] == null) {
                        $(video3).hide();
                    }

                    $("#video").attr('src', videos[0]);


                    video1.addEventListener('click', e => {
                        $("#video").attr('src', videos[0]);
                    });
                    video2.addEventListener('click', e => {
                        $("#video").attr('src', videos[1]);
                    });
                    video3.addEventListener('click', e => {
                        $("#video").attr('src', videos[2]);
                    });

                    $('#selectStatus option').each(function() {
                        if (data.status === "em aberto") {
                            if ($(this).text() == "Em aberto") {
                                $(this).attr('selected', true);
                                $('#selectStatus').prop("disabled", true);
                            }
                        }
                    });
                    btnCapturar.addEventListener('click', e => {
                        $('#modalConfirmar').modal({
                            show: true
                        });
                        data.fiscal = localStorage.getItem("user");
                        data.status = "em analise";
                        const promise = gravar(data.key, data);
                        btnConfirmar.addEventListener('click', e => {
                            window.location.reload(false);
                        });
                    });
                    $('#modal_aberto').modal({
                        show: true
                    });
                });

            });
            $(document).ready(function() {
                var column_names = []; //Array com confi das colunas
                var denunciaJSON = JSON.parse(dataAnalise); //Parse no obj json, fa 
                if (denunciaJSON.length > 0) {
                    var i = 0;
                    var column_titles = ["Key", "Data", "Veiculo", "Denúncia", "Endereço", "Marca", "Observação", "Placa", "Provas", "Status"];
                    $.each(Object.keys(denunciaJSON[0]), function(idx, obj) {
                        column_names.push({
                            "sTitle": column_titles[i],
                            "mData": obj
                        });
                        i++;
                    });
                    var tb_analise = $('#tb_analise').DataTable({
                        "aaData": denunciaJSON,
                        "columns": [{
                                "data": "key",
                                "targets": [0],
                                "title": "key",
                                "visible": false,
                                "searchable": false,
                            },
                            {
                                "data": "data",
                                "title": "Data",
                                "targets": [1],
                                "width": "10%"
                            },
                            {
                                "title": "Denúncia",
                                "data": "indInfracao",
                                "targets": [2],
                                "width": "20%"
                            },
                            {
                                "title": "Local",
                                "data": "indLocal",
                                "targets": [3],
                                "width": "30%"
                            },
                            {
                                "title": "Placa",
                                "data": "placaVeiculo",
                                "targets": [4],
                                "width": "5%"
                            },
                            {
                                "title": "Veiculo",
                                "data": "especieVeiculo",
                                "targets": [5],
                                "visible": false,
                                "searchable": false,
                                "width": "5%"
                            },
                            {
                                "title": "Marca",
                                "data": "marcaVeiculo",
                                "targets": [6],
                                "visible": false,
                                "searchable": false,
                                "width": "5%"
                            },
                            {
                                "title": "Observações",
                                "data": "observacao",
                                "targets": [7],
                                "visible": false,
                                "searchable": false,
                                "width": "20%"
                            },
                            {
                                "title": "Fiscal",
                                "data": "fiscal",
                                "targets": [9],
                                "width": "10%"
                            },
                            {
                                "title": "Status",
                                "data": "status",
                                "targets": [9],
                                "width": "7%"
                            },
                            {
                                "data": "provas",
                                "targets": [10],
                                "visible": false,
                                "searchable": false
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
                $('#tb_analise tbody').on('click', 'tr', function() {
                    btnCapturar.remove();
                    btnGerar.remove();
                    $("#video").attr('src', "");
                    var data = tb_analise.row(this).data();
                    txtData.value = data.data;
                    txtDenuncia.value = data.indInfracao;
                    txtVeiculo.value = data.especieVeiculo;
                    txtMarca.value = data.marcaVeiculo;
                    txtPlaca.value = data.placaVeiculo;
                    txtLocal.value = data.indLocal;
                    txtObservacao.value = data.observacao;
                    var provas = data.provas;
                    var videos = [];
                    var x = 0;
                    for (var k in provas) {
                        videos[x] = provas[k];
                        x++;
                    }
                    if (videos[1] == null) {
                        $(video2).hide();
                    }
                    if (videos[2] == null) {
                        $(video3).hide();
                    }

                    $("#video").attr('src', videos[0]);

                    video1.addEventListener('click', e => {
                        $("#video").attr('src', videos[0]);
                    });
                    video2.addEventListener('click', e => {
                        $("#video").attr('src', videos[1]);
                    });
                    video3.addEventListener('click', e => {
                        $("#video").attr('src', videos[2]);
                    });

                    $('#selectStatus option').each(function() {
                        if (data.status == "em analise") {
                            if ($(this).text() == "Em analise") {
                                $(this).attr('selected', true);
                                $('#selectStatus').prop("disabled", true);
                            }
                        }
                    });
                    btnAprovar.addEventListener('click', e => {
                        data.status = "aprovada";
                        data.protocolo = gerarProtocolo();
                        data.senha = gerarSenha();
                        data.indInfracao = txtDenuncia.value;
                        const promise = gravar(data.key, data);
                        $('#modalConfirmar').modal({
                            show: true
                        });
                        btnConfirmar.addEventListener('click', e => {
                            window.location.reload(false);
                        });


                    });
                    btnReprovar.addEventListener('click', e => {
                        data.status = "reprovada";
                        data.protocolo = "";
                        data.senha = "";
                        const promise = gravar(data.key, data);
                        $('#modalConfirmar').modal({
                            show: true
                        });
                        btnConfirmar.addEventListener('click', e => {
                            window.location.reload(false);
                        });
                    });
                    $('#modal_aberto').modal({
                        show: true
                    });
                });
            });
            $(document).ready(function() {
                var column_names = []; //Array com confi das colunas
                var denunciaJSON = JSON.parse(dataFinalizado); //Parse no obj json, fa 
                if (denunciaJSON.length > 0) {
                    var i = 0;
                    var column_titles = ["Key", "Data", "Veiculo", "Denúncia", "Endereço", "Marca", "Observação", "Placa", "Protocolo", "Provas", "Senha", "Status"];
                    $.each(Object.keys(denunciaJSON[0]), function(idx, obj) {
                        column_names.push({
                            "sTitle": column_titles[i],
                            "mData": obj
                        });
                        i++;
                    });
                    var tb_finalizado = $('#tb_finalizado').DataTable({
                        "aaData": denunciaJSON,
                        "columns": [{
                                "data": "key",
                                "targets": [0],
                                "title": "key",
                                "visible": false,
                                "searchable": false,
                            },
                            {
                                "data": "data",
                                "title": "Data",
                                "targets": [1],
                                "width": "10%"
                            },
                            {
                                "title": "Denúncia",
                                "data": "indInfracao",
                                "targets": [2],
                                "width": "20%"
                            },
                            {
                                "title": "Local",
                                "data": "indLocal",
                                "targets": [3],
                                "width": "30%"
                            },
                            {
                                "title": "Placa",
                                "data": "placaVeiculo",
                                "targets": [4],
                                "width": "5%"
                            },
                            {
                                "title": "Veiculo",
                                "data": "especieVeiculo",
                                "visible": false,
                                "searchable": false,
                                "targets": [5],
                                "width": "5%"
                            },
                            {
                                "title": "Marca",
                                "data": "marcaVeiculo",
                                "visible": false,
                                "searchable": false,
                                "targets": [6],
                                "width": "5%"
                            },
                            {
                                "title": "Observações",
                                "data": "observacao",
                                "visible": false,
                                "searchable": false,
                                "targets": [7],
                                "width": "8%"
                            },
                            {
                                "title": "Fiscal",
                                "data": "fiscal",
                                "targets": [8],
                                "width": "10%"
                            },
                            {
                                "title": "Status",
                                "data": "status",
                                "targets": [9],
                                "width": "7%"
                            },
                            {
                                "data": "provas",
                                "targets": [10],
                                "visible": false,
                                "searchable": false
                            },
                            {
                                "data": "protocolo",
                                "targets": [11],
                                "visible": false,
                                "searchable": false,
                                "title": "Protocolo"
                            },
                            {
                                "data": "senha",
                                "targets": [12],
                                "visible": false,
                                "searchable": false,
                                "title": "Senha"
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
                        responsive: true,
                        "lengthMenu": [
                            [5, 10, 15, -1],
                            [5, 10, 15, "All"]
                        ]
                    });
                }
                $('#tb_finalizado tbody').on('click', 'tr', function() {

                    btnAprovar.remove();
                    btnReprovar.remove();
                    btnCapturar.remove();
                    $("#video").attr('src', "");
                    var data = tb_finalizado.row(this).data();
                    if (data.status == "reprovada") {
                        btnGerar.style.visibility = "hidden";
                    } else {
                        btnGerar.style.visibility = "visible";
                    }
                    txtData.value = data.data;
                    txtDenuncia.value = data.indInfracao;
                    txtVeiculo.value = data.especieVeiculo;
                    txtMarca.value = data.marcaVeiculo;
                    txtPlaca.value = data.placaVeiculo;
                    txtLocal.value = data.indLocal;
                    txtObservacao.value = data.observacao;
                    var provas = data.provas;
                    var videos = [];
                    var x = 0;
                    for (var k in provas) {
                        videos[x] = provas[k];
                        x++;
                    }
                    if (videos[1] == null) {
                        $(video2).hide();
                    }
                    if (videos[2] == null) {
                        $(video3).hide();
                    }

                    $("#video").attr('src', videos[0]);

                    video1.addEventListener('click', e => {
                        $("#video").attr('src', videos[0]);
                    });
                    video2.addEventListener('click', e => {
                        $("#video").attr('src', videos[1]);
                    });
                    video3.addEventListener('click', e => {
                        $("#video").attr('src', videos[2]);
                    });
                    $('#selectStatus option').each(function() {
                        if (data.status == "reprovada" || data.status == "aprovada") {
                            if ($(this).text() == "Finalizado") {
                                $(this).attr('selected', true);
                                $('#selectStatus').prop("disabled", true);
                            }
                        }
                    });
                    $('#modal_aberto').modal({
                        show: true
                    });
                    btnGerar.addEventListener('click', e => {
                        var doc = new jsPDF();
                        doc.setLineWidth(0.1);
                        var img = 'data:image/png;base64, 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06ZN27dv361bt8MPP/zEE08cOHDg0KFDZavKP6w9XgBIHAErMvUuS3lbTlq2bNlvfvObU089VeJUgyK1atVK/sV77rnn3//+t/ZxAEAiCFiRafVRv7t4/dSDjn9T88477wwbNmzXXXctNldtrby8XJLWQw89VO+T/vSnP43zRLU97FFHHRX/KKyMR2UYTZo0adOmzR577HHAAQccfvjhJ5xwwmmnnXb++edfeeWV119//YQJE+bPnx9rrRSv2rU9NS+//LLWSB555JE4ZyydQYaqnaU0n9oFxSYNAlZk6u3TpxZeNBdOjvoAkvfiiy8OGDAgiStXjx497r///jqeOubz1vawngesKHbfffdTTjll5MiR48eP//TTTy0sozp5GLBat269bNmyks9YOoMMEbDiLGYCVu0c6Z0ujMFNLpwZRxZJAhYuXDh06NCkr18Ss/7617/WOIBDDjkkziPXdlwErGIdeeSRd99994IFC6ytrS15GLDEWWedVfIZS22QDQhYBKykuNM1HRmGgxw5M+4sFUt+//vfd+7cObWr2P/8z/9sPYaddtopzmPWdmgErNK0bNlyyJAhzz//vM11tomfAUs8+uijpZ2xNAdJwIqzmAlYtXOqZbozEqe4c1qcWi0xrFy58kc/+lG6F7HA2WefXXUYK1asiPmAtR0gASumQw455Omnn7a45LwNWG3atPnyyy9LOGNpDpKAFWcxE7Bq51q/dGckTnHntLi2YIo3Z86cAw88MN0r2LdOPfXUwkjef//9mI9W2zESsKy46KKLbK06bwNWg63+rogozRESsOIsZgJW7Vxrlk4Nxh1OnRbX1kwxZs6cuf3226d7+aqukLHGjx8f86FqO0wCli1dunRZvHhx/IXnc8ASjz32WLFnLM3hEbDiLGYCVu0cbJZODcYRTp0TB9dMNK+++mq6F65aXXXVVTKeO+64I+bj1HakBCy74n/N0POAteOOOy5durSoM5bm8AhYcRYzAat2bjZLpwbjAqdOiJtrpj7r169P96pVD7mmX3bZZTEfpLaDJWDZVVZWtmbNmjjLz/OAJQYOHFjUGUtzbASsOIuZgFU7Nzula+NR59oJcXPZ1OnEE09M96pVj+OPP75Pnz4xH6S2gyVgWTdgwIA4y4+AJR5//PHoZyzNgRGw4ixmAlbtnO2Uro1Hl2tnw9llU4t777033UtWJPvuu2/MR6jteAlYSRg2bFjJK5CAJdq2bbtkyZKIZyzNgRGw4ixmAlbtnG2TDg5JkYNnw9mVs5WJEyeme72Kqry8POYj1HbIBKyE/OUvfyltERKwQueee27EM5bmqAhYcRYzAat2zrZJB4ekyMGz4ezK2UrMu6W7rLZDJmAlpOpdNopCwCp44oknopyxNIdEwIqzmAlYtXO2TTo4JEUOng1nV86WnnvuuXQvVqmq7agJWMl57bXXSliHBKyCnXbaKcqdL9IcEgErzmImYNXO2Tbp4JAUOXg2nF05Wzr33HNTvValq7ajJmAl57zzzithHRKwqopyDtMcDwErzmImYNXO2Tbp4JAUOXg2nF05Vaxbt6558+bpXqxSVduBuxOwjqqJraer8cFj/rxjFPPmzSt2KToVsGqU8sCefPLJes9YjeKsn9oek4AVZzETsGrnbJt0cEiKHDwbzq6cKkaPHp3C5amsrOzkk0+W3So947nnnnvwwQdvvfXWQYMG7b333kk/dVFnQ7qIreeNc2lKYRgLFy6cNGnSvffee9pppzVp0sTW0xX86U9/Kvnwq7E4qjjDSD9gtWvXbtGiRSUMtVevXiU/6dZxs0YlPLLEPuuPmdoTEbASE79NJtQpXRuPLtfOhrPLZktJv5Cz8847//znP581a1ZtA/jHP/4hu7h9+/YJDaCos+FPwKrq008/PfXUU209Y2j48OElH341FkcVZxgqL7DJHyElDPXoo48u+RkJWDUiYCXGzU7p2njUuXZC3Fw2W+nUqVOsi1mdunXrVke0qmrBggUJNbCizoafAStk9/z/8Ic/LPnwq7E4qjjD0HoHM+I3Cqs69thjS346AlaNCFiJcbNTujYeda6dEDeXzVYaNWoU62JWu+jpqkAu7tZfUSt2ALaeN3MBS1xxxRW2nne77bYr+fCrsTWkBtkMWO3bt//iiy+KGupxxx1X8tMRsGpEwEqMlU5pt1k6NRhHOHVOHFwzNZk7d26sK1mdRo8eXdqo7L5dVdRTex6wFi9e3LlzZ1tPvXr16pLPQFW2xtMgmwFLDB48uKihnnDCCSU/FwGrRgSsxDjYLJ0ajCOcOicOrpmaTJ48OdaVrE6zZ88ueWAWM1ZRz+t5wBKjRo2y9dSlfUB7a7bG0yCzAatBkb9RGOdHRQlYNSJgJcZWs7TVL90ZiVPcOS2uLZjajR07NtaVrHb7779/nIFJb7b14bCinpeAJbHY1lN/8sknJZ+BqmyNp0GWA9Yuu+yycOHCiEM96aSTSn4iAlaNCFiJsdgv47dMd0biFHdOi1OrpT6/+tWvYl3JarfjjjvGHNtdd91lZSRFPSkBS9h6l3DGjBkln4GqrAwmFGcYugFLDBkyJOJQTz755JKfhYBVIwJWYuy2zDib3JFhOMiRM+POUonm7rvvjnUlq9PUqVNjDm/PPfeMP4yinpGAZeK9wVRVaT+YszUrgwnFGYZ6wBJjx46NMtQBAwaU/BQErBoRsBJjvWuWts8dGYaDHDkzjgyjGE8++WSsK1mdvvvd78Yc3mWXXRZ/GEU9IwFLXHDBBVae+p133in5DFRlZTChOMNwIWDtuuuuCxYsqHeocT7CSMCqEQErMUk0zmK3ekJjyEHGcuTMuDCG4r322muxrmT1Ke02iQVvv/12/DEU9YwELGMvScT5lkNVVgYTijMMFwKWkPhb71BPO+20kh+fgFUjAlZikmvh9TbRpJ860zHLhZOT8Xn517/+FetKFkH//v0/++yzkke47bbbxhxAUU+Xv4B1/fXXF/vstl7BWr58eclnoCorgwnFGYYjAUs8+uijdQ/1Jz/5SckPTsCqEQErMek38tSekSqqFJdEMlauXBnrShZNy5YtZZ9GeWtja/E/cF3U0+UvYJUwjD59+sR/3p122qnkw68m/mAK4gzDnYDVoUOHun9L+8wzzyz5wQlYNSJgJUa9r1PeVvK6desW62IWWfv27WW3FvvV/cMOOyzm8xb1dASsjz/+uLy8PP7zDhs2rOTDryb+YAriDMOdgCXOP//8OoZ69tlnl/zIBKwaEbASo95lKW8reSm3jUaNGvXv3/+BBx5YvHhxlOG9HFtRZyN/AavYtwhtrYcXX3yx5MOvxsp4QnGG4VTAEo888khtQz3nnHNKflgCVo0IWIlR77KUt5W8N998M9bFrFQ77LDDwIEDn3rqqbVr16ZwmBHlL2AVNYxZs2Ztv/328Z80/hdIq4o/noI4w3AtYO2+++5z586tcajnnXdeyQ8bMWAl8deOrTNTb8BK4U81AlZk6l2W8rZSkdq7hDWSPnHppZc+//zz6Rxs3TwPWHE+HF1VHS+ulMDKkEJxhuFawGpQ+61HBw8eXPJjFpskLLJ1WuoNWCkgYEWm3mUpbysVQ4cOtXVpi2Offfb52c9+NmnSpHSOukY+B6yf//znVp7x+OOPL/nAa2RlVKE4w3AwYImHH35466Gef/75JT8gAcsKAlZk6l2W8rZS8cEHH8S/G4JFBxxwwPDhwydPnpzO4VflZ8B65plnpCdZebpWrVq9+eabJR94jawMLBRnGG4GrI4dO86ZM6faUC+88MKSH5CAZQUBKzL1Lkt5W2kZMWKEraubRYcccohs8I8//ji185C/gLX1h9yXL18+a9asF154YfTo0TJIK79HVJBEe7Y4vDjDcDNgicGDB1cb6sUXX1zyoxGwrCBgRabeZSlvKy1Lly7t0qWLrQucXeXl5YMGDXrppZdSOA/5C1hpSqg3WxxhnGE4G7DEQw89VHWol156ackPRcCygoAVmXqXpbytFI0aNcrWBS4hRx999B/+8IdEv3VIwCrN4YcfPn/+fHvzsAWL44wzDJcDVqdOnT7//PPCUON8qpKAZQUBKzL1Lkt5W+m65JJLbF3jkrPXXnsl974hAasEgwcPXrNmjb1JqM7iUOMMI2bAOvLII20dRY2q/u7nT3/605Ifh4BlBQErMvUuS3lbqTvppJNsXeYSVV5efvHFF1uPWQSsovTq1eu5556zd/prZnHAcYYRM2ClMKd//OMfw6EOGzas5AchYFlBwIpMvctS3pYGW18oS0Hr1q1Hjhy5cuVKW8dOwIqoX79+Y8aMsXXa62Zx2HGGETNgxX+Eeu2xxx7//ve/Tbw7bhCwrCBgRabeZSlvS8lVV11l62KXgv3226/wt3tMBKw67LTTTn369JHjmjlzppWzHZHFQ4gzjPgBS/zgBz+wdSw1Ou+88+RZhg8fXvIjELCsIGBFpt5lKW9Lz7hx42xd79JxySWXxD9qAlaNunXrNnjw4NGjR8+aNSv+SS6WxQOJMwwrAWvSpEm2jqU2Y8aMufbaa0v+1wlYVhCwIlPvspS3peqNN974zne+Y+uql4JDDz005iEnegMqlWFY17t370cffTTmeS6KxcHHGYaVgCWuu+46W4dTo06dOsV5CgKWFQSsyNS7LOVtaVu5cmWctxtUxDleXsGK6OCDD37qqafinOroLA47zjBsBSxxxBFH2DqiGp177rkl/7sELCsIWJGpd1nK23LDa6+9dvzxx9u6/CWtW7duJR8pAaso559/fvip6kRZHHCcYVgMWBMnTrR1RNYRsKwgYEWm3mUpb8slDzzwwH/913/Zuggm6tRTTy3tGAlYxdpzzz2TbskWRxtnGBYDlvjlL39p66DsImBZQcCKTL3LUt6We55//vmzzjrL1qUwOaVlLD6DVZpEu7LFccYZht2AJQ4//HBbx2URAcsKAlZk6l2W8rZc9cEHH4wYMcLZny8M3XnnncUeFwGrZMm9V2hxkHGGYT1gvfTSS7aOyyIClhUErMjUuyzlbblt3bp1Dz30UJ8+fZo0aWLr4mhRy5YtZ8yYUdQR5S9gyRVy6NChAwcOPOGEE7p27WrrYbe21157rVixouRDroPFQcYZhvWAJeSvFFuHZgsBywoCVmTqXZbytjJi/vz5Dz/88KBBgzp16mTrKmlF//79izqQXAasqo8smXj69Om33HLL9773PVtPUXDKKaeUfMh1sDjCOMNIImCJnj172jo6KwhYVhCwiqHeaCkPK5smTZokf5e70zaKusl77gNWVbfddputZyl4/PHHSz7q2lgcXpxhJBSwXnzxRVtHZwUBywoCVjHUey3lYWXcRx999Jvf/GbAgAE77LCDrUtnCU4++eToY/YqYInRo0fbeqKQBOuSj7o2FocXZxgJBSwR58br1hGwrCBgFUm93VJeVfJetiHKEy1btmzcuHEXXXTR3nvvbesaWpTFixdHPye2njQTAUv07t3b1nOFHnzwwZIPvEYWxxZnGMkFLPH973/f1jHGRMCygoBVPPWmS3lSKS3nuB544IFin/S1116TPfvd7343/rNHN2rUqIjD8zBgycmx9VyhE044oeQDr5HFscUZRqIBy51vFBKwrCBglUS99VK5r/TWclwjRowo+dnffPNN2bzpvHsY/YLrYcB64403bD1XQfSXDKOwOLA4w0g0YIlrrrnG1mHGQcCygoBVKvUGTOW4Ul3IcZ111lkxx/DRRx9ddNFF8UdSty5dukQcT/7u5B5lGLaeq+C5554r+dgTHV6cYSQdsEQSX+0sFgHLCgJWPOqdmMpZKSzhuHr06GFlJJdcckn8wdShWbNmEUfiZ8Bq06aNracLPfTQQyUf+9YsDizOMFIIWC78RiEBywoCliXqjZnKdGmuXAvuv/9+K4PZf//9rYynNsuWLYsyDD8DlvUvH9xxxx0lH/vWLA4szjBSCFhi+PDhtg62NAQsKwhYCfCsQ+eBx1Nm5Vpm60UsCWpWxlObDz74IMow8hewonwUzPpNy6699tqtj6jkL6JaHFhp0xFKJ2CJww47zNbxloCAZQUBKwEed+us8njKbF3OBg0aFH8wd955p63x1Gjq1KlRhuHhh9xFv379bD1d6KKLLqr2FNLzavwnCVhbszj7JSBgWUHASoDH3TqrPJ4yW5ezBjbeKDz++OMtjmdr8+bNizKM/AWsKMOQiGzr6UKnnXZatacgYBX1XFdffbWtQy4WAcsKAlYCPO7WWeXxlNm6nIXuu+++kkfy1ltv2R1MNWVlZRFHkr+AFeUK+fOf/9zW04WOPvroak9BwCr26VK+V1wBAcsKAlYCPO7WWeXxlNm6nBUcd9xxTz75ZLHD+NOf/rTzzjtbH0xVe+65Z8TB5C9gRRnGLbfcYuvpQh06dKj2FASsYp/ulVdesXTQxSFgWUHASoDH3TqrPJ4yW5ezarp16ya7MspleubMmVdccUVCw6iqV69eEc9J/gJWlCvkPffcY+vpCmbPnl31KTp27FjjP0bAqoPKG4UELCsIWAnwuFtnlcdTZutyVpv27dv369fv4osv/tWvfvXwww/LhXvcuHG//e1vb7rppv79+3fo0CHpARQMHDgw4jnJX8CKMowHH3zQ1tMVVP1Y3qxZs2r7xwhYdTv00ENtHXtEBCwrCFgJ8LhbZ5XHU2brcua+4cOHRzwn+QtYUa6QEnxtPV1B1ft31BFNJk+eXO/wLI6q5Bmp+yiSe+pXX33V1rFHRMCygoCVAI+7dVZ5PGW2Lmfue+WVVyKek/wFrCjD+Otf/2rr6ao68MAD5fpc9z0gZs2aVe/wLA6p5BkxSgHLpH7rUQKWFQSsBHjcrbPK4ymzdTlz3A9/+MMaD7+2j10nrcaRbM3W09X44NU60Lx582w9XbEWLFhQGEbMBFOyrSPFf9cizrPU9phRPrB4yCGH2DrYeiUasLQ2XVXpxC8CVgI87tZZ5fGUpXtZU/O73/2uxsN3J2ClP4ate8x3vvOd9Ichvv7668IY3AlYKa+NejPNa6+95s5g4iBgJYqAldtunVUeT1m6lzUdHTp0WL58eY2HT8Cq6pprrkl/GG3atKk6BgJWHVKbIAKWFQSsBHjcrbPK4ylL97Km42c/+1lth0/Aquq5555Lfxg9e/asOgYCVt0OPvhgdwZTGgJWoghYue3WWeXxlKV7WVPQsmXLGTNm1Hb4BKyq/vOf/yR9u9etnXvuuVXHQMCq2+TJk90ZTGkIWIkiYOW2W2eVx1OW7mVNwZ133lnH4ROwqkn522oNtrp6E7Dqde2117ozmBIQsBJFwMptt84qj6cs/qWqe/fu8R8kIf3796/78AlY1fzzn/9s1qxZmsOYOXNm1QEQsKLo0aOHO4MpFgErUQSs3HbrrPJ4yuJfqmbNmqX1k7R1a9myZb2HT8Da2iWXXJLaGPr161ft2QlYUUyZMsWdwRSLgJUoAlZuu3VWeTxl8S9V8iCzZ8924aJZzYcffljv4ROwtvbee++1atUqnTGMGTOm2rMTsCIaMWKEO4MpigvXCgJWXQhYbnbrrPJ4ymJep3beeefwcZYsWXL88cfHfDRbOnfuvHjx4iiHT8Cq0ahRo1IYQJ8+fbZ+agJWdMl9o5CAZQUBKwEed+us8njKYl6nJFQVHmrNmjWnnHJKzAeM76qrrop++ASs2px//vmJPnvjxo3feOONrZ+XgBWdnEB3BhMdAStRBKzcduus8njKYl6ntv4F5VGjRrVv3z7mw5ZMnr2owydg1aFPnz7JPXttF20CVlGuu+46dwYTEQErUQSs3HbrrPJ4ymJep37zm99s/ZiffPLJeeedF/ORi3XGGWe8+eabxR4+AatuDz30UBJPfemll9b2jASsYiXxG4UELCsIWAnwuFtnlcdTFvM69cwzz9T2yI899th+++0X8/GjOPbYYydMmFDa4ROw6jVp0qS99trL4vNKFK7j6QhYxZo6dao7g4mCgJUoAlZuu3VWeTxlMa9T06dPr+PBv/zyy5EjR+65554xn6U2hx566NZfQysKASuKBQsWyDU2/ju/e++99z333FP3cxGwSmD9pBGwrCBgJcPLVp1tvk5ZzOvU/Pnz632KlStXSls97LDDYj5XQbdu3X7xi19MmTIl/uETsKKLE7M6d+4sUfs///lPvc9CwCqN3XvREbCsIGAlxr9WnXlMWcJmz5794IMPnnvuufvss0+xF8S99957wIABstPff/997ePw2ooVK6T73nbbbT/5yU/qfeuwTZs2Q4YMefbZZ7VHDSggYCWMVp0tzFdavv7666lTp953331XX331xRdffNZZZ/Xr10/+rOzbt+/pp58uXfmKK64YMWLEH//4x3feeWfdunXa40XNZGrmzJkzffr0CRMmjB49+uabbx41atQzzzwjsxbxVmRAXhGwAAAALCNgAQAAWEbAAgAAsIyABQAAYBkBCwAAwDICFgAAgGUELAAAAMsIWAAAAJYRsAAAACwjYAEAAFhGwAIAALCMgAUAAGAZAQsAAMAyAhYAAIBlBCwAAADLCFgAAACWEbAAAAAsI2ABAABYRsACAACwjIAFAABgGQELAADAMgIWAACAZQQsAAAAywhYAAAAlhGwAAAALCNgAQAAWEbAAgAAsIyABQAAYBkBCwAAwDICFgAAgGUELAAAAMsIWAAAAJYRsAAAACwjYAEAAFhGwAIAALCMgAUAAGAZAQsAAMAyAhYAAIBlBCwAAADLCFgAAACWEbAAAAAsI2ABAABYRsACAACwjIAFAABgGQELAADAMgJWtjSgUi8AW9m40VRWBlX47/Kfa9eaefPMtGlm/Hhz773m2mvN4MHm5JNNr17mkEPMPvuYjh1Nu3amVSvTvLkpLzdlZaZRI/N//k9Q8l/kf8r/Uf5f8g/IPyb/sPwr8i/Kvy4Pcv75wQPKw8qDy1PIE8nTFZ5ahOMJ/zvgAAJWhqhHDW8L8FshxxT+y9KlQcr54x/NsGHmxBPNYYeZ3Xc3221nGjb8tsLkVGM1aFBX1fEvVn18eTp5Unnq/v2DYchgZEgysK1HC2ggYGWCesKgGmivASAtYTQJa9UqM2eOmT7dPPqouekmM2iQOeIIs9tuZpttqueeKMnJblV76rBkYDI8GaQMVQb8+OPB4OUQ5ECqHheQPAJWJqhnC6qB9hoAkhRmDvnPigqzeLF5/30zblwQUE491Rx4YPC2XVEvQelWtaHK4OUQ5EDkcOSg5NDkAOUwC4cMJIOA5T71YEEVCsiRwkeXNmwwixaZqVPNr38dfOCpY0fTrNkWb/OpZyZbr3VJyaHJAR53XHCwcshy4HL4hQ+TAfYQsNynniqoQgHZV/hw0vLl5oMPgo+NH3NM8LZaeXl+ElXEvCWHLAcuhy8nQU6FnJDCh7eA2AhY7lNPFVShgMwKc8P69WbGDHP77cFbZl27mm23zca7fkmHLSk5FXJC5LTcc09wiuREkbQQDwHLceqRgqpWQKaEKWHdOvPaa2bkSHPCCaZDh+CGCN4mqnrzlpwcOUVyouR0yUmTU0fSQkkIWI5TzxNUtQKyoJCr3nrLXH998Mmqtm2/vemUeo5xvAq35pKTJqdOTqCcRpIWikTAcpx6nqCqFeCwwuerPvoo+BB3x46+vwNoK2xJ7btvcErlxPI5LURDwHKcep6gqhXgpLDlL1tmHnnEHHWUadyYXJVI0pITK6dXTrKcamIW6kTAcpx6nqCqFeCYsM2PHx/cUX277chVKSUtOdVywuW0E7NQCwKWy9TDBFVjAQ4I+/qKFcFnsffai7cCdWKWlJz8O+8MJoKkhS0RsFymniSoGgtQFf4U4IQJ5rzzTIsW5ConkpZMhEyHTEr4Y4gAActt6kmCqrEADeGn1+fPN2PHmt69TdOmRCuHKpwLmRSZGpkgmSZ+Z9p7BCyXqScJqsYCUrdhg5k9O/g1vQ4dNt9tQT1SUDVWeH8HmSaZLJkyMpbHCFjOUo8RVB0FpEU69Jw55sorTbt2m3/KRj1DUPVW+FM8MmW//GUwfcQsLxGwnKWeIag6CkhY+Inpt982F15odtqJXJXVkomT6ZNJlKnkU/CeIWA5Sz1DUHUUkJiwDc+cGbxqtcsufNAq8xXOoEylTKhMKzHLGwQsN6kHCKreAhIgrXfePPOLX5jOnYOP8qiHA8piyYTKtMrkyhSTsTxAwHKTenqg6i3AKum4X34Z/Oxd8+a8ZJXnksmVKb799mC6iVm5RsByk3p6oOotwJLwPaOnntp8v1D1BEClUOEdSmXSeccwvwhYblJPD1S9BcQWNtfXXzc9evBZK+8qnHGZelkAxKw8ImC5ST09UPUWEM/69WbaNHPOOaasjGjlb8nUywKQZSCLQZYEcoSA5SD16EBFLKAkGzeazz83t9xi2rQhWlFByTKQxSBLQhYGL2XlBQHLQeq5gYpYQJGkd65fb8aPN9/7Hjdkp7ao8BbwsjBeeilYJMSs7CNgOUg9N1ARCyiGtMy5c83ZZ5vycqIVVXPJwpDlIYtElgoZK+MIWA4iCiSBswpVX39tnnzSdO0a/IKKehenHC9ZJLJUZMHIskFmEbBcw2stCeHEQkl4W/a+fU3TprxwRUUtWSqyYGTZhDd/RwYRsFxDDkgIJxapk75YUWHuust06kS0okopWTayeGQJyUIiZmUNAcs15ICEcGKRLmmHX3xhBg/mE1dUrAo/lSULSZYTGStTCFiuIQQkh3OLtEgjnDjRtG1LtKLslCykrl2DRUXGyg4CllN4lSVRnF4kT/rf6tVmyBBeuKIsV/hSliwtWWDErCwgYDmFBJAoTi8SJm3v7383hx5KtKKSKllassBkmZGxnEfAcgoJIFGcXiRGut2KFeb++02LFqQrKtmSBSbLTBabLDlilsMIWE6h/SeNM4xkzJtnhg41zZrpd1/Kk5LFJktOFh5cRcByB6+vpICTDNs2bjSffmr69OGFKyrtkiUnC0+WH69jOYmA5Q56fwo4ybBKGtuECaZdO9JVDb0/PCfynw0bBr+yF5b893rvZR/+M1X/lcJDcZ63Ps+y/F5/nYzlIAKWO+j9KeAkw55168zvfmeaN9fvsuo9vsE3v1UchqeyMtOqldl9d7Pvvuagg8zRR5szzzRXXmluvdX84Q/m6afNCy+YV181U6aYadPM9OlByX+R/yn/x+efD/4B+cfkH5Z/Rf5F+dflQbp2DR5QHlYevEGDzQms8NTqJ0G3WrQIlqIsSLiEgOUIGn9qONWIbeNGs3ixueCCzc3eqwpfkSr8p5wBiT79+5uLLzY332zGjjWTJ5v33jP/+pdZtMisWmUqKzefMfkvhZL/WajCKS1UtX9SyH9ZuTJ4QHlYeXB5CnkieTp5UnnqLl2CYVQbmPqJSrnkDMiClGXJS1nOIGA5gq6fGk414gk/dDVggNlmG/22mk6F782F1bSp6dHDnHOOufHG4KWmd981n322+etsYTYKG3y1/GTltBcesPBE4Zc3P/kkGIYMRoYkA5PhhT/7WCj1E5hOyYKUZSnTQcZyAwHLEXT91HCqEYO0ro8/Dl6zyX3bDqNJ+HGoli2DD1Nfd13wLt6GDZvDjfyn/HdHerkMo9rAZKgy4N69g8GHR+FD2Apv+C5L1JF58RsByxF0/dRwqlEqaVrStnfeOc99upCrmjY1PXuaa64x77zz7StGhReoHFdtwHIIciByOHJQuU9acmiyRGWhZmKmco2A5Qi6fmo41SiJtOonngg+0p7L3lyIHZ07mxtuMG+9FXxiupBRsq5wIHJQcmhygB06fBsl1U++9ZLjkoUqyzUHc5dlBCwX0PJTxglHkdauNbffnsMvDBY+pbTHHuaOO4IfYCl8timvwqPbsCE4WDlkOfC8flRLlqssWjKWHgKWC+j3KeOEoxirV5vLL9/8PTX1rmmr5FjatDFHHWV+/Wsza5b9z6S7r3DIcvhyEuRUyAnJ2RTLor3uumABQwMBywX0+5RxwhHZmjXmqquCWy6p90srHVdqm23MgQeaYcPMpEk+5qqtFU6CnBA5Ld26BacoN69pydKVBSzLGKkjYKlLqNnT7+vAOUcE0nHlT3+5tuTjYzoSF1q1Cr5VN3q0WbqUXFWD8Jx88UVwiuREyenKR8aSBSzLWBYzM54uApY6Or0KTjvqJK1o1Spz9tmZT1fhKzGdOgX3iPr0U4durOCswoe05HTJSZNTl4NXs2QZy2KWJc3sp4iApY5Or4LTjtpJE1q40JxxRobTVeHdwH79zJ//bJYsobOWQk6anDo5gXIas/6+oSxmWdKysFkJaSFgqaPTq+C0oxZhuvrxj7N6o/YwBDRvHhzCxIlm+XLeDYwlPHtyGp99Njil4X06MhqzZEnLIZCx0kLAUkenV8FpRy1Wrgz+0M9uuiovN6edFkSrws/XIL7Cz/LIiZXTKyc5uxlLlrcsciSPgKUroTZPp68XZx41Wb06q5+7CqPVySeb2bPJVQkKz62cZDnVGY1Z4eexuHdD8ghYumjzWjjz2MqaNeaCC7KXrsIe37t3cI9yolU6wvMsJ1xOe2EKMlTh9wq5d0PCCFi66PGKOPmoQv6gv+qqjHXK8MNAPXtu/rlApC/8ocN99sneB7MkY8mC53WsJBGwdNHjFXHy8Y3KyuCG19m6m6i08x12MH/8I69aKQvPv0yETEe2MpYseFn2/JZOYghYihJq8PT4iDj/2EQazO23Bz8qot7woker3XYzw4ebuXOJVq6QiZDpkEmRqclQzJJlz+8VJoaApYgGr4vzj0198YknTLNmmWmKTZqYk04yM2bwwpVzwhmRqZEJkmlSXypRSpa9LH7ZAqylBBCwFNHd1TEFfpOmMmVKcGcj9T4XsRd27mz+9jdTUaF94lAnmSCZJpmsrKR22QKyEchYthGwtPDyiQuYBY9JO/n4Y9OuXQa6YHjj0AsuMPPn0wWzQaZJJkumrHHjbCww2QiyHVhdVhGwtNDaXcAs+Eoayaefbv7yl3p7q7cOP9y8+qpZv177rKFIMmUvvhhMn/oSipKxZDvIpiBj2UPA0kJrdwGz4CVpIYsWmQEDMpCuGjc2l10WjJa2l1HhYpNJlKlUX071ZizZFDJaWELA0kJfdwQT4Z9Vq8yFF7r+YzjS7Xbd1Ywda9au1T5fiE0mUaZSJtTxTC+bQrbGunXa5ysnCFha6OuOYCI8U1lpRoxw/eUEacN9+pg5c7RPFqySCZVpdTxjyda4/35u3GAFAatkCTVmimqQ+mL2xsaNZvJk06KFfhurI1qVl5u77uJVhHySaZXJlSlWX2l1lGwQ2Sa8Kx0bAasE6t2X8qRgVfjBdpe/NigD69CB373JufDXdVx+uzD8UiEfeI+NgFUs9aZLeVWwRFrFvHmmb193u1qTJub0082yZXS1/JMp/uyzYLqdvR+pbBPZLLJlWI0xELCKot5uKQ8LNqxYYa64wt101axZ8KtwMkj6mT9kumXSZerVl19tGUu2jAwSpSJgRafeaClvC/FUVgaf23Wzk0kba9vW3Hcf0cpHMuky9bIA3Iz+smX4wHsMBKzo1Lss5W0hBulhs2YFn9t1sIeFH3b58EPtcwRVsgDc/GigDEk2jmwf0n9JCFjRqXdZyttCDKtXm0MPdbF7SXXvHnx1n+7lOVkAsgxkMagvyBozlmwf2UQoHgErOvUuS3lbKFVlpRkyxMV0JUM680yzdCnpCgFZBrIYTj/d0bUqm4g3CotHwIpOvctS3hZKIk1r4kRH7zlUVhZ8uoV0haoWLTKXX24aNtRfn9VKNpFsJZZrkQhY0al3WcrbQvGkGXzxhdM/59yqlRkzRvs0wTHLl7v4w4XhT0HLhiJjFYOAFZ16l6W8LRSvoiL4WRIHXwyoVlddRdPCFmQ93HRT8Bqn+uKsWrKVhgwJthUiI2BFp95lKW8LRZIWddddGUhXDTa9NtC/v1m/npiFb8liuO02524s0rRpsK1YqJERsKJT77KUt4ViSAN4/33TqZN+Q4pYEgQPPth8+aX2iYNjRo0y226rvz4LJX8MyLaSzUXGioaAFZ16l6W8LRRjzRqnfxKnttZ16KFm6lRaF7bw+OPOZSzZXLLFEAEBKzr1Lkt5W4isstI89ZRz761ErL33Nm++yffhsYVRo4L35tQXZ6Fkc8kWY5VGQMCKTr3LUt4Wotm40cyd6/Q3B+suGfYuu5gJE/goMb4Vfh7Lnc+8h98olI3Gq631IWBFp95lKW8L0axbZ846Kxufba+je5WXm9//PjgWICRRZuRIh+7dIFtMNhpLtD4ErOjUuyzlbSECaUIvveTWmyklV7NmwRf1+aQLCmR5X3aZQ388yEaT7caLWHUiYEWn3mUpbwv1kQv955+b730vq28Obl1lZebHPzarVmmfWThj+XIzdKgrK1yGIdtNNh0Zq3YErOjUuyzlbaE+FRXmlltMo0b6jcduD+vTxyxYoH1y4YxFi4LfK1RfmWHJdpNNx+cFa0fAik69y1LeFuokf0NPm2Zat3blj3u7GWvXXc28ebxOgM2WLDHduzux1GUMsulk67E4a0HAik63lar3eM/LzVWBTSorzcCBTrSchKpNG/PRR7QxBGQZzJljdt7ZiQUvY5Ctxy0bakHAis6RDqoeNbwqR+YFtZOL++TJDn3BKqE21qqVeeIJMhYCsgwkcLdtq78ypWTryQZkZdaEgBWdO71TPXb4UE7NC2onV/YePZz4az7pjLXddsEvwQFm07K/7z4nbqgrK1M2IC9i1YSAFZ1rjVM9guS4XJsX1EIu63fe6dB315OuJk3MtdealSt5wQDBGvjlL4O7pqkvS9mA3Nu9JgSs6BzsmupBJJfl4LygJtJgvvzStG+f/5evqlajRmbQoOCTzsCKFcGXCtXXvwxgr72CzUju3xIBKzoHW6Z6Fslf2eLmqPJFrua33+7Ry1dV+9nAgcEtiIDPPgu+Z+rCmpTNSMDaEgErOmf7pXooyU05Oy/YilzK580z226r31q06qCDzHvv0dJ8Jwvg3Xf13yiUgCWbkfuJbImAFZ2zzVI9l+SmnJ0XbEWu47/4hf6bI7q1227mhRdoab6TBXDXXfp7QQYgW5LVWAUBKzqXm6V6NMlBuTwv2JJcxGfONJ0760cc9ZbWqpX585+15wPa1q0zJ5ygn7FkS8rGJGN9g4AVncudUj2dZL0cnxdsSa7gP/1p3n4YJ07Guu8+uprXZPbnztX/MJZsSdmYLMVvELCic7xTqmeUTJfj84Iq5PL99ttml130w407JTHr+uv5VTivyb545BH9vzpkY8r2JGNtQsCKzvE2qZ5RMl2OzwuqqKw0F16o/26Ia9WwoTnvvOAWWfDW2rXm8suV16FsTNme3BNrEwJWdI63SfWMkulyfF5Qxeefm512ImDV3Nt69jTLlvH6gadk3hcvNkccobk75Klle3IPkU0IWNE53ibVM0p2K2nujzA7wrtXk67qqAMOMAsXkrE8JfP+t78p/zSnbE/ZpKxAAlYxHG+T6jElu5U090eYEXLJ/ve/g1u3q4cYl0va2y67mEmT+EiWp9avNxdcoPxHiGxS2areZywCVnSOt0n1mJLdSpr7I8yIykpz003Kt27PxItnMsjddgt+Hg5+mj9f+SYmskllq3r/SSwCVnSOt0n1mJLdSpr7I8yC8NbtHTpoRpymTU2vXsrvv0SvZs3MPffwKoKPZNJffDH4aXCttSebVLaq9zd2J2BF53ibVI8p2a2kuT/CLJAr9dixmt9Cl55x0klm1SozYoTZZhv9/BSlysrMz38evGcE31RUmH79NP8aka0qG5aARcCKxvE2qR5TMl2OzwuMWbrUHHusWsMI/yIPf/tP8spvf2tat87G24UNG5ozzwy+WgivyEKV5SqLVmvhye6QDSvb1mMErOgcb5PqGSXT5fi8eE+6xYQJwTt0Wt1C/hy/+upv/xyvqDD/7/+Zjh3181PEVte7d3Cnb79fTvCOTLcsWt231GXberzqCFjROd4p1TNKpsvxefHe6tVm0CDNl68OPLB6QJH//soryp8JK6qOOcZ89JHP3c474e/n7LCD5saRbevxkiNgRedyp1QPKFkvx+fFb3KBnj7dtGih2Sdq+zTJwoXB9/UykbHC2zdIKPS44Xkn/P0cxY0j23bFCm+XHAErOpebpXpAyUG5PC9+k6uzbHDFJtG1a10d4j//CV7fykrGat3aTJzobcPzkcy1LGDF7XP77d6uNwJWdM42S/Vokptydl78VllpunTR7BDvvltXhwj/X2eeqZ+fIlaTJubhh73ted6RiZYFrLh9ZPP6ekMsAlZ0zvZL9VySm3J2Xjwm7WH8eM32cOyxkbLIqlXm5ps138csqsrKzLBhZsmS5OcPDpAFrPgN3IYNgy3sZaAnYEXnZi9XDyU5KzfnxWNyXe7bV603lJebadOi9oZ168zo0UHGUs9PUUpO6cCB3L7BC7KAZRnLYtZaabKFCVgErDo52MvV40guy8F58ZVclCUBbLedTsCSJz355OIaQ2Vl8O5bhn4tccAAfhnaCzLFspi19pFsYdnI/i0zAlZ0rvVy9SCS43JtXnwlV2TJK1ovXzVpYj7/vOiPj8iY338/+NyJeniK2Pz22CM4TP+an19kGcssa/14jiwzLz/2R8CKzp1erp4/fKisL5JckK5w5JFqf3affnqJLUH+rZkzTY8e2fg8lgyyfXvzzju2Jw+OkWUpS1prN8lG9u+j7gSs6Bzp5erJw6tyZF68JP3gww91fllZ+kHz5rFuZyD/4vz5yj8GV9TxtmplHn3Uw9cYPCKTK0taFrbKmpSNLNvZswVGwIpOt52rRw2fS31evCTX4l//Wu0P7lNPNStXxh3/V1+ZCy7Qz08Rq21bc9ddZsMGS/MH98iSloWttadkOxOwkmehYeQ0YFFUjeWl9evVbpBYVmb+/Gc7zWDVKnP55dl4HUtqu+2CLrhunYUDh4NkScvCluWd/tIKb9grm9onBKzo1Lss5W35RzrBW2+p/andv7/N3/eQx/ntb8022+jnp4iHf845QS5E/shSlIUty1trZ8mm9ulFLAJWdOpdlvK2/FNZaW64Qa0NPPus5TYgj/b882bHHfXzU8T64Q/NggVe9UJfyJzK8tbaWbKpffqoOwErOvUuS3lb/lm/3vTqpdMGOnYMbnFuPVuEN3tU/M2fYnvhfvuZWbPIWHkjEyrLWxa5yqKSTe3Tu4QErOjUuyzlbXlGesCrrwafuU6/BzRsaEaOTDBVfPKJ6dkzeBb1CBWlHe62m3nppaROBbTI8pZFrhL0ZVPL1vYmtROwolPvspS35ZmwATRqpNAAWrUyn36a7KEtWhT8MJzK7SdKqNatzeOP+9MRfSGLXGY2/eUkmzrRP2AcQ8CKTr3LUt6WZ9avN8cfr/AXtjzjgAGJ36dAusu8eeaMMzLzsfemTc0jj5iKimRPC9Iki7x3b50tJlvbm3cJCVjRqXdZytvyieSPGTNMhw4KV/+yMjN1akp/Xq9ZE3zgNxPvFTbY9M7p9dcHY0Y+yCL//e8V7tcgm1q2tmxwP17EImBFp95lKW/LJ3LlvecenVv1dOsW3IkxtUt/RYX53/815eX6+SlKNWliLrrILF/uSWvMOZnEL74IFnz6C0m2tmxwP1YRASs69S5LeVs+qazUudm0POOwYWl/h1zazAsvBJ+GycRXCxs3NsccEzRmP7pjzskkyoJX2Wiywf24WQMBKzr1Lkt5W96Qi/7y5WbffRWu+23amEmTdKKDPO9uu2UjYzVsaL7//eD2Dcg6Weqy8GTZpx+wZIP78VIoASs69S5LeVs++eADs+22aacNyQ1HHaV2xZfn/c9/zP77ZyNjhb8M/eabPjTInJMZlGWf8gcBZf3IBpdt7gECVnTqXZbytrxRWWnuvVfnbQvdX6KVp164MHgDLhMZS2rHHc1f/kLGyjat31OXZ5Rt7sHiIWBFp95lKW/LGxs26IQMecZ//EP/ir9qlTn33MxkrLIyc8st+icNJZO5k2Wvst1kmyd9PxQHELCiU++ylLflh/AmnOl/Gqlhw+CXQxwJCuvWmREjMnP7Bpmp4cO1TxlikGUviz/9dwllm3vwbQkCVnTqXZbytrwxdWpwO4D0U8Iddzh0ra+sDG7fsNNO+vkpYg0ZYr76yqETiOhk1mTxp/8ilmzz6dO1Dz5xBKzo1Lss5W35Qa71t96q8OKNdJe//92tfCCDGTtW5xd5SzuBJ54Y3J7eqXOIKGTKZPGnH7Bkm48Zk/sFQ8CKTr3LUt6WHyoqzHHHpX2tD28t7eZdeV580eyySzY+kiWDPPZY8+GH2qcMxZPFn/4PJ8jTXXFF7n9/iYAVnXqXpbwtD8jfsosXB6/ZpH+hv+EGR/+SllHNnWu6d89MxurSxbz0kqMnE7WR+ZItkP6+O/LIYMvnerUQsIqi3mgpD8sb779vmjVLOxY0bGjeesvRV7DMpub31VfmlFP081PEatvWPPywD18Qyw9Z/LIF0n9rvnXrYMvnGgGrWOrtlvKqvCFJYtw4hW8zNW0afHHP8T+jJWNl6PYN228f3F1JzioyQRa/TJZshPS/vStb3vGtFw8Bq2TqrZfKcflHrrMjRyoErJ493X35qqolS8xVV5ltttHPT1HOanm5uemm4LZeyATZArIR0n+XULY8Acs2C/3DgYBVB/pxFjFrqqQZp/8bz+FtnLJyiZdxPvywwm0sSq4zzgjGnJXT6zOZI9kI6e8+2fK5TuEErCTQqrOIWVM1Z4458ECFNyneeScbr2CFpBE+/rjZbrtsvF0ogzz66Hx30JyQLSAbIeXXj+XpZMvLxs8vAlYSaNVZxKzpkdwwfbpp3jzt9t+ypfaRl2TWLLPrrpnJWB06mAULeB0rA2Q7pLmo5Llky8vGz+/aIGAlgVadRcyaHvkD+vHHFd6hOO64LL18VSAN6aOPzAEH6OeniCVx0IWfekQdZCOo3IVONn4W92A0BKwk0KqziFnTI1fYm25SuLhfd11Wu74Me9684ENO6uEpYm2/vXn66dzfWDLDZEXJdkh/D8rGJ2BZRcCiVTuIWdMjF/dBgxQu7lOmZPvi/tVX5uyzM/PL0K1bm/vuM2vWaJ811EQ2gmyH9PegbPyM/pETAQErCbTqLGLW9MjF/Ygj0v78R3l5cD/MrF/cKyrM1Vdn4/YNDTb9xO9FF5m1a7XPGrYiG0G2g2yKlLehbPxM/5FTJwJWEmjVWcSs6ZGL+267pXplb9jQ9OiRkyu7nL1RoxRugl9aNW5szjnHrFyZ+WibP7IdZFOk+YKobHnZ+PldCQSsJNCqs4hZUyKX16VL034NRq7s0ubzdGUfNy7tkFpySQvv29f861/apwxbku0gmyLlJSQbX7Z/nnZiFQSsJNCqs4hZUxL+FFr6d8C68cacvIIV2rDBvPyy2X//bGQsGeThh5u3385rZ80k2Q6yKdL/NQWXfww0HgJWEmjVWcSsKZFr65gxCp+uffrpvP0msYSVmTNN9+76+Sli7befmTGDjOUK2Q6yKdLfibL9CVj2ELBo1Q5i1vQMG5b2R2vLysy77+awtcsRffWVwg2NSq4mTcxf/pLDicgimQXZFLI1Ug5Ysv1zioCVBFp1FjFrSuSy3r9/2p9w79LFfPqp9pEnZs0a069fNm7fEM77uHFkLCfIppCtkfJfO7L9czr7BKwk0KqziFlTUllpDjss7e8uyTV9xQrtI0/Shg3B52my8jqW1NCh/DK0PtkUsjXSnHfZ+LL9eYvQHgIWrdpBzJoS6am77572H80XX5z/Xi4HeP/9we091cNTxEkZODC4PT0UyZqRrZHyZpTtn9PNSMBKAq06i5g1JWvXmu22S/stwptvzus1vbpnnw0yViZeypJBHnusmTNH+5R5TDaFbI1GjVKddNn+Ob33LAErCbTqLGLWlMybl/anheTpxo7N67sS1UnL/NvfTKdO+vkpYrvt1cvMmuVL/HWNbArZGunvx5y+cknASgKtOouYNSXTpil8HHvyZI9auBzpwoXm4IP181PE2mWXYFV4koCdIktFtkbK0y3bX6Y7jwhYSaBVZxGzpmT8+LQDVtOm5r33tA87XdI4P/vMHH98Zt4r3Gkn88wzwS8tImWyNVK+U4Nsf7kI5BEBKwm06ixi1pTce2/aXyHcY4/gd1r8eQWrYMkSc9VVqX7CJs40tWhhbrpJ+5R5RjaFbI1WrdL+TKRcBPKIgJUEWnUWMWtKrr027W8t/eAHZtEiHwOWWLXKjBgR3N5TPUJFqWbNzPDh3L4hPXKeZWuk/61euQjkEQErCbTqLGLWlJx/ftpX8x/9yKxc6W/PXrvW3HBD8NUt9fwUpcrKzHnnma+/1j5rfpBNIVuja9e0t6RcBPKIgJUEWnUWMWtKUr6NuzzX4MF8gNo89VSWbt/Qq5dZtkz7lPlBtsZBBynczD2PCFhJoFVnEbOmRHpnyh/4uPJK7WN2wMaN5qOPTNu2+vkpYg/+znfMP/7h7+uOaTrmmLQ/FikXgTwiYCWBVp1FzJqSQw5JNWA1amSuv54+HZCTMG+e2W+/bLyOJdWpk1/311Ahp/eMM9K+16hcBPKIgJUEWnUWMWtK9tkn7YB11128Rfitr74yfftm5pehW7c2TzzB7RsSJFvjyivTDlhyEcgjAlYSaNVZxKwp6dgx7YA1ZgwBawurV5tBg9K++1HJte225u678/rjKvpka9x6a9oBSy4CeUTASgKtOouYNSXt26f9GaynnyZgVbdxo7n88uC2COr5KUo1aWJuu83rr4ImR7bGAw+k/RksuQjkEQErCbTqLGLWlKR/V8Pnnydg1WDdOjN6tCkvz8ZHsho1MmefHdy0CXbJ1hg3Lu2AJReBPCJgJYFWnUXMmpLmzVNtzHI1nzSJVz5qtmGDeeyx4BbqmchYMsjjjuP2DZbJ1pC/QFJeAHIRyCMCVhJo1VnErCkpL0+7MU+ZQsCqlZyZadPM3nvr56eIdeCBZvZsJtQaOZOvvpr2JMpFII8IWAmhT2cRs6Yh/c9Wv/km/bgucnLkFH33u9l4HUtq333NW28xp3bIaXzjjbRnUC4CeUTASg6tOnOYMg3p//bwtGk04/p99ZXp1y8zt2+Q/5wwgWm1IIzXKc+gXATyiICVKPp0FjFr6Uq/H7/9tvYxZ4E02ooKc/LJmXkda/vtze9+R8ayYPp0henLIwJW0ujTWcSspSj9SzkBKzrJK3fcoR+eIlZZmbnoouCj+oiDgGUJAQuAKt4idN/99wevY2XipayGDc3AgWbNGu1Tllm8RWgPAQuAKj7k7j45XU88YXbfXT8/Ranwx4M/+YRZLgUfcreHgAVAFbdpyAQ5YxMnmv33189PEevII8377zPRReM2DfYQsACoSv9Goy+/TN8thZy0d94JMlYm3iuUQe63n3nvPea6OHK6XniBG41aQcACoIqfysmWhQvNMcdk5vYNLVqY8eO1T1mm8FM59hCwAKjix56zZeNGs2qVufji4BeX1SNUlGrWzPzP/wTD5qWsKPixZ3sIWABUdeyYasBq1MiMGUPAimv5cnPDDWa77fTzU5QqLzdXXmm+/lr7rGWBbI1bb031u72y/eUikEcELACq9tkn7YB1110ELAskr/z2twp32SitGjY0l13GL0PXT7aGhNGUA5ZcBPKIgAVA1SGHpB2wrr+ed4vskNP4+uvBe3Dq+Sli9epl5s1j9usiJ+eMM9IOWHIRyCMCFgBV0vNS/gyW/IEOW8KM1aaNfniKWN27my++IGPVJeUvMYT3LcsjAhYAVf37pxqw5LkGD+YtQssWLszS7Rtat+bnkmolW+Ogg9LeknIRyCMCFgBVEndSbswDBgTfg+M1DLvmzjU//GFmMla7dsHdOlgD1YRfEd1337SnQy4CeUTAAqDq2mvT/nP5Bz8wixbRXC2T8/nVV+byyxV++6i02n57c9tt/DL0FmQSZWvsvnvaW1IuAnlEwAKg6t570/7Axx57mH/9i4CViFWrzLBhCj9/VFpts425+WazerX2WXOGbArZGunf+1cuAnlEwAKgavz4tG8L3rRp8AsqSEhFhXnsseD1oay8XXjSSUEuREi2RsqvQcr2z+nd9glYAFRNm6bwuyuTJ/MKVoIqK83jj5udd9bPTxGrd+/g/U2WhJwB2Ropn3zZ/nIRyCMCFgBV8+alHbDk6caO5YuEyZJW/eabpkuXzLyOte++wU9Ze56xZFPI1kh/P8pFII8IWABUrV0b/OJKyp/5uPlm31tpOj74IO0bycbJWN26mb/9TfuUqZJNIVsj5buMyvaXi0AeEbAAqJJrevrfWrr4YgJWGuQkz51rDj88GxlLqmNHr2/fIAcuWyPlzSjbP6cnnIAFQFVlpTnssLS/SNi/v1mxQvvI/RD2zjPP1A9PEatJE/O733n6DrJsCtkaaZ5t2fiy/XN6tglYAFRJAz7xxLTfItxnH/PZZ9pH7plLL83M61iyQu64w6xbp33KUiebIuUfX5fnku3PK1j2ELAAVDFsWNrX9LIy8+67eb2sO6qiwjz4YGZukSWL5OyzzbJlHi0SOVLZFCnfo0HOs2z/nCJgAVBVWWnGjEn7tQ15uqef5i7eaZMWPmlS8Dkn9fwUsY480syZ40vGku0gmyL9nSjbn7cI7SFgAfiGXFvfeivty3rDhubGG/N6WXeahJXXXzd77ZWNtwtlkN27+3JbWtkOsilSvkeDnGHZ/jndiQQsAKqk4y5dGvxoScqX9XPO8eWVCQdNmWJ69FC4wWxpS2W33fJ6J8wtyHaQTZFy8JWNL9s/pzuRgAVAm1xepYel/Dl3afA5/bs5A2TGlywxp5ySjdexGmz6Zeg//zmvOWAz2Q4pp94wvOb3rBKwAGiTK/sRR6T9Offy8uBDJ/m9uLtOzvzy5ea00zKTsVq3Dm7fUFGhfeKSIdMh20E2RcrbUDZ+fv/OIWAB0CYX90GDFD5dO2VKji/u2bBmjbn99my8VyjVrJm57LJgzPkjG0G2Q/p7UDZ+fv/IIWAB0CYX95tuUri4X3ddji/umVFRYe69N8gu6vkpSm2zjbngguC1t5ytHDkc2Q7p70HZ+Pn9I4eABUCbXGEffVTh4t63b44v7lki3f2JJ0ybNvr5KUo1bhzc7nzRolxlLNkIsh3S34Oy8fO7BwlYALRJo5o+3TRvnvbFvWVL7SNHFa+/nvZ3HeIsnkMOMR9/rH3KrJLtkPIHsGTLy8bPU07dEgELgAPmzDEHHqhwN6x33snxH9AZE/4ydNeumclY7drl5JehZQvIRkj5k3DydLLlZePnFwELgANWrTKnnqrwDsXw4XlokLkhc/HVV+boo/XzU8TafvsgY2U9o8tpl42Q/u6TLS8bP78IWAAcIJf4kSMV7iLds2fmu2POyEqQpjtkSGZ+tXCbbcx995m1a7VPXAyyBWQjpB+wZMvn+s8bAhYAB8h1dtw4hYDVtKlZty7fV/lMWrkyeE1l++3181PEhSQ9KKMvxsjily0gGyH9N+hly+d66xGwALjh/fcVvqsvV/n8/hRatm3YYO6+O+2vPsSpYcPMsmXZSwzhj4Gmfyuy1q2DLZ9rBCwADpC2tHix6dhR4X2KG27IXlP0hMzL888HnTgTH3tv1Mgce2zwOf1sLScZrWyB9PfdkUcGWz5b56pIBCwAbqioML16KVzoO3fO91U+8959NzMZSwZ50EFm9uwsrSgZqmyB9PfdJZfk9neHvkHAAuAGudDfeqvCWxVyrf/737PUEX0jU/Pxx+a739XPTxFrr70yc/sGGaQs/vTDq2zzMWOycYpiIGABcMbUqaZJk7Sv9dJd7rgj99f6bJPZ+egj06ePfniKWO3amWefzcBn++TEyuJPP2DJNp8+XfvgE0fAAuAGudYvWqRwL2/5Y7pjRwJWBqxcaS69NBvvFYbryv3gLsOTxZ/+t3dlm3/xhesnJzYCFgBnbNhgjjlGoYPKM/7jH7m/3OfBunXm8suDXwNUz08R19WvfqV9ymonC16Wvcp2k20umz3vCFgAnFFZae69V+eK/+tfE7CyQabpsceydPuGE04Ixuzg6pIhybJX2W6yzR08IbYRsAC45IMPzLbbKrxLeNRRPlzxc0Jm6oknsvTVQlldDt6GVE6jDCz99wdlg8s29wABC4Az5Iq/fLnZd1+FxtmmjZk0iYyVGTJTU6aYHj0yk7H228/MmKF91qqQEygLXpZ9+qdCNrhscw/2GgHLddoXBurb0l4LfqisVPjV5wabrvvDhmXga18okA79z3+agw/WvjBEXmDdu5uXX3YlWMgwZMGrbDTZ4H5sNAKW67SvCtS3pb0W/CDX/dtvV/gUs1z3DzjArF6tffwohqyWefMUfqi45OrY0Tz9tBOf7166NFjw6Z832dqywR1JmQkjYDlN+2JAVS/tFeEBufLOmGE6dFC49JeVBTfi8uPSnysrV5ozz1S4RW0JJau6WTPz29+a9es1z5gs8t//Pljw6R++bG3Z4H7sMgKW07QvBlT10l4RfpDec/zxOm9eDBjgxKsLKNa6debGGxV+LLy02mYbc/XVmp9DkkXeu7fOFpOtrRsuU0TAcpf2NYCqubTXhQek64wcGfx0bvrT26qV+fRT7eNHSdasMffdp/Cp7dKqSRMzaFBwZ12VjCWLvHVrhaOWTS1b24+XrwwBy2XaFwCq5tJeFx6Q6++rr5q2bRWmt2FDrxpA3qxbZ8aNMy1aZOMjWZI2+vY1y5alfZbCP2BUTpFsatna3uwvApajtLc+VVdprw4PrF9vevXS6QEdO5olS/zpAXkjEzdzptl112xkLBnknnuazz5Lb73JE8nylkWucrCyqb15f9AQsNykvemp+kt7jeRdZaW54QadHilP+uyzBKwMk7lbuDC42ZL+dSJatWljZs9O6c4FcnJkeWvtLNnUftygIUTAcpH2dqfqL+01knfSBt56S60N9O9vVqwgY2WYzN3ixaZfv2y8jiVVXm6eeSbxJSePLwtblrfWzpJN7dO2ImC5SHuvU/WX9hrxwPr1ZvfddTpBWRl3dc+DVavMSSdlI2OFg3zggWRPSHj39vTvzhAeoGxnn94fNAQsB2lvdCpqaa+UvNP6JdoG39xseuVK7VOA2DZsCN6WKi/XvlpEq2bNgrurr1mTVLiXJa3yMwkNPP09dQKWW7T3N1Vcaa+XXJNr8YcfKtzSvcGmZtC8uZk40bd+kE8yif/3/5rtttO+WkSrsjJzxRXmyy8TOQ+ypGVhqwQs2ciynT3bUAQst2hvbqq40l4veVdZaY48Uu0P7tNP960f5NkrrwQ3OcvE24UNG5rvfz/4CSC7ZDHLktbaTbKRffp4e4iA5RbtnU0VV9rrJe+kJTz8sFpTbNLEfP65h10hn2Qtvfyy6dQpGxlL6ogjbL7kI8tYFrMsaZVjkXMuG9m/P1cIWA7R3tBUKaW9anJNrsjLlgVv7mj92X3yyR52hdySqfzoI9Onj/Y1I3Ltuae1O4bIg8hi1tpHsoVlI/u3lQhYroi5irWHn22cfHfJRblvX7VXHcrLzbRpHjaGPJszJ0u3b9hpp+De9DHJApZlrPVJfznVsoW93EQELFfEXMXaw882Tr675Lo8frxaO5TnPfZYP3tDni1aFPyqt8qPXZawAlu0MPfcE+t4ZQHLMtbaRA0bBlvYy01EwHJCzCWsPfw8YArcVVlpunTRzFjvvutne8gzmdCrr1b7TFIJ9ctfBmMuYR3KvyILWHH7yOb19YOMBCwnxFzF2sPPA6bAXdIhfvELzQ5x+OEErHy6+26dRVXaOrziCvP110UfoyxdWcCK2+fGG73dPgQsfTGXsPbw84OJcJRcnadPD94oUWwSY8d62yTyTOb0pZeC9woz8ZEsGeTRR5sFC4o7wEce0dw4sm09/tUpApa+mKtYe/j5wUS4a/VqM2iQZp848EAzd663fSLPwq8Wdu2qs7RKqO7dzYwZkZai/DOyaHfYQXPjyLb1eNcQsJTFXMLaw88bpsNRco2eMME0barW1Ro1Cj6y43GryLPwNwN69szG61gNNt2+YdKk+j/YFH7OTPGgZMPKtvV41xCwlMVZv9pjzydmxFFLl2p+E0qet0MH8957PneLnFu4MHgDrmFDtThS1Gps3do891xdv50sC1WWqyxaxUHKhpVt6zEClqaYS1h7+PnEpDhKGsbYsZpfrZeG0a+fqajQPhFIzFdfmcsuy8btG6S23dbceadZu7bmY5GFqnu7LzmN3n9ykYClKc761R57njEvLpIr9bx5wV/kij2jSRPz4oue94w8k5lds8YMHRr84rLWGit2QQ4fbjZsqOFAZKEq3oQifMVXNqzfm4WApSbmEtYefp4xNY6qrDQ33aT8Jk7nzmb+fO0TgSStX28efFDzW6tFVaNG5tRTzcqVWxyCLFFZqIqjkk0qW9XX218VELB0xFy/2sPPPybIRfLX8L//bdq31+wc0nQvuKCuz74gBzZsCH6cWFZaJjKWDPJHPwpuTx+SxSlLVHfkcupkq/r98pUhYGmJuX61h59/TJCjpPP97GfKzaN5c/PqqzSPnKusNC+8YPbZR3OlFVVHHGFmzw6GLYtTlqjiSGR7yibd+o1L/xCwdMRZv9pj9wVz5KjPPw9+AVcxY8lTSzNbtIiMlXMyvxJZ9torM69j7bmn+etfzVFHKe8O2Z6ySUHAUhFzCWsP3xdMk6Pkb/QLL9TveZdfXusXuJAnK1eak07Kxu0bXCjZmLI9vf/0VYiAlbaY61d7+H5hsly0caN5+22zyy7KjaRRo+BHSHgRywcbNpjTTtPP9Jko2ZiyPdkXmxCw0hZz/WoP3y9MlqPk8v3Tn+rfr2jXXYOfIoEnrrnGbLedfoJxuWRLysYkXX2DgJW2OOtXe+w+Yr5cJFfwmTOVv4jeYNO7ISecwK1HffH11+Z//9e0asVLWbWWbEnZmASsbxCwUhVn8WqP3V/MmovkIv6LX+i3OhnAk0/SUXwhYfrxx82OO+pHGQdL9oJsSfZCFQSs9MRcv9rD9xcT56Lwxu7bbqvfV5o3N+++S1/xhUz0tGnB9/XUF55TJelKNqP3t26vhoCVnphLWHv4/mLiHCWX8uuvd+JFrA4dzLJltBaP/POfZr/99NeeO9WwYbAZ2QJbImClJOb61R6+75g+F8nV/Msvnbjdtgzg9NPNihXaZwQpmj3bDBig/00LF0rW/157BZuRgLUlAlZKYi5h7eH7julzVGWlufNOJ+5RVF5ufvlLGoxHZK6XLDGXXKK/9tRLNuBTT3Hvq60RsNIQc/1qDx8BJtFR0ud69NB/EUuqWTNz331kLO/ceKMTy0+r5NhlA5KuakLASlz8Jax9BAgwj46SK/vkyaZxY/1OI9W2rfnoIzKWX2S6b73ViZdRVUq2nmxA1nxNCFjJir9+tY8A32I2HSUZa+BAJ15FkDHsvLOZM4d+4xeZ7qlTTYsW+isw/QUvW4+Xr2pBwEqQlSWsfRD4FhPqqPCb861bu5KxuncPPp0Dr8gifOUVs9tuTizC1Ja6bDrZevw5UQsCVlKsLGHtg0B1TKujKirMLbc49JWu0083ixZpnxSkbtYsc/TRvmQs2W6y6fglg9oRsBJhawlrHweqY2YdJX9Df/65+d73XOltMoyhQ4MfCYZXZB3OnWt693Yo6ye3wmW7yabj5avaEbDss7WEtY8DNWN+HSUX+pdeMk2b6veesBo2NMOH0368IzP+9ddBvC4r01+EyZVsNNluLO86EbAss7V+tY8DdWGWHbVunTnrLIe+z9W4sRk5kibko/Xrgx/mKy/XX4RJlGwx2Wiy3VAnApZNFpew9qGgLky0o8I3aPbZx5U3CqXKysxtt5GxfCT545FHHHpJ1VbJ5pItJhuNVV0fApZNtpaw9nGgfsy1oyorg5tKN2um34cKJS121Cjt8wINshrHjw/ujqa+CC2WbC7u2x4NAcsa7VVPZbW0V27urFlj+vZ16EUsqW23NY8/rn1eoGHjRvPaa6ZdO7cWZMklRyGbS7YYIiBg2aG96qlsl+7qzRtpae+/bzp10p7VLUsyFq9j+UkW5MKFZs89M5+xZPyyrWRz8eZgNAQsC7RXPZWHUlzAOSQN4K67HPq0e1jNmvF5LE/JpK9fb3r2zHbGato02FYs4MgIWHFpL3kqP6W1hvOposL06eNcxiorMzfdRIvy1PLl5qKL9BdhaSVbacgQbitaFAJWLNpLnspbqSzjfArfl2nTxrnXDBo3Nvfey2eEPfX118GdO1xbk/WWDFi2kmwo/jYoBgGrdNpLnspnpb+Sc0uawcSJLt6LqFEjc/nl/JaOpyoqzH33mVat9Ndh9JJNJFuJdFUkAlaJtNc7ledKeTHnWWVl8L6Ggy8YyJBOP90sXUrT8pFM+gMPmF120V+HEdeqbCJecy0eAasU2uudyn+luZ5zbvVqc+ihLmYsqe7dzZw5ZCxPvfmm2W8/R1dmoWR4sn1kE6F4BKyiaa93ypdKbUnnnMSXWbNMixYudjIZUrt25sMPtc8RNMjK/OQT06WL/jqsY33KxpHtw98AJSFgFUd7vVN+VTqrOv8qK83997t1e/dCSQ9r2zb4UA49zEMy6bfcor8IayvZMrJxeHOwVASsImgvdsrHSmFhe2HFCnPFFS6+iBWWdLLrrgsGSczyh0y3TLqbub/BpugvW0YGiVIRsIqgvd4pHyuFhe0FCS7z5jn3EzpVq0mT4GPvy5aRsfJPpvizz4LplklXX3g1VviTOLJlWI0xELCi0l7vlL+V9Nr2hbSKTz91+lfhZGAdOph33qGr5ZlMrkzxrrs6vQ5lm8hmYR3GQ8CKSnvJU/5W0mvbI9IwJkwwzZtrT2ntJb1Nhvfkk8EvqyB/ZFplcmWKnU1XUjI82Sakq9gIWFFpL3nK30p6bfulstKMGBHcTl1/Ymsv6b59+gR3cECeyITKtLocrRps+qUBPthuCQErKu1VT/lbSa9t76xaZS680GyzjfbE1lnShnfd1Ywda9au1T5fiE0mUabS5bcFw5JNIVtj3Trt85UTBKyotBc+5W8lvba9s3Fj8DM1Awa43u0abHo54bLLgtHyfk1GhYtNJtHxF00bbMr0sin4BSd7CFhRaa99yt9Kem37KPzA+z77ZCBjSR1+uHn1VT6VlT0yZS++GEyf+hKqt2QjyHbgg+1WEbCi0l7+lL+V9Nr2lDSSjz92+kuFhQo/+X7BBWb+fPpfNsg0yWTJlDVunI0FJhtBtgOryyoCVlTaO4Dyt5Je2/6SdjJlitNfKqxa0gU7dzZ/+5upqNA+caiTTJBMk0yW+9EqLNkCshFIV7YRsKLS3gGUv5X02vaaNJUnngjupp2VXtikiTnpJDNjRjByOqJTwhmRqZEJcvYOotVKlr0sftkCrKUEELCi0t4HlL+V9Nr2XWWluf12U1amPc+RS5ribruZ4cPN3Ln0RVfIRMh0yKTI1GQlrEvJspfFz00ZkkHAikp7H1D+VtJrG8G36IcONY0aaU91MSWj/c53zKOP8lKWsvD8y0TIdGRuCcmy5z4giSFgRaW9FSh/K+m1jcDq1eaqq7L02kODTS9lSfXsya/rqAl/9yb8Omq2Fk/DhsGCl2WPxBCwotLeDZS/lfTaxmZr1gRf+5LGoz/nxVTY13v3Nm+9xatZKQnPs5xwOe2FKchQySKXpikLHkkiYEWlvSEofyvptY1vyR/0Z5+dvYzVYFOPLy83J59sZs8mZiUoPLdykuVUywnPXLRqsCldySLntavkEbCi0t4TlL+V9NrGFlauNGec4foP6dRWYcw67TQzcaJZsYKkZU14JuWUyomV05vRaNVg04/hyPKWRY7kEbCi0t4WlL+V9NrGFqSPLlxofvzjDGes8MakcgiSBpYvJ2bFEp49OY3PPhucUjmxmfu4VaFkScshyPJmPaSCgBWV9s6g/K2k1zaqCzOW/KGfxfcKwwpDgDTUfv3Mn/9sliyhp5ZCTpqcOjmBchrlZGY3WjXY9M6gLGnSVYoIWFFpbw7K30p6baMG0oRWrcrq57GqVpgJOnUyN94Y/NLchg3013qEL1nJiZLTJSdNTl2mc1VY4eeuZEkz+ykiYEWlvT8ofyvptY2aSStavTqT3yusseQoWrUyAwaYqVOD46qspNdWJydETsvKlcEpkhMlpys3Uy/LWCadGU8XASsq7S1C+VtJr23UZc2a4HZB2bqBZG1VeN/wwAPNsGFm0qTNr9Z43ncLJ0FOiJyWbt0y/25g1ZKlKwuYOzJoIGBFpb1LKH8r6bWNesif/pdfHvyoSD46blhyLG3amKOOMr/+tZk1y8ekVThkOXw5CXIq5ITkbIpl0V53HXdk0ELAikp7r1D+VtJrG/Vbuzb4ybbmzbXXgu0KX6eR2mMPc8cd5u9/3/zWYY6TVuEjVnKwcshy4IWToD4ddkuWK78zqIqAFZX2XqH8raTXNiKRRvXEE5u/pa+/KGxXw4abQ0bnzuaGG4J7lK9btzls5aBDFw5EDkoOTQ6wQ4fNx5uPT1lVq/A+HbJcczB3WUbAikp7x1D+VtJrG1FJk54yxey8cz4zVliF2NG0afArh9dcs/mHDgsZJRMvblUbsByCHIgcjhxUIUqqn+rkZlCWqCzUTMxUrhGwotLeNJS/lfTaRhGkaX38senaNc8dOqxC0pJq2dL06RN8mkfa9oYN32YXd276EL7rV3VgMlQZcO/eweDDo8h3rirMmixOWaKOzIvfCFhRae8byt9Kem2jONK6Pv00+Bp/Rm/1XkIVPqUk1bSp6dHDnHNOcI+op582775rPvvs25/lKbzEZf1T81UfsPBE4c/XfPJJMAwZjAxJBibDk0FWHbP6CUynZEHKspTpIF25gYAVlfbWofytpNc2iiYNbPHi4N5CZWXaqyP1Cl/WKvynnIGuXU3//ubii83NN5uxY83kyea998y//mUWLQrubBl+DCiMRIUqpKVCFKj6f6n2Txqz+fZU8oDysPLg8hTyRPJ08qTy1F26bP6OZ9WBqZ+olEvOgCxIWZakK2cQsKLS3j2Uv5X02kaJ1q0zv/tdDr9aWGyFaUb+s1GjzZ8Zl2bfqpXZfXez777moIPM0UebM880V15pbr3V/OEPwUtNL7xgXn01eBdv2jQzfXpQ8l/kf8r/8fnng39A/jH5h+VfkX9R/nV5EIlx8oDysGGolSeSpys8tfpJ0K0WLYKlKAsSLiFgRaW9gSh/K+m1jdJt3GgmTDDt2tHjq1fhvbnwJSUJQ2GFH4eq+98N/5mq/0rhoTjPW59nWX6vv84LVw4iYEWlvY0ofyvptY1Ywo9k9elD76fSLllysvBk+ZGunETAikp7J1H+VtJrGxbMm2eGDjXNmmkvFsqbksUmS04WHlxFwIpKezNR/lbSaxsWhF9nu//+4NMwvJRFJVqywGSZyWILv7wJVxGwotLeUpS/lfTahjXS7f7+d3PooWQsKqmSpSULTJYZ0cp5BKyotHcV5W8lvbZhk7S91avNkCGmvJyYRdksWU6yqGRpyQIjXWUBASsq7b1F+VtJr23YJ/1v4kTTti0Zi7JT4S3aZVERrbKDgBWV9vai/K2k1zYSIY1w0SJzwgn5/DlhKs2SJSQLSZYT6SpTCFhRxdkfSY8toWHnrzI6EYrDRizSDisqzF13mU6deCmLKqVk2cjikSUkC4l0lTUErKji7JKkx5bQsPNXGZ0IxWHDAumLM2eavn03/0Ce/j6gslDhzz7KspHFQ7TKJgJWVHH2StJjS2jY+auMToTisGHN11+bJ58MPkbDO4ZUvSWLRJaKLBhZNsgsAlZUcbZL0mNLaNj5q4xOhOKwYdPGjWbuXHP22XzBkKq1wq8KyiKRpcILVxlHwIoqzqZJemwJDTt/ldGJUBw2LJOWuX69+f/t3c/Lp1MfB/BnYTQMKYkm+VFKWCkpFkpTIqVYzLOxEJK9FCU1RcpisuAfUMjCYhbKxmoUDUoo2ck0FoRSFGPGeT7Xc81zG8PDmfl+zpz7Otfr1Sf5MXN/z3U+57o/73yv+d4HDpRbb/39ZxUr9a///bTsOBhvvz0dEulq+QSsWpvcOq3X1mjZ49VCG9Fx2TQRs/PLL8tzz5VLLpGx1FRxDOIwxJGIgyFajULAqrXJ3dN6bY2WPV4ttBEdl01DR4+WQ4fKAw+UHTvErPVWtD4OQByDOAxxJBiIgFVrk3uo9doaLXu8WmgjOi6btn77bap33ik33TQNWjFrVTV3PFofB2A+CYxFwKq1yZ3Uem2Nlj1eLbQRHZfN2TAP1xdeKLt3y1hrqWh0tDuaLlqNS8CqtcnN1HptjZY9Xi20ER2XzdkTU/a778q+fWXXLjFr5IrmRov375/aLVoNTcCqtckt1XptjZY9Xi20ER2XzdkWE/fIkfLEE+Waa6Y/U9b/plF5FQ2NtkZzo8Wi1QoIWLU2ubFar63RsserhTai47LpYH7P6JNPymOPlcsv92zW4mvuYLQyGjp/LLt0tQ4CVq1N7rDWa2u07PFqoY3ouGy6mcfwhx+WRx8tl10mYy21onHRvmhitFK0WhkBq9YmN1nrtTVa9ni10EZ0XDb9xUg+fHj6nx+7d08/QUXSWkRFm6JZ0bKnn57aJ1etkoBVa5O7rfXaGi17vFpoIzoum+3i2LHyxRfl2WfLFVf4CPhtXfMHskebolnRMtFqxQSsWpvcc63X1mjZ49VCG9Fx2WwjMaqPHy9ffVVee63ceWc57zyPZ22jmnsRTYnWRIOiTdEs6WrdBKxam9x8rdfWaNnj1UIb0XHZbEcxtr/9trz5ZnnwwXLRRWJW55r3PxoR7YimRGvkKv5LwKq1yS3Yem2Nlj1eLbQRHZfN9hVT/KefyvvvlyefLNdee2LMS1pnrbY2PDZ/376pEdEO0YqTCFi1NrkXW6+t0bLHq4U2ouOyWYD5z6YdOFDuuadceKGY1bzmHY6tjg2PbfdnA/k/BKxam9yRrdfWaNnj1UIb0XHZLMY85r//vrzySrn99nLOOZJWcs37GRsb2xubHFstWvG3BKxam9yardfWaNnj1UIb0XHZLMw88o8fL59/Xp5/vlx9tbcON62tDbzhhmlLY2Pnp9dFK/6JgFWr912u1lutzzYDmhPAL79Mzwbt21f27CmXXnri8x2ErX+seZdiu2LTYuvmR6xiM+UqToeAVav3Ha/WW63PNiPbSloHD5Znnil33z19RNOOHWLWX1dsS2xObFFsVGxXbJpcxZkSsGr1vu/Veqv12WYV5pRw9Gj56KOyf3/Zu7dcf3254IK1v4e4dfmxFbEhsS0vvjhtUWyUXMVmBKxavb8NqPVW67PNumw9p/XDD+XTT8tLL5U77ihXXll27jzxo3iGD1vzNcbFxiXHhcflxybEVsSGeL6KPAJWrd7fEtR6q/XZZqXmGBGR4tix8vXX5b33poe49+yZHo0///wpfwyTt7YSVVRcWlzgXXdNFxuXHBcelx+bsLUhkETAqtX7O4Rab7U+23AiW8Rff/21fPNN+fjj8sYb00/T27u33Hhj2bXr97fStn/kOmWpsfi4hLiQuJy4qLi0uMC4zK1LhjYErFq9v2eo9Vbrsw1/ML9HNtePP5bDh8sHH5RXX50CykMPldtum95WO/fcP4SYLv+v65SXnisWFsuLRcZSY8Gvvz4tPi4hLuTk64L2BKxa3aesWm21PtvwD+ZntrYe3pp/GOKhQ+Xll8vjj08faH7LLeWqq6YPN5/fhjv57cW/rL8/8n/zG0/++vFy8aLx0vfeOy0jFhNLmn8U4CmrhR4ErFrdp6xabbU+23Da5uyy9ejSnGN+/rkcOTKlnAMHpsfGn3qqPPxwue++6bmum28u1103Pfy0e3e5+OLpbbudO6cPRNj6aK74m/jH+Jfxn+IXxC+LXxy/JX5j/Pb4Io88Mn3B+LLxxeMl4oXi5U6OUPN6xCm2DQGrVvcpq1Zbrc82AOkErFrdp6xabbU+2wCkE7BqdZ+yarXV+mwDkE7AqtV9yqrVVuuzDUA6AatW9ymrVlutzzYA6QSsWt2nrFpttT7bAKQTsGp1n7JqtdX6bAOQTsCq1X3KqtVW67MNQDoBq1b3KatWW63PNgDpBKxa3aes6dta91ZqMcAwBKxa3aes6dta91ZqMcAwBKxa3aes6dta91ZqMcAwBKxa3aes6dta91ZqMcAwBKxa3aes6dta91ZqMcAwBKxa3aes6dta91ZqMcAwBKxa3aes6dta91ZqMcAwBKxa3aes6dta91ZqMcAwBKxa3aes6dta91ZqMcAwBKxa3aes6dta91ZqMcAwBKxa3aes6dta91ZqMcAwBKxa3aes6dta91ZqMcAwBKxa3aes6dta91ZqMcAwBKxa3aes6dta91ZqMcAwBKxa3aes6dta91ZqMcAwBKxa3aes6dta91ZqMcAwBKxa3aes6dta91ZqMcAwBKxa3aes6dta91ZqMcAwBKxa3aes6dta91ZqMcAwBKxa3aes6dta91ZqMcAwBKxa3aes6dta91ZqMcAwBKxa3aes6dta91ZqMcAwBKxa3aes6dta91ZqMcAwBKxa3aes6dta91ZqMcAwBKxa3aes6dta91ZqMcAwBKxa3aes6dta91ZqMcAwBKxa3aes6dta91ZqMcAwBKxa3aes6dta91ZqMcAwBKxa3aes0XsWdG+oLgOMQcA6Dd0HrdHbWveGajHAGASs09N93Bq9rXVvqxYDDEDAOm3dh67R21r35moxwNIJWGfC6B2eFgOwCQFrI4bu8LQYgDMgYAEAJBOwAACSCVgAAMkELACAZAIWAEAyAQsAIJmABQCQTMACAEgmYAEAJBOwAACSCVgAAMkELACAZAIWAEAyAQsAIJmABQCQTMACAEgmYAEAJBOwAACSCVgAAMkELACAZAIWAEAyAQsAIJmABQCQTMACAEgmYAEAJBOwAACSCVgAAMkELACAZAIWAEAyAQsAIJmABQCQTMACAEgmYAEAJBOwAACSCVgAAMkELACAZAIWAEAyAQsAIJmABQCQTMACAEgmYAEAJBOwAACSCVgAAMkELACAZAIWAEAyAQsAIJmABQCQTMACAEgmYAEAJBOwAACSCVgAAMkELACAZAIWAEAyAQsAIJmABQCQTMACAEgmYAEAJBOwAACSCVgAAMkELACAZAIWAEAyAQsAIJmABQCQTMACAEgmYAEAJBOwAACSCVgAAMkELACAZAIWAEAyAQsAIJmABQCQTMACAEgmYAEAJBOwAACSCVgAAMkELACAZAIWAEAyAQsAIJmABQCQTMACAEgmYAEAJBOwAACSCVgAAMkELACAZIMErPvvv/8tAIDePvvssz8HlaUGLACA7eDdd9/9c1ARsAAAzpyABQCQbPEB698n6bWJAAAnW3bAOvUrNnYXADCE1plhDljv/dHBgwfTw89fxKGz8BoAAKsiYAEAJBOwAACSCVgAAMkELACAZAIWAEAyAQsAIJmABQCQTMACAEgmYAEAJBOwAACSCVgAAMkELACAZAIWAEAyAQsAIJmABQCQTMACAEgmYAEAJBOwAACSCVgAAMkELACAZAIWAEAyAQsAIJmABQCQTMACAEgmYAEAJBOwAACSCVgAAMkELACAZAIWAEAyAQsAIJmABQCQTMACAEj2HyzA7Eoubc4bAAAAAElFTkSuQmCC'
                        var qrcode = 'data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAXIAAAFyAQMAAADS6sNKAAAABlBMVEX///8AAABVwtN+AAAAAXRSTlMAQObYZgAAAAlwSFlzAAAOxAAADsQBlSsOGwAAAfBJREFUeJztmdGNxCAMRJFSQEpK65SUAiL5EntsINEWMKeZj90NPPiJPdhsa5IkEWs3qN8P1vfrGbs/Dh887zHoEk/J4/vmNwwfJx5zYubE0/FOjVCIX0dGwf34RIt4et7MQ2GOh138/+E91TPp3ei757t4bt7lIzn8LMqVP/1fPAVvUPHvD0tnF0/ID32psPdfEs/A1xv3eju8+zmq/dAe/VQXz8m3lqXY493u4n1HgoOPsUs8KT96p7wF+bTKvlI8I4+2Cb/iMZfHxFJviyfkW6b11FnZWGQ2BY94Kj7mrjYO6M99iO9W9bl4Nv51Ik9BMXXO6efi+XjUY5alWMzB3rFbE8/KT6neopUqjzdslEe6eEI+XfyV9Ga4vl4mxHPxi2MblB4Qs9k5i2fkq9jaK7enjWoP8bQ8juoqsIM60TljI/Gc/F4N8pn3IUdehcTK/oTM4v/iqfjRFgOtVO/BbGs8iOfiw889HiLzPTzSxa0uwsQT81YaBp4jV8aNeDp+KEy9tfF/4uwG4jn5PV96b22KjClQep7c4hl5vGc0yGN5mPqFLdd6TDwTP792M1sorG4l8bQ8ANxstq2uqn/Eg3g6PirvosLeP/9PiafiXbj2mHrjLbPc40E8KW9Qr+H1/8QoxY5v/SaegZckiVR/JDtNASOfYV8AAAAASUVORK5CYII='
                        doc.addImage(img, 'PNG', 5, 5, 40, 40);
                        doc.addImage(qrcode, 'PNG', 5, 250, 40, 40);
                        doc.line(5, 50, 5, 110);
                        doc.line(57, 50, 57, 110);
                        doc.line(200, 50, 200, 110);
                        doc.setFontSize(12);
                        doc.text("Data da Infração: ", 7, 56);
                        doc.text(data.data, 59, 56);
                        doc.line(5, 50, 200, 50);
                        doc.text("Identificação da Infração: ", 7, 66);
                        doc.text(data.indInfracao, 59, 66);
                        doc.line(5, 60, 200, 60);
                        doc.text("Local da Infração: ", 7, 76);
                        doc.text(data.indLocal, 59, 76);
                        doc.line(5, 70, 200, 70);
                        doc.text("Placa do Veículo: ", 7, 86);
                        doc.text(data.placaVeiculo, 59, 86);
                        doc.line(5, 80, 200, 80);
                        doc.text("Marca do Veículo: ", 7, 96);
                        doc.text(data.marcaVeiculo, 59, 96);
                        doc.line(5, 90, 200, 90);
                        doc.text("Modelo do Veículo: ", 7, 106);
                        doc.text(data.especieVeiculo, 59, 106);
                        doc.line(5, 100, 200, 100);
                        doc.text("Dados para consulta da infração", 7, 240);
                        doc.line(5, 110, 200, 110);

                        doc.text("Protocolo da Infração: " + data.protocolo, 7, 245);


                        doc.text("Senha do Protocolo: " + data.senha, 7, 250);

                        doc.text("https://registrodeinfracoes.firebaseapp.com", 7, 293);
                        doc.save(data.protocolo + ".pdf");
                    });
                });
            });
        }
    }
    req.open("GET", url, true);
    req.send(null);
});


function gravar(key, data) {
    var url = "https://registrodeinfracoes.firebaseio.com/modulousuario/denuncias/" + key + ".json";
    var json = JSON.stringify(data);
    var xhr = new XMLHttpRequest();
    xhr.open("PUT", url, true);
    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    xhr.onload = function() {
        var denuncias = JSON.parse(xhr.responseText);
        if (xhr.readyState == 4 && xhr.status == "200") {
            console.table(denuncias);

        } else {
            console.error(denuncias);

        }
    }
    xhr.send(json);
}


var infracoes = "[";
$('#modalInfracao').ready(function() {
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
                $('#modalInfracao').ready(function() {
                    var column_names = []; //Array com confi das colunas
                    var denunciaJSON = JSON.parse(dataInfracoes); //Parse no obj json, fa 
                    if (denunciaJSON.length > 0) {
                        var i = 0;
                        var column_titles = ["Código", "Artigo", "Gravidade", "Infração", "Pontos", "Suspende CNH?", "Valor da Multa"];
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
                            "columnDefs": [{
                                    "targets": [0],
                                    "searchable": false
                                },
                                {
                                    "targets": [1]
                                },
                                {
                                    "targets": [2]
                                },
                                {
                                    "targets": [3]
                                },
                                {
                                    "targets": [4]
                                },
                                {
                                    "targets": [5]
                                },
                                {
                                    "targets": [6]
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
                    $('#tb_infracoes tbody').on('click', 'tr', function() {
                        var data = tb_infracoes.row(this).data();
                        txtInfracao.value = data.infração;
                        denuncia = data.infração;
                    });
                });
            }

        }
    }
    req.open("GET", url, true);
    req.send(null);
});

$('.modal').on('show.bs.modal', function(event) {
    var idx = $('.modal:visible').length;
    $(this).css('z-index', 1040 + (10 * idx));
});
$('.modal').on('shown.bs.modal', function(event) {
    var idx = ($('.modal:visible').length) - 1; // raise backdrop after animation.
    $('.modal-backdrop').not('.stacked').css('z-index', 1039 + (10 * idx));
    $('.modal-backdrop').not('.stacked').addClass('stacked');
});
$('.modal').on('hidden.bs.modal', function(event) {
    if ($('.modal:visible').length > 0) {
        setTimeout(function() {
            $(document.body).addClass('modal-open');
        }, 0);
    }
});
