package com.fourfingers.quangvinhstore.adapter.rest.staff;

import com.fourfingers.quangvinhstore.usecase.boundary.staff.BrandManagementInputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.staff.BrandInputData;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * REST controller handling brand management operations for staff members.
 * Mapped to the "/staff/brand" endpoint.
 *
 * @author LongLTHE170099
 */
@RestController
@RequestMapping("/staff/brand")
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class ManageBrandController {
    private final BrandManagementInputBoundary brandManagementInputBoundary;

    /**
     * Retrieves all brands from the system.
     *
     * @return ResponseEntity containing a list of all brands
     */
    @GetMapping
    public ResponseEntity<?> getAll() {
        return ResponseEntity.ok(brandManagementInputBoundary.getAll());
    }

    /**
     * Retrieves a specific brand by its ID.
     *
     * @param id The unique identifier of the brand
     * @return ResponseEntity containing the requested brand
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getBrand(@PathVariable String id) {
        return ResponseEntity.ok(brandManagementInputBoundary.getBrand(id));
    }

    /**
     * Creates a new brand in the system.
     *
     * @param brandInputData The brand data to be created
     * @param userDetails    The authenticated user details
     * @param brandImages    List of image files for the brand
     * @return ResponseEntity containing the created brand
     * @throws Exception If there is an error processing the request
     */
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> create(@RequestPart BrandInputData brandInputData,
                                    @AuthenticationPrincipal UserDetails userDetails,
                                    @RequestPart List<MultipartFile> brandImages) throws Exception {
        brandInputData.setBrandImages(brandImages);
        return ResponseEntity.ok(brandManagementInputBoundary.create(brandInputData, userDetails));
    }

    /**
     * Updates an existing brand in the system.
     *
     * @param brandInputData The updated brand data
     * @param userDetails    The authenticated user details
     * @param id             The unique identifier of the brand to update
     * @param brandImages    List of updated image files for the brand
     * @return ResponseEntity containing the updated brand
     * @throws Exception If there is an error processing the request
     */
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> update(@RequestPart BrandInputData brandInputData,
                                    @AuthenticationPrincipal UserDetails userDetails,
                                    @PathVariable String id,
                                    @RequestPart List<MultipartFile> brandImages) throws Exception {
        brandInputData.setBrandImages(brandImages);
        return ResponseEntity.ok(brandManagementInputBoundary.save(id, brandInputData, userDetails));
    }

    /**
     * Deletes a brand from the system.
     *
     * @param id The unique identifier of the brand to delete
     * @return ResponseEntity containing the result of deletion
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable String id) {
        return ResponseEntity.ok(brandManagementInputBoundary.delete(id));
    }
}
