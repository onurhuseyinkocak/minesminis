function Worksheets() {
  // Worksheet verileri - .jpg uzantılı
  const worksheetData = [
    { id: 1, title: "Worksheet 1", src: "/src/assets/worksheet1.jpg" },
    { id: 2, title: "Worksheet 2", src: "/src/assets/worksheet2.jpg" },
    { id: 3, title: "Worksheet 3", src: "/src/assets/worksheet3.jpg" },
    { id: 4, title: "Worksheet 4", src: "/src/assets/worksheet4.jpg" },
    { id: 5, title: "Worksheet 5", src: "/src/assets/worksheet5.jpg" },
    { id: 6, title: "Worksheet 6", src: "/src/assets/worksheet6.jpg" },
  ];

  // Görseli indirme fonksiyonu
  const downloadImage = (imageSrc: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = imageSrc;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Görseli yazdırma fonksiyonu - DÜZELTİLMİŞ VERSİYON
 const printImage = (imageSrc: string, fileName: string) => {
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${fileName}</title>
          <style>
            body { 
              margin: 0; 
              display: flex; 
              justify-content: center; 
              align-items: center; 
              min-height: 100vh;
              background: white;
            }
            img { 
              max-width: 100%;
              max-height: 100vh; 
              height: auto;
              width: auto;
              object-fit: contain; 
            }
            @media print {
              @page {
                /* Try setting minimal margins for the printer */
                margin: 0.5cm; /* Some printers require a minimum margin :cite[1] */
              }
              body { margin: 0; }
              img { 
                max-width: 100% !important; 
                max-height: 100% !important;
                /* Force the image to fill the page */
                width: 100% !important;
              }
            }
          </style>
        </head>
        <body>
          <img src="${imageSrc}" alt="${fileName}" />
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
                // Optional: close the window after printing
                // setTimeout(function() { window.close(); }, 500);
              }, 250);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  } else {
    alert('Yazdırma penceresi açılamadı. Lütfen pop-up engelleyicinizi kapatın.');
  }
};

  return (
    <div style={{ 
      padding: '20px', 
      minHeight: '100vh',
      backgroundColor: '#f5f5f5'
    }}>
      <h1>Worksheets</h1>
      <p>Download and practice with fun worksheets ✏️</p>
      
      {/* Worksheet Grid Container */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)', // 3 sütun
        gap: '20px',
        padding: '20px 0',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {worksheetData.map((worksheet) => (
          <div 
            key={worksheet.id}
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '15px',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px',
              transition: 'transform 0.2s, box-shadow 0.2s',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
            }}
          >
            {/* Worksheet Görsel */}
            <img 
              src={worksheet.src} 
              alt={worksheet.title}
              style={{
                width: '100%',
                height: '200px',
                objectFit: 'cover',
                borderRadius: '8px',
                border: '1px solid #ddd'
              }}
              onClick={() => window.open(worksheet.src, '_blank')}
            />
            
            {/* Worksheet Başlık */}
            <h3 style={{ 
              margin: '0', 
              fontSize: '16px', 
              textAlign: 'center',
              color: '#333'
            }}>
              {worksheet.title}
            </h3>
            
            {/* İşlem Butonları */}
            <div style={{
              display: 'flex',
              gap: '10px',
              width: '100%'
            }}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  downloadImage(worksheet.src, `worksheet-${worksheet.id}.jpg`);
                }}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                İndir
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  printImage(worksheet.src, worksheet.title);
                }}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  backgroundColor: '#2196F3',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Yazdır
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Worksheets;