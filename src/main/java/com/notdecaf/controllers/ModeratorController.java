package com.notdecaf.controllers;

import com.notdecaf.controllers.BaseController;
import com.notdecaf.models.Moderator;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

/**
 * Created by purav on 3/28/16.
 */
@RestController
public class ModeratorController implements BaseController<Moderator>{

    @Override
    public ResponseEntity<Moderator[]> all(HttpSession session) {
        return null;
    }

    @Override
    public ResponseEntity<Moderator> get(HttpSession session, long id) {
        return null;
    }

    @Override
    public ResponseEntity<Moderator> create(HttpServletRequest request) {
        return null;
    }

    @Override
    public ResponseEntity<Moderator> update(HttpServletRequest request, long id) {
        return null;
    }

    @Override
    public ResponseEntity delete(HttpServletRequest request, long id) {
        return null;
    }
}
