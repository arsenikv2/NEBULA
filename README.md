# 🌌 NEBULA X-CORE: OMNI-REVOLUTION (V1.0)
> **Advanced Red-Team Mutational Fuzzer & Chronos OSINT Engine**

![License](https://img.shields.io/badge/License-Zorgo_Protocol-red)
![Version](https://img.shields.io/badge/Version-1.0--Prime-black?style=flat-square&logo=node.js)
![Developed By](https://img.shields.io/badge/Developed_By-Arsenik-910000)

**NEBULA X-CORE**, modern web uygulamalarındaki en karmaşık zafiyetleri tespit etmek için tasarlanmış, otonom ve sezgisel bir siber güvenlik denetim framework'üdür. Geleneksel tarayıcıların aksine, **Hayalet Parametreleri (OSINT)** bulur ve **Sonsuz Mutasyonel Fuzzing** algoritmasıyla savunma katmanlarını (WAF/IPS) otonom olarak analiz eder.

---

## 🚀 Temel Özellikler

### 🔍 Chronos OSINT Engine
Hedefin sadece mevcut halini değil, **Wayback Machine** üzerinden geçmişini tarar. Unutulmuş `/debug`, `/api/v1/old_search` gibi "Hayalet Parametreleri" bularak saldırı yüzeyini genişletir.

### 🧬 Omni-XSS DNA Library
Sadece basit scriptler değil, tarayıcı motorlarını manipüle eden gelişmiş vektörler içerir:
* **mXSS (Mutation XSS):** Tarayıcı normalizasyon süreçlerini suistimal eden vektörler.
* **Blind XSS:** Görünmez admin panellerine sızan callback tabanlı enjeksiyonlar.
* **DOM-based XSS:** Client-side JavaScript kaynaklarını (Source/Sink) hedef alan otonom analiz.
* **Self-XSS:** Sosyal mühendislik senaryoları için teknik doğrulama.

### ⚡ Mutational Fuzzer
Payload'ları statik bırakmaz. Her bir vektörü gerçek zamanlı olarak **URL Hex**, **Double URL**, **Unicode** ve **Plain** formatlarında mutasyona uğratarak WAF filtrelerini atlatmayı dener.

---

## 🛠️ Teknik Mimari



Nebula, üç ana fazda operasyon yürütür:
1.  **Reconnaissance (Keşif):** Hedef topolojisi ve arşiv verilerinin haritalanması.
2.  **Autonomous Fuzzing:** Mutasyonel motorun sonsuz döngüde parametreleri dövmesi.
3.  **Impact Validation:** Bulunan zafiyetin kritiklik seviyesinin (Cookie sızıntısı, Session Hijacking vb.) doğrulanması.

---

## 📦 Kurulum ve Kullanım

### Gereksinimler
* Node.js (v18+)
* Terminal (Termux, Kali Linux, MacOS)

### Çalıştırma
```bash
# Projeyi klonlayın
git clone 

# Klasöre gitclone https://github.com/arsenikv2/NEBULA/
cd nebula

# Motoru ateşleyin
node nebula.js

