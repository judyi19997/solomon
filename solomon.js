const fs = require('fs');
const http = require('http');
const url = require('url')
const schedule = require('node-schedule');
// import { ExchangeService, QuoationService } from "node-upbit";
const node_upbit = require('node-upbit')
const { off } = require('process');

async function wonToEther(req,res){
    const quoationService = new node_upbit.QuoationService();
    const res2 = await quoationService.getTicker(["KRW-ETH"]);
    const now_price = res2[0]
    now_price = now_price["trade_price"] //1이더 = now_price원 => 1원 = 1/now_price

    console.log(now_price)
    
}

async function scheduling(req,res){
    var today = new Date()
    var week = today.getDay();
    var month = today.getMonth()+1;
    var date = today.getDate();
    var hour = today.getHours();
    var minute = today.getMinutes()+30 //30분 후에!
    if (minute >=60){
        minute = minute -60;
    }
    var second = today.getSeconds();
    const alertDate = `${second} ${minute} ${hour} ${date} ${month} ${week}`
    console.log(alertDate)

    const job = schedule.scheduleJob(alertDate,function(){
        console.log("여기서 수행할거에요 돈을 보내주어라!!!!!!")
        wonToEther()
    })
}

async function gateWayPage(req, res){
    var fname = '.'+url.parse(req.url).pathname;
    console.log(fname)
    fs.readFile(fname, async(err, data) => {
        
        if(err){
            res.writeHead(404,{'Contente-Type':'text/html'});
            return res.end("404 Not Found");
        }
        res.writeHead(200,{'Contente-Type':'text/html'})
        res.write(data)
        scheduling()
        return res.end();
    });
};

http.createServer(gateWayPage).listen(8080)
