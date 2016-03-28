package com.notdecaf.daos;

import com.notdecaf.models.Address;
import org.springframework.data.repository.CrudRepository;

/**
 * Created by Adi on 3/28/2016.
 */
public interface AddressDao extends CrudRepository<Address, Long>{
}
