const { MessageModel } = require("../dataBase/models/messageModel");
const axios=require('axios')
const findData=async()=>{
    try {
        const response=await MessageModel.find({});
        if(!response)return null;
        let closestTimeData=response[0];
        for (let i = 0; i < response.length; i++) {
            const e = response[i];
            if(e.time<closestTimeData.time)
                closestTimeData=e;
        }
        return closestTimeData;
    } catch (error) {
        return null;
    }
}
const getQueryChannels=(queryChannels,allChannels)=>{
    let validChannel=[];
    for (let i = 0; i < allChannels.length; i++) {
        const e = allChannels[i];
        for (let j = 0; j < queryChannels.length; j++) {
            const k = queryChannels[j];
            if(e.id===k)
                validChannel.push(e)
        }
    }
    return validChannel;
}
const getQueryRoles=(queryRoles,allRoles)=>{
    let validRoles=[];
    for (let i = 0; i < allRoles.length; i++) {
        const e = allRoles[i];
        for (let j = 0; j < queryRoles.length; j++) {
            const k = queryRoles[j];
            if(e.id===k.roleId)
                validRoles.push(e)
        }
    }
    return validRoles;
}
const deleteDoc=async(id)=>{
    try {
        const response=await axios.delete(`${process.env.BACKENDAPI}discord?id=${id}`)
        if(response.status===200)
            return true;
    } catch (error) {
        return false;
    }
}
module.exports={findData,getQueryRoles,getQueryChannels,deleteDoc}