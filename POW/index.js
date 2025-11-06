const CryptoJS = require('crypto-js');

function findHashWithPrefix(prefix) {
    let randomValue = 0;
    let hash;
    const targetPrefix = prefix;

    console.log(`正在寻找以 "${targetPrefix}" 开头的 SHA-256 Hash...`);

    while (true) {
        const dataToHash = String(randomValue);

        // 2. 计算 SHA-256 Hash 值
        hash = CryptoJS.SHA256(dataToHash).toString();

        if (hash.startsWith(targetPrefix)) {
            console.log(`找到符合条件的 Hash!`);
            return { randomValue: dataToHash, hash: hash };
        }

        randomValue++;

        if (randomValue > 10000000) { // 示例上限
            console.error("已达到尝试上限，未找到符合条件的 Hash。");
            return null;
        }
    }
}

// 示例用法
const result = findHashWithPrefix('0000');
if (result) {
    console.log(`找到的随机数值: ${result.randomValue}`);
    console.log(`对应的 SHA-256 Hash: ${result.hash}`);
}
