import React, { useState, useRef } from "react";
import { FilePond, registerPlugin } from "react-filepond";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";
import useRoute from "@novus/Hooks/useRoute";
import { MediaItem } from "@novus/types/media";

// Register FilePond plugins
registerPlugin(
    FilePondPluginImagePreview,
    FilePondPluginFileValidateType,
    FilePondPluginImageExifOrientation,
    FilePondPluginFileValidateSize,
);

type FilePondUploaderProps = {
    selectedCollection: string;
    onFileUploaded: (media: MediaItem) => void;
    onError?: (error: string) => void;
};

export function FilePondUploader({
    selectedCollection,
    onFileUploaded,
    onError,
}: FilePondUploaderProps) {
    const route = useRoute();
    const [files, setFiles] = useState<any[]>([]);
    const pondRef = useRef<FilePond>(null);

    return (
        <div className="mb-6">
            <FilePond
                ref={pondRef}
                files={files}
                onupdatefiles={setFiles}
                allowMultiple={true}
                maxFiles={10}
                server={{
                    process: (
                        fieldName,
                        file,
                        metadata,
                        load,
                        error,
                        progress,
                        abort,
                        transfer,
                        options,
                    ) => {
                        // Create FormData object
                        const formData = new FormData();
                        formData.append("file", file);
                        formData.append(
                            "collection_name",
                            selectedCollection !== "all"
                                ? selectedCollection
                                : "default",
                        );

                        // Use XMLHttpRequest for more control
                        const request = new XMLHttpRequest();
                        request.open("POST", route("novus.media.upload"));

                        // Setup progress handler
                        request.upload.onprogress = (e) => {
                            progress(e.lengthComputable, e.loaded, e.total);
                        };

                        // Handle completion
                        request.onload = function () {
                            if (request.status >= 200 && request.status < 300) {
                                try {
                                    const response = JSON.parse(
                                        request.responseText,
                                    );
                                    if (response.success && response.media) {
                                        onFileUploaded(response.media);
                                        load(request.responseText);
                                    } else {
                                        const errorMessage =
                                            "Upload failed: " +
                                            (response.message ||
                                                "Unknown error");
                                        error(errorMessage);
                                        onError?.(errorMessage);
                                    }
                                } catch (e) {
                                    const errorMessage =
                                        "Invalid server response";
                                    error(errorMessage);
                                    onError?.(errorMessage);
                                }
                            } else {
                                // Log the full response for debugging
                                const errorMessage =
                                    "Server error: " + request.status;
                                error(errorMessage);
                                onError?.(errorMessage);
                            }
                        };

                        // Handle network errors
                        request.onerror = function () {
                            const errorMessage = "Network error";
                            error(errorMessage);
                            onError?.(errorMessage);
                        };

                        // Send the request
                        request.send(formData);

                        // Return abort function
                        return {
                            abort: () => {
                                request.abort();
                                abort();
                            },
                        };
                    },
                }}
                name="file"
                credits={false}
                acceptedFileTypes={["image/*"]}
                fileValidateTypeDetectType={(source, type) =>
                    new Promise((resolve) => {
                        // Make sure we only accept images
                        if (type && type.includes("image/")) {
                            resolve(type);
                        } else {
                            resolve("image/jpeg"); // Force invalid files to be rejected
                        }
                    })
                }
                labelIdle='Drag & Drop your images or <span class="filepond--label-action">Browse</span>'
                labelFileTypeNotAllowed="Only images are allowed"
                fileValidateTypeLabelExpectedTypes="Only images are allowed"
                maxFileSize="10MB"
                instantUpload={true}
                chunkUploads={false}
                className="filepond-root"
                allowRevert={false}
                onprocessfile={(error, file) => {
                    // Remove file from pond after it's processed
                    if (!error && pondRef.current) {
                        pondRef.current.removeFile(file.id);
                    }
                }}
                beforeAddFile={(file) => {
                    // Only allow image files
                    return file.fileType.includes("image/");
                }}
            />
        </div>
    );
}
