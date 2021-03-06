export const checkImageUpload = (file) => {
  // console.log("size", file.size);
  let err = "";
  if (!file) err = "File does not exist.";
  //file must < 1mb
  if (file?.size > 1024 * 1024) err = "The largest size of image is 1mb!";
  //check format
  if (
    file?.type !== "image/jpeg" &&
    file?.type !== "image/png" &&
    file?.type !== "image/gif"
  )
    err = "File format must be JPEG or PNG or GIF";
  return err;
};

export const imageUpload = async (images) => {
  //FIRST: set up Cloudinary
  let imgArr = [];
  for (const item of images) {
    const formData = new FormData();
    if (item.camera) {
      formData.append("file", item.camera);
    } else {
      formData.append("file", item);
    }
    //provide preset name in cloudinary;
    //cloud name in dashboard
    //upload url: API image upload
    formData.append("upload_preset", "messenger");
    formData.append("cloud_name", "cloudinarystore");
    formData.append("folder", "messenger");
    const res = await fetch(
      "https://api.cloudinary.com/v1_1/cloudinarystore/upload",
      {
        method: "POST",
        body: formData,
      }
    );
    const data = await res.json();
    imgArr.push({ public_id: data.public_id, url: data.secure_url });
  }
  // imgArr : [ { media[0].url, media[0].publicId  }  ]
  return imgArr;
};
