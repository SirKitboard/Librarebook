package com.notdecaf.models;
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

    @OneToMany
    @JoinColumn(name = "series")
    private Set<Item> items;
}
