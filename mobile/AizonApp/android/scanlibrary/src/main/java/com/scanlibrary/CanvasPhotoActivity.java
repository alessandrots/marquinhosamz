package com.scanlibrary;

import android.Manifest;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.Point;
import android.graphics.Rect;
import android.net.Uri;
import android.os.Bundle;
import android.os.Environment;
import android.provider.MediaStore;
import android.util.Log;
import android.util.SparseIntArray;
import android.view.Surface;
import android.view.View;
import android.widget.ImageButton;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import com.jakewharton.rxbinding2.view.RxView;
import com.tbruyelle.rxpermissions2.RxPermissions;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

import top.defaults.camera.CameraView;
import top.defaults.camera.CanvasDrawer;
import top.defaults.camera.Photographer;
import top.defaults.camera.PhotographerFactory;
import top.defaults.camera.PhotographerHelper;
import top.defaults.camera.SimpleOnEventListener;

public class CanvasPhotoActivity extends AppCompatActivity {
    /**
     * 0) Mudar sdk version (build.gradle do app) :
     *         minSdkVersion 27
     *         targetSdkVersion 27
     * 1) Pra buildar, depois de ter feito todo o processo de
     * 2) Importar new module (file => import new module)
     * 3) Adicionar o módulo como dependência (file => Project Structure)
     * 4) colocar os classpaths no build.gradle (root)
     *      classpath 'com.android.tools.build:gradle:3.0.1'
     *      classpath 'com.jfrog.bintray.gradle:gradle-bintray-plugin:1.7.3'
     *      classpath 'com.github.dcendents:android-maven-gradle-plugin:1.5'
     *  5) File => Project Structure
     *     Em Module colocar a Source e Target Compatibility para java 1.8
     *
     *
     */

    private static final String TAG = "AizonApp_CameraApi";

    public static final String MEDIA_DIR = Environment.getExternalStorageDirectory().getPath() + "/0/amazon/CameraAppCanvas";

    private static final SparseIntArray ORIENTATIONS = new SparseIntArray();
    private Uri fileUri;
    private IScanner scanner;
    private String pictureImagePath = "";
    private String idProcesso;
    private String tipoImagem;


    static {
        ORIENTATIONS.append(Surface.ROTATION_0, 90);
        ORIENTATIONS.append(Surface.ROTATION_90, 0);
        ORIENTATIONS.append(Surface.ROTATION_180, 270);
        ORIENTATIONS.append(Surface.ROTATION_270, 180);
    }

    private static final int REQUEST_CAMERA_PERMISSION = 200;

    private Photographer photographer;
    private PhotographerHelper photographerHelper;

    private CameraView preview;

    private ImageButton actionButton;
    private ImageButton closeButton;
    private Rect rectangleImage;

    private File fileImageOrigin;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        setContentView(R.layout.canvas_fragment);

        preview = findViewById(R.id.preview);

        actionButton = findViewById(R.id.action);

        closeButton = findViewById(R.id.flip);

        //scanner = ((IScanner)this.getParent());

        actionButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (photographer !=  null) {
                    fileImageOrigin = createImageFile();

                    photographer.takePictureWithPath(fileImageOrigin.getPath());

                    Toast.makeText(getApplicationContext(),"Foto tirada. Feche a Janela!", Toast.LENGTH_LONG).show();
                } else {
                    Toast.makeText(getApplicationContext(),"takePicture is Clicked", Toast.LENGTH_LONG).show();
                }
            }
        });

        closeButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                /**
                 * TENTAR FAZER A CHAMADA :
                 * INTENT
                 * SETRESULT
                 * FINISH
                 */
                 Intent data = new Intent();
                 data.putExtra(ScanConstants.FILE_IMAGE_PHOTO_PATH_ABSOLUTE, fileImageOrigin.getPath());

                Uri fileUri = Uri.fromFile(fileImageOrigin);

                try {
                    Bitmap bitmap = Utils.getBitmap(getBaseContext(), fileUri);
                    Bitmap bitmapCrop = Bitmap.createBitmap(bitmap, 0, 0, rectangleImage.width(), rectangleImage.height());

                    if (bitmapCrop != null) {
                        createImageCropFile(bitmapCrop);
                    }

                    Uri uri = Utils.getUri(getBaseContext(), bitmap);
                } catch (IOException e) {
                    e.printStackTrace();
                }

                //activityContext.
                setResult(RESULT_OK, data);
                finish();
                 //activityContext.finish();

            }
        });



        preview.setFocusIndicatorDrawer(new CanvasDrawer() {
            private static final int SIZE = 300;
            private static final int LINE_LENGTH = 300;

            @Override
            public Paint[] initPaints() {
                Paint focusPaint = new Paint(Paint.ANTI_ALIAS_FLAG);
                focusPaint.setStyle(Paint.Style.STROKE);
                focusPaint.setStrokeWidth(4);
                focusPaint.setColor(Color.BLUE);
                return new Paint[]{ focusPaint };
            }

            @Override
            public void draw(Canvas canvas, Point point, Paint[] paints) {
                if (paints == null || paints.length == 0) return;

                int left = point.x - (SIZE / 2);
                int top = point.y - (SIZE / 2);
                int right = point.x + (SIZE / 2);
                int bottom = point.y + (SIZE / 2);

                Paint paint = paints[0];

                /*
                canvas.drawLine(left, top + LINE_LENGTH, left, top, paint);
                canvas.drawLine(left, top, left + LINE_LENGTH, top, paint);

                canvas.drawLine(right - LINE_LENGTH, top, right, top, paint);
                canvas.drawLine(right, top, right, top + LINE_LENGTH, paint);

                canvas.drawLine(right, bottom - LINE_LENGTH, right, bottom, paint);
                canvas.drawLine(right, bottom, right - LINE_LENGTH, bottom, paint);

                canvas.drawLine(left + LINE_LENGTH, bottom, left, bottom, paint);
                canvas.drawLine(left, bottom, left, bottom - LINE_LENGTH, paint);
                *
                 */
                rectangleImage = new Rect(100, 75, 600, 700);
                canvas.drawRect(100, 75, 600, 700, paint);
            }
        });

        RxPermissions rxPermissions = new RxPermissions(this);

        RxView.attaches(preview)
                .compose(rxPermissions.ensure(Manifest.permission.CAMERA,
                        Manifest.permission.RECORD_AUDIO,
                        Manifest.permission.WRITE_EXTERNAL_STORAGE))
                .subscribe(granted -> {
                    if (granted) {
                        Log.i(TAG, "GRANTED...");
                        //startVideoRecordActivity();
                    } else {
                        Log.i(TAG, "NOT GRANTED...");
                        //Snackbar.make(prepareToRecord, getString(R.string.no_enough_permission), Snackbar.LENGTH_SHORT).setAction("Confirm", null).show();
                    }
                });

        photographer = PhotographerFactory.createPhotographerWithCamera2(this, preview);
        photographerHelper = new PhotographerHelper(photographer);
        photographerHelper.setFileDir(MEDIA_DIR);

        photographer.setOnEventListener(new SimpleOnEventListener() {
            @Override
            public void onDeviceConfigured() {

                actionButton.setImageResource(R.drawable.ic_camera);
                actionButton.setEnabled(true);
                actionButton.setVisibility(View.VISIBLE);
            }

            /**
             @Override
             public void onZoomChanged(float zoom) {
             zoomValueTextView.setText(String.format(Locale.getDefault(), "%.1fX", zoom));
             }

             @Override
             public void onStartRecording() {
             switchButton.setVisibility(View.INVISIBLE);
             flipButton.setVisibility(View.INVISIBLE);
             actionButton.setEnabled(true);
             actionButton.setImageResource(R.drawable.stop);
             statusTextView.setVisibility(View.VISIBLE);
             }

             @Override
             public void onFinishRecording(String filePath) {
             announcingNewFile(filePath);
             }

             @Override
             public void onShotFinished(String filePath) {
             announcingNewFile(filePath);
             }

             @Override
             public void onError(Error error) {
             Timber.e("Error happens: %s", error.getMessage());
             }

             */
        });

        init();
    }

    private void init() {
        //cameraButton = (ImageButton) view.findViewById(R.id.cameraButton);
        //cameraButton.setOnClickListener(new CameraButtonClickListener());
        //galleryButton = (ImageButton) view.findViewById(R.id.selectButton);
        //galleryButton.setOnClickListener(new GalleryClickListener());

        idProcesso = getIntent().getStringExtra(ScanConstants.ID_PROCESS_SCAN_IMAGE);
        tipoImagem = getIntent().getStringExtra(ScanConstants.IMAGE_TYPE_SCAN_IMAGE);

        /**
        if (isIntentPreferenceSet()) {
            handleIntentPreference();
        } else {
            getActivity().finish();
        }*/
    }

    @Override
    protected void attachBaseContext(Context newBase) {
        super.attachBaseContext(newBase);

        /**
         *
         * if (!(newBase instanceof IScanner)) {
         *             throw new ClassCastException("Activity must implement IScanner");
         *         }
         *         this.scanner = (IScanner) newBase;
         */

    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);

        if (requestCode == REQUEST_CAMERA_PERMISSION) {
            if (grantResults[0] == PackageManager.PERMISSION_DENIED) {
                // close the app
                Toast.makeText(CanvasPhotoActivity.this, "Sorry!!!, you can't use this app without granting permission", Toast.LENGTH_LONG).show();
                finish();
            }
        }
    }

    //@OnClick(R.id.switch_mode)
    void switchMode() {
        photographerHelper.switchMode();
    }

    @Override
    protected void onResume() {
        super.onResume();
        enterFullscreen();
        photographer.startPreview();
    }

    @Override
    protected void onPause() {
        photographer.stopPreview();
        super.onPause();
    }

    private void enterFullscreen() {
        View decorView = getWindow().getDecorView();
        decorView.setBackgroundColor(Color.BLACK);
        int uiOptions = View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                | View.SYSTEM_UI_FLAG_FULLSCREEN
                | View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY;
        decorView.setSystemUiVisibility(uiOptions);
    }

    /**
    @Override
    public void onAttach(Activity activity) {
        super.onAttach(activity);
        if (!(activity instanceof IScanner)) {
            throw new ClassCastException("Activity must implement IScanner");
        }
        this.scanner = (IScanner) activity;
    }
    */


    private File clearTempImages() {
        File tempFolder = null;

        try {
            //File path = getActivity().getBaseContext().getExternalFilesDir(Environment.DIRECTORY_PICTURES);
            File path = this.getBaseContext().getExternalFilesDir(Environment.DIRECTORY_PICTURES);

            tempFolder = new File(path, "/AizonApp");

            if (!tempFolder.exists()) {
                tempFolder.mkdir();
            }

            tempFolder = new File(tempFolder.getAbsoluteFile(), "/" + this.idProcesso + "/" + this.tipoImagem);

            if (!tempFolder.exists()) {
                tempFolder.mkdirs();
            }

            //for (File f : tempFolder.listFiles()){
            //f.delete();
            //}

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
            //path = getActivity().getBaseContext().getExternalFilesDir(Environment.DIRECTORY_PICTURES);
            path = this.getBaseContext().getExternalFilesDir(Environment.DIRECTORY_PICTURES);
            Log.i(TAG, "path = " + path.getPath());
        }

        //File fileImageOrigin = new File(path,  "ORIGINAL_" + timeStamp + ".jpg");
        File fileImageOrigin = new File(path,  "ORIGINAL" + ".jpg");

        Log.i(TAG, "file1 = " + fileImageOrigin.getPath());
        this.pictureImagePath = fileImageOrigin.getAbsolutePath();

        try {
            FileOutputStream outputStream = new FileOutputStream(fileImageOrigin);
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }

        fileUri = Uri.fromFile(fileImageOrigin);

        return fileImageOrigin;
    }

    private File createImageCropFile(Bitmap bmp) {
        File path = this.getBaseContext().getExternalFilesDir(Environment.DIRECTORY_PICTURES);
        Log.i(TAG, "path = " + path.getPath());

        File fileImageOrigin = new File(path,  "CROP" + ".jpg");

        Log.i(TAG, "file1 = " + fileImageOrigin.getPath());
        this.pictureImagePath = fileImageOrigin.getAbsolutePath();

        try {
            FileOutputStream outputStream = new FileOutputStream(fileImageOrigin);
            bmp.compress(Bitmap.CompressFormat.PNG, 100, outputStream); // bmp is your Bitmap instance
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }

        fileUri = Uri.fromFile(fileImageOrigin);

        return fileImageOrigin;
    }

    protected void postImagePick(Bitmap bitmap) {
        //Uri uri = Utils.getUri(getActivity(), bitmap);
        Uri uri = Utils.getUri(this, bitmap);

        if (bitmap != null && !bitmap.isRecycled()) {
            bitmap.recycle();
            bitmap = null;
        }

        //scanner.onBitmapSelect(uri, this.pictureImagePath);
        //((IScanner)this.getParent()).onBitmapSelect(uri, this.pictureImagePath);
    }

    private Bitmap getBitmap(Uri selectedimg) throws IOException {
        BitmapFactory.Options options = new BitmapFactory.Options();
        options.inSampleSize = 3;

        //Bitmap bitmap = MediaStore.Images.Media.getBitmap(getActivity().getContentResolver(), selectedimg);
        Bitmap bitmap = MediaStore.Images.Media.getBitmap(this.getContentResolver(), selectedimg);


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
