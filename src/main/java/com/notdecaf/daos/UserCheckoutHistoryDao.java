package com.notdecaf.daos;

import com.notdecaf.models.UserCheckoutHistory;
import org.springframework.data.repository.CrudRepository;

/**
 * Created by purav on 4/24/16.
 */
public interface UserCheckoutHistoryDao extends CrudRepository<UserCheckoutHistory, Long> {
}
