$(document).ready(function() {
	updateYearSelect();
	var stopped = false;
	$('#draw_word_cloud').click(drawWordCloud);
	$('body').on('wordcloudstart', function() {
		stopped = false;
		$('#draw_word_cloud').attr('value', 'stop').off().click(function() {
			stopped = true;
			$('#draw_word_cloud').off().click(drawWordCloud);
		});
	});
	$('body').on('wordcloudstop wordcloudabort', function() {
		$('#draw_word_cloud').attr('value', 'do the thing');
	});
	$('body').on('wordclouddrawn', function() {
		return !stopped;
	});
});

function updateYearSelect() {
	$('#year').empty();
	var entity = $('#entity').val();
	var years = $.grep(['', '2007', '2008', '2009', '2010', '2011', '2012', '2013', '2014'], function(n, i) {
		return entity === "event" ? $.inArray(n, ['2007', '2008']) < 0 : true;
	});
	for (var i = 0; i < years.length; i++) {
		$('#year').append("<option value='" + years[i] + "'>" + years[i] + "</option>");
	}
}

function drawWordCloud() {
	var entity = $('#entity').val(), year = $('#year').val();
	if (entity === "" || year === "")
		return;

	$('#draw_word_cloud').attr('value', 'doing...').off();
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

		var wordCountsArray = makeArrayFromMap(wordCounts);
		var biggestWord = getBiggestWord(wordCountsArray);
		var	colours = ['#FF0000', '#FF8000', '#D4CE19', '#D6CF00', '#C43323', '#ED9015',
					   '#82001E', '#E25822', '#C20A0A', '#9C1919', '#E62600'];
		var maxFont = Math.max(150, $('#word_cloud').width() / 5), minFont = 17, ninetyDegreesInRads = 1.57079633;
		$('#word_cloud').height(window.innerHeight - $('#footer_wrap').height() - $('#main_content').height() - 50);
		WordCloud($('#word_cloud')[0], {
			list: wordCountsArray,
			fontFamily: 'Helvetica, serif',
			gridSize: 7,
			clearCanvas: true,
			weightFactor: function (wordSize) {
				return Math.log(wordSize) / Math.log(biggestWord) * (maxFont - minFont) + minFont;
			},
			rotateRatio: 0.5,
			minRotation: ninetyDegreesInRads,
			maxRotation: ninetyDegreesInRads,
			color: function(word, weight, fontSize, distance, theta) {
				return (colours)[Math.floor(Math.random() * colours.length)];
			},
			backgroundColor: '#212121',
			shape: 'square',
			abortThreshold: 5000
		});
	});
}

function makeArrayFromMap(map) {
	var i = 0, array = [];
	for (var item in map) {
		if (!$('#show_single_words').is(':checked') && map[item] === 1)
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