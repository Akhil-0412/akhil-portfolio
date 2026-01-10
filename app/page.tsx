"use client";

import { motion } from "framer-motion";
import ResumeChooser from "../components/ResumeChooser";



export default function Home() {
  return (
    <main className="bg-black text-white">

      {/* HERO */}
      <section className="min-h-screen flex items-center justify-center px-6 py-24">
        <div className="max-w-3xl text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-bold"
          >
            Akhileshwar Sanathana
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-4 text-lg md:text-2xl font-medium bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent"
          >
            AI & Machine Learning Engineer
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-gray-400 text-base md:text-lg"
          >
            Building GenAI systems, RAG pipelines, and scalable AI-driven applications.
          </motion.p>
        </div>
      </section>

      {/* ABOUT */}
      <section className="min-h-screen flex items-center justify-center px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="max-w-3xl text-center"
        >
          <h3 className="text-2xl md:text-3xl font-semibold">
            About Me
          </h3>

          <p className="mt-6 text-gray-400 text-base md:text-lg leading-relaxed">
            I’m a performance-driven AI Engineer with a Master’s in Artificial Intelligence,
            experienced in building production-grade GenAI systems, RAG pipelines, and
            cloud-based automation solutions.
          </p>
        </motion.div>
      </section>

      {/* EXPERIENCE */}
      <section className="min-h-screen flex items-center justify-center px-6 py-24">
        <div className="max-w-4xl w-full">

          <motion.h3
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-2xl md:text-3xl font-semibold text-center"
          >
            Experience
          </motion.h3>

          <div className="mt-12 space-y-6">

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="border border-white/10 rounded-xl p-6 bg-white/5 backdrop-blur"
            >
              <h4 className="text-xl font-semibold">
                Data Engineering & Automation Intern
              </h4>
              <p className="text-sm text-gray-400 mt-1">
                BGC – Cantor Fitzgerald · London · Jan 2024 – Jul 2024
              </p>

              <ul className="mt-4 text-gray-300 space-y-2 list-disc list-inside">
                <li>Automated data workflows using PowerShell and SQL.</li>
                <li>Optimized Azure-based reporting pipelines.</li>
                <li>Translated business needs into automation solutions.</li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="border border-white/10 rounded-xl p-6 bg-white/5 backdrop-blur"
            >
              <h4 className="text-xl font-semibold">
                Digital Marketing & Analytics Intern
              </h4>
              <p className="text-sm text-gray-400 mt-1">
                PeopleLink · Hyderabad · Jun 2022 – Jul 2022
              </p>

              <ul className="mt-4 text-gray-300 space-y-2 list-disc list-inside">
                <li>Analyzed campaign performance to optimize spend.</li>
                <li>Mined datasets to identify conversion trends.</li>
                <li>Delivered data-backed insights to stakeholders.</li>
              </ul>
            </motion.div>

          </div>
        </div>
      </section>
      {/* PROJECTS */}
      <section className="min-h-screen flex items-center justify-center px-6 py-24">
        <div className="max-w-5xl w-full">

          <motion.h3
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-2xl md:text-3xl font-semibold text-center"
          >
            Projects
          </motion.h3>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Project 1 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="border border-white/10 rounded-xl p-6 bg-white/5 backdrop-blur hover:border-cyan-400/40 transition"
            >
              <h4 className="text-lg font-semibold">
                GenAI RAG Application
              </h4>

              <p className="mt-3 text-sm text-gray-400">
                Built a production-ready Retrieval-Augmented Generation pipeline
                using LangChain and Redis for semantic caching.
              </p>

              <p className="mt-4 text-xs text-cyan-400">
                LangChain · Redis · OpenRouter · Streamlit
              </p>
            </motion.div>

            {/* Project 2 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="border border-white/10 rounded-xl p-6 bg-white/5 backdrop-blur hover:border-purple-400/40 transition"
            >
              <h4 className="text-lg font-semibold">
                Medical Imaging Classification
              </h4>

              <p className="mt-3 text-sm text-gray-400">
                Developed high-accuracy CNN and Vision Transformer models
                for MRI image classification with reproducible pipelines.
              </p>

              <p className="mt-4 text-xs text-purple-400">
                TensorFlow · ResNet · ViT · MLOps
              </p>
            </motion.div>

            {/* Project 3 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="border border-white/10 rounded-xl p-6 bg-white/5 backdrop-blur hover:border-indigo-400/40 transition"
            >
              <h4 className="text-lg font-semibold">
                Audio Genre Classification
              </h4>

              <p className="mt-3 text-sm text-gray-400">
                Processed Mel-spectrograms using CNNs and LSTMs
                to automate music genre classification.
              </p>

              <p className="mt-4 text-xs text-indigo-400">
                PyTorch · CNN · LSTM · Signal Processing
              </p>
            </motion.div>

          </div>
        </div>
      </section>
      {/* SKILLS */}
      <section className="min-h-screen flex items-center justify-center px-6 py-24">
        <div className="max-w-5xl w-full">

          <motion.h3
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-2xl md:text-3xl font-semibold text-center"
          >
            Skills
          </motion.h3>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* GenAI & ML */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="border border-white/10 rounded-xl p-6 bg-white/5"
            >
              <h4 className="font-semibold mb-3 text-cyan-400">
                GenAI & Machine Learning
              </h4>
              <p className="text-gray-300 text-sm leading-relaxed">
                Python, RAG Pipelines, LangChain, LLMs, Vector Databases,
                PyTorch, TensorFlow, Conformal Prediction
              </p>
            </motion.div>

            {/* Web & DevOps */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="border border-white/10 rounded-xl p-6 bg-white/5"
            >
              <h4 className="font-semibold mb-3 text-purple-400">
                Web & DevOps
              </h4>
              <p className="text-gray-300 text-sm leading-relaxed">
                React.js, Next.js, FastAPI, Docker, CI/CD Concepts,
                Git, GitHub, REST APIs
              </p>
            </motion.div>

            {/* Data & Cloud */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="border border-white/10 rounded-xl p-6 bg-white/5"
            >
              <h4 className="font-semibold mb-3 text-indigo-400">
                Data & Cloud
              </h4>
              <p className="text-gray-300 text-sm leading-relaxed">
                SQL (Postgres, MySQL), Pandas, NumPy, Data Pipelines,
                AWS, Azure, Marketing Analytics
              </p>
            </motion.div>

          </div>
        </div>
      </section>
      {/* CONTACT */}
      <section className="min-h-screen flex items-center justify-center px-6 py-24">

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h3 className="text-2xl md:text-3xl font-semibold">
            Let’s Work Together
          </h3>

          <p className="mt-6 text-gray-400 text-base md:text-lg max-w-xl">
            Interested in AI, GenAI systems, or data-driven automation?
            Feel free to reach out or explore my work below.
          </p>

          <div className="mt-10 flex justify-center gap-6">

            <a
              href="mailto:akhileshwar008@gmail.com"
              className="px-6 py-3 rounded-full border border-white/20 hover:border-cyan-400/50 transition"
            >
              Email
            </a>

            <a
              href="https://github.com/Akhil-0412"
              target="_blank"
              className="px-6 py-3 rounded-full border border-white/20 hover:border-purple-400/50 transition"
            >
              GitHub
            </a>

            <a
              href="https://www.linkedin.com/in/akhileshwar-sanathana-21a44723b"
              target="_blank"
              className="px-6 py-3 rounded-full border border-white/20 hover:border-indigo-400/50 transition"
            >
              LinkedIn
            </a>

          </div>
          <div className="mt-16">
            <ResumeChooser />
          </div>

        </motion.div>
      </section>

    </main>

  );
}
