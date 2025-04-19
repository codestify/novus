import React from "react";
import { Head } from "@inertiajs/react";

export default function Welcome() {
    return (
        <>
            <Head title="Welcome" />
            <div className="min-h-screen bg-white">
                <div className="py-12">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="overflow-hidden shadow-sm rounded-lg">
                            <div className="p-6 text-gray-800">
                                Welcome to Novus Package
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
