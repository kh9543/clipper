const timeFormat = require('hh-mm-ss');
const ffmpeg = require('fluent-ffmpeg');
const youtubedl = require('youtube-dl-exec');
const URL = require('url').URL; 
const config = require('./config/default.json'); 


class Clipper {
    constructor(url, format) {
        this.url = url;
        this.format = format;
    }
    async clip(startTime, endTime, filename) {
        console.log(this.url)
        var duration = timeFormat.fromS(timeFormat.toS(endTime)-timeFormat.toS(startTime), 'hh:mm:ss');
        var dl = youtubedl(this.url, {getUrl: true});
        dl.then(output => {
            var strategy = this.getStrategy();
            var fullFilePath = config.videoDir+filename+'.'+this.format;
            if (strategy == 'twitch') {
                //console.log(fullFilePath);
                //console.log(startTime, duration);
                var command = ffmpeg(output) 
                command.setStartTime(startTime)
                    .noVideo()
                    .setDuration(duration)
                    .audioCodec('copy')
                    .noVideo()
                    .save(fullFilePath)
                    .on('end', ()=>{clearTimeout(timer); return true;})
                var timer = setTimeout(()=>command.kill(), 60000);
            }
            else if(strategy == 'youtube') {
               output = output.split('\n')[1]
               console.log(output)
               var command = ffmpeg(output) 
                command.setStartTime(startTime)
                    .noVideo()
                    .setDuration(duration)
                    .noVideo()
                    .save(fullFilePath)
                    .on('end', ()=>{clearTimeout(timer); return true;})
                var timer = setTimeout(()=>command.kill(), 60000);
            }
            else
                throw(new Error("ClipperError: Strategy Does Not Exist"));
        });
    }
    getStrategy() {
        var url = new URL(this.url);
        var host = url.host;
        if (host.includes('youtube') || host.includes('youtu.be')) {
            return 'youtube'
        } else if (host.includes('twitch')) {
            return 'twitch'
        } else {
            return undefined
        }
    }
}

var testTTV = async function () {
    const clipperTTV = new Clipper("https://www.twitch.tv/videos/1044280957", 'mp4');
    console.log(clipperTTV.getStrategy());
    await clipperTTV.clip('00:55:00', '00:55:15', 'out_ttv');
}
var testYT = async function () {
    const clipperYT = new Clipper("https://www.youtube.com/watch?v=51SOZjKuaaQ&ab_channel=%E8%AC%9D%E9%9C%87%E5%BB%B7EliHsieh", 'mp4');
    console.log(clipperYT.getStrategy());
    await clipperYT.clip('00:01:00', '00:01:15', 'out_yt');
}

module.exports =  Clipper;

//testTTV()
//testYT()