/**
 * 数字时间转换为ii:ss
 * @param {Number} value 秒
 * @returns {String} ii:ss
 */
export function formatSeconds(value) {
    var second = parseInt(value);       // second
    var minute = 0;                            // minute
    if(second >= 60) {
        minute = parseInt(second / 60);
        second = parseInt(second % 60);
    }
    var result = "";
    result += (minute >= 10 ? minute : "0" + minute);
    result += ":" + (second >= 10 ? second : "0" + second);
    return result;
}

/**
 * 将hh:ii:ss转换为秒
 * @param {String} value hh:ii:ss
 * @returns {Number} 失败返回-1
 */
export function formatHisStr(value) {
    let parseFail = -1;
    if (typeof value !== "string") return parseFail;
    let split = value.split(':');
    if (split.length === 3) {
        let time = (split[0] * 3600) + (split[1] * 60) + Number(split[2]);
        if (!isNaN(time)) {
            return time;
        }
    }
    return parseFail;
}