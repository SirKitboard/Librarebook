package com.notdecaf.controllers;

import com.notdecaf.controllers.BaseController;
import com.notdecaf.models.Admin;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

/**
 * Created by purav on 3/28/16.
 */
@RestController
public class AdminController implements BaseController<Admin>{
    @Override
    public ResponseEntity<Admin[]> all(HttpSession session) {
        return null;
    }

    @Override
    public ResponseEntity<Admin> get(HttpSession session, long id) {
        return null;
    }

    @Override
    public ResponseEntity<Admin> create(HttpServletRequest request) {
        return null;
    }

    @Override
    public ResponseEntity<Admin> update(HttpServletRequest request, long id) {
        return null;
    }

    @Override
    public ResponseEntity delete(HttpServletRequest request, long id) {
        return null;
    }
}
