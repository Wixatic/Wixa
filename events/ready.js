const { Events } = require('discord.js');

module.exports = {
	name: Events.ClientReady,
	once: true,

	execute(client) {
		// When the client is ready, run this code (only once)
		console.log(`Ready! Logged in as ${client.user.tag}.  ${client.user.username} is at your service.`);
	},
};