export const stringToMapByKey = (txt: string, key: string): any[] => {
    let res = [];
    txt.split("\n").forEach(line => {
        if (line.trim().length != 0) {

            line = trim2(line); //去除字符串中所有空格

            let index = line.indexOf(key);//获取每一行第一个

            let item = {
                key: line.substring(0, index),
                value: line.substring(index + 1, line.length),
            }

            res.push(item)
        }
    })
    return res;
}

/**
 * 去除字符串中所有空格
 * @param str
 */
export const trim2 = (str: string) => {
    const reg = /\s+/g;
    return str.replace(reg, '');
}


function ltrim(str: string) {
    const reg = /^\s+/g;
    return str.replace(reg, '');
}

// 去除右侧空格

function rtrim(str: string) {
    const reg = /\s+$/g;
    return str.replace(reg, '');
}

// 去除两侧的空格

function trim(str: string) {
    const reg = /^\s+|\s+$/g;
    return str.replace(reg, '');
}
