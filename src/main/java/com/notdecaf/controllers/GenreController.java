package com.notdecaf.controllers;

import com.notdecaf.daos.GenreDao;
import com.notdecaf.models.Genre;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by adi on 26/4/16.
 */
@RestController
public class GenreController implements BaseController<Genre> {

    @Autowired
    private GenreDao genreDao;
    @RequestMapping(value = "/api/genres", method = RequestMethod.GET)
    public ResponseEntity<Genre[]> all(HttpSession session) {
        Iterable<Genre> admins = genreDao.findAll();
        List<Genre> adminList = new ArrayList<Genre>();
        for (Genre admin : admins) {
            adminList.add(admin);
        }
        return ResponseEntity.ok(adminList.toArray(new Genre[0]));
    }

    @RequestMapping(value = "/api/genres/{id}", method = RequestMethod.GET)
    public ResponseEntity<Genre> get(HttpSession session, @PathVariable long id) {
        return null;
    }

    @RequestMapping(value = "/api/genres", method = RequestMethod.POST)
    public ResponseEntity<Genre> create(HttpServletRequest request) {
        return null;
    }

    @RequestMapping(value = "/api/genres/{id}", method = RequestMethod.PUT)
    public ResponseEntity<Genre> update(HttpServletRequest request, long id) {
        return null;
    }

    @RequestMapping(value = "/api/genres/{id}", method = RequestMethod.DELETE)
    public ResponseEntity delete(HttpServletRequest request, long id) {
        return null;
    }
}
