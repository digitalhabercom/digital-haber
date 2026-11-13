export const SITE = {
  name: 'digitalhaber',
  tagline: 'Teknolojinin gündemi',
  description:
    'Yapay zeka, donanım, siber güvenlik, yazılım ve bulut altyapı alanlarında güncel teknoloji haberleri, analizler ve rehberler.',
  email: 'iletisim@digitalhaber.com',
  logo: '/icon-512.png',
  defaultImage: '/og-default.png',
};

/**
 * REKLAM AYARLARI
 * AdSense onayı gelince:
 *  1) adsenseClient alanına 'ca-pub-XXXXXXXXXXXXXXXX' yazın
 *  2) AdSense'te oluşturduğunuz reklam birimlerinin numaralarını slots içine yazın
 * Boş bırakılan alanlar yayında görünmez (sayfada boşluk kalmaz).
 * Reklam yerlerini önceden görmek için showPlaceholders: true yapın.
 */
export const ADS = {
  adsenseClient: '',
  slots: {
    leaderboard: '',
    rectangle: '',
    tall: '',
    inarticle: '',
  },
  showPlaceholders: false,
};
