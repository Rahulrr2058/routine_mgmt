import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { Group, Modal, Text, useMantineTheme } from "@mantine/core";
import { Controller } from "react-hook-form";
import Image from "next/image";
import { CloudUpload, X } from "lucide-react";
import { useState } from "react";

const ImageUpload = ({
                         control,
                         setValue,
                         errors,
                         getValues,
                         value,
                         handleLoading,
                         final,
                         index,
                         rules,
                         keys,
                     }: any) => {
    const theme = useMantineTheme();
    const [opened, setOpened] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [uploadCoverImg, setUploadCoverImg] = useState("");
    const [invalid, setInvalid] = useState(false);
    const [imgSrc, setImgSrc] = useState<any>();

    const uploadImage = async (files: any) => {
        const appId: any = process.env.NEXT_PUBLIC_IMAGE_APP_ID;
        const fileType: any = process.env.NEXT_PUBLIC_IMAGE_FILE_TYPE;
        const formData = new FormData();
        formData.append("appId", appId);
        formData.append("fileType", fileType);
        formData.append("userId", "1");
        formData.append("image", files[0]);
        setIsLoading(true);
        setInvalid(false);

        try {
            const res = await fetch("https://image.ktmbees.com/storeImage", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
            setIsLoading(false);
            if (keys) {
                setValue(`${final}.${index}.${keys}`, data.Location);
            } else {
                setValue(value, data?.Location);
            }
            setUploadCoverImg(data?.Location);
            handleLoading(false);
        } catch (error) {
            setIsLoading(false);
            setInvalid(true);
            console.error("Upload failed", error);
        }
    };

    return (
        <>
            <Controller
                name={value}
                control={control}
                rules={rules || { required: "Required" }}
                defaultValue={""}
                render={() => (
                    <Dropzone
                        loading={isLoading}
                        onDrop={(files) => {
                            handleLoading(true);
                            setImgSrc(URL.createObjectURL(files[0]));
                            uploadImage(files);
                        }}
                        onReject={() => setInvalid(true)}
                        accept={IMAGE_MIME_TYPE}
                        className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-gray-500 transition-colors"
                        style={{ minHeight: 220 }}
                    >
                        <Group
                            justify="center"
                            gap="xl"
                            style={{ minHeight: 180, pointerEvents: "none", flexDirection: "column" }}
                        >
                            <CloudUpload size={50} color="#6E7191" />
                            <Text size="lg" color="#6E7191">
                                Drag image here or click to select file
                            </Text>
                            <Text size="sm" color="dimmed">
                                PNG, JPG, or GIF up to 5MB
                            </Text>
                        </Group>
                    </Dropzone>
                )}
            />

            {invalid && <div className="text-red-500 pt-2">Invalid image format!</div>}
            {!!keys && !uploadCoverImg && errors?.[final]?.[index] && (
                <div className="text-red-500 pt-2">Image is required *</div>
            )}
            {!keys && !uploadCoverImg && errors?.[value] && (
                <div className="text-red-500 pt-2">Image is required *</div>
            )}

            {/* Image Preview */}
            {(!keys && getValues(value)) || (keys && getValues(final)?.[index]?.[keys]) ? (
                <div className="relative mt-4 w-36 h-36 border rounded-lg overflow-hidden cursor-pointer hover:opacity-80">
                    <Image
                        src={keys ? getValues(`${final}.${index}.${keys}`) : getValues(value)}
                        alt="uploaded-image"
                        layout="fill"
                        objectFit="cover"
                        onClick={() => setOpened(true)}
                    />
                </div>
            ) : null}

            {/* Modal for enlarged preview */}
            <Modal opened={opened} onClose={() => setOpened(false)} centered size="xl">
                <div className="w-full h-full">
                    <Image
                        src={keys ? getValues(`${final}.${index}.${keys}`) : getValues(value)}
                        alt="uploaded-image-large"
                        layout="responsive"
                        width={1024}
                        height={1024}
                        className="rounded"
                    />
                </div>
            </Modal>
        </>
    );
};

export default ImageUpload;
