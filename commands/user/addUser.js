const { SlashCommandBuilder } = require('discord.js');
const db = require('../../db/db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('agregar-usuario')
        .setDescription('Agrega un usuario a nuestro bot!')
        .addStringOption(option =>
            option
                .setName('nombre')
                .setDescription('Tu nombre')
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName('apellido')
                .setDescription('Tu apellido')
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName('email')
                .setDescription('Tu email')
                .setRequired(true)
        ),
    async execute(interaction) {
        try {
            const name = interaction.options.getString('nombre');
            const lastName = interaction.options.getString('apellido');
            const email = interaction.options.getString('email');
            const id = interaction.user.id;

            const statement = db.prepare(`
        INSERT INTO users (user_id, first_name, last_name, email) 
        VALUES (?, ?, ?, ?)
        `);

            statement.run(id, name, lastName, email);

            await interaction.reply(`Bienvenido <@${id}> al servidor!`);
        } catch (error) {
            if (error.message === 'UNIQUE constraint failed: users.user_id') {
                await interaction.reply(`<@${interaction.user.id}> Tu usuario ya esta registrado`);
            }
        }
    },
};