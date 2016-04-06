package com.notdecaf.controllers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
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

    public String getLoggedInUser(HttpServletRequest req) {
        User user = (User) req.getSession().getAttribute("user");

        String userJSON = null;
        if (user != null) {
            ObjectMapper mapper = new ObjectMapper();
            try {
                userJSON = mapper.writeValueAsString(user);
            } catch (JsonProcessingException e) {
                e.printStackTrace();
            }
        }
        return userJSON;
    }

    @RequestMapping(value="/")
    public String home(Model model, HttpServletRequest req) {

        model.addAttribute("user", this.getLoggedInUser(req));
        return "index";
    }

    @RequestMapping(value="/admindashboard")
    public String adminDashboard(Model model, HttpServletRequest req) {
        String user = this.getLoggedInUser(req);
        model.addAttribute("user", this.getLoggedInUser(req));
        return "admindashboard";
    }

    @RequestMapping(value="/bookprofile")
    public String bookProfile(Model model, HttpServletRequest req) {
        model.addAttribute("user", this.getLoggedInUser(req));
        return "bookprofile";
    }

    @RequestMapping(value="/searchresults")
    public String searchResults(Model model, HttpServletRequest req) {
        model.addAttribute("user", this.getLoggedInUser(req));
        return "searchresults";
    }

    @RequestMapping(value="/userprofile")
    public String userProfile(Model model, HttpServletRequest req) {
        model.addAttribute("user", this.getLoggedInUser(req));
        return "userprofile";
    }
}
