package com.scanlibrary;

import android.graphics.PointF;
import android.net.Uri;

import java.util.Map;

/**
 * Created by jhansi on 04/04/15.
 */
public interface IScanner {

    void onBitmapSelect(Uri uri);

    void onScanFinish(Uri uri);

    void onScanFinishByAmazon(Uri uriOriginal, Uri uriScanned, Map<Integer, PointF> points, Map<Integer, PointF> pointsScanned);
}
