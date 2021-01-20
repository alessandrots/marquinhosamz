package com.amazonlibrary;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.uimanager.IllegalViewOperationException;
import com.facebook.react.uimanager.PixelUtil;
import com.scanlibrary.PassDataInterface;
import com.scanlibrary.ScanActivity;
import com.scanlibrary.ScanConstants;

import android.app.Activity;
import android.content.Intent;

import android.net.Uri;
import android.os.Bundle;
import android.util.Base64;
import android.util.SparseArray;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;

public class RNOpenCvLibraryModule extends ReactContextBaseJavaModule  implements PassDataInterface, ActivityEventListener {

    private final ReactApplicationContext reactContext;
    private Uri fileUri;
    private final SparseArray<Promise> mPromises;

    private static final String E_LAYOUT_ERROR = "E_LAYOUT_ERROR";

    public RNOpenCvLibraryModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        this.reactContext.addActivityEventListener(this);
        mPromises = new SparseArray<>();
    }

    @Override
    public String getName() {
        return "RNOpenCvLibrary";
    }

    @Override
    public void onCatalystInstanceDestroy() {
        super.onCatalystInstanceDestroy();
        getReactApplicationContext().removeActivityEventListener(this);
    }

    @ReactMethod
    public void callAlessandro(String imageAsBase64, Callback errorCallback, Callback successCallback) {
        System.out.println("RNOpenCvLibrary callAlessandro ... ");
        int REQUEST_CODE = 99;
        int preference = ScanConstants.OPEN_CAMERA;

        //Assim vai para uma outra janela
        //Intent i = new Intent(this.reactContext, ScannerAmzActivity.class);

        /**
         Assim foi direto para a camera
         */
        ScanActivity sc = new ScanActivity(RNOpenCvLibraryModule.this);
        //Intent i = new Intent(this.reactContext, ScanActivity.class);
        Intent i = new Intent(this.reactContext, sc.getClass());
        i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        i.putExtra(ScanConstants.OPEN_INTENT_PREFERENCE, preference);

        //this.reactContext.startActivityForResult(i, 99, new Bundle());
        this.reactContext.startActivity(i);

        successCallback.invoke("Atividade Criada");
        //successCallback.invoke(relativeX, relativeY, width, height);
    }

    @ReactMethod
    public void measureLayout(
            int tag,
            int ancestorTag,
            Promise promise) {
        try {
            int preference = ScanConstants.OPEN_CAMERA;

            //measureLayout(tag, ancestorTag, mMeasureBuffer);
            WritableMap map = Arguments.createMap();

            map.putDouble("relativeX", PixelUtil.toDIPFromPixel(10));
            map.putDouble("relativeY", PixelUtil.toDIPFromPixel(25));
            map.putDouble("width", PixelUtil.toDIPFromPixel(30));
            map.putDouble("height", PixelUtil.toDIPFromPixel(45));

            ScanActivity sc = new ScanActivity(RNOpenCvLibraryModule.this);
            //Intent i = new Intent(this.reactContext, ScanActivity.class);
            Intent i = new Intent(this.reactContext, sc.getClass());
            i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            i.putExtra(ScanConstants.OPEN_INTENT_PREFERENCE, preference);

            //this.reactContext.startActivityForResult(i, 99, new Bundle());
            this.reactContext.startActivity(i);

            promise.resolve(map);
        } catch (IllegalViewOperationException e) {
            promise.reject(E_LAYOUT_ERROR, e);
        }
    }

    @ReactMethod
    public void scanImageForProcess(String idProcesso, int tipoImagem, Promise promise) {
        try {
            int preference = ScanConstants.OPEN_CAMERA;

            ScanActivity sc = new ScanActivity(RNOpenCvLibraryModule.this);
            //Intent i = new Intent(this.reactContext, ScanActivity.class);
            Intent i = new Intent(this.reactContext, sc.getClass());
            i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            i.putExtra(ScanConstants.OPEN_INTENT_PREFERENCE, preference);

            i.putExtra(ScanConstants.CHOICE_CANVAS_ACTIVITY, "true");

            i.putExtra(ScanConstants.ID_PROCESS_SCAN_IMAGE, idProcesso);
            i.putExtra(ScanConstants.IMAGE_TYPE_SCAN_IMAGE, Integer.toString(tipoImagem));

            this.reactContext.startActivity(i);
            promise.resolve(idProcesso);

            sc.startActivityForResult(i, 1);
            mPromises.put(1, promise);

        } catch (Exception e) {
            promise.reject(E_LAYOUT_ERROR, e);
        }
    }

    @ReactMethod
    public void scanImageCameraXCrop(String idProcesso, int tipoImagem, Promise promise) {
        try {
            int preference = ScanConstants.OPEN_CAMERA;

            ScanActivity sc = new ScanActivity(RNOpenCvLibraryModule.this);
            Intent i = new Intent(this.reactContext, sc.getClass());
            i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            i.putExtra(ScanConstants.OPEN_INTENT_PREFERENCE, preference);

            i.putExtra(ScanConstants.CHOICE_CANVAS_ACTIVITY, "false");

            i.putExtra(ScanConstants.ID_PROCESS_SCAN_IMAGE, idProcesso);
            i.putExtra(ScanConstants.IMAGE_TYPE_SCAN_IMAGE, Integer.toString(tipoImagem));

            this.reactContext.startActivity(i);
            promise.resolve(idProcesso);

            sc.startActivityForResult(i, 1);
            mPromises.put(1, promise);

        } catch (Exception e) {
            promise.reject(E_LAYOUT_ERROR, e);
        }
    }

    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
        Promise promise = mPromises.get(requestCode);

        if (promise != null) {
            WritableMap result = new WritableNativeMap();
            result.putInt("resultCode", resultCode);
            result.putMap("data", Arguments.makeNativeMap(data.getExtras()));
            promise.resolve(result);
        }
    }

    private void convertBase64ToImageFile(String imgBase64) {
        // tokenize the data
        String[] parts = imgBase64.split(",");
        String imageString = parts[1];

        String imageDataBytes = imgBase64.substring(imgBase64.indexOf(",")+1);


        InputStream stream = new ByteArrayInputStream(Base64.decode(imageDataBytes.getBytes(), Base64.DEFAULT));

        String timeStamp = new SimpleDateFormat("yyyyMMdd_HHmmss").format(new
                Date());

        File file = new File(ScanConstants.IMAGE_PATH, "IMG_" + timeStamp +
                ".jpg");

        try {
            copyInputStreamToFile(stream, file);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    // InputStream -> File
    private void copyInputStreamToFile(InputStream inputStream, File file)
            throws Exception {

        try (FileOutputStream outputStream = new FileOutputStream(file)) {

            int read;
            byte[] bytes = new byte[1024];

            while ((read = inputStream.read(bytes)) != -1) {
                outputStream.write(bytes, 0, read);
            }

            // commons-io
            //IOUtils.copy(inputStream, outputStream);
        }

    }

    private File createImageFile() {
        clearTempImages();
        String timeStamp = new SimpleDateFormat("yyyyMMdd_HHmmss").format(new
                Date());
        File file = new File(ScanConstants.IMAGE_PATH, "IMG_" + timeStamp +
                ".jpg");
        fileUri = Uri.fromFile(file);
        return file;
    }

    private void clearTempImages() {
        try {
            File tempFolder = new File(ScanConstants.IMAGE_PATH);
            for (File f : tempFolder.listFiles())
                f.delete();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }


    @Override
    public void onDataReceived(String imgBase64Scanned, String imgBase64Original, HashMap mapaPoints) {
        convertBase64ToImageFile(imgBase64Original);
        convertBase64ToImageFile(imgBase64Scanned);

    }

    /**
    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
        if (requestCode == Activity.RESULT_OK) {
            //super.onActivityResult(activity, requestCode, resultCode, data);
            Bundle bundle = data.getExtras();
        }
    }
    */



    @Override
    public void onNewIntent(Intent intent) {
        Bundle bundle = intent.getExtras();
    }
}