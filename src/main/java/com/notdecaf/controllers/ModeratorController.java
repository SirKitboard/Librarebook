package com.notdecaf.controllers;

import com.notdecaf.daos.AddressDao;
import com.notdecaf.daos.ModeratorDao;
import com.notdecaf.helpers.PasswordStorage;
import com.notdecaf.models.Address;
import com.notdecaf.models.Moderator;
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
public class ModeratorController implements BaseController<Moderator>{


    @Autowired
    public ModeratorDao moderatorDao;

    @Autowired
    public AddressDao addressDao;


    @RequestMapping(value = "/api/moderators", method = RequestMethod.GET)
    public ResponseEntity<Moderator[]> all(HttpSession session) {
        Iterable<Moderator> moderators = moderatorDao.findAll();
        List<Moderator> moderatorList = new ArrayList<Moderator>();
        for (Moderator moderator : moderators) {
            moderatorList.add(moderator);
        }
        return ResponseEntity.ok(moderatorList.toArray(new Moderator[0]));
    }

    @RequestMapping(value = "/api/moderators/{id}", method = RequestMethod.GET)
    public ResponseEntity<Moderator> get(HttpSession session, @PathVariable long id) {
        Moderator moderator = moderatorDao.findOne(id);
        if(moderator == null) {
            return new ResponseEntity<Moderator>(HttpStatus.NOT_FOUND);
        }
        return ResponseEntity.ok(moderator);
    }

    @RequestMapping(value = "/api/moderators", method = RequestMethod.POST)
    public ResponseEntity<Moderator> create(HttpServletRequest request) {
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

            Moderator moderator = new Moderator(request.getParameter("firstName"),
                    request.getParameter("lastName"),
                    new Date(request.getParameter("dob")),
                    request.getParameter("email"),
                    request.getParameter("gender"),
                    request.getParameter("password"),
                    address, request.getParameter("phone"));
            addressDao.save(address);
            moderatorDao.save(moderator);
            return ResponseEntity.ok(moderator);
        } catch (PasswordStorage.CannotPerformOperationException e) {
            // Do nothing
        }
        return ResponseEntity.badRequest().body(null);
    }
    @Override
    public ResponseEntity<Moderator> update(HttpServletRequest request, long id) {
        return null;
    }

    @Override
    public ResponseEntity delete(HttpServletRequest request, long id) {
        return null;
    }
}
