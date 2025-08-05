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

            // 2. Create PullAudioOutputStream to read from
            PullAudioOutputStream pullStream = AudioOutputStream.createPullStream();
            AudioConfig audioConfig = AudioConfig.fromStreamOutput(pullStream);
            SpeechSynthesizer synthesizer = new SpeechSynthesizer(config, audioConfig);

            // 3. Synthesize
            SpeechSynthesisResult result = synthesizer.SpeakText(text);

            // 4. Read audio bytes
            ByteArrayOutputStream output = new ByteArrayOutputStream();
            byte[] buffer = new byte[4096];
            int bytesRead;
            while ((bytesRead = (int) pullStream.read(buffer)) > 0) {
                output.write(buffer, 0, bytesRead);
            }

            // 5. Clean up
            result.close();
            synthesizer.close();
            pullStream.close();

            // 6. Return base64 string
            return Base64.getEncoder().encodeToString(output.toByteArray());

        } catch (Exception e) {
            throw new RuntimeException("TTS error: " + e.getMessage(), e);
        }
    }

    @Override
    public String speechToText(String base64Audio) {
        try {
            // Decode base64 string → bytes
            byte[] audioBytes = Base64.getDecoder().decode(base64Audio);

            // Write to temp .wav file
            File tempAudio = File.createTempFile("speech-", ".wav");
            try (FileOutputStream fos = new FileOutputStream(tempAudio)) {
                fos.write(audioBytes);
            }

            // Azure Speech Config
            SpeechConfig config = SpeechConfig.fromSubscription(azureKey, azureRegion);
            config.setSpeechRecognitionLanguage("vi-VN");

            // Audio input config
            AudioConfig audioConfig = AudioConfig.fromWavFileInput(tempAudio.getAbsolutePath());

            // Recognizer
            SpeechRecognizer recognizer = new SpeechRecognizer(config, audioConfig);
            Future<SpeechRecognitionResult> task = recognizer.recognizeOnceAsync();
            SpeechRecognitionResult result = task.get();

            // Clean up
            recognizer.close();
            audioConfig.close();
            tempAudio.delete();

            return result.getText(); // Trả kết quả
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Speech recognition failed: " + e.getMessage());
        }
    }
}
