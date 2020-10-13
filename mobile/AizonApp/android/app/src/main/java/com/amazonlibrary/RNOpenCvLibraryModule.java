package com.amazonlibrary;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import com.scanlibrary.ScanActivity;
import com.scanlibrary.ScanConstants;

import android.content.Intent;

import android.net.Uri;
import android.util.Base64;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;

public class RNOpenCvLibraryModule extends ReactContextBaseJavaModule {

    private final ReactApplicationContext reactContext;
    private Uri fileUri;

    public RNOpenCvLibraryModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @Override
    public String getName() {
        return "RNOpenCvLibrary";
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
        //ScanActivity sc = new ScanActivity();
        Intent i = new Intent(this.reactContext, ScanActivity.class);
        i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        i.putExtra(ScanConstants.OPEN_INTENT_PREFERENCE, preference);

        this.reactContext.startActivity(i);

        successCallback.invoke("Atividade Criada");
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




}