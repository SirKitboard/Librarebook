package com.notdecaf.daos;

import com.notdecaf.models.Author;
import org.springframework.data.repository.CrudRepository;

import javax.transaction.Transactional;

/**
 * Created by Adi on 3/27/2016.
 */
@Transactional
public interface AuthorDao extends CrudRepository<Author, Long> {
}
