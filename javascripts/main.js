var words = [];
$.getJSON("http://playaevents.burningman.com/api/0.2/2013/camp/?callback=?", function(data) {
		for (var i = 0; i < data.length; i++) {
			words = words.concat(data[i].name.split(" "));
		}
		
		var count = {};
		for (var i = 0; i < words.length; i++) {
			if (count.hasOwnProperty(words[i]))
				count[words[i]] = parseInt(count[words[i]], 10) + 1;
			else
				count[words[i]] = 1;
		}
		
		var final = [];
		var i = 0;
		for (var foo in count) {
			final[i] = [foo, count[foo]];
			i++;
		}
		
		WordCloud($('#word_cloud')[0], {
			list: final,
			fontFamily: 'Times, serif',
			//gridSize: Math.round(16 * $('#word_cloud').width() / 1024),
			//clearCanvas: true,
			weightFactor: function (size) {
				return Math.pow(size, 2.3) * $('#word_cloud').width() / 512;
			},
		});
		
		
		/*var fill = d3.scale.category20();

		d3.layout.cloud().size([300, 300])
			.words(words.map(function(d) {
					return {text: d, size: 10 + Math.random() * 90};
				}))
			.padding(5)
			.rotate(function() { return ~~(Math.random() * 2) * 90; })
			.font("Impact")
			.fontSize(function(d) { return d.size; })
			.on("end", draw)
			.start();

		function draw(words) {
			d3.select("#word_cloud").append("svg")
				.attr("width", 300)
				.attr("height", 300)
				.append("g")
				.attr("transform", "translate(150,150)")
				.selectAll("text")
				.data(words)
				.enter().append("text")
				.style("font-size", function(d) { return d.size + "px"; })
				.style("font-family", "Impact")
				.style("fill", function(d, i) { return fill(i); })
				.attr("text-anchor", "middle")
				.attr("transform", function(d) {
					return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
				})
				.text(function(d) { return d.text; });
		  }*/
	});

