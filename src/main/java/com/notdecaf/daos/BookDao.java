package com.notdecaf.daos;

import com.notdecaf.models.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.List;

/**
 * Created by Adi on 3/28/2016.
 */
public interface BookDao extends PagingAndSortingRepository<Book, Long> {
    List<Book> findTop10ByOrderByDateAddedDesc();
    Page<Book> findByTitleContainsIgnoreCase(Pageable pageable, String titlePart);
}
