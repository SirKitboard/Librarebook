package com.notdecaf.controllers;

import com.notdecaf.daos.AddressDao;
import com.notdecaf.daos.AdminDao;
import com.notdecaf.helpers.PasswordStorage;
import com.notdecaf.models.Address;
import com.notdecaf.models.Admin;
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
 * Created by purav on 3/28/16.
 */
@RestController
public class AdminController implements BaseController<Admin>{

    @Autowired
    public AdminDao adminDao;

    @Autowired
    public AddressDao addressDao;


    @RequestMapping(value = "/api/admins", method = RequestMethod.GET)
    public ResponseEntity<Admin[]> all(HttpSession session) {
        Iterable<Admin> admins = adminDao.findAll();
        List<Admin> adminList = new ArrayList<Admin>();
        for (Admin admin : admins) {
            adminList.add(admin);
        }
        return ResponseEntity.ok(adminList.toArray(new Admin[0]));
    }

    @RequestMapping(value = "/api/admins/{id}", method = RequestMethod.GET)
    public ResponseEntity<Admin> get(HttpSession session, @PathVariable long id) {
        Admin admin = adminDao.findOne(id);
        if(admin == null) {
            return new ResponseEntity<Admin>(HttpStatus.NOT_FOUND);
        }
        return ResponseEntity.ok(admin);
    }

    @RequestMapping(value = "/api/admins", method = RequestMethod.POST)
    public ResponseEntity<Admin> create(HttpServletRequest request) {
        try {
            Map<String, String[]> requestMap = request.getParameterMap();
            if(!requestMap.containsKey("firstName")
                    || !requestMap.containsKey("lastName")
                    || !requestMap.containsKey("dob")
                    || !requestMap.containsKey("email")
                    || !requestMap.containsKey("gender")
                    || !requestMap.containsKey("password")
                    || !requestMap.containsKey("addressLine1")
                    || !requestMap.containsKey("zipcode")
                    || !requestMap.containsKey("city")
                    || !requestMap.containsKey("state")
                    || !requestMap.containsKey("country"))
                return ResponseEntity.badRequest().body(null);

            Address address = new Address(request.getParameter("addressLine1"), request.getParameter("city"), request.getParameter("state"), Integer.parseInt(request.getParameter("zipcode")), request.getParameter("country"));

            Admin admin = new Admin(request.getParameter("firstName"),
                    request.getParameter("lastName"),
                    new Date(request.getParameter("dob")),
                    request.getParameter("email"),
                    request.getParameter("gender"),
                    request.getParameter("password"),
                    address, request.getParameter("phone"));
            addressDao.save(address);
            adminDao.save(admin);
            return ResponseEntity.ok(admin);
        } catch (PasswordStorage.CannotPerformOperationException e) {
            // Do nothing
        }
        return ResponseEntity.badRequest().body(null);
    }

    @Override
    public ResponseEntity<Admin> update(HttpServletRequest request, long id) {
        return null;
    }

    @Override
    public ResponseEntity delete(HttpServletRequest request, long id) {
        return null;
    }
}
