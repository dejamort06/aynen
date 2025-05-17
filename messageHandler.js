const bannedWords = [/orospu/i, /şerefsiz/i];
const complaintKeywords = [/şikayet/i, /karakol/i, /savcılık/i, /paramı istiyorum/i];
const ibanRegex = /\bTR\d{2}[0-9A-Z]{0,30}\b/i;

const kurulumMesaji = "Kurulum desteği için WhatsApp’tan 5506987031 numarasıyla iletişime geçebilirsiniz. Cihaz kurulumu uzaktan yapılmaktadır.";
const kargoMesaji = "Kargo çıkışı sağlandıktan sonra 48 saat içinde teslimat yapılmaktadır. Sorun yaşarsanız 5506987031 numarasıyla iletişime geçebilirsiniz.";
const sikayetFormu = "Size yardımcı olabilmemiz için lütfen aşağıdaki şikayet formunu doldurun:\nhttps://docs.google.com/forms/d/e/1FAIpQLSfKurulumSikayetFormu";

module.exports = async function handler(sock, msg) {
    const from = msg.key.remoteJid;
    const text = msg.message?.conversation || msg.message?.extendedTextMessage?.text || "";

    if (!text) return;

    const lower = text.toLowerCase();

    if (complaintKeywords.some((r) => r.test(lower))) {
        await sock.sendMessage(from, { text: sikayetFormu });
        return;
    }

    if (bannedWords.some((r) => r.test(lower)) || ibanRegex.test(text)) {
        await sock.sendMessage(from, { text: "Lütfen uygun bir dil kullanın. Destek almak istiyorsanız saygılı olun." });
        return;
    }

    if (lower.includes("kurulum")) {
        await sock.sendMessage(from, { text: kurulumMesaji });
        return;
    }

    if (lower.includes("kargo")) {
        await sock.sendMessage(from, { text: kargoMesaji });
        return;
    }

    if (lower.includes("iade")) {
        await sock.sendMessage(from, { text: "İade işlemleri için SMS ile iletilen numaraya başvurmanız gerekmektedir. Sorun yaşarsanız şikayet formunu doldurabilirsiniz." });
        return;
    }
};
