import {openUploadWidget} from "../../utils/cloudinaryService";
import { cloudinaryUploadPreset } from "../../config";

const CloudinaryUpload = ({setUrl, setName, setDuration}) => {
    const uploadImageWidget = () => {
        let myUploadWidget = openUploadWidget(
            {
                cloudName: "duqy7jmma",
                uploadPreset: cloudinaryUploadPreset,
                sources: ["local"],
                resourceType: "video",
            },
            function (error, result) {
                if (!error && result.event === "success") {
                    setUrl(result.info.secure_url);
                    setName(result.info.original_filename);
                    setDuration(result.info.duration);
                } else {
                    if (error) {
                        console.log(error);
                    }
                }
            }
        );
        myUploadWidget.open();
    };

    return (
        <button
            className="bg-white text-black rounded-full p-3 w-40 font-semibold"
            onClick={uploadImageWidget}>
            Select Track
        </button>
    );
};

export default CloudinaryUpload;