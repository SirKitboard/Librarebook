package com.notdecaf.daos;

import com.notdecaf.models.Admin;
import org.springframework.data.repository.CrudRepository;

/**
 * Created by adi on 31/3/16.
 */
public interface AdminDao extends CrudRepository<Admin, Long> {
}
