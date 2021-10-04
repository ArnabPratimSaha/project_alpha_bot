const Discord = require('discord.js');
const GuildModel = require('../dataBase/models/guildModel');

//util functions
const { storeOrRefreshDataOfGuild, createDiscordRole } = require('../utilFunctions/roleManager');

const createRole = async (guild) => {
  try {
    const { isNew, role, error } = await createDiscordRole(guild);
    if (error) throw error;
    await storeOrRefreshDataOfGuild(guild, role.id)
    return role;
  } catch (error) {
    console.log(error);
  }
}


module.exports = createRole;