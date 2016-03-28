package com.notdecaf.models;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;

/**
 * Created by halaamenasy on 3/28/16.
 */
@DiscriminatorValue("moderator")
@Entity
public class Moderator extends User{
}
