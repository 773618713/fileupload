package com.scy.fileupload.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import java.io.File;
import java.util.HashMap;
import java.util.Map;

@Controller
public class FileUploadAjax {

    /**
     * 单文件上传接收方法
     *
     * @param request
     * @param response
     * @param session
     * @return
     */
    @ResponseBody
    @RequestMapping("/FileUpload")
    public Object FileUpload(HttpServletRequest request, HttpServletResponse response, HttpSession session) {
        try {
            System.out.println("开始上传");
            String formData = request.getParameter("formData");
            System.out.println("上传参数:" + formData);

            String pathString = "E:\\";
            File file2 = new File(pathString);
            if (!file2.exists()) {
                file2.mkdir();
            }

            MultipartHttpServletRequest multipartRequest = (MultipartHttpServletRequest) request;
            MultipartFile file = multipartRequest.getFile("file");

            if (file.isEmpty()) {
                throw new Exception("文件不存在！");
            }
            String fileName = file.getOriginalFilename();
            file.transferTo(new File(pathString + fileName));
            System.out.println(pathString);
            Map outMap = new HashMap();
            outMap.put("code", "0000");
            outMap.put("fileName", fileName);
            outMap.put("fileLink", "fileLink" + File.separator + fileName);
            return outMap;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "fail";
    }
}
