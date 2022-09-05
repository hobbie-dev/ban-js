// Require the necessary discord.js classes
const Discord = require("discord.js");
const { Client, Intents } = require('discord.js');
require("dotenv").config();
const fs = require("fs");

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.once('ready', async () => {
    console.log('A aplicação BOT foi iniciada.');
})
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

const commands = [];
const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));

const clientId = '111111111111111111'; // ID do BOT
const guildId = '222222222222222222'; // ID do servidor


for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log('Iniciada a atualização dos comandos.');

        await rest.put(
            Routes.applicationCommands(clientId),
            { body: commands },
        );

        console.log('Comandos (/) recarregados com sucesso.');
    } catch (error) {
        console.error(error);
    }
})();
const { Collection } = require('discord.js');

client.commands = new Collection();

for (const file of commandFiles) {

    const command = require(`./commands/${file}`);

    client.commands.set(command.data.name, command);
}

for (const file of commandFiles) {

    const command = require(`./commands/${file}`);
    commands.push(command.data.toJSON());
}

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'Esse comando foi carregado incorretamente.', ephemeral: true });
    }
});

client.login(process.env.TOKEN);
