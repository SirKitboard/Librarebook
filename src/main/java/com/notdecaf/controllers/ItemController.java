package com.notdecaf.controllers;

import com.notdecaf.daos.ItemDao;
import com.notdecaf.daos.UserCheckedOutItemDao;
import com.notdecaf.daos.UserCheckoutHistoryDao;
import com.notdecaf.daos.UserDao;
import com.notdecaf.helpers.ItemFactory;
import com.notdecaf.helpers.SetHelper;
import com.notdecaf.models.Item;
import com.notdecaf.models.User;
import com.notdecaf.models.UserCheckedOutItem;
import com.notdecaf.models.UserCheckoutHistory;
import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.client.HttpClient;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Set;

/**
 * Created by Adi on 3/28/2016.
 */
@RestController
public class ItemController {

    @Autowired
    private ItemDao itemDao;

    @Autowired
    private UserDao userDao;

    @Autowired
    private UserCheckedOutItemDao checkedOutItemDao;

    @Autowired
    private UserCheckoutHistoryDao checkoutHistoryDao;

    @RequestMapping(value = "/api/items/{id}", method = RequestMethod.GET)
    public ResponseEntity<Item> get(HttpSession session, @PathVariable long id) {
        Item item = ItemFactory.getItemFromCache(id);
        if(item == null) {
            return new ResponseEntity<Item>(HttpStatus.NOT_FOUND);
        }
        return ResponseEntity.ok(item);
    }

    @RequestMapping(value = "/api/items/{id}/favorite", method = RequestMethod.GET)
    public ResponseEntity favorite(HttpServletRequest req, @PathVariable long id) {
        User user = (User) req.getSession().getAttribute("user");
        if(user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
        Item item = itemDao.findOne(id);
        user.addToFavorites(item);
        userDao.save(user);
        return ResponseEntity.ok(null);
    }

    @RequestMapping(value = "/api/items/{id}/reserve", method = RequestMethod.POST)
    public ResponseEntity reserve(HttpServletRequest request, @PathVariable long id) {
        //TODO: Implement Method
        return null;
    }

    @RequestMapping(value = "/api/items/{id}/flag", method = RequestMethod.POST)
    public ResponseEntity toggleFlag(HttpServletRequest req, @PathVariable long id) {
        User user = (User) req.getSession().getAttribute("user");
        if(user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
        Item item = ItemFactory.getItemFromCache(id);
        if(item == null) {
            return ResponseEntity.badRequest().body(null);
        }
        Set<User> flags = item.getFlaggedBy();
        HashMap<String, Boolean> returnMap = new HashMap<>();
        if(SetHelper.search(flags, user)) {
            flags = SetHelper.remove(flags, user);
            returnMap.put("flagged", false);
        } else {
            flags.add(user);
            returnMap.put("flagged", true);
        }
        item.setFlaggedBy(flags);
        itemDao.save(item);
        return ResponseEntity.ok(returnMap);
    }

    @RequestMapping(value = "/api/items/{id}/wishlist", method = RequestMethod.POST)
    public ResponseEntity toggleWishlist(HttpServletRequest req, @PathVariable long id) {
        User user = (User) req.getSession().getAttribute("user");
        if(user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
        Item item = ItemFactory.getItemFromCache(id);
        if(item == null) {
            return ResponseEntity.badRequest().body(null);
        }
        Set<Item> wishlist = user.getWishlist();
        HashMap<String, Boolean> returnMap = new HashMap<>();
        if(SetHelper.search(wishlist, item)) {
            wishlist = SetHelper.remove(wishlist, item);
            returnMap.put("wishlisted", false);
        } else {
            wishlist.add(item);
            returnMap.put("wishlisted", true);
        }
        user.setWishlist(wishlist);
        userDao.save(user);
        return ResponseEntity.ok(returnMap);
    }

    @RequestMapping(value = "/api/items/{id}/favorite", method = RequestMethod.POST)
    public ResponseEntity toggleFavorite(HttpServletRequest req, @PathVariable long id) {
        User user = (User) req.getSession().getAttribute("user");
        if(user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
        Item item = ItemFactory.getItemFromCache(id);
        if(item == null) {
            return ResponseEntity.badRequest().body(null);
        }
        Set<Item> favorites = user.getFavorites();
        HashMap<String, Boolean> returnMap = new HashMap<>();
        if(SetHelper.search(favorites, item)) {
            favorites = SetHelper.remove(favorites, item);
            returnMap.put("favorited", false);
        } else {
            favorites.add(item);
            returnMap.put("favorited", true);
            Set<Item> booksNotInterested = user.getNotInterested();
            if(SetHelper.search(booksNotInterested, item)) {
                booksNotInterested = SetHelper.remove(booksNotInterested, item);
            }
        }
        user.setFavorites(favorites);
        userDao.save(user);
        return ResponseEntity.ok(returnMap);
    }

    @RequestMapping(value = "/api/items/recent", method = RequestMethod.GET)
    public ResponseEntity recent(HttpServletRequest request) {
        List<Item> items = ItemFactory.findRecentItems();
        return ResponseEntity.ok(items);
    }

    @RequestMapping(value = "/api/items/{id}/notinterested", method = RequestMethod.POST)
    public ResponseEntity notInterested(HttpServletRequest req, @PathVariable long id) {
        User user = (User) req.getSession().getAttribute("user");
        if(user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
        Item item = ItemFactory.getItemFromCache(id);
        if(item == null) {
            return ResponseEntity.badRequest().body(null);
        }
        Set<Item> books = user.getWishlist();
        HashMap<String, Boolean> returnMap = new HashMap<>();
        if(SetHelper.search(books, item)) {
            books = SetHelper.remove(books, item);
            returnMap.put("notinterested", false);
        } else {
            books.add(item);
            returnMap.put("notinterested", true);
        }
        user.setNotInterested(books);
        userDao.save(user);
        return ResponseEntity.ok(returnMap);
    }

    public ResponseEntity createGenre(HttpServletRequest req) {
        return null;
    }

    @RequestMapping(value = "/api/items/{id}/getfavorite", method = RequestMethod.POST)
    public ResponseEntity getFavorite(HttpServletRequest req, @PathVariable long id) {
        User user = (User) req.getSession().getAttribute("user");
        if(user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
        Item item = ItemFactory.getItemFromCache(id);
        if(item == null) {
            return ResponseEntity.badRequest().body(null);
        }
        HashMap<String, Boolean> returnMap = new HashMap<>();
        Set<Item> favorites = user.getFavorites();
        if (SetHelper.search(favorites, item)) {
            returnMap.put("favorited", true);
        } else {
            returnMap.put("favorited", false);
        }
        return ResponseEntity.ok(returnMap);
    }

    @RequestMapping(value = "/api/items/{id}/checkout", method = RequestMethod.POST)
    public ResponseEntity checkout(HttpServletRequest req, @PathVariable long id) {
        User user = (User) req.getSession().getAttribute("user");
        if(user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
        Item item = ItemFactory.getItemFromCache(id);
        if(item == null) {
            return ResponseEntity.badRequest().body(null);
        }
        if (checkedOutItemDao.findByItemIdAndUserId(item.getId(),user.getId()) != null) {
            return ResponseEntity.badRequest().body(null);
        }
        UserCheckedOutItem userCheckedOutItem = new UserCheckedOutItem(user,item);
        user.getCurrentlyCheckedOutItems().add(userCheckedOutItem);
        item.getCheckedOutBy().add(userCheckedOutItem);
        userDao.save(user);
        itemDao.save(item);
        checkedOutItemDao.save(userCheckedOutItem);
        return ResponseEntity.ok(null);
    }

    @RequestMapping(value = "/api/items/{id}/return", method = RequestMethod.POST)
    public ResponseEntity returnItem(HttpServletRequest req, @PathVariable long id) {
        User user = (User) req.getSession().getAttribute("user");
        if(user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
        Item item = ItemFactory.getItemFromCache(id);
        if(item == null) {
            return ResponseEntity.badRequest().body(null);
        }
        UserCheckedOutItem prevCheckedOutItem = checkedOutItemDao.findByItemIdAndUserId(item.getId(),user.getId());
        if (prevCheckedOutItem == null) {
            return ResponseEntity.badRequest().body(null);
        } else {
            UserCheckoutHistory userCheckoutHistory = new UserCheckoutHistory(user,item,prevCheckedOutItem.getCheckedOutOn());
            user.getCheckoutHistory().add(userCheckoutHistory);
            item.getCheckoutHistory().add(userCheckoutHistory);

            checkedOutItemDao.delete(prevCheckedOutItem);
            checkoutHistoryDao.save(userCheckoutHistory);
            return ResponseEntity.ok(null);
        }
    }

    @RequestMapping(value = "/api/items/{id}/purchase", method = RequestMethod.POST)
    public ResponseEntity purchase(HttpServletRequest req, @PathVariable long id) {
        User user = (User) req.getSession().getAttribute("user");
        if(user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
        try {
            HttpClient httpclient = new DefaultHttpClient();
            HttpPost httppost = new HttpPost("http://localhost:6544/api/getToken");
            //84e4fdf0
            List<NameValuePair> nameValuePairs = new ArrayList<NameValuePair>(2);
            nameValuePairs.add(new BasicNameValuePair("clientID", "84e4fdf0"));
            nameValuePairs.add(new BasicNameValuePair("userID", user.getId() + ""));
            nameValuePairs.add(new BasicNameValuePair("first_name", user.getFirstName()));
            nameValuePairs.add(new BasicNameValuePair("last_name", user.getLastName()));
            nameValuePairs.add(new BasicNameValuePair("profilePic", user.getProfileImage()));
            httppost.setEntity(new UrlEncodedFormEntity(nameValuePairs));
            HttpResponse response = httpclient.execute(httppost);
            String jsonString = EntityUtils.toString(response.getEntity());
            return ResponseEntity.ok(jsonString);
        } catch(Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
    }

}
