package com.notdecaf.models;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;

/**
 * Created by halaamenasy on 3/28/16.
 */
@Entity
@DiscriminatorValue("admin")
public class Admin extends Moderator {
}
