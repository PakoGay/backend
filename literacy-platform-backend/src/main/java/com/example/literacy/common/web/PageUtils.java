package com.example.literacy.common.web;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

public final class PageUtils {
    private static final int DEFAULT_PAGE = 0;
    private static final int DEFAULT_SIZE = 20;
    private static final int MAX_SIZE = 100;

    private PageUtils() {}

    public static Pageable pageable(Integer page, Integer size, Integer pageSize) {
        int resolvedPage = page == null ? DEFAULT_PAGE : page;
        int resolvedSize = pageSize != null ? pageSize : (size == null ? DEFAULT_SIZE : size);
        validate(resolvedPage, resolvedSize);
        return PageRequest.of(resolvedPage, resolvedSize);
    }

    public static Pageable pageable(Integer page, Integer size, Integer pageSize, Sort sort) {
        int resolvedPage = page == null ? DEFAULT_PAGE : page;
        int resolvedSize = pageSize != null ? pageSize : (size == null ? DEFAULT_SIZE : size);
        validate(resolvedPage, resolvedSize);
        return PageRequest.of(resolvedPage, resolvedSize, sort);
    }

    public static int page(Integer page) {
        int resolved = page == null ? DEFAULT_PAGE : page;
        if (resolved < 0) throw new IllegalArgumentException("page must be greater than or equal to 0");
        return resolved;
    }

    public static int size(Integer size, Integer pageSize) {
        int resolved = pageSize != null ? pageSize : (size == null ? DEFAULT_SIZE : size);
        if (resolved < 1 || resolved > MAX_SIZE) throw new IllegalArgumentException("page_size must be between 1 and " + MAX_SIZE);
        return resolved;
    }

    private static void validate(int page, int size) {
        if (page < 0) throw new IllegalArgumentException("page must be greater than or equal to 0");
        if (size < 1 || size > MAX_SIZE) throw new IllegalArgumentException("page_size must be between 1 and " + MAX_SIZE);
    }
}
