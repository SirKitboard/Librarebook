package com.notdecaf.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * Created by adi on 5/4/16.
 */
@Controller
public class ViewController {
    @RequestMapping(value="/")
    public String home() {
        return "index";
    }

    @RequestMapping(value="/admindashboard")
    public String adminDashboard() {
        return "admindashboard";
    }

    @RequestMapping(value="/bookprofile")
    public String bookProfile() {
        return "bookprofile";
    }

    @RequestMapping(value="/searchresults")
    public String searchResults() {
        return "searchresults";
    }

    @RequestMapping(value="/userprofile")
    public String userProfile() {
        return "userprofile";
    }
}
