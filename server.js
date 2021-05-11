require("dotenv").config();
const Discord = require('discord.js');
const client = new Discord.Client();

//configure mongoDB
const mongoose = require('mongoose');
const connectMongo=async()=>{
  try {
    const response=await mongoose.connect(process.env.DATABASE, {useNewUrlParser: true, useUnifiedTopology: true});
    console.log(`Successfully Connected to ${response.connection.client.s.options.dbName}`)
  } catch (error) {
    console.log('could not connect to mongoDB ATLAS');
  }
}
connectMongo();

const createRole=require("./actions/createNewRole");
const command=require('./config/configCommand');

// =======================List of commands====================
const command_commands= require('./commands/command_commands');
const command_help = require('./commands/command_help');
const { command_log } = require("./commands/command_log");
const { command_manage } = require("./commands/command_manage");
const { command_create } = require("./commands/command_create");
const { command_add } = require("./commands/command_add");
const { PREFIX } = require("./config/configRoles");
const { command_setup } = require("./commands/command_setup");

// ====================login as the bot=====================
client.login(process.env.TOKEN);

// ====================Event triggered when the bot is ready to start working=====================
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);

  client.guilds.cache.map(g=>{
      createRole(client,g);
  })
});

// ====================Event triggered when a message has been sent=====================
client.on('message',async msg => {
  if(msg.author.bot)
  {
    return;
  }
  try {
    if(msg.channel.type==='dm')//dm channel massage
    {
      if(msg.content===command.commands.command)
      {
        await command_commands(msg.channel);
      }
      else if(msg.content===command.help.command)
      {
        await command_help(msg.channel);
      }
      else if(msg.content===command.log.command)
      {
        await command_log(msg.channel);
      }
      else if(msg.content===command.manage.command)
      {
        await command_manage(msg.channel);
      }
      else if(msg.content===command.create.command)
      {
        await command_create(msg.channel);
      }
      else if(msg.content===command.add.command)
      {
        await command_add(msg.content);
      }
    }
    else if(msg.channel.type==='text')//text channel massage
    {
      if(msg.content===`${PREFIX}setup`)
      {
        const {status,role,error}= await command_setup(msg.guild,msg.content,msg.member);
        if(error)
        {
          return msg.reply(`something went wrong`);
        }
        if(!status && !error && !role)
        {
          return msg.reply(`you dont have administrator permission`)
        }
        if(status && role)
        {
          return msg.reply(`Role created successfully`);
        }
        if(!status && role)
        {
          return msg.reply(`Role already created`);
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
});
