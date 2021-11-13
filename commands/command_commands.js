const Discord=require('discord.js');
const command=require('../config/configCommand');

const commands= async(channel)=>{
    try {
        const embededMessage=new Discord.MessageEmbed();
        embededMessage.setTitle('COMMANDS')
        embededMessage.addField(`Setup The Bot`,`\`${command.setup.command}\` to ${command.setup.description}`);
        embededMessage.addField(`View your log`,`\`${command.log.command}\` to ${command.log.description}`);
        embededMessage.addField(`Request Help`,`\`${command.help.command}\` to ${command.help.description}`);
        embededMessage.addField(`Commands`,`\`${command.commands.command}\` to ${command.commands.description}`);
        embededMessage.addField(`Create a link to start writing messages`,`\`${command.create.command}\` to ${command.create.description}`);
        embededMessage.addField(`A link to bot to your server`,`\`${command.add.command}\` to ${command.add.description}`);
        embededMessage.setFooter(`Created By VIVI`);
        embededMessage.setTimestamp(new Date());
        embededMessage.setColor('GREEN')
        const response=await channel.send({content:'List of commands',embeds:[embededMessage]});
        return response;
    } catch (error) {
        return null;
    }
}
module.exports=commands;