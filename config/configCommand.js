const ROLE=require('./configRoles');

const botCommand={
    log:{
        command:'log',
        description:`logs out your massage by time **(only if you the role ${ROLE.ROLE_NAME})**`
    },
    setup:{
        command:'setup',
        description:`add a bot to your server and ready your server to have the feature **(only if you the role ${ROLE.ROLE_NAME})**`
    },
    help:{
        command:'help',
        description:'shows you the commands and also gives you a brief description on how it works'
    },
    commands:{
        command:'commands',
        description:'shows every command'
    },
    create:{
        command:'create',
        description:`gives to link to create the massage **(only if you the role ${ROLE.ROLE_NAME})**`
    },
    add:{
        command:'add',
        description:`get a link to add this bot in your server`
    },
    manage:{
        command:'manage',
        description:`manage your massages **(only if you the role ${ROLE.ROLE_NAME})**`
    },
}
module.exports=botCommand;