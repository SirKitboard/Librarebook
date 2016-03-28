package com.notdecaf.helpers;

import com.notdecaf.daos.BookDao;
import com.notdecaf.models.Book;
import com.sun.javaws.exceptions.InvalidArgumentException;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by adi on 28/3/16.
 */
public class BookFactory {
    private static List<Book> lruBookCache = new ArrayList<Book>();

    @Autowired
    private static BookDao bookDao;

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

    public static void save(Book book) {
        bookDao.save(book);
    }
//    private static linearSearchBook
}