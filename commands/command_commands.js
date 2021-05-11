const Discord=require('discord.js');
const command=require('../config/configCommand');

const commands= async(channel)=>{
    try {
        const embededMessage=new Discord.MessageEmbed();
        embededMessage.addField(command.setup.command,command.setup.description);
        embededMessage.addField(command.log.command,command.log.description);
        embededMessage.addField(command.help.command,command.help.description);
        embededMessage.addField(command.commands.command,command.commands.description);
        embededMessage.addField(command.create.command,command.create.description);
        embededMessage.addField(command.manage.command,command.manage.description);
        embededMessage.addField(command.add.command,command.add.description);
        embededMessage.setColor('GREEN')
        embededMessage.setTitle('COMMANDS')
        const response=await channel.send('List of commands',{embed:embededMessage});
        return response;
    } catch (error) {
        return null;
    }
}
module.exports=commands;