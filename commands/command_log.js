const Discord = require('discord.js');
const axios = require('axios');
const toggleIndex = ['all', 'sent', 'processing', 'cancelled'];
const { getQueryChannels } = require('../utilFunctions/findClosestTimeDoc');
const { LinkModel } = require('../dataBase/models/linkModel');
const { v4: uuidv4 } = require('uuid');
const getArray = collection => {
    let array = [];
    collection.each(g => {
        array.push(g);
    })
    return array;
}
const getNames = (id) => {
    var string = ``;
    for (let i = 0; i < id.length; i++) {
        const e = id[i];
        string += `<@${id}> `
    }
    return string;
}
const getRoles = async (client, guildId, roleIds) => {
    try {
        const guild = await client.guilds.fetch(guildId);
        var string = ``;
        for (let i = 0; i < roleIds.length; i++) {
            const e = roleIds[i];
            const role = await guild.roles.fetch(e);
            if (role)
                string += `\`${role.name}\`,`
            else
                string += `\`Deleted Channel\` ,`;
        }
        return string;
    } catch (error) {
        return string;
    }
}
const getChannels = async (client, guildId, channelIds) => {
    try {
        const guild = await client.guilds.fetch(guildId);
        var string = ``;
        const validChannels = getQueryChannels(channelIds, getArray(guild.channels.cache));
        for (let i = 0; i < validChannels.length; i++) {
            const channel = validChannels[i];
            if (channel)
                string += `\`${channel.name}\` ,`;
            else
                string += `\`Deleted Channel\` ,`;

        }
        return string;
    } catch (error) {
        return string;
    }
}
const message = async (client, index, max, targetGuild, sender, messageType, members, roles, channels, epoch) => {
    try {
        let string = `${index % 2 === 0 ? `<@${sender}>\n` : ''} :clock9:<t:${epoch}:R>\n\nThis is preview Of the message.This is ${index + 1} of the ${max} messages.\nMessage Type **${messageType}**\n`;
        if (messageType === 'DM') {
            if (members.length > 0)
                string += `**Users** ${getNames(members)}`
        }
        else {
            if (channels.length > 0)
                string += `**Channels** ${await getChannels(client, targetGuild, channels)}\n`;
            if (members.length > 0)
                string += `**Members** ${getNames(members)}\n`;
            if (roles.length > 0)
                string += `**Roles** ${await getRoles(client, targetGuild, roles)}`;
        }
        return `=========================================================\n${string}`;

    } catch (error) {
        console.log(error);
    }
}
const command_log = async (channel, author, client) => {
    try {
        const existingData = await LinkModel.findOneAndDelete({discordId:author.id});
        const entryId=uuidv4();
        const link=new LinkModel({
            discordId:author.id,
            entryId:entryId,
            entryTime:new Date()
        })
        await link.save();
        const res = await axios.get(`${process.env.BACKENDAPI}log/searchinfo?limit=${3}&page=${1}&type=${toggleIndex[2]}&did=${author.id}&fav=${false}`);
        const response = await channel.send({ content: 'log' });
        for (let i = 0; i < res.data.length; i++) {
            const data = res.data[i];
            var myDate = new Date(data.time);
            var epoch = (myDate.getTime() - myDate.getMilliseconds()) / 1000.0;
            const embededMessage = new Discord.MessageEmbed();
            embededMessage.setTitle(data.title)
            embededMessage.setColor('GREEN')
            embededMessage.setDescription(data.message)
            embededMessage.setFooter(`Created By VIVI`);
            embededMessage.setTimestamp(new Date());
            const response = await channel.send({ content: await message(client, i, res.data.length, data.targetGuild, author.id, data.messageType, data.members, data.role, data.channels, epoch), embeds: [embededMessage] });
        }
        await channel.send({ content: `<@${author.id}> For full log visit VIVI :globe_with_meridians: :${process.env.FRONTENDAPI}val/${author.id}/${entryId}/dashboard` });
    } catch (error) {
        console.log(error);
    }

}
module.exports = { command_log };