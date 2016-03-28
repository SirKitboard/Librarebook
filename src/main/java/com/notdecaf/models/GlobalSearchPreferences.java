package com.notdecaf.models;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * Created by Adi on 3/28/2016.
 */
@Entity
@Table(name="user_searchPreferences")
public class GlobalSearchPreferences {

    @Id
    private long userID;

    private int maturity;

    public long getUserID() {
        return userID;
    }

    public int getMaturity() {
        return maturity;
    }

    public void setMaturity(int maturity) {
        this.maturity = maturity;
    }

    public GlobalSearchPreferences() {
    }
}
