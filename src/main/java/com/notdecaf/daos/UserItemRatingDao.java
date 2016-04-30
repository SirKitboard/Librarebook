package com.notdecaf.daos;

import com.notdecaf.models.UserItemRating;
import org.springframework.data.repository.CrudRepository;

/**
 * Created by purav on 3/28/16.
 */
public interface UserItemRatingDao extends CrudRepository<UserItemRating, Long>{
    public UserItemRating findByItemIdAndUserId(long itemId, long userId);
}
