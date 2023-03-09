/**
 * @description: 十进制转换为十六进制
 * @author: wangcb
 * @date: 2023/3/8 12:52
 **/
export const decimalToHexadecimal = (decimal: number): string => {
    let hex = '';
    let remainder;

    while (decimal > 0) {
        remainder = decimal % 16;
        hex = (remainder < 10 ? remainder : String.fromCharCode(55 + remainder)) + hex;
        decimal = Math.floor(decimal / 16);
    }

    return hex;
}
