const GuildModel = require("../dataBase/models/guildModel");

const saveUpdateGuild=async(g)=>{
    try {
        const guild=await g.fetch();
        const model=await GuildModel.findOne({guildID:guild.id});
        model.guildName=guild.name;
        model.guildMemberCount=guild.approximateMemberCount;
        model.guildAvater=guild.iconURL();
        model.isPartnered=guild.partnered;
        await model.save()
    } catch (error) {
        console.log(error);
        return;
    }
}
module.exports={saveUpdateGuild}