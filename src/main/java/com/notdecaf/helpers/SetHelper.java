package com.notdecaf.helpers;

import com.notdecaf.models.IDModel;

import java.util.HashSet;
import java.util.Set;

/**
 * Created by adi on 31/3/16.
 */
public class SetHelper {
    public static <E extends IDModel> boolean search(Set<E> set, E object) {
        for(E item : set) {
            if(item.getId() == object.getId()) {
                return true;
            }
        }
        return false;
    }

    public static <E extends IDModel> Set<E> remove(Set<E> set, E object) {
        Set<E> newSet = new HashSet<>();
        for(E item : set) {
            if(item.getId() == object.getId()) {
                continue;
            }
            newSet.add(item);
        }
        return newSet;
    }

    public static <E extends IDModel> Set<E> update(Set<E> set, E object) {
        Set<E> newSet = new HashSet<>();
        for(E item : set) {
            if(item.getId() == object.getId()) {
                newSet.add(object);
            } else {
                newSet.add(item);
            }
        }
        return newSet;
    }
}
