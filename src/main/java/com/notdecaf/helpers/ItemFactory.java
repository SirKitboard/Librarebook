package com.notdecaf.helpers;

/**
 * Created by adi on 31/3/16.
 */

import com.notdecaf.daos.ItemDao;
import com.notdecaf.models.Item;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
;import java.util.ArrayList;
import java.util.List;

/**
 * Created by adi on 28/3/16.
 */
@Controller
public class ItemFactory {
    private static List<Item> lruItemCache = new ArrayList<Item>();

    private static ItemDao itemDao;

    @Autowired
    public void setItemDao(ItemDao itemDao) {
        ItemFactory.itemDao = itemDao;
    }

    public static Item getItemFromCache(long id) {
        int index = -1;
        for(int i = 0; i<lruItemCache.size(); i++) {
            if(lruItemCache.get(i).getId() == id) {
                index = i;
                break;
            }
        }
        if(index > -1) {
            Item item = lruItemCache.remove(index);
            lruItemCache.add(0, item);
            return item;
        } else {
            Item item = itemDao.findOne(id);
            if(item != null) {
                lruItemCache.add(0, item);
                if(lruItemCache.size() > 15) {
                    lruItemCache.remove(14);
                }
            }
            return item;
        }
    }

    public static Iterable<Item> findAll(){
        return itemDao.findAll();
    }

    public static List<Item> findRecentItems() {
        return itemDao.findTop10ByOrderByDateAddedDesc();
    }

    public static void save(Item item) {
        itemDao.save(item);
    }
//    private static linearSearchItem
}

