package com.notdecaf.controllers;

import com.notdecaf.daos.UserDao;
import com.notdecaf.helpers.PasswordStorage;
import com.notdecaf.models.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * Created by Adi on 3/28/2016.
 */
@RestController
public class UserController implements BaseController<User> {

    @Autowired
    private UserDao userDao;

    @RequestMapping(value = "/api/users", method = RequestMethod.GET)
    public ResponseEntity<User[]> all(HttpSession session) {
        Iterable<User> users = userDao.findAll();
        List<User> userList = new ArrayList<User>();
        for (User user : users) {
            userList.add(user);
        }
        return ResponseEntity.ok(userList.toArray(new User[0]));
    }

    @RequestMapping(value = "/api/users/{id}", method = RequestMethod.GET)
    public ResponseEntity<User> get(HttpSession session, @PathVariable long id) {
        User user = userDao.findOne(id);
        if(user == null) {
            return new ResponseEntity<User>(HttpStatus.NOT_FOUND);
        }
        return ResponseEntity.ok(user);
    }

    @RequestMapping(value = "/api/users", method = RequestMethod.POST)
    public ResponseEntity<User> create(HttpServletRequest request) {
        try {
            Map<String, String[]> requestMap = request.getParameterMap();
            if(!requestMap.containsKey("firstName")
                    || !requestMap.containsKey("lastName")
                    || !requestMap.containsKey("dob")
                    || !requestMap.containsKey("email")
                    || !requestMap.containsKey("gender")
                    || !requestMap.containsKey("password"))
                return ResponseEntity.badRequest().body(null);
            User user = new User(request.getParameter("firstName"),
                    request.getParameter("lastName"),
                    new Date(request.getParameter("dob")),
                    request.getParameter("email"),
                    request.getParameter("gender"),
                    request.getParameter("password"));
            userDao.save(user);
            return ResponseEntity.ok(user);
        } catch (PasswordStorage.CannotPerformOperationException e) {
            // Do nothing
        }
        return ResponseEntity.badRequest().body(null);
    }

    @Override
    public ResponseEntity<User> update(HttpServletRequest request, long id) {
        // TODO: Handle update
        return null;
    }

    @Override
    public ResponseEntity delete(HttpServletRequest request, long id) {
        // TODO: Handle delete
        return null;
    }
}
