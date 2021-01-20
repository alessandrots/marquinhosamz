package com.scanlibrary;

import android.os.Environment;

/**
 * Created by jhansi on 15/03/15.
 */
public class ScanConstants {

    public final static int PICKFILE_REQUEST_CODE = 1;
    public final static int START_CAMERA_REQUEST_CODE = 2;
    public final static String OPEN_INTENT_PREFERENCE = "selectContent";
    public final static String IMAGE_BASE_PATH_EXTRA = "ImageBasePath";
    public final static int OPEN_CAMERA = 4;
    public final static int OPEN_MEDIA = 5;
    public final static String SCANNED_RESULT = "scannedResult";
    public final static String IMAGE_PATH = Environment
            .getExternalStorageDirectory().getPath() + "/AizonApp";

    public final static String SELECTED_BITMAP = "selectedBitmap";
    public final static String ORIGINAL_IMG_URI = "originaImgUri";
    public final static String POINTS_MARKED_ORIGINAL_IMG = "pointsMarkedOriginalImg";

    public final static String POINTS_SCANNED_IMG = "pointsScannedlImg";

    public final static String SCANNED_IMG_BASE64  = "scannedImageBase64";
    public final static String ORIGINAL_IMG_BASE64 = "originalImageBase64";
    public final static String ARRAY_COORDENADAS_Img   = "arrayCoordenadasImg";

    public final static String ID_PROCESS_SCAN_IMAGE   = "idProcessScanIMAGE";
    public final static String IMAGE_TYPE_SCAN_IMAGE   = "imageType";
    public final static String PATH_ABSOLUTE_IMAGE_ORIGIN  = "pathAbsoluteIMAGE";

    public final static String CHOICE_CANVAS_ACTIVITY   = "ESCOLHA_CANVAS_ACTIVITY";

    public final static String FILE_IMAGE_PHOTO_PATH_ABSOLUTE  = "fileImagePhotoPath";

}
