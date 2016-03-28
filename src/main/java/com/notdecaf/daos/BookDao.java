package com.notdecaf.daos;

import com.notdecaf.models.Book;
import org.springframework.data.repository.CrudRepository;

/**
 * Created by Adi on 3/28/2016.
 */
public interface BookDao extends CrudRepository<Book, Long>{
}
