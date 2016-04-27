package com.notdecaf.helpers;

import java.io.*;
import java.util.Properties;

/**
 * Created by Adi on 4/27/2016.
 */
public class PropertiesManager {
    private static Properties prop;

    public static Properties getProperties() {
        if(prop == null) {
            new PropertiesManager();
        }
        return prop;
    }

    private PropertiesManager() {
        prop = new Properties();
        try {
            ClassLoader classLoader = getClass().getClassLoader();
            File file = new File(classLoader.getResource("application.properties").getFile());
            InputStream input = new FileInputStream(file);
            prop.load(input);
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public static String getProperty(String key) {
        Properties props = getProperties();
        return props.getProperty(key);
    }

}
