package com.notdecaf.controllers;

import org.springframework.http.ResponseEntity;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

/**
 * Created by Adi on 3/27/2016.
 */
public interface BaseController<E> {
    ResponseEntity<E[]> all(HttpSession session);

    ResponseEntity<E> get(HttpSession session, long id);

    ResponseEntity<E> create(HttpServletRequest request);

    ResponseEntity<E> update(HttpServletRequest request, long id);

    ResponseEntity delete(HttpServletRequest request, long id);
}
