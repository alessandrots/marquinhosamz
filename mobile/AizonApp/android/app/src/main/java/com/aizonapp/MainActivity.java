package com.aizonapp;

import android.Manifest;
import android.app.Activity;
import android.content.Context;
import android.content.pm.PackageManager;
import android.widget.Toast;

import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import com.facebook.react.ReactActivity;

import java.util.ArrayList;


public class MainActivity extends ReactActivity {

  private static final int REQUEST_CAMERA_PERMISSION = 200;

  private static final ArrayList<String> RECORD_VIDEO_PERMISSIONS = new ArrayList<>(3);

  static {
    RECORD_VIDEO_PERMISSIONS.add(Manifest.permission.CAMERA);
    RECORD_VIDEO_PERMISSIONS.add(Manifest.permission.RECORD_AUDIO);
    RECORD_VIDEO_PERMISSIONS.add(Manifest.permission.WRITE_EXTERNAL_STORAGE);
  }

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    //getCameraPermission();

    return "AizonApp";
  }

  public void getCameraPermission(){
    if (!checkPermission2()) {
      requestPermission();
    }
  }

  private boolean checkPermission(){
    int result = ContextCompat.checkSelfPermission(this, Manifest.permission.CAMERA);

    if (result == PackageManager.PERMISSION_GRANTED){
      return true;
    } else {
      return false;
    }
  }

  private boolean checkPermission2(){
        /* int result = ContextCompat.checkSelfPermission(this.getBaseContext(), Manifest.permission.CAMERA);
        if (result == PackageManager.PERMISSION_GRANTED){
            return true;
        } else {
            return false;
        }
        */
        Context mContext = getApplicationContext();

    for (String permission: RECORD_VIDEO_PERMISSIONS) {
      int permissionCheck = ContextCompat.checkSelfPermission((Activity) mContext, permission);
      if (permissionCheck != PackageManager.PERMISSION_GRANTED) {
        //callbackHandler.onError(new Error(Error.ERROR_PERMISSION, "Unsatisfied permission: " + permission));
        return false;
      }
    }

    return true;
  }

  private void requestPermission(){
    if (ActivityCompat.shouldShowRequestPermissionRationale(MainActivity.this, Manifest.permission.CAMERA)){

      ActivityCompat.requestPermissions(MainActivity.this, new String[]{Manifest.permission.CAMERA}, REQUEST_CAMERA_PERMISSION);
    } else {

      ActivityCompat.requestPermissions(MainActivity.this, new String[]{Manifest.permission.CAMERA}, REQUEST_CAMERA_PERMISSION);
    }
  }

  @Override
  public void onRequestPermissionsResult(int requestCode, String permissions[], int[] grantResults) {
    super.onRequestPermissionsResult(requestCode,  permissions,  grantResults);

    switch (requestCode) {
      case REQUEST_CAMERA_PERMISSION:
        if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
          Toast.makeText(MainActivity.this,"Permission granted",Toast.LENGTH_SHORT).show();
          //store permission in shared pref

        }

        else {
          Toast.makeText(MainActivity.this,"Permission denied",Toast.LENGTH_SHORT).show();
          //store permission in shared pref
        }
        break;
    }
  }

  //
}
