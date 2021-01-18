


/**
 * 从数组中随机获得一个元素
 * @param {Array} arr 数组 
 */
export function getRandomItem(arr) {
    return arr[ Math.floor(Math.random() * arr.length) ];
}