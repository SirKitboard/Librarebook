package com.notdecaf.controllers;

import com.notdecaf.daos.UserDao;
import com.notdecaf.helpers.PasswordStorage;
import com.notdecaf.models.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;

/**
 * Created by Adi on 3/28/2016.
 */
@RestController
public class LoginController {
    @Autowired
    private UserDao userDao;

    @RequestMapping(value = "api/login", method = RequestMethod.POST)
    public ResponseEntity login(HttpServletRequest req) {
        Map<String, String[]> requestMap = req.getParameterMap();
        if(!requestMap.containsKey("email") || !requestMap.containsKey("password")) {
            return ResponseEntity.badRequest().body(null);
        }
        User user = userDao.findByEmail(req.getParameter("email"));
        boolean loginSuccess = user.verifyCredentials(req.getParameter("password"));
        if(loginSuccess) {
            req.getSession().setAttribute("user", user);
            return ResponseEntity.ok(null);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
    }

    @RequestMapping(value = "api/logout", method = RequestMethod.POST)
    public ResponseEntity logout(HttpServletRequest req) {
        req.getSession().setAttribute("user", null);
        return ResponseEntity.ok(null);
    }

    @RequestMapping(value = "api/verifySession", method = RequestMethod.GET)
    public ResponseEntity<User> verifySession(HttpServletRequest req) {
        User user = (User) req.getSession().getAttribute("user");
        if(user == null) {
            return ResponseEntity.ok(null);
        } else {
            return ResponseEntity.ok(user);
        }

    }


}
