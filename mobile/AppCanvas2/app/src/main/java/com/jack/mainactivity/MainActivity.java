package com.jack.mainactivity;

import android.Manifest;
import android.content.Context;
import android.content.pm.PackageManager;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.ImageFormat;
import android.graphics.Paint;
import android.graphics.Point;
import android.graphics.SurfaceTexture;
import android.hardware.camera2.CameraAccessException;
import android.hardware.camera2.CameraCaptureSession;
import android.hardware.camera2.CameraCharacteristics;
import android.hardware.camera2.CameraDevice;
import android.hardware.camera2.CameraManager;
import android.hardware.camera2.CameraMetadata;
import android.hardware.camera2.CaptureRequest;
import android.hardware.camera2.TotalCaptureResult;
import android.hardware.camera2.params.StreamConfigurationMap;
import android.media.Image;
import android.media.ImageReader;
import android.os.Bundle;
import android.os.Environment;
import android.os.Handler;
import android.os.HandlerThread;
import android.support.annotation.NonNull;
import android.support.v4.app.ActivityCompat;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.util.Size;
import android.util.SparseIntArray;
import android.view.Surface;
import android.view.TextureView;
import android.view.View;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.Toast;

import com.jakewharton.rxbinding2.view.RxView;
import com.tbruyelle.rxpermissions2.RxPermissions;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.nio.ByteBuffer;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Locale;

import butterknife.BindView;
import butterknife.OnClick;
import top.defaults.camera.CameraView;
import top.defaults.camera.CanvasDrawer;
import top.defaults.camera.Error;
import top.defaults.camera.Photographer;
import top.defaults.camera.PhotographerFactory;
import top.defaults.camera.PhotographerHelper;
import top.defaults.camera.SimpleOnEventListener;
import top.defaults.camera.Utils;
import top.defaults.camera.Values;
import top.defaults.view.TextButton;

public class MainActivity extends AppCompatActivity {
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

    private static final String TAG = "AndroidCameraApi";

    public static final String MEDIA_DIR = Environment.getExternalStorageDirectory().getPath() + "/0/amazon/CameraAppCanvas";

    private Button takePictureButton;
    private TextureView textureView;
    private static final SparseIntArray ORIENTATIONS = new SparseIntArray();

    static {
        ORIENTATIONS.append(Surface.ROTATION_0, 90);
        ORIENTATIONS.append(Surface.ROTATION_90, 0);
        ORIENTATIONS.append(Surface.ROTATION_180, 270);
        ORIENTATIONS.append(Surface.ROTATION_270, 180);
    }

    private String cameraId;
    protected CameraDevice cameraDevice;
    protected CameraCaptureSession cameraCaptureSessions;
    protected CaptureRequest captureRequest;
    protected CaptureRequest.Builder captureRequestBuilder;
    private Size imageDimension;
    private ImageReader imageReader;
    private File file;
    private static final int REQUEST_CAMERA_PERMISSION = 200;
    private boolean mFlashSupported;
    private Handler mBackgroundHandler;
    private HandlerThread mBackgroundThread;

    private Photographer photographer;
    private PhotographerHelper photographerHelper;

    private CameraView preview;

    //private TextButton switchButton;
    //@BindView(R.id.switch_mode)
    //TextButton switchButton;

    @BindView(R.id.action)
    ImageButton actionButton;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        setContentView(R.layout.activity_main);

        preview = findViewById(R.id.preview);

        //switchButton = findViewById(R.id.switch_mode);

        actionButton = findViewById(R.id.action);

        actionButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (photographer !=  null) {
                    photographer.takePicture();
                } else {
                    Toast.makeText(getApplicationContext(),"takePicture is Clicked", Toast.LENGTH_LONG).show();
                }

            }
        });

        /** */
        preview.setFocusIndicatorDrawer(new CanvasDrawer() {
            private static final int SIZE = 300;
            private static final int LINE_LENGTH = 50;

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

                canvas.drawLine(left, top + LINE_LENGTH, left, top, paint);
                canvas.drawLine(left, top, left + LINE_LENGTH, top, paint);

                canvas.drawLine(right - LINE_LENGTH, top, right, top, paint);
                canvas.drawLine(right, top, right, top + LINE_LENGTH, paint);

                canvas.drawLine(right, bottom - LINE_LENGTH, right, bottom, paint);
                canvas.drawLine(right, bottom, right - LINE_LENGTH, bottom, paint);

                canvas.drawLine(left + LINE_LENGTH, bottom, left, bottom, paint);
                canvas.drawLine(left, bottom, left, bottom - LINE_LENGTH, paint);
            }
        });

        RxPermissions rxPermissions = new RxPermissions(this);

        RxView.attaches(preview)
                .compose(rxPermissions.ensure(Manifest.permission.CAMERA,
                        Manifest.permission.RECORD_AUDIO,
                        Manifest.permission.WRITE_EXTERNAL_STORAGE))
                .subscribe(granted -> {
                    if (granted) {
                        //startVideoRecordActivity();
                    } else {
                        //Snackbar.make(prepareToRecord, getString(R.string.no_enough_permission), Snackbar.LENGTH_SHORT).setAction("Confirm", null).show();
                    }
                });

        photographer = PhotographerFactory.createPhotographerWithCamera2(this, preview);
        photographerHelper = new PhotographerHelper(photographer);
        photographerHelper.setFileDir(MEDIA_DIR);

        photographer.setOnEventListener(new SimpleOnEventListener() {
            @Override
            public void onDeviceConfigured() {
                /**
                if (photographer.getMode() == Values.MODE_VIDEO) {
                    //actionButton.setImageResource(R.drawable.record);
                    //chooseSizeButton.setText(R.string.video_size);
                    switchButton.setText(R.string.video_mode);
                } else {
                    //actionButton.setImageResource(R.drawable.ic_camera);
                    //chooseSizeButton.setText(R.string.image_size);
                    switchButton.setText(R.string.image_mode);
                }
                */
                actionButton.setImageResource(R.drawable.ic_camera);
                actionButton.setEnabled(true);
                actionButton.setVisibility(View.VISIBLE);
                //switchButton.setText(R.string.image_mode);
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

        //addContentView();
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        if (requestCode == REQUEST_CAMERA_PERMISSION) {
            if (grantResults[0] == PackageManager.PERMISSION_DENIED) {
                // close the app
                Toast.makeText(MainActivity.this, "Sorry!!!, you can't use this app without granting permission", Toast.LENGTH_LONG).show();
                finish();
            }
        }
    }

    @OnClick(R.id.switch_mode)
    void switchMode() {
        photographerHelper.switchMode();
    }

    @Override
    protected void onResume() {
        super.onResume();
        enterFullscreen();
        photographer.startPreview();
        //photographer.startCanvasRequestFocus();
    }

    @Override
    protected void onPause() {
        //finishRecordingIfNeeded();
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

    private void announcingNewFile(String filePath) {
        Toast.makeText(this, "File: " + filePath, Toast.LENGTH_SHORT).show();
        Utils.addMediaToGallery(this, filePath);
    }

}