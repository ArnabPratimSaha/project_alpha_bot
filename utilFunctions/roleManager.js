const GuildModel=require('../dataBase/models/guildModel');

const {ROLE}=require('../config/configRoles');

const storeOrRefreshDataOfGuild = async (guild, roleID) => {
    try {
      const response = await GuildModel.findOne({ guildID: guild.id })
      if (response)//guild is already registered
      {
        response.roleID = roleID;
        await response.save();
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
    if (!guild.roles.cache.find(role => role.name ===  ROLE.ROLE_NAME)) {
      try {
        const role = await guild.roles.create({
          data: {
            name: ROLE.ROLE_NAME,
            color: ROLE.ROLE_COLOR,
          },
          reason: 'role created for the user to be able to use the bot',
        });
        return {status:true,role:role};
      } catch (error) {
          return {status:false,role:null};
      }
    }
    return {status:false,role:guild.roles.cache.find(role => role.name === ROLE.ROLE_NAME)};
}
module.exports={storeOrRefreshDataOfGuild,createDiscordRole};