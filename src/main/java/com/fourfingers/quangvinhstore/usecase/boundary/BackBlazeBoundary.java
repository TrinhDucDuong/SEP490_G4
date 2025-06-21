package com.fourfingers.quangvinhstore.usecase.boundary;

import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface BackBlazeBoundary {
    String store(MultipartFile file);
    List<String> store(List<MultipartFile> files);
}
