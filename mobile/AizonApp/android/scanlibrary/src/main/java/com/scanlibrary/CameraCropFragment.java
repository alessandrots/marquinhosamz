package com.scanlibrary;

import android.app.Activity;
import android.net.Uri;
import android.os.Bundle;

//import androidx.fragment.app.Fragment;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Matrix;
import android.graphics.Bitmap.CompressFormat;
import android.media.MediaScannerConnection;
import android.media.MediaScannerConnection.OnScanCompletedListener;
import android.os.Bundle;
import android.os.Environment;
import android.util.DisplayMetrics;
import android.util.Log;
import android.util.Size;
import android.view.Display;
import android.view.LayoutInflater;
import android.view.MotionEvent;
import android.view.TextureView;
import android.view.View;
import android.view.ViewGroup;
import android.view.View.OnClickListener;
import android.view.View.OnTouchListener;
import android.widget.ImageButton;
import android.widget.Toast;
import androidx.camera.core.Camera;
import androidx.camera.core.CameraControl;
import androidx.camera.core.CameraSelector;
import androidx.camera.core.FocusMeteringAction;
import androidx.camera.core.ImageAnalysis;
import androidx.camera.core.ImageCapture;
import androidx.camera.core.MeteringPoint;
import androidx.camera.core.Preview;
import androidx.camera.core.UseCase;
import androidx.camera.core.ImageAnalysis.Analyzer;
import androidx.camera.core.ImageCapture.OnImageSavedCallback;
import androidx.camera.core.Preview.Builder;
import androidx.camera.lifecycle.ProcessCameraProvider;
import androidx.camera.view.PreviewView;
import androidx.camera.view.TextureViewMeteringPointFactory;
import androidx.core.content.ContextCompat;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.LifecycleOwner;
//import androidx.navigation.NavDirections;
//import androidx.navigation.fragment.FragmentKt;
import com.google.common.util.concurrent.ListenableFuture;
//import com.rifafauzi.customcamera.R.id;
//import com.rifafauzi.customcamera.R.layout;
//import com.rifafauzi.customcamera.ui.camera.CameraFragmentDirections.ActionLaunchGalleryFragment;
import com.rifafauzi.customcamera.utils.FileCreator;

import org.jetbrains.annotations.NotNull;
import org.jetbrains.annotations.Nullable;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Locale;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Executor;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
//import kotlin.Metadata;
//import kotlin.jvm.internal.DefaultConstructorMarker;
//import kotlin.jvm.internal.Intrinsics;
//import org.jetbrains.annotations.NotNull;
//import org.jetbrains.annotations.Nullable;


/**
 * A simple {@link Fragment} subclass.
 * create an instance of this fragment.
 */
public class CameraCropFragment extends Fragment {

    private Uri fileUri;
    private IScanner scanner;
    private String pictureImagePath = "";
    private String idProcesso;
    private String tipoImagem;

    private static final String TAG = "AIZONApp_CameraCropFrag";


    private View rectangle;
    private ListenableFuture processCameraProviderFuture;
    private ProcessCameraProvider processCameraProvider;
    private static final String IMAGE_DIRECTORY = "/CustomImage";
    //public static final CameraFragment.Companion Companion = new CameraFragment.Companion((DefaultConstructorMarker)null);
    private HashMap _$_findViewCache;

    @Override
    public void onAttach(Activity activity) {
        super.onAttach(activity);
        if (!(activity instanceof IScanner)) {
            throw new ClassCastException("Activity must implement IScanner");
        }
        this.scanner = (IScanner) activity;
    }

    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        ListenableFuture var10001 = ProcessCameraProvider.getInstance(this.requireContext());
        //Intrinsics.checkExpressionValueIsNotNull(var10001, "ProcessCameraProvider.ge…nstance(requireContext())");
        this.processCameraProviderFuture = var10001;
    }

    @Nullable
    public View onCreateView(@NotNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        //Intrinsics.checkParameterIsNotNull(inflater, "inflater");
        init();
        return inflater.inflate(R.layout.fragment_camera_crop, container, false);
    }

    private void init() {
        idProcesso = getArguments().getString(ScanConstants.ID_PROCESS_SCAN_IMAGE);
        tipoImagem = getArguments().getString(ScanConstants.IMAGE_TYPE_SCAN_IMAGE);
    }

    public void onViewCreated(@NotNull View view, @Nullable Bundle savedInstanceState) {
        //Intrinsics.checkParameterIsNotNull(view, "view");
        super.onViewCreated(view, savedInstanceState);
        View var10001 = view.findViewById(R.id.rectangle);
        //Intrinsics.checkExpressionValueIsNotNull(var10001, "view.findViewById(R.id.rectangle)");
        this.rectangle = var10001;
        ListenableFuture var10000 = this.processCameraProviderFuture;
        if (var10000 == null) {
            //Intrinsics.throwUninitializedPropertyAccessException("processCameraProviderFuture");
        }

        var10000.addListener((Runnable)(new Runnable() {
            public final void run() {
                CameraCropFragment var10000 = CameraCropFragment.this;
                Object var10001 = null;

                try {
                    var10001 = CameraCropFragment.access$getProcessCameraProviderFuture$p(CameraCropFragment.this).get();
                } catch (ExecutionException e) {
                    e.printStackTrace();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }

                //Intrinsics.checkExpressionValueIsNotNull(var10001, "processCameraProviderFuture.get()");
                var10000.processCameraProvider = (ProcessCameraProvider)var10001;
                ((PreviewView)CameraCropFragment.this._$_findCachedViewById(R.id.viewFinder)).post((Runnable)(new Runnable() {
                    public final void run() {
                        CameraCropFragment.this.setupCamera();
                    }
                }));
            }
        }), ContextCompat.getMainExecutor(this.requireContext()));
    }


    public void onDestroyView() {
        super.onDestroyView();
        if (((CameraCropFragment)this).processCameraProvider != null) {
            ProcessCameraProvider var10000 = this.processCameraProvider;
            if (var10000 == null) {
                //Intrinsics.throwUninitializedPropertyAccessException("processCameraProvider");
            }

            var10000.unbindAll();
        }

        this._$_clearFindViewByIdCache();
    }

    private final void setupCamera() {
        ProcessCameraProvider var10000 = this.processCameraProvider;
        if (var10000 == null) {
            //Intrinsics.throwUninitializedPropertyAccessException("processCameraProvider");
        }

        var10000.unbindAll();
        var10000 = this.processCameraProvider;
        if (var10000 == null) {
            //Intrinsics.throwUninitializedPropertyAccessException("processCameraProvider");
        }

        Camera var2 = var10000.bindToLifecycle((LifecycleOwner)this, CameraSelector.DEFAULT_BACK_CAMERA, new UseCase[]{(UseCase)this.buildPreviewUseCase(), (UseCase)this.buildImageCaptureUseCase(), (UseCase)this.buildImageAnalysisUseCase()});
        //Intrinsics.checkExpressionValueIsNotNull(var2, "processCameraProvider.bi…ldImageAnalysisUseCase())");
        Camera camera = var2;
        CameraControl var10001 = camera.getCameraControl();
        //Intrinsics.checkExpressionValueIsNotNull(var10001, "camera.cameraControl");
        this.setupTapForFocus(var10001);
    }

    private final Preview buildPreviewUseCase() {
        PreviewView var10000 = (PreviewView)this._$_findCachedViewById(R.id.viewFinder);
        //Intrinsics.checkExpressionValueIsNotNull(var10000, "viewFinder");
        Display display = var10000.getDisplay();
        DisplayMetrics var3 = new DisplayMetrics();
        boolean var4 = false;
        boolean var5 = false;
        boolean var7 = false;
        display.getMetrics(var3);
        Builder var10 = new Builder();
        //Intrinsics.checkExpressionValueIsNotNull(display, "display");
        Preview var9 = var10.setTargetRotation(display.getRotation()).setTargetResolution(new Size(var3.widthPixels, var3.heightPixels)).build();
        var5 = false;
        boolean var6 = false;
        boolean var8 = false;
        PreviewView var10001 = (PreviewView)this._$_findCachedViewById(R.id.viewFinder);
        //Intrinsics.checkExpressionValueIsNotNull(var10001, "viewFinder");
        var9.setPreviewSurfaceProvider(var10001.getPreviewSurfaceProvider());
        //Intrinsics.checkExpressionValueIsNotNull(var9, "Preview.Builder()\n      …aceProvider\n            }");
        var10001 = (PreviewView)this._$_findCachedViewById(R.id.viewFinder);
        //Intrinsics.checkExpressionValueIsNotNull(var10001, "viewFinder");
        var9.setPreviewSurfaceProvider(var10001.getPreviewSurfaceProvider());
        return var9;
    }

    private File createImageFile() {
        Locale localeBr = new Locale("pt", "BR");
        String timeStamp = new SimpleDateFormat("yyyyMMdd_HHmmss", localeBr).format(new Date());

        File path = clearTempImages();

        if (path == null) {
            path = getActivity().getBaseContext().getExternalFilesDir(Environment.DIRECTORY_PICTURES);
            //Log.i(TAG, "path = " + path.getPath());
        }

        //File fileImageOrigin = new File(path,  "ORIGINAL_" + timeStamp + ".jpg");
        File fileImageOrigin = new File(path,  "ORIGINAL" + ".jpg");

        //Log.i(TAG, "file1 = " + fileImageOrigin.getPath());
        //this.pictureImagePath = fileImageOrigin.getAbsolutePath();

        try {
            FileOutputStream outputStream = new FileOutputStream(fileImageOrigin);
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }

        fileUri = Uri.fromFile(fileImageOrigin);

        return fileImageOrigin;
    }

    private File clearTempImages() {
        File tempFolder = null;

        try {
            File path = getActivity().getBaseContext().getExternalFilesDir(Environment.DIRECTORY_PICTURES);


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

    protected void postImagePick(Bitmap bitmap) {
        Uri uri = Utils.getUri(getActivity(), bitmap);

        if (bitmap != null && !bitmap.isRecycled()) {
            bitmap.recycle();
            bitmap = null;
        }

        scanner.onBitmapSelect(uri, this.pictureImagePath);
    }

    private final ImageCapture buildImageCaptureUseCase() {
        PreviewView var10000 = (PreviewView)this._$_findCachedViewById(R.id.viewFinder);
        //Intrinsics.checkExpressionValueIsNotNull(var10000, "viewFinder");
        Display display = var10000.getDisplay();
        DisplayMetrics var3 = new DisplayMetrics();
        boolean var4 = false;
        boolean var5 = false;
        boolean var7 = false;

        display.getMetrics(var3);

        androidx.camera.core.ImageCapture.Builder var10 = new androidx.camera.core.ImageCapture.Builder();

        //Intrinsics.checkExpressionValueIsNotNull(display, "display");

        ImageCapture var11 = var10.setTargetRotation(display.getRotation())
                .setTargetResolution(new Size(var3.widthPixels, var3.heightPixels))
                .setFlashMode(ImageCapture.FLASH_MODE_AUTO)
                .setCaptureMode(ImageCapture.CAPTURE_MODE_MAXIMIZE_QUALITY).build();
        //Intrinsics.checkExpressionValueIsNotNull(var11, "ImageCapture.Builder()\n …ITY)\n            .build()");
        final ImageCapture capture = var11;

        final ExecutorService executor = Executors.newSingleThreadExecutor();

        ((ImageButton)this._$_findCachedViewById(R.id.cameraCaptureImageButton)).setOnClickListener((OnClickListener)(new OnClickListener() {
            public final void onClick(View it) {
                capture.takePicture(createImageFile(), (Executor)executor, (OnImageSavedCallback)(new OnImageSavedCallback() {
                    public void onImageSaved(@NotNull File file) {
                        //Intrinsics.checkParameterIsNotNull(file, "file");
                        Bitmap bitmap = BitmapFactory.decodeFile(file.getAbsolutePath());
                        CameraCropFragment var10000 = CameraCropFragment.this;
                        //Intrinsics.checkExpressionValueIsNotNull(bitmap, "bitmap");
                        Bitmap rotatedBitmap = var10000.rotate(bitmap, 90);
                        var10000 = CameraCropFragment.this;

                        PreviewView var10002 = (PreviewView)CameraCropFragment.this._$_findCachedViewById(R.id.viewFinder);
                        //Intrinsics.checkExpressionValueIsNotNull(var10002, "viewFinder");
                        byte[] croppedImage = var10000.cropImage(rotatedBitmap, (View)var10002, CameraCropFragment.access$getRectangle$p(CameraCropFragment.this));

                        //if (bitmapCrop != null) {
                        //    createImageCropFile(bitmapCrop);
                        //}
                        //CameraCropFragment.this.saveImage(croppedImage);
                        String pathImageCrop = CameraCropFragment.this.saveImageORIGINAL(croppedImage);
                        pictureImagePath = pathImageCrop;

                        Bitmap bitmapCrop = BitmapFactory.decodeFile(pictureImagePath);

                        if (bitmapCrop != null) {
                            postImagePick(bitmapCrop);
                        }
                    }

                    public void onError(int imageCaptureError, @NotNull String message, @Nullable Throwable cause) {
                        //Intrinsics.checkParameterIsNotNull(message, "message");
                        Toast.makeText(CameraCropFragment.this.requireContext(), (CharSequence)("Error: " + message), Toast.LENGTH_LONG).show();
                        Log.e("CameraFragment", "Capture error " + imageCaptureError + ": " + message, cause);
                    }
                }));
            }
        }));

        return capture;
    }

    private final ImageAnalysis buildImageAnalysisUseCase() {
        PreviewView var10000 = (PreviewView)this._$_findCachedViewById(R.id.viewFinder);
        //Intrinsics.checkExpressionValueIsNotNull(var10000, "viewFinder");
        Display display = var10000.getDisplay();
        DisplayMetrics var3 = new DisplayMetrics();
        boolean var4 = false;
        boolean var5 = false;
        boolean var7 = false;
        display.getMetrics(var3);
        androidx.camera.core.ImageAnalysis.Builder var9 = new androidx.camera.core.ImageAnalysis.Builder();
        //Intrinsics.checkExpressionValueIsNotNull(display, "display");
        ImageAnalysis var10 = var9.setTargetRotation(display.getRotation()).setTargetResolution(new Size(var3.widthPixels, var3.heightPixels)).setBackpressureStrategy(1).setImageQueueDepth(10).build();
        //Intrinsics.checkExpressionValueIsNotNull(var10, "ImageAnalysis.Builder()\n…(10)\n            .build()");
        ImageAnalysis analysis = var10;
        analysis.setAnalyzer((Executor)Executors.newSingleThreadExecutor(), null);
        return analysis;
    }

    private final void setupTapForFocus(final CameraControl cameraControl) {
        ((PreviewView)this._$_findCachedViewById(R.id.viewFinder)).setOnTouchListener((OnTouchListener)(new OnTouchListener() {
            public final boolean onTouch(View $noName_0, MotionEvent event) {
                //Intrinsics.checkExpressionValueIsNotNull(event, "event");
                if (event.getAction() != 1) {
                    return true;
                } else {
                    View var10000 = ((PreviewView)CameraCropFragment.this._$_findCachedViewById(R.id.viewFinder)).getChildAt(0);
                    if (!(var10000 instanceof TextureView)) {
                        var10000 = null;
                    }

                    TextureView var7 = (TextureView)var10000;
                    if (var7 != null) {
                        TextureView textureView = var7;
                        TextureViewMeteringPointFactory factory = new TextureViewMeteringPointFactory(textureView);
                        MeteringPoint var8 = factory.createPoint(event.getX(), event.getY());
                        //Intrinsics.checkExpressionValueIsNotNull(var8, "factory.createPoint(event.x, event.y)");
                        MeteringPoint point = var8;
                        FocusMeteringAction var9 = androidx.camera.core.FocusMeteringAction.Builder.from(point).build();
                        //Intrinsics.checkExpressionValueIsNotNull(var9, "FocusMeteringAction.Builder.from(point).build()");
                        FocusMeteringAction action = var9;
                        cameraControl.startFocusAndMetering(action);
                        return true;
                    } else {
                        return true;
                    }
                }
            }
        }));
    }

    private final byte[] cropImage(Bitmap bitmap, View frame, View reference) {
        int heightOriginal = frame.getHeight();
        int widthOriginal = frame.getWidth();
        int heightFrame = reference.getHeight();
        int widthFrame = reference.getWidth();
        int leftFrame = reference.getLeft();
        int topFrame = reference.getTop();
        int heightReal = bitmap.getHeight();
        int widthReal = bitmap.getWidth();
        int widthFinal = widthFrame * widthReal / widthOriginal;
        int heightFinal = heightFrame * heightReal / heightOriginal;
        int leftFinal = leftFrame * widthReal / widthOriginal;
        int topFinal = topFrame * heightReal / heightOriginal;
        Bitmap bitmapFinal = Bitmap.createBitmap(bitmap, leftFinal, topFinal, widthFinal, heightFinal);
        ByteArrayOutputStream stream = new ByteArrayOutputStream();
        bitmapFinal.compress(CompressFormat.JPEG, 100, (OutputStream)stream);
        byte[] var10000 = stream.toByteArray();
        //Intrinsics.checkExpressionValueIsNotNull(var10000, "stream.toByteArray()");
        return var10000;
    }

    private final String saveImageORIGINAL(byte[] bytes) {
        FileOutputStream outStream = null;

        /**
        String fileName = "CROP_" + System.currentTimeMillis() + ".jpg";

        File directoryName = new File(Environment.getExternalStorageDirectory().toString() + "/CustomImage");
        File file = new File(directoryName, fileName);
        if (!directoryName.exists()) {
            directoryName.mkdirs();
        }
         */

        File path = clearTempImages();

        if (path == null) {
            path = getActivity().getBaseContext().getExternalFilesDir(Environment.DIRECTORY_PICTURES);
            Log.i(TAG, "path = " + path.getPath());
        }

        File fileImageOrigin = new File(path,  "CROP" + ".jpg");

        Log.i(TAG, "file1 = " + fileImageOrigin.getPath());

        File file = fileImageOrigin;

        try {
            file.createNewFile();
            outStream = new FileOutputStream(file);
            outStream.write(bytes);
            MediaScannerConnection.scanFile(this.getContext(), new String[]{file.getPath()}, new String[]{"image/jpeg"}, (OnScanCompletedListener)null);
            outStream.close();
        } catch (FileNotFoundException var7) {
            var7.printStackTrace();
        } catch (IOException var8) {
            var8.printStackTrace();
        }

        String var10000 = file.getAbsolutePath();
        //Intrinsics.checkExpressionValueIsNotNull(var10000, "file.absolutePath");
        return var10000;
    }

    private File createImageCropFile(Bitmap bmp) {
        File path = clearTempImages();

        if (path == null) {
            path = getActivity().getBaseContext().getExternalFilesDir(Environment.DIRECTORY_PICTURES);
            Log.i(TAG, "path = " + path.getPath());
        }

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

    private final String saveImage(byte[] bytes) {
        FileOutputStream outStream = null;
        String fileName = "KTP" + System.currentTimeMillis() + ".jpg";
        Context var10000 = this.requireContext();
        //Intrinsics.checkExpressionValueIsNotNull(var10000, "requireContext()");
        Context context = var10000;
        File directoryName = context.getExternalFilesDir(Environment.DIRECTORY_PICTURES);
        File file = new File(directoryName, fileName);
        if (directoryName != null && !directoryName.exists()) {
            directoryName.mkdirs();
        }

        try {
            file.createNewFile();
            outStream = new FileOutputStream(file);
            outStream.write(bytes);
            MediaScannerConnection.scanFile(context, new String[]{file.getPath()}, new String[]{"image/jpeg"}, (OnScanCompletedListener)null);
            outStream.close();
        } catch (FileNotFoundException var8) {
            var8.printStackTrace();
        } catch (IOException var9) {
            var9.printStackTrace();
        }

        String var10 = file.getAbsolutePath();
        //Intrinsics.checkExpressionValueIsNotNull(var10, "file.absolutePath");
        return var10;
    }

    private final Bitmap rotate(@NotNull Bitmap $this$rotate, int degree) {
        Matrix matrix = new Matrix();
        matrix.postRotate((float)degree);
        Bitmap scaledBitmap = Bitmap.createScaledBitmap($this$rotate, $this$rotate.getWidth(), $this$rotate.getHeight(), true);
        //Intrinsics.checkExpressionValueIsNotNull(scaledBitmap, "scaledBitmap");
        Bitmap var10000 = Bitmap.createBitmap(scaledBitmap, 0, 0, scaledBitmap.getWidth(), scaledBitmap.getHeight(), matrix, true);
        //Intrinsics.checkExpressionValueIsNotNull(var10000, "Bitmap.createBitmap(\n   …           true\n        )");
        return var10000;
    }

    // $FF: synthetic method
    public static final ProcessCameraProvider access$getProcessCameraProvider$p(CameraCropFragment $this) {
        ProcessCameraProvider var10000 = $this.processCameraProvider;
        if (var10000 == null) {
            //Intrinsics.throwUninitializedPropertyAccessException("processCameraProvider");
        }

        return var10000;
    }

    // $FF: synthetic method
    public static final ListenableFuture access$getProcessCameraProviderFuture$p(CameraCropFragment $this) {
        ListenableFuture var10000 = $this.processCameraProviderFuture;
        if (var10000 == null) {
            //Intrinsics.throwUninitializedPropertyAccessException("processCameraProviderFuture");
        }

        return var10000;
    }

    // $FF: synthetic method
    public static final void access$setProcessCameraProviderFuture$p(CameraCropFragment $this, ListenableFuture var1) {
        $this.processCameraProviderFuture = var1;
    }

    // $FF: synthetic method
    public static final View access$getRectangle$p(CameraCropFragment $this) {
        View var10000 = $this.rectangle;
        if (var10000 == null) {
            //Intrinsics.throwUninitializedPropertyAccessException("rectangle");
        }

        return var10000;
    }

    // $FF: synthetic method
    public static final void access$setRectangle$p(CameraCropFragment $this, View var1) {
        $this.rectangle = var1;
    }

    public View _$_findCachedViewById(int var1) {
        if (this._$_findViewCache == null) {
            this._$_findViewCache = new HashMap();
        }

        View var2 = (View)this._$_findViewCache.get(var1);
        if (var2 == null) {
            View var10000 = this.getView();
            if (var10000 == null) {
                return null;
            }

            var2 = var10000.findViewById(var1);
            this._$_findViewCache.put(var1, var2);
        }

        return var2;
    }

    public void _$_clearFindViewByIdCache() {
        if (this._$_findViewCache != null) {
            this._$_findViewCache.clear();
        }

    }

    //
}
