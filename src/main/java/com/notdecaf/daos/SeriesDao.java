package com.notdecaf.daos;

import com.notdecaf.models.Series;
import org.springframework.data.repository.CrudRepository;

/**
 * Created by adi on 4/4/16.
 */
public interface SeriesDao extends CrudRepository<Series, Long> {
}
