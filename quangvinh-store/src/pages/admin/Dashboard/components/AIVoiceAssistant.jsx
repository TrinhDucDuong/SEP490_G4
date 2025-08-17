import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Loader2, WifiOff, Wifi } from 'lucide-react';

const AIVoiceAssistant = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState('Đang kết nối...');
    const [error, setError] = useState(null);

    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const wsRef = useRef(null);
    const audioRef = useRef(null);
    const reconnectTimeoutRef = useRef(null);
    const recordingStartTimeRef = useRef(null);

    const connectionAttemptRef = useRef(false);
    const componentMountedRef = useRef(true);

    // Cấu hình đơn giản cho manual recording
    const RECORDING_CONFIG = {
        MAX_DURATION: 30000,   // 30 giây tối đa
        AUDIO_BITRATE: 16000,  // 16kbps
        SAMPLE_RATE: 16000,    // 16kHz
        MAX_FILE_SIZE: 2000 * 1024, // 2MB backend limit
    };

    useEffect(() => {
        componentMountedRef.current = true;
        return () => {
            componentMountedRef.current = false;
            connectionAttemptRef.current = false;
        };
    }, []);

    // Custom AudioBuffer to WAV conversion
    const audioBufferToWav = (buffer) => {
        const numOfChan = buffer.numberOfChannels;
        const length = buffer.length * numOfChan * 2 + 44;
        const bufferArray = new ArrayBuffer(length);
        const view = new DataView(bufferArray);

        const writeString = (view, offset, string) => {
            for (let i = 0; i < string.length; i++) {
                view.setUint8(offset + i, string.charCodeAt(i));
            }
        };

        let offset = 0;

        // RIFF chunk descriptor
        writeString(view, offset, 'RIFF'); offset += 4;
        view.setUint32(offset, length - 8, true); offset += 4;
        writeString(view, offset, 'WAVE'); offset += 4;

        // FMT sub-chunk
        writeString(view, offset, 'fmt '); offset += 4;
        view.setUint32(offset, 16, true); offset += 4;
        view.setUint16(offset, 1, true); offset += 2;
        view.setUint16(offset, numOfChan, true); offset += 2;
        view.setUint32(offset, buffer.sampleRate, true); offset += 4;
        view.setUint32(offset, buffer.sampleRate * 2 * numOfChan, true); offset += 4;
        view.setUint16(offset, numOfChan * 2, true); offset += 2;
        view.setUint16(offset, 16, true); offset += 2;

        // Data sub-chunk
        writeString(view, offset, 'data'); offset += 4;
        view.setUint32(offset, length - offset - 4, true); offset += 4;

        // Write PCM samples
        const channelBuffers = [];
        for (let i = 0; i < numOfChan; i++) {
            channelBuffers.push(buffer.getChannelData(i));
        }

        let pos = offset;
        for (let i = 0; i < buffer.length; i++) {
            for (let channel = 0; channel < numOfChan; channel++) {
                let sample = Math.max(-1, Math.min(1, channelBuffers[channel][i]));
                sample = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
                view.setInt16(pos, sample, true);
                pos += 2;
            }
        }

        return bufferArray;
    };

    // Custom WebM to WAV conversion
    const convertWebMToWavBase64 = async (webmBlob) => {
        try {
            console.log('Converting WebM to WAV...');
            console.log('Original WebM size:', (webmBlob.size / 1024).toFixed(2) + ' KB');

            // Validate input
            if (!webmBlob || webmBlob.size === 0) {
                throw new Error('WebM blob is empty or null');
            }

            if (webmBlob.size < 1024) {
                throw new Error('WebM blob too small, likely incomplete');
            }

            // Convert WebM to AudioBuffer using Web Audio API
            const arrayBuffer = await webmBlob.arrayBuffer();
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();

            let audioBuffer;
            try {
                // Decode with timeout protection
                const decodePromise = audioContext.decodeAudioData(arrayBuffer);
                const timeoutPromise = new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('Decode timeout after 10 seconds')), 10000)
                );

                audioBuffer = await Promise.race([decodePromise, timeoutPromise]);
                console.log('WebM decoded successfully');
                console.log('Sample Rate:', audioBuffer.sampleRate);
                console.log('Channels:', audioBuffer.numberOfChannels);
                console.log('Duration:', audioBuffer.duration.toFixed(2) + 's');

            } catch (decodeError) {
                console.error('AudioContext decode failed:', decodeError);
                throw new Error('Cannot decode WebM audio: ' + decodeError.message);
            }

            // Convert AudioBuffer to WAV
            const wavArrayBuffer = audioBufferToWav(audioBuffer);
            const wavBlob = new Blob([wavArrayBuffer], { type: 'audio/wav' });

            console.log('WAV Blob size:', (wavBlob.size / 1024).toFixed(2) + ' KB');

            // Validate WAV size
            if (wavBlob.size > RECORDING_CONFIG.MAX_FILE_SIZE) {
                throw new Error(`WAV file too large: ${(wavBlob.size/1024).toFixed(1)}KB > ${RECORDING_CONFIG.MAX_FILE_SIZE/1024}KB`);
            }

            // Convert to base64
            const wavBase64 = await blobToBase64(wavBlob);
            console.log('WAV conversion completed');
            console.log('WAV Base64 length:', wavBase64.length);

            return wavBase64;

        } catch (error) {
            console.error('Error in WebM to WAV conversion:', error);
            throw error;
        }
    };

    const blobToBase64 = (blob) => {
        return new Promise((resolve, reject) => {
            if (!blob) {
                return reject(new Error('Blob parameter is null or undefined'));
            }

            if (!(blob instanceof Blob)) {
                console.error('Invalid input type:', typeof blob);
                return reject(new Error('Parameter is not a Blob. Got: ' + typeof blob));
            }

            if (blob.size === 0) {
                return reject(new Error('Blob is empty (size = 0)'));
            }

            console.log('blobToBase64 validation passed - Size:', blob.size, 'Type:', blob.type);

            const reader = new FileReader();
            reader.onloadend = () => {
                try {
                    const result = reader.result;
                    if (!result) {
                        return reject(new Error('FileReader result is null'));
                    }

                    const base64 = result.split(',')[1];
                    if (!base64) {
                        return reject(new Error('Failed to extract base64 from DataURL'));
                    }

                    resolve(base64);
                } catch (err) {
                    reject(new Error('Error processing FileReader result: ' + err.message));
                }
            };

            reader.onerror = () => reject(new Error('FileReader failed to read Blob'));
            reader.readAsDataURL(blob);
        });
    };

    // WebSocket connection
    const connectWebSocket = useCallback(() => {
        if (connectionAttemptRef.current || !componentMountedRef.current) {
            console.log('Skipping connection attempt');
            return;
        }

        connectionAttemptRef.current = true;

        if (wsRef.current) {
            if (wsRef.current.readyState === WebSocket.OPEN ||
                wsRef.current.readyState === WebSocket.CONNECTING) {
                wsRef.current.close(1000, 'New connection');
            }
            wsRef.current = null;
        }

        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
            reconnectTimeoutRef.current = null;
        }

        try {
            console.log('Creating WebSocket connection...');
            setConnectionStatus('Đang kết nối...');
            setError(null);

            wsRef.current = new WebSocket('ws://localhost:9999/admin/ai-assistant');

            const connectionTimeout = setTimeout(() => {
                if (wsRef.current && wsRef.current.readyState === WebSocket.CONNECTING) {
                    wsRef.current.close(1000, 'Connection timeout');
                }
            }, 8000);

            wsRef.current.onopen = () => {
                if (!componentMountedRef.current) return;
                clearTimeout(connectionTimeout);
                console.log('WebSocket connected');

                console.group('WebSocket Connection Established');
                console.log('URL:', wsRef.current.url);
                console.log('Ready State:', wsRef.current.readyState);
                console.log('Connected At:', new Date().toISOString());
                console.groupEnd();

                connectionAttemptRef.current = false;
                setIsConnected(true);
                setConnectionStatus('Đã kết nối');
                setError(null);
            };

            wsRef.current.onmessage = (event) => {
                if (!componentMountedRef.current) return;

                try {
                    const data = event.data;
                    console.log('Response received, length:', data.length);

                    const base64Pattern = /^[A-Za-z0-9+/]*={0,2}$/;

                    if (base64Pattern.test(data) && data.length > 100) {
                        // AI Audio Response
                        console.log('Playing AI audio response');
                        playAudioFromBase64(data);
                        setError(null);
                    } else {
                        // Text response
                        console.log('Text message:', data);
                        if (data.toLowerCase().includes('error') ||
                            data.toLowerCase().includes('failed')) {
                            setError(`Backend: ${data}`);
                        } else {
                            console.log('Server message:', data);
                        }
                    }

                    setIsProcessing(false);
                } catch (err) {
                    console.error('Error handling message:', err);
                    setError('Lỗi xử lý phản hồi từ backend');
                    setIsProcessing(false);
                }
            };

            wsRef.current.onclose = (event) => {
                if (!componentMountedRef.current) return;
                clearTimeout(connectionTimeout);
                connectionAttemptRef.current = false;
                console.log('WebSocket closed:', event.code, event.reason);
                setIsConnected(false);
                setIsProcessing(false);

                switch (event.code) {
                    case 1000:
                        setConnectionStatus('Đã ngắt kết nối');
                        break;
                    case 1009:
                        setConnectionStatus('Lỗi - File quá lớn');
                        setError('File âm thanh quá lớn. Thu âm ngắn hơn.');
                        return;
                    case 1011:
                        setConnectionStatus('Lỗi server');
                        setError('Backend server gặp lỗi khi xử lý audio.');
                        break;
                    default:
                        setConnectionStatus(`Lỗi kết nối (${event.code})`);
                        setError(`WebSocket closed: ${event.reason || 'Unknown'}`);
                }

                if (event.code !== 1000 && event.code !== 1009) {
                    reconnectTimeoutRef.current = setTimeout(() => {
                        if (componentMountedRef.current && !connectionAttemptRef.current) {
                            connectWebSocket();
                        }
                    }, 3000);
                }
            };

            wsRef.current.onerror = (error) => {
                if (!componentMountedRef.current) return;
                clearTimeout(connectionTimeout);
                connectionAttemptRef.current = false;
                console.error('WebSocket error:', error);
                setError('Lỗi kết nối WebSocket');
                setIsConnected(false);
                setIsProcessing(false);
                setConnectionStatus('Lỗi kết nối');
            };

        } catch (err) {
            console.error('Error creating WebSocket:', err);
            connectionAttemptRef.current = false;
            setError('Không thể tạo kết nối WebSocket');
            setConnectionStatus('Lỗi khởi tạo');
        }
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            connectWebSocket();
        }, 1000);

        return () => {
            clearTimeout(timer);
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
            if (wsRef.current) {
                wsRef.current.close(1000, 'Component unmounting');
            }
        };
    }, [connectWebSocket]);

    // Manual Recording Functions
    const startRecording = async () => {
        try {
            setError(null);

            if (!isConnected) {
                setError('Chưa kết nối đến AI Assistant');
                return;
            }

            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true,
                    sampleRate: RECORDING_CONFIG.SAMPLE_RATE,
                    channelCount: 1
                }
            });

            let mimeType = 'audio/webm;codecs=opus';
            if (!MediaRecorder.isTypeSupported(mimeType)) {
                mimeType = 'audio/webm';
            }

            mediaRecorderRef.current = new MediaRecorder(stream, {
                mimeType: mimeType,
                audioBitsPerSecond: RECORDING_CONFIG.AUDIO_BITRATE
            });

            console.log('Using MIME type:', mimeType);

            audioChunksRef.current = [];
            recordingStartTimeRef.current = Date.now();

            // Auto-stop after max duration
            const maxDurationTimer = setTimeout(() => {
                if (isRecording) {
                    console.log('Max duration reached, auto-stopping...');
                    stopRecording();
                    setError(`Thu âm tự động dừng sau ${RECORDING_CONFIG.MAX_DURATION/1000} giây`);
                }
            }, RECORDING_CONFIG.MAX_DURATION);

            mediaRecorderRef.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                    console.log(`Audio chunk added, size: ${(event.data.size / 1024).toFixed(2)}KB`);
                }
            };

            mediaRecorderRef.current.onstop = async () => {
                clearTimeout(maxDurationTimer);
                const duration = Date.now() - recordingStartTimeRef.current;
                console.log(`Recording duration: ${duration}ms`);

                if (audioChunksRef.current.length === 0) {
                    console.log('No audio chunks recorded');
                    setIsProcessing(false);
                    return;
                }

                const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
                console.log(`Final audio blob size: ${(audioBlob.size / 1024).toFixed(2)} KB`);

                // Size check
                if (audioBlob.size > RECORDING_CONFIG.MAX_FILE_SIZE / 2) {
                    console.error(`Audio blob too large: ${(audioBlob.size / 1024).toFixed(2)}KB`);
                    setError(`Recording quá lớn (${(audioBlob.size/1024).toFixed(1)}KB). Thu âm ngắn hơn.`);
                    setIsProcessing(false);
                    return;
                }

                // Only process if meaningful
                if (audioBlob.size > 2048 && duration > 1000) {
                    await convertAndSendAudio(audioBlob);
                } else {
                    console.log('Audio too small/short, skipping...');
                    setIsProcessing(false);
                }

                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorderRef.current.onerror = (event) => {
                console.error('MediaRecorder error:', event.error);
                setError('Lỗi thu âm: ' + event.error.message);
                setIsRecording(false);
                setIsProcessing(false);
            };

            mediaRecorderRef.current.start(500); // Small chunks for better performance
            setIsRecording(true);
            console.log('Manual recording started');

        } catch (err) {
            console.error('Error starting recording:', err);
            setError('Không thể truy cập microphone');
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            try {
                mediaRecorderRef.current.stop();
                setIsRecording(false);
                setIsProcessing(true);
                console.log('Manual recording stopped');
            } catch (err) {
                console.error('Error stopping recording:', err);
                setIsRecording(false);
                setIsProcessing(false);
            }
        }
    };

    const toggleRecording = () => {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    };

    // Convert and Send Audio
    const convertAndSendAudio = async (audioBlob) => {
        try {
            console.group('Audio Conversion Process');
            console.log('Original audio size:', (audioBlob.size / 1024).toFixed(2) + ' KB');

            // WebSocket state checking
            const wsState = wsRef.current?.readyState;
            const wsStates = {
                0: 'CONNECTING',
                1: 'OPEN',
                2: 'CLOSING',
                3: 'CLOSED'
            };

            console.log('🔌 WebSocket state:', wsState, `(${wsStates[wsState] || 'UNKNOWN'})`);

            if (!wsRef.current || wsState !== WebSocket.OPEN) {
                console.error('WebSocket not ready for sending');
                setError(`WebSocket ${wsStates[wsState] || 'unavailable'}. Đang kết nối lại...`);

                // Force reconnect if needed
                if (wsState === WebSocket.CLOSED || wsState === WebSocket.CLOSING) {
                    console.log('Initiating WebSocket reconnect...');
                    connectWebSocket();
                }

                setIsProcessing(false);
                return;
            }

            // Size check trước conversion
            if (audioBlob.size > RECORDING_CONFIG.MAX_FILE_SIZE / 4) {
                setError(`Audio file quá lớn (${(audioBlob.size/1024).toFixed(1)}KB).`);
                setIsProcessing(false);
                return;
            }

            // Convert to WAV Base64
            const wavBase64 = await convertWebMToWavBase64(audioBlob);
            const wavBase64Size = (wavBase64.length * 3) / 4;

            console.log(`WAV Base64 size: ${(wavBase64Size / 1024).toFixed(2)} KB`);

            // Final validation
            if (wavBase64Size > RECORDING_CONFIG.MAX_FILE_SIZE) {
                setError(`WAV quá lớn (${(wavBase64Size/1024).toFixed(1)}KB). Thu âm ngắn hơn.`);
                setIsProcessing(false);
                return;
            }

            console.groupEnd();

            // Send to backend
            if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
                console.log(`Sending WAV Base64 - Size: ${(wavBase64.length / 1024).toFixed(2)} KB`);

                const sendStartTime = performance.now();
                wsRef.current.send(wavBase64);
                const sendEndTime = performance.now();

                console.log('WAV Base64 sent successfully');
                console.log(`Send duration: ${(sendEndTime - sendStartTime).toFixed(2)}ms`);

            } else {
                console.error('WebSocket disconnected during conversion');
                setError('Kết nối bị ngắt trong quá trình xử lý');
                setIsProcessing(false);
            }
        } catch (err) {
            console.error('Error in conversion:', err);
            setError('Lỗi xử lý âm thanh: ' + err.message);
            setIsProcessing(false);
        }
    };

    const playAudioFromBase64 = async (base64Audio) => {
        try {
            setIsPlaying(true);
            console.log('Playing AI response');

            const binaryString = atob(base64Audio);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }

            const audioBlob = new Blob([bytes], { type: 'audio/wav' });
            const audioUrl = URL.createObjectURL(audioBlob);

            const audio = new Audio(audioUrl);
            audioRef.current = audio;

            audio.onended = () => {
                setIsPlaying(false);
                URL.revokeObjectURL(audioUrl);
                console.log('AI response playback completed');
            };

            audio.onerror = (err) => {
                console.error('Error playing audio:', err);
                setError('Lỗi phát âm thanh');
                setIsPlaying(false);
                URL.revokeObjectURL(audioUrl);
            };

            await audio.play();
        } catch (err) {
            console.error('Error playing audio:', err);
            setError('Không thể phát âm thanh');
            setIsPlaying(false);
        }
    };

    const stopAudio = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            setIsPlaying(false);
        }
    };

    const handleRetryConnection = () => {
        setError(null);
        if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
        }
        connectionAttemptRef.current = false;
        connectWebSocket();
    };

    return (
        <div className="flex items-center space-x-3">
            {/* Connection Status */}
            <div className="flex items-center space-x-2">
                {isConnected ? (
                    <Wifi className="w-4 h-4 text-green-500" />
                ) : (
                    <WifiOff className="w-4 h-4 text-red-500" />
                )}
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
            </div>

            {/* Recording Button */}
            <button
                onClick={toggleRecording}
                disabled={!isConnected || isProcessing}
                className={`
                    relative flex items-center justify-center w-12 h-12 rounded-full transition-all duration-200
                    ${isRecording
                    ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                    : 'bg-blue-500 hover:bg-blue-600'
                }
                    ${(!isConnected || isProcessing) ? 'opacity-50 cursor-not-allowed' : 'shadow-lg hover:shadow-xl'}
                `}
                title={isRecording ? "Dừng ghi âm" : `Bắt đầu ghi âm (tối đa ${RECORDING_CONFIG.MAX_DURATION/1000}s)`}
            >
                {isProcessing ? (
                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                ) : isRecording ? (
                    <MicOff className="w-6 h-6 text-white" />
                ) : (
                    <Mic className="w-6 h-6 text-white" />
                )}

                {isRecording && (
                    <div className="absolute inset-0 rounded-full bg-red-500 opacity-25 animate-ping"></div>
                )}
            </button>

            {/* Audio Control Button */}
            {isPlaying && (
                <button
                    onClick={stopAudio}
                    className="flex items-center justify-center w-10 h-10 bg-green-500 hover:bg-green-600 rounded-full shadow-lg transition-all duration-200"
                    title="Dừng phát âm thanh"
                >
                    <VolumeX className="w-5 h-5 text-white" />
                </button>
            )}

            {/* Status Display */}
            <div className="flex flex-col">
                <span className={`text-sm font-medium ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
                    {connectionStatus}
                </span>

                {isRecording && (
                    <span className="text-xs text-red-600 font-medium">
                        Đang thu âm...
                    </span>
                )}

                {isProcessing && (
                    <span className="text-xs text-blue-600">
                        Đang chuyển đổi WAV...
                    </span>
                )}

                {isPlaying && (
                    <span className="text-xs text-green-600 flex items-center">
                        <Volume2 className="w-3 h-3 mr-1" />
                        Đang phát âm thanh
                    </span>
                )}

                <div className="flex space-x-2 mt-1">
                    {!isConnected && (
                        <button
                            onClick={handleRetryConnection}
                            className="text-xs text-blue-600 hover:text-blue-800"
                        >
                            Kết nối lại
                        </button>
                    )}
                    <span className="text-xs text-gray-500">
                        Manual • Max: {RECORDING_CONFIG.MAX_DURATION/1000}s
                    </span>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="absolute top-16 right-0 bg-red-100 border border-red-300 text-red-700 px-3 py-2 rounded-md shadow-lg z-50 max-w-sm">
                    <p className="text-sm">{error}</p>
                    <div className="flex space-x-2 mt-2">
                        <button
                            onClick={() => setError(null)}
                            className="text-xs text-red-500 hover:text-red-700"
                        >
                            Đóng
                        </button>
                        {error.includes('lớn') && (
                            <span className="text-xs text-gray-600">
                                Thử &lt; 20s
                            </span>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AIVoiceAssistant;
