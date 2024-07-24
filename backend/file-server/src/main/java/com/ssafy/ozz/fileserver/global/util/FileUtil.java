package com.ssafy.ozz.fileserver.global.util;

import java.util.StringTokenizer;

public class FileUtil {
    public static boolean isImageFile(String mimeType){
        StringTokenizer st = new StringTokenizer(mimeType,"/");
        return st.nextToken().equals("image");
    }
}
