$(document).ready(function () {
    $("#exibe_chat").click(function () {
        $("#conversa").show();
        $("#participantes").hide();
        $("#sala").hide();
        ocultaNavbar();
    });
    $("#exibe_participantes").click(function () {
        $("#participantes").show();
        $("#conversa").hide();
        $("#sala").hide();
        ocultaNavbar();
    });

    $("#exibe_sala").click(function () {
        $("#sala").show();
        $("#participantes").hide();
        $("#conversa").hide();
        ocultaNavbar();
    });
});
function ocultaNavbar() {
    $("#btn_navbar_toggle").attr("class", "navbar-toggle collapsed");
    $("#navbar-collapse-1").attr("class", "navbar-collapse collapse");
    $("#btn_navbar_toggle").attr("aria-expanded", "false");
    $("#navbar-collapse-1").attr("aria-expanded", "false");
}