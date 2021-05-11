const Discord=require('discord.js');
const command=require('../config/configCommand');
const help= async(channel)=>{
    try {
        const embededMessage=new Discord.MessageEmbed();
        embededMessage.addField(command.log.command,`$type **{command.log.description}** to see the full list of commands`);
        embededMessage.setURL('https://www.twitch.tv/directory');
        embededMessage.setColor('GREEN')
        embededMessage.setTitle('HELP')
        embededMessage.addField('GOTO',`[TWITCH](https://www.twitch.tv/directory)`);
        embededMessage.setDescription(`haidhadaw dhwhd wadhw adhawidhiawhdwahdaw  d**aiwdhia** *dawdawd*\n
        dwadwadwadd **wd wad awd awdwd wadw dwad ad**\n
        da\n`)
        const response=await channel.send('help',{embed:embededMessage});
        return response;
    } catch (error) {
        return null;
    }
}
module.exports=help;