package com.notdecaf.helpers;

import com.notdecaf.daos.HoldItemDao;
import com.notdecaf.daos.ItemDao;
import com.notdecaf.daos.UserDao;
import com.notdecaf.models.*;
import com.sendgrid.SendGrid;
import com.sendgrid.SendGridException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import java.util.*;

/**
 * Created by purav on 5/1/16.
 */
@Component
public class HoldManager {
    private static List<HoldItem> holds = new ArrayList<HoldItem>();
    private static List<HoldItem> queuedHolds = new ArrayList<HoldItem>();
    private static List<HoldItem> releasedHolds = new ArrayList<HoldItem>();

    public static Comparator<HoldItem> holdItemComparator = new Comparator<HoldItem>() {
        @Override
        public int compare(HoldItem o1, HoldItem o2) {
            Date date1 = o1.getDateHeld();
            Date date2 = o2.getDateHeld();

            return date2.compareTo(date1);
        }
    };

    @Autowired
    HoldItemDao holdItemDao;

    @Autowired
    ItemDao itemDao;

    @Autowired
    UserDao userDao;

    public HoldManager() {
    }

    @Scheduled(cron="*/5 * * * * ?")
    public void checkHold() {
        holds.addAll(queuedHolds);
        holds.removeAll(releasedHolds);
        queuedHolds.clear();
        releasedHolds.clear();
        boolean removedHold = false;
        if (holds.size() > 0) {
            Date currentDate = new Date();
            Calendar calendar = Calendar.getInstance();
            Iterator<HoldItem> itemIterator = holds.iterator();
            while (itemIterator.hasNext()) {
                HoldItem holdItem = itemIterator.next();
                calendar.setTime(holdItem.getDateAvailable());
                calendar.add(Calendar.SECOND, 15);
                if (currentDate.after(new Date(calendar.getTimeInMillis()))) {
                    releaseHold(holdItem);
                    itemIterator.remove();
                    removedHold = true;
                }
            }
        }
        if (removedHold) {
            System.out.println("Hold Removed");
        } else {
            System.out.println("Nothing done");
        }
    }

    public static void addHold(HoldItem holdItem) {
        queuedHolds.add(holdItem);
    }

    public static void removeHold(HoldItem holdItem) {
        releasedHolds.add(holdItem);
    }

    public void releaseHold(HoldItem holdItem) {
        Item item= ItemFactory.getItemFromCache(holdItem.getItem());
        User user = userDao.findOne(holdItem.getUser());
        item.removeHold(holdItem);
        user.removeHold(holdItem);

        List<HoldItem> remainingHolds = new ArrayList<>(item.getHoldsBy());
        if (remainingHolds.size() > 0) {
            Collections.sort(remainingHolds,holdItemComparator);
            HoldItem nextHold = remainingHolds.get(0);
            nextHold.setDateAvailable(new Date());
            notifyHoldAvailable(user, item);
            addHold(nextHold);
            holdItemDao.save(nextHold);
        }

        itemDao.save(item);
        userDao.save(user);
        holdItemDao.delete(holdItem);
        ItemFactory.update(item);
        if (item instanceof Book) {
            BookFactory.update((Book) item);
        }
    }

    public static void notifyHoldAvailable(User user, Item item) {
        try{
            SendGrid sendgrid = new SendGrid(PropertiesManager.getProperty("sendgrid.api-key"));
            SendGrid.Email email = new SendGrid.Email();

            String userEmail = user.getEmail();
            email.addTo(userEmail);
            email.setFrom("noreply@librarebook.com");
            email.setSubject("Hold Available to Checkout: " + item.getTitle());
            email.setText("A copy of " + item.getTitle() + " is available for you to checkout. This copy will bre reserved for" +
                    "3 days before your spot is given up to another user.");

            sendgrid.send(email);
        } catch (SendGridException e) {
            e.printStackTrace();
        }
    }
}
