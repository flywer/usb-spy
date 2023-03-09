import ElectronLog from "electron-log";
import {isEqual} from "lodash";

/**
 * @description: 注册表得到的键值对转为json格式
 * @author: wangcb
 **/
export const registryTxtToJson = (txt: string) => {
    let res: any = {};
    let maps = [];
    txt.split("\n").forEach(line => {
        if (line.trim().length != 0) {
            line = trim2(line); //去除字符串中所有空格

            let index = line.indexOf(':');//获取每一行第一个':'

            //若不存在 ':' ，则说明此行是上一行换行的下一行
            if (isEqual(index, -1)) {
                //上一行获取的值拼接此行
                maps.at(maps.length - 1).value += maps.at(maps.length - 1).value + line
            } else {
                maps.push({key: line.substring(0, index), value: line.substring(index + 1, line.length)})
            }
        }
    });

    maps.forEach(map => {
        res[map.key] = map.value
    })

    return res;
}

/**
 * @description: 去除字符串中所有的换行符
 * @author: wangcb
 * @description: 正则表达式 /[\r\n]+/g 可以匹配所有形式的换行符（包括 Windows、Unix 和老 Mac 等系统的不同换行符），其中 \r\n 匹配 Windows 换行符，\n 匹配 Unix 换行符，\r 匹配老 Mac 换行符。
 **/
export const removeLineBreaks = (str: string) => {
    let pattern = /\r?\n|\r/g;
    return str.replace(pattern, '');
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

export const getSerNumByDeviceId = (deviceId: string) => {
    //'USB\\VID_346D&PID_5678\\3327691123111680644'
    let deviceInfo = deviceId.split('\\');
    return deviceInfo[2]
}
