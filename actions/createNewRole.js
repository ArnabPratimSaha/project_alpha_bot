const Discord = require('discord.js');
const GuildModel = require('../dataBase/models/guildModel');

//util functions
const {storeOrRefreshDataOfGuild,createDiscordRole}=require('../utilFunctions/roleManager');

const createRole = async (guild,channel) => {
  try {
    const {isNew,role}=await createDiscordRole(guild);
    if(!isNew && role)return;//work
    if (isNew) {
      //register the guild in the data base
      if (storeOrRefreshDataOfGuild(guild, role.id)) {
        //send a message a text channel(if there are any) that the role has been created
        if (channel) {
          await channel.send(`Created role **${role.name}**. Members with this role can send message to others.`);
          console.log(`created a role named ${role.name} id ${role.id}`);
        }
      }
      //send a message a text channel(if there are any) that the role could nto be created due to some error
      else {
        if (channel) {
          await channel.send(`could not register the role try again later`);
        }
      }
    }
    else if (!isNew && !role) {
      //role could not be created due to some error
      if (channel) {
        await channel.send(`could not register the role try again later`);
      }
    }
    return role;
  } catch (error) {
    console.log(error);
  }
}


module.exports = createRole;