import OkAdapter from "./adapter/OkAdapter";



// window.includeScript("//api.ok.ru/js/fapi5.js");
window["includeScript"]("//api.ok.ru/js/fapi5.js");
type AdType = "interstitial" | "reward";

let isAdapterReady = false;
let lastAdTime = 0;
let adapter: OkAdapter | null = null;

const statusElement = document.getElementById('statusMessage');
const interstitialButton = document.getElementById('showInterstitial');
const rewardButton = document.getElementById('showReward');
const saveButton = document.getElementById('saveGame');
const loadButton = document.getElementById('loadGame');
const addStatButton = document.getElementById('addStat');
const purchase = document.getElementById('getPurchase');
const infoButton = document.getElementById('info');
const text = document.getElementById("textArea") as HTMLTextAreaElement

interstitialButton?.addEventListener('click', () => showAd('interstitial'));
rewardButton?.addEventListener('click', () => showAd('reward'));
saveButton?.addEventListener('click', save);
loadButton?.addEventListener('click', load);
addStatButton?.addEventListener('click', sendPost);
purchase?.addEventListener('click', getPurchase);
infoButton?.addEventListener('click', getUserInfo);



function initAdapter(): boolean {

    adapter = new OkAdapter();
    console.log("adapter2 =", adapter);

    adapter.init().then(() => {
        isAdapterReady = true;
        console.log('[success] Адаптер успешно инициализирован');
    }).catch((error) => {
        console.error(`[error] Ошибка инициализации адаптера:`, error);
    });

    return true;
}

async function getUserInfo() {
    if (!isAdapterReady || !adapter) {
        console.warn('Адаптер не готов');
        return;
    }

    try {
        const lbData = await adapter.getLbData();
        
        const userId = adapter.getId();
        const userEntry = lbData.find(entry => entry.id === userId);
        console.log("userEntry = ", userEntry)
        if (userEntry) {
            
        } else {
            console.warn('Пользователь не найден в лидерборде');
        }
    } catch (error) {
        console.error('Ошибка получения данных:', error);
    }
}

async function showAd(adType: AdType): Promise<void> {
    if (!isAdapterReady || !adapter) {
        console.warn(`[warning] Адаптер не готов: Показ ${adType} рекламы`);
        return;
    }

    try {
        if (adType === 'reward') {
            const watched = await adapter.showRewardedAds();
            lastAdTime = Date.now();
            console.log("watched = ", watched)
            console.log(watched ? '[success] Награда получена!' : '[warning] Реклама закрыта до завершения');
        } else {
            const full = await adapter.showFullscreenAds();
            console.log("showFullscreenAds = ", full)
            lastAdTime = Date.now();
            console.log(`[success] Реклама ${adType} показана`);
        }
    } catch (error) {
        console.error(`[error] Ошибка ${adType}:`, error);
    }
}

async function save(): Promise<void> {
    if (!isAdapterReady || !adapter) {
        console.warn("save (mock)");
        return;
    }
    console.log("adapter =", adapter);

    try {
        console.log("text = ", text.value)

        const gg = await adapter.save(text.value);
        console.log("gg = ", gg)
        console.log("[success] Данные сохранены");
    } catch (error) {
        console.error("[error] Ошибка сохранения:", error);
    }
}

async function load(): Promise<any> {
    if (!isAdapterReady || !adapter) {
        console.warn("load (mock)");
        return null;
    }

    try {
        const data = await adapter.load();
        console.log("[success] Данные загружены", data);
        return data;
    } catch (error) {
        console.error("[error] Ошибка загрузки:", error);
        return null;
    }
}




async function sendPost(): Promise<void> {
    if (isAdapterReady && adapter) {
        const sendPost = await adapter.sendPost('SEND POST');
        console.log("sendPost = ", sendPost)
    }
    console.log("Отправлен запрос SendPost");
}

function getPurchase(): void {
    if (isAdapterReady && adapter) {
        const puschase = adapter.getPurchase();
        console.log("puschase = ", puschase)
    }
    console.log('получение списка активных покупок пользователя');
}

// window.API_callback = function(method: string, result: any, data: any): void {
//     console.log("API_callback:", method, result, data);
// };


initAdapter();

