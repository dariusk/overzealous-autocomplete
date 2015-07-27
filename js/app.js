Array.prototype.pick = function() {
  return this[Math.floor(Math.random()*this.length)];
};

var letters='bcdfghjklmnpqrstvwxyz'.split('');
var vowels='aeiou'.split('');
function pair(word) {
  word = word.toLowerCase();
  var len = word.length - 1;
  var endsVowel = false;
  // if ends in space or blank, pick anything
  if (word[len] === ' ' || word === '') {
    return (Math.random() < 0.5) ? letters.pick()+vowels.pick() : vowels.pick()+letters.pick();
  }
  if (
    word[len] === 'a' ||
    word[len] === 'e' ||
    word[len] === 'i' ||
    word[len] === 'o' ||
    word[len] === 'u'
    ){
    endsVowel = true;
  }
  return (endsVowel) ? letters.pick()+vowels.pick() : vowels.pick()+letters.pick();
}

$(function() {
  $('.input').autocomplete({
    appendMethod: 'replace',
   source:[
    function( q,add ){
      $.ajax({
          url: 'http://api.bing.net/qson.aspx',
          dataType: 'jsonp',
          jsonp: 'JsonCallback',
          data: {
            JsonType: 'callback',
            Query: q+pair(q),
            client: 'chrome'
          },
          success: function( response ) {
            console.log( response ); // server response
            response.SearchSuggestion.Section.length = 4;
            add(response.SearchSuggestion.Section.map(function(d){return d.Text;}));
          }
      });
    }
   ]
  });
});
