package com.scanlibrary;

import android.app.Activity;
import android.app.AlertDialog;
import android.app.FragmentTransaction;
import android.content.ComponentCallbacks2;
import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.PointF;
import android.net.Uri;
import android.os.Bundle;
import android.os.Environment;
import android.provider.MediaStore;
import android.util.Log;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.androidnetworking.AndroidNetworking;
import com.androidnetworking.error.ANError;
import com.androidnetworking.interfaces.JSONObjectRequestListener;
import com.rifafauzi.customcamera.ui.camera.CameraFragment;
import com.rifafauzi.customcamera.ui.main.MainActivity;

import org.json.JSONObject;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;

/**
 * Created by jhansi on 28/03/15.
 */
public class ScanActivity extends AppCompatActivity implements IScanner, ComponentCallbacks2 {

    private static final String TAG = "AIZONApp_ScanActivity";

    private PassDataInterface passDataInterface;
    private String idProcesso;
    private Integer tipoImagem;
    private String pathImageOrigin;
    private boolean escolhaCanvasActivity;

    private float x1 = 0;
    private float x2 = 0;
    private float x3 = 0;
    private float x4 = 0;
    private float y1 = 0;
    private float y2 = 0;
    private float y3 = 0;
    private float y4 = 0;

    private float sx1 = 0;
    private float sx2 = 0;
    private float sx3 = 0;
    private float sx4 = 0;
    private float sy1 = 0;
    private float sy2 = 0;
    private float sy3 = 0;
    private float sy4 = 0;

    public ScanActivity() {
    }

    public ScanActivity(PassDataInterface passDataInterface) {
        this.passDataInterface = passDataInterface;
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        AndroidNetworking.initialize(getApplicationContext());
        setContentView(R.layout.scan_layout);

        this.getDataFromIntent(ScanConstants.CHOICE_CANVAS_ACTIVITY, 2);

        initCropFragment();
    }

    private void initCropFragment() {
        this.getDataFromIntent(ScanConstants.ID_PROCESS_SCAN_IMAGE, 0);
        this.getDataFromIntent(ScanConstants.IMAGE_TYPE_SCAN_IMAGE, 1);

        CameraCropFragment fragment = new CameraCropFragment();
        Bundle bundle = new Bundle();

        bundle.putString(ScanConstants.ID_PROCESS_SCAN_IMAGE, this.idProcesso);
        bundle.putString(ScanConstants.IMAGE_TYPE_SCAN_IMAGE, Integer.toString(this.tipoImagem));
        bundle.putInt(ScanConstants.OPEN_INTENT_PREFERENCE, getPreferenceContent());

        fragment.setArguments(bundle);
        androidx.fragment.app.FragmentManager fragmentManager = getSupportFragmentManager();
        androidx.fragment.app.FragmentTransaction fragmentTransaction = fragmentManager.beginTransaction();
        fragmentTransaction.add(R.id.content, fragment);

        fragmentTransaction.commit();
    }

    /**
    public void startCanvasActivity() {
        Intent intent = new Intent(this, CanvasPhotoActivity.class);

        this.getDataFromIntent(ScanConstants.ID_PROCESS_SCAN_IMAGE, 0);
        this.getDataFromIntent(ScanConstants.IMAGE_TYPE_SCAN_IMAGE, 1);

        Bundle bundle = new Bundle();

        bundle.putString(ScanConstants.ID_PROCESS_SCAN_IMAGE, this.idProcesso);
        bundle.putString(ScanConstants.IMAGE_TYPE_SCAN_IMAGE, Integer.toString(this.tipoImagem));
        bundle.putInt(ScanConstants.OPEN_INTENT_PREFERENCE, getPreferenceContent());

        intent.putExtras(bundle);

        //EditText editText = (EditText) findViewById(R.id.editText);
        //String message = editText.getText().toString();
        //intent.putExtra(EXTRA_MESSAGE, message);
        //startActivity(intent);
        startActivityForResult(intent, 2);
    }

     private void initPickFragment() {
         this.getDataFromIntent(ScanConstants.ID_PROCESS_SCAN_IMAGE, 0);
         this.getDataFromIntent(ScanConstants.IMAGE_TYPE_SCAN_IMAGE, 1);

         PickImageFragment fragment = new PickImageFragment();
         Bundle bundle = new Bundle();

         bundle.putString(ScanConstants.ID_PROCESS_SCAN_IMAGE, this.idProcesso);
         bundle.putString(ScanConstants.IMAGE_TYPE_SCAN_IMAGE, Integer.toString(this.tipoImagem));
         bundle.putInt(ScanConstants.OPEN_INTENT_PREFERENCE, getPreferenceContent());

         fragment.setArguments(bundle);
         android.app.FragmentManager fragmentManager = getFragmentManager();
         FragmentTransaction fragmentTransaction = fragmentManager.beginTransaction();
         fragmentTransaction.add(R.id.content, fragment);

         fragmentTransaction.commit();
     }

     */

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        Bitmap bitmap = null;

        if (resultCode == RESULT_OK && requestCode == 2) {
            if (data.hasExtra(ScanConstants.FILE_IMAGE_PHOTO_PATH_ABSOLUTE) ) {
                String filepath = data.getExtras().getString(ScanConstants.FILE_IMAGE_PHOTO_PATH_ABSOLUTE);

                File fileImageOrigin = new File(filepath);

                try {
                    Uri fileUri = Uri.fromFile(fileImageOrigin);

                    bitmap = Utils.getBitmap(this, fileUri);

                    Uri uri = Utils.getUri(this, bitmap);

                    if (bitmap != null && !bitmap.isRecycled()) {
                        bitmap.recycle();
                        bitmap = null;
                    }

                    onBitmapSelect(uri, filepath);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }
    }

    private Bitmap getBitmap(Uri selectedimg) throws IOException {
        BitmapFactory.Options options = new BitmapFactory.Options();
        options.inSampleSize = 3;

        Bitmap bitmap = MediaStore.Images.Media.getBitmap(this.getContentResolver(), selectedimg);

        return bitmap;
    }

    private void getDataFromIntent(String constante, int escolha) {
        Intent intentFromModule = getIntent();
        String tmp = intentFromModule.getStringExtra(constante);

        if (null != tmp && !tmp.equalsIgnoreCase("")) {
            switch (escolha) {
                case 0:
                    this.idProcesso = tmp;
                    break;
                case 1:
                    this.tipoImagem = Integer.parseInt(tmp);
                    break;
                case 2:
                    this.escolhaCanvasActivity = Boolean.parseBoolean(tmp);
                    break;
            }
        }
    }

    protected int getPreferenceContent() {
        return getIntent().getIntExtra(ScanConstants.OPEN_INTENT_PREFERENCE, 0);
    }

    @Override
    public void onBitmapSelect(Uri uri) {
        ScanFragment fragment = new ScanFragment();
        Bundle bundle = new Bundle();
        bundle.putParcelable(ScanConstants.SELECTED_BITMAP, uri);
        fragment.setArguments(bundle);
        android.app.FragmentManager fragmentManager = getFragmentManager();
        FragmentTransaction fragmentTransaction = fragmentManager.beginTransaction();
        fragmentTransaction.add(R.id.content, fragment);
        fragmentTransaction.addToBackStack(ScanFragment.class.toString());
        fragmentTransaction.commit();
    }

    @Override
    public void onBitmapSelect(Uri uri, String pathAbsoluteOrigin) {
        ScanFragment fragment = new ScanFragment();
        Bundle bundle = new Bundle();
        bundle.putParcelable(ScanConstants.SELECTED_BITMAP, uri);

        //bundle.putString(ScanConstants.ID_PROCESS_SCAN_IMAGE, this.pathImageOrigin);
        this.pathImageOrigin = pathAbsoluteOrigin;

        fragment.setArguments(bundle);
        android.app.FragmentManager fragmentManager = getFragmentManager();
        FragmentTransaction fragmentTransaction = fragmentManager.beginTransaction();
        fragmentTransaction.add(R.id.content, fragment);
        fragmentTransaction.addToBackStack(ScanFragment.class.toString());
        fragmentTransaction.commit();
    }

    @Override
    public void onScanFinish(Uri uri) {
        ResultFragment fragment = new ResultFragment();
        Bundle bundle = new Bundle();
        bundle.putParcelable(ScanConstants.SCANNED_RESULT, uri);
        fragment.setArguments(bundle);
        android.app.FragmentManager fragmentManager = getFragmentManager();
        FragmentTransaction fragmentTransaction = fragmentManager.beginTransaction();
        fragmentTransaction.add(R.id.content, fragment);
        fragmentTransaction.addToBackStack(ResultFragment.class.toString());
        fragmentTransaction.commit();
    }

    @Override
    public void onScanFinishByAmazon(Uri uriOriginal, Uri uriScanned, Map<Integer, PointF> points, Map<Integer, PointF> pointsScanned) {
        ResultFragment fragment = new ResultFragment();
        Bundle bundle = new Bundle();

        bundle.putParcelable(ScanConstants.SCANNED_RESULT, uriScanned);
        bundle.putParcelable(ScanConstants.ORIGINAL_IMG_URI, uriOriginal);
        bundle.putString(ScanConstants.ID_PROCESS_SCAN_IMAGE, this.idProcesso);
        bundle.putInt(ScanConstants.IMAGE_TYPE_SCAN_IMAGE, this.tipoImagem);
        bundle.putString(ScanConstants.PATH_ABSOLUTE_IMAGE_ORIGIN, this.pathImageOrigin);

        HashMap<Integer, PointF> mapPoints = convertMapPointsToSerializableHash(points);
        bundle.putSerializable(ScanConstants.POINTS_MARKED_ORIGINAL_IMG, mapPoints);

        HashMap<Integer, PointF> mapPointsScanned = convertMapPointsToSerializableHash(pointsScanned);
        bundle.putSerializable(ScanConstants.POINTS_SCANNED_IMG, mapPointsScanned);

        fragment.setArguments(bundle);
        android.app.FragmentManager fragmentManager = getFragmentManager();
        FragmentTransaction fragmentTransaction = fragmentManager.beginTransaction();
        fragmentTransaction.add(R.id.content, fragment);
        fragmentTransaction.addToBackStack(ResultFragment.class.toString());
        fragmentTransaction.commit();

    }



    private HashMap<Integer, PointF> convertMapPointsToSerializableHash(Map<Integer, PointF> points) {
        Set<Integer> keysPoints = points.keySet();
        Iterator<Integer> iteKeys = keysPoints.iterator();

        HashMap<Integer, PointF> mapPoints = new HashMap();

        while (iteKeys.hasNext()) {
            Integer key = iteKeys.next();
            PointF pointF = points.get(key);
            mapPoints.put(key, pointF);
        }
        return mapPoints;
    }

    protected void getDataFromFragment2( String idProcesso_, String imgBase64Scanned, String imgBase64Original, HashMap mapaPoints, HashMap mapaPointsScanned) {
        Bitmap bitmap = null;
        Intent data = new Intent();

        this.idProcesso = idProcesso_;

        Set<Integer> keysPoints = mapaPoints.keySet();
        Iterator<Integer> ite = keysPoints.iterator();

        while (ite.hasNext()) {
            Integer key = ite.next();
            PointF pointMap = (PointF)mapaPoints.get(key);


            switch (key) {
                case 0:
                    this.x1 = pointMap.x;
                    this.y1 = pointMap.y;
                    break;
                case 1:
                    this.x2 = pointMap.x;
                    this.y2 = pointMap.y;
                    break;
                case 2:
                    this.x3 = pointMap.x;
                    this.y3 = pointMap.y;
                    break;
                case 3:
                    this.x4 = pointMap.x;
                    this.y4 = pointMap.y;
                    break;
            }
        };

        keysPoints = mapaPointsScanned.keySet();
        ite = keysPoints.iterator();

        while (ite.hasNext()) {
            Integer key = ite.next();
            PointF pointMap = (PointF)mapaPointsScanned.get(key);

            switch (key) {
                case 0:
                    this.sx1 = pointMap.x;
                    this.sy1 = pointMap.y;
                    break;
                case 1:
                    this.sx2 = pointMap.x;
                    this.sy2 = pointMap.y;
                    break;
                case 2:
                    this.sx3 = pointMap.x;
                    this.sy3 = pointMap.y;
                    break;
                case 3:
                    this.sx4 = pointMap.x;
                    this.sy4 = pointMap.y;
                    break;
            }
        };

        sendImageToProcess(imgBase64Scanned, imgBase64Original);

        setResult(Activity.RESULT_OK, data);
    }

    protected void getDataFromFragment( String imgBase64Scanned, String imgBase64Original, HashMap mapaPoints) {
        Bitmap bitmap = null;
        Intent data = new Intent();

        Set<Integer> keysPoints = mapaPoints.keySet();
        Iterator<Integer> ite = keysPoints.iterator();

        while (ite.hasNext()) {
            Integer key = ite.next();
            PointF pointMap = (PointF)mapaPoints.get(key);


            switch (key) {
                case 0:
                    this.x1 = pointMap.x;
                    this.y1 = pointMap.y;
                    break;
                case 1:
                    this.x2 = pointMap.x;
                    this.y2 = pointMap.y;
                    break;
                case 2:
                    this.x3 = pointMap.x;
                    this.y3 = pointMap.y;
                    break;
                case 3:
                    this.x4 = pointMap.x;
                    this.y4 = pointMap.y;
                    break;
            }
        };

        sendImageToProcess(imgBase64Scanned, imgBase64Original);

        setResult(Activity.RESULT_OK, data);

        //this.passDataInterface.onDataReceived(imgBase64Scanned, imgBase64Original, mapaPoints);
    }

    private void writeToFile(String data, String tipoParametro, Context context) {
        try {
            String filename = "dadosImagem_" + tipoParametro + "_";

            String timeStamp = new SimpleDateFormat("yyyyMMdd_HHmmss").format(new Date());

            File path = this.getBaseContext().getExternalFilesDir(Environment.DIRECTORY_DOCUMENTS);

            OutputStreamWriter outputStreamWriter = new OutputStreamWriter(context.openFileOutput(filename + timeStamp + ".txt", Context.MODE_PRIVATE));
            outputStreamWriter.write(data);
            outputStreamWriter.close();
        }
        catch (IOException e) {
            Log.e("Exception", "File write failed: " + e.toString());
        }
    }

    /**
     *  id..............: [id do documento]
     *  imageType.......: [imageType -> 0 - Frente | 1 - Verso]
     *  fileImageOrigin.: [fileImageOrigin  - base64]
     *  fileImageScanned: [fileImageScanned - base64]
     *  x1..............: [vertice 1 - coluna]
     *  y1..............: [vertice 1 - linha]
     *  x2..............: [vertice 2 - coluna]
     *  y2..............: [vertice 2 - linha]
     *  x3..............: [vertice 3 - coluna]
     *  y3..............: [vertice 3 - linha]
     *  x4..............: [vertice 4 - coluna]
     *  y4..............: [vertice 4 - linha]
     */
    public void sendImageToProcess(String imgBase64Scanned, String imgBase64Original) {
        String idProcessoTmp = "100020AB";

        if (this.idProcesso != null) {
            idProcessoTmp = this.idProcesso;
        }

        Log.i(TAG, "sendImageToProcess " );
        Log.i(TAG, "id  = " + idProcessoTmp);
        Log.i(TAG, "imageType  = " +this.tipoImagem.toString());
        Log.i(TAG, "fileImageOrigin  = " +imgBase64Original);
        Log.i(TAG, "fileImageScanned  = " +imgBase64Scanned);
        Log.i(TAG, "x1  = " +this.x1);
        Log.i(TAG, "y1  = " +this.y1);
        Log.i(TAG, "x2  = " +this.x2);
        Log.i(TAG, "y2  = " +this.y2);
        Log.i(TAG, "x3  = " +this.x3);
        Log.i(TAG, "y3  = " +this.y3);
        Log.i(TAG, "x4  = " +this.x4);
        Log.i(TAG, "y4  = " +this.y4);
        Log.i(TAG, "sx1  = " +this.x1);
        Log.i(TAG, "sy1  = " +this.y1);
        Log.i(TAG, "sx2  = " +this.x2);
        Log.i(TAG, "sy2  = " +this.y2);
        Log.i(TAG, "sx3  = " +this.x3);
        Log.i(TAG, "sy3  = " +this.y3);
        Log.i(TAG, "sx4  = " +this.x4);
        Log.i(TAG, "sy4  = " +this.y4);

        AndroidNetworking.post("http://45.4.186.2:5000/image/uploadImageDoc")
                .addHeaders("Content-Type", "multipart/form-data")
                .addBodyParameter("id", idProcessoTmp)
                .addBodyParameter("imageType", this.tipoImagem.toString())
                .addBodyParameter("fileImageOrigin", imgBase64Original)
                .addBodyParameter("fileImageScanned", imgBase64Scanned)
                .addBodyParameter("x1", Float.toString(this.x1))
                .addBodyParameter("y1", Float.toString(this.y1))
                .addBodyParameter("x2", Float.toString(this.x2))
                .addBodyParameter("y2", Float.toString(this.y2))
                .addBodyParameter("x3", Float.toString(this.x3))
                .addBodyParameter("y3", Float.toString(this.y3))
                .addBodyParameter("x4", Float.toString(this.x4))
                .addBodyParameter("y4", Float.toString(this.y4))

                .addBodyParameter("sx1", Float.toString(this.sx1))
                .addBodyParameter("sy1", Float.toString(this.sy1))
                .addBodyParameter("sx2", Float.toString(this.sx2))
                .addBodyParameter("sy2", Float.toString(this.sy2))
                .addBodyParameter("sx3", Float.toString(this.sx3))
                .addBodyParameter("sy3", Float.toString(this.sy3))
                .addBodyParameter("sx4", Float.toString(this.sx4))
                .addBodyParameter("sy4", Float.toString(this.sy4))
                //.setTag("test")
                //.setPriority(Priority.MEDIUM)
                .build()
                .getAsJSONObject(new JSONObjectRequestListener() {
                    @Override
                    public void onResponse(JSONObject response) {
                        // do anything with response
                        Log.i(TAG, "POST onResponse = " + response.toString() );
                    }
                    @Override
                    public void onError(ANError error) {
                        // handle error
                        Log.i(TAG, "POST ANError = " + error.getMessage() );
                    }
                });
    }

    /**
    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
    }
     */

    @Override
    public void onTrimMemory(int level) {
        switch (level) {
            case ComponentCallbacks2.TRIM_MEMORY_UI_HIDDEN:
                /*
                   Release any UI objects that currently hold memory.

                   The user interface has moved to the background.
                */
                break;
            case ComponentCallbacks2.TRIM_MEMORY_RUNNING_MODERATE:
            case ComponentCallbacks2.TRIM_MEMORY_RUNNING_LOW:
            case ComponentCallbacks2.TRIM_MEMORY_RUNNING_CRITICAL:
                /*
                   Release any memory that your app doesn't need to run.

                   The device is running low on memory while the app is running.
                   The event raised indicates the severity of the memory-related event.
                   If the event is TRIM_MEMORY_RUNNING_CRITICAL, then the system will
                   begin killing background processes.
                */
                break;
            case ComponentCallbacks2.TRIM_MEMORY_BACKGROUND:
            case ComponentCallbacks2.TRIM_MEMORY_MODERATE:
            case ComponentCallbacks2.TRIM_MEMORY_COMPLETE:
                /*
                   Release as much memory as the process can.

                   The app is on the LRU list and the system is running low on memory.
                   The event raised indicates where the app sits within the LRU list.
                   If the event is TRIM_MEMORY_COMPLETE, the process will be one of
                   the first to be terminated.
                */
                new AlertDialog.Builder(this)
                        .setTitle(R.string.low_memory)
                        .setMessage(R.string.low_memory_message)
                        .create()
                        .show();
                break;
            default:
                /*
                  Release any non-critical data structures.

                  The app received an unrecognized memory level value
                  from the system. Treat this as a generic low-memory message.
                */
                break;
        }
    }

    public native Bitmap getScannedBitmap(Bitmap bitmap, float x1, float y1, float x2, float y2, float x3, float y3, float x4, float y4);

    public native Bitmap getGrayBitmap(Bitmap bitmap);

    public native Bitmap getMagicColorBitmap(Bitmap bitmap);

    public native Bitmap getBWBitmap(Bitmap bitmap);

    public native float[] getPoints(Bitmap bitmap);

    static {
        System.loadLibrary("opencv_java3");
        System.loadLibrary("Scanner");
    }
}