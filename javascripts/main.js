updateYearSelect();
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
	
	var nameAttribute = entity === "event" ? "title" : "name";
	$.getJSON("http://playaevents.burningman.com/api/0.2/" + year + "/" + entity + "/?callback=?", function(data) {
		var excluded = ['i', 'of', 'or', 'the', 'n', 'a', 'and', 'an', 'at', 'that', 'la', 'da', 'du', 'de', 'le', 'this', 'be', 'by', 'it', 'for', 'is'];
		var wordCounts = {};
		for (var i = 0; i < data.length; i++) {
			var campNameWords = data[i][nameAttribute]
				.replace(/[\.,'"-\/#!$%\^&\*;:{}=\-_`~()@\+\?><\[\]\+0123456789]/g, '')
				.replace(/\s{2,}/g," ")
				.split(" ")
				.map(function(value) { return value.toLowerCase(); })
				.filter(function(item) { return item.length > 1 && excluded.indexOf(item) === -1; });
			for (var j = 0; j < campNameWords.length; j++) {
				wordCounts[campNameWords[j]] = wordCounts.hasOwnProperty(campNameWords[j]) ? wordCounts[campNameWords[j]] + 1 : 1;
			}
		}

		var final = [];
		var biggest = 0;
		var i = 0;
		for (var foo in wordCounts) {
			final[i] = [foo, wordCounts[foo]];
			i++;
		}
		var biggest = printBiggestWord(final);

		WordCloud($('#word_cloud')[0], {
			list: final,
			fontFamily: 'Helvetica, serif',
			gridSize: 7,
			clearCanvas: true,
			weightFactor: function (size) {
				return Math.log(size) / Math.log(biggest) * (200 - 15) + 15;
			},
			rotateRatio: 0.5,
			minRotation: 1.57079633,
			maxRotation: 1.57079633,
			backgroundColor: '#f2f2f2',
			//minSize: 15
		});
	});
}

function printBiggestWord(count) {
	var biggest = 0;
	for (var i = 0; i < count.length; i++) {
		if (count[i][1] > biggest)
		 biggest = count[i][1];
	}
	console.log('biggest word was ' + biggest);
	return biggest;
}


