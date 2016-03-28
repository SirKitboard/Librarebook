package com.notdecaf.daos;

import com.notdecaf.models.Genre;
import org.springframework.data.repository.CrudRepository;

import javax.transaction.Transactional;

/**
 * Created by Adi on 3/28/2016.
 */
@Transactional
public interface GenreDao extends CrudRepository<Genre, Long>{
}
