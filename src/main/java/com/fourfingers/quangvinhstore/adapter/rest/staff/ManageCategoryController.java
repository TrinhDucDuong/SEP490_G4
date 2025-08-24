package com.fourfingers.quangvinhstore.adapter.rest.staff;

import com.fourfingers.quangvinhstore.usecase.boundary.staff.CategoryManagementInputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.staff.CategoryInputData;
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
 * REST controller handling category management operations for staff members.
 * Mapped to the "/staff" endpoint.
 *
 * @author LongLTHE170099
 */
@RestController
@RequestMapping("/staff")
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class ManageCategoryController {
    private final CategoryManagementInputBoundary categoryManagementInputBoundary;

    /**
     * Retrieves a specific category by its ID.
     *
     * @param id The unique identifier of the category
     * @return ResponseEntity containing the requested category
     */
    @GetMapping("/category/{id}")
    public ResponseEntity<?> findAll(@PathVariable String id) {
        return ResponseEntity.ok(categoryManagementInputBoundary.getCategory(id));
    }

    /**
     * Retrieves all categories from the system.
     *
     * @return ResponseEntity containing a list of all categories
     */
    @GetMapping("/category")
    public ResponseEntity<?> findAll() {
        return ResponseEntity.ok(categoryManagementInputBoundary.getAll());
    }

    /**
     * Creates a new category with associated images.
     *
     * @param categoryInputData The category data to be created
     * @param categoryImages    List of images associated with the category
     * @param userDetails       The authenticated user details
     * @return ResponseEntity containing the created category
     * @throws Exception if there's an error during category creation
     */
    @PostMapping(value = "/category", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> create(@RequestPart("categoryInputData") CategoryInputData categoryInputData,
                                    @RequestPart("categoryImages") List<MultipartFile> categoryImages,
                                    @AuthenticationPrincipal UserDetails userDetails) throws Exception {
        return ResponseEntity.ok(categoryManagementInputBoundary.create(categoryInputData, categoryImages, userDetails));
    }

    /**
     * Updates an existing category identified by its ID.
     *
     * @param id                The unique identifier of the category to update
     * @param categoryInputData The updated category data
     * @param categoryImages    List of updated category images
     * @param userDetails       The authenticated user details
     * @return ResponseEntity containing the updated category
     * @throws Exception if there's an error during category update
     */
    @PutMapping(value = "/category/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> update(@PathVariable("id") String id,
                                    @RequestPart("categoryInputData") CategoryInputData categoryInputData,
                                    @RequestPart("categoryImages") List<MultipartFile> categoryImages,
                                    @AuthenticationPrincipal UserDetails userDetails) throws Exception {
        return ResponseEntity.ok(categoryManagementInputBoundary.update(id,
                categoryInputData, categoryImages, userDetails));
    }

    /**
     * Deletes a category by its ID.
     *
     * @param id          The unique identifier of the category to delete
     * @param userDetails The authenticated user details
     * @return ResponseEntity containing the deletion result
     * @throws Exception if there's an error during category deletion
     */
    @DeleteMapping("/category/{id}")
    public ResponseEntity<?> delete(@PathVariable("id") String id,
                                    @AuthenticationPrincipal UserDetails userDetails) throws Exception {
        return ResponseEntity.ok(categoryManagementInputBoundary.delete(id, userDetails));
    }
}
