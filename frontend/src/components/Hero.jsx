// Premium hero section for the home page.

import React from "react";
import { Button } from "./ui/button";
import { motion as Motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function Hero() {
    const navigate = useNavigate();
    return (
        <section className="relative overflow-hidden pb-10 pt-28">
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -top-24 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />
                <div className="absolute -right-24 top-32 h-[320px] w-[320px] rounded-full bg-indigo-400/10 blur-3xl dark:bg-indigo-300/10" />
                <div className="absolute -left-24 top-44 h-[320px] w-[320px] rounded-full bg-violet-400/10 blur-3xl dark:bg-violet-300/10" />
            </div>

            <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-4 md:grid-cols-2">
                <Motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                >
                    <p className="mb-4 inline-flex rounded-full border border-border bg-card/60 px-3 py-1 text-sm text-muted-foreground backdrop-blur">
                        Premium deals • Fast delivery • Secure checkout
                    </p>
                    <h1 className="text-balance text-4xl font-semibold tracking-tight md:text-6xl">
                        Elevate your everyday with modern electronics.
                    </h1>
                    <p className="mt-4 max-w-xl text-pretty text-base text-muted-foreground md:text-lg">
                        Discover curated devices, accessories, and essentials—designed for performance, built for style.
                    </p>
                    <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                        <Button size="lg" onClick={() => navigate("/products")}>
                            Shop the collection
                        </Button>
                        <Button size="lg" variant="outline" onClick={() => navigate("/products")}>
                            Explore deals
                        </Button>
                    </div>
                </Motion.div>

                <Motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, ease: "easeOut", delay: 0.05 }}
                    className="relative"
                >
                    <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br from-primary/10 via-transparent to-indigo-400/10 blur-2xl" />
                    <img
                        src="/ekart-hero1.png"
                        alt="Premium products"
                        width={640}
                        height={640}
                        className="w-full rounded-3xl border border-border/60 bg-card/60 object-cover shadow-[0_20px_60px_-35px_rgba(0,0,0,0.35)]"
                    />
                </Motion.div>
            </div>
        </section>
    )
}

export default Hero