package com.notdecaf.models;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.notdecaf.helpers.SetHelper;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.util.Set;

/**
 * Created by purav on 3/28/16.
 */
@Entity
public class Series {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    @NotNull
    private String name;

    @OneToMany(mappedBy = "series", cascade = CascadeType.ALL)
    private Set<Item> items;

    public Series() {}

    public Series(String title) {
        this.name = title;
    }

    public long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public Set<Item> getItems() {
        return items;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setItems(Set<Item> items) {
        this.items = items;
    }

    public void addItemToSeries(Item item) {
        this.items.add(item);
    }

    public void removeItemFromSeries(Item item) {
        this.items = SetHelper.remove(this.items, item);
    }
}
