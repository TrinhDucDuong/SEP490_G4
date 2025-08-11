import { useState, useRef, useEffect, useCallback } from 'react';

export const useAIAssistant = () => {
    const [isRecording, setIsRecording] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);

    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const wsRef = useRef(null);
    const audioRef = useRef(null);

    // WebSocket connection logic
    const connectWebSocket = useCallback(() => {
        try {
            wsRef.current = new WebSocket('ws://localhost:9999/admin/ai-assistant');

            wsRef.current.onopen = () => {
                setIsConnected(true);
                setError(null);
            };

            wsRef.current.onmessage = (event) => {
                try {
                    const response = JSON.parse(event.data);
                    if (response.audioBase64) {
                        playAudioFromBase64(response.audioBase64);
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
                setTimeout(connectWebSocket, 3000);
            };

            wsRef.current.onerror = () => {
                setError('Lỗi kết nối WebSocket');
                setIsConnected(false);
                setIsProcessing(false);
            };
        } catch (err) {
            setError('Không thể kết nối đến server');
        }
    }, []);

    // Audio recording and processing methods
    const startRecording = async () => {
        try {
            setError(null);
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    autoGainControl: true
                }
            });

            mediaRecorderRef.current = new MediaRecorder(stream, {
                mimeType: 'audio/webm;codecs=opus'
            });

            audioChunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorderRef.current.onstop = async () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                await convertAndSendAudio(audioBlob);
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
        } catch (err) {
            setError('Không thể truy cập microphone. Vui lòng cấp quyền.');
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            setIsProcessing(true);
        }
    };

    const convertAndSendAudio = async (audioBlob) => {
        try {
            const base64Audio = await blobToBase64(audioBlob);

            if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
                const message = {
                    type: 'AUDIO_QUESTION',
                    audioBase64: base64Audio,
                    timestamp: new Date().toISOString()
                };

                wsRef.current.send(JSON.stringify(message));
            } else {
                setError('Kết nối WebSocket không khả dụng');
                setIsProcessing(false);
            }
        } catch (err) {
            setError('Lỗi xử lý âm thanh');
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

            const audioBlob = new Blob([bytes], { type: 'audio/mpeg' });
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

    useEffect(() => {
        connectWebSocket();

        return () => {
            if (wsRef.current) {
                wsRef.current.close();
            }
        };
    }, [connectWebSocket]);

    return {
        isRecording,
        isConnected,
        isPlaying,
        isProcessing,
        error,
        startRecording,
        stopRecording,
        stopAudio,
        setError
    };
};
