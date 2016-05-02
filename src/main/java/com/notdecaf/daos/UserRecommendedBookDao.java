package com.notdecaf.daos;

import com.notdecaf.models.Address;
import com.notdecaf.models.User;
import com.notdecaf.models.UserRecommendedBook;
import org.springframework.data.repository.CrudRepository;

import java.util.Set;

/**
 * Created by Adi on 3/28/2016.
 */
public interface UserRecommendedBookDao extends CrudRepository<com.notdecaf.models.UserRecommendedBook, Long>{
    public UserRecommendedBook findByUserAndItemAndStatus(User user, long item, int status);
    public UserRecommendedBook findByUserAndBookNameAndAuthorName(User user, String bookName, String authorName);
    public Set<UserRecommendedBook> findByStatus(int status);
}
