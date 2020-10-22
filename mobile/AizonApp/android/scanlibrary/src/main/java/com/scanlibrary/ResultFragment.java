package com.scanlibrary;

import android.app.Activity;
import android.app.Fragment;
import android.app.FragmentManager;
import android.content.Intent;
import android.graphics.Bitmap;
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

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.Serializable;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;

/**
 * Created by jhansi on 29/03/15.
 */
public class ResultFragment extends Fragment {

    private static final String TAG = "ResultFragment";

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

    //Base64 img original
    private String imgBase64Original;

    //Base64 img scanneada
    private String imgBase64Scanned;

    private Bitmap bitmapOriginal;

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
        //uri da imagem original
        Uri uriOriginal = getUriOriginal();

        this.bitmapOriginal = convertUriToBitmap(uriOriginal);

        //Uri da img scanneada
        Uri uri = getUri();

        Bitmap bitmapScanned = convertUriToBitmap(uri); //getBitmap();
        this.imgScanned = bitmapScanned;

        this.mapaPoints = getPoints();

        //Base64 img original
        this.imgBase64Original = encodeImage(bitmapOriginal);

        //Base64 img scanneada
        this.imgBase64Scanned  = encodeImage(bitmapScanned);

        saveImageToDisk(this.imgScanned);

        return bitmapScanned;
    }

    private void saveImageToDisk(Bitmap photo) {
        String timeStamp = new SimpleDateFormat("yyyyMMdd_HHmmss").format(new Date());

        File path = getActivity().getBaseContext().getExternalFilesDir(Environment.DIRECTORY_PICTURES);
        Log.i(TAG, "path = " + path.getPath());

        File file = new File(path,  "IMG_SCANNED_" + timeStamp + ".png");
        Log.i(TAG, "file = " + file.getPath());

        try {
            FileOutputStream outputStream = new FileOutputStream(file);
            photo.compress(Bitmap.CompressFormat.PNG, 100, outputStream);
            MediaStore.Images.Media.insertImage(getActivity().getContentResolver(), file.getAbsolutePath(), file.getName(), file.getName());
            outputStream.flush();
            outputStream.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
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

                        getActivity().setResult(Activity.RESULT_OK, data);

                        ((ScanActivity)getActivity()).getDataFromFragment(resultFragment.imgBase64Scanned, resultFragment.imgBase64Original,  resultFragment.mapaPoints);
                        /**
                         *
                         * SERá q aqui volta com os dados para o ScanActivity
                         * TODO debugar
                         */
                        //imgScanned.recycle();
                        System.gc();
                        getActivity().runOnUiThread(new Runnable() {
                            @Override
                            public void run() {
                                dismissDialog();
                                getActivity().finish();
                            }
                        });
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