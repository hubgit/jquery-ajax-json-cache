$(function() {
  $.getJSON('http://www.bbc.co.uk/bbcone/programmes/schedules/london/today.json', function(data) {
    console.log(data);
    $('textarea').html(JSON.stringify(data, null, '  '));
  });
});