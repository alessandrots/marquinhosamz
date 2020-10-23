package com.scanlibrary;

import android.app.Activity;
import android.app.Fragment;
import android.content.Intent;
import android.content.res.AssetFileDescriptor;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.provider.MediaStore;
import androidx.core.content.FileProvider;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageButton;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

/**
 * Created by jhansi on 04/04/15.
 */
public class PickImageFragment extends Fragment {

    private View view;
    private ImageButton cameraButton;
    private ImageButton galleryButton;
    private Uri fileUri;
    private IScanner scanner;
    private String pictureImagePath = "";


    private static final String TAG = "PickImageFragment 2";

    @Override
    public void onAttach(Activity activity) {
        super.onAttach(activity);
        if (!(activity instanceof IScanner)) {
            throw new ClassCastException("Activity must implement IScanner");
        }
        this.scanner = (IScanner) activity;
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        view = inflater.inflate(R.layout.pick_image_fragment, null);
        init();
        return view;
    }

    private void init() {
        cameraButton = (ImageButton) view.findViewById(R.id.cameraButton);
        cameraButton.setOnClickListener(new CameraButtonClickListener());
        galleryButton = (ImageButton) view.findViewById(R.id.selectButton);
        galleryButton.setOnClickListener(new GalleryClickListener());
        if (isIntentPreferenceSet()) {
            handleIntentPreference();
        } else {
            getActivity().finish();
        }
    }



    private void handleIntentPreference() {
        int preference = getIntentPreference();
        if (preference == ScanConstants.OPEN_CAMERA) {
            openCamera();
        } else if (preference == ScanConstants.OPEN_MEDIA) {
            openMediaContent();
        }
    }

    private boolean isIntentPreferenceSet() {
        int preference = getArguments().getInt(ScanConstants.OPEN_INTENT_PREFERENCE, 0);
        return preference != 0;
    }

    private int getIntentPreference() {
        int preference = getArguments().getInt(ScanConstants.OPEN_INTENT_PREFERENCE, 0);
        return preference;
    }


    private class CameraButtonClickListener implements View.OnClickListener {
        @Override
        public void onClick(View v) {
            openCamera();
        }
    }

    private class GalleryClickListener implements View.OnClickListener {
        @Override
        public void onClick(View view) {
            openMediaContent();
        }
    }

    public void openMediaContent() {
        Log.i(TAG, "openMediaContent " );
        Intent intent = new Intent(Intent.ACTION_GET_CONTENT);
        intent.addCategory(Intent.CATEGORY_OPENABLE);
        intent.setType("image/*");
        startActivityForResult(intent, ScanConstants.PICKFILE_REQUEST_CODE);
    }

    public void openCameraNew() {
        Log.i(TAG, "openCamera");
        Intent cameraIntent = new Intent(android.provider.MediaStore.ACTION_IMAGE_CAPTURE);
        startActivityForResult(cameraIntent, ScanConstants.START_CAMERA_REQUEST_CODE);
    }

    public void openCamera() {
        Log.i(TAG, "openCameraOriginal");

        Intent cameraIntent = new Intent(android.provider.MediaStore.ACTION_IMAGE_CAPTURE);
        File file = createImageFile();
        boolean isDirectoryCreated = file.getParentFile().mkdirs();

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
            Uri tempFileUri = FileProvider.getUriForFile(getActivity().getApplicationContext(),
                    "com.scanlibrary.provider", // As defined in Manifest
                    file);
            cameraIntent.putExtra(MediaStore.EXTRA_OUTPUT, tempFileUri);
        } else {
            Uri tempFileUri = Uri.fromFile(file);
            cameraIntent.putExtra(MediaStore.EXTRA_OUTPUT, tempFileUri);
        }
        startActivityForResult(cameraIntent, ScanConstants.START_CAMERA_REQUEST_CODE);
    }

    /**
    public void onActivityResult2(int requestCode, int resultCode, Intent data) {
        Log.i("", "onActivityResult" + resultCode);
        Bitmap bitmap = null;
        //if (resultCode == Activity.RESULT_OK) {
        try {
            switch (requestCode) {
                case ScanConstants.START_CAMERA_REQUEST_CODE:
                    takePhotoCamera(data);
                    //bitmap = getBitmap(fileUri);
                    break;

                case ScanConstants.PICKFILE_REQUEST_CODE:
                    bitmap = getBitmap(data.getData());
                    break;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }


        if (bitmap != null) {
            postImagePick(bitmap);
        }
    }
    */

    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        Log.d("", "onActivityResult" + resultCode);
        Bitmap bitmap = null;
        if (resultCode == Activity.RESULT_OK) {
            try {
                switch (requestCode) {
                    case ScanConstants.START_CAMERA_REQUEST_CODE:
                        bitmap = getBitmap(fileUri);
                        break;

                    case ScanConstants.PICKFILE_REQUEST_CODE:
                        bitmap = getBitmap(data.getData());
                        break;
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        } else {
            getActivity().finish();
        }
        if (bitmap != null) {
            postImagePick(bitmap);
        }
    }

    private File clearTempImages() {
        try {
            File path = getActivity().getBaseContext().getExternalFilesDir(Environment.DIRECTORY_PICTURES);
            File tempFolder = new File(path, "/AizonApp");

            //File tempFolder = new File(ScanConstants.IMAGE_PATH);
            if (!tempFolder.exists()) {
                tempFolder.mkdir();
            }

            for (File f : tempFolder.listFiles()){
                f.delete();
            }

            return tempFolder;
        } catch (Exception e) {
            e.printStackTrace();
        }

        return null;
    }

    private File createImageFile() {
        Locale localeBr = new Locale("pt", "BR");
        String timeStamp = new SimpleDateFormat("yyyyMMdd_HHmmss", localeBr).format(new Date());

        File path = clearTempImages();

        if (path == null) {
            path = getActivity().getBaseContext().getExternalFilesDir(Environment.DIRECTORY_PICTURES);
            Log.i(TAG, "path = " + path.getPath());
        }

        File file = new File(path,  "ORIGINAL_" + timeStamp + ".jpg");

        Log.i(TAG, "file1 = " + file.getPath());

        try {
            FileOutputStream outputStream = new FileOutputStream(file);
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }

        fileUri = Uri.fromFile(file);
        return file;
    }

    public void takePhotoCamera(Intent data) {
        Log.i(TAG, "openCamera");

        Bitmap photo = (Bitmap) data.getExtras().get("data");

        Log.i(TAG, "width = " + photo.getWidth());
        Log.i(TAG, "height = " + photo.getHeight());

        String timeStamp = new SimpleDateFormat("yyyyMMdd_HHmmss").format(new
                Date());
        File file = new File(ScanConstants.IMAGE_PATH, "IMG_" + timeStamp +
                ".jpg");


        File path = getActivity().getBaseContext().getExternalFilesDir(Environment.DIRECTORY_PICTURES);
        Log.i(TAG, "path = " + path.getPath());
        File file1 = new File(path,  "IMG_" + timeStamp + ".jpg");

        Log.i(TAG, "file1 = " + file1.getPath());

        try (FileOutputStream out = new FileOutputStream(file1)) {
            photo.compress(Bitmap.CompressFormat.PNG, 100, out); // bmp is your Bitmap instance
            // PNG is a lossless format, the compression factor (100) is ignored
        } catch (IOException e) {
            e.printStackTrace();
        }

        postImagePick(photo);
    }

    protected void postImagePick(Bitmap bitmap) {
        Uri uri = Utils.getUri(getActivity(), bitmap);

        if (bitmap != null && !bitmap.isRecycled()) {
            bitmap.recycle();
            bitmap = null;
        }

        scanner.onBitmapSelect(uri);
    }

    private Bitmap getBitmap(Uri selectedimg) throws IOException {
        BitmapFactory.Options options = new BitmapFactory.Options();
        options.inSampleSize = 3;

        Bitmap bitmap = MediaStore.Images.Media.getBitmap(getActivity().getContentResolver(), selectedimg);
        /**
         AssetFileDescriptor fileDescriptor = null;
         fileDescriptor =
         getActivity().getContentResolver().openAssetFileDescriptor(selectedimg, "r");
         Bitmap original
         = BitmapFactory.decodeFileDescriptor(
         fileDescriptor.getFileDescriptor(), null, options);
         */
        return bitmap;
    }
}