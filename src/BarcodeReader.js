import React, { useState, useRef, useEffect } from 'react';
import Quagga from 'quagga';
import { Button, Typography, Box } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import copy from 'copy-to-clipboard';

const BarcodeReader = () => {
  const [code, setCode] = useState('');
  const [cameraStatus, setCameraStatus] = useState(false);
  const readerRef = useRef(null);

  useEffect(() => {
    if (cameraStatus) {
      initReader();
    }
    
    // Clean up when the component unmounts or cameraStatus changes
    return () => {
      if (cameraStatus) {
        Quagga.stop();
      }
    };
  }, [cameraStatus]);

  const initReader = () => {
    if (!readerRef.current) {
      console.error('Reader element not found');
      return;
    }

    Quagga.init({
      inputStream: {
        type: 'LiveStream',
        target: readerRef.current, // Use ref to ensure the element is found
        constraints: {
          width: 640,
          height: 480,
          facingMode: 'environment',
        },
      },
      decoder: {
        readers: ['code_128_reader'],
      },
    }, (err) => {
      if (err) {
        console.log('Error in Quagga initialization:', err);
        return;
      }
      console.log('Initialization finished. Ready to start');
      Quagga.start();
      Quagga.onProcessed((result) => {
        console.log('Processed result:', result);
      });
      Quagga.onDetected((data) => {
        console.log('Detected barcode:', data);
        setCode(data.codeResult.code);
        stopReader();
      });
    });
  };

  const stopReader = () => {
    console.log('Stopping the reader.');
    setCameraStatus(false);
    Quagga.stop();
  };

  // const __onDetected = (data) => {
  //   console.log('Detected barcode:', data);
  //   setCode(data.codeResult.code);
  //   stopReader();
  // };

  const copyCode = () => {
    if (copy(code)) {
      toast.success('Copy Success!');
    } else {
      toast.error('Failed to Copy!');
    }
  };

  return (
    <Box className="q-page" sx={{ textAlign: 'center', padding: '20px' }}>
      <Typography variant="h6" gutterBottom>
        Barcode Reader QuaggaJs
      </Typography>

      <Button
        variant="contained"
        color="primary"
        size="large"
        startIcon={<i className="mdi mdi-barcode-scan"></i>}
        onClick={() => setCameraStatus(true)}
      >
        Start Scanner
      </Button>

      <h1>Barcode Reader Results Below:</h1>
      <h1>{code}</h1>
      {code && (
        <Box sx={{ marginTop: '20px' }}>
          <Typography variant="h6">
            Result: {code}
          </Typography>
          <Button
            variant="contained"
            size="medium"
            color="secondary"
            startIcon={<i className="mdi mdi-content-copy"></i>}
            onClick={copyCode}
            sx={{ marginLeft: '10px' }}
          >
            Copy Code
          </Button>
        </Box>
      )}

      {cameraStatus && (
        <Box
          sx={{ textAlign: 'center', marginTop: '20px' }}
          id="reader"
          ref={readerRef}
          style={{ width: '100%', height: '400px' }} // Adjust size as needed
        />
      )}

      <ToastContainer />
    </Box>
  );
};

export default BarcodeReader;
