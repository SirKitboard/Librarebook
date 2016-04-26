package com.notdecaf.controllers;

import com.notdecaf.daos.AuthorDao;
import com.notdecaf.daos.GenreDao;
import com.notdecaf.daos.PublisherDao;
import com.notdecaf.helpers.BookFactory;
import com.notdecaf.helpers.ItemStatus;
import com.notdecaf.helpers.Language;
import com.notdecaf.models.Author;
import com.notdecaf.models.Book;
import com.notdecaf.models.Genre;
import com.notdecaf.models.Publisher;
import com.sendgrid.SendGrid;
import com.sendgrid.SendGridException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.util.*;

/**
 * Created by Adi on 3/28/2016.
 */
@RestController
public class BookController implements BaseController<Book> {
    @Autowired
    private AuthorDao authorDao;

    @Autowired
    private PublisherDao publisherDao;

    @Autowired
    private GenreDao genreDao;

    public ResponseEntity<Book[]> all(HttpSession session) {
        Iterable<Book> books = BookFactory.findAll();
        List<Book> bookList = new ArrayList<Book>();
        for (Book book : books) {
            bookList.add(book);
        }
        return ResponseEntity.ok(bookList.toArray(new Book[0]));
    }

    @RequestMapping(value = "/api/items/books", method = RequestMethod.GET)
    public ResponseEntity<Book[]> search(HttpServletRequest req) {
        List<Book> bookList = new ArrayList<Book>();
        if(req.getParameterMap().containsKey("string")) {
            int page = 0;
            if(req.getParameter("page") != null) {
                page = Integer.parseInt(req.getParameter("page"));
            }

            bookList = BookFactory.findByTitle(req.getParameter("string"), page);
        }
        if(bookList.size() == 0) {
            return new ResponseEntity<Book[]>(HttpStatus.NO_CONTENT);
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
        String[] genreNames = requestMap.get("genres");
        String[] authorNames = requestMap.get("authors");
        Set<Author> authors = new HashSet<Author>();
        Set<Genre> genres = new HashSet<Genre>();
        for(String nameStr: authorNames) {
            String [] firstAndLastNames = nameStr.split(" ");
            Author author = authorDao.findByFirstNameAndLastName(firstAndLastNames[0],firstAndLastNames[1]);
            if (author == null) {
                ResponseEntity.badRequest().body(null);
            } else {
                authors.add(author);
            }
        }
        for(String nameStr : genreNames){
            try {
                Genre genre = genreDao.findByName(nameStr);
                if(genre == null) {
                    throw new NumberFormatException();
                }
                genres.add(genre);
            } catch (NumberFormatException e) {
                return ResponseEntity.badRequest().body(null);
            }
        }
        Publisher publisher = publisherDao.findByName(request.getParameter("publisher") );
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
        book.setDateAdded(new Date());
        BookFactory.save(book);
        return ResponseEntity.ok(book);
    }

    @RequestMapping(value = "/api/items/books/{id}", method = RequestMethod.PUT)
    public ResponseEntity<Book> update(HttpServletRequest request, @PathVariable long id) {
        Book book = BookFactory.getBookFromCache(id);
        if (book == null){
            return new ResponseEntity<Book>(HttpStatus.NOT_FOUND);
        }
        if (request.getParameter("title") != null){
            book.setTitle(request.getParameter("title"));
        }
        if (request.getParameter("genres") != null){
            Set<Genre> genres = new HashSet<Genre>();
            try {
                Map<String, String[]> requestMap = request.getParameterMap();
                String[] genreIDs = requestMap.get("genres");
                for (String idstr : genreIDs) {
                    long genreID = Long.parseLong(idstr);
                    Genre genre = genreDao.findOne(genreID);
                    if (genre == null) {
                        throw new NumberFormatException();
                    }
                    genres.add(genre);
                }
            } catch (NumberFormatException e){
                return ResponseEntity.badRequest().body(null);
            }
        }
        if (request.getParameter("authors") != null){
            Set<Author> authors = new HashSet<Author>();
            try {
                Map<String, String[]> requestMap = request.getParameterMap();
                String[] authorIDs = requestMap.get("authors");
                for (String idstr : authorIDs) {
                    long authorID = Long.parseLong(idstr);
                    Author author = authorDao.findOne(authorID);
                    if (author == null) {
                        throw new NumberFormatException();
                    }
                    authors.add(author);
                }
            } catch (NumberFormatException e){
                return ResponseEntity.badRequest().body(null);
            }
        }
        if (request.getParameter("publisher") != null){
            try{
                long publisherID = Long.parseLong(request.getParameter("publisher"));
                Publisher publisher = publisherDao.findOne(publisherID);
                if (publisher == null){
                    throw new NumberFormatException();
                }
            } catch(NumberFormatException e){
                return ResponseEntity.badRequest().body(null);
            }
        }
        if (request.getParameter("description") != null){
            book.setDescription(request.getParameter("description"));
        }
        if (request.getParameter("yearPublished") != null){
            book.setYearPublished(Integer.parseInt(request.getParameter("yearPublished")));
        }
        if (request.getParameter("totalLicenses") != null){
            book.setTotalLicenses(Integer.parseInt(request.getParameter("totalLicenses")));
        }
        if (request.getParameter("language") != null){
            book.setLanguage(Language.valueOf(request.getParameter("language")));
        }
        if (request.getParameter("status") != null){
            book.setStatus(ItemStatus.valueOf(request.getParameter("status")));
        }
        if (request.getParameter("numPages") != null){
            book.setNumPages(Integer.parseInt(request.getParameter("numPages")));
        }
        BookFactory.save(book);
        return ResponseEntity.ok(book);
    }

    @RequestMapping(value = "/api/items/books/{id}", method = RequestMethod.DELETE)
    public ResponseEntity delete(HttpServletRequest request, @PathVariable long id) {
        BookFactory.delete(id);
        return new ResponseEntity<Book>(HttpStatus.NO_CONTENT);
    }

    @RequestMapping(value = "/api/items/books/recent", method = RequestMethod.GET)
    public ResponseEntity recent(HttpServletRequest request) {
        List<Book> books = BookFactory.findRecentBooks();
        return ResponseEntity.ok(books);
//        return null;
    }

    @RequestMapping(value = "/api/items/books/share/{id}", method = RequestMethod.GET)
    public ResponseEntity share(HttpServletRequest request, @PathVariable long id) {
        Book book = BookFactory.getBookFromCache(id);
        if (book == null){
            return new ResponseEntity<Book>(HttpStatus.NOT_FOUND);
        }

        Properties prop = new Properties();
        Map<String, String[]> requestMap = request.getParameterMap();
        if(!requestMap.containsKey("email")) {
            return ResponseEntity.badRequest().body(null);
        }

        try{
            InputStream input = new FileInputStream("application.properties");
            prop.load(input);

            SendGrid sendgrid = new SendGrid(prop.getProperty("sendgrid.api-key"));
            SendGrid.Email email = new SendGrid.Email();
            email.addTo("raancihteal@gmail.com");
            email.setFrom("raancihteal@gmail.com");
            email.setSubject(request.getParameter("userEmail") + "has shared a book with you on Librarebook");
            email.setText(book.getTitle() + " " + book.getDescription());

            SendGrid.Response response = sendgrid.send(email);
            return ResponseEntity.ok(response.getMessage());
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        } catch (SendGridException e) {
            e.printStackTrace();
        }
        return null;
    }

}
