const upload_prset = "foodgo"
const cloud_name = "dhyrm22u8"
const api_url = `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`;

export const uploadImageToCloudinary = async (file) => {
    try {
        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", upload_prset);
        data.append("cloud_name", cloud_name);

        const res = await fetch(api_url, {
            method: "POST",
            body: data,
        });

        const fileData = await res.json();
        console.log("Image successfully uploaded", fileData.url);
        return fileData.url;
    }
    catch (err) {
        console.log(err)
        return {
            error: err
        }
    }
}