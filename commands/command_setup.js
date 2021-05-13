const Discord=require('discord.js');
const { ROLE } = require('../config/configRoles');
const GuildModel=require('../dataBase/models/guildModel');
const { createDiscordRole, storeOrRefreshDataOfGuild } = require('../utilFunctions/roleManager');
const findRole= (roles,roleName)=>{
    for (let i = 0; i < roles.length; i++) {
        const role = roles[i];
        if(role.name==roleName)
        {
            return role;
        }
    }
    return null;
}

const command_setup=async(guild,channel,member)=>{
    if (!member.hasPermission('ADMINISTRATOR')) {
        return { status: false, role: null, error:null };
    }
    if (findRole(guild.roles.cache.array(), ROLE.ROLE_NAME)) {
        return { status: false, role: findRole(guild.roles.cache.array(), ROLE.ROLE_NAME),error:null };
    }
    try {
        const { status, role } = await createDiscordRole(guild);
    
        if (role) {
            const res=await storeOrRefreshDataOfGuild(guild, role.id);
            return {status:res,role:role,error:null}
        }
        const error=new Error;
        return {status:false,role:null,error:error};
    } catch (error) {
        return {status:false,role:null,error:error};
    }
}
module.exports={command_setup};