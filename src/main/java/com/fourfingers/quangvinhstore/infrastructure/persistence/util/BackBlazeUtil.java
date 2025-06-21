package com.fourfingers.quangvinhstore.infrastructure.persistence.util;

import com.backblaze.b2.client.B2StorageClient;
import com.backblaze.b2.client.B2StorageClientFactory;
import com.backblaze.b2.client.contentSources.B2ByteArrayContentSource;
import com.backblaze.b2.client.contentSources.B2ContentSource;
import com.backblaze.b2.client.structures.B2FileVersion;
import com.backblaze.b2.client.structures.B2UploadFileRequest;
import com.fourfingers.quangvinhstore.usecase.boundary.BackBlazeBoundary;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Component
public class BackBlazeUtil implements BackBlazeBoundary {
    @Value("${b2.applicationKeyId}")
    private String appKeyId;

    @Value("${b2.applicationKey}")
    private String appKey;

    @Value("${b2.bucketId}")
    private String bucketId;

    @Override
    public String store(MultipartFile file) {
        try (B2StorageClient client = B2StorageClientFactory
                .createDefaultFactory()
                .create(appKeyId, appKey, "QuangVinhAuthenticImage")) {

            String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();

            B2ContentSource contentSource = B2ByteArrayContentSource
                    .builder(file.getBytes())
                    .build();

            B2UploadFileRequest request = B2UploadFileRequest
                    .builder(bucketId, filename, file.getContentType(), contentSource)
                    .build();

            B2FileVersion version = client.uploadSmallFile(request);

            return client.getDownloadByNameUrl("QuangVinhAuthentic", version.getFileName());
        } catch (Exception e) {
            throw new RuntimeException("Failed to upload file", e);
        }
    }

    @Override
    public List<String> store(List<MultipartFile> files) {
        List<String> imageUrls = new ArrayList<>();

        try (B2StorageClient client = B2StorageClientFactory
                .createDefaultFactory()
                .create(appKeyId, appKey, "QuangVinhAuthentic")) {

            for (MultipartFile file : files) {
                if (file.isEmpty()) continue;

                String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();

                B2ContentSource contentSource = B2ByteArrayContentSource
                        .builder(file.getBytes())
                        .build();

                B2UploadFileRequest request = B2UploadFileRequest
                        .builder(bucketId, filename, file.getContentType(), contentSource)
                        .build();

                B2FileVersion version = client.uploadSmallFile(request);

                String fileUrl = client.getDownloadByNameUrl("QuangVinhAuthentic", version.getFileName());
                imageUrls.add(fileUrl);
            }

        } catch (Exception e) {
            throw new RuntimeException("Failed to upload images", e);
        }

        return imageUrls;
    }

}
