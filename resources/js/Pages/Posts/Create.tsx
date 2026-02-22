import React, { useCallback, useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import AuthLayout from "@novus/Layouts/AuthLayout";
import PostEditor from "@novus/Components/Post/PostEditor";
import PostSettings from "@novus/Components/Post/PostSettings";
import PostExcerpt from "@novus/Components/Post/PostExcerpt";
import useRoute from "@novus/Hooks/useRoute";
import { PostFormData } from "@novus/types/post";
import { useDistractionFreeMode } from "@novus/Hooks/useDistractionFreeMode";
import { useSaveStatus } from "@novus/Hooks/useSaveStatus";
import { getPostEditorClasses } from "@novus/lib/postLayoutUtils";
import { getInitialPostFormData } from "@novus/lib/postFormUtils";
import PostStatusBar from "@novus/Components/Post/PostStatusBar";
import FloatingActionButtons from "@novus/Components/Post/FloatingActionButtons";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@novus/Components/ui/alert-dialog";
import PostHeader from "@novus/Components/Post/PostHeader";
import EnhancedPostSeo from "@novus/Components/PostSeo/EnhancedPostSeo";

export default function Create() {
    const { distractionFree, animating, toggleDistraction } =
        useDistractionFreeMode();
    const {
        saveStatus,
        errorMessage,
        showErrorDialog,
        setShowErrorDialog,
        startSaving,
        handleSuccess,
        handleError,
    } = useSaveStatus();

    const resetSavingState = useCallback(() => {
        startSaving(); // First set to saving
        setTimeout(() => handleSuccess(), 100); // Then quickly set to saved, which will auto-reset
    }, [startSaving, handleSuccess]);

    const [content, setContent] = useState<string>("");
    const [isSaved, setIsSaved] = useState(false);
    const route = useRoute();

    const {
        data,
        setData,
        post: submitForm,
        processing,
        errors,
        setError,
    } = useForm<PostFormData>(getInitialPostFormData());

    const handleContentChange = useCallback(
        (newContent: string) => {
            setContent(newContent);
            setData("content", newContent);
            if (saveStatus === "saved") {
                startSaving();
            }
            if (errors.content) {
                setError("content", "");
            }
        },
        [saveStatus, startSaving, errors.content, setData, setError],
    );

    const handleSave = useCallback(
        (e: React.MouseEvent) => {
            e.preventDefault();
            startSaving();

            const formData = {
                ...data,
                content,
                featured_image:
                    data.featured_image &&
                    typeof data.featured_image === "object" &&
                    "id" in data.featured_image
                        ? (data.featured_image as any).id
                        : data.featured_image,
            };

            submitForm(route("novus.posts.store"), {
                data: formData,
                preserveScroll: true,
                onSuccess: () => {
                    setIsSaved(true);
                    handleSuccess();
                },
                onError: () => {
                    // Reset the saving state without showing error dialog
                    resetSavingState();
                },
                preserveState: true,
            });
        },
        [
            data,
            content,
            submitForm,
            route,
            handleSuccess,
            startSaving,
            resetSavingState,
        ],
    );

    const classes = getPostEditorClasses(distractionFree, animating);

    return (
        <>
            <Head title="Create Post" />
            <AuthLayout title="Create New Post">
                <div className={classes.container}>
                    {/* Header with breadcrumbs, title and actions */}
                    <PostHeader
                        title={data.title || "New Post"}
                        onToggleDistraction={toggleDistraction}
                        onSave={handleSave}
                        saveStatus={saveStatus}
                        processing={processing}
                        post_action="create"
                        className={classes.header}
                    />

                    <div className={classes.editorContainer}>
                        {/* Main content area */}
                        <div className={classes.contentLayout}>
                            {/* Left column - Editor */}
                            <div className={classes.editor}>
                                <div className={classes.editorInner}>
                                    <PostEditor
                                        data={data}
                                        setData={setData}
                                        errors={errors}
                                        content={content}
                                        onContentChange={handleContentChange}
                                    />
                                </div>

                                <div className={classes.extraSections}>
                                    <PostExcerpt
                                        excerpt={data.excerpt}
                                        onChange={(excerpt) =>
                                            setData("excerpt", excerpt)
                                        }
                                        error={errors.excerpt}
                                    />
                                </div>

                                <div className={classes.extraSections}>
                                    <EnhancedPostSeo
                                        data={data}
                                        setData={setData}
                                        errors={errors}
                                        showPreview={true}
                                    />
                                </div>
                            </div>

                            {/* Right Column - Settings */}
                            <div className={classes.sidebar}>
                                <PostSettings
                                    data={data}
                                    setData={setData}
                                    errors={errors}
                                    postStatus={data.status}
                                />
                            </div>
                        </div>
                    </div>

                    <FloatingActionButtons
                        visible={distractionFree}
                        onToggleDistraction={toggleDistraction}
                        onSave={handleSave}
                        saveStatus={saveStatus}
                        processing={processing}
                    />

                    <PostStatusBar saveStatus={saveStatus} />
                </div>
            </AuthLayout>

            <AlertDialog
                open={showErrorDialog}
                onOpenChange={setShowErrorDialog}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Error</AlertDialogTitle>
                        <AlertDialogDescription>
                            {errorMessage}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogAction>Ok</AlertDialogAction>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
