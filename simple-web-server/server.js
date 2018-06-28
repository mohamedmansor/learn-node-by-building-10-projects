// require 
// http, url, path, fs

var http = require('http')
var url = require('url');
var path = require('path')
var fs = require('fs')


// Array of mimeTypes

var mimeTypes = {
    "html": "text/html",
    "css": "text/css",
    "js": "text/javascript",
    "jpeg": "image/jpeg",
    "png": "image/png",
    "jpg": "image/jpg"
};

// Create server Funciton
http.createServer(function (req, res) {
    var uri = url.parse(req.url).pathname;
    var filename = path.join(process.cwd(), unescape(uri));
    console.log('Loading.....' + uri);
    var stats;

    try {
        stats = fs.lstatSync(filename);
        console.log(stats)
    } catch (e) {
        res.writeHead(404, {'Content-type': 'text/plain'})
        res.write('404 Not Found')
        return res.end ();
    }
    // checking if it's file or directory
    if(stats.isFile()){
        var mimeType = mimeTypes[path.extname(filename).split(".").reverse()[0]];
        res.writeHead(200, {'Content-type': mimeType})
        
        var fileStream = fs.createReadStream(filename);
        fileStream.pipe(res)
    } else if(stats.isDirectory){
        res.writeHead(302, {'Location': 'index.html'});
        res.end();
    }else{
        res.writeHead(500, {'Content-type': 'text/plain'})
        res.write(' 500 Internal Server Erorr')
        res.end()
    }





}).listen(3000)

