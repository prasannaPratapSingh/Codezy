import { Bug, X } from "lucide-react";
import { useState } from "react";
import emailjs from "@emailjs/browser";

// Initialize EmailJS (use env in prod)
emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);

const ReportBug = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [bug, setBug] = useState("");
    const [sent, setSent] = useState(false);

    const sendBug = () => {
        if (!bug.trim()) return;

        emailjs.send(import.meta.env.VITE_EMAILJS_SERVICE_KEY, import.meta.env.VITE_EMAILJS_TEMPLATE_KEY, {
            bug,
            page: window.location.href,
            time: new Date().toLocaleString(),
        });

        setSent(true);
        setBug("");

        setTimeout(() => {
            setSent(false);
            setIsOpen(false);
        }, 1000);
    };

    return (
        <>
            {/* Floating Report Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-blue-950 px-4 py-2 text-sm font-medium text-white shadow-lg transition hover:bg-blue-900"
            >
                <Bug size={18} />
                <span className="hidden sm:inline">Report Bug</span>
            </button>

            {/* Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-sm p-4 sm:items-center">
                    <div className="w-full max-w-md rounded-xl border border-blue-950 bg-[#050b18] p-4 shadow-2xl sm:p-6">

                        {/* Header */}
                        <div className="mb-3 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-white">
                                🐞 Report a Bug
                            </h2>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-gray-400 transition hover:text-white"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Textarea */}
                        <textarea
                            value={bug}
                            onChange={(e) => setBug(e.target.value)}
                            placeholder="What happened? What did you expect instead?"
                            maxLength={1000}
                            className="h-28 w-full resize-none rounded-lg bg-black/60 p-3 text-sm text-white placeholder-gray-500 outline-none ring-1 ring-blue-950 transition focus:ring-2 focus:ring-blue-700"
                        />

                        {/* Footer */}
                        <div className="mt-4 flex items-center justify-between">
                            <span className="text-xs text-gray-500">
                                {bug.length}/1000
                            </span>
                            <button
                                onClick={sendBug}
                                disabled={sent}
                                className="rounded-lg bg-blue-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:opacity-50"
                            >
                                {sent ? "Sent ✅" : "Send"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ReportBug;
