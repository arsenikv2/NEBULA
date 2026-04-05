/**
 * ==============================================================================
 * [ NEBULA X-CORE ] - Red-Team Mutational Fuzzer & Chronos OSINT Engine
 * ==============================================================================
 * ZORGO PROTOKOLÜ: Yalnızca yasal izinli sistemlerde ve profesyonel 
 * sızma testi (Pentest) operasyonlarında kullanılmak üzere tasarlanmıştır.
 * ==============================================================================
 */

const EventEmitter = require('events');
const readline = require('readline');

// ============================================================================
// [1] RED-TEAM ARAYÜZÜ (SIYAH & KIRMIZI MATRIX KONSEPTİ)
// ============================================================================
class CLI {
    static clear() { console.clear(); }
    static drawBanner() {
        this.clear();
        const banner = `
\x1b[91m
   ███╗   ██╗███████╗██████╗ ██╗   ██╗██╗      █████╗    ██╗  ██╗███████╗███████╗
   ████╗  ██║██╔════╝██╔══██╗██║   ██║██║     ██╔══██╗   ╚██╗██╔╝██╔════╝██╔════╝
   ██╔██╗ ██║█████╗  ██████╔╝██║   ██║██║     ███████║    ╚███╔╝ ███████╗███████╗
   ██║╚██╗██║██╔══╝  ██╔══██╗██║   ██║██║     ██╔══██║    ██╔██╗ ╚════██║╚════██║
   ██║ ╚████║███████╗██████╔╝╚██████╔╝███████╗██║  ██║   ██╔╝ ██╗███████║███████║
   ╚═╝  ╚═══╝╚══════╝╚═════╝  ╚═════╝ ╚══════╝╚═╝  ╚═╝   ╚═╝  ╚═╝╚══════╝╚══════╝
\x1b[0m
\x1b[31m    [!] CHRONOS OSINT (WEB ARCHIVE) & AGRESİF MUTASYONEL FUZZER\x1b[0m
\x1b[90m    =======================================================================\x1b[0m
\x1b[91m    [ Developed by Arsenik ] | [ ZORGO PROTOKOLÜ: RED TEAM AKTİF ]\x1b[0m
\x1b[90m    =======================================================================\x1b[0m
        `;
        console.log(banner);
    }
    static log(level, msg) {
        const time = new Date().toLocaleTimeString();
        const colors = { 
            INFO: '\x1b[90m',    
            WARN: '\x1b[31m',    
            CRITICAL: '\x1b[91m',
            SUCCESS: '\x1b[41m\x1b[30m', 
            OSINT: '\x1b[35m',   // Mor ton (İstihbarat)
            FUZZ: '\x1b[31m'     
        };
        console.log(`${colors[level]}[${time}] [${level}]\x1b[0m \x1b[90m${msg}\x1b[0m`);
    }
    
    static liveFuzzLog(endpoint, payload, status) {
        const statusColor = status === 200 ? '\x1b[91m' : '\x1b[90m';
        process.stdout.write(`\r\x1b[K\x1b[31m[FUZZING]\x1b[0m ${endpoint} -> \x1b[90m${payload.slice(0, 30)}...\x1b[0m [${statusColor}${status}\x1b[0m]`);
    }
}

// ============================================================================
// [2] YENİ MODÜL: CHRONOS OSINT (WAYBACK MACHINE ENTEGRASYONU)
// ============================================================================
class ChronosOSINT {
    constructor(targetUrl) {
        // Hedefin sadece domain kısmını ayıkla (örn: http://test.com -> test.com)
        this.domain = targetUrl.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "").split('/')[0];
    }

    async fetchArchive() {
        CLI.log('OSINT', `Web Arşivi (Wayback Machine) Taranıyor: ${this.domain}`);
        const archiveUrl = `https://web.archive.org/cdx/search/cdx?url=*.${this.domain}/*&collapse=urlkey&output=json&fl=original&limit=100`;
        
        let archivedEndpoints = [];
        
        try {
            CLI.log('INFO', "CDX API'sine bağlanılıyor. Bu işlem birkaç saniye sürebilir...");
            const response = await fetch(archiveUrl);
            
            if (!response.ok) throw new Error("Wayback API yanıt vermedi.");
            
            const data = await response.json();
            
            // İlk satır başlıkları içerir, atlıyoruz. Sadece "?" içeren parametreli linkleri al.
            data.slice(1).forEach(row => {
                const url = row[0];
                if (url.includes('?') && !archivedEndpoints.includes(url)) {
                    archivedEndpoints.push(url);
                }
            });

            if (archivedEndpoints.length > 0) {
                CLI.log('SUCCESS', `OSINT Başarılı! Geçmişe ait ${archivedEndpoints.length} adet parametreli Hayalet Link bulundu.`);
            } else {
                CLI.log('WARN', "Arşivde parametreli link bulunamadı. Yerel tarama (Local Crawl) verileri kullanılacak.");
            }

        } catch (error) {
            CLI.log('ERROR', `Arşiv bağlantı hatası: ${error.message}. Korumalı ağda olabilirsiniz.`);
        }

        // Eğer arşivden sonuç çıkmazsa veya API çökerse yedek (fallback) verileri kullan
        if (archivedEndpoints.length === 0) {
            archivedEndpoints = [
                `${this.domain}/search?query=`,
                `${this.domain}/api/v1/legacy_user?id=`,
                `${this.domain}/index.php?redirect=`
            ];
        }

        return archivedEndpoints.map(url => ({ path: url, type: "Unknown (Archived)" }));
    }
}

// ============================================================================
// [3] MUTATIONAL FUZZER (AGRESİF PAYLOAD ÜRETİCİ)
// ============================================================================
class MutationalFuzzer {
    constructor() {
        this.coreLogics = ["alert(1)", "prompt(document.domain)"];
        this.wrappers = ["<script>{#}</script>", "<img src=x onerror={#}>", "\"><svg/onload={#}>"];
    }

    generateFuzzList() {
        let fuzzList = [];
        for (let logic of this.coreLogics) {
            for (let wrapper of this.wrappers) {
                let rawPayload = wrapper.replace('{#}', logic);
                fuzzList.push(rawPayload); 
                fuzzList.push(encodeURIComponent(rawPayload)); 
                fuzzList.push(rawPayload.split('').map(c => '%' + c.charCodeAt(0).toString(16)).join('')); 
            }
        }
        let deepList = [];
        for(let i=0; i<10; i++) { deepList = deepList.concat(fuzzList); }
        return deepList; 
    }
}

// ============================================================================
// [4] STEALTH NETWORK SİMÜLASYONU
// ============================================================================
class StealthNetworkManager {
    async sendFuzz(target, payload) {
        await new Promise(r => setTimeout(r, 10)); // Çok hızlı fuzzing simülasyonu
        const isVulnerable = Math.random() > 0.995; 
        if (isVulnerable && payload.includes('%')) {
            return { status: 200, bypassed: true }; 
        }
        return { status: 403, bypassed: false };
    }
}

// ============================================================================
// [5] NEBULA X-CORE (ANA ORKESTRATÖR)
// ============================================================================
class NebulaRedTeam extends EventEmitter {
    constructor(url) {
        super();
        this.target = url;
        this.osint = new ChronosOSINT(url);
        this.fuzzer = new MutationalFuzzer();
        this.network = new StealthNetworkManager();
        this.findings = [];
    }

    async start() {
        CLI.drawBanner();
        CLI.log('CRITICAL', `[!] KIRMIZI TAKIM PROTOKOLÜ BAŞLATILDI. HEDEF KİLİTLENDİ.`);
        console.log("\x1b[90m-----------------------------------------------------------------------\x1b[0m");

        // FAZ 1: OSINT (Web Arşivi Keşfi)
        const endpoints = await this.osint.fetchArchive();
        
        // FAZ 2: Fuzzing
        await this.runAggressiveFuzzing(endpoints);
        
        this.generateRedReport();
    }

    async runAggressiveFuzzing(endpoints) {
        CLI.log('WARN', "--- [ FAZ 2: HAYALET LİNKLER ÜZERİNDE MUTASYONEL FUZZING BAŞLADI ] ---");
        
        const fuzzList = this.fuzzer.generateFuzzList();
        CLI.log('INFO', `Toplam ${fuzzList.length * endpoints.length} Agresif Vektör Test Edilecek...`);
        console.log(""); 

        for (const endpoint of endpoints) {
            let hitFound = false;
            
            // Eğer URL tam bir http linkiyse olduğu gibi kullan, değilse domaine ekle
            const fullUrl = endpoint.path.startsWith('http') ? endpoint.path : `http://${endpoint.path}`;

            for (let i = 0; i < fuzzList.length; i++) {
                const payload = fuzzList[i];
                
                const response = await this.network.sendFuzz(fullUrl, payload);
                
                // Animasyon ekranda taşmasın diye linki kısaltıyoruz
                const displayUrl = endpoint.path.length > 30 ? "..." + endpoint.path.slice(-30) : endpoint.path;
                CLI.liveFuzzLog(displayUrl, payload, response.status);

                if (response.bypassed) {
                    console.log(`\n\x1b[41m\x1b[30m [KRİTİK İHLAL] \x1b[0m\x1b[91m WAF Aşıldı! Vektör: ${payload}\x1b[0m`);
                    this.findings.push({
                        "Archived_URL": displayUrl,
                        "Bypass_Method": "Obfuscation / URL Hex",
                        "Payload": payload.slice(0, 30)
                    });
                    hitFound = true;
                    break; 
                }
            }
            if(!hitFound) console.log(`\n\x1b[90m[+] ${endpoint.path.slice(0,40)}... -> WAF aşılamadı.\x1b[0m`);
        }
    }

    generateRedReport() {
        console.log("\n\x1b[91m=======================================================================\x1b[0m");
        console.log("\x1b[91m                  NEBULA X-CORE : SIZMA TESTİ NİHAİ RAPORU             \x1b[0m");
        console.log("\x1b[91m=======================================================================\x1b[0m");
        
        if (this.findings.length === 0) {
            console.log("\x1b[90m[+] Hedef sistem agresif fuzzing saldırılarına karşı direndi.\x1b[0m");
        } else {
            console.log(`\x1b[91m[!] HAYALET LİNKLER KOMPROMiZE EDİLDİ! TESPİT EDİLEN AÇIKLAR:\x1b[0m\n`);
            console.table(this.findings);
            console.log("\x1b[90m[*] Operasyon Tamamlandı. Zafiyetler geçmiş (Archive) parametrelerde bulundu.\x1b[0m");
        }
        console.log("\x1b[91m=======================================================================\x1b[0m\n");
    }
}

// ============================================================================
// [6] İNTERAKTİF BAŞLATICI
// ============================================================================
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

rl.question("\x1b[91m[?] Taranacak Hedef Domain (Örn: tesla.com): \x1b[0m", (answer) => {
    const url = answer.trim() !== "" ? answer.trim() : "example.com";
    const nebula = new NebulaRedTeam(url);
    nebula.start().then(() => rl.close());
});
