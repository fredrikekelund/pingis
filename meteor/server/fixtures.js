"use strict";

if (Players.find().count() === 0) {
	var addPlayer = function(player) {
		Players.insert({
			image: player.image,
			name: player.name
		});
	};

	[{
		name: "Daniel",
		image: "daniel.png"
	}, {
		name: "Fredrik",
		image: "fredrik.png"
	}, {
		name: "Johannes",
		image: "johannes.png"
	}, {
		name: "Linus",
		image: "linus.png"
	}, {
		name: "Roland",
		image: "roland.png"
	}].forEach(addPlayer);
}