package com.fourfingers.quangvinhstore.adapter.rest.staff;

import com.fourfingers.quangvinhstore.usecase.boundary.staff.ProductManagementInputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.staff.ProductInputData;
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
 * REST controller handling product management operations for staff members.
 * Mapped to the "/staff/product" endpoint.
 *
 * @author LongLTHE170099
 */
@RestController
@RequestMapping("/staff/product")
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class ManageProductController {
    private final ProductManagementInputBoundary productManagementInputBoundary;

    /**
     * Creates a new product with the provided details and images.
     *
     * @param productInputData The product details to be created
     * @param productImages    List of images associated with the product
     * @param userDetails      The authenticated staff member's details
     * @return ResponseEntity containing the created product information
     * @throws Exception if there's an error during product creation
     */
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> create(@RequestPart("productInputData") ProductInputData productInputData,
                                    @RequestPart("productImages") List<MultipartFile> productImages,
                                    @AuthenticationPrincipal UserDetails userDetails) throws Exception {
        productInputData.setProductImages(productImages);
        return ResponseEntity.ok(productManagementInputBoundary.create(productInputData, userDetails));
    }

    /**
     * Retrieves all products, optionally filtered by name.
     *
     * @param name Optional parameter to filter products by name
     * @return ResponseEntity containing a list of products
     */
    @GetMapping
    public ResponseEntity<?> find(@RequestParam(required = false) String name) {
        return ResponseEntity.ok(productManagementInputBoundary.findAllProducts(name));
    }

    /**
     * Retrieves a specific product by its ID.
     *
     * @param id The unique identifier of the product
     * @return ResponseEntity containing the requested product
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getProduct(@PathVariable String id) {
        return ResponseEntity.ok(productManagementInputBoundary.getProduct(id));
    }

    /**
     * Updates an existing product with the provided details and images.
     *
     * @param id               The unique identifier of the product to update
     * @param productInputData The updated product details
     * @param productImages    Optional list of new images for the product
     * @param userDetails      The authenticated staff member's details
     * @return ResponseEntity containing the updated product information
     * @throws Exception if there's an error during product update
     */
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> getProduct(@PathVariable String id,
                                        @RequestPart("productInputData") ProductInputData productInputData,
                                        @RequestPart(value = "productImages", required = false) List<MultipartFile> productImages,
                                        @AuthenticationPrincipal UserDetails userDetails) throws Exception {
        productInputData.setProductImages(productImages);
        return ResponseEntity.ok(productManagementInputBoundary.update(
                id,
                productInputData,
                userDetails
        ));
    }

    /**
     * Deletes a specific product by its ID.
     *
     * @param id          The unique identifier of the product to delete
     * @param userDetails The authenticated staff member's details
     * @return ResponseEntity containing the result of the deletion
     * @throws Exception if there's an error during product deletion
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable String id,
                                    @AuthenticationPrincipal UserDetails userDetails) throws Exception {
        return ResponseEntity.ok(productManagementInputBoundary.delete(id, userDetails));
    }
}
