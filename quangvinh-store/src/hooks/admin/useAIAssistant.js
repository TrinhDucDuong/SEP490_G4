import { useState, useRef, useCallback, useEffect } from 'react';

export const useAIAssistant = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [isInCall, setIsInCall] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);

    const [chatHistory, setChatHistory] = useState([]);
    const [audioLevel, setAudioLevel] = useState(0);

    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const wsRef = useRef(null);
    const audioRef = useRef(null);
    const streamRef = useRef(null);
    const voiceDetectionRef = useRef(null);

    // Voice Activity Detection refs
    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const silenceTimeoutRef = useRef(null);
    const recordingStartTimeRef = useRef(null);
    const lastVoiceTimeRef = useRef(null);
    const hasVoiceRef = useRef(false);
    const lastDetectionTimeRef = useRef(0);

    const RECORDING_CONFIG = {
        SILENCE_THRESHOLD: 0.2,
        SILENCE_DURATION: 3000,
        MAX_RECORDING_TIME: 20000,
        SAMPLE_RATE: 16000,
        MAX_FILE_SIZE: 2000 * 1024,
        DETECTION_THROTTLE: 100
    };

    const convertWebMToWAV = async (webmBlob) => {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const arrayBuffer = await webmBlob.arrayBuffer();
            const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

            // Resample to 16kHz mono for Azure Speech SDK
            const targetSampleRate = 16000;
            const numberOfChannels = 1;
            const length = Math.ceil(audioBuffer.duration * targetSampleRate);

            const offlineContext = new OfflineAudioContext(numberOfChannels, length, targetSampleRate);
            const source = offlineContext.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(offlineContext.destination);
            source.start(0);

            const renderedBuffer = await offlineContext.startRendering();

            // Encode to WAV
            const wavBlob = encodeWAV(renderedBuffer);
            await audioContext.close();
            return wavBlob;
        } catch (err) {
            throw err;
        }
    };

    // Encode AudioBuffer to WAV blob
    const encodeWAV = (audioBuffer) => {
        const numChannels = audioBuffer.numberOfChannels;
        const sampleRate = audioBuffer.sampleRate;
        const format = 1; // PCM
        const bitsPerSample = 16;
        const bytesPerSample = bitsPerSample / 8;
        const blockAlign = numChannels * bytesPerSample;
        const byteRate = sampleRate * blockAlign;
        const dataSize = audioBuffer.length * blockAlign;
        const bufferSize = 44 + dataSize;

        const buffer = new ArrayBuffer(bufferSize);
        const view = new DataView(buffer);

        // WAV header
        let offset = 0;

        const writeString = (str) => {
            for (let i = 0; i < str.length; i++) {
                view.setUint8(offset++, str.charCodeAt(i));
            }
        };

        writeString('RIFF');
        view.setUint32(offset, bufferSize - 8, true); offset += 4;
        writeString('WAVE');
        writeString('fmt ');
        view.setUint32(offset, 16, true); offset += 4; // Subchunk1Size
        view.setUint16(offset, format, true); offset += 2; // AudioFormat
        view.setUint16(offset, numChannels, true); offset += 2; // NumChannels
        view.setUint32(offset, sampleRate, true); offset += 4; // SampleRate
        view.setUint32(offset, byteRate, true); offset += 4; // ByteRate
        view.setUint16(offset, blockAlign, true); offset += 2; // BlockAlign
        view.setUint16(offset, bitsPerSample, true); offset += 2; // BitsPerSample
        writeString('data');
        view.setUint32(offset, dataSize, true); offset += 4; // Subchunk2Size

        // Audio data
        const channelData = audioBuffer.getChannelData(0);
        for (let i = 0; i < audioBuffer.length; i++) {
            const sample = Math.max(-1, Math.min(1, channelData[i]));
            const intSample = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
            view.setInt16(offset, intSample, true);
            offset += 2;
        }

        return new Blob([buffer], { type: 'audio/wav' });
    };

    const startRecordingSegment = useCallback(() => {

        try {
            mediaRecorderRef.current = new MediaRecorder(streamRef.current, {
                mimeType: 'audio/webm;codecs=opus'
            });

            audioChunksRef.current = [];
            recordingStartTimeRef.current = Date.now();
            lastVoiceTimeRef.current = Date.now();

            // Auto-stop after MAX_RECORDING_TIME
            const maxRecordingTimeout = setTimeout(() => {
                if (isRecording) {
                    stopRecordingSegment();
                }
            }, RECORDING_CONFIG.MAX_RECORDING_TIME);

            mediaRecorderRef.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorderRef.current.onstop = async () => {
                clearTimeout(maxRecordingTimeout);

                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                const totalDuration = Date.now() - recordingStartTimeRef.current;
                const voiceDuration = lastVoiceTimeRef.current - recordingStartTimeRef.current;

                if (audioBlob.size > 1000 && voiceDuration > 500) {
                    const userMessage = {
                        id: Date.now(),
                        type: 'user',
                        audioBlob,
                        timestamp: new Date(),
                        duration: voiceDuration,
                        actualDuration: totalDuration
                    };

                    setChatHistory(prev => [...prev, userMessage]);
                    await convertAndSendAudio(audioBlob);
                } else {
                    setIsProcessing(false);
                }
            };

            mediaRecorderRef.current.onerror = (event) => {
                setError('Lỗi thu âm: ' + event.error.message);
                setIsRecording(false);
                setIsProcessing(false);
            };

            mediaRecorderRef.current.start(100);
            setIsRecording(true);


        } catch (err) {
            setError('Lỗi bắt đầu thu âm: ' + err.message);
        }
    }, [isRecording, isProcessing]);

    const stopRecordingSegment = useCallback(() => {
        if (mediaRecorderRef.current && isRecording) {

            mediaRecorderRef.current.stop();
            setIsRecording(false);
            setIsProcessing(true);

            if (silenceTimeoutRef.current) {
                clearTimeout(silenceTimeoutRef.current);
                silenceTimeoutRef.current = null;
            }

            hasVoiceRef.current = false;
        }
    }, [isRecording]);

    // Voice Activity Detection với immediate state update
    const detectVoiceActivity = useCallback(() => {
        const now = performance.now();
        if (now - lastDetectionTimeRef.current < RECORDING_CONFIG.DETECTION_THROTTLE) {
            if (isInCall) {
                voiceDetectionRef.current = requestAnimationFrame(detectVoiceActivity);
            }
            return;
        }
        lastDetectionTimeRef.current = now;

        const bufferLength = analyserRef.current.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyserRef.current.getByteFrequencyData(dataArray);

        const rms = Math.sqrt(dataArray.reduce((sum, val) => sum + val * val, 0) / bufferLength);
        const normalizedLevel = rms / 255;

        setAudioLevel(normalizedLevel);

        const isVoice = normalizedLevel > RECORDING_CONFIG.SILENCE_THRESHOLD;

        if (isVoice) {
            hasVoiceRef.current = true;

            if (isRecording) {
                lastVoiceTimeRef.current = Date.now();
            }

            if (!isRecording && !isProcessing) {
                startRecordingSegment();
            }

            if (silenceTimeoutRef.current) {
                clearTimeout(silenceTimeoutRef.current);
                silenceTimeoutRef.current = null;
            }
        } else {
            if (isRecording && !silenceTimeoutRef.current && hasVoiceRef.current) {
                silenceTimeoutRef.current = setTimeout(() => {
                    stopRecordingSegment();
                }, RECORDING_CONFIG.SILENCE_DURATION);
            }
        }

        if (isInCall) {
            voiceDetectionRef.current = requestAnimationFrame(detectVoiceActivity);
        }
    }, [isInCall, isRecording, isProcessing, startRecordingSegment, stopRecordingSegment]);

    // WebSocket connection
    const connectWebSocket = useCallback(() => {
        if (wsRef.current && (wsRef.current.readyState === WebSocket.OPEN || wsRef.current.readyState === WebSocket.CONNECTING)) {
            return Promise.resolve();
        }

        return new Promise((resolve, reject) => {
            try {
                wsRef.current = new WebSocket('wss://quangvinh.store/admin/ai-assistant');

                wsRef.current.onopen = () => {
                    setIsConnected(true);
                    setError(null);
                    resolve();
                };

                wsRef.current.onmessage = (event) => {
                    try {
                        const data = event.data;
                        const base64Pattern = /^[A-Za-z0-9+/]*={0,2}$/;

                        if (base64Pattern.test(data) && data.length > 100) {
                            const aiMessage = {
                                id: Date.now(),
                                type: 'ai',
                                audioBase64: data,
                                timestamp: new Date()
                            };
                            setChatHistory(prev => [...prev, aiMessage]);
                            playAudioFromBase64(data);
                        }

                        setIsProcessing(false);
                    } catch (err) {
                        setError('Lỗi xử lý phản hồi từ AI');
                        setIsProcessing(false);
                    }
                };

                wsRef.current.onclose = () => {
                    setIsConnected(false);
                    setIsProcessing(false);
                };

                wsRef.current.onerror = (error) => {
                    setError('Lỗi kết nối WebSocket');
                    setIsConnected(false);
                    setIsProcessing(false);
                    reject(error);
                };
            } catch (err) {
                setError('Không thể kết nối đến server');
                reject(err);
            }
        });
    }, []);

    // Setup audio stream
    const setupAudioStream = async () => {
            try {
                const permissions = await navigator.permissions.query({name: 'microphone'});
                console.log('Microphone permission:', permissions.state);
            } catch (permErr) {
                console.log('Cannot check microphone permission:', permErr.message);
            }

            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true,
                    sampleRate: RECORDING_CONFIG.SAMPLE_RATE
                }
            });

            streamRef.current = stream;

            audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
            const source = audioContextRef.current.createMediaStreamSource(stream);
            analyserRef.current = audioContextRef.current.createAnalyser();
            analyserRef.current.fftSize = 256;
            source.connect(analyserRef.current);
            return stream;
    };

    // useEffect for voice detection
    useEffect(() => {
        if (isInCall && analyserRef.current) {
            detectVoiceActivity();
        }

        return () => {
            if (voiceDetectionRef.current) {
                cancelAnimationFrame(voiceDetectionRef.current);
                voiceDetectionRef.current = null;
            }
        };
    }, [isInCall, detectVoiceActivity]);

    // Start call
    const startCall = async () => {
        try {
            setError(null);
            if (!isConnected) {
                await connectWebSocket();
            }
            await setupAudioStream();
            setIsInCall(true);
            hasVoiceRef.current = false;
        } catch (err) {
            setError('Không thể bắt đầu cuộc gọi: ' + err.message);
        }
    };

    // End call
    const endCall = useCallback(() => {
        if (voiceDetectionRef.current) {
            cancelAnimationFrame(voiceDetectionRef.current);
            voiceDetectionRef.current = null;
        }

        if (isRecording && mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
        }

        if (silenceTimeoutRef.current) {
            clearTimeout(silenceTimeoutRef.current);
            silenceTimeoutRef.current = null;
        }

        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }

        if (audioContextRef.current) {
            audioContextRef.current.close();
            audioContextRef.current = null;
        }

        if (wsRef.current) {
            wsRef.current.close();
            wsRef.current = null;
        }

        setIsInCall(false);
        setIsRecording(false);
        setIsConnected(false);
        setIsProcessing(false);
        setAudioLevel(0);
        hasVoiceRef.current = false;
    }, [isRecording]);

    // Convert to WAV before sending
    const convertAndSendAudio = async (audioBlob) => {
        try {
            // Convert WebM to WAV first
            const wavBlob = await convertWebMToWAV(audioBlob);

            if (wavBlob.size > RECORDING_CONFIG.MAX_FILE_SIZE) {
                setError(`Đoạn ghi âm quá lớn (${(wavBlob.size/1024).toFixed(1)}KB). Nói ngắn hơn.`);
                setIsProcessing(false);
                return;
            }

            // Convert WAV to base64
            const base64Audio = await blobToBase64(wavBlob);
            const base64Size = (base64Audio.length * 3) / 4;

            if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
                wsRef.current.send(base64Audio);
            } else {
                setError('Kết nối WebSocket không khả dụng');
                setIsProcessing(false);
            }
        } catch (err) {
            setError('Lỗi xử lý âm thanh: ' + err.message);
            setIsProcessing(false);
        }
    };

    const blobToBase64 = (blob) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result.split(',')[1];
                resolve(base64);
            };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    };

    const playAudioFromBase64 = async (base64Audio) => {
        try {
            setIsPlaying(true);
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
            };

            audio.onerror = () => {
                setError('Lỗi phát âm thanh');
                setIsPlaying(false);
                URL.revokeObjectURL(audioUrl);
            };

            await audio.play();
        } catch (err) {
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

    const clearChatHistory = () => {
        setChatHistory([]);
    };

    const endConversation = () => {
        endCall();
        clearChatHistory();
    };

    return {
        isRecording,
        isConnected,
        isInCall,
        isPlaying,
        isProcessing,
        error,
        chatHistory,
        audioLevel,
        startCall,
        endCall,
        stopAudio,
        setError,
        clearChatHistory,
        endConversation,
        connectWebSocket
    };
};
