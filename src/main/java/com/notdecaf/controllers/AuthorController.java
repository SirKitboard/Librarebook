package com.notdecaf.controllers;

import com.notdecaf.daos.AuthorDao;
import com.notdecaf.models.Author;
import com.notdecaf.models.Book;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.HttpServerErrorException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by Adi on 3/27/2016.
 */
@RestController
public class AuthorController implements BaseController<Author>{

    @Autowired
    private AuthorDao authorDao;

    public ResponseEntity<Author[]> all(HttpSession session) {
        Iterable<Author> authors = authorDao.findAll();
        List<Author> authorList = new ArrayList<Author>();
        for (Author author : authors) {
            authorList.add(author);
        }
        return ResponseEntity.ok(authorList.toArray(new Author[0]));
    }

    @RequestMapping(value = "/api/authors", method = RequestMethod.GET)
    public ResponseEntity<Author[]> search(HttpServletRequest req) {
        Iterable<Author> authors = authorDao.findAll();
        List<Author> authorList = new ArrayList<Author>();
        for (Author author : authors) {
            authorList.add(author);
        }
        String query = req.getParameter("string");
        List<Author> filteredList = new ArrayList<>();
        for(Author author: authorList) {
            if((author.getFirstName()+author.getLastName()).toLowerCase().contains(query.toLowerCase())) {
                filteredList.add(author);
            }
        }

        int page = 0;
        if(req.getParameterMap().containsKey("page")) {
            page = Integer.parseInt(req.getParameter("page"));
        }
        int start = page*20;
        if(filteredList.size() == 0 || start > filteredList.size()) {
            return new ResponseEntity<Author[]>(HttpStatus.NO_CONTENT);
        }
        int end = Math.min(start+20, filteredList.size());
        filteredList = filteredList.subList(start, end);
        return ResponseEntity.ok(filteredList.toArray(new Author[0]));
    }


    @RequestMapping(value = "/api/authors/{id}", method = RequestMethod.GET)
    public ResponseEntity<Author> get(HttpSession session, @PathVariable long id) {
        Author author = authorDao.findOne(id);
        return ResponseEntity.ok(author);
    }

    @RequestMapping(value = "/api/authors", method = RequestMethod.POST)
    public ResponseEntity<Author> create(HttpServletRequest request) {
        Map<String, String[]> requestMap = request.getParameterMap();
        if(!requestMap.containsKey("firstName") || !requestMap.containsKey("lastName"))
            return ResponseEntity.badRequest().body(null);
        Author newAuthor = new Author(request.getParameter("firstName"), request.getParameter("lastName"));
        authorDao.save(newAuthor);
        return ResponseEntity.ok(newAuthor);
    }

    @RequestMapping(value = "/api/authors/{id}", method = RequestMethod.PUT)
    public ResponseEntity<Author> update(HttpServletRequest request, @PathVariable long id) {
        Author author = authorDao.findOne(id);
        if(request.getParameter("firstName") != null) {
            author.setFirstName(request.getParameter("firstName"));
        }
        if(request.getParameter("lastName") != null) {
            author.setLastName(request.getParameter("lastName"));
        }
        authorDao.save(author);
        return ResponseEntity.ok(author);
    }

    @RequestMapping(value = "/api/authors/{id}", method = RequestMethod.DELETE)
    public ResponseEntity<Author> delete(HttpServletRequest request, long id) {
        authorDao.delete(id);
        return new ResponseEntity<Author>(HttpStatus.NO_CONTENT);
    }
}
