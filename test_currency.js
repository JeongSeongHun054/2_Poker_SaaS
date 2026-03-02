const formatWPLCurrency = (numStr) => {
    const num = Number(numStr);
    if (isNaN(num) || num === 0) return '0원';

    const isNegative = num < 0;
    const absNum = Math.abs(num);

    if (absNum >= 1) {
        const eok = Math.floor(absNum);
        const man = Math.round((absNum - eok) * 10000); // 0.2 억 = 2000 만
        let result = `${eok}억`;
        if (man > 0) result += ` ${man}만`;
        return isNegative ? `-${result}` : result;
    } else {
        const man = Math.round(absNum * 10000);
        return isNegative ? `-${man}만` : `${man}만`;
    }
};

console.log(formatWPLCurrency(1.2));
console.log(formatWPLCurrency(0.24));
console.log(formatWPLCurrency(-0.2429));
console.log(formatWPLCurrency(400));
console.log(formatWPLCurrency(1.3727));
