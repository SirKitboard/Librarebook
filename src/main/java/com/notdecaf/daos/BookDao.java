package com.notdecaf.daos;

import com.notdecaf.models.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.List;

/**
 * Created by Adi on 3/28/2016.
 */
public interface BookDao extends PagingAndSortingRepository<Book, Long> {
    List<Book> findTop10ByOrderByDateAddedDesc();
    Page<Book> findByTitleContainsIgnoreCase(Pageable pageable, String titlePart);
    Page<Book> findByTitleContainsIgnoreCaseOrderByAuthors_FirstNameAsc(Pageable pageable, String titlePart);
    Page<Book> findByTitleContainsIgnoreCaseOrderByAuthors_FirstNameDesc(Pageable pageable, String titlePart);

    Page<Book> findByTitleContainsIgnoreCaseOrderByPublisher_NameAsc(Pageable pageable, String titlePart);
    Page<Book> findByTitleContainsIgnoreCaseOrderByPublisher_NameDesc(Pageable pageable, String titlePart);
//
    Page<Book> findByTitleContainsIgnoreCaseOrderByTitleAsc(Pageable pageable, String titlePart);
    Page<Book> findByTitleContainsIgnoreCaseOrderByTitleDesc(Pageable pageable, String titlePart);
    List<Book> findTop10ByGenres_IdInAndIdNot(long [] ids, long bookId);

    List<Book> findByIdIn(List<Long> ids);
    Page<Book> findByTitleContainsIgnoreCaseAndStatus(Pageable pageable, String titlePart, String status);
    Page<Book> findByTitleContainsIgnoreCaseAndStatusOrderByAuthors_FirstNameAsc(Pageable pageable, String titlePart, String status);
    Page<Book> findByTitleContainsIgnoreCaseAndStatusOrderByAuthors_FirstNameDesc(Pageable pageable, String titlePart, String status);
    Page<Book> findByTitleContainsIgnoreCaseAndStatusOrderByPublisher_NameAsc(Pageable pageable, String titlePart, String status);
    Page<Book> findByTitleContainsIgnoreCaseAndStatusOrderByPublisher_NameDesc(Pageable pageable, String titlePart, String status);

    Page<Book> findByTitleContainsIgnoreCaseAndStatusOrderByTitleAsc(Pageable pageable, String titlePart, String status);
    Page<Book> findByTitleContainsIgnoreCaseAndStatusOrderByTitleDesc(Pageable pageable, String titlePart, String status);
}
