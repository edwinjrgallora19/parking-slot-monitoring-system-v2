import { useEffect, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

function QRScanner({ onScanSuccess }) {

    const scannerRef = useRef(null);

    useEffect(() => {

        // Prevent duplicate scanner
        if (scannerRef.current) return;

        scannerRef.current = new Html5QrcodeScanner(
            "reader",
            {
                qrbox: {
                    width: 250,
                    height: 250
                },
                fps: 5,
                rememberLastUsedCamera: true,
                supportedScanTypes: [0, 1]
            },
            false
        );

        scannerRef.current.render(
            (decodedText) => {

                onScanSuccess(decodedText);

            },
            (error) => {
                console.log(error);
            }
        );

        return () => {

            if (scannerRef.current) {

                scannerRef.current
                    .clear()
                    .catch(() => { });

                scannerRef.current = null;
            }
        };

    }, [onScanSuccess]);

    return (
        <div>
            <h2>Scan Parking QR</h2>

            <div id="reader"></div>
        </div>
    );
}

export default QRScanner;