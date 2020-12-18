
export function getly({ lyrics }) {
    console.log(lyrics)
    let lylines = lyrics
    let pattern = /\[\d{2}:\d{2}.\d{3}\]/g;
    let result = {};

    for (let i = 0; i < lylines.length; i++) {
        //保存歌词时间
        let timeRegArr = lylines[i].match(pattern);
        if (!timeRegArr) continue; //跳过null
        // console.log(timeRegArr);

        //获取时间
        let t = timeRegArr[0];
        // 正则匹配
        let min = parseInt(t.match(/\[\d*/i).toString().slice(1));
        let sec = parseInt(t.match(/:\d*/i).toString().slice(1));

        let time = min * 60 + sec

        //获取歌词,把时间替换为空，后面的歌词赋给content
        let content = lylines[i].replace(timeRegArr, "");
        // console.log(content);
        result[time] = content
        // console.log(result)

    }
    // this.lrcs = result
    return result
    // this.getAllkeys(result)
    // // console.log(lylines);

    // // console.log(this.lrcs);
    // this.$parent.lyric = this.lrcs

}