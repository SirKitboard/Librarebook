package com.notdecaf.helpers;

import com.notdecaf.daos.BookDao;
import com.notdecaf.models.Book;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Controller;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

/**
 * Created by adi on 28/3/16.
 */
@Controller
public class BookFactory {
    private static final int PAGE_SIZE = 20;

    private static List<Book> lruBookCache = new ArrayList<Book>();

    private static BookDao bookDao;


    @Autowired
    public void setBookDao(BookDao bookDao) {
        BookFactory.bookDao = bookDao;
    }

    public static Book getBookFromCache(long id) {
        int index = -1;
        for(int i = 0; i<lruBookCache.size(); i++) {
            if(lruBookCache.get(i).getId() == id) {
                index = i;
                break;
            }
        }
        if(index > -1) {
            Book book = lruBookCache.remove(index);
            lruBookCache.add(0, book);
            return book;
        } else {
            Book book = bookDao.findOne(id);
            if(book != null) {
                lruBookCache.add(0, book);
                if(lruBookCache.size() > 15) {
                    lruBookCache.remove(14);
                }
            }
            return book;
        }
    }

    public static Iterable<Book> findAll(){
        return bookDao.findAll();
    }

    public static List<Book> findRecentBooks() {
        return bookDao.findTop10ByOrderByDateAddedDesc();
    }

    public static void save(Book book) {
        bookDao.save(book);
    }

    public static void delete(long id) {bookDao.delete(id);}

    public static List<Book> findByTitle(String title, int page) {
        int start = page*PAGE_SIZE;
        int end = start + PAGE_SIZE;
        Page<Book> books = bookDao.findByTitleContainsIgnoreCase(new PageRequest(page, PAGE_SIZE), "%"+title+"%");
        List<Book> bookList = books.getContent();
        return bookList;
    }

    public static List<Book> findByTitle(String title, int page, String sort, boolean ascending) {
        int start = page*PAGE_SIZE;
        int end = start + PAGE_SIZE;
        Page<Book> books = null;
        List<Book> bookList = null;
        switch (sort) {
            case "author":
                if(ascending) {
                    books = bookDao.findByTitleContainsIgnoreCaseOrderByAuthors_FirstNameAsc(new PageRequest(page, PAGE_SIZE), title);
                } else {
                    books = bookDao.findByTitleContainsIgnoreCaseOrderByAuthors_FirstNameDesc(new PageRequest(page, PAGE_SIZE), title);
                }
                bookList = books.getContent();
                break;
            case "publisher":
                if(ascending) {
                    books = bookDao.findByTitleContainsIgnoreCaseOrderByPublisher_NameAsc(new PageRequest(page, PAGE_SIZE), title);
                } else {
                    books = bookDao.findByTitleContainsIgnoreCaseOrderByPublisher_NameDesc(new PageRequest(page, PAGE_SIZE), title);
                }
                bookList = books.getContent();
                break;
            case "title":
                if(ascending) {
                    books = bookDao.findByTitleContainsIgnoreCaseOrderByTitleAsc(new PageRequest(page, PAGE_SIZE), title);
                } else {
                    books = bookDao.findByTitleContainsIgnoreCaseOrderByTitleDesc(new PageRequest(page, PAGE_SIZE), title);
                }
                bookList = books.getContent();
                break;
            case "favorites":
                books = bookDao.findByTitleContainsIgnoreCase(null, title);
                bookList = books.getContent();
                if(ascending) {
                    bookList.sort(new Comparator<Book>() {
                        @Override
                        public int compare(Book o1, Book o2) {
                            if(o1.getFavoritedBy().size() > o2.getFavoritedBy().size()) {
                                return -1;
                            } else if(o1.getFavoritedBy().size() == o2.getFavoritedBy().size()) {
                                return 0;
                            } else {
                                return 1;
                            }
                        }
                    });
                } else {
                    bookList.sort(new Comparator<Book>() {
                        @Override
                        public int compare(Book o1, Book o2) {
                            if(o1.getFavoritedBy().size() > o2.getFavoritedBy().size()) {
                                return 1;
                            } else if(o1.getFavoritedBy().size() == o2.getFavoritedBy().size()) {
                                return 0;
                            } else {
                                return -1;
                            }
                        }
                    });
                }
                bookList = bookList.subList(page*PAGE_SIZE, page*PAGE_SIZE+page);
            default:
                books = bookDao.findByTitleContainsIgnoreCase(new PageRequest(page, PAGE_SIZE), title);
                bookList = books.getContent();
        }

        return bookList;
    }
//    private static linearSearchBook

    public static void update(Book book) {
        for(int i=0; i<lruBookCache.size(); i++) {
            if (lruBookCache.get(i).getId() == book.getId()) {
                lruBookCache.set(i,book);
            }
        }
    }
}
