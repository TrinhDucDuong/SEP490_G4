package com.fourfingers.quangvinhstore.adapter.rest.customer;

import com.fourfingers.quangvinhstore.usecase.boundary.customer.BlogInputBoundary;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller handling blog-related operations.
 * Mapped to the "/blog" endpoint.
 *
 * @author LongLTHE170099
 */
@RestController
@RequestMapping("/blog")
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class BlogController {
    private final BlogInputBoundary blogInputBoundary;

    /**
     * Retrieves all blog posts, optionally filtered by blog tag.
     *
     * @param blogTag Optional parameter to filter blogs by tag
     * @return ResponseEntity containing a list of blog posts
     */
    @GetMapping
    public ResponseEntity<?> getAll(@RequestParam(required = false) String blogTag) {
        return ResponseEntity.ok(blogInputBoundary.getAll(blogTag));
    }

    /**
     * Retrieves a specific blog post by its ID.
     *
     * @param id The unique identifier of the blog post
     * @return ResponseEntity containing the requested blog post
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable String id) {
        return ResponseEntity.ok(blogInputBoundary.getById(id));
    }
}
