const Discord=require('discord.js');
const { v4: uuidv4 } = require('uuid');
const { LinkModel } = require('../dataBase/models/linkModel');
const command=require('../config/configCommand');

const command_create=async(channel,author)=>{
    try {
        const existingData = await LinkModel.findOneAndDelete({userID:author.id});

        const link=new LinkModel({
            userID:author.id,
            entryID:uuidv4(),
            entryTime:new Date()
        })
        await link.save();
        const embededMessage=new Discord.MessageEmbed();
        embededMessage.setTitle('Link Generated')
        embededMessage.setURL('https://www.twitch.tv/directory');
        embededMessage.setColor('BLUE')
        embededMessage.addField('Link',`A link has been generated for you\nGo to [TWITCH](https://www.twitch.tv/directory) to create your massage\nLink will expire in ${10} min`);
        const response=await channel.send('help',{embed:embededMessage});
        return response;
    } catch (error) {
        console.log(error);
        return null;
    }
}
module.exports={command_create};