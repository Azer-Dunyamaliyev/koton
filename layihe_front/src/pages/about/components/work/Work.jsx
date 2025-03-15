import React from "react";
import styles from "./work.module.scss";
const Work = () => {
  return (
    <div className={styles.work}>
      <div className={styles.content}>
        <div className={styles.image}></div>
        <div className={styles.texts}>
          <h3>Work with us</h3>
          <p>
            We are always looking for people who love to learn and who believe
            in what they are doing, who have the right attitude. The Koton
            corporate culture is based on team work, open communication and high
            standards. These principles are the basis of our personal commitment
            with the task of focusing on our clients' satisfaction.
          </p>
          <p>
            Koton offers their employees a dynamic and international environment
            where their ideas are valued and internal promotion is a reality. A
            great percentage of the management team began working in the stores.
            We also believe in employee stability and continuous training.
            Interested in working with us? What are you waiting for!
          </p>
          <p>
            If you wish to find out about all our job offers both in central
            services and in stores, or if you would simply like to send us your
            curriculum vitae,
          </p>
        </div>
      </div>
    </div>
  );
};

export default Work;
