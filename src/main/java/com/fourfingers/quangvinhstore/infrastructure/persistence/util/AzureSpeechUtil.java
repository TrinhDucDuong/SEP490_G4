package com.fourfingers.quangvinhstore.infrastructure.persistence.util;

import com.fourfingers.quangvinhstore.usecase.boundary.AzureSpeechBoundary;
import com.microsoft.cognitiveservices.speech.*;
import com.microsoft.cognitiveservices.speech.audio.AudioConfig;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.concurrent.Future;

@Component
public class AzureSpeechUtil implements AzureSpeechBoundary {

    @Value("${azure.speech.key}")
    private String azureKey;

    @Value("${azure.speech.region}")
    private String azureRegion;

    public void textToSpeech(String text){
        // 1. Configuration
        SpeechConfig config = SpeechConfig.fromSubscription(azureKey, azureRegion);
        config.setSpeechSynthesisVoiceName("vi-VN-HoaiMyNeural"); //Vietnamese

        // 2. Using speaker
        AudioConfig audioConfig = AudioConfig.fromDefaultSpeakerOutput();

        // 3. Create Speech Synthesizer
        SpeechSynthesizer synthesizer = new SpeechSynthesizer(config, audioConfig);

        // 4. ReedText
        SpeechSynthesisResult result = synthesizer.SpeakText(text);

        // 5. Check result
        if (result.getReason() == ResultReason.SynthesizingAudioCompleted) {
            System.out.println("Done");
        } else {
            System.err.println("TTS Erro");
            throw new RuntimeException("Text-to-Speech failed!");
        }

        result.close();
        synthesizer.close();
    }

    @Override
    public String speechToText(MultipartFile file) {
        try {
            // Save to temp file
            File tempAudio = File.createTempFile("speech-", ".wav");
            file.transferTo(tempAudio);

            // Config
            SpeechConfig config = SpeechConfig.fromSubscription(azureKey, azureRegion);
            config.setSpeechRecognitionLanguage("vi-VN"); // Vietnamese

            // Audio source from file
            AudioConfig audioConfig = AudioConfig.fromWavFileInput(tempAudio.getAbsolutePath());

            // Recognizer
            SpeechRecognizer recognizer = new SpeechRecognizer(config, audioConfig);
            Future<SpeechRecognitionResult> task = recognizer.recognizeOnceAsync();
            SpeechRecognitionResult result = task.get();

            String recognized = result.getText();

            recognizer.close();
            audioConfig.close();
            tempAudio.delete(); // Clean up

            return recognized;
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Speech recognition failed: " + e.getMessage());
        }
    }
}
