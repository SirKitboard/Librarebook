package com.notdecaf.controllers;

import com.notdecaf.models.Series;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

/**
 * Created by adi on 31/3/16.
 */
public class SeriesController implements BaseController<Series> {

    @RequestMapping(value = "/api/series", method = RequestMethod.GET)
    public ResponseEntity<Series[]> all(HttpSession session) {
        // TODO: Implement Method
        return null;
    }

    @RequestMapping(value = "/api/series/{id}", method = RequestMethod.GET)
    public ResponseEntity<Series> get(HttpSession session, @PathVariable long id) {
        // TODO: Implement Method
        return null;
    }

    @RequestMapping(value = "/api/series", method = RequestMethod.GET)
    public ResponseEntity<Series> create(HttpServletRequest request) {
        // TODO: Implement Method
        return null;
    }

    @RequestMapping(value = "/api/series/{id}", method = RequestMethod.PUT)
    public ResponseEntity<Series> update(HttpServletRequest request, @PathVariable long id) {
        // TODO: Implement Method
        return null;
    }

    @RequestMapping(value = "/api/series/{id}", method = RequestMethod.DELETE)
    public ResponseEntity delete(HttpServletRequest request, long id) {
        // TODO: Implement Method
        return null;
    }
}
