package com.fourfingers.quangvinhstore.usecase.interactor.staff;

import com.fourfingers.quangvinhstore.domain.model.Image;
import com.fourfingers.quangvinhstore.domain.model.staff.Blog;
import com.fourfingers.quangvinhstore.domain.model.staff.Product;
import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.ImageMapper;
import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.staff.BlogStaffMapper;
import com.fourfingers.quangvinhstore.infrastructure.persistence.mapper.staff.ProductStaffMapper;
import com.fourfingers.quangvinhstore.infrastructure.repository.BlogRepository;
import com.fourfingers.quangvinhstore.infrastructure.repository.ImageRepository;
import com.fourfingers.quangvinhstore.infrastructure.schema.BlogEntity;
import com.fourfingers.quangvinhstore.infrastructure.schema.enums.ImageType;
import com.fourfingers.quangvinhstore.usecase.boundary.staff.BlogManagementInputBoundary;
import com.fourfingers.quangvinhstore.usecase.boundary.staff.BlogManagementOutputBoundary;
import com.fourfingers.quangvinhstore.usecase.data.staff.BlogOutputData;
import com.fourfingers.quangvinhstore.usecase.data.staff.ListBlogOutputData;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor(onConstructor_ = {@Autowired})
public class ManageBlogUseCaseInteraction implements BlogManagementInputBoundary {
    private final BlogRepository blogRepository;
    private final BlogStaffMapper blogStaffMapper;
    private final ProductStaffMapper productStaffMapper;
    private final ImageMapper imageMapper;
    private final ImageRepository imageRepository;
    private final BlogManagementOutputBoundary blogManagementOutputBoundary;

    @Override
    @Transactional
    public ListBlogOutputData getAll() {
        return blogManagementOutputBoundary.convertToListBlogOutputData(
                blogRepository.findAll()
                        .stream()
                        .map(blogEntity ->  {
                            Blog blog = blogStaffMapper.toModel(blogEntity);
                            blog.setRelatedProducts(getRelatedProducts(blogEntity));
                            blog.setBlogImages(getBlogImage(blogEntity));
                            return blog;
                        })
                        .toList()
        );
    }

    @Override
    public BlogOutputData getById(String id) {
        Long blogId = Long.parseLong(id);
        BlogEntity blogEntity = blogRepository.findById(blogId).orElseThrow(
                () -> new EntityNotFoundException(String.format("Blog with id: %s not found", id))
        );
        Blog blog = blogStaffMapper.toModel(blogEntity);
        blog.setBlogImages(getBlogImage(blogEntity));
        blog.setRelatedProducts(getRelatedProducts(blogEntity));
        return blogManagementOutputBoundary.convertToBlogOutputData(blog);
    }

    @Override
    public BlogOutputData delete(String id) {
        BlogEntity needToDeleteBlog = blogRepository.findById(Long.parseLong(id)).orElseThrow(
                () -> new EntityNotFoundException(String.format("Blog with id: %s not found", id))
        );
        needToDeleteBlog.setIsActive(false);
        blogRepository.save(needToDeleteBlog);
        return blogManagementOutputBoundary.convertToBlogOutputData(
                blogStaffMapper.toModel(needToDeleteBlog)
        );
    }

    private List<Product> getRelatedProducts(BlogEntity  blogEntity) {
        return blogEntity.getRelatedProducts().stream()
                .map(productStaffMapper::toModel)
                .toList();
    }

    private List<Image> getBlogImage(BlogEntity blogEntity) {
        return imageRepository.findAllByReferenceIdAndImageType(blogEntity.getBlogId(), ImageType.BLOG)
                .stream()
                .map(imageMapper::toModel)
                .toList();
    }
}
