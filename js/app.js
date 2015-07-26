/* global sharing */
Array.prototype.pick = function() {
  return this[Math.floor(Math.random()*this.length)];
};

var states = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California',
  'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 
  'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 
  'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 
  'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 
  'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
  'New Jersey', 'New Mexico', 'New York', 'North Carolina', 
  'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 
  'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 
  'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 
  'West Virginia', 'Wisconsin', 'Wyoming'
];

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
          url: "http://api.bing.net/qson.aspx",
          dataType: 'jsonp',
          jsonp: "JsonCallback",
          data: {
            JsonType: "callback",
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

function generate(nounPlural, verb) {
  nounPlural = nounPlural || nouns.pick().pluralize();
  verb = verb || verbs.pick();
  var generatedText = '<em>' + verb + '</em> ALL the <em>' + nounPlural + '</em>';
  var sharedText = verb + ' ALL the ' + nounPlural;
  $('#content').html(generatedText);
  var shareUrl = window.location.href.split('?')[0]+'?word='+sharing.encodeStr(verb)+'$'+sharing.encodeStr(nounPlural);
  $('#share').attr('href', shareUrl);
  $('.twitter-share-button').remove();
  $('#twitterShare').html('<a href="https://twitter.com/share" class="twitter-share-button" data-url="' + shareUrl + '" data-text="' + sharedText + '" data-lang="en">Tweet</a>');
  if (twttr.widgets) {
    twttr.widgets.load();
  }
}

$('#generate').click(function() { generate(); });
