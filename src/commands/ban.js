const { MessageEmbed } = require("discord.js");
const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require("discord.js")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .addUserOption(option =>
            option.setName('usuário')
                .setDescription('Mencione o usuário a ser punido.')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('motivo')
                .setDescription('Descreva o motivo da punição.')
                .setRequired(true))
        .setDescription('Bane um usuário do servidor de discord.'),
    async execute(interaction, client) {
        let user = interaction.options.getUser("usuário");
        const member = interaction.guild.members.cache.get(user.id) || await interaction.guild.members.fetch(user.id).catch(err => {})
        if (!interaction.member.permissions.has("BAN_MEMBERS")) {
            const BANIDO = new MessageEmbed()
                .setTitle(":lock: SEM PERMISSÃO")
                .setDescription(`${interaction.user}, você não tem permissão para executar este comando.`)
                .setColor("F73F3F")
            interaction.reply({ embeds: [ BANIDO ], ephemeral: true});
        } else if (!member.bannable) {
            const BANIDO = new MessageEmbed()
                .setTitle(":question: ERRO")
                .setDescription(`O usuário ${user} não pode ser banido.`)
                .setColor("F73F3F")
            interaction.reply({ embeds: [BANIDO], ephemeral: true});
        } else {
            let motivo = interaction.options.getString("motivo");
            const BANIDO = new MessageEmbed()
            .setTitle(`:pushpin: NOVA PUNIÇÃO`)
                .setColor('#DD6D1E')
                .addFields(
                    {
                        name: `Usuário`,
                        value: `${user}`,
                        inline: true
                    },
                    {
                        name: `ㅤ`,
                        value: `ㅤ`,
                        inline: true
                    },
                    {
                        name: `Motivo`,
                        value: `\`${motivo}\``,
                        inline: true
                    },
                    {
                        name: `ID`,
                        value: `\`${member.user.id}\``,
                        inline: false
                    })
                .setDescription("Um usuário foi banido do servidor, confira \noutras informações abaixo.")
                member.ban({ reason: motivo })
            return interaction.reply({ embeds: [ BANIDO ]})
        }
    }
}