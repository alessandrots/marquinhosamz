package com.scanlibrary;

import android.app.Activity;
import android.app.Fragment;
import android.app.FragmentManager;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.PointF;
import android.net.Uri;
import android.os.AsyncTask;
import android.os.Bundle;
import android.os.Environment;
import android.provider.MediaStore;
import android.util.Base64;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageView;

import com.androidnetworking.AndroidNetworking;
import com.androidnetworking.error.ANError;
import com.androidnetworking.interfaces.JSONObjectRequestListener;
import com.androidnetworking.interfaces.UploadProgressListener;
import com.androidnetworking.model.MultipartFileBody;

import org.json.JSONObject;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.Serializable;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Locale;
import java.util.Set;

/**
 * Created by jhansi on 29/03/15.
 */
public class ResultFragment extends Fragment {

    private static final String TAG = "AIZONApp_ResultFragment";

    private View view;
    private ImageView scannedImageView;
    private Button doneButton;
    private Bitmap imgScanned;
    private Button originalButton;
    private Button MagicColorButton;
    private Button grayModeButton;
    private Button bwButton;
    private Bitmap transformed;
    private static ProgressDialogFragment progressDialogFragment;

    private HashMap mapaPoints;

    private HashMap mapaPointsScanned;

    //Base64 img original
    private String imgBase64Original;

    //Base64 img scanneada
    private String imgBase64Scanned;

    private Bitmap bitmapOriginal;

    private String idProcesso;

    private Integer tipoImagem;

    private String pictureImageScannedPath;

    private String pictureImageOriginPath;

    public ResultFragment() {
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        view = inflater.inflate(R.layout.result_layout, null);
        init();
        return view;
    }

    private void init() {
        scannedImageView = (ImageView) view.findViewById(R.id.scannedImage);
        originalButton = (Button) view.findViewById(R.id.original);
        originalButton.setOnClickListener(new OriginalButtonClickListener());
        MagicColorButton = (Button) view.findViewById(R.id.magicColor);
        MagicColorButton.setOnClickListener(new MagicColorButtonClickListener());
        grayModeButton = (Button) view.findViewById(R.id.grayMode);
        grayModeButton.setOnClickListener(new GrayButtonClickListener());
        bwButton = (Button) view.findViewById(R.id.BWMode);
        bwButton.setOnClickListener(new BWButtonClickListener());

        idProcesso = getArguments().getString(ScanConstants.ID_PROCESS_SCAN_IMAGE);
        tipoImagem = getArguments().getInt(ScanConstants.IMAGE_TYPE_SCAN_IMAGE);

        Bitmap bitmapScanned = generateBitmpasBase64();

        setScannedImage(bitmapScanned);

        doneButton = (Button) view.findViewById(R.id.doneButton);
        doneButton.setOnClickListener(new DoneButtonClickListener(this));
    }

    private Bitmap getBitmap() {
        Uri uri = getUri();

        try {
            imgScanned = Utils.getBitmap(getActivity(), uri);
            getActivity().getContentResolver().delete(uri, null, null);
            return imgScanned;
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }

    private Bitmap convertUriToBitmap(Uri uri) {
        Bitmap bitmap = null;

        try {
            bitmap = Utils.getBitmap(getActivity(), uri);
            getActivity().getContentResolver().delete(uri, null, null);
        } catch (IOException e) {
            e.printStackTrace();
        }

        return bitmap;
    }

    private Bitmap generateBitmpasBase64() {

        //Mapa de Points (x,y)
        this.mapaPoints = getPoints();

        //Mapa de Points (x,y)
        this.mapaPointsScanned = getPointsScanned();

        this.pictureImageOriginPath = getImageOriginImage();

        //Uri da img scanneada
        Uri uri = getUri();
        Bitmap bitmapScanned = convertUriToBitmap(uri); //getBitmap();
        this.imgScanned = bitmapScanned;
        //Base64 img scanneada
        this.imgBase64Scanned  = encodeImage(bitmapScanned);
        //Salvando a imagem scanneada
        saveImageToDisk(this.imgScanned);

        //uri da imagem original
        Uri uriOriginal = getUriOriginal();
        this.bitmapOriginal = convertUriToBitmap(uriOriginal);
        //Base64 img original
        this.imgBase64Original = encodeImage(bitmapOriginal);

        return bitmapScanned;
    }

    private Uri getUri() {
        Uri uri = getArguments().getParcelable(ScanConstants.SCANNED_RESULT);
        return uri;
    }

    private Uri getUriOriginal() {
        Uri uri = getArguments().getParcelable(ScanConstants.ORIGINAL_IMG_URI);
        return uri;
    }

    private HashMap getPoints() {
        Serializable ser = getArguments().getSerializable(ScanConstants.POINTS_MARKED_ORIGINAL_IMG);
        HashMap mapaPoints = (HashMap)ser;
        return mapaPoints;
    }

    private HashMap getPointsScanned() {
        Serializable ser = getArguments().getSerializable(ScanConstants.POINTS_SCANNED_IMG);
        HashMap mapaPoints = (HashMap)ser;
        return mapaPoints;
    }

    private String getImageOriginImage() {
        String imgPath = getArguments().getString(ScanConstants.PATH_ABSOLUTE_IMAGE_ORIGIN);
        return imgPath;
    }

    private void saveImageToDisk(Bitmap photo) {
        Locale localeBr = new Locale("pt", "BR");
        String timeStamp = new SimpleDateFormat("yyyyMMdd_HHmmss", localeBr).format(new Date());

        File path = getActivity().getBaseContext().getExternalFilesDir(Environment.DIRECTORY_PICTURES);
        File tempFolder = new File(path, "/AizonApp");
        Log.d(TAG, "tempFolder = " + tempFolder.getPath());

        tempFolder = new File(tempFolder.getAbsoluteFile(), "/" + this.idProcesso + "/" + this.tipoImagem);

        if (!tempFolder.exists()) {
            tempFolder.mkdirs();
        }

        File filePathImgScanned = new File(tempFolder,  "SCANNED_" + timeStamp + ".jpg");
        Log.d(TAG, "filepath = " + filePathImgScanned.getPath());

        this.pictureImageScannedPath = filePathImgScanned.getAbsolutePath();

        try {
            FileOutputStream outputStream = new FileOutputStream(filePathImgScanned);
            photo.compress(Bitmap.CompressFormat.PNG, 100, outputStream);
            MediaStore.Images.Media.insertImage(getActivity().getContentResolver(), filePathImgScanned.getAbsolutePath(), filePathImgScanned.getName(), filePathImgScanned.getName());
            outputStream.flush();
            outputStream.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    /***
     *
     * Gerar a img base 64
     */
    private String encodeImage(Bitmap bm)
    {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        bm.compress(Bitmap.CompressFormat.JPEG,100,baos);
        byte[] b = baos.toByteArray();
        String encImage = Base64.encodeToString(b, Base64.DEFAULT);

        return encImage;
    }

    public void setScannedImage(Bitmap scannedImage) {
        scannedImageView.setImageBitmap(scannedImage);
    }

    private class DoneButtonClickListener implements View.OnClickListener {
        private ResultFragment resultFragment;

        public DoneButtonClickListener(ResultFragment fragment) {
            this.resultFragment = fragment;
        }

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


        protected void getDataFromFragment2( String idProcesso_, String imgBase64Scanned, String imgBase64Original, HashMap mapaPoints, HashMap mapaPointsScanned) {
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
        }

        public void sendImageToProcess(String imgBase64Scanned, String imgBase64Original) {
            String idProcessoTmp = "100020AB";

            if (idProcesso != null) {
                idProcessoTmp = idProcesso;
            }

            Log.d(TAG, "sendImageToProcess " );
            Log.d(TAG, "id  = " + idProcessoTmp);
            Log.d(TAG, "imageType  = " + tipoImagem.toString());
            //Log.d(TAG, "fileImageOrigin  = " +imgBase64Original);
            //Log.d(TAG, "fileImageScanned  = " +imgBase64Scanned);
            Log.d(TAG, "x1  = " +this.x1);
            Log.d(TAG, "y1  = " +this.y1);
            Log.d(TAG, "x2  = " +this.x2);
            Log.d(TAG, "y2  = " +this.y2);
            Log.d(TAG, "x3  = " +this.x3);
            Log.d(TAG, "y3  = " +this.y3);
            Log.d(TAG, "x4  = " +this.x4);
            Log.d(TAG, "y4  = " +this.y4);
            Log.d(TAG, "sx1  = " +this.x1);
            Log.d(TAG, "sy1  = " +this.y1);
            Log.d(TAG, "sx2  = " +this.x2);
            Log.d(TAG, "sy2  = " +this.y2);
            Log.d(TAG, "sx3  = " +this.x3);
            Log.d(TAG, "sy3  = " +this.y3);
            Log.d(TAG, "sx4  = " +this.x4);
            Log.d(TAG, "sy4  = " +this.y4);

            File fileImagScanned = new File(pictureImageScannedPath);
            File fileImageOrigin = new File(pictureImageOriginPath);

            //https://stackoverflow.com/questions/4007969/application-x-www-form-urlencoded-or-multipart-form-data

            AndroidNetworking.upload("http://45.4.186.2:5000/image/uploadImageDoc")
                    //.addHeaders("Content-Type", "multipart/mixed")
                    .addMultipartParameter("id", idProcessoTmp)
                    .addMultipartParameter("imageType", tipoImagem.toString())

                    .addMultipartFile("fileImageOrigin", fileImageOrigin)
                    .addMultipartFile("fileImageScanned", fileImagScanned)

                    .addMultipartParameter("x1", Float.toString(this.x1))
                    .addMultipartParameter("y1", Float.toString(this.y1))
                    .addMultipartParameter("x2", Float.toString(this.x2))
                    .addMultipartParameter("y2", Float.toString(this.y2))
                    .addMultipartParameter("x3", Float.toString(this.x3))
                    .addMultipartParameter("y3", Float.toString(this.y3))
                    .addMultipartParameter("x4", Float.toString(this.x4))
                    .addMultipartParameter("y4", Float.toString(this.y4))

                    .addMultipartParameter("sx1", Float.toString(this.sx1))
                    .addMultipartParameter("sy1", Float.toString(this.sy1))
                    .addMultipartParameter("sx2", Float.toString(this.sx2))
                    .addMultipartParameter("sy2", Float.toString(this.sy2))
                    .addMultipartParameter("sx3", Float.toString(this.sx3))
                    .addMultipartParameter("sy3", Float.toString(this.sy3))
                    .addMultipartParameter("sx4", Float.toString(this.sx4))
                    .addMultipartParameter("sy4", Float.toString(this.sy4))
                    .build()
                    .setUploadProgressListener(new UploadProgressListener() {
                        @Override
                        public void onProgress(long bytesUploaded, long totalBytes) {
                            // do anything with progress
                        }
                    })
                    .getAsJSONObject(new JSONObjectRequestListener() {
                        @Override
                        public void onResponse(JSONObject response) {
                            // do anything with response
                            Log.d(TAG, "upload onResponse = " + response.toString() );
                            finishAll();
                        }
                        @Override
                        public void onError(ANError error) {
                            // handle error
                            Log.d(TAG, "upload ANError = " + error.getMessage() );
                            finishAll();
                        }
                    });
        }

        private void finishAll() {
            System.gc();
            getActivity().runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    dismissDialog();
                    getActivity().finish();
                }
            });
        }

        @Override
        public void onClick(View v) {
            showProgressDialog(getResources().getString(R.string.loading));
            AsyncTask.execute(new Runnable() {
                @Override
                public void run() {
                    try {
                        Intent data = new Intent();
                        Bitmap bitmap = transformed;
                        if (bitmap == null) {
                            bitmap = imgScanned;
                        }
                        Uri uri = Utils.getUri(getActivity(), bitmap);

                        data.putExtra(ScanConstants.SCANNED_RESULT, uri);

                        data.putExtra(ScanConstants.SCANNED_IMG_BASE64, resultFragment.imgBase64Scanned);
                        data.putExtra(ScanConstants.ORIGINAL_IMG_BASE64, resultFragment.imgBase64Original);
                        data.putExtra(ScanConstants.ARRAY_COORDENADAS_Img, resultFragment.mapaPoints);

                        if (bitmap != null && !bitmap.isRecycled()) {
                            bitmap.recycle();
                            bitmap = null;
                        }

                        if (bitmapOriginal != null && !bitmapOriginal.isRecycled()) {
                            bitmapOriginal.recycle();
                            bitmapOriginal = null;
                        }

                        if (imgScanned != null && !imgScanned.isRecycled()) {
                            imgScanned.recycle();
                            imgScanned = null;
                        }

                        //getActivity().setResult(Activity.RESULT_OK, data);

                        //((ScanActivity)getActivity()).getDataFromFragment(resultFragment.imgBase64Scanned, resultFragment.imgBase64Original,  resultFragment.mapaPoints);

                        getDataFromFragment2(idProcesso, resultFragment.imgBase64Scanned, resultFragment.imgBase64Original,  resultFragment.mapaPoints, resultFragment.mapaPointsScanned);

                        /**
                        System.gc();
                        getActivity().runOnUiThread(new Runnable() {
                            @Override
                            public void run() {
                                dismissDialog();
                                getActivity().finish();
                            }
                        });
                         */
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            });
        }
    }

    private class BWButtonClickListener implements View.OnClickListener {
        @Override
        public void onClick(final View v) {
            showProgressDialog(getResources().getString(R.string.applying_filter));
            AsyncTask.execute(new Runnable() {
                @Override
                public void run() {
                    try {
                        transformed = ((ScanActivity) getActivity()).getBWBitmap(imgScanned);
                    } catch (final OutOfMemoryError e) {
                        getActivity().runOnUiThread(new Runnable() {
                            @Override
                            public void run() {
                                transformed = imgScanned;
                                scannedImageView.setImageBitmap(imgScanned);
                                e.printStackTrace();
                                dismissDialog();
                                onClick(v);
                            }
                        });
                    }
                    getActivity().runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            scannedImageView.setImageBitmap(transformed);
                            dismissDialog();
                        }
                    });
                }
            });
        }
    }

    private class MagicColorButtonClickListener implements View.OnClickListener {
        @Override
        public void onClick(final View v) {
            showProgressDialog(getResources().getString(R.string.applying_filter));
            AsyncTask.execute(new Runnable() {
                @Override
                public void run() {
                    try {
                        transformed = ((ScanActivity) getActivity()).getMagicColorBitmap(imgScanned);
                    } catch (final OutOfMemoryError e) {
                        getActivity().runOnUiThread(new Runnable() {
                            @Override
                            public void run() {
                                transformed = imgScanned;
                                scannedImageView.setImageBitmap(imgScanned);
                                e.printStackTrace();
                                dismissDialog();
                                onClick(v);
                            }
                        });
                    }
                    getActivity().runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            scannedImageView.setImageBitmap(transformed);
                            dismissDialog();
                        }
                    });
                }
            });
        }
    }

    private class OriginalButtonClickListener implements View.OnClickListener {
        @Override
        public void onClick(View v) {
            try {
                showProgressDialog(getResources().getString(R.string.applying_filter));
                transformed = imgScanned;
                scannedImageView.setImageBitmap(imgScanned);
                dismissDialog();
            } catch (OutOfMemoryError e) {
                e.printStackTrace();
                dismissDialog();
            }
        }
    }

    private class GrayButtonClickListener implements View.OnClickListener {
        @Override
        public void onClick(final View v) {
            showProgressDialog(getResources().getString(R.string.applying_filter));
            AsyncTask.execute(new Runnable() {
                @Override
                public void run() {
                    try {
                        transformed = ((ScanActivity) getActivity()).getGrayBitmap(imgScanned);
                    } catch (final OutOfMemoryError e) {
                        getActivity().runOnUiThread(new Runnable() {
                            @Override
                            public void run() {
                                transformed = imgScanned;
                                scannedImageView.setImageBitmap(imgScanned);
                                e.printStackTrace();
                                dismissDialog();
                                onClick(v);
                            }
                        });
                    }
                    getActivity().runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            scannedImageView.setImageBitmap(transformed);
                            dismissDialog();
                        }
                    });
                }
            });
        }
    }

    protected synchronized void showProgressDialog(String message) {
        if (progressDialogFragment != null && progressDialogFragment.isVisible()) {
            // Before creating another loading dialog, close all opened loading dialogs (if any)
            progressDialogFragment.dismissAllowingStateLoss();
        }
        progressDialogFragment = null;
        progressDialogFragment = new ProgressDialogFragment(message);
        FragmentManager fm = getFragmentManager();
        progressDialogFragment.show(fm, ProgressDialogFragment.class.toString());
    }

    protected synchronized void dismissDialog() {
        progressDialogFragment.dismissAllowingStateLoss();
    }
}