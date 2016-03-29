package com.notdecaf.controllers;

import com.notdecaf.daos.AuthorDao;
import com.notdecaf.daos.BookDao;
import com.notdecaf.daos.GenreDao;
import com.notdecaf.daos.PublisherDao;
import com.notdecaf.helpers.BookFactory;
import com.notdecaf.helpers.ItemStatus;
import com.notdecaf.helpers.Language;
import com.notdecaf.models.Author;
import com.notdecaf.models.Book;
import com.notdecaf.models.Genre;
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
import java.util.*;

/**
 * Created by Adi on 3/28/2016.
 */
@RestController
public class BooksController implements BaseController<Book> {
    @Autowired
    private AuthorDao authorDao;

    @Autowired
    private PublisherDao publisherDao;

    @Autowired
    private GenreDao genreDao;

    @RequestMapping(value = "/api/items/books", method = RequestMethod.GET)
    public ResponseEntity<Book[]> all(HttpSession session) {
        Iterable<Book> books = BookFactory.findAll();
        List<Book> bookList = new ArrayList<Book>();
        for (Book book : books) {
            bookList.add(book);
        }
        return ResponseEntity.ok(bookList.toArray(new Book[0]));
    }

    @RequestMapping(value = "/api/items/books/{id}", method = RequestMethod.GET)
    public ResponseEntity<Book> get(HttpSession session, @PathVariable long id) {
        Book book = BookFactory.getBookFromCache(id);
        if(book == null) {
            return new ResponseEntity<Book>(HttpStatus.NOT_FOUND);
        }
        return ResponseEntity.ok(book);
    }

    @RequestMapping(value = "/api/items/books", method = RequestMethod.POST)
    public ResponseEntity<Book> create(HttpServletRequest request) {
        Map<String, String[]> requestMap = request.getParameterMap();
        if(!requestMap.containsKey("title")
                || !requestMap.containsKey("genres")
                || !requestMap.containsKey("authors")
                || !requestMap.containsKey("publisher")
                || !requestMap.containsKey("description")
                || !requestMap.containsKey("yearPublished")
                || !requestMap.containsKey("totalLicenses")
                || !requestMap.containsKey("language")
                || !requestMap.containsKey("numPages"))
            return ResponseEntity.badRequest().body(null);
        String[] authorIDs = requestMap.get("authors");
        String[] genreIDs = requestMap.get("genres");
        Set<Author> authors = new HashSet<Author>();
        Set<Genre> genres = new HashSet<Genre>();
        for(String idstr : authorIDs){
            try {
                long id = Long.parseLong(idstr);
                Author author = authorDao.findOne(id);
                if(author == null) {
                    throw new NumberFormatException();
                }
                authors.add(author);
            } catch (NumberFormatException e) {
                return ResponseEntity.badRequest().body(null);
            }
        }
        for(String idstr : genreIDs){
            try {
                long id = Long.parseLong(idstr);
                Genre genre = genreDao.findOne(id);
                if(genre == null) {
                    throw new NumberFormatException();
                }
                genres.add(genre);
            } catch (NumberFormatException e) {
                return ResponseEntity.badRequest().body(null);
            }
        }
        Publisher publisher = publisherDao.findOne(Long.parseLong(request.getParameter("publisher")));
        if(publisher == null) {
            return ResponseEntity.badRequest().body(null);
        }
        Book book = new Book(request.getParameter("title"),
                genres,
                authors,
                publisher,
                request.getParameter("description"),
                Integer.parseInt(request.getParameter("yearPublished")),
                Integer.parseInt(request.getParameter("totalLicenses")),
                Language.valueOf(request.getParameter("language")),
                ItemStatus.Available,
                Integer.parseInt(request.getParameter("numPages")));

        BookFactory.save(book);
        return ResponseEntity.ok(book);
    }

    @RequestMapping(value = "/api/items/books/{id}", method = RequestMethod.PUT)
    public ResponseEntity<Book> update(HttpServletRequest request, @PathVariable long id) {
        // TODO: Implement Update
        return null;
    }

    @RequestMapping(value = "/api/items/books/{id}", method = RequestMethod.DELETE)
    public ResponseEntity delete(HttpServletRequest request, @PathVariable long id) {
        // TODO: Implement delete
        return null;
    }

    @RequestMapping(value = "/api/items/books/recent", method = RequestMethod.GET)
    public ResponseEntity recent(HttpServletRequest request, @PathVariable long id) {
        //TODO: Implement Method
        return null;
    }

}
