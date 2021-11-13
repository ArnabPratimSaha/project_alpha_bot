const Discord=require('discord.js');
const { v4: uuidv4 } = require('uuid');
const { LinkModel } = require('../dataBase/models/linkModel');
const command=require('../config/configCommand');
const command_create=async(channel,author)=>{
    try {
        const existingData = await LinkModel.findOneAndDelete({discordId:author.id});
        const entryId=uuidv4();
        const link=new LinkModel({
            discordId:author.id,
            entryId:entryId,
            entryTime:new Date()
        })
        await link.save();
        const embededMessage=new Discord.MessageEmbed();
        embededMessage.setTitle('Link Generated')
        embededMessage.setURL(`${process.env.FRONTENDAPI}val/${author.id}/${entryId}/dashboard`);
        embededMessage.setColor('BLUE')
        embededMessage.setImage('https://lh3.googleusercontent.com/pw/AM-JKLVp-A0OhVBY8tExBYtSWDhmTFQAuHyrcOKFwe6sfG_fD6b4J3dfK_egegS9Se-NdbQKPLztF5jqgG6yjTNrDhN07RbDY-cdFIzBq0Begd7rgQlXHHKd3S6eLfzghfgQBppNQjm-GDqJvUHVBrDT2CY=w1484-h748-no?authuser=0');
        embededMessage.setFooter(`Created By VIVI`);
        embededMessage.setTimestamp(new Date());
        embededMessage.addField('Link',`A link has been generated for you\nGo to [VIVI](${process.env.FRONTENDAPI}val/${author.id}/${entryId}/dashboard) to create your massage\nLink will expire in ${10} min`);
        embededMessage.addField('Warning',`**DO NOT SHARE THIS LINK WITH OTHERS**`);
        const response=await channel.send({content:`Generated A link \n${process.env.FRONTENDAPI}val/${author.id}/${entryId}/dashboard`, embeds:[embededMessage] });
        return response;
    } catch (error) {
        console.log(error);
        return null;
    }
}
module.exports={command_create};