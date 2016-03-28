package com.notdecaf.daos;

import com.notdecaf.models.Publisher;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

/**
 * Created by Adi on 3/28/2016.
 */
public interface PublisherDao extends CrudRepository<Publisher, Long>{
//    List<Publisher> findByName(String name);
}
