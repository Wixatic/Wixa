const fs = require('node:fs');
const path = require('node:path');
// Require the necessary discord.js classes
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const dotenv = require('dotenv');
dotenv.config();

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);

	console.log(`Loading Event [${filePath}]...`);

	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
		console.log(`${event.name} is loaded to the listeners once.\n`);
	}
	else {
		client.on(event.name, (...args) => event.execute(...args));
		console.log(`${event.name} is loaded to the listeners and listening right now.\n`);
	}
}

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);

	console.log(`Loading Command [${filePath}]...`);

	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
		console.log(`${command.data.name} is added to 'commands' collection.\n`);
	}
	else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.\n`);
	}
}

console.log('Logging in on to the Client.');
// Log in to Discord with your client's token
client.login(process.env.DISCORD_TOKEN);