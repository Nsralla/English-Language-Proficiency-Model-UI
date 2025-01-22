import "./Welcome.css";
import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

const Welcome = () => {
  const controls = useAnimation();
  const { ref, inView } = useInView({
    threshold: 0.5, // Adjust the threshold to determine when animation starts
    triggerOnce: true, // Trigger only once when the section is in view
  });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    } else {
      controls.start("hidden");
    }
  }, [controls, inView]);

  return (
    <section ref={ref} className="welcome-section">
      <motion.div
        className="text-section"
        initial="hidden"
        animate={controls}
        variants={{
          hidden: { opacity: 0, y: -50 },
          visible: { opacity: 1, y: 0 },
        }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <p className="vision-text">VISION</p>
        <h2 className="main-heading">
          Revolutionizing How English Proficiency is Measured
        </h2>
        <p className="description">
          Master English with our personalized assessments and insights.
          Understand your proficiency level and take charge of your learning
          journey. Join us to unlock your potential and connect with the world.
        </p>
      </motion.div>

      <motion.div
        initial="hidden"
        animate={controls}
        variants={{
          hidden: { opacity: 0, y: -50 },
          visible: { opacity: 1, y: 0 },
        }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        <dotlottie-player
          src="https://lottie.host/2517ef4b-9e9f-4d72-90bc-ee2dfef19d3c/QBHpwiu2cg.json"
          background="transparent"
          speed="1"
          style={{
            width: "22.75rem",
            height: "22.75rem",
          }}
          loop
          autoplay
        ></dotlottie-player>
      </motion.div>
    </section>
  );
};

export default Welcome;
