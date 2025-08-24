package com.fourfingers.quangvinhstore.adapter.rest.staff;

import com.fourfingers.quangvinhstore.usecase.boundary.staff.BlogManagementInputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.staff.BlogInputData;
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
 * REST controller handling staff blog management operations.
 * Mapped to the "/staff/blog" endpoint.
 *
 * @author LongLTHE170099
 */
@RestController
@RequestMapping("/staff/blog")
@RequiredArgsConstructor(onConstructor_ =  {@Autowired})
public class ManageBlogController {
    private final BlogManagementInputBoundary blogManagementInputBoundary;

    /**
     * Retrieves all blog posts, optionally filtered by blog tag.
     *
     * @param blogTag Optional parameter to filter blogs by tag
     * @return ResponseEntity containing a list of blog posts
     */
    @GetMapping
    public ResponseEntity<?> getAll(@RequestParam(name = "blogTag", required = false) String blogTag) {
        return ResponseEntity.ok().body(blogManagementInputBoundary.getAll(blogTag));
    }

    /**
     * Retrieves a specific blog post by its ID.
     *
     * @param id The unique identifier of the blog post
     * @return ResponseEntity containing the requested blog post
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getOne(@PathVariable String id) {
        return ResponseEntity.ok(blogManagementInputBoundary.getById(id));
    }

    /**
     * Deletes a blog post by its ID.
     *
     * @param id          The unique identifier of the blog post to delete
     * @param userDetails The authenticated user details
     * @return ResponseEntity containing the operation result
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable String id,
                                    @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(blogManagementInputBoundary.delete(id, userDetails));
    }

    /**
     * Creates a new blog post with images.
     *
     * @param userDetails   The authenticated user details
     * @param blogInputData The blog post data
     * @param blogImages    List of images to attach to the blog post
     * @return ResponseEntity containing the created blog post
     * @throws Exception if there's an error processing the request
     */
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> create(@AuthenticationPrincipal UserDetails userDetails,
                                    @RequestPart BlogInputData blogInputData,
                                    @RequestPart List<MultipartFile> blogImages) throws Exception {
        return ResponseEntity.ok(blogManagementInputBoundary.create(blogInputData, userDetails, blogImages));
    }

    /**
     * Updates an existing blog post and its images.
     *
     * @param userDetails   The authenticated user details
     * @param blogInputData The updated blog post data
     * @param blogImages    Optional list of new images
     * @param id            The unique identifier of the blog post to update
     * @return ResponseEntity containing the updated blog post
     * @throws Exception if there's an error processing the request
     */
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> update(@AuthenticationPrincipal UserDetails userDetails,
                                    @RequestPart BlogInputData blogInputData,
                                    @RequestPart(required = false) List<MultipartFile> blogImages,
                                    @PathVariable String id) throws Exception {
        return ResponseEntity.ok(blogManagementInputBoundary.update(blogInputData, userDetails, blogImages, id));
    }

    /**
     * Restores a previously deleted blog post.
     *
     * @param userDetails The authenticated user details
     * @param id          The unique identifier of the blog post to restore
     * @return ResponseEntity containing the restored blog post
     * @throws Exception if there's an error processing the request
     */
    @PatchMapping("/{id}")
    public ResponseEntity<?> unDelete(@AuthenticationPrincipal UserDetails userDetails,
                                      @PathVariable String id) throws Exception {
        return ResponseEntity.ok(blogManagementInputBoundary.unDelete(id, userDetails));
    }
}
