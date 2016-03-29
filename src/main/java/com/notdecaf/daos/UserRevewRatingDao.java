package com.notdecaf.daos;

import com.notdecaf.models.UserReviewRating;
import org.springframework.data.repository.CrudRepository;

/**
 * Created by purav on 3/28/16.
 */
public interface UserRevewRatingDao extends CrudRepository<UserReviewRating, Long>{
}
