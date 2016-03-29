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
import javax.transaction.Transactional;
import java.util.Set;

/**
 * Created by Adi on 3/28/2016.
 */
@RestController
public class ItemController {

    @Autowired
    private ItemDao itemDao;

    @Autowired
    private UserDao userDao;

    @RequestMapping(value = "/api/items/{id}/favorite", method = RequestMethod.GET)
    public ResponseEntity favorite(HttpServletRequest req, @PathVariable long id) {
        User user = (User) req.getSession().getAttribute("user");
        if(user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
        Item item = itemDao.findOne(id);
        user.addToFavorites(item);
//        Set<Item> favorites = user.getFavorites();
//        favorites.add(item);
//        user.setFavorites(favorites);
        userDao.save(user);
        return ResponseEntity.ok(null);
    }
}
