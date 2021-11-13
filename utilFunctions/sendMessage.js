const { getQueryChannels, deleteDoc } = require("./findClosestTimeDoc")
const Discord = require('discord.js');
const { logModel, status } = require('../dataBase/models/logModel');
const axios = require('axios');
const messageType = {
    CHANNEL: 'CHANNEL',
    DM: 'DM'
}
const getArray = collection => {
    let array = [];
    collection.each(g => {
        array.push(g);
    })
    return array;
}
const getRoles = async (guild, roleIds) => {
    try {
        var string = ``;
        for (let i = 0; i < roleIds.length; i++) {
            const e = roleIds[i];
            const role = await guild.roles.fetch(e);
            if (role)
                string += ` <@&${role.id}>`
        }
        return string;
    } catch (error) {
        return string;
    }
}
const changeStatus = async (status, messageId) => {
    try {
        const response = await axios.patch(`${process.env.BACKENDAPI}log/status?id=${messageId}&status=${status}`)
        if (response.status === 200)
            return;
    } catch (error) {
        console.log(error);
        if (axios.isAxiosError(error)) return;
    }
}
const getNames = async (clent, id) => {
    var string = ``;
    try {
        for (let i = 0; i < id.length; i++) {
            const e = id[i];
            const user = await clent.users.fetch(e);
            string += `<@${user.id}> `
        }
        return string;
    } catch (error) {
        //fix
        return string;
    }
}
const getMessage = (title, message, sender) => {
    return `Message created By <@${sender}>\n\n**${title}**\n${message}\n`;
}
const sendMessage = async (data, client) => {
    try {
        const guild = await client.guilds.fetch(data.targetGuild)
        const embeded = new Discord.MessageEmbed();
        embeded.setColor('BLURPLE');
        const user = await client.users.fetch(data.sender);
        embeded.setTitle(`Message Created By **${user.username}** Using VIVI`)
        embeded.setFooter(`Created By VIVI`);
        embeded.setTimestamp(new Date());
        if (data.type === messageType.CHANNEL) {
            const validChannels = getQueryChannels(data.channels, getArray(guild.channels.cache));
            validChannels.forEach(async (c) => {
                const roleNames = await getRoles(guild, data.role);
                try {
                    const names = await getNames(client, data.members)
                    await c.send({ content: `${names} ${roleNames}\n${getMessage(data.title, data.message, user.id)}`, embeds: [embeded] });
                } catch (e) {
                    console.log('could not send a message to channel');//work
                    await deleteDoc(data.messageId);
                    await changeStatus(status.CANCELLED, data.messageId);
                }
            })
            await changeStatus(status.SENT, data.messageId);
            await deleteDoc(data.messageId);
            return true;
        }
        for (let i = 0; i < data.members.length; i++) {
            const e = data.members[i];
            const response = await client.users.fetch(e);
            if (response) {
                try {
                    await response.send({ content: `${getMessage(data.title, data.message, user.id)}`, embeds: [embeded] });
                } catch (e) {
                    console.log('could not send a message');//work
                    await deleteDoc(data.messageId);
                    await changeStatus(status.CANCELLED, data.messageId);
                }
            }
            else {
                //deleted users from discord
            }
        }
        await changeStatus(status.SENT, data.messageId);
        await deleteDoc(data.messageId);
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}
module.exports = { sendMessage }