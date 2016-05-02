package com.notdecaf.helpers;

import com.notdecaf.daos.ItemDao;
import com.notdecaf.daos.UserCheckedOutItemDao;
import com.notdecaf.daos.UserDao;
import com.notdecaf.models.Book;
import com.notdecaf.models.Item;
import com.notdecaf.models.User;
import com.notdecaf.models.UserCheckedOutItem;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.*;

/**
 * Created by purav on 5/1/16.
 */
@Service
public class CheckoutManager {
    private static List<UserCheckedOutItem> checkedOutItems = new ArrayList<UserCheckedOutItem>();
    private static List<UserCheckedOutItem> queuedItems = new ArrayList<UserCheckedOutItem>();

    @Autowired
    UserCheckedOutItemDao checkedOutItemDao;

    @Autowired
    ItemDao itemDao;

    @Autowired
    UserDao userDao;

    public CheckoutManager() {}

    @Scheduled(cron="*/5 * * * * ?")
    public void checkItemDue() {
        checkedOutItems.addAll(queuedItems);
        queuedItems.clear();
        if (checkedOutItems.size() > 0) {
            Date currentDate = new Date();
            Iterator<UserCheckedOutItem> itemIterator = checkedOutItems.iterator();
            while (itemIterator.hasNext()) {
                UserCheckedOutItem checkedOutItem= itemIterator.next();
                if (currentDate.after(checkedOutItem.getDueDate())) {
                    if (checkedOutItem.getWillRenew()) {
                        renewItem(checkedOutItem);
                    } else {
                        returnItem(checkedOutItem);
                        itemIterator.remove();
                    }
                }
            }
        }
    }

    private void returnItem(UserCheckedOutItem checkedOutItem) {
        Item item = ItemFactory.getItemFromCache(checkedOutItem.getItem());
        User user = userDao.findOne(checkedOutItem.getUser());
        item.removeCheckedOutItem(checkedOutItem);
        user.removeCheckedOutItem(checkedOutItem);

        itemDao.save(item);
        userDao.save(user);
        checkedOutItemDao.delete(checkedOutItem);
        ItemFactory.update(item);
        if (item instanceof Book) {
            BookFactory.update((Book) item);
        }
    }

    private void renewItem(UserCheckedOutItem checkedOutItem) {
        Item item = ItemFactory.getItemFromCache(checkedOutItem.getItem());
        User user = userDao.findOne(checkedOutItem.getUser());

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
        itemDao.save(item);
        userDao.save(user);
        ItemFactory.update(item);
        if (item instanceof Book) {
            BookFactory.update((Book) item);
        }
    }

    public static void addCheckedOutItem(UserCheckedOutItem item) {
        queuedItems.add(item);
    }
}
