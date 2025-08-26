// pages/admin/Dashboard/components/ChatMessage.jsx
import React, { useState, useRef } from 'react';
import { FaPlay, FaPause, FaRobot, FaUser } from 'react-icons/fa';

const ChatMessage = ({ message }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const audioRef = useRef(null);

    const playAudio = async () => {
        try {
            if (!audioRef.current) {
                let audioUrl;

                if (message.type === 'user' && message.audioBlob) {
                    audioUrl = URL.createObjectURL(message.audioBlob);
                } else if (message.type === 'ai' && message.audioBase64) {
                    const binaryString = atob(message.audioBase64);
                    const bytes = new Uint8Array(binaryString.length);
                    for (let i = 0; i < binaryString.length; i++) {
                        bytes[i] = binaryString.charCodeAt(i);
                    }
                    const audioBlob = new Blob([bytes], { type: 'audio/wav' });
                    audioUrl = URL.createObjectURL(audioBlob);
                }

                const audio = new Audio(audioUrl);
                audioRef.current = audio;

                audio.onloadedmetadata = () => {
                    setDuration(audio.duration);
                };

                audio.ontimeupdate = () => {
                    setCurrentTime(audio.currentTime);
                };

                audio.onended = () => {
                    setIsPlaying(false);
                    setCurrentTime(0);
                    URL.revokeObjectURL(audioUrl);
                };
            }

            if (isPlaying) {
                audioRef.current.pause();
                setIsPlaying(false);
            } else {
                await audioRef.current.play();
                setIsPlaying(true);
            }
        } catch (error) {
            console.error('Error playing audio:', error);
        }
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    const isAI = message.type === 'ai';

    return (
        <div className={`flex ${isAI ? 'justify-start' : 'justify-end'} mb-3`}>
            <div className={`max-w-[280px] ${isAI ? 'flex-row' : 'flex-row-reverse'}`}>
                {/* Audio Message Bubble */}
                <div className={`rounded-2xl px-4 py-3 ${
                    isAI
                        ? 'bg-gray-200 text-gray-800 rounded-bl-sm'
                        : 'bg-red-500 text-white rounded-br-sm'
                }`}>
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={playAudio}
                            className={`p-2 rounded-full ${
                                isAI
                                    ? 'bg-white text-gray-700 hover:bg-gray-50'
                                    : 'bg-red-600 hover:bg-red-700 text-white'
                            } transition-colors flex-shrink-0`}
                        >
                            {isPlaying ? <FaPause size={12} /> : <FaPlay size={12} />}
                        </button>

                        <div className="flex-1">
                            {/* Audio Wave Visualization */}
                            <div className="flex items-center space-x-1 mb-1">
                                {[...Array(15)].map((_, i) => (
                                    <div
                                        key={i}
                                        className={`w-1 rounded-full transition-all duration-150 ${
                                            isAI ? 'bg-gray-600' : 'bg-white'
                                        } ${isPlaying ? 'animate-pulse' : ''}`}
                                        style={{
                                            height: `${Math.random() * 16 + 8}px`,
                                            animationDelay: `${i * 0.1}s`,
                                            opacity: isPlaying ? 0.8 : 0.6
                                        }}
                                    />
                                ))}
                            </div>

                            {/* Time Display */}
                            <div className={`text-xs ${isAI ? 'text-gray-600' : 'text-red-100'}`}>
                                {formatTime(currentTime)} / {formatTime(duration)}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Timestamp */}
                <div className={`text-xs text-gray-500 mt-1 ${isAI ? 'text-left' : 'text-right'}`}>
                    {message.timestamp.toLocaleTimeString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit'
                    })}
                </div>
            </div>
        </div>
    );
};

export default ChatMessage;
