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
        const response=await command_commands(msg.channel);
        // console.log(response);
      }
      else if(msg.content===command.help.command)
      {
        command_help(msg.channel);
      }
    }
    else if(msg.channel.type==='text')//text channel massage
    {
      
    }
  } catch (error) {
    console.log(error);
  }
});
