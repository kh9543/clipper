const Clipper = require('./index.js')
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

testTTV()
testYT()