package com.fourfingers.quangvinhstore.usecase.boundary;

import org.springframework.web.multipart.MultipartFile;

public interface AzureSpeechBoundary {
    void textToSpeech(String text);
    String speechToText(MultipartFile file);
}
