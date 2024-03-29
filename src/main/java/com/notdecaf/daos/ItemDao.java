package com.notdecaf.daos;

import com.notdecaf.models.Book;
import com.notdecaf.models.Item;
import org.springframework.data.repository.CrudRepository;

import javax.transaction.Transactional;
import java.util.List;

/**
 * Created by Adi on 3/28/2016.
 */
@Transactional
public interface ItemDao extends CrudRepository<Item, Long> {
    List<Item> findTop10ByOrderByDateAddedDesc();
}
