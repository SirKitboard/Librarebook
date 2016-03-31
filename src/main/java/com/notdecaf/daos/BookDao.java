package com.notdecaf.daos;

import com.notdecaf.models.Book;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

/**
 * Created by Adi on 3/28/2016.
 */
public interface BookDao extends CrudRepository<Book, Long>{
    List<Book> findTop10ByOrderByDateAddedDesc();
}
