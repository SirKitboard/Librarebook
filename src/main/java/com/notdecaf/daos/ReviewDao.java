package com.notdecaf.daos;

import com.notdecaf.models.Review;
import org.springframework.data.repository.CrudRepository;

import javax.transaction.Transactional;

/**
 * Created by purav on 3/28/16.
 */
@Transactional
public interface ReviewDao extends CrudRepository<Review, Long>{
}
