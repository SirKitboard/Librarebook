package com.notdecaf.daos;

import com.notdecaf.models.Book;
import com.notdecaf.models.UserCheckoutHistory;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

/**
 * Created by purav on 4/24/16.
 */
public interface UserCheckoutHistoryDao extends CrudRepository<UserCheckoutHistory, Long> {
    @Query("select x from UserCheckoutHistory x group by x.item order by count(x) desc")
    List<UserCheckoutHistory> findBestSellers();
}
