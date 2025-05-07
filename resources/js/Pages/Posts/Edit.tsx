import React, { useCallback, useEffect, useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import AuthLayout from "@novus/Layouts/AuthLayout";
import PostEditor from "@novus/Components/Post/PostEditor";
import PostExcerpt from "@novus/Components/Post/PostExcerpt";
import useRoute from "@novus/hooks/useRoute";
import useTypedPage from "@novus/hooks/useTypePage";
import { PostFormData } from "@novus/types/post";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@novus/Components/ui/alert-dialog";
import PostSettings from "@novus/Components/Post/PostSettings";
import PostHeader from "@novus/Components/Post/PostHeader";
import PostStatusBar from "@novus/Components/Post/PostStatusBar";
import FloatingActionButtons from "@novus/Components/Post/FloatingActionButtons";
import PostVisibility from "@novus/Components/Post/PostVisibility";
import { processFeaturedImageForSubmission } from "@novus/lib/mediaUtils";
import { getPostEditorClasses } from "@novus/lib/postLayoutUtils";
import { getInitialPostFormData } from "@novus/lib/postFormUtils";
import { useDistractionFreeMode } from "@novus/hooks/useDistractionFreeMode";
import { useSaveStatus } from "@novus/hooks/useSaveStatus";
import EnhancedPostSeo from "@novus/Components/PostSeo/EnhancedPostSeo";

export default function Edit() {
    const page = useTypedPage();
    const { blog_post } = page.props;
    const route = useRoute();

    if (!blog_post) {
        throw new Error("Post not found");
    }

    // Use our custom hooks effectively
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

    const [content, setContent] = useState<string>(blog_post.content);

    const { data, setData, patch, processing, errors, setError } =
        useForm<PostFormData>(
            "editPostForm",
            getInitialPostFormData(blog_post),
        );

    const handleContentChange = useCallback(
        (newContent: string) => {
            setContent(newContent);
            setData("content", newContent);

            // Reset save status when content changes after a save
            if (saveStatus === "saved") {
                startSaving();
            }

            if (errors.content) {
                setError("content", "");
            }
        },
        [saveStatus, startSaving, errors.content, setData, setError],
    );

    // Simplify handleSave to use hook's functionality
    const handleSave = (e: React.MouseEvent) => {
        e.preventDefault();
        startSaving();

        const processedData = { ...data };
        processedData.featured_image = processFeaturedImageForSubmission(
            processedData.featured_image,
        );
        processedData.content = content;

        patch(route("novus.posts.update", { post: blog_post.id }), {
            data: processedData,
            preserveScroll: true,
            onSuccess: handleSuccess,
            onError: (errors) => {
                handleError(
                    `Failed to save changes: ${Object.values(errors).join(", ")}`,
                );
            },
            preserveState: true,
        });
    };

    // Get derived classes based on distraction mode
    const classes = getPostEditorClasses(distractionFree, animating);

    return (
        <>
            <Head title="Edit Post" />
            <AuthLayout title="Edit your Post">
                <div className={classes.container}>
                    <PostHeader
                        title={data.title}
                        onToggleDistraction={toggleDistraction}
                        onSave={handleSave}
                        saveStatus={saveStatus}
                        processing={processing}
                        post_action={"update"}
                        className={classes.header}
                    />

                    <div className={classes.editorContainer}>
                        <div className={classes.contentLayout}>
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

                            <div className={classes.sidebar}>
                                <PostVisibility
                                    post={blog_post}
                                    publishStatus={
                                        data.status as "draft" | "published"
                                    }
                                    onPublishStatusChange={(status) =>
                                        setData("status", status)
                                    }
                                />

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
