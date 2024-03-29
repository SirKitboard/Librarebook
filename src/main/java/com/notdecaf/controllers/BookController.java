package com.notdecaf.controllers;

import com.notdecaf.daos.*;
import com.notdecaf.helpers.*;
import com.notdecaf.models.*;
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

    @Autowired
    private UserDao userDao;

    @Autowired
    private BookDao bookDao;

    @Autowired
    private UserCheckoutHistoryDao checkoutHistoryDao;

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
        User user = (User) req.getSession().getAttribute("user");
        Map<String, String[]> requestMap = req.getParameterMap();
        if(requestMap.containsKey("string") && !requestMap.containsKey("sort")) {
            int page = 0;
            if(req.getParameter("page") != null) {
                page = Integer.parseInt(req.getParameter("page"));
            }
            if (user == null || !user.getUserType().equals("admin")){
                bookList = BookFactory.findByTitleAndStatus(req.getParameter("string"), page, ItemStatus.Available.toString());
            }
            else{
                bookList = BookFactory.findByTitle(req.getParameter("string"), page);
            }
        } else if(requestMap.containsKey("string") && requestMap.containsKey("sort")) {
            boolean ascending = true;
            if(requestMap.containsKey("ord")) {
                ascending = !req.getParameter("ord").equalsIgnoreCase("desc");
            }
            int page = 0;
            if(req.getParameter("page") != null) {
                page = Integer.parseInt(req.getParameter("page"));
            }

            if (user == null || (!(user.getUserType().equals("admin")) && user.getUserType().equals("user"))){
                bookList = BookFactory.findByTitleAndStatus(req.getParameter("string"), page, req.getParameter("sort"), ascending, ItemStatus.Available.toString());
            }
            else{
                bookList = BookFactory.findByTitle(req.getParameter("string"), page, req.getParameter("sort"), ascending);
            }

        } else {
            Iterable<Book> books = BookFactory.findAll();
            for (Book book : books) {
                bookList.add(book);
            }
        }
        boolean authorExists = requestMap.containsKey("author");
        boolean publisherExists = requestMap.containsKey("publisher");
        boolean isbnExists = requestMap.containsKey("isbn");
        boolean ratingExists = requestMap.containsKey("rating");
        boolean fromYearExists = requestMap.containsKey("fromYear");
        boolean toYearExists = requestMap.containsKey("toYear");
        boolean genresExist = requestMap.containsKey("genres[]");
        String[] genresNums;
        ArrayList<Genre> genres = new ArrayList<Genre>();
        if(genresExist) {
            genresNums = requestMap.get("genres[]");
            for(String genreNum : genresNums) {
                genres.add(genreDao.findOne(Long.parseLong(genreNum)));
            }
        }
        List<Book> filteredList = new ArrayList<Book>();
        for(Book book: bookList) {
            if(authorExists) {
                boolean found = false;
                for(Author author: book.getAuthors()) {
                    String name = author.getFirstName().toLowerCase()+ " " + author.getLastName().toLowerCase();
                    if(name.contains(req.getParameter("author").toLowerCase())) {
                        found = true;
                    }
                }
                if(!found) {
                    continue;
                }
            }
            if(publisherExists) {
                if(!book.getPublisher().getName().toLowerCase().contains(req.getParameter("publisher").toLowerCase())) {
                    continue;
                }
            }
            if(isbnExists) {
                if(!book.getIsbn().toLowerCase().contains(req.getParameter("isbn").toLowerCase())) {
                    continue;
                }
            }
            int yearPublished = book.getYearPublished();
            if(fromYearExists && toYearExists) {
                int fromYear = Integer.parseInt(req.getParameter("fromYear"));
                int toYear = Integer.parseInt(req.getParameter("toYear"));
                if(yearPublished <= fromYear || yearPublished >= toYear) {
                    continue;
                }
            } else if(fromYearExists) {
                int fromYear = Integer.parseInt(req.getParameter("fromYear"));
                if(yearPublished <= fromYear) {
                    continue;
                }
            } else if(toYearExists) {
                int toYear = Integer.parseInt(req.getParameter("toYear"));
                if(yearPublished >= toYear) {
                    continue;
                }
            }
            if(genresExist) {
                boolean found = false;
                for(Genre genre: genres) {
                    if(SetHelper.search(book.getGenres(), genre)) {
                        found = true;
                        break;
                    }
                }
                if(!found) {
                    continue;
                }
            }

            if(user != null) {
                if(book.getMaturity() > user.getPreferences().getMaxMaturity()) {
                    continue;
                }
            }

            filteredList.add(book);
        }
        if(filteredList.size() == 0) {
            return new ResponseEntity<Book[]>(HttpStatus.NO_CONTENT);
        }
        return ResponseEntity.ok(filteredList.toArray(new Book[0]));
    }

    @RequestMapping(value = "/api/items/books/{id}", method = RequestMethod.GET)
    public ResponseEntity<Book> get(HttpSession session, @PathVariable long id) {
        Book book = BookFactory.getBookFromCache(id);
        if(book == null) {
            return new ResponseEntity<Book>(HttpStatus.NOT_FOUND);
        }
        return ResponseEntity.ok(book);
    }

    @RequestMapping(value = "/api/items/books/{id}/recommended", method = RequestMethod.GET)
    public ResponseEntity<Book[]> getByGenre(HttpSession session, @PathVariable long id) {
        Book book = BookFactory.getBookFromCache(id);
        if (book == null) {
            return ResponseEntity.badRequest().body(null);
        }
        Genre[] genres = book.getGenres().toArray(new Genre[0]);
        long[] ids = new long[genres.length];
        for (int i=0; i<ids.length; i++) {
            ids[i] = genres[i].getId();
        }
        List<Book> books= bookDao.findTop10ByGenres_IdInAndIdNot(ids, book.getId());
        return ResponseEntity.ok(books.toArray(new Book[0]));
    }

    @RequestMapping(value = "/api/items/books", method = RequestMethod.POST)
    public ResponseEntity<Book> create(HttpServletRequest request) {
        Map<String, String[]> requestMap = request.getParameterMap();
        if(!requestMap.containsKey("title")
                || !requestMap.containsKey("genres[]")
                || !requestMap.containsKey("authors[]")
                || !requestMap.containsKey("publisher")
                || !requestMap.containsKey("maturity")
                || !requestMap.containsKey("description")
                || !requestMap.containsKey("yearPublished")
                || !requestMap.containsKey("totalLicenses")
                || !requestMap.containsKey("language")
                || !requestMap.containsKey("numPages"))
            return ResponseEntity.badRequest().body(null);
        String[] genreIDs = requestMap.get("genres[]");
        String[] authorIDs = requestMap.get("authors[]");
        Set<Author> authors = new HashSet<Author>();
        Set<Genre> genres = new HashSet<Genre>();
        for(String id: authorIDs) {
            Author author = authorDao.findOne(Long.parseLong(id));
            if (author == null) {
                ResponseEntity.badRequest().body(null);
            } else {
                authors.add(author);
            }
        }
        for(String id : genreIDs){
            try {
                Genre genre = genreDao.findOne(Long.parseLong(id));
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
                Language.valueOf(request.getParameter("language").toUpperCase()),
                ItemStatus.Available,
                Integer.parseInt(request.getParameter("numPages")));

        book.setDateAdded(new Date());
        if(requestMap.containsKey("maturity")) {
            book.setMaturity(Integer.parseInt(request.getParameter("maturity")));
        }
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
        if (request.getParameter("genres[]") != null){
            Set<Genre> genres = new HashSet<Genre>();
            try {
                Map<String, String[]> requestMap = request.getParameterMap();
                String[] genreIDs = requestMap.get("genres[]");
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
        if (request.getParameter("authors[]") != null){
            Set<Author> authors = new HashSet<Author>();
            try {
                Map<String, String[]> requestMap = request.getParameterMap();
                String[] authorIDs = requestMap.get("authors[]");
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
        if (request.getParameter("numPages") != null){
            book.setNumPages(Integer.parseInt(request.getParameter("numPages")));
        }
        if (request.getParameter("maturity") != null){
            book.setMaturity(Integer.parseInt(request.getParameter("maturity")));
        }
        if (request.getParameter("status") != null){
            book.setStatus(ItemStatus.valueOf(request.getParameter("status")).toString());
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

    @RequestMapping(value = "/api/items/books/{id}/share", method = RequestMethod.POST)
    public ResponseEntity share(HttpServletRequest request, @PathVariable long id) {
        Map<String, String[]> requestMap = request.getParameterMap();
        if(!requestMap.containsKey("toEmail")) {
            return ResponseEntity.badRequest().body(null);
        }
        Book book = BookFactory.getBookFromCache(id);
        if (book == null){
            return new ResponseEntity<Book>(HttpStatus.NOT_FOUND);
        }

        try{
            SendGrid sendgrid = new SendGrid(PropertiesManager.getProperty("sendgrid.api-key"));
            SendGrid.Email email = new SendGrid.Email();
            User user = (User) request.getSession().getAttribute("user");
            if (user == null){
                return new ResponseEntity<Book>(HttpStatus.UNAUTHORIZED);
            }

            String userEmail = user.getEmail();
            email.addTo(request.getParameter("toEmail"));
            email.setFrom(userEmail);
            email.setSubject(userEmail + " has shared a book with you on Librarebook");
            email.setText(book.getTitle() + " " + book.getDescription());

            SendGrid.Response response = sendgrid.send(email);
            return ResponseEntity.ok(response.getMessage());
        } catch (SendGridException e) {
            e.printStackTrace();
        }
        return ResponseEntity.badRequest().body(null);
    }

    @RequestMapping(value = "/api/items/books/best", method = RequestMethod.GET)
    public ResponseEntity bestSellers(HttpServletRequest req) {
        List<UserCheckoutHistory> checkoutList = checkoutHistoryDao.findBestSellers();
        List<Long> bookIDs = new ArrayList<>();
        for(UserCheckoutHistory item: checkoutList) {
            bookIDs.add(item.getItem());
        }
        List<Book> bookList = bookDao.findByIdIn(bookIDs);
        return ResponseEntity.ok(bookList);
    }
}
