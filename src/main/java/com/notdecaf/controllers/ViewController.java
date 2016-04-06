package com.notdecaf.controllers;

import com.notdecaf.models.User;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletRequest;

/**
 * Created by adi on 5/4/16.
 */
@Controller
public class ViewController {

    public User getLoggedInUser(HttpServletRequest req) {
        User user = (User) req.getSession().getAttribute("user");

        //Dont question it
        if(user != null) {
            user = user.clone();
        }
        
        return user;
    }

    @RequestMapping(value="/")
    public String home(Model model, HttpServletRequest req) {

        model.addAttribute("user", this.getLoggedInUser(req));
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
