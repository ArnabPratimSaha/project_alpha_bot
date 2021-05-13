
const { TestModel } = require("./database/testModel");

class HandleTime{
    constructor()
    {
        var time;
        var count;
        var timeOut;
        var client;
    }
    getBoth(){
        return {time:this.time,count:this.count};
    }
    getTime(){
        return this.time;
    }
    getCount(){
        return this.count;
    }
    setBoth(time,count){
        this.time=time;
        this.count=count;
    }
    setTime(time){
        this.time=time;
    }
    setCount(count){
        this.count=count;
    }
    async startTimer (){
        clearImmediate(this.timeOut)
        try {
            const data=await findClosestTimeData();
            if(!data)return;
            this.time=(data.time-new Date())<0?1:(data.time-new Date());
            this.timeOut=setTimeout(async() => {
                const user=await this.client.users.fetch(data.userID);
                await user.send(`${data.message}  sent by the bot`);
                await TestModel.findOneAndDelete({time:data.time});
                this.startTimer();
            }, this.time);
        } catch (error) {
            console.log(error);
        }
    }
    setClient(client){
        this.client=client;
    }
}

const findClosestTimeData=async()=>{
    try {
        
        const collection=await TestModel.find();
        if(collection.length===0)return null;
        const currentTime=new Date();
        var lowestTimeData=collection[0];
        for (let i = 0; i < collection.length; i++) {
          const e = collection[i];
          if(e.time<=lowestTimeData.time)
          {
            lowestTimeData=e;
          }
        }
        return lowestTimeData;
    } catch (error) {
        console.log(error);
        return null;
    }
  }
 const HandleTimeManager=new HandleTime();
module.exports={HandleTimeManager};