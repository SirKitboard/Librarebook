package com.notdecaf.daos;

import com.notdecaf.models.HoldItem;
import org.springframework.data.repository.CrudRepository;

/**
 * Created by purav on 5/1/16.
 */
public interface HoldItemDao extends CrudRepository<HoldItem, Long>{
    HoldItem findByUserIdAndItemId(long userId, long itemId);
}
