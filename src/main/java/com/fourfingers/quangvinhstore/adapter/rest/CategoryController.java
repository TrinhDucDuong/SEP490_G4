package com.fourfingers.quangvinhstore.adapter.rest;

import com.fourfingers.quangvinhstore.usecase.boundary.CategoryInputBoundary;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/category")
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class CategoryController {
}
