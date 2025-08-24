package com.fourfingers.quangvinhstore.adapter.rest.customer;

import com.fourfingers.quangvinhstore.usecase.boundary.customer.ProductInputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.customer.SearchProductInputData;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

/**
 * REST controller handling product-related operations.
 * Mapped to the "/product" endpoint.
 *
 * @author LongLTHE170099
 */
@RestController
@RequestMapping("/product")
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class ProductController {
    private final ProductInputBoundary productInputBoundary;

    /**
     * Retrieves products based on specified filters and pagination parameters.
     *
     * @param categoryIds   List of category IDs to filter by
     * @param brandIds      List of brand IDs to filter by
     * @param colorHexes    List of color hexadecimal codes to filter by
     * @param productSizes  List of product sizes to filter by
     * @param maxPrice      Maximum price threshold
     * @param minPrice      Minimum price threshold (defaults to 0)
     * @param sortDirection Sort direction (defaults to "desc")
     * @param sortBy        Field to sort by (defaults to "createdAt")
     * @param pageNumber    Page number for pagination (defaults to "0")
     * @param pageSize      Number of items per page (defaults to "20")
     * @param searchText    Text to search for in product names
     * @return ResponseEntity containing the filtered and paginated product list
     */
    @GetMapping
    public ResponseEntity<?> getAllProducts(@RequestParam(required = false) List<String> categoryIds,
                                            @RequestParam(required = false) List<String> brandIds,
                                            @RequestParam(required = false) List<String> colorHexes,
                                            @RequestParam(required = false) List<String> productSizes,
                                            @RequestParam(required = false) BigDecimal maxPrice,
                                            @RequestParam(required = false, defaultValue = "0") BigDecimal minPrice,
                                            @RequestParam(defaultValue = "desc") String sortDirection,
                                            @RequestParam(defaultValue = "createdAt") String sortBy,
                                            @RequestParam(defaultValue = "0") String pageNumber,
                                            @RequestParam(defaultValue = "20") String pageSize,
                                            @RequestParam(required = false) String searchText) {
        SearchProductInputData searchProductInputData = new SearchProductInputData(
                categoryIds, brandIds, productSizes, colorHexes, maxPrice, minPrice, searchText
        );
        return ResponseEntity.ok(productInputBoundary.search(searchProductInputData, sortDirection, sortBy,
                pageNumber,
                pageSize));
    }

    /**
     * Retrieves a specific product by its ID.
     *
     * @param id The unique identifier of the product
     * @return ResponseEntity containing the requested product
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getProduct(@PathVariable String id) {
        return ResponseEntity.ok(productInputBoundary.getProduct(id));
    }
}
