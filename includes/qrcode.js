
    let qrScanner = null;
    
    function showQRScanner() {
        // Modal for QR scanner
        const modalHTML = `
        <div id="qrScannerModal" class="fixed inset-0 bg-black/80 z-50 flex items-center justify-center">
            <div class="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-xl font-bold text-green-700">Scan QR Code</h3>
                <button onclick="closeQRScanner()" class="text-gray-500 hover:text-red-500">
                <i class="fas fa-times text-2xl"></i>
                </button>
            </div>
            <div id="qr-reader" class="w-full h-64 border-2 border-dashed border-green-300 rounded-lg mb-4"></div>
            <div id="qr-reader-results" class="text-center text-sm text-gray-600 mb-4"></div>
            <div class="flex justify-center space-x-4">
                <button onclick="closeQRScanner()" class="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400">Cancel</button>
            </div>
            </div>
        </div>
        `;
        
        // Add modal to body
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Initialize QR scanner
        setTimeout(() => {
        try {
            qrScanner = new Html5Qrcode("qr-reader");
            
            qrScanner.start(
            { facingMode: "environment" },
            { fps: 10, qrbox: { width: 250, height: 250 } },
            (decodedText, decodedResult) => {
                // QR code scanned successfully
                handleQRScanSuccess(decodedText);
            },
            (errorMessage) => {
                // QR scanning failed or ongoing
                document.getElementById('qr-reader-results').innerHTML = 
                `<span class="text-blue-500">Scanning...</span>`;
            }
            ).catch(err => {
            console.error("QR Scanner error:", err);
            document.getElementById('qr-reader-results').innerHTML = 
                `<span class="text-red-500">Error: ${err.message}</span>`;
            });
        } catch (error) {
            console.error("QR Scanner initialization error:", error);
            document.getElementById('qr-reader-results').innerHTML = 
            `<span class="text-red-500">Failed to initialize scanner</span>`;
        }
        }, 100);
    }
    
    function closeQRScanner() {
        if (qrScanner && qrScanner.isScanning) {
        qrScanner.stop().then(() => {
            console.log("QR Scanner stopped");
        }).catch(err => {
            console.error("Failed to stop QR scanner:", err);
        });
        }
        
        const modal = document.getElementById('qrScannerModal');
        if (modal) {
        modal.remove();
        }
    }
    
    function handleQRScanSuccess(decodedText) {
        // Display success message
        document.getElementById('qr-reader-results').innerHTML = 
        `<span class="text-green-600 font-semibold">✓ QR Code Scanned Successfully!</span>`;
        
        // Process the scanned QR code data
        console.log("Scanned QR Code:", decodedText);
        
        // Show success alert
        Swal.fire({
        icon: 'success',
        title: 'QR Code Scanned!',
        text: `Successfully scanned: ${decodedText}`,
        confirmButtonText: 'OK',
        confirmButtonColor: '#16a34a'
        });
        
        // Close scanner after 2 seconds
        setTimeout(() => {
        closeQRScanner();
        
        // Here you can add additional logic to process the scanned QR code
        // For example: update points, log recycling activity, etc.
        processScannedQRCode(decodedText);
        }, 2000);
    }
    
    function processScannedQRCode(qrData) {
        // Example processing function - you can customize this based on your needs
        console.log("Processing QR code data:", qrData);
        
        // Simulate adding points (replace with your actual logic)
        const pointsToAdd = 10;
        const currentPoints = 350; // This should come from your actual data source
        
        // Show points added notification
        Swal.fire({
        icon: 'info',
        title: 'Points Added!',
        html: `+${pointsToAdd} points for recycling<br>Total: ${currentPoints + pointsToAdd} points`,
        confirmButtonText: 'Great!',
        confirmButtonColor: '#16a34a'
        });
    }