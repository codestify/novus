export const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
        month: "short",
        day: "numeric",
    });
};

export const formatDateWithDay = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};

export const formatXAxisTick = (dateString: string, data: any) => {
    // For responsive display, show fewer x-axis labels on smaller screens
    const date = new Date(dateString);
    // Only show every nth date depending on the data length
    if (data.length > 30) {
        // For longer periods, show every 5th date
        const day = date.getDate();
        if (day % 5 !== 0) return "";
        return date.toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
        });
    } else if (data.length > 14) {
        // For medium periods, show every 3rd date
        const day = date.getDate();
        if (day % 3 !== 0) return "";
        return date.toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
        });
    }
    // For shorter periods, show all dates
    return date.toLocaleDateString("en-GB", { day: "numeric" });
};
