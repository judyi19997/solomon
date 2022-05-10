const fs = require('fs');
const http = require('http');
const url = require('url')
const { off } = require('process');

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
        return res.end();
    });
};

http.createServer(gateWayPage).listen(8080)
