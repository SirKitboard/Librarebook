package com.notdecaf.daos;

import com.notdecaf.models.User;
import org.springframework.data.repository.CrudRepository;

import javax.transaction.Transactional;

/**
 * Created by Adi on 3/28/2016.
 */
@Transactional
public interface UserDao extends CrudRepository<User, Long>{
    public User findByEmail(String email);
}
