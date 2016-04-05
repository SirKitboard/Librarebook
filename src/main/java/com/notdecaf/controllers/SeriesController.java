package com.notdecaf.controllers;

import com.notdecaf.daos.ItemDao;
import com.notdecaf.daos.SeriesDao;
import com.notdecaf.helpers.ItemFactory;
import com.notdecaf.models.Item;
import com.notdecaf.models.Series;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Created by adi on 31/3/16.
 */
@RestController
public class SeriesController implements BaseController<Series> {

    @Autowired
    private SeriesDao seriesDao;

    @RequestMapping(value = "/api/series", method = RequestMethod.GET)
    public ResponseEntity<Series[]> all(HttpSession session) {
        Iterable<Series> series = seriesDao.findAll();
        List<Series> seriesList = new ArrayList<Series>();
        for (Series serie : series) {
            seriesList.add(serie);
        }
        return ResponseEntity.ok(seriesList.toArray(new Series[0]));
    }

    @RequestMapping(value = "/api/series/{id}", method = RequestMethod.GET)
    public ResponseEntity<Series> get(HttpSession session, @PathVariable long id) {
        Series series = seriesDao.findOne(id);
        if(series == null) {
            return new ResponseEntity<Series>(HttpStatus.NOT_FOUND);
        }
        return ResponseEntity.ok(series);
    }

    @RequestMapping(value = "/api/series", method = RequestMethod.POST)
    public ResponseEntity<Series> create(HttpServletRequest request) {
        Map<String, String[]> requestMap = request.getParameterMap();
        if(!requestMap.containsKey("name")) {
            return ResponseEntity.badRequest().body(null);
        }
        String title = request.getParameter("name");
        Series series = new Series(title);
        seriesDao.save(series);
        return ResponseEntity.ok(series);
    }

    @RequestMapping(value = "/api/series/{id}", method = RequestMethod.PUT)
    public ResponseEntity<Series> update(HttpServletRequest request, @PathVariable long id) {
        Series series = seriesDao.findOne(id);
        if(series == null) {
            return new ResponseEntity<Series>(HttpStatus.NOT_FOUND);
        }
        if(request.getParameterMap().containsKey("title")) {
            series.setName(request.getParameter("title"));
        }
        Map<String, String[]> map = request.getParameterMap();
        if(request.getParameterMap().containsKey("addItems")){
            String[] itemsToAdd = request.getParameterValues("addItems");
            for(String item: itemsToAdd) {
                try {
                    long itemID = Long.parseLong(item);
                    Item itemModel = ItemFactory.getItemFromCache(itemID);
                    if(itemModel == null) {
                        throw new RuntimeException();
                    }
                    series.addItemToSeries(itemModel);
                } catch (Exception e) {
                    e.printStackTrace();
                    return new ResponseEntity<Series>(HttpStatus.NOT_FOUND);
                }
            }
        }
        if(request.getParameterMap().containsKey("removeItems")){
            String[] itemsToRemove = request.getParameterValues("removeItems");
            for(String item: itemsToRemove) {
                try {
                    long itemID = Long.parseLong(item);
                    Item itemModel = ItemFactory.getItemFromCache(itemID);
                    if(itemModel == null) {
                        throw new RuntimeException();
                    }
                    series.removeItemFromSeries(itemModel);
                } catch (Exception e) {
                    e.printStackTrace();
                    return new ResponseEntity<Series>(HttpStatus.NOT_FOUND);
                }
            }
        }
        seriesDao.save(series);

        return ResponseEntity.ok(series);
    }

    @RequestMapping(value = "/api/series/{id}", method = RequestMethod.DELETE)
    public ResponseEntity delete(HttpServletRequest request, @PathVariable long id) {
        Series series = seriesDao.findOne(id);
        if(series == null) {
            return ResponseEntity.notFound().build();
        }
        seriesDao.delete(series);
        return ResponseEntity.noContent().build();
    }
}
