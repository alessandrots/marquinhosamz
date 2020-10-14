package com.scanlibrary;

import java.util.HashMap;

public interface PassDataInterface {
    public void onDataReceived(String imgBase64Scanned, String imgBase64Original, HashMap mapaPoints);
}
