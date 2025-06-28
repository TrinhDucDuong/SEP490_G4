package com.fourfingers.quangvinhstore.usecase.boundary;

import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface AzureStorageBoundary {
    List<String> uploadMany(List<MultipartFile> files) throws Exception;
    void deleteFile(List<String> fileUrls);
}
