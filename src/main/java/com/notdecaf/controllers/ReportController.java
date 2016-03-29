package com.notdecaf.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;

/**
 * Created by purav on 3/28/16.
 */
@RestController
public class ReportController {
    @RequestMapping(value = "/api/admindashboard/users/stats", method = RequestMethod.POST)
    public ResponseEntity getUserStats(HttpServletRequest request) {
        return null;
    }

    @RequestMapping(value = "/api/admindashboard/books/stats", method = RequestMethod.POST)
    public ResponseEntity getBookStats(HttpServletRequest request) {
        return null;
    }

    @RequestMapping(value = "/api/admindashboard/website/stats", method = RequestMethod.POST)
    public ResponseEntity getWebsiteStats(HttpServletRequest request) {
        return null;
    }
}
