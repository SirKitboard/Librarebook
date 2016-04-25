package com.notdecaf.daos;

import com.notdecaf.models.UserCheckedOutItem;
import org.springframework.data.repository.CrudRepository;

/**
 * Created by purav on 4/11/16.
 */
public interface UserCheckedOutItemDao extends CrudRepository<UserCheckedOutItem, Long>{
    UserCheckedOutItem findByItemIdAndUserId(long itemId, long userId);
}
