package com.notdecaf.daos;

import com.notdecaf.models.Moderator;
import org.springframework.data.repository.CrudRepository;

/**
 * Created by adi on 31/3/16.
 */
public interface ModeratorDao extends CrudRepository<Moderator, Long> {
}
