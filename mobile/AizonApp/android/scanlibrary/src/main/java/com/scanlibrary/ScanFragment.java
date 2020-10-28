package com.scanlibrary;

import android.app.Activity;
import android.app.Fragment;
import android.app.FragmentManager;
import android.graphics.Bitmap;
import android.graphics.Matrix;
import android.graphics.PointF;
import android.graphics.RectF;
import android.graphics.drawable.BitmapDrawable;
import android.net.Uri;
import android.os.AsyncTask;
import android.os.Bundle;
import android.util.Base64;
import android.util.Log;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.FrameLayout;
import android.widget.ImageView;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by jhansi on 29/03/15.
 */
public class ScanFragment extends Fragment {

    private static final String TAG = "AIZONApp_ScanFragment";

    private Button scanButton;
    private ImageView sourceImageView;
    private FrameLayout sourceFrame;
    private PolygonView polygonView;
    private View view;
    private ProgressDialogFragment progressDialogFragment;
    private IScanner scanner;
    private Bitmap original;
    private Map<Integer, PointF> mapaPointScanned;


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
        view = inflater.inflate(R.layout.scan_fragment_layout, null);
        init();
        return view;
    }

    public ScanFragment() {

    }

    private void init() {
        sourceImageView = (ImageView) view.findViewById(R.id.sourceImageView);
        scanButton = (Button) view.findViewById(R.id.scanButton);
        scanButton.setOnClickListener(new ScanButtonClickListener());
        sourceFrame = (FrameLayout) view.findViewById(R.id.sourceFrame);
        polygonView = (PolygonView) view.findViewById(R.id.polygonView);
        sourceFrame.post(new Runnable() {
            @Override
            public void run() {
                original = getBitmap();
                if (original != null) {
                    setBitmap(original);
                }
            }
        });
    }

    private Bitmap getBitmap() {
        Uri uri = getUri();
        try {
            Bitmap bitmap = Utils.getBitmap(getActivity(), uri);

            Log.i(TAG, "width = " + bitmap.getWidth());
            Log.i(TAG, "height = " + bitmap.getHeight());

            getActivity().getContentResolver().delete(uri, null, null);
            return bitmap;
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }

    private Uri getUri() {
        Uri uri = getArguments().getParcelable(ScanConstants.SELECTED_BITMAP);
        return uri;
    }

    private void setBitmap(Bitmap original) {
        Bitmap scaledBitmap = scaledBitmap(original, sourceFrame.getWidth(), sourceFrame.getHeight());
        sourceImageView.setImageBitmap(scaledBitmap);
        Bitmap tempBitmap = ((BitmapDrawable) sourceImageView.getDrawable()).getBitmap();
        Map<Integer, PointF> pointFs = getEdgePoints(tempBitmap);
        polygonView.setPoints(pointFs);
        polygonView.setVisibility(View.VISIBLE);
        int padding = (int) getResources().getDimension(R.dimen.scanPadding);
        FrameLayout.LayoutParams layoutParams = new FrameLayout.LayoutParams(tempBitmap.getWidth() + 2 * padding, tempBitmap.getHeight() + 2 * padding);
        layoutParams.gravity = Gravity.CENTER;
        polygonView.setLayoutParams(layoutParams);
    }

    private Map<Integer, PointF> getEdgePoints(Bitmap tempBitmap) {
        List<PointF> pointFs = getContourEdgePoints(tempBitmap);
        Map<Integer, PointF> orderedPoints = orderedValidEdgePoints(tempBitmap, pointFs);
        return orderedPoints;
    }

    private List<PointF> getContourEdgePoints(Bitmap tempBitmap) {
        float[] points = ((ScanActivity) getActivity()).getPoints(tempBitmap);
        float x1 = points[0];
        float x2 = points[1];
        float x3 = points[2];
        float x4 = points[3];

        float y1 = points[4];
        float y2 = points[5];
        float y3 = points[6];
        float y4 = points[7];

        List<PointF> pointFs = new ArrayList<>();
        pointFs.add(new PointF(x1, y1));
        pointFs.add(new PointF(x2, y2));
        pointFs.add(new PointF(x3, y3));
        pointFs.add(new PointF(x4, y4));
        return pointFs;
    }

    private Map<Integer, PointF> getOutlinePoints(Bitmap tempBitmap) {
        Map<Integer, PointF> outlinePoints = new HashMap<>();
        outlinePoints.put(0, new PointF(0, 0));
        outlinePoints.put(1, new PointF(tempBitmap.getWidth(), 0));
        outlinePoints.put(2, new PointF(0, tempBitmap.getHeight()));
        outlinePoints.put(3, new PointF(tempBitmap.getWidth(), tempBitmap.getHeight()));
        return outlinePoints;
    }

    private Map<Integer, PointF> orderedValidEdgePoints(Bitmap tempBitmap, List<PointF> pointFs) {
        Map<Integer, PointF> orderedPoints = polygonView.getOrderedPoints(pointFs);
        if (!polygonView.isValidShape(orderedPoints)) {
            orderedPoints = getOutlinePoints(tempBitmap);
        }
        return orderedPoints;
    }

    private class ScanButtonClickListener implements View.OnClickListener {
        @Override
        public void onClick(View v) {
            Map<Integer, PointF> points = polygonView.getPoints();
            if (isScanPointsValid(points)) {
                new ScanAsyncTask(points).execute();
            } else {
                showErrorDialog();
            }
        }
    }

    private void showErrorDialog() {
        SingleButtonDialogFragment fragment = new SingleButtonDialogFragment(R.string.ok, getString(R.string.cantCrop), "Error", true);
        FragmentManager fm = getActivity().getFragmentManager();
        fragment.show(fm, SingleButtonDialogFragment.class.toString());
    }

    private boolean isScanPointsValid(Map<Integer, PointF> points) {
        return points.size() == 4;
    }

    private Bitmap scaledBitmap(Bitmap bitmap, int width, int height) {
        Matrix m = new Matrix();
        m.setRectToRect(new RectF(0, 0, bitmap.getWidth(), bitmap.getHeight()), new RectF(0, 0, width, height), Matrix.ScaleToFit.CENTER);
        return Bitmap.createBitmap(bitmap, 0, 0, bitmap.getWidth(), bitmap.getHeight(), m, true);
    }

    private Bitmap getScannedBitmap(Bitmap original, Map<Integer, PointF> points) {
        int width = original.getWidth();
        int height = original.getHeight();

        Log.i(TAG, "width (" + width + ") height (" + height + ")");


        float xRatio = (float) width/ sourceImageView.getWidth();
        float yRatio = (float) height / sourceImageView.getHeight();

        float x1_ = (points.get(0).x) ;
        float x2_ = (points.get(1).x);
        float x3_ = (points.get(2).x) ;
        float x4_ = (points.get(3).x) ;
        float y1_ = (points.get(0).y) ;
        float y2_ = (points.get(1).y) ;
        float y3_ = (points.get(2).y) ;
        float y4_ = (points.get(3).y) ;

        Log.i(TAG, "POints Original (" + x1_ + "," + y1_ + ")(" + x2_ + "," + y2_ + ")(" + x3_ + "," + y3_ + ")(" + x4_ + "," + y4_ + ")");

        float sx1 = (points.get(0).x) * xRatio;
        float sx2 = (points.get(1).x) * xRatio;
        float sx3 = (points.get(2).x) * xRatio;
        float sx4 = (points.get(3).x) * xRatio;
        float sy1 = (points.get(0).y) * yRatio;
        float sy2 = (points.get(1).y) * yRatio;
        float sy3 = (points.get(2).y) * yRatio;
        float sy4 = (points.get(3).y) * yRatio;

        Log.i(TAG, "\n POints Scanned (" + sx1 + "," + sy1 + ")(" + sx2 + "," + sy2 + ")(" +sx3 + "," + sy3 + ")(" + sx4 + "," + sy4 + ")");

        Bitmap _bitmap = ((ScanActivity) getActivity()).getScannedBitmap(original, sx1, sy1, sx2, sy2, sx3, sy3, sx4, sy4);

        List<PointF> pointsScanned = new ArrayList<PointF>();
        pointsScanned.add(new PointF(sx1, sy1));
        pointsScanned.add(new PointF(sx2, sy2));
        pointsScanned.add(new PointF(sx3, sy3));
        pointsScanned.add(new PointF(sx4, sy4));

        this.mapaPointScanned = this.polygonView.getOrderedPoints(pointsScanned);

        return _bitmap;
    }

    private class ScanAsyncTask extends AsyncTask<Void, Void, Bitmap> {

        private Map<Integer, PointF> points;

        public ScanAsyncTask(Map<Integer, PointF> points) {
            this.points = points;
        }

        @Override
        protected void onPreExecute() {
            super.onPreExecute();
            showProgressDialog(getString(R.string.scanning));
        }

        /***
        @Override
        protected Bitmap doInBackground(Void... params) {
            Bitmap bitmap =  getScannedBitmap(original, points);
            Uri uri = Utils.getUri(getActivity(), bitmap);

            scanner.onScanFinish(uri);
            return bitmap;
        }
         */

        /***
         * aqui posso passar os points num outro método onScanFinish(uri, points, bitmap)
         *
         * e de repente o bitmap já passando..
         */
        @Override
        protected Bitmap doInBackground(Void... params) {
            Uri uriOriginal = Utils.getUri(getActivity(), original);

            Bitmap bitmapScanned =  getScannedBitmap(original, points);
            Uri uriScanned = Utils.getUri(getActivity(), bitmapScanned);

            //String imgOriginal = this.encodeImage(original);
            //String imgScanned  = this.encodeImage(bitmapScanned);

            scanner.onScanFinishByAmazon(uriOriginal, uriScanned, points, mapaPointScanned);
            
            return bitmapScanned;
        }

        private String encodeImage(Bitmap bm)
        {
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            bm.compress(Bitmap.CompressFormat.JPEG,100,baos);
            byte[] b = baos.toByteArray();
            String encImage = Base64.encodeToString(b, Base64.DEFAULT);

            return encImage;
        }

        @Override
        protected void onPostExecute(Bitmap bitmap) {
            super.onPostExecute(bitmap);
            bitmap.recycle();
            dismissDialog();
        }
    }

    protected void showProgressDialog(String message) {
        progressDialogFragment = new ProgressDialogFragment(message);
        FragmentManager fm = getFragmentManager();
        progressDialogFragment.show(fm, ProgressDialogFragment.class.toString());
    }

    protected void dismissDialog() {
        progressDialogFragment.dismissAllowingStateLoss();
    }

}