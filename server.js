require("dotenv").config();
const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.GUILD_PRESENCES, Intents.FLAGS.GUILD_MEMBERS], partials: ["CHANNEL"] });

//configure mongoDB
const mongoose = require('mongoose');
const connectMongo = async () => {
  try {
    const response = await mongoose.connect(process.env.DATABASE, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log(`Successfully Connected to ${response.connection.client.s.options.dbName}`)
  } catch (error) {
    console.log('could not connect to mongoDB ATLAS');
  }
}
connectMongo();

const createRole = require("./actions/createNewRole");
const command = require('./config/configCommand');
const { PREFIX } = require("./config/configRoles");

// =======================List of commands====================
const command_commands = require('./commands/command_commands');
const command_help = require('./commands/command_help');
const { command_log } = require("./commands/command_log");
const { command_create } = require("./commands/command_create");
const { command_add } = require("./commands/command_add");
const { command_setup } = require("./commands/command_setup");

const { MessageModel } = require('./dataBase/models/messageModel');
const { findData, getQueryRoles, getQueryChannels } = require("./utilFunctions/findClosestTimeDoc");
const { sendMessage } = require("./utilFunctions/sendMessage");
const { saveUpdateGuild } = require("./utilFunctions/manageGuilds");
const GuildModel = require("./dataBase/models/guildModel");
const { RoleModel } = require("./dataBase/models/roleModel");


// ====================login as the bot=====================
client.login(process.env.TOKEN);

let time;
let timeout;
const handleMessageSent = async (client) => {
  if (timeout) clearImmediate(timeout);
  try {
    const data = await findData();
    if (!data) return;
    time = data.time - new Date();
    if (time < 0) {
      await sendMessage(data, client);
      return;
    }
    timeout = setTimeout(() => {
      sendMessage(data, client);
    }, time);
  } catch (error) {
    console.log(error);
  }
}
// ====================Event triggered when the bot is ready to start working=====================
client.on('ready', async () => {
  try {
    console.log(`Logged in as ${client.user.tag}!`);
    client.guilds.cache.map(async g => {
      await createRole(g);
      await saveUpdateGuild(g)
    })
    handleMessageSent(client);
    MessageModel.watch().on('change', async (change) => {
      handleMessageSent(client)
    })
  } catch (error) {
    console.log(error);
  }
});

// ====================Event triggered when a message has been sent=====================
client.on('messageCreate', async msg => {
  if (msg.author.bot) return;
  try {
    if (msg.channel.type === 'DM')//dm channel massage
    {
      if (msg.content === command.commands.command) {
        await command_commands(msg.channel);
      }
      else if (msg.content === command.help.command) {
        await command_help(msg.channel);
      }
      else if (msg.content === command.log.command) {
        await command_log(msg.channel, msg.author, client);
      }
      else if (msg.content === command.create.command) {
        await command_create(msg.channel, msg.author);
      }
      else if (msg.content === command.add.command) {
        await command_add(msg.channel, msg.author);
      }
    }
    else if (msg.channel.type === 'GUILD_TEXT')//text channel massage
    {
      if (msg.content === `${PREFIX}setup`) {
        const { status, role, error } = await command_setup(msg.guild, msg.member);
        if (error) return msg.reply(`something went wrong.`);
        if (!status && !role) return msg.reply(`Only members with **Administrator** role have the permission to ceate or update role.`);
        if (!status && role) return msg.reply(`ROLE ${role} is already created.Delete the role inorder to create another.`);
        msg.reply(`ROLE ${role} is Created And Updated.`)
      }
    }
  } catch (error) {
    console.log(error);
  }
});
client.on('interactionCreate', interaction => {
  if (!interaction.isButton()) return;
  console.log(interaction);
});
const getArray = collection => {
  let array = [];
  collection.each(g => {
    array.push(g);
  })
  return array;
}
client.on('guildMemberUpdate', async (oldMember, newMember) => {
  try {
    const guild = newMember.guild;
    const roleData = await RoleModel.findOne({ guildId: guild.id });
    const oldRole = getArray(oldMember.roles.cache).filter(r => r.id === roleData.roleId)[0];
    const newRole = getArray(newMember.roles.cache).filter(r => r.id === roleData.roleId)[0];
    // console.log({old:oldRole?'true':'false',new:newRole?'true':'false'});
    if (!oldRole && newRole)//assigned the vivi role
    {
      roleData.validMembers.push(newMember.id);
      await roleData.save();
    }
    if (oldRole && !newRole)//removed the VIVI role
    {
      const previousMembers = roleData.validMembers;
      if (previousMembers) {
        const newMembers = previousMembers.filter(m => m !== newMember.id);
        roleData.validMembers = newMembers;
        await roleData.save();
      }
    }
  } catch (error) {
    console.log(error);
  }
});
client.on('guildCreate', async (g) => {
  try {
    await createRole(g);
    await saveUpdateGuild(g);

    const roleData = await RoleModel.findOne({ guildId: g.id });
    if (roleData) {
      roleData.guildStatus = true;
      await roleData.save();
    }
  } catch (error) {
    console.log(error);
  }
});
client.on('guildDelete', async (g) => {
  try {
    const roleData = await RoleModel.findOne({ guildId: g.id });
    if (roleData) {
      roleData.guildStatus = false;
      await roleData.save();
    }
  } catch (error) {
    console.log(error);
  }
});
client.on('roleDelete', async (role) => {
  try {
    const guild = role.guild;
    const roleData = await RoleModel.findOne({ guildId: guild.id });
    if (role.id !== roleData.roleId) return;
    roleData.validMembers = [];
    await roleData.save();
  } catch (error) {
    console.log(error);
  }
})