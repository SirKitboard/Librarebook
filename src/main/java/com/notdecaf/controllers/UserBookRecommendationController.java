package com.notdecaf.controllers;

import com.notdecaf.daos.UserRecommendedBookDao;
import com.notdecaf.models.Book;
import com.notdecaf.models.User;
import com.notdecaf.models.UserRecommendedBook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Created by Adi on 5/2/2016.
 */
@RestController
public class UserBookRecommendationController {
    @Autowired
    private UserRecommendedBookDao recommendedBookDao;


    @RequestMapping(value="/api/items/books/{id}/recommend", method = RequestMethod.POST)
    public ResponseEntity recommendBook(HttpServletRequest req, @PathVariable long id) {
        User user = (User) req.getSession().getAttribute("user");
        if(user == null) {
            return new ResponseEntity<Book>(HttpStatus.UNAUTHORIZED);
        }
        UserRecommendedBook found = recommendedBookDao.findByUserAndItemAndStatus(user, id, 0);
        if(found != null) {
            return ResponseEntity.ok(found);
        }
        UserRecommendedBook book = new UserRecommendedBook(user, id);
        recommendedBookDao.save(book);
        user.addRecommendedBook(book);
        return ResponseEntity.ok(book);
    }

    @RequestMapping(value="/api/items/books/recommended", method = RequestMethod.GET)
    public ResponseEntity getRecommendedBooks(HttpServletRequest req) {
        Iterable<UserRecommendedBook> books = recommendedBookDao.findByStatus(0);
        List<UserRecommendedBook> bookList = new ArrayList<UserRecommendedBook>();
        for (UserRecommendedBook book : books) {
            bookList.add(book);
        }
        return ResponseEntity.ok(bookList.toArray(new UserRecommendedBook[0]));
    }

    @RequestMapping(value = "/api/items/books/recommended", method = RequestMethod.POST)
    public ResponseEntity create(HttpServletRequest req) {
        User user = (User) req.getSession().getAttribute("user");
        if(user == null) {
            return new ResponseEntity<Book>(HttpStatus.UNAUTHORIZED);
        }
        Map<String, String[]> requestMap = req.getParameterMap();
        if(!requestMap.containsKey("book") || !requestMap.containsKey("author")) {
            return ResponseEntity.badRequest().body(null);
        }
        UserRecommendedBook found = recommendedBookDao.findByUserAndBookNameAndAuthorName(user, req.getParameter("book"), req.getParameter("author"));
        if(found != null) {
            return ResponseEntity.ok(found);
        }

        UserRecommendedBook book = new UserRecommendedBook(user, req.getParameter("book"), req.getParameter("author"));
        recommendedBookDao.save(book);
        user.addRecommendedBook(book);
        return ResponseEntity.ok(book);
    }

    @RequestMapping(value = "/api/items/books/recommended/{id}/approve", method = RequestMethod.PUT)
    public ResponseEntity approve(HttpServletRequest req, @PathVariable long id) {
        User user = (User) req.getSession().getAttribute("user");
        if(user == null || !user.getUserType().equals("admin")) {
            return new ResponseEntity<Book>(HttpStatus.UNAUTHORIZED);
        }

        UserRecommendedBook book = recommendedBookDao.findOne(id);
        if(book == null) {
            return ResponseEntity.notFound().build();
        }
        book.setStatus(1);
        recommendedBookDao.save(book);
        return ResponseEntity.ok(book);
    }

    @RequestMapping(value = "/api/items/books/recommended/{id}/reject", method = RequestMethod.PUT)
    public ResponseEntity reject(HttpServletRequest req, @PathVariable long id) {
        User user = (User) req.getSession().getAttribute("user");
        if(user == null || !user.getUserType().equals("admin")) {
            return new ResponseEntity<Book>(HttpStatus.UNAUTHORIZED);
        }

        UserRecommendedBook book = recommendedBookDao.findOne(id);
        if(book == null) {
            return ResponseEntity.notFound().build();
        }
        book.setStatus(-1);
        recommendedBookDao.save(book);
        return ResponseEntity.ok(book);
    }
}
