const Discord=require('discord.js');

const command_add = async (channel,author) => {
    try {
        const embededMessage = new Discord.MessageEmbed();
        embededMessage.setTitle('VIVI')
        embededMessage.setURL(`${process.env.FRONTENDAPI}home`);
        embededMessage.setColor('BLUE')
        embededMessage.setImage('https://lh3.googleusercontent.com/pw/AM-JKLVp-A0OhVBY8tExBYtSWDhmTFQAuHyrcOKFwe6sfG_fD6b4J3dfK_egegS9Se-NdbQKPLztF5jqgG6yjTNrDhN07RbDY-cdFIzBq0Begd7rgQlXHHKd3S6eLfzghfgQBppNQjm-GDqJvUHVBrDT2CY=w1484-h748-no?authuser=0');
        embededMessage.setFooter(`Created By VIVI`);
        embededMessage.setTimestamp(new Date());
        embededMessage.addField('Link', `A link has been generated for you\nGo to [VIVI](${process.env.FRONTENDAPI}home) website add bot to your server.`);
        embededMessage.addField('VIVI', `**VIVI is a bot that takes care your problems of managing messages,with VIVI in your server you can stop worrying about fogetting to send something to your server and friends.VIVI can send message in both discord channel and also in their personal DM**`);
        const response = await channel.send({ content: `Generated A link \n${process.env.FRONTENDAPI}home`, embeds: [embededMessage] });
    } catch (error) {
        console.log(error);
    }
}
module.exports = { command_add };