const Discord=require('discord.js');
const command=require('../config/configCommand');
const help= async(channel)=>{
    try {
        const embededMessage=new Discord.MessageEmbed();
        embededMessage.setURL(`${process.env.FRONTENDAPI}readmore`);
        embededMessage.setColor('GREEN')
        embededMessage.setTitle('HELP')
        embededMessage.addField('Website',`Go to [VIVI](${process.env.FRONTENDAPI}readmore)`);
        embededMessage.addField(command.log.command,`type **${command.commands.command}** to see the full list of commands`);
        embededMessage.setImage('https://lh3.googleusercontent.com/pw/AM-JKLVp-A0OhVBY8tExBYtSWDhmTFQAuHyrcOKFwe6sfG_fD6b4J3dfK_egegS9Se-NdbQKPLztF5jqgG6yjTNrDhN07RbDY-cdFIzBq0Begd7rgQlXHHKd3S6eLfzghfgQBppNQjm-GDqJvUHVBrDT2CY=w1484-h748-no?authuser=0');
        embededMessage.setFooter(`Created By VIVI`);
        embededMessage.setTimestamp(new Date());
        embededMessage.setDescription(`**Having any problem?**Go to our website to see how things works and may be you will be able to master everything that VIVI does.`)
        const response=await channel.send({content:'help',embeds:[embededMessage]});
        return response;
    } catch (error) {
        return null;
    }
}
module.exports=help;