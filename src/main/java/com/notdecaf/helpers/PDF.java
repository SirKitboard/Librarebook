package com.notdecaf.helpers;

/**
 * Created by Adi on 4/30/2016.
 */
public class PDF {
    private static final String PATH = "/pdfs";
    public static String getPDFPath(String relative) {
        return PATH+relative;
    }
    public static String getSamplePDFPath(String relative) {
        return PATH+"/samples"+relative;
    }
}
