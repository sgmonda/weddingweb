var WEDDING_TIME = '2018-10-27T11:00:00.000Z';
var GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/AKfycbxxySTM5dWspynl129Ir2peTY6ujx2g4AF_AMF6vAN59pOBBPUc/exec';

function getTimeRemaining(endtime) {
  var t = Date.parse(endtime) - Date.parse(new Date());
  var segundos = Math.floor((t / 1000) % 60);
  var minutos = Math.floor((t / 1000 / 60) % 60);
  var horas = Math.floor((t / (1000 * 60 * 60)) % 24);
  var dias = Math.floor(t / (1000 * 60 * 60 * 24));

  return {
    'total': t >= 0 ? t : 0,
    'dias': dias >= 0 ? dias : 0,
    'horas': horas >= 0 ? horas: 0,
    'minutos': minutos >= 0 ? minutos : 0,
    'segundos': segundos >= 0 ? segundos : 0
  };
}

$(function () {
  $('.block > a').click(function () {
    var isHidden = $(this).next()[0].style.display === 'none';
    var classes = $(this).find('i')[0].className;
    classes = isHidden ? classes.replace(/down/g, 'up') : classes.replace(/up/g, 'down');
    $(this).find('i')[0].className = classes;
    $(this).find('i')[1].className = classes;
    $(this).find('small').html(isHidden ? 'ocultar' : 'ver más')
    $(this).next().slideToggle();
  });

  setInterval(function () {
    const time = getTimeRemaining(WEDDING_TIME);
    $('#countdown > span').html(time.dias + ' días, ' + time.horas + ' horas, ' + time.minutos + ' minutos y ' + time.segundos + ' segundos');
  }, 1000);

  $('form').submit(function (e) {
    e.preventDefault();
    const form = this;
    var data = $(this).serialize()
    $.ajax({
      url: GOOGLE_SHEET_URL,
      method: "GET",
      dataType: "json",
      data: data,
      success: function (data) {
        $(form)[0].reset();
        setTimeout(function () {
          alert('Formulario enviado correctamente. Gracias.');
        }, 100);
      },
      error: function (e) {
        alert('Ha ocurrido un error. Inténtalo de nuevo o ponte en contacto en sgmonda@gmail.com');
        console.log('ERROR', e);
      },
    });
  });
});
