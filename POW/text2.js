const NodeRSA = require('node-rsa');
const crypto = require('crypto'); // 用于哈希

// 1. 生成 RSA 密钥对
function generateKeyPair() {
    const key = new NodeRSA({b: 2048}); // 2048 位密钥
    return {
        privateKey: key.exportKey('pkcs1-private-pem'),
        publicKey: key.exportKey('pkcs1-public-pem')
    };
}

// 2. 私钥签名
function signData(privateKey, data) {
    const key = new NodeRSA(privateKey, 'pkcs1-private-pem');
    key.setOptions({encryptionScheme: 'pkcs1'}); // 设置签名方案
    const signature = key.sign(data, 'base64', 'utf8'); // 签名
    return signature;
}

// 3. 公钥验证签名
function verifySignature(publicKey, data, signature) {
    const key = new NodeRSA(publicKey, 'pkcs1-public-pem');
    key.setOptions({encryptionScheme: 'pkcs1'}); // 设置验证方案
    const isVerified = key.verify(data, signature, 'utf8', 'base64'); // 验证
    return isVerified;
}

// 4. POW (Proof-of-Work) 实现
function proofOfWork(prefix, difficulty) {
    let nonce = 0;
    let hash = '';
    const target = '0'.repeat(difficulty); // 目标前缀

    while (true) {
        const data = prefix + nonce;
        hash = crypto.createHash('sha256').update(data).digest('hex'); // SHA256 哈希
        if (hash.startsWith(target)) {
            console.log(`找到 Nonce: ${nonce}, 哈希: ${hash}`);
            return { nonce: nonce, hash: hash };
        }
        nonce++;
    }
}

// ---  主流程  ---
async function main() {
    // 1. 生成密钥对
    const keyPair = generateKeyPair();
    const privateKey = keyPair.privateKey;
    const publicKey = keyPair.publicKey;

    console.log("公钥:", publicKey);
    console.log("私钥:", privateKey);

    // 2. POW
    const prefix = "sakure";
    const difficulty = 4; // 4 个 0 开头
    const powResult = proofOfWork(prefix, difficulty);
    const nonce = powResult.nonce;
    const dataToSign = prefix + nonce;

    // 3. 私钥签名
    const signature = signData(privateKey, dataToSign);
    console.log("签名:", signature);

    // 4. 公钥验证签名
    const isVerified = verifySignature(publicKey, dataToSign, signature);
    console.log("签名验证结果:", isVerified); // 应该为 true
}

main();