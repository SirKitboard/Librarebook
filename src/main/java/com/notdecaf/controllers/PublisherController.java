package com.notdecaf.controllers;

import com.notdecaf.daos.AddressDao;
import com.notdecaf.daos.PublisherDao;
import com.notdecaf.models.Address;
import com.notdecaf.models.Author;
import com.notdecaf.models.Publisher;
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
import java.util.List;
import java.util.Map;

/**
 * Created by Adi on 3/28/2016.
 */
@RestController
public class PublisherController implements BaseController<Publisher>{

    @Autowired
    private PublisherDao publisherDao;

    @Autowired
    private AddressDao addressDao;


    public ResponseEntity<Publisher[]> all(HttpSession session) {
        Iterable<Publisher> publishers = publisherDao.findAll();
        List<Publisher> publisherList = new ArrayList<Publisher>();
        for (Publisher publisher : publishers) {
            publisherList.add(publisher);
        }
        return ResponseEntity.ok(publisherList.toArray(new Publisher[0]));
    }


    @RequestMapping(value = "/api/publishers", method = RequestMethod.GET)
    public ResponseEntity<Publisher[]> search(HttpServletRequest req) {
        Iterable<Publisher> publishers = publisherDao.findAll();
        List<Publisher> publisherList = new ArrayList<Publisher>();
        for (Publisher publisher : publishers) {
            publisherList.add(publisher);
        }
        String query = req.getParameter("string");
        List<Publisher> filteredList = new ArrayList<>();
        for(Publisher publisher: publisherList) {
            if(publisher.getName().toLowerCase().contains(query.toLowerCase())) {
                filteredList.add(publisher);
            }
        }

        int page = 0;
        if(req.getParameterMap().containsKey("page")) {
            page = Integer.parseInt(req.getParameter("page"));
        }
        int start = page*20;
        if(filteredList.size() == 0 || start > filteredList.size()) {
            return new ResponseEntity<Publisher[]>(HttpStatus.NO_CONTENT);
        }
        int end = Math.min(start+20, filteredList.size());
        filteredList = filteredList.subList(start, end);
        return ResponseEntity.ok(filteredList.toArray(new Publisher[0]));
    }

    @RequestMapping(value = "/api/publishers/{id}", method = RequestMethod.GET)
    public ResponseEntity<Publisher> get(HttpSession session, @PathVariable long id) {
        Publisher publisher = publisherDao.findOne(id);
        if(publisher == null) {
            return new ResponseEntity<Publisher>(HttpStatus.NOT_FOUND);
        }
        return ResponseEntity.ok(publisher);
    }

    @RequestMapping(value = "/api/publishers", method = RequestMethod.POST)
    public ResponseEntity<Publisher> create(HttpServletRequest request) {
        Map<String, String[]> requestMap = request.getParameterMap();
        if(!requestMap.containsKey("name")
                || !requestMap.containsKey("addressLine1")
                || !requestMap.containsKey("zipcode")
                || !requestMap.containsKey("city")
                || !requestMap.containsKey("state")
                || !requestMap.containsKey("country")
                || !requestMap.containsKey("phoneNumber")
                || !requestMap.containsKey("email"))
            return ResponseEntity.badRequest().body(null);
        Address address = new Address(request.getParameter("addressLine1"), request.getParameter("city"), request.getParameter("state"), Integer.parseInt(request.getParameter("zipcode")), request.getParameter("country"));
        Publisher newPublisher = new Publisher(request.getParameter("name"), address, request.getParameter("email"), request.getParameter("phoneNumber"));
        addressDao.save(address);
        publisherDao.save(newPublisher);
        return ResponseEntity.ok(newPublisher);
    }

    @RequestMapping(value = "/api/publishers/{id}", method = RequestMethod.PUT)
    public ResponseEntity<Publisher> update(HttpServletRequest request, @PathVariable long id) {
        Publisher publisher = publisherDao.findOne(id);
        if(publisher == null) {
            return new ResponseEntity<Publisher>(HttpStatus.NOT_FOUND);
        }
        if(request.getParameter("name") != null) {
            publisher.setName(request.getParameter("name"));
        }
        publisherDao.save(publisher);
        return ResponseEntity.ok(publisher);
    }

    @RequestMapping(value = "/api/publishers/{id}", method = RequestMethod.DELETE)
    public ResponseEntity<Publisher> delete(HttpServletRequest request, long id) {
        publisherDao.delete(id);
        return new ResponseEntity<Publisher>(HttpStatus.NO_CONTENT);
    }
}
