var socket = io.connect('http://localhost:3000'); // io usa .connect agora

$('document').ready(() => {
    socket.emit(
        'usuarioAtualizadoParaServidor',
        {
            apelido: $('#apelido').val()
        }
    );

    socket.on('usuarioAtualizado', arrUsuario => {
        if (arrUsuario) {
            arrUsuario.forEach(e => {
                $('#pessoas').append(`<div class="pessoa" id="pessoa"><h2 class="col-md-6" id="${e}">${e}</h2> <input class="btn btn-success" type="submit" id="ligar" value="Ligar"></div>`);
            });
            socket.on('participantesParaCliente', function (data) {
                $('#pessoas').append(`<div class="pessoa" id="pessoa"><h2 class="col-md-6" id="${data}">${data}</h2> <input class="btn btn-success" type="submit" id="ligar" value="Ligar"></div>`);
            });
        }
    });

    socket.on('Removendo', data => {
        //$(`#${data}`).remove();
        //$(`#ligar`).remove();
        $(`#pessoa`).remove();
    });

    $('#enviar_mensagem').click(function () {
        if ($('#mensagem').val() == '') {
            alert('Digite uma mensagem');
        }
        else {
            socket.emit(
                'msgParaServidor',
                {
                    apelido: $('#apelido').val(),
                    mensagem: $('#mensagem').val(),
                }
            );
            $('#mensagem').val("");
        }
    });
    
    socket.on('msgParaCliente', function (data) {
        var html = '';
        html += '<div class="dialogo">';
        html += '<h4>' + data.apelido + '</h4>';
        html += '<p>' + data.mensagem + '</p>';
        html += '</div>';
    
        $('#dialogos').append(html);
        window.scrollTo(0, document.body.scrollHeight);
    });

    $('#uploadForm').submit(function () {
        if ($('#arquivo').get(0).files.length === 0) {
            alert('Adicione um arquivo para upload');
        }
        else {
            $("#status").empty().text("File is uploading...");

            $(this).ajaxSubmit({
                error: function (xhr) {
                    status('Error: ' + xhr.status);
                },
                success: function (response) {
                    $("#status").empty().text(response);

                    socket.emit(
                        'arqParaServidor',
                        {
                            apelido: $('#apelido').val(),
                            arquivo: $('#arquivo').val().replace(/C:\\fakepath\\/i, ''),
                        }
                    );
                    $('#arquivo').val("");
                }
            });
        }
        return false;
    });
    
    socket.on('arqParaCliente', function (data1) {
        var html = '';
        html += '<div class="dialogo">';
        html += '<h4>' + data1.apelido + '</h4>';
        html += '<a href="/uploads/' + data1.arquivo + '" download="' + data1.arquivo + '" target="_blank">' + data1.arquivo + '</a>';
        html += '</div>';
    
        $('#dialogos').append(html);
        window.scrollTo(0, document.body.scrollHeight);
    });
});