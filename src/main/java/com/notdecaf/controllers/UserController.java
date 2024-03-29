package com.notdecaf.controllers;

import com.notdecaf.daos.AddressDao;
import com.notdecaf.daos.ReviewDao;
import com.notdecaf.daos.UserDao;
import com.notdecaf.helpers.PasswordStorage;
import com.notdecaf.models.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.*;

/**
 * Created by Adi on 3/28/2016.
 */
@RestController
public class UserController implements BaseController<User> {

    @Autowired
    private UserDao userDao;

    @Autowired
    private AddressDao addressDao;

    @Autowired
    private ReviewDao reviewDao;

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
                    || !requestMap.containsKey("password")
                    || !requestMap.containsKey("addressLine1")
                    || !requestMap.containsKey("zipcode")
                    || !requestMap.containsKey("city")
                    || !requestMap.containsKey("state")
                    || !requestMap.containsKey("country")
                    || !requestMap.containsKey("phone"))
                return ResponseEntity.badRequest().body(null);

            User found = userDao.findByEmail(request.getParameter("email"));
            if(found != null) {
                return ResponseEntity.badRequest().body(found);
            }

            Address address = new Address(request.getParameter("addressLine1"), request.getParameter("city"), request.getParameter("state"), Integer.parseInt(request.getParameter("zipcode")), request.getParameter("country"));

            User user = new User(request.getParameter("firstName"),
                    request.getParameter("lastName"),
                    new Date(request.getParameter("dob")),
                    request.getParameter("email"),
                    request.getParameter("gender"),
                    request.getParameter("password"),
                    address, request.getParameter("phone"));
            user.setRole("user");

            addressDao.save(address);
            user = userDao.save(user);
            UserPreferences preferences = new UserPreferences(user);
            user.setPreferences(preferences);
            userDao.save(user);
            return ResponseEntity.ok(user);
        } catch (PasswordStorage.CannotPerformOperationException e) {
            // Do nothing
        }
        return ResponseEntity.badRequest().body(null);
    }

    @Override
    @RequestMapping(value = "/api/users/{id}", method=RequestMethod.PUT)
    public ResponseEntity<User> update(HttpServletRequest request, @PathVariable long id) {
        User user = userDao.findOne(id);
        Address address = addressDao.findOne(user.getAddress().getId());
        Map<String, String[]> requestMap = request.getParameterMap();
        boolean addressChanged = false;
        if (!requestMap.isEmpty()) {
            if (requestMap.containsKey("firstName")) {
                user.setFirstName(request.getParameter("firstName"));
            }
            if (requestMap.containsKey("lastName")) {
                user.setLastName(request.getParameter("lastName"));
            }
            if (requestMap.containsKey("email")) {
                user.setEmail(request.getParameter("email"));
            }
            if (requestMap.containsKey("phoneNumber")) {
                user.setPhoneNumber(request.getParameter("phoneNumber"));
            }
            if (requestMap.containsKey("gender")) {
                user.setGender(request.getParameter("gender"));
            }
            if (requestMap.containsKey("dob")) {
                Date newDate = new Date(request.getParameter("dob"));
                user.setDob(newDate);
            }
            if (requestMap.containsKey("addressLine1")) {
                address.setLine1(request.getParameter("addressLine1"));
                addressChanged = true;
            }
            if (requestMap.containsKey("city")) {
                address.setLine1(request.getParameter("city"));
                addressChanged = true;
            }
            if (requestMap.containsKey("state")) {
                address.setLine1(request.getParameter("addressLine1"));
                addressChanged = true;
            }
            if (requestMap.containsKey("addressLine1")) {
                address.setLine1(request.getParameter("addressLine1"));
                addressChanged = true;
            }
            if (requestMap.containsKey("role")) {
                user.setRole(request.getParameter("role"));
            }
            if (addressChanged) {
                addressDao.save(address);
                user.setAddress(address);
            }
            if(requestMap.containsKey("maxMaturity") || requestMap.containsKey("duration")) {
                UserPreferences userPreferences = user.getPreferences();
                if(userPreferences == null) {
                    userPreferences = new UserPreferences(user);
                    user.setPreferences(userPreferences);
                    userDao.save(user);
                }
                if(requestMap.containsKey("maxMaturity")) {
                    user.getPreferences().setMaxMaturity(Integer.parseInt(request.getParameter("maxMaturity")));
                }
                if(requestMap.containsKey("duration")) {
                    user.getPreferences().setCheckoutLength(Integer.parseInt(request.getParameter("duration")));
                }
            }
            userDao.save(user);
            if(((User)request.getSession().getAttribute("user")).getId() == user.getId()) {
                request.getSession().setAttribute("user", user);
            }
        }
        return ResponseEntity.ok(user);
    }

    @Override
    @RequestMapping(value = "/api/users/{id}", method = RequestMethod.DELETE)
    public ResponseEntity<User> delete(HttpServletRequest request, @PathVariable long id) {
        // TODO: Handle delete
        userDao.delete(id);
        return new ResponseEntity<User>(HttpStatus.NO_CONTENT);
    }

    @RequestMapping(value = "/api/users/{id}/reviews", method = RequestMethod.GET)
    public ResponseEntity<Review []> getReviews(HttpServletRequest request, @PathVariable long id) {
        return null;
    }

    @RequestMapping(value = "/api/admindashboard/users/{id}", method = RequestMethod.POST)
    public ResponseEntity banUser(HttpServletRequest request, @PathVariable long id) {
        return null;
    }

    @RequestMapping(value = "/api/users/{id}/settings")
    public ResponseEntity setActiveStatus(HttpServletRequest request, @PathVariable long id) {
        return null;
    }

    @RequestMapping(value = "/api/users/{id}/wishlist", method = RequestMethod.GET)
    public ResponseEntity getWishList(HttpServletRequest request, @PathVariable long id) {
        User user = userDao.findOne(id);
        if (user == null){
            return new ResponseEntity<User>(HttpStatus.NOT_FOUND);
        }
        return ResponseEntity.ok(user.getWishlist());
    }

    @RequestMapping(value = "/api/users/{id}/settings", method = RequestMethod.GET)
    public ResponseEntity<UserPreferences> getPreferences(HttpServletRequest request, @PathVariable long id) {
        return null;
    }

    @RequestMapping(value = "/api/users/{id}/settings", method = RequestMethod.PUT)
    public ResponseEntity updatePreferences(HttpServletRequest request, @PathVariable long id) {
        return null;
    }

    @RequestMapping(value = "/api/users/{id}/new", method = RequestMethod.GET)
    public ResponseEntity<User[]> getNewUsers(HttpServletRequest request, @PathVariable long id) {
        User user = (User)request.getSession().getAttribute("user");
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
        List<User> users = userDao.findByIdGreaterThan(id);
        return ResponseEntity.ok(users.toArray(new User[0]));
    }
}
