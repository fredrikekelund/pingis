"use strict";

Template.players.helpers({
	players: function() {
		return Players.find().fetch();
	}
});
