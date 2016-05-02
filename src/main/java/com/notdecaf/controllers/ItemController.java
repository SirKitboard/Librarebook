package com.notdecaf.controllers;

import com.notdecaf.daos.*;
import com.notdecaf.helpers.*;
import com.notdecaf.models.*;
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
import java.util.*;

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

    @Autowired
    private UserItemRatingDao itemRatingDao;

    @Autowired
    private HoldItemDao holdItemDao;

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

    @RequestMapping(value = "/api/items/{id}/hold", method = RequestMethod.POST)
    public ResponseEntity hold(HttpServletRequest req, @PathVariable long id) {
        User user = (User) req.getSession().getAttribute("user");
        if(user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
        Item item = ItemFactory.getItemFromCache(id);
        if(item == null) {
            return ResponseEntity.badRequest().body(null);
        }
        HoldItem holdItem = new HoldItem(user, item);
        holdItemDao.save(holdItem);

        item.getHoldsBy().add(holdItem);
        user.getHoldItems().add(holdItem);

        updateCache(item);
        return ResponseEntity.ok(holdItem);
    }

    @RequestMapping(value = "/api/items/{id}/removehold", method = RequestMethod.POST)
    public ResponseEntity removeHold(HttpServletRequest req, @PathVariable long id) {
        User user = (User) req.getSession().getAttribute("user");
        if(user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
        Item item = ItemFactory.getItemFromCache(id);
        if(item == null) {
            return ResponseEntity.badRequest().body(null);
        }
        HoldItem holdItem = holdItemDao.findByUserIdAndItemId(user.getId(), item.getId());
        if (holdItem == null) {
            return ResponseEntity.badRequest().body(null);
        }

        user.removeHold(holdItem);
        item.removeHold(holdItem);
        holdItemDao.delete(holdItem);

        updateCache(item);
        return ResponseEntity.ok(null);
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
        if (item.getAvailableLicenses() == 0) {
            return ResponseEntity.badRequest().body(null);
        }
        if (checkedOutItemDao.findByItemIdAndUserId(item.getId(),user.getId()) != null) {
            return ResponseEntity.badRequest().body(null);
        }
        int checkoutLength = 7;
        if(user.getPreferences() != null) {
            checkoutLength = user.getPreferences().getCheckoutLength();
        }
        UserCheckedOutItem userCheckedOutItem = new UserCheckedOutItem(user,item, checkoutLength);
        checkedOutItemDao.save(userCheckedOutItem);

        user.addCheckedOutItem(userCheckedOutItem);
        item.addCheckedOutItem(userCheckedOutItem);

        CheckoutManager.addCheckedOutItem(userCheckedOutItem);
        updateCache(item);
        return ResponseEntity.ok(userCheckedOutItem);
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
            checkoutHistoryDao.save(userCheckoutHistory);

            item.removeCheckedOutItem(prevCheckedOutItem);
            user.removeCheckedOutItem(prevCheckedOutItem);
            CheckoutManager.removeCheckedOutItem(prevCheckedOutItem);
            itemDao.save(item);
            checkedOutItemDao.delete(prevCheckedOutItem);

            HoldItem hold = holdItemDao.findByItemIdOrderByDateHeldAsc(id);
            if(hold!=null) {
                User nextUser = userDao.findOne(hold.getUser());
                if(nextUser != null) {
                    if(nextUser.getPreferences().getAutorenew()) {
                        UserCheckedOutItem userCheckedOutItem = new UserCheckedOutItem(user,item, 7);
                        checkedOutItemDao.save(userCheckedOutItem);

                        user.addCheckedOutItem(userCheckedOutItem);
                        item.addCheckedOutItem(userCheckedOutItem);

                        user.addCheckedOutItem(userCheckedOutItem);
                        item.addCheckedOutItem(userCheckedOutItem);

                        CheckoutManager.addCheckedOutItem(userCheckedOutItem);
                    } else {
                        HoldManager.notifyHoldAvailable(nextUser, item);
                    }
                }
            }

            updateCache(item);
            return ResponseEntity.ok(null);
        }
    }

    @RequestMapping(value = "/api/items/{id}/autorenew", method=RequestMethod.POST)
    public ResponseEntity toggleAutoRenew(HttpServletRequest req, @PathVariable long id) {
        User user = (User) req.getSession().getAttribute("user");
        if(user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
        Item item = ItemFactory.getItemFromCache(id);
        if(item == null) {
            return ResponseEntity.badRequest().body(null);
        }
        UserCheckedOutItem checkedOutItem = null;
        for (UserCheckedOutItem userCheckedOutItem: item.getCheckedOutBy()) {
            if (userCheckedOutItem.getItem() == item.getId() && userCheckedOutItem.getUser() == user.getId()) {
                checkedOutItem = userCheckedOutItem;
            }
        }
        if (checkedOutItem == null) {
            return ResponseEntity.badRequest().body(null);
        }
        checkedOutItem.setRenew(!checkedOutItem.getWillRenew());
        checkedOutItemDao.save(checkedOutItem);

        item.updateCheckedOutItem(checkedOutItem);
        user.updateCheckedOutItem(checkedOutItem);

        updateCache(item);
        return ResponseEntity.ok(checkedOutItem.getWillRenew());
    }

    @RequestMapping(value = "/api/items/{id}/renew", method = RequestMethod.POST)
    public ResponseEntity renew(HttpServletRequest req, @PathVariable long id) {
        User user = (User) req.getSession().getAttribute("user");
        if(user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
        Item item = ItemFactory.getItemFromCache(id);
        if(item == null) {
            return ResponseEntity.badRequest().body(null);
        }
        if (item.getAvailableLicenses() == 0) {
            return ResponseEntity.badRequest().body(null);
        }
        UserCheckedOutItem checkedOutItem = null;
        for (UserCheckedOutItem userCheckedOutItem: item.getCheckedOutBy()) {
            if (userCheckedOutItem.getItem() == item.getId() && userCheckedOutItem.getUser() == user.getId()) {
                checkedOutItem = userCheckedOutItem;
            }
        }
        if (checkedOutItem == null) {
            return ResponseEntity.badRequest().body(null);
        }
        if (checkedOutItem.isRenewed()) {
            return ResponseEntity.badRequest().body(null);
        }
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(checkedOutItem.getDueDate());
        calendar.add(Calendar.DATE, 7);
        Date newDueDate = new Date(calendar.getTimeInMillis());

        checkedOutItem.setDueDate(newDueDate);
        checkedOutItem.setRenewed(true);
        checkedOutItem.setRenew(false);
        checkedOutItemDao.save(checkedOutItem);

        item.updateCheckedOutItem(checkedOutItem);
        user.updateCheckedOutItem(checkedOutItem);

        updateCache(item);
        return ResponseEntity.ok(newDueDate);
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

    @RequestMapping(value = "/api/items/{id}/rate", method = RequestMethod.POST)
    public ResponseEntity rate(HttpServletRequest req, @PathVariable long id) {
        User user = (User) req.getSession().getAttribute("user");
        if(user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
        Item item = ItemFactory.getItemFromCache(id);
        if(item == null) {
            return ResponseEntity.badRequest().body(null);
        }
        int rating = Integer.parseInt(req.getParameter("rating"));
        UserItemRating userItemRating = itemRatingDao.findByItemIdAndUserId(item.getId(),user.getId());
        if (userItemRating == null) {
            userItemRating = new UserItemRating(rating,user,item);
            itemRatingDao.save(userItemRating);
            item.addRating(userItemRating);
            user.addRating(userItemRating);
        } else {
            userItemRating.setRating(rating);
            itemRatingDao.save(userItemRating);
            item.updateRating(userItemRating);
            user.updateRating(userItemRating);
        }

        updateCache(item);
        return ResponseEntity.ok(userItemRating);
    }

    @RequestMapping(value = "/api/items/{id}/removerating", method = RequestMethod.DELETE)
    public ResponseEntity removeRating(HttpServletRequest req, @PathVariable long id) {
        User user = (User) req.getSession().getAttribute("user");
        if(user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
        Item item = ItemFactory.getItemFromCache(id);
        if(item == null) {
            return ResponseEntity.badRequest().body(null);
        }
        UserItemRating userItemRating = itemRatingDao.findByItemIdAndUserId(item.getId(), user.getId());
        if (userItemRating == null) {
            return ResponseEntity.badRequest().body(null);
        }

        item.removeRating(userItemRating);
        user.removeRating(userItemRating);
        itemRatingDao.delete(userItemRating);

        updateCache(item);
        return ResponseEntity.ok(null);
    }

    public void updateCache(Item item) {
        ItemFactory.update(item);
        if (item instanceof Book) {
            BookFactory.update((Book) item);
        }
    }

    @RequestMapping(value = "/api/items/{id}/ban", method = RequestMethod.POST)
    public ResponseEntity ban(HttpServletRequest request, @PathVariable long id){
        User admin = (User) request.getSession().getAttribute("user");
        if (admin == null){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
        if (!admin.getUserType().equals("admin")){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
        }
        Item item = ItemFactory.getItemFromCache(id);
        if (item == null){
            return ResponseEntity.badRequest().body(null);
        }

        item.setStatus(ItemStatus.Banned.toString());
        itemDao.save(item);
        return ResponseEntity.ok(null);
    }
}
