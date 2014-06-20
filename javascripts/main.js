$(document).ready(function() {
	updateYearSelect();
});

function updateYearSelect() {
	$('#year').empty();
	var entity = $('#entity').val();
	var years = $.grep(['', '2007', '2008', '2009', '2010', '2011', '2012', '2013', '2014'], function(n, i) {
		return entity === "event" ? n !== "2007" && n !== "2008" : true;
	});
	for (var i = 0; i < years.length; i++) {
		$('#year').append("<option value='" + years[i] + "'>" + years[i] + "</option>");
	}
}

function drawWordCloud() {
	var entity = $('#entity').val();
	var year = $('#year').val();
	if (entity === "" || year === "")
		return;

	$('#draw_word_cloud').attr('value', 'doing...');
	$('#word_cloud').height(window.innerHeight - $('#footer_wrap').height() - $('#main_content').height() - 40);
	
	$.getJSON("http://playaevents.burningman.com/api/0.2/" + year + "/" + entity + "/?callback=?", function(data) {
		var excluded = ['i', 'of', 'or', 'the', 'n', 'a', 'and',
						'an', 'at', 'that', 'la', 'da', 'du', 'de',
						'le', 'this', 'be', 'by', 'it', 'for',
						'is', 'to', 'in', 'on', 'as', 'do', 'then',
						'your', 'we', 'got', 'th', 'rd'];
		var wordCounts = {};
		for (var i = 0; i < data.length; i++) {
			var campNameWords = data[i][entity === "event" ? "title" : "name"]
				.replace(/[\.,'"#!$%\^&\*’”;:{}=_`~()@\+\?><\[\]\+0123456789]/g, '')
				.replace(/\s{2,}/g," ")
				.split(/[\s —–\-\/]+/)
				.map(function(value) { return value.toLowerCase(); })
				.filter(function(item) { return item.length > 1 && excluded.indexOf(item) === -1; });
			for (var j = 0; j < campNameWords.length; j++) {
				wordCounts[campNameWords[j]] = wordCounts.hasOwnProperty(campNameWords[j]) ? wordCounts[campNameWords[j]] + 1 : 1;
			}
		}

		var showSingles = $('#show_single_words').is(':checked');
		var wordCountsArray = makeArrayFromMap(wordCounts, showSingles);
		var biggest = getBiggestWord(wordCountsArray);
		WordCloud($('#word_cloud')[0], {
			list: wordCountsArray,
			fontFamily: 'Helvetica, serif',
			gridSize: 7,
			clearCanvas: true,
			weightFactor: function (size) {
				return Math.log(size) / Math.log(biggest) * (220 - 17) + 17;
			},
			rotateRatio: 0.5,
			minRotation: 1.57079633,
			maxRotation: 1.57079633,
			color: function(word, weight, fontSize, distance, theta) {
				var	colours = ['#FF0000', '#FF8000', '#D4CE19', '#D6CF00', '#C43323', '#ED9015', '#82001E', '#E25822', '#C20A0A', '#9C1919', '#E62600'];
				return (colours)[Math.floor(Math.random() * colours.length)];
			},
			backgroundColor: '#212121',
			shape: 'square',
			abortThreshold: 200
			//hover: function() {window.drawBox}
		});
		$('#draw_word_cloud').attr('value', 'do the thing');
	});
}

function makeArrayFromMap(map, showSingles) {
	var i = 0, array = [];
	for (var item in map) {
		if (!showSingles && map[item] === 1)
			continue;
		array[i] = [item, map[item]];
		i++;
	}
	return array;
}

function getBiggestWord(wordCountsArray) {
	var biggest = 0;
	for (var i = 0; i < wordCountsArray.length; i++) {
		if (wordCountsArray[i][1] > biggest)
			biggest = wordCountsArray[i][1];
	}
	return biggest;
}


