$(document).ready(async function() {
  // QR 코드 인스턴스
  let qrCode = null;

  // 저장된 설정 로드
  const settings = await Storage.loadSettings();
  $('#size').val(settings.size);
  $('#errorLevel').val(settings.errorLevel);
  $('#foreground').val(settings.foreground);

  // QR 코드 생성 함수
  function generateQRCode() {
    const text = $('#inputText').val().trim();
    if (!text) {
      alert('Please enter text or URL');
      return;
    }

    const settings = {
      size: parseInt($('#size').val()),
      errorLevel: $('#errorLevel').val(),
      foreground: $('#foreground').val()
    };

    // 설정 저장
    Storage.saveSettings(settings);

    // 기존 QR 코드 제거 및 새 캔버스 생성
    $('#qrResult').empty();
    const qrContainer = $('<div>').attr('id', 'qrContainer');
    $('#qrResult').append(qrContainer);

    const defaultShowingSize = 128;
    
    // 새 QR 코드 생성
    qrCode = new QRCode(qrContainer[0], {
      text: text,
      width: settings.size,
      height: settings.size,
      colorDark: settings.foreground,
      colorLight: '#ffffff',
      correctLevel: QRCode[`CorrectLevel`][settings.errorLevel]
    });

    // QR 코드 이미지 스타일 조정
    setTimeout(() => {
      $('#qrContainer img').css({
        'display': 'block',
        'margin': '0 auto',
        'width': `${defaultShowingSize}px`,
        'height': `${defaultShowingSize}px`
      });
      // 캔버스도 숨김
      $('#qrContainer canvas').hide();
    }, 0);

    // 다운로드 버튼 추가
    const downloadBtn = $('<button>')
      .attr('id', 'downloadBtn')
      .text('Download QR Code')
      .appendTo('#qrResult');

    // 다운로드 버튼 표시
    $('#downloadBtn').show();
  }

  // QR 코드 다운로드 함수
  function downloadQRCode() {
    const img = $('#qrContainer img')[0];
    const canvas = document.createElement('canvas');
    // 다운로드 시에는 원본 크기 사용
    const originalSize = parseInt($('#size').val());
    canvas.width = originalSize;
    canvas.height = originalSize;
    
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, originalSize, originalSize);
    
    const dataUrl = canvas.toDataURL('image/png');
    const downloadLink = document.createElement('a');
    downloadLink.href = dataUrl;
    downloadLink.download = 'qrcode.png';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }

  // 이벤트 리스너
  $('#generateBtn').on('click', generateQRCode);
  $(document).on('click', '#downloadBtn', downloadQRCode);
  $('#inputText').on('keypress', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      generateQRCode();
    }
  });
}); 