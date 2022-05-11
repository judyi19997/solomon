const fs = require('fs');
const http = require('http');
const url = require('url')
const schedule = require('node-schedule');
// import { ExchangeService, QuoationService } from "node-upbit";
const node_upbit = require('node-upbit')
const { off } = require('process');
const { threadId } = require('worker_threads');

async function wonToEther(req,res, re){
    const quoationService = new node_upbit.QuoationService();
    const res2 = await quoationService.getTicker(["KRW-ETH"]);
    const now_price = res2[0]
    current_price = parseFloat(res)/parseFloat(now_price["trade_price"]) //1이더 = now_price원 => 1원 = 1/now_price

    console.log(current_price);
    won = JSON.stringify({price: current_price});
    console.log('won : '+won);
    re.writeHead(200, 'application/json');
    re.write(won);
    console.log('write w : '+won);
    re.end();
    return current_price;
    
}

async function scheduling(req,res, re){
    var today = new Date()
    var week = today.getDay();
    var month = today.getMonth()+1;
    var date = today.getDate();
    var hour = today.getHours();
    var minute = today.getMinutes() //30분 후에!
    console.log('price is'+res);
    if (minute >=60){
        minute = minute -60;
    }
    var second = today.getSeconds()+10;
    const alertDate = `${second} ${minute} ${hour} ${date} ${month} ${week}`
    console.log(alertDate)

    const job = await schedule.scheduleJob(alertDate,async function(){
        console.log("일정시간 후, 원화 -> 이더리움")
        return await wonToEther(req, res, re);
    })
}

async function gateWayPage(req, res){
    var fname = '.'+url.parse(req.url).pathname;
    console.log(fname)
    fs.readFile(fname, async(err, data) => {
        if(req.method === 'POST'){   
            if(err){
                res.writeHead(404,{'Contente-Type':'text/html'});
                return res.end("404 Not Found");
            }
            var w;
            var address;
            var price;
            await req.on('data',async(data) => { 
                address = await JSON.parse(data).toadress;
                price = await JSON.parse(data).price;
                console.log(address+' '+price);
                w = await scheduling(address, price, res);
                console.log('end1');
            });
            req.on('end', ()=>{
                console.log('end2');
                return res.end();
            });
        }else if(req.method === 'PUT'){
            if(err){
                res.writeHead(404,{'Contente-Type':'text/html'});
                return res.end("404 Not Found");
            }
            var w;
            var address;
            var price;
            console.log('PUT method start!');
            await req.on('data',async(data) => { 
                address = await JSON.parse(data).toadress;
                price = await JSON.parse(data).price;
                console.log(address+' '+price);
                w = await wonToEther(address, price, res);
                console.log('end1');
            });
            req.on('end', ()=>{
                console.log('end2');
                return res.end();
            });
        }
        else{
            console.log('others');
            if(err){
                res.writeHead(404,{'Contente-Type':'text/html'});
                return res.end("404 Not Found");
            }
            res.writeHead(200,{'Contente-Type':'text/html'})
            res.write(data);
            return res.end();
        }
    });
};

http.createServer(gateWayPage).listen(8080)
