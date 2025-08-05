package com.fourfingers.quangvinhstore.usecase.boundary;

public interface AzureSpeechBoundary {
    String textToSpeech(String text);
    String speechToText(String base64Audio);
}
