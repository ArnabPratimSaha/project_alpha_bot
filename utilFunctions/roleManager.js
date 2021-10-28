const GuildModel=require('../dataBase/models/guildModel');

const {ROLE}=require('../config/configRoles');

const storeOrRefreshDataOfGuild = async (guild, roleID) => {
    try {
      const response = await GuildModel.findOne({ guildID: guild.id })
      if (response)//guild is already registered
      {
        response.roleID = roleID;
        response.guildName=guild.name;
        return true;
      }
      else //registering the guild
      {
        const guildModel = new GuildModel({
          guildName: guild.name,
          guildID: guild.id,
          roleID: roleID
        });
        await guildModel.save();
        return true;
  
      }
    } catch (error) {
      return false;
    }
}
const createDiscordRole = async guild => {
  try {
    const roles = await guild.roles.fetch();
    if (!roles.find(role => role.name === ROLE.ROLE_NAME)) {
      const newRole = await guild.roles.create({
          name: ROLE.ROLE_NAME,
          color: ROLE.ROLE_COLOR,
          reason: 'role created for the user to be able to use the bot',
      });
      return { isNew: true, role: newRole,error:null };
    }
    return { isNew: false, role: roles.find(role => role.name === ROLE.ROLE_NAME),error:null };
  } catch (error) {
    return { isNew: false, role: null,error:error };
  }
}
module.exports = { storeOrRefreshDataOfGuild, createDiscordRole };