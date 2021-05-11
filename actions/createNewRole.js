const Discord = require('discord.js');
const GuildModel = require('../dataBase/models/guildModel');

//util functions
const {storeOrRefreshDataOfGuild,createDiscordRole}=require('../utilFunctions/roleManager');


const getTextChannel = channels => {
  for (let i = 0; i < channels.length; i++) {
    const e = channels[i];
    if (e.type === 'text') {
      return e;
    }
  }
  return null;
}
const createRole = async (client, guild) => {
  try {
    const {status,role}=await createDiscordRole(guild);
    const textChannel = getTextChannel(guild.channels.cache.array());
    if(status)
    {
      //register the guild in the data base
      if (storeOrRefreshDataOfGuild(guild, role.id)) {
        //send a message a text channel(if there are any) that the role has been created
        if (textChannel) {
          await textChannel.send(`created a role named ${role.name} and successfully registered`);
          console.log(`created a role named ${role.name} id ${role.id}`);
        }
      }
      //send a message a text channel(if there are any) that the role could nto be created due to some error
      else {
        if (textChannel) {
          await textChannel.send(`could not register the role try again later`);
        }
      }
    }
    else if(!status && !role)
    {
      //role could not be created due to some error
      if (textChannel) {
        await textChannel.send(`could not register the role try again later`);
      }
    }

  } catch (error) {
    throw error;
  }
}


module.exports = createRole;