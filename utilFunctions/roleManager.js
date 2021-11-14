const GuildModel = require('../dataBase/models/guildModel');

const { ROLE } = require('../config/configRoles');
const { RoleModel } = require('../dataBase/models/roleModel');

const storeOrRefreshDataOfGuild = async (guild, roleID) => {
  try {
    const guildRole = await guild.roles.fetch(roleID);
    const response = await GuildModel.findOne({ guildID: guild.id })
    const roleResponse = await RoleModel.findOne({ guildId: guild.id });
    if (roleResponse) {
      if (roleResponse.roleId !== roleID)//role has been changed
      {
        roleResponse.roleId = roleID;
        roleResponse.validMembers = [];
        roleResponse.guildStatus=true;
        await roleResponse.save();
      }
    }
    else {
      const role = new RoleModel({
        guildId: guild.id,
        roleId: roleID,
        guildStatus:true,
        validMembers: []
      })
      await role.save();
    }
    if (response)//guild is already registered
    {
      response.roleID = roleID;
      response.guildName = guild.name;
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
const getArray = collection => {
  let array = [];
  collection.each(g => {
    array.push(g);
  })
  return array;
}
const createDiscordRole = async guild => {
  try {
    const rolesCollection = await guild.roles.fetch();
    const roles = getArray(rolesCollection);
    const registeredGuild = await GuildModel.findOne({ guildID: guild.id });
    if (registeredGuild)//bot was in previous guild
    {
      const viviRoles = roles.filter(r => r.name === ROLE.ROLE_NAME);//all the vivi roles of that guilds
      if (viviRoles)//role matched with database 
      {
        if (viviRoles.length > 1) {
          return { success: false, role: viviRoles, error: null };
        }
        if (viviRoles.length === 1 && viviRoles[0].id !== registeredGuild.roleID) {
          return { success: false, role: viviRoles[0], error: null };
        }
        if (viviRoles.length === 1 && viviRoles[0].id === registeredGuild.roleID) {
          return { success: true, role: viviRoles[0], error: null };
        }
      }
      if (!roles.find(role => role.id === registeredGuild.roleID))//creating a new role 
      {
        const newRole = await guild.roles.create({
          name: ROLE.ROLE_NAME,
          color: ROLE.ROLE_COLOR,
          reason: 'role created for the user to be able to use the bot',
        });
        return { success: true, role: newRole, error: null };
      }
    }
    //fresh guild
    const newRole = await guild.roles.create({
      name: ROLE.ROLE_NAME,
      color: ROLE.ROLE_COLOR,
      reason: 'role created for the user to be able to use the bot',
    });
    return { success: true, role: newRole, error: null };
  } catch (error) {
    return { success: false, role: null, error: error };
  }
}
module.exports = { storeOrRefreshDataOfGuild, createDiscordRole };