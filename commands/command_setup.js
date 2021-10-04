const {Permissions}=require('discord.js');
const createRole = require('../actions/createNewRole');
const { ROLE } = require('../config/configRoles');
const GuildModel=require('../dataBase/models/guildModel');
const { createDiscordRole, storeOrRefreshDataOfGuild } = require('../utilFunctions/roleManager');

const command_setup = async (guild, member) => {
    try {
        if (!member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
            return { status: false, role: null, error: null };
        }
        const roles=await guild.roles.fetch();
        if (roles.find(r=>r.name===ROLE.ROLE_NAME)) {
            return { status: false, role: roles.find(r=>r.name===ROLE.ROLE_NAME), error: null };
        }
        if (!roles.find(r=>r.name===ROLE.ROLE_NAME)) {
            const role=await createRole(guild);
            return { status: true, role: role, error: null };
        }
    } catch (error) {
        console.log(error);
        return { status: false, role: null, error: error };
    }
}
module.exports={command_setup};