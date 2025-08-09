package com.fourfingers.quangvinhstore.infrastructure.persistence.util;

import com.fourfingers.quangvinhstore.usecase.boundary.AzureSpeechBoundary;
import com.microsoft.cognitiveservices.speech.*;
import com.microsoft.cognitiveservices.speech.audio.AudioConfig;
import com.microsoft.cognitiveservices.speech.audio.AudioOutputStream;
import com.microsoft.cognitiveservices.speech.audio.PullAudioOutputStream;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.util.Base64;
import java.util.concurrent.Future;

@Component
public class AzureSpeechUtil implements AzureSpeechBoundary {

    @Value("${azure.speech.key}")
    private String azureKey;

    @Value("${azure.speech.region}")
    private String azureRegion;
        
    public String textToSpeech(String text){
        try {
            // 1. Azure config
            SpeechConfig config = SpeechConfig.fromSubscription(azureKey, azureRegion);
            config.setSpeechSynthesisVoiceName("vi-VN-HoaiMyNeural");

            // 2. Create synthesizer (no need PullAudioOutputStream if not streaming)
            try (SpeechSynthesizer synthesizer = new SpeechSynthesizer(config)) {

                // 3. Synthesize to memory
                SpeechSynthesisResult result = synthesizer.SpeakText(text);

                // 4. Check for errors
                if (result.getReason() != ResultReason.SynthesizingAudioCompleted) {
                    throw new RuntimeException("TTS failed: " + result.getReason());
                }

                // 5. Get raw audio bytes from result
                byte[] audioData = result.getAudioData();

                // 6. Return Base64 string
                return Base64.getEncoder().encodeToString(audioData);
            }

        } catch (Exception e) {
            throw new RuntimeException("TTS error: " + e.getMessage(), e);
        }
    }

    @Override
    public String speechToText(String base64Audio) {
        try {
            // Decode base64 string → bytes full WAV file (đã có header)
            byte[] wavBytes = Base64.getDecoder().decode(base64Audio);

            // Ghi thẳng file WAV từ bytes đã decode
            File tempAudio = File.createTempFile("speech-", ".wav");
            try (FileOutputStream fos = new FileOutputStream(tempAudio)) {
                fos.write(wavBytes);
            }

            SpeechConfig config = SpeechConfig.fromSubscription(azureKey, azureRegion);
            config.setSpeechRecognitionLanguage("vi-VN");

            AudioConfig audioConfig = AudioConfig.fromWavFileInput(tempAudio.getAbsolutePath());
            int a = 10;
            SpeechRecognizer recognizer = new SpeechRecognizer(config, audioConfig);
            SpeechRecognitionResult result = recognizer.recognizeOnceAsync().get();

            recognizer.close();
            audioConfig.close();
            tempAudio.delete();

            return result.getText();
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Speech recognition failed: " + e.getMessage());
        }
    }
}
