const Storage = {
  // QR 코드 설정 저장
  saveSettings: async (settings) => {
    try {
      await chrome.storage.local.set({ qrSettings: settings });
    } catch (error) {
      console.error('설정 저장 중 오류 발생:', error);
    }
  },

  // 저장된 설정 불러오기
  loadSettings: async () => {
    try {
      const result = await chrome.storage.local.get('qrSettings');
      return result.qrSettings || {
        size: 256,
        errorLevel: 'M',
        foreground: '#000000'
      };
    } catch (error) {
      console.error('설정 로드 중 오류 발생:', error);
      return {
        size: 256,
        errorLevel: 'M',
        foreground: '#000000'
      };
    }
  }
}; 