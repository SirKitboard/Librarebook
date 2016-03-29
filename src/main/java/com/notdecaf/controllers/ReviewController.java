package com.notdecaf.controllers;

import com.notdecaf.daos.ReviewDao;
import com.notdecaf.daos.UserItemRatingDao;
import com.notdecaf.models.Review;
import com.notdecaf.daos.UserReviewRatingDao;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

/**
 * Created by purav on 3/28/16.
 */
@RestController
public class ReviewController implements BaseController<Review>{

    @Autowired
    private ReviewDao reviewDao;

    @Autowired
    private UserReviewRatingDao revewRatingDao;

    @Autowired
    private UserItemRatingDao itemRatingDao;

    @Override
    public ResponseEntity<Review[]> all(HttpSession session) {
        return null;
    }

    @Override
    public ResponseEntity<Review> get(HttpSession session, long id) {
        return null;
    }

    @Override
    public ResponseEntity<Review> create(HttpServletRequest request) {
        return null;
    }

    @Override
    public ResponseEntity<Review> update(HttpServletRequest request, long id) {
        return null;
    }

    @Override
    public ResponseEntity delete(HttpServletRequest request, long id) {
        return null;
    }

    public ResponseEntity rate(HttpServletRequest request) {
        return null;
    }

    public ResponseEntity flag(HttpServletRequest request) {
        return null;
    }
}
