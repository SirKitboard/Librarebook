package com.notdecaf.controllers;

import com.notdecaf.daos.ItemDao;
import com.notdecaf.daos.UserDao;
import com.notdecaf.models.Item;
import com.notdecaf.models.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;

/**
 * Created by halaamenasy on 3/28/16.
 */

@RestController
public class ShoppingCartController {

    @Autowired
    private ItemDao itemDao;

    @Autowired
    private UserDao userDao;


 

    @RequestMapping(value = "/api/shoppingcart/borrow", method = RequestMethod.POST)
    public ResponseEntity borrow(HttpServletRequest request) {
        //TODO: Implement Method
        return null;
    }

    @RequestMapping(value = "/api/shoppingcart/purchase", method = RequestMethod.POST)
    public ResponseEntity purchase(HttpServletRequest request) {
        //TODO: Implement Method
        return null;
    }
}
