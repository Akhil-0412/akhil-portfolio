"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileDown, CheckCircle } from "lucide-react";

export default function ResumeChooser() {
    const [downloaded, setDownloaded] = useState(false);

    const handleDownload = () => {
        setDownloaded(true);
        setTimeout(() => setDownloaded(false), 3000);
    };

    return (
        <div className="flex justify-center">
            <AnimatePresence mode="wait">
                {!downloaded ? (
                    <motion.a
                        key="download"
                        href="/resumes/akhileshwar-sanathana.pdf"
                        download
                        onClick={handleDownload}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="
              flex items-center gap-3 
              px-8 py-4 
              rounded-full 
              bg-white text-black 
              font-semibold text-lg
              shadow-[0_0_20px_rgba(255,255,255,0.3)]
              hover:shadow-[0_0_30px_rgba(255,255,255,0.5)]
              transition-all duration-300
            "
                    >
                        <FileDown className="w-5 h-5" />
                        Download Resume
                    </motion.a>
                ) : (
                    <motion.div
                        key="success"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="
              flex items-center gap-3 
              px-8 py-4 
              rounded-full 
              bg-green-500/20 text-green-400 
              border border-green-500/30
              font-medium text-lg
            "
                    >
                        <CheckCircle className="w-5 h-5" />
                        Downloaded Successfully
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
